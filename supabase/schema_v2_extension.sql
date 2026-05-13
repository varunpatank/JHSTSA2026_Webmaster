-- ═══════════════════════════════════════════════════════════════════════════
-- ClubConnect — Schema V2 Extension
-- Run this AFTER combined_schema.sql (or paste both together for a fresh DB).
-- Every statement uses IF NOT EXISTS / DROP…IF EXISTS for safe re-runs.
-- Fully compatible with the existing api.ts query patterns.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 1 ─ PROFILES: add role + full_name alias
--   api.ts uses profiles(name, avatar_url) — we keep `name`.
--   `full_name` is a generated column so both names work interchangeably.
--   `role` supports 'user' | 'judge' | 'admin' per the auth requirements.
-- ─────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS role            varchar(20)  NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'judge', 'admin')),
    ADD COLUMN IF NOT EXISTS full_name       text
        GENERATED ALWAYS AS (name) STORED,  -- alias; drop if Postgres version < 12
    ADD COLUMN IF NOT EXISTS updated_at      timestamptz;

-- Index for quick judge/admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 2 ─ RESOURCES: add stage + subject filtering columns
--   The resources page filters by stage (e.g. "Proposal", "Active"),
--   subject (e.g. "STEM", "Arts"), and the existing `category`.
-- ─────────────────────────────────────────────────────────────────────────

ALTER TABLE public.resources
    ADD COLUMN IF NOT EXISTS stage           varchar(60),
    ADD COLUMN IF NOT EXISTS subject         varchar(100),
    ADD COLUMN IF NOT EXISTS updated_at      timestamptz;
-- Note: `name` = resource title, `resource_link` = resource URL, `created_by` = uploaded_by
-- These existing columns are used directly in views/queries rather than adding alias columns.

-- Indexes for common filter patterns
CREATE INDEX IF NOT EXISTS idx_resources_stage   ON resources(stage);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON resources(subject);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 3 ─ RESOURCE FEEDBACK
--   Users can comment + leave 1-5 star ratings on any resource.
--   Average rating exposed via view + SQL function.
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.resource_feedback (
    id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id uuid         NOT NULL REFERENCES resources(id)  ON DELETE CASCADE,
    user_id     uuid         NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
    comment     text,
    rating      smallint     CHECK (rating BETWEEN 1 AND 5),
    created_at  timestamptz  NOT NULL DEFAULT now(),
    updated_at  timestamptz,
    UNIQUE (resource_id, user_id)   -- one review per user per resource
);

CREATE INDEX IF NOT EXISTS idx_resource_feedback_resource ON resource_feedback(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_feedback_user     ON resource_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_feedback_rating   ON resource_feedback(rating);

-- RLS
ALTER TABLE public.resource_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rf_select ON resource_feedback;
CREATE POLICY rf_select ON resource_feedback FOR SELECT USING (true);

DROP POLICY IF EXISTS rf_insert ON resource_feedback;
CREATE POLICY rf_insert ON resource_feedback FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS rf_update ON resource_feedback;
CREATE POLICY rf_update ON resource_feedback FOR UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS rf_delete ON resource_feedback;
CREATE POLICY rf_delete ON resource_feedback FOR DELETE
    USING (auth.uid() = user_id);

-- Helper: updated_at auto-stamp for resource_feedback
CREATE OR REPLACE FUNCTION public.set_resource_feedback_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_rf_updated_at ON resource_feedback;
CREATE TRIGGER trg_rf_updated_at
    BEFORE UPDATE ON resource_feedback
    FOR EACH ROW EXECUTE FUNCTION public.set_resource_feedback_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 4 ─ EVENTS: normalise fields so portal queries work uniformly
--   Existing `events` table uses `name` for title and `time` for date.
--   We add generated aliases + explicit event_date/location columns so the
--   portal can query: title, event_date, location, image_url, created_by.
-- ─────────────────────────────────────────────────────────────────────────

ALTER TABLE public.events
    ADD COLUMN IF NOT EXISTS title      varchar(512)
        GENERATED ALWAYS AS (name) STORED,
    ADD COLUMN IF NOT EXISTS event_date timestamptz
        GENERATED ALWAYS AS ("time") STORED,
    ADD COLUMN IF NOT EXISTS location   text
        GENERATED ALWAYS AS (location_text) STORED,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 5 ─ CLUBS / ORGANIZATIONS normalisation
--   The app uses `organizations` internally; portal pages expect
--   owner_id (alias for created_by) and logo_url (already exists).
-- ─────────────────────────────────────────────────────────────────────────

ALTER TABLE public.organizations
    ADD COLUMN IF NOT EXISTS owner_id   uuid
        GENERATED ALWAYS AS (created_by) STORED,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 6 ─ updated_at TRIGGERS for all major tables
--   A single generic function stamps `updated_at = now()` on every UPDATE.
-- ─────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END; $$;

-- Apply to each table that has updated_at
DO $trig$
DECLARE
    t text;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'profiles', 'organizations', 'events',
        'resources', 'comments', 'discussions', 'announcements'
    ] LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON %1$s;
             CREATE TRIGGER trg_%1$s_updated_at
                 BEFORE UPDATE ON %1$s
                 FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();',
            t
        );
    END LOOP;
