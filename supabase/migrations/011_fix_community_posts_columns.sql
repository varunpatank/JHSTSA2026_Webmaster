-- ═══════════════════════════════════════════════════════════════════════
-- Migration 011: Fix community_posts schema + resources RLS delete policy
-- ═══════════════════════════════════════════════════════════════════════
-- schema_v2_extension.sql created community_posts with (content, post_type,
-- club_tag) whereas migration 010 and the app code expect (text, type, club,
-- author_name, author_initials).  This migration adds the missing columns,
-- relaxes NOT NULL constraints that block inserts, and adds the missing
-- resources DELETE policy (migration 009 has SELECT + INSERT but no DELETE).
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ── community_posts columns ──────────────────────────────────────────────
ALTER TABLE public.community_posts
    ADD COLUMN IF NOT EXISTS author_name     varchar(255) DEFAULT 'Member',
    ADD COLUMN IF NOT EXISTS author_initials varchar(10)  DEFAULT '?',
    ADD COLUMN IF NOT EXISTS club            varchar(100) DEFAULT 'General',
    ADD COLUMN IF NOT EXISTS text            text,
    ADD COLUMN IF NOT EXISTS type            varchar(50)  DEFAULT 'text';

-- If schema_v2_extension ran first, 'content' and 'author_id' are NOT NULL
-- which blocks app inserts that don't supply those columns.  Make them nullable.
DO $$ BEGIN
    ALTER TABLE public.community_posts ALTER COLUMN content DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.community_posts ALTER COLUMN author_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- ── community_post_replies columns ───────────────────────────────────────
ALTER TABLE public.community_post_replies
    ADD COLUMN IF NOT EXISTS author_name     varchar(255) DEFAULT 'Member',
    ADD COLUMN IF NOT EXISTS author_initials varchar(10)  DEFAULT '?',
    ADD COLUMN IF NOT EXISTS text            text;

DO $$ BEGIN
    ALTER TABLE public.community_post_replies ALTER COLUMN content DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.community_post_replies ALTER COLUMN author_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- ── community_posts RLS ──────────────────────────────────────────────────
-- Ensure RLS is enabled
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS community_posts_select  ON community_posts;
CREATE POLICY community_posts_select  ON community_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS community_posts_insert  ON community_posts;
CREATE POLICY community_posts_insert  ON community_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS community_posts_delete  ON community_posts;
CREATE POLICY community_posts_delete  ON community_posts
    FOR DELETE USING (auth.uid() = author_id OR author_id IS NULL);

-- ── community_post_replies RLS ───────────────────────────────────────────
ALTER TABLE public.community_post_replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS community_post_replies_select ON community_post_replies;
CREATE POLICY community_post_replies_select ON community_post_replies FOR SELECT USING (true);

DROP POLICY IF EXISTS community_post_replies_insert ON community_post_replies;
CREATE POLICY community_post_replies_insert ON community_post_replies FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS community_post_replies_delete ON community_post_replies;
CREATE POLICY community_post_replies_delete ON community_post_replies
    FOR DELETE USING (auth.uid() = author_id OR author_id IS NULL);

-- ── resources RLS: add the missing DELETE policy ─────────────────────────
-- Migration 009 added SELECT + INSERT policies but no DELETE policy.
-- combined_schema.sql has one but may not have been applied.
-- Without a DELETE policy, RLS silently blocks all deletes (returns 0 rows, no error).
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS resources_delete ON resources;
CREATE POLICY resources_delete ON resources
    FOR DELETE USING (auth.uid() = created_by OR created_by IS NULL);

-- Ensure SELECT and INSERT policies exist (no-op if already present)
DO $$ BEGIN
    CREATE POLICY resources_select ON resources FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY resources_insert ON resources FOR INSERT
        WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

COMMIT;
