-- ═══════════════════════════════════════════════════════════════════════
-- Migration 008: Club Ownership, Owner-Only Announcements, Comments,
-- Uploads, Discussion Votes, and Directory Views.
--
-- Key rules:
--   • Any authenticated user can CREATE a new club (organization).
--   • The creator (created_by) is the ONLY user who may post, edit,
--     or delete announcements for that club.
--   • No enrollment / membership needed — everyone can see everything.
--   • All comments and resource uploads are stored in the database.
--
-- Safe to re-run: uses IF NOT EXISTS / DROP … IF EXISTS everywhere.
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ═══════════════════════════════════════════════
-- 1. EXTEND ORGANIZATIONS: creator & publish info
-- ═══════════════════════════════════════════════

ALTER TABLE organizations ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS category varchar(100);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS meeting_schedule text;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS meeting_location text;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS advisor_name text;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS contact_email varchar(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS member_count integer DEFAULT 0;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS founded_date date;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS tags text[];

CREATE INDEX IF NOT EXISTS idx_organizations_created_by ON organizations(created_by);
CREATE INDEX IF NOT EXISTS idx_organizations_published  ON organizations(is_published);

-- ═══════════════════════════════════════════════
-- 2. HELPER: check if caller is the org creator
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.is_org_creator(p_org_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.organizations
        WHERE id = p_org_id AND created_by = auth.uid()
    );
$$;

-- ═══════════════════════════════════════════════
-- 3. ORGANIZATIONS RLS: only creator can update/delete
-- ═══════════════════════════════════════════════

DROP POLICY IF EXISTS organizations_select  ON organizations;
DROP POLICY IF EXISTS organizations_insert  ON organizations;
DROP POLICY IF EXISTS organizations_update  ON organizations;
DROP POLICY IF EXISTS organizations_delete  ON organizations;

CREATE POLICY organizations_select ON organizations FOR SELECT USING (true);
CREATE POLICY organizations_insert ON organizations FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);
CREATE POLICY organizations_update ON organizations FOR UPDATE
    USING (auth.uid() = created_by);
CREATE POLICY organizations_delete ON organizations FOR DELETE
    USING (auth.uid() = created_by);

-- ═══════════════════════════════════════════════
-- 4. ANNOUNCEMENTS RLS: only club OWNER can write
-- ═══════════════════════════════════════════════

DROP POLICY IF EXISTS announcements_select ON announcements;
DROP POLICY IF EXISTS announcements_insert ON announcements;
DROP POLICY IF EXISTS announcements_update ON announcements;
DROP POLICY IF EXISTS announcements_delete ON announcements;

CREATE POLICY announcements_select ON announcements FOR SELECT USING (true);
CREATE POLICY announcements_insert ON announcements FOR INSERT
    WITH CHECK (auth.uid() = author_id AND public.is_org_creator(org_id));
CREATE POLICY announcements_update ON announcements FOR UPDATE
    USING  (auth.uid() = author_id AND public.is_org_creator(org_id));
CREATE POLICY announcements_delete ON announcements FOR DELETE
    USING  (public.is_org_creator(org_id));

-- ═══════════════════════════════════════════════
-- 5. DISCUSSION VOTES
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS discussion_votes (
    discussion_id uuid NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vote smallint NOT NULL DEFAULT 1 CHECK (vote IN (-1, 1)),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (discussion_id, user_id)
);