END;
$trig$;

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 7 ─ JUDGE SUPPORT
--   Judges can log in via the normal auth flow; their profile.role = 'judge'.
--   Helper functions let policies grant extra read access to judges.
-- ─────────────────────────────────────────────────────────────────────────

-- Returns true when the current session belongs to a judge
CREATE OR REPLACE FUNCTION public.is_judge()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'judge'
    );
$$;

-- Returns true when the current session belongs to an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    );
$$;

REVOKE ALL ON FUNCTION public.is_judge() FROM public;
REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_judge() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 8 ─ JUDGE TABLE (optional richer judge records)
--   Extends profiles for judge-specific metadata (assigned categories, etc.)
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.judge_profiles (
    id                  uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_categories text[]           DEFAULT '{}',
    max_clubs           integer          DEFAULT 10,
    scoring_rubric      jsonb            DEFAULT '{}',
    notes               text,
    is_active           boolean          NOT NULL DEFAULT true,
    created_at          timestamptz      NOT NULL DEFAULT now()
);

ALTER TABLE public.judge_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS judge_profiles_select ON judge_profiles;
CREATE POLICY judge_profiles_select ON judge_profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS judge_profiles_insert ON judge_profiles;
CREATE POLICY judge_profiles_insert ON judge_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS judge_profiles_update ON judge_profiles;
CREATE POLICY judge_profiles_update ON judge_profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 9 ─ JUDGE SCORES (judges rating clubs / proposals)
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.judge_scores (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    judge_id    uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id      uuid        REFERENCES organizations(id) ON DELETE CASCADE,
    proposal_id uuid        REFERENCES club_proposals(id) ON DELETE CASCADE,
    score       numeric(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
    breakdown   jsonb       DEFAULT '{}',  -- e.g. {innovation:20, impact:25, ...}
    feedback    text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz,
    CONSTRAINT judge_scores_one_target CHECK (
        ((org_id IS NOT NULL)::integer + (proposal_id IS NOT NULL)::integer) = 1
    )
);

CREATE INDEX IF NOT EXISTS idx_judge_scores_judge    ON judge_scores(judge_id);
CREATE INDEX IF NOT EXISTS idx_judge_scores_org      ON judge_scores(org_id);
CREATE INDEX IF NOT EXISTS idx_judge_scores_proposal ON judge_scores(proposal_id);

ALTER TABLE public.judge_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS judge_scores_select ON judge_scores;
CREATE POLICY judge_scores_select ON judge_scores FOR SELECT
    USING (public.is_judge() OR public.is_admin());

DROP POLICY IF EXISTS judge_scores_insert ON judge_scores;
CREATE POLICY judge_scores_insert ON judge_scores FOR INSERT
    WITH CHECK (auth.uid() = judge_id AND public.is_judge());

DROP POLICY IF EXISTS judge_scores_update ON judge_scores;
CREATE POLICY judge_scores_update ON judge_scores FOR UPDATE
    USING (auth.uid() = judge_id AND public.is_judge());

DROP TRIGGER IF EXISTS trg_judge_scores_updated_at ON judge_scores;
CREATE TRIGGER trg_judge_scores_updated_at
    BEFORE UPDATE ON judge_scores
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 10 ─ PORTAL VIEWS
--   Frontend queries these views directly for the dashboard/portal.
--   Each view is named to match what the portal pages expect.
-- ─────────────────────────────────────────────────────────────────────────

-- 10a. portal_my_clubs
--   Returns clubs the current user CREATED (they are the owner/admin).
--   Usage: supabase.from('portal_my_clubs').select('*')
CREATE OR REPLACE VIEW public.portal_my_clubs
WITH (security_invoker = true)
AS
SELECT
    o.id,
    o.name,
    o.slug,
    o.description,
    o.category,
    o.logo_url,
    o.banner_url,
    o.is_published,
    o.is_featured,
    o.is_active,
    o.member_count,
    o.tags,
    o.advisor_name,
    o.contact_email,
    o.website,
    o.meeting_schedule,
    o.meeting_location,
    o.created_by   AS owner_id,
    o.created_at,
    o.updated_at,
    (SELECT count(*) FROM announcements a WHERE a.org_id = o.id) AS announcements_count,
    (SELECT count(*) FROM events       e WHERE e.org_id = o.id) AS events_count,
    (SELECT count(*) FROM resources    r WHERE r.org_id = o.id) AS resources_count,
    (SELECT count(*) FROM discussions  d WHERE d.org_id = o.id) AS discussions_count
FROM organizations o
WHERE o.created_by = auth.uid();

-- 10b. portal_joined_clubs
--   Returns clubs the current user has JOINED (as a member, not necessarily owner).
--   Usage: supabase.from('portal_joined_clubs').select('*')
CREATE OR REPLACE VIEW public.portal_joined_clubs
WITH (security_invoker = true)
AS
SELECT
    o.id,
    o.name,
    o.slug,
    o.description,
    o.category,
    o.logo_url,
    o.banner_url,
    o.is_featured,
    o.member_count,
    o.tags,
    m.user_permissions AS my_role,
    m.position         AS my_position,
    m.joined_at,
    o.created_by       AS owner_id
FROM memberships m
JOIN organizations o ON o.id = m.org_id
WHERE m.user_id = auth.uid()
  AND m.is_approved = true;

-- 10c. portal_upcoming_events
--   Events the current user has REGISTERED for that haven't happened yet.
--   Usage: supabase.from('portal_upcoming_events').select('*')
CREATE OR REPLACE VIEW public.portal_upcoming_events
WITH (security_invoker = true)
AS
SELECT
    e.id,
    e.name                   AS title,
    e.description,
    e.time                   AS event_date,
    e.location_text          AS location,
    e.image_url,
    e.category,
    e.is_public,
    e.requires_rsvp,
    e.max_attendees,
    e.current_attendees,
    e.org_id,
    o.name                   AS org_name,
    o.logo_url               AS org_logo,
    er.status                AS registration_status,
    er.registered_at,
    e.created_by,
    e.created_at
FROM event_registrations er
JOIN events e         ON e.id = er.event_id
LEFT JOIN organizations o ON o.id = e.org_id
WHERE er.user_id  = auth.uid()
  AND er.status  IN ('registered', 'waitlisted')
  AND (e.time IS NULL OR e.time >= now())
ORDER BY e.time ASC NULLS LAST;

-- 10d. portal_my_resources
--   Resources uploaded/created by the current user.
--   Usage: supabase.from('portal_my_resources').select('*')
CREATE OR REPLACE VIEW public.portal_my_resources
WITH (security_invoker = true)
AS
SELECT
    r.id,
    r.name          AS title,
    r.description,
    r.resource_link AS resource_url,
    r.category,
    r.stage,
    r.subject,
    r.type,
    r.is_featured,
    r.downloads,
    r.file_size,
    r.format,
    r.org_id,
    o.name          AS org_name,
    r.created_by    AS uploaded_by,
    r.created_at,
    r.updated_at,
    (SELECT count(*)          FROM resource_feedback rf  WHERE rf.resource_id = r.id) AS feedback_count,
    (SELECT round(avg(rating)::numeric, 1) FROM resource_feedback rf WHERE rf.resource_id = r.id AND rf.rating IS NOT NULL) AS avg_rating
FROM resources r
LEFT JOIN organizations o ON o.id = r.org_id
WHERE r.created_by = auth.uid()
ORDER BY r.created_at DESC;

-- 10e. portal_activity
--   Combined activity feed for the current user's portal (last 50 actions).
--   Usage: supabase.from('portal_activity').select('*')
CREATE OR REPLACE VIEW public.portal_activity
WITH (security_invoker = true)
AS
SELECT
    id,
    action,
    target_type,
    target_id,
    org_id,
    metadata,
    created_at
FROM activity_log
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 50;

-- 10f. resources_with_ratings (public, useful for resources page filtering)
--   Usage: supabase.from('resources_with_ratings').select('*').eq('stage', 'Proposal')
CREATE OR REPLACE VIEW public.resources_with_ratings AS
SELECT
    r.id,
    r.name          AS title,
    r.description,
    r.resource_link AS resource_url,
    r.category,
    r.stage,
    r.subject,
    r.type,
    r.is_featured,
    r.downloads,
    r.file_size,
    r.format,
    r.org_id,
    o.name          AS org_name,
    p.name          AS author_name,
    p.avatar_url    AS author_avatar,
    r.created_by,
    r.created_at,
    (SELECT count(*)                                           FROM resource_feedback rf WHERE rf.resource_id = r.id)                               AS feedback_count,
    (SELECT round(avg(rf.rating)::numeric, 1)                 FROM resource_feedback rf WHERE rf.resource_id = r.id AND rf.rating IS NOT NULL)      AS avg_rating,
    (SELECT count(*)                                           FROM resource_feedback rf WHERE rf.resource_id = r.id AND rf.rating IS NOT NULL)      AS rating_count
FROM resources r
LEFT JOIN profiles     p ON p.id = r.created_by
LEFT JOIN organizations o ON o.id = r.org_id;

-- 10g. club_directory_full (enriched public directory used by /directory page)
CREATE OR REPLACE VIEW public.club_directory_full AS
SELECT
    o.id,
    o.name,
    o.slug,
    o.description,
    o.category,
    o.logo_url,
    o.banner_url,
    o.website,
    o.meeting_schedule,
    o.meeting_location,
    o.advisor_name,
    o.contact_email,
    o.member_count,
    o.founded_date,
    o.tags,
    o.is_featured,
    o.created_by   AS owner_id,
    p.name         AS owner_name,
    o.created_at,
    (SELECT count(*) FROM events       e WHERE e.org_id = o.id)             AS events_count,
    (SELECT count(*) FROM resources    r WHERE r.org_id = o.id)             AS resources_count,
    (SELECT round(avg(score)::numeric, 1) FROM judge_scores js WHERE js.org_id = o.id) AS judge_avg_score
FROM organizations o
LEFT JOIN profiles p ON p.id = o.created_by
WHERE o.is_published = true
  AND o.is_active    = true;

-- 10h. event_feed (public events list used by /events page)
CREATE OR REPLACE VIEW public.event_feed AS
SELECT
    e.id,
    e.name          AS title,
    e.description,
    e.time          AS event_date,
    e.location_text AS location,
    e.image_url,
    e.category,
    e.is_public,
    e.requires_rsvp,
    e.max_attendees,
    e.current_attendees,
    e.is_featured,
    e.org_id,
    o.name          AS org_name,
    o.logo_url      AS org_logo,
    p.name          AS created_by_name,
    e.created_by,
    e.created_at,
    (e.max_attendees IS NOT NULL AND e.current_attendees >= e.max_attendees) AS is_full
FROM events e
LEFT JOIN organizations o ON o.id = e.org_id
LEFT JOIN profiles      p ON p.id = e.created_by
WHERE e.is_public = true
ORDER BY e.time ASC NULLS LAST;

-- 10i. judge_dashboard (only visible to judges/admins)
CREATE OR REPLACE VIEW public.judge_dashboard
WITH (security_invoker = true)
AS
SELECT
    o.id            AS club_id,
    o.name          AS club_name,
    o.slug,
    o.category,
    o.logo_url,
    o.member_count,
    o.is_featured,
    o.created_at    AS founded_at,
    js.score        AS my_score,
    js.feedback     AS my_feedback,
    js.breakdown    AS my_breakdown,
    js.updated_at   AS scored_at,
    (SELECT round(avg(score)::numeric, 1) FROM judge_scores j2 WHERE j2.org_id = o.id) AS avg_score
FROM organizations o
LEFT JOIN judge_scores js ON js.org_id = o.id AND js.judge_id = auth.uid()
WHERE o.is_published = true;

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 11 ─ HELPER SQL FUNCTIONS for frontend queries
-- ─────────────────────────────────────────────────────────────────────────

-- Returns average rating for a resource
CREATE OR REPLACE FUNCTION public.resource_avg_rating(p_resource_id uuid)
RETURNS numeric
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT round(avg(rating)::numeric, 1)
    FROM resource_feedback
    WHERE resource_id = p_resource_id AND rating IS NOT NULL;
$$;

-- Returns count of registrations for an event
CREATE OR REPLACE FUNCTION public.event_registration_count(p_event_id uuid)
RETURNS bigint
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT count(*) FROM event_registrations
    WHERE event_id = p_event_id AND status IN ('registered', 'attended');
$$;

-- Returns whether the current user is registered for an event
CREATE OR REPLACE FUNCTION public.is_registered_for_event(p_event_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM event_registrations
        WHERE event_id = p_event_id
          AND user_id  = auth.uid()
          AND status  IN ('registered', 'attended', 'waitlisted')
    );
$$;

-- Returns whether the current user is a member of an org
CREATE OR REPLACE FUNCTION public.is_org_member(p_org_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM memberships
        WHERE org_id = p_org_id AND user_id = auth.uid() AND is_approved = true
    );
$$;

GRANT EXECUTE ON FUNCTION public.resource_avg_rating(uuid)           TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.event_registration_count(uuid)      TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_registered_for_event(uuid)       TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid)                 TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 12 ─ AUTO-CREATE PROFILE TRIGGER (updated to include role)
--   Replaces the existing handle_new_user trigger so new users get a role.
--   Judge accounts: pass role='judge' in the signup metadata.
-- ─────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    meta   jsonb;
    u_role varchar(20);
