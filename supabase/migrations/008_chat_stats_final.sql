-- ═══════════════════════════════════════════════════════════════════════
-- Migration 008: Chat System, User/Club Statistics, Community Uploads
-- Adds real-time chat channels & messages, comprehensive views for
-- user and club statistics, and ensures all threads/discussions work
-- with the current Supabase auth system.
--
-- Safe to re-run: uses IF NOT EXISTS / DROP ... IF EXISTS everywhere.
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ═══════════════════════════════════════════════
-- 1. CHAT CHANNELS (real-time messaging)
-- ═══════════════════════════════════════════════
-- Channels can be global, club-scoped, or DMs.

CREATE TABLE IF NOT EXISTS chat_channels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    description text,
    org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    channel_type varchar(20) NOT NULL DEFAULT 'public'
        CHECK (channel_type IN ('public','club','direct','announcement')),
    created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    is_archived boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_channels_org ON chat_channels(org_id);
CREATE INDEX IF NOT EXISTS idx_chat_channels_type ON chat_channels(channel_type);

-- ═══════════════════════════════════════════════
-- 2. CHAT MESSAGES
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS chat_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id uuid NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
    sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content text NOT NULL CHECK (char_length(content) <= 5000),
    reply_to uuid REFERENCES chat_messages(id) ON DELETE SET NULL,
    is_edited boolean NOT NULL DEFAULT false,
    is_deleted boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON chat_messages(channel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender_id);

-- ═══════════════════════════════════════════════
-- 3. CHAT CHANNEL MEMBERS (who is in which channel)
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS chat_channel_members (
    channel_id uuid NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role varchar(20) NOT NULL DEFAULT 'member'
        CHECK (role IN ('member','moderator','admin')),
    last_read_at timestamptz DEFAULT now(),
    joined_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (channel_id, user_id)
);

-- ═══════════════════════════════════════════════
-- 4. DISCUSSION VOTES (like/dislike on discussions)
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS discussion_votes (
    discussion_id uuid NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vote smallint NOT NULL DEFAULT 1 CHECK (vote IN (-1, 1)),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (discussion_id, user_id)
);

-- ═══════════════════════════════════════════════
-- 5. DISCUSSION REPLY VOTES
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS reply_votes (
    reply_id uuid NOT NULL REFERENCES discussion_replies(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vote smallint NOT NULL DEFAULT 1 CHECK (vote IN (-1, 1)),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (reply_id, user_id)
);

-- ═══════════════════════════════════════════════
-- 6. COMMUNITY RESOURCE UPLOADS (enhanced)
-- ═══════════════════════════════════════════════
-- The uploads table already exists from 006/007.
-- Add missing columns if they weren't added:

ALTER TABLE uploads ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS category varchar(50);
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT true;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS tags text[];

-- ═══════════════════════════════════════════════
-- 7. ADD vote_count COLUMNS for fast queries
-- ═══════════════════════════════════════════════

ALTER TABLE discussions ADD COLUMN IF NOT EXISTS vote_count integer DEFAULT 0;
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS reply_count integer DEFAULT 0;
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS category varchar(50);
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS tags text[];

-- ═══════════════════════════════════════════════
-- 8. ENABLE RLS ON NEW TABLES
-- ═══════════════════════════════════════════════

ALTER TABLE chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reply_votes ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════
-- 9. RLS POLICIES
-- ═══════════════════════════════════════════════

-- Chat Channels: public channels visible to all, club channels to members
DROP POLICY IF EXISTS chat_channels_select ON chat_channels;
DROP POLICY IF EXISTS chat_channels_insert ON chat_channels;
DROP POLICY IF EXISTS chat_channels_update ON chat_channels;
CREATE POLICY chat_channels_select ON chat_channels FOR SELECT USING (
    channel_type = 'public'
    OR (org_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM memberships m WHERE m.org_id = chat_channels.org_id AND m.user_id = auth.uid()
    ))
    OR EXISTS (
        SELECT 1 FROM chat_channel_members cm WHERE cm.channel_id = chat_channels.id AND cm.user_id = auth.uid()
    )
);
CREATE POLICY chat_channels_insert ON chat_channels FOR INSERT
    WITH CHECK (auth.uid() = created_by);
CREATE POLICY chat_channels_update ON chat_channels FOR UPDATE
    USING (auth.uid() = created_by OR (org_id IS NOT NULL AND public.is_org_admin(org_id)));

