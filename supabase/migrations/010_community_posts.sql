-- ═══════════════════════════════════════════════════════════════════════
-- Migration 010: Community Feed Posts & Replies
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- Community feed posts
CREATE TABLE IF NOT EXISTS community_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    author_name varchar(255) NOT NULL DEFAULT 'Member',
    author_initials varchar(10) NOT NULL DEFAULT '?',
    club varchar(100) NOT NULL DEFAULT 'General',
    text text NOT NULL,
    type varchar(50) NOT NULL DEFAULT 'text'
        CHECK (type IN ('text', 'resource', 'image', 'achievement', 'discussion')),
    file_name varchar(255),
    file_size varchar(50),
    file_url text,
    likes integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_author ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);

-- Replies to community feed posts
CREATE TABLE IF NOT EXISTS community_post_replies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    author_name varchar(255) NOT NULL DEFAULT 'Member',
    author_initials varchar(10) NOT NULL DEFAULT '?',
    text text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_post_replies_post ON community_post_replies(post_id);

-- RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS community_posts_select ON community_posts;
CREATE POLICY community_posts_select ON community_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS community_posts_insert ON community_posts;
CREATE POLICY community_posts_insert ON community_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS community_posts_delete ON community_posts;
CREATE POLICY community_posts_delete ON community_posts FOR DELETE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS community_post_replies_select ON community_post_replies;
CREATE POLICY community_post_replies_select ON community_post_replies FOR SELECT USING (true);

DROP POLICY IF EXISTS community_post_replies_insert ON community_post_replies;
CREATE POLICY community_post_replies_insert ON community_post_replies FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS community_post_replies_delete ON community_post_replies;
CREATE POLICY community_post_replies_delete ON community_post_replies FOR DELETE USING (auth.uid() = author_id);

COMMIT;