BEGIN
    meta   := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
    u_role := COALESCE(meta->>'role', 'user');
    -- Safety: only allow valid roles from metadata
    IF u_role NOT IN ('user', 'judge') THEN
        u_role := 'user';
    END IF;

    INSERT INTO public.profiles (
        id, email, name, grade, school, is_adult,
        bio, phone_number, role
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(meta->>'name', split_part(NEW.email, '@', 1)),
        meta->>'grade',
        meta->>'school',
        COALESCE((meta->>'is_adult')::boolean, false),
        meta->>'bio',
        meta->>'phone_number',
        u_role
    )
    ON CONFLICT (id) DO UPDATE SET
        name     = EXCLUDED.name,
        grade    = EXCLUDED.grade,
        school   = EXCLUDED.school,
        is_adult = EXCLUDED.is_adult,
        role     = CASE
                       WHEN profiles.role = 'admin' THEN 'admin'  -- never downgrade admins
                       ELSE EXCLUDED.role
                   END;

    -- If signing up as a judge, also insert a judge_profiles row
    IF u_role = 'judge' THEN
        INSERT INTO public.judge_profiles (id)
        VALUES (NEW.id)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 13 ─ COMMUNITY FEED PERSISTENCE
--   The community/social page stores posts in `uploads` (files) and
--   `discussions` (text posts) via the existing API.
--   This section adds the `community_posts` table for the Social Hub feed
--   so posts survive page refreshes — supplements localStorage.
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_posts (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id     uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content       text        NOT NULL,
    post_type     varchar(30) NOT NULL DEFAULT 'text'
        CHECK (post_type IN ('text', 'resource', 'image', 'achievement', 'discussion')),
    file_name     text,
    file_size     text,
    file_url      text,
    club_tag      varchar(100),
    likes         integer     NOT NULL DEFAULT 0,
    is_pinned     boolean     NOT NULL DEFAULT false,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz
);