CREATE TABLE IF NOT EXISTS reply_votes (
    reply_id uuid NOT NULL REFERENCES discussion_replies(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vote smallint NOT NULL DEFAULT 1 CHECK (vote IN (-1, 1)),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (reply_id, user_id)
);

ALTER TABLE discussion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reply_votes      ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dv_select ON discussion_votes;
DROP POLICY IF EXISTS dv_insert ON discussion_votes;
DROP POLICY IF EXISTS dv_update ON discussion_votes;
DROP POLICY IF EXISTS dv_delete ON discussion_votes;
CREATE POLICY dv_select ON discussion_votes FOR SELECT USING (true);
CREATE POLICY dv_insert ON discussion_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY dv_update ON discussion_votes FOR UPDATE USING  (auth.uid() = user_id);
CREATE POLICY dv_delete ON discussion_votes FOR DELETE USING  (auth.uid() = user_id);

DROP POLICY IF EXISTS rv_select ON reply_votes;
DROP POLICY IF EXISTS rv_insert ON reply_votes;
DROP POLICY IF EXISTS rv_update ON reply_votes;
DROP POLICY IF EXISTS rv_delete ON reply_votes;
CREATE POLICY rv_select ON reply_votes FOR SELECT USING (true);
CREATE POLICY rv_insert ON reply_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY rv_update ON reply_votes FOR UPDATE USING  (auth.uid() = user_id);
CREATE POLICY rv_delete ON reply_votes FOR DELETE USING  (auth.uid() = user_id);

-- ═══════════════════════════════════════════════
-- 6. ENHANCE UPLOADS (extra columns)
-- ═══════════════════════════════════════════════

ALTER TABLE uploads ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS category varchar(50);
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT true;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS tags text[];

-- ═══════════════════════════════════════════════
-- 7. ENHANCE DISCUSSIONS (counters & category)
-- ═══════════════════════════════════════════════

ALTER TABLE discussions ADD COLUMN IF NOT EXISTS vote_count  integer DEFAULT 0;
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS reply_count integer DEFAULT 0;
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS view_count  integer DEFAULT 0;
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS category    varchar(50);
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS tags        text[];

-- ═══════════════════════════════════════════════
-- 8. TRIGGERS: auto-update vote & reply counts
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_discussion_vote_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target_id uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN target_id := OLD.discussion_id;
    ELSE target_id := NEW.discussion_id; END IF;
    UPDATE discussions SET vote_count = (
        SELECT COALESCE(SUM(vote), 0) FROM discussion_votes WHERE discussion_id = target_id
    ) WHERE id = target_id;
    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END; $$;

DROP TRIGGER IF EXISTS trg_discussion_vote ON discussion_votes;
CREATE TRIGGER trg_discussion_vote
    AFTER INSERT OR UPDATE OR DELETE ON discussion_votes
    FOR EACH ROW EXECUTE FUNCTION public.update_discussion_vote_count();

CREATE OR REPLACE FUNCTION public.update_discussion_reply_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target_id uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN target_id := OLD.discussion_id;
    ELSE target_id := NEW.discussion_id; END IF;
    UPDATE discussions SET reply_count = (
        SELECT count(*) FROM discussion_replies WHERE discussion_id = target_id
    ) WHERE id = target_id;
    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END; $$;

DROP TRIGGER IF EXISTS trg_discussion_reply ON discussion_replies;
CREATE TRIGGER trg_discussion_reply
    AFTER INSERT OR DELETE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION public.update_discussion_reply_count();

-- ═══════════════════════════════════════════════
-- 9. INDEXES
-- ═══════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_announcements_org     ON announcements(org_id);
CREATE INDEX IF NOT EXISTS idx_comments_org          ON comments(org_id);
CREATE INDEX IF NOT EXISTS idx_comments_event        ON comments(event_id);
CREATE INDEX IF NOT EXISTS idx_comments_resource     ON comments(resource_id);
CREATE INDEX IF NOT EXISTS idx_uploads_user          ON uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_uploads_org           ON uploads(org_id);
CREATE INDEX IF NOT EXISTS idx_uploads_approved      ON uploads(is_approved);
CREATE INDEX IF NOT EXISTS idx_discussions_org        ON discussions(org_id);
CREATE INDEX IF NOT EXISTS idx_discussion_votes_disc  ON discussion_votes(discussion_id);
CREATE INDEX IF NOT EXISTS idx_reply_votes_reply      ON reply_votes(reply_id);

-- ═══════════════════════════════════════════════
-- 10. VIEWS
-- ═══════════════════════════════════════════════

-- Club directory: published user-created clubs with aggregated counts
DROP VIEW IF EXISTS club_directory;
CREATE VIEW club_directory AS
SELECT
    o.id,
    o.name,
    o.slug,
    o.description,
    o.category,
    o.meeting_schedule,
    o.meeting_location,
    o.advisor_name,
    o.contact_email,
    o.logo_url,
    o.member_count,
    o.founded_date,
    o.tags,
    o.website,
    o.is_featured,
    o.created_by,
    o.created_at,
    p.name  AS creator_name,
    p.email AS creator_email,
    (SELECT count(*) FROM events e        WHERE e.org_id = o.id) AS events_count,
    (SELECT count(*) FROM resources r     WHERE r.org_id = o.id) AS resources_count,
    (SELECT count(*) FROM announcements a WHERE a.org_id = o.id) AS announcements_count,
    (SELECT count(*) FROM comments c      WHERE c.org_id = o.id) AS comments_count,
    (SELECT count(*) FROM discussions d   WHERE d.org_id = o.id) AS discussions_count,
    (SELECT count(*) FROM uploads u       WHERE u.org_id = o.id) AS uploads_count
FROM organizations o
LEFT JOIN profiles p ON p.id = o.created_by
WHERE o.is_published = true;

-- My clubs: clubs the current user created
DROP VIEW IF EXISTS my_clubs;
CREATE VIEW my_clubs AS
SELECT
    o.id,
    o.name,
    o.slug,
    o.description,
    o.category,
    o.is_published,
    o.is_featured,
    o.created_at,
    o.member_count,
    o.tags,
    (SELECT count(*) FROM announcements a WHERE a.org_id = o.id) AS announcements_count,
    (SELECT count(*) FROM events e        WHERE e.org_id = o.id) AS events_count
FROM organizations o
WHERE o.created_by = auth.uid();

-- Community uploads with author info
DROP VIEW IF EXISTS community_uploads;
CREATE VIEW community_uploads AS
SELECT
    u.id,
    u.user_id,
    p.name       AS author_name,
    p.avatar_url AS author_avatar,
    u.title,
    u.file_name,
    u.file_url,
    u.file_type,
    u.file_size,
    u.description,
    u.category,
    u.tags,
    u.likes,
    u.download_count,
    u.org_id,
    o.name AS org_name,
    u.created_at
FROM uploads u
JOIN profiles p ON p.id = u.user_id
LEFT JOIN organizations o ON o.id = u.org_id
WHERE u.is_approved = true
ORDER BY u.created_at DESC;

-- Discussion threads with author + org
DROP VIEW IF EXISTS discussion_threads;
CREATE VIEW discussion_threads AS
SELECT
    d.id,
    d.org_id,
    o.name       AS org_name,
    d.author_id,
    p.name       AS author_name,
    p.avatar_url AS author_avatar,
    d.title,
    d.content,
    d.is_pinned,
    d.category,
    d.tags,
    d.vote_count,
    d.reply_count,
    d.view_count,
    d.created_at,
    d.updated_at
FROM discussions d
JOIN profiles p ON p.id = d.author_id
LEFT JOIN organizations o ON o.id = d.org_id
ORDER BY d.is_pinned DESC, d.created_at DESC;

-- ═══════════════════════════════════════════════
-- 11. REALTIME for discussions & comments
-- ═══════════════════════════════════════════════

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE discussions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE discussion_replies;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE comments;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ═══════════════════════════════════════════════
-- 12. STORAGE BUCKET for uploads
-- ═══════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
    CREATE POLICY uploads_public_read ON storage.objects
        FOR SELECT USING (bucket_id = 'uploads');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY uploads_auth_insert ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY uploads_owner_update ON storage.objects
        FOR UPDATE USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY uploads_owner_delete ON storage.objects
        FOR DELETE USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMIT;
