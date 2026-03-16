-- 006: Interactive features - comments, quizzes, announcements, discussions, notifications
-- Adds tables for community interaction features

-- -----------------------------------------------------------------------
-- Comments (on events, resources, organizations)
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) <= 2000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT comments_target_check CHECK (
        (org_id IS NOT NULL)::int + (event_id IS NOT NULL)::int + (resource_id IS NOT NULL)::int = 1
    )
);

CREATE INDEX idx_comments_org ON comments(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX idx_comments_event ON comments(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX idx_comments_resource ON comments(resource_id) WHERE resource_id IS NOT NULL;
CREATE INDEX idx_comments_user ON comments(user_id);

-- -----------------------------------------------------------------------
-- Quizzes & Quiz Results
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    score INTEGER,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(quiz_id, user_id)
);

-- -----------------------------------------------------------------------
-- Announcements (school-wide or per-org)
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_announcements_org ON announcements(org_id);

-- -----------------------------------------------------------------------
-- Discussions (forum-style threads)
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS discussion_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) <= 5000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------
-- Notifications
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

-- -----------------------------------------------------------------------
-- File Uploads (user-uploaded resources)
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------
-- RLS Policies
-- -----------------------------------------------------------------------

-- Comments: viewable by all, creatable by authenticated, editable by author
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY comments_select ON comments FOR SELECT USING (true);
CREATE POLICY comments_insert ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY comments_update ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY comments_delete ON comments FOR DELETE USING (auth.uid() = user_id);

-- Quizzes: viewable if published or by creator, creatable by authenticated
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY quizzes_select ON quizzes FOR SELECT USING (is_published OR auth.uid() = created_by);
CREATE POLICY quizzes_insert ON quizzes FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY quizzes_update ON quizzes FOR UPDATE USING (auth.uid() = created_by);

-- Quiz Results: viewable by quiz taker, creatable by authenticated
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY quiz_results_select ON quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY quiz_results_insert ON quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Announcements: viewable by all, manageable by author
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY announcements_select ON announcements FOR SELECT USING (true);
CREATE POLICY announcements_insert ON announcements FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY announcements_update ON announcements FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY announcements_delete ON announcements FOR DELETE USING (auth.uid() = author_id);

-- Discussions: viewable by all, creatable by authenticated
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
CREATE POLICY discussions_select ON discussions FOR SELECT USING (true);
CREATE POLICY discussions_insert ON discussions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY discussions_update ON discussions FOR UPDATE USING (auth.uid() = author_id);

-- Discussion Replies
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY replies_select ON discussion_replies FOR SELECT USING (true);
CREATE POLICY replies_insert ON discussion_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY replies_update ON discussion_replies FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY replies_delete ON discussion_replies FOR DELETE USING (auth.uid() = author_id);

-- Notifications: only visible to the target user
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notifications_select ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY notifications_delete ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Uploads: viewable by all, manageable by uploader
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY uploads_select ON uploads FOR SELECT USING (true);
CREATE POLICY uploads_insert ON uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY uploads_update ON uploads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY uploads_delete ON uploads FOR DELETE USING (auth.uid() = user_id);