CREATE INDEX IF NOT EXISTS idx_community_posts_author   ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_type     ON community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_created  ON community_posts(created_at DESC);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cp_select ON community_posts;
CREATE POLICY cp_select ON community_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS cp_insert ON community_posts;
CREATE POLICY cp_insert ON community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS cp_update ON community_posts;
CREATE POLICY cp_update ON community_posts FOR UPDATE
    USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS cp_delete ON community_posts;
CREATE POLICY cp_delete ON community_posts FOR DELETE USING (auth.uid() = author_id);

-- Replies to community posts
CREATE TABLE IF NOT EXISTS public.community_post_replies (
    id       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id  uuid        NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    author_id uuid       NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content  text        NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cpr_post   ON community_post_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_cpr_author ON community_post_replies(author_id);

ALTER TABLE public.community_post_replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cpr_select ON community_post_replies;
CREATE POLICY cpr_select ON community_post_replies FOR SELECT USING (true);

DROP POLICY IF EXISTS cpr_insert ON community_post_replies;
CREATE POLICY cpr_insert ON community_post_replies FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS cpr_delete ON community_post_replies;
CREATE POLICY cpr_delete ON community_post_replies FOR DELETE USING (auth.uid() = author_id);

-- Post likes
CREATE TABLE IF NOT EXISTS public.community_post_likes (
    post_id    uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id    uuid NOT NULL REFERENCES profiles(id)        ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, user_id)
);

ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cpl_select ON community_post_likes;
CREATE POLICY cpl_select ON community_post_likes FOR SELECT USING (true);
DROP POLICY IF EXISTS cpl_insert ON community_post_likes;
CREATE POLICY cpl_insert ON community_post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS cpl_delete ON community_post_likes;
CREATE POLICY cpl_delete ON community_post_likes FOR DELETE USING (auth.uid() = user_id);