-- Chat Messages: visible to channel members, writable by sender
DROP POLICY IF EXISTS chat_messages_select ON chat_messages;
DROP POLICY IF EXISTS chat_messages_insert ON chat_messages;
DROP POLICY IF EXISTS chat_messages_update ON chat_messages;
DROP POLICY IF EXISTS chat_messages_delete ON chat_messages;
CREATE POLICY chat_messages_select ON chat_messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM chat_channels c WHERE c.id = chat_messages.channel_id AND (
            c.channel_type = 'public'
            OR EXISTS (SELECT 1 FROM chat_channel_members cm WHERE cm.channel_id = c.id AND cm.user_id = auth.uid())
            OR (c.org_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM memberships m WHERE m.org_id = c.org_id AND m.user_id = auth.uid()
            ))
        )
    )
);
CREATE POLICY chat_messages_insert ON chat_messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);
CREATE POLICY chat_messages_update ON chat_messages FOR UPDATE
    USING (auth.uid() = sender_id);
CREATE POLICY chat_messages_delete ON chat_messages FOR DELETE
    USING (auth.uid() = sender_id);

-- Chat Channel Members
DROP POLICY IF EXISTS chat_channel_members_select ON chat_channel_members;
DROP POLICY IF EXISTS chat_channel_members_insert ON chat_channel_members;
DROP POLICY IF EXISTS chat_channel_members_delete ON chat_channel_members;
CREATE POLICY chat_channel_members_select ON chat_channel_members FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM chat_channel_members cm2 WHERE cm2.channel_id = chat_channel_members.channel_id AND cm2.user_id = auth.uid())
);
CREATE POLICY chat_channel_members_insert ON chat_channel_members FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY chat_channel_members_delete ON chat_channel_members FOR DELETE
    USING (auth.uid() = user_id);

-- Discussion Votes
DROP POLICY IF EXISTS discussion_votes_select ON discussion_votes;
DROP POLICY IF EXISTS discussion_votes_insert ON discussion_votes;
DROP POLICY IF EXISTS discussion_votes_delete ON discussion_votes;
CREATE POLICY discussion_votes_select ON discussion_votes FOR SELECT USING (true);
CREATE POLICY discussion_votes_insert ON discussion_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY discussion_votes_delete ON discussion_votes FOR DELETE USING (auth.uid() = user_id);

-- Reply Votes
DROP POLICY IF EXISTS reply_votes_select ON reply_votes;
DROP POLICY IF EXISTS reply_votes_insert ON reply_votes;
DROP POLICY IF EXISTS reply_votes_delete ON reply_votes;
CREATE POLICY reply_votes_select ON reply_votes FOR SELECT USING (true);
CREATE POLICY reply_votes_insert ON reply_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY reply_votes_delete ON reply_votes FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════
-- 10. TRIGGERS FOR VOTE COUNTS
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_discussion_vote_count()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_id uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN target_id := OLD.discussion_id;
    ELSE target_id := NEW.discussion_id;
    END IF;
    UPDATE discussions SET vote_count = (
        SELECT COALESCE(SUM(vote), 0) FROM discussion_votes WHERE discussion_id = target_id
    ) WHERE id = target_id;
    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_discussion_vote_count ON discussion_votes;
CREATE TRIGGER trg_update_discussion_vote_count
    AFTER INSERT OR UPDATE OR DELETE ON discussion_votes
    FOR EACH ROW EXECUTE FUNCTION public.update_discussion_vote_count();

-- Auto-update discussion reply_count
CREATE OR REPLACE FUNCTION public.update_discussion_reply_count()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_id uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN target_id := OLD.discussion_id;
    ELSE target_id := NEW.discussion_id;
    END IF;
    UPDATE discussions SET reply_count = (
        SELECT count(*) FROM discussion_replies WHERE discussion_id = target_id
    ) WHERE id = target_id;
    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_discussion_reply_count ON discussion_replies;
CREATE TRIGGER trg_update_discussion_reply_count
    AFTER INSERT OR DELETE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION public.update_discussion_reply_count();

-- ═══════════════════════════════════════════════
-- 11. VIEWS: USER STATISTICS
-- ═══════════════════════════════════════════════
-- Aggregated view of user stats: clubs enrolled, events attended, etc.

DROP VIEW IF EXISTS user_statistics;
CREATE VIEW user_statistics AS
SELECT
    p.id AS user_id,
    p.name,
    p.email,
    p.grade,
    p.school,
    p.avatar_url,
    p.total_service_hours,
    p.total_events_attended,
    p.achievement_points,
    p.graduation_year,
    -- Clubs enrolled
    COALESCE(mem.club_count, 0) AS clubs_enrolled,
    -- Clubs owned/admin
    COALESCE(adm.admin_club_count, 0) AS clubs_owned,
    -- Clubs where officer
    COALESCE(ofc.officer_club_count, 0) AS clubs_officer,
    -- Discussions started
    COALESCE(disc.discussion_count, 0) AS discussions_started,
    -- Uploads shared
    COALESCE(upl.upload_count, 0) AS uploads_shared,
    -- Events registered for
    COALESCE(evt.event_count, 0) AS events_registered,
    -- Achievement count
    COALESCE(ach.achievement_count, 0) AS achievements_earned,
    p.created_at AS member_since
FROM profiles p
LEFT JOIN (
    SELECT user_id, count(*) AS club_count
    FROM memberships WHERE is_approved = true
    GROUP BY user_id
) mem ON mem.user_id = p.id
LEFT JOIN (
    SELECT user_id, count(*) AS admin_club_count
    FROM memberships WHERE user_permissions = 'admin' AND is_approved = true
    GROUP BY user_id
) adm ON adm.user_id = p.id
LEFT JOIN (
    SELECT user_id, count(*) AS officer_club_count
    FROM memberships WHERE user_permissions = 'officer' AND is_approved = true
    GROUP BY user_id
) ofc ON ofc.user_id = p.id
LEFT JOIN (
    SELECT author_id, count(*) AS discussion_count
    FROM discussions GROUP BY author_id
) disc ON disc.author_id = p.id
LEFT JOIN (
    SELECT user_id, count(*) AS upload_count
    FROM uploads GROUP BY user_id
) upl ON upl.user_id = p.id
LEFT JOIN (
    SELECT user_id, count(*) AS event_count
    FROM event_registrations WHERE status IN ('registered','attended')
    GROUP BY user_id
) evt ON evt.user_id = p.id
LEFT JOIN (
    SELECT user_id, count(*) AS achievement_count
    FROM user_achievements GROUP BY user_id
) ach ON ach.user_id = p.id;

-- ═══════════════════════════════════════════════
-- 12. VIEWS: CLUB STATISTICS
-- ═══════════════════════════════════════════════
-- Aggregated view of club/org info: members, events, resources, etc.

DROP VIEW IF EXISTS club_statistics;
CREATE VIEW club_statistics AS
SELECT
    o.id AS org_id,
    o.name,
    o.slug,
    o.description,
    o.category,
    o.meeting_frequency,
    o.meeting_time,
    o.logo_url,
    o.banner_url,
    o.is_featured,
    o.is_active,
    o.founded_year,
    o.created_at,
    -- Total members (from memberships table, real count)
    COALESCE(mem.total_members, 0) AS total_members,
    -- Active admins
    COALESCE(adm.admin_count, 0) AS admin_count,
    -- Officers
    COALESCE(ofc.officer_count, 0) AS officer_count,
    -- Events held
    COALESCE(evt.event_count, 0) AS events_count,
    -- Resources
    COALESCE(res.resource_count, 0) AS resources_count,
    -- Discussions
    COALESCE(disc.discussion_count, 0) AS discussions_count,
    -- Announcements
    COALESCE(ann.announcement_count, 0) AS announcements_count,
    -- Projects
    COALESCE(proj.project_count, 0) AS projects_count,
    -- Service hours total
    COALESCE(svc.total_service_hours, 0) AS total_service_hours,
    -- Average rating
    COALESCE(rat.avg_rating, 0) AS avg_rating,
    COALESCE(rat.rating_count, 0) AS rating_count,
    -- Latest analytics snapshot (if exists)
    la.engagement_score,
    la.retention_rate