-- Auto-sync likes count on community_posts
CREATE OR REPLACE FUNCTION public.sync_community_post_likes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target_id uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN target_id := OLD.post_id;
    ELSE target_id := NEW.post_id; END IF;
    UPDATE community_posts SET likes = (
        SELECT count(*) FROM community_post_likes WHERE post_id = target_id
    ) WHERE id = target_id;
    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END; $$;

DROP TRIGGER IF EXISTS trg_sync_cp_likes ON community_post_likes;
CREATE TRIGGER trg_sync_cp_likes
    AFTER INSERT OR DELETE ON community_post_likes
    FOR EACH ROW EXECUTE FUNCTION public.sync_community_post_likes();

-- updated_at for community_posts
DROP TRIGGER IF EXISTS trg_cp_updated_at ON community_posts;
CREATE TRIGGER trg_cp_updated_at
    BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Realtime for community feed
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE community_posts;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE community_post_replies;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 14 ─ COMMUNITY FEED VIEW (enriched, ready for Social Hub page)
--   Usage: supabase.from('social_feed').select('*').order('created_at', {ascending: false})
-- ─────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public.social_feed AS
SELECT
    cp.id,
    cp.author_id,
    p.name          AS author_name,
    p.avatar_url    AS author_avatar,
    cp.content,
    cp.post_type    AS type,
    cp.file_name,
    cp.file_size,
    cp.file_url,
    cp.club_tag,
    cp.likes,
    cp.is_pinned,
    cp.created_at,
    cp.updated_at,
    (SELECT count(*) FROM community_post_replies cpr WHERE cpr.post_id = cp.id) AS reply_count
FROM community_posts cp
JOIN profiles p ON p.id = cp.author_id
ORDER BY cp.is_pinned DESC, cp.created_at DESC;

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 15 ─ STORAGE BUCKETS (club-logos + resource-files)
-- ─────────────────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('club-logos', 'club-logos', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
    CREATE POLICY club_logos_public_read ON storage.objects
        FOR SELECT USING (bucket_id = 'club-logos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY club_logos_auth_write ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'club-logos' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY club_logos_owner_delete ON storage.objects
        FOR DELETE USING (bucket_id = 'club-logos' AND owner = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resource-files', 'resource-files', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
    CREATE POLICY resource_files_public_read ON storage.objects
        FOR SELECT USING (bucket_id = 'resource-files');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY resource_files_auth_write ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'resource-files' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY resource_files_owner_delete ON storage.objects
        FOR DELETE USING (bucket_id = 'resource-files' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 16 ─ SAMPLE FRONTEND QUERIES (comments — not executed)
-- ─────────────────────────────────────────────────────────────────────────
/*
-- Portal: my clubs (created by me)
SELECT * FROM portal_my_clubs;

-- Portal: joined clubs
SELECT * FROM portal_joined_clubs;

-- Portal: my upcoming events
SELECT * FROM portal_upcoming_events;

-- Portal: my uploaded resources with avg rating
SELECT * FROM portal_my_resources;

-- Portal: activity log
SELECT * FROM portal_activity;

-- Social Hub feed (all posts, newest first)
SELECT * FROM social_feed ORDER BY is_pinned DESC, created_at DESC LIMIT 20;

-- Social Hub feed – filtered by type
SELECT * FROM social_feed WHERE type = 'resource' LIMIT 20;

-- Resource page: all resources with ratings, filtered by stage
SELECT * FROM resources_with_ratings WHERE stage = 'Proposal' ORDER BY avg_rating DESC;

-- Resource page: filtered by subject
SELECT * FROM resources_with_ratings WHERE subject = 'STEM';

-- Resource page: get feedback for a specific resource
SELECT rf.*, p.name AS reviewer_name, p.avatar_url
FROM resource_feedback rf
JOIN profiles p ON p.id = rf.user_id
WHERE rf.resource_id = '<resource-uuid>'
ORDER BY rf.created_at DESC;

-- Events page: public upcoming events
SELECT * FROM event_feed WHERE event_date >= now() ORDER BY event_date ASC;

-- Directory: public clubs
SELECT * FROM club_directory_full ORDER BY is_featured DESC, member_count DESC;

-- Check if current user is registered for an event
SELECT is_registered_for_event('<event-uuid>');

-- Get average rating for a resource
SELECT resource_avg_rating('<resource-uuid>');

-- Judge dashboard (only works for judge-role users)
SELECT * FROM judge_dashboard ORDER BY avg_score DESC NULLS LAST;

-- Create a community post (via api.ts)
-- supabase.from('community_posts').insert({ author_id: uid, content: text, post_type: 'discussion', club_tag: 'TSA' })

-- Like a community post
-- supabase.from('community_post_likes').insert({ post_id: id, user_id: uid })

-- Submit resource feedback
-- supabase.from('resource_feedback').upsert({ resource_id, user_id: uid, comment, rating }, { onConflict: 'resource_id,user_id' })

-- Register for an event
-- supabase.from('event_registrations').upsert({ event_id, user_id: uid }, { onConflict: 'event_id,user_id' })

-- Join a club
-- supabase.from('memberships').upsert({ org_id, user_id: uid }, { onConflict: 'org_id,user_id' })

-- Create a club (org)
-- supabase.from('organizations').insert({ name, description, category, created_by: uid, logo_url, is_published: true })
*/

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 16b ─ SUCCESS STORIES
--   The community/stories tab writes to this table when a user submits a
--   club achievement or success story. Stories are publicly readable.
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.success_stories (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id   uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title       text        NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 300),
    content     text        NOT NULL CHECK (char_length(content) >= 1),
    club_name   text,
    image_url   text,
    tag         text        NOT NULL DEFAULT 'Story',
    is_featured boolean     NOT NULL DEFAULT false,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz
);

CREATE INDEX IF NOT EXISTS idx_success_stories_author   ON success_stories(author_id);
CREATE INDEX IF NOT EXISTS idx_success_stories_featured ON success_stories(is_featured);
CREATE INDEX IF NOT EXISTS idx_success_stories_created  ON success_stories(created_at DESC);

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ss_select ON success_stories;
CREATE POLICY ss_select ON success_stories FOR SELECT USING (true);

DROP POLICY IF EXISTS ss_insert ON success_stories;
CREATE POLICY ss_insert ON success_stories FOR INSERT
    WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS ss_update ON success_stories;
CREATE POLICY ss_update ON success_stories FOR UPDATE
    USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS ss_delete ON success_stories;
CREATE POLICY ss_delete ON success_stories FOR DELETE
    USING (auth.uid() = author_id OR public.is_admin());

DROP TRIGGER IF EXISTS trg_ss_updated_at ON success_stories;
CREATE TRIGGER trg_ss_updated_at
    BEFORE UPDATE ON success_stories
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Realtime so stories tab shows new posts live
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE success_stories;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 17 ─ DROP GRADE/SCHOOL REQUIREMENT FROM PROFILES
--   The signup form no longer collects grade or school, so the check
--   constraint that requires them for non-adults must be dropped.
-- ─────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles
    DROP CONSTRAINT IF EXISTS profiles_adult_grade_school_check;

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 18 ─ HUB TOOL PERSISTENCE
--   Tables for Goals, Club Finder Quiz Results, and Rubric Self-Assessment.
--   The existing `achievements` and `user_achievements` tables from the
--   base schema are used by the Achievements hub page via achievementsApi.
-- ─────────────────────────────────────────────────────────────────────────

-- 18a. Club Goals (per-user goal tracking with milestones)
CREATE TABLE IF NOT EXISTS public.club_goals (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title       text        NOT NULL,
    club        text        NOT NULL DEFAULT '',
    category    text        NOT NULL DEFAULT 'General',
    description text        NOT NULL DEFAULT '',
    target_date date,
    progress    integer     NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    priority    text        NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    status      text        NOT NULL DEFAULT 'on-track' CHECK (status IN ('on-track', 'at-risk', 'behind', 'completed')),
    milestones  jsonb       NOT NULL DEFAULT '[]',
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_club_goals_user    ON club_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_club_goals_status  ON club_goals(status);

ALTER TABLE public.club_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS club_goals_all ON club_goals;
CREATE POLICY club_goals_all ON club_goals FOR ALL USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_club_goals_updated_at ON club_goals;
CREATE TRIGGER trg_club_goals_updated_at
    BEFORE UPDATE ON club_goals
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 18b. Club Finder Quiz Results (one row per user, upserted on completion)
CREATE TABLE IF NOT EXISTS public.club_finder_results (
    id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid        NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    answers        jsonb       NOT NULL DEFAULT '[]',
    top_categories text[]      NOT NULL DEFAULT '{}',
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.club_finder_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS club_finder_results_all ON club_finder_results;
CREATE POLICY club_finder_results_all ON club_finder_results FOR ALL USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_cfr_updated_at ON club_finder_results;
CREATE TRIGGER trg_cfr_updated_at
    BEFORE UPDATE ON club_finder_results
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 18c. Rubric Self-Assessment Progress (one row per user per rubric)
CREATE TABLE IF NOT EXISTS public.rubric_progress (
    id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rubric_id  text        NOT NULL,
    scores     jsonb       NOT NULL DEFAULT '{}',
    notes      text        NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, rubric_id)
);

CREATE INDEX IF NOT EXISTS idx_rubric_progress_user ON rubric_progress(user_id);

ALTER TABLE public.rubric_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rubric_progress_all ON rubric_progress;
CREATE POLICY rubric_progress_all ON rubric_progress FOR ALL USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_rubric_progress_updated_at ON rubric_progress;
CREATE TRIGGER trg_rubric_progress_updated_at
    BEFORE UPDATE ON rubric_progress
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- SECTION 11 ─ RESOURCE HUB: reviews, ratings, saves
--   These tables use varchar resource_id matching the hardcoded string IDs
--   in lib/resourcesData.ts (e.g. "ig-1", "lo-2") rather than UUID FK to
--   the resources table, so they work without seeding the resources table.
-- ─────────────────────────────────────────────────────────────────────────

-- 11a. resource_reviews  (multiple comments per user per resource allowed)
CREATE TABLE IF NOT EXISTS public.resource_reviews (
    id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id varchar(64)  NOT NULL,
    user_id     uuid         NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    comment     text         NOT NULL CHECK (char_length(comment) >= 1 AND char_length(comment) <= 2000),
    created_at  timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resource_reviews_resource ON resource_reviews(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_reviews_user     ON resource_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_reviews_created  ON resource_reviews(created_at DESC);

ALTER TABLE public.resource_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rr_select ON resource_reviews;
CREATE POLICY rr_select ON resource_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS rr_insert ON resource_reviews;
CREATE POLICY rr_insert ON resource_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS rr_delete ON resource_reviews;
CREATE POLICY rr_delete ON resource_reviews FOR DELETE
    USING (auth.uid() = user_id);

-- 11b. resource_ratings  (one rating per user per resource, upsertable)
CREATE TABLE IF NOT EXISTS public.resource_ratings (
    resource_id varchar(64)  NOT NULL,
    user_id     uuid         NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating      smallint     NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at  timestamptz  NOT NULL DEFAULT now(),
    PRIMARY KEY (resource_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_resource_ratings_resource ON resource_ratings(resource_id);

ALTER TABLE public.resource_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rrat_select ON resource_ratings;
CREATE POLICY rrat_select ON resource_ratings FOR SELECT USING (true);

DROP POLICY IF EXISTS rrat_insert ON resource_ratings;
CREATE POLICY rrat_insert ON resource_ratings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS rrat_update ON resource_ratings;
CREATE POLICY rrat_update ON resource_ratings FOR UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Helper view: per-resource average rating
CREATE OR REPLACE VIEW public.resource_avg_ratings AS
SELECT
    resource_id,
    round(avg(rating)::numeric, 1)  AS avg_rating,
    count(*)                         AS rating_count
FROM resource_ratings
GROUP BY resource_id;

-- 11c. resource_saves  (toggle save/unsave per user per resource)
CREATE TABLE IF NOT EXISTS public.resource_saves (
    resource_id varchar(64)  NOT NULL,
    user_id     uuid         NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    saved_at    timestamptz  NOT NULL DEFAULT now(),
    PRIMARY KEY (resource_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_resource_saves_resource ON resource_saves(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_saves_user     ON resource_saves(user_id);

ALTER TABLE public.resource_saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rs_select ON resource_saves;
CREATE POLICY rs_select ON resource_saves FOR SELECT USING (true);

DROP POLICY IF EXISTS rs_insert ON resource_saves;
CREATE POLICY rs_insert ON resource_saves FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS rs_delete ON resource_saves;
CREATE POLICY rs_delete ON resource_saves FOR DELETE
    USING (auth.uid() = user_id);

COMMIT;