FROM organizations o
LEFT JOIN (
    SELECT org_id, count(*) AS total_members
    FROM memberships WHERE is_approved = true
    GROUP BY org_id
) mem ON mem.org_id = o.id
LEFT JOIN (
    SELECT org_id, count(*) AS admin_count
    FROM memberships WHERE user_permissions = 'admin' AND is_approved = true
    GROUP BY org_id
) adm ON adm.org_id = o.id
LEFT JOIN (
    SELECT org_id, count(*) AS officer_count
    FROM memberships WHERE user_permissions = 'officer' AND is_approved = true
    GROUP BY org_id
) ofc ON ofc.org_id = o.id
LEFT JOIN (
    SELECT org_id, count(*) AS event_count
    FROM events GROUP BY org_id
) evt ON evt.org_id = o.id
LEFT JOIN (
    SELECT org_id, count(*) AS resource_count
    FROM resources GROUP BY org_id
) res ON res.org_id = o.id
LEFT JOIN (
    SELECT org_id, count(*) AS discussion_count
    FROM discussions GROUP BY org_id
) disc ON disc.org_id = o.id
LEFT JOIN (
    SELECT org_id, count(*) AS announcement_count
    FROM announcements GROUP BY org_id
) ann ON ann.org_id = o.id
LEFT JOIN (
    SELECT org_id, count(*) AS project_count
    FROM projects GROUP BY org_id
) proj ON proj.org_id = o.id
LEFT JOIN (
    SELECT org_id, COALESCE(SUM(hours), 0) AS total_service_hours
    FROM service_hours WHERE verified = true
    GROUP BY org_id
) svc ON svc.org_id = o.id
LEFT JOIN (
    SELECT org_id,
           ROUND(AVG(rating)::numeric, 1) AS avg_rating,
           count(*) AS rating_count
    FROM ratings GROUP BY org_id
) rat ON rat.org_id = o.id
LEFT JOIN LATERAL (
    SELECT engagement_score, retention_rate
    FROM org_analytics oa
    WHERE oa.org_id = o.id
    ORDER BY snapshot_date DESC
    LIMIT 1
) la ON true;

-- ═══════════════════════════════════════════════
-- 13. VIEW: USER CLUB ENROLLMENTS
-- ═══════════════════════════════════════════════
-- Shows which clubs each user is enrolled in, their role, and club details.

DROP VIEW IF EXISTS user_club_enrollments;
CREATE VIEW user_club_enrollments AS
SELECT
    m.user_id,
    m.org_id,
    o.name AS club_name,
    o.slug AS club_slug,
    o.category AS club_category,
    o.logo_url AS club_logo,
    m.user_permissions AS role,
    m.position,
    m.attendance,
    m.joined_at,
    m.is_approved,
    CASE
        WHEN m.user_permissions = 'admin' THEN true
        ELSE false
    END AS is_owner
FROM memberships m
JOIN organizations o ON o.id = m.org_id
WHERE m.is_approved = true;

-- ═══════════════════════════════════════════════
-- 14. VIEW: CLUB MEMBER LIST
-- ═══════════════════════════════════════════════
-- For each club, shows enrolled students with profiles.

DROP VIEW IF EXISTS club_member_list;
CREATE VIEW club_member_list AS
SELECT
    m.org_id,
    o.name AS club_name,
    m.user_id,
    p.name AS member_name,
    p.email AS member_email,
    p.avatar_url AS member_avatar,
    p.grade AS member_grade,
    m.user_permissions AS role,
    m.position,
    m.attendance,
    m.joined_at
FROM memberships m
JOIN profiles p ON p.id = m.user_id
JOIN organizations o ON o.id = m.org_id
WHERE m.is_approved = true;

-- ═══════════════════════════════════════════════
-- 15. VIEW: COMMUNITY UPLOADS WITH DETAILS
-- ═══════════════════════════════════════════════

DROP VIEW IF EXISTS community_uploads;
CREATE VIEW community_uploads AS
SELECT
    u.id,
    u.user_id,
    p.name AS author_name,
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

-- ═══════════════════════════════════════════════
-- 16. VIEW: DISCUSSION THREADS WITH DETAILS
-- ═══════════════════════════════════════════════

DROP VIEW IF EXISTS discussion_threads;
CREATE VIEW discussion_threads AS
SELECT
    d.id,
    d.org_id,
    o.name AS org_name,
    d.author_id,
    p.name AS author_name,
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
-- 17. ENABLE REALTIME for chat tables
-- ═══════════════════════════════════════════════
-- Supabase Realtime: subscribe to chat_messages for live updates

ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_channel_members;
ALTER PUBLICATION supabase_realtime ADD TABLE discussion_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ═══════════════════════════════════════════════
-- 18. STORAGE BUCKET for community uploads
-- ═══════════════════════════════════════════════
-- Create the uploads bucket if it doesn't exist
-- (Supabase creates buckets via Dashboard or the API, not pure SQL.
--  This is a placeholder reminder. Create the bucket via:
--  INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true)
--  ON CONFLICT DO NOTHING;
-- )

INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for uploads bucket
CREATE POLICY IF NOT EXISTS uploads_public_read ON storage.objects
    FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY IF NOT EXISTS uploads_authenticated_insert ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'uploads'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY IF NOT EXISTS uploads_owner_update ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'uploads'
        AND owner = auth.uid()
    );

CREATE POLICY IF NOT EXISTS uploads_owner_delete ON storage.objects
    FOR DELETE USING (
        bucket_id = 'uploads'
        AND owner = auth.uid()
    );

COMMIT;
