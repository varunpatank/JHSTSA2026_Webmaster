-- ═══════════════════════════════════════════════════════════════════════
-- ClubConnect: Complete Database Schema
-- Combined from migrations 001-008 for a fresh Supabase instance.
-- Safe to run on a brand-new project (uses IF NOT EXISTS everywhere).
-- DROP POLICY IF EXISTS before every CREATE POLICY for safe re-runs.
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ═══════════════════════════════════════════════
-- 1. ENUM TYPES
-- ═══════════════════════════════════════════════

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_permissions') THEN
        CREATE TYPE user_permissions AS ENUM ('admin','officer','parent','teacher','partner','member');
    END IF;
END $$;

-- ═══════════════════════════════════════════════
-- 2. CORE TABLES
-- ═══════════════════════════════════════════════

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    name varchar(512),
    bio text,
    email varchar(320) UNIQUE NOT NULL,
    phone_number varchar(32),
    grade text,
    school varchar(255),
    is_adult boolean NOT NULL DEFAULT false,
    avatar_url text,
    total_service_hours numeric(7,2) DEFAULT 0,
    total_events_attended integer DEFAULT 0,
    achievement_points integer DEFAULT 0,
    interests text[],
    graduation_year integer,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT profiles_adult_grade_school_check CHECK (
        is_adult OR (grade IS NOT NULL AND school IS NOT NULL)
    )
);

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    slug varchar(255) UNIQUE,
    description text,
    parent_org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    website varchar(1000),
    category varchar(100),
    meeting_frequency varchar(50),
    meeting_time varchar(50),
    meeting_schedule text,
    meeting_location text,
    membership_status varchar(50),
    grade_level varchar(50),
    dues text,
    membership_requirements text,
    founded_year integer,
    founded_date date,
    is_active boolean NOT NULL DEFAULT true,
    member_count integer DEFAULT 0,
    logo_url text,
    banner_url text,
    social_links jsonb DEFAULT '{}',
    is_featured boolean NOT NULL DEFAULT false,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    is_published boolean NOT NULL DEFAULT false,
    advisor_name text,
    contact_email varchar(255),
    tags text[],
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizations_created_by ON organizations(created_by);
CREATE INDEX IF NOT EXISTS idx_organizations_published  ON organizations(is_published);

-- Meetings
CREATE TABLE IF NOT EXISTS meetings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    frequency text,
    details text,
    next_occurrence timestamptz
);

CREATE INDEX IF NOT EXISTS idx_meetings_org ON meetings(org_id);

-- Events
CREATE TABLE IF NOT EXISTS events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(512) NOT NULL,
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    description text,
    time timestamptz,
    start_time text,
    end_time text,
    location_text text,
    website varchar(1000),
    category varchar(50),
    is_public boolean NOT NULL DEFAULT true,
    requires_rsvp boolean NOT NULL DEFAULT false,
    max_attendees integer,
    current_attendees integer DEFAULT 0,
    image_url text,
    recap text,
    recap_images jsonb DEFAULT '[]',
    is_featured boolean NOT NULL DEFAULT false,
    created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_org ON events(org_id);
CREATE INDEX IF NOT EXISTS idx_events_time ON events(time);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);

-- Memberships
CREATE TABLE IF NOT EXISTS memberships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_permissions user_permissions NOT NULL DEFAULT 'member',
    position varchar(255),
    attendance bigint DEFAULT 0,
    joined_at timestamptz NOT NULL DEFAULT now(),
    notes text,
    is_approved boolean NOT NULL DEFAULT true,
    UNIQUE (org_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_memberships_org ON memberships(org_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);

-- Resources
CREATE TABLE IF NOT EXISTS resources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(512),
    resource_link varchar(2000) NOT NULL,
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    event_id uuid REFERENCES events(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    description text NOT NULL,
    created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    is_featured boolean NOT NULL DEFAULT false,
    category varchar(50),
    type varchar(50),
    downloads integer DEFAULT 0,
    file_size varchar(50),
    format varchar(20)
);

-- Tag join tables
CREATE TABLE IF NOT EXISTS resource_tags (
    resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    tag varchar(255) NOT NULL,
    PRIMARY KEY (resource_id, tag)
);

CREATE TABLE IF NOT EXISTS event_tags (
    event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    tag varchar(255) NOT NULL,
    PRIMARY KEY (event_id, tag)
);

CREATE TABLE IF NOT EXISTS organizations_tags (
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tag varchar(255) NOT NULL,
    PRIMARY KEY (org_id, tag)
);

-- Locations
CREATE TABLE IF NOT EXISTS locations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    address varchar(1000),
    building varchar(255),
    room varchar(128),
    lat numeric,
    lng numeric,
    org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    meeting_id uuid REFERENCES meetings(id) ON DELETE CASCADE,
    event_id uuid REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT locations_only_one_owner CHECK (
        ((org_id IS NOT NULL)::integer + (meeting_id IS NOT NULL)::integer + (event_id IS NOT NULL)::integer) = 1
    )
);

-- ═══════════════════════════════════════════════
-- 3. COMMUNITY / INTERACTION TABLES
-- ═══════════════════════════════════════════════

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title varchar(512) NOT NULL,
    content text NOT NULL,
    priority varchar(20) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low','medium','normal','high','critical','urgent')),
    is_pinned boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    expires_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_announcements_org ON announcements(org_id);

-- Comments (polymorphic: org, event, or resource)
CREATE TABLE IF NOT EXISTS comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    event_id uuid REFERENCES events(id) ON DELETE CASCADE,
    resource_id uuid REFERENCES resources(id) ON DELETE CASCADE,
    parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    CONSTRAINT comments_one_parent CHECK (
        ((org_id IS NOT NULL)::integer + (event_id IS NOT NULL)::integer + (resource_id IS NOT NULL)::integer) = 1
    )
);

CREATE INDEX IF NOT EXISTS idx_comments_org ON comments(org_id);
CREATE INDEX IF NOT EXISTS idx_comments_event ON comments(event_id);
CREATE INDEX IF NOT EXISTS idx_comments_resource ON comments(resource_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

-- Discussions
CREATE TABLE IF NOT EXISTS discussions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title varchar(512) NOT NULL,
    content text NOT NULL,
    is_pinned boolean NOT NULL DEFAULT false,
    vote_count integer DEFAULT 0,
    reply_count integer DEFAULT 0,
    view_count integer DEFAULT 0,
    category varchar(50),
    tags text[],
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_discussions_org ON discussions(org_id);

CREATE TABLE IF NOT EXISTS discussion_replies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id uuid NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion ON discussion_replies(discussion_id);

-- Discussion Votes
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

CREATE INDEX IF NOT EXISTS idx_discussion_votes_disc ON discussion_votes(discussion_id);
CREATE INDEX IF NOT EXISTS idx_reply_votes_reply ON reply_votes(reply_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title varchar(512) NOT NULL,
    message text,
    type varchar(50) NOT NULL DEFAULT 'general'
        CHECK (type IN ('general','event','membership','announcement','achievement','comment','discussion')),
    link varchar(1000),
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE is_read = false;

-- ═══════════════════════════════════════════════
-- 4. CLUB MANAGEMENT TABLES
-- ═══════════════════════════════════════════════

-- Club Proposals
CREATE TABLE IF NOT EXISTS club_proposals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    submitted_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    club_name varchar(255) NOT NULL,
    mission_statement text NOT NULL,
    category varchar(50),
    proposed_advisor varchar(255),
    advisor_email varchar(320),
    justification text,
    constitution_draft text,
    first_year_plan text,
    budget_requirements text,
    meeting_space_needs text,
    meeting_schedule text,
    meeting_location text,
    interested_members text,
    expected_members integer,
    social_links jsonb DEFAULT '{}',
    resource_links jsonb DEFAULT '[]',
    logo_url text,
    poster_url text,
    status varchar(30) NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted','under_review','approved','denied','needs_revision')),
    admin_notes text,
    submitted_at timestamptz NOT NULL DEFAULT now(),
    reviewed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_club_proposals_status ON club_proposals(status);
CREATE INDEX IF NOT EXISTS idx_club_proposals_submitted_by ON club_proposals(submitted_by);

-- Advisors
CREATE TABLE IF NOT EXISTS advisors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name varchar(255) NOT NULL,
    email varchar(320),
    phone varchar(32),
    department varchar(255),
    title varchar(255),
    is_primary boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_advisors_org ON advisors(org_id);

-- ═══════════════════════════════════════════════
-- 5. EVENTS & REGISTRATION
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS event_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status varchar(20) NOT NULL DEFAULT 'registered'
        CHECK (status IN ('registered','waitlisted','cancelled','attended')),
    registered_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id);

-- ═══════════════════════════════════════════════
-- 6. PROJECTS, SPONSORS, MEETING NOTES, HISTORY
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title varchar(512) NOT NULL,
    description text,
    status varchar(30) NOT NULL DEFAULT 'in_progress'
        CHECK (status IN ('planning','in_progress','completed','on_hold')),
    start_date date,
    end_date date,
    image_url text,
    external_url text,
    created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(org_id);

CREATE TABLE IF NOT EXISTS sponsors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    name varchar(255) NOT NULL,
    description text,
    logo_url text,
    website varchar(1000),
    tier varchar(30) DEFAULT 'supporter'
        CHECK (tier IN ('supporter','bronze','silver','gold','platinum')),
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meeting_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id uuid REFERENCES meetings(id) ON DELETE CASCADE,
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title varchar(512),
    content text NOT NULL,
    recorded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    meeting_date date NOT NULL,
    attendee_count integer,
    action_items jsonb DEFAULT '[]',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meeting_notes_org ON meeting_notes(org_id);

CREATE TABLE IF NOT EXISTS club_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_type varchar(50) NOT NULL
        CHECK (event_type IN ('founded','achievement','milestone','leadership_change',
            'event_highlight','membership_milestone','competition_result')),
    title varchar(512) NOT NULL,
    description text,
    event_date date NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_club_history_org ON club_history(org_id);

-- ═══════════════════════════════════════════════
-- 7. USER SKILLS, ACHIEVEMENTS, SERVICE HOURS
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_skills (
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill varchar(255) NOT NULL,
    level varchar(20) DEFAULT 'beginner'
        CHECK (level IN ('beginner','intermediate','advanced','expert')),
    PRIMARY KEY (user_id, skill)
);

CREATE TABLE IF NOT EXISTS achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    description text,
    icon varchar(100),
    category varchar(50),
    points integer NOT NULL DEFAULT 10,
    rarity varchar(20) DEFAULT 'common'
        CHECK (rarity IN ('common','uncommon','rare','epic','legendary'))
);

CREATE TABLE IF NOT EXISTS user_achievements (
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS service_hours (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    event_id uuid REFERENCES events(id) ON DELETE SET NULL,
    hours numeric(5,2) NOT NULL,
    description text,
    date date NOT NULL,
    verified boolean NOT NULL DEFAULT false,
    verified_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_hours_user ON service_hours(user_id);
CREATE INDEX IF NOT EXISTS idx_service_hours_org ON service_hours(org_id);

-- ═══════════════════════════════════════════════
-- 8. ANALYTICS & STATISTICS
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS org_analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
    total_members integer DEFAULT 0,
    active_members integer DEFAULT 0,
    events_held integer DEFAULT 0,
    avg_attendance numeric(5,2) DEFAULT 0,
    new_members integer DEFAULT 0,
    retention_rate numeric(5,2) DEFAULT 0,
    engagement_score numeric(5,2) DEFAULT 0,
    meetings_held integer DEFAULT 0,
    service_hours_total numeric(7,2) DEFAULT 0,
    competition_wins integer DEFAULT 0,
    UNIQUE(org_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_org_analytics_org ON org_analytics(org_id);

-- ═══════════════════════════════════════════════
-- 9. DONATIONS / FUNDRAISING
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS donations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    donor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    donor_name varchar(255),
    donor_email varchar(320),
    amount numeric(10,2) NOT NULL,
    message text,
    is_recurring boolean NOT NULL DEFAULT false,
    stripe_session_id varchar(255),
    status varchar(20) NOT NULL DEFAULT 'completed'
        CHECK (status IN ('pending','completed','refunded','failed')),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_donations_org ON donations(org_id);

-- ═══════════════════════════════════════════════
-- 10. QUIZZES & INTERACTIVE
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS quizzes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    questions jsonb NOT NULL DEFAULT '[]'::jsonb,
    is_published boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    answers jsonb NOT NULL DEFAULT '[]'::jsonb,
    score integer,
    completed_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(quiz_id, user_id)
);

-- Uploads (user-uploaded resources/files)
CREATE TABLE IF NOT EXISTS uploads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    title text,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_type text,
    file_size integer,
    description text,
    category varchar(50),
    tags text[],
    likes integer DEFAULT 0,
    download_count integer DEFAULT 0,
    is_approved boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_uploads_user ON uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_uploads_org ON uploads(org_id);
CREATE INDEX IF NOT EXISTS idx_uploads_approved ON uploads(is_approved);

-- ═══════════════════════════════════════════════
-- 11. RATINGS, BOOKMARKS, ACTIVITY LOG
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ratings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    UNIQUE(org_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_org ON ratings(org_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);

CREATE TABLE IF NOT EXISTS bookmarks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    event_id uuid REFERENCES events(id) ON DELETE CASCADE,
    resource_id uuid REFERENCES resources(id) ON DELETE CASCADE,
    discussion_id uuid REFERENCES discussions(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT bookmarks_one_target CHECK (
        ((org_id IS NOT NULL)::integer + (event_id IS NOT NULL)::integer +
         (resource_id IS NOT NULL)::integer + (discussion_id IS NOT NULL)::integer) = 1
    )
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);

CREATE TABLE IF NOT EXISTS activity_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    action varchar(100) NOT NULL,
    target_type varchar(50),
    target_id uuid,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_org ON activity_log(org_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);

-- ═══════════════════════════════════════════════
-- 12. HUB TABLES
-- ═══════════════════════════════════════════════

-- Club Ideas (voting system)
CREATE TABLE IF NOT EXISTS club_ideas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title varchar(255) NOT NULL,
    description text NOT NULL,
    category varchar(50),
    votes integer DEFAULT 0,
    status varchar(30) DEFAULT 'open'
        CHECK (status IN ('open','under_review','approved','declined')),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_club_ideas_status ON club_ideas(status);

CREATE TABLE IF NOT EXISTS club_idea_votes (
    idea_id uuid NOT NULL REFERENCES club_ideas(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vote smallint NOT NULL DEFAULT 1 CHECK (vote IN (-1, 1)),
    PRIMARY KEY (idea_id, user_id)
);

-- Mentors
CREATE TABLE IF NOT EXISTS mentors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    name varchar(255) NOT NULL,
    bio text,
    expertise text[],
    availability varchar(100),
    avatar_url text,
    is_alumni boolean DEFAULT false,
    graduation_year integer,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mentors_active ON mentors(is_active) WHERE is_active = true;

CREATE TABLE IF NOT EXISTS mentorship_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id uuid NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    mentee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message text,
    status varchar(20) DEFAULT 'pending'
        CHECK (status IN ('pending','accepted','declined','completed')),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(mentor_id, mentee_id)
);

-- Success Stories
CREATE TABLE IF NOT EXISTS success_stories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    title varchar(255) NOT NULL,
    content text NOT NULL,
    image_url text,
    is_featured boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_success_stories_featured ON success_stories(is_featured) WHERE is_featured = true;

-- Collaborations
CREATE TABLE IF NOT EXISTS collaborations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title varchar(255) NOT NULL,
    description text NOT NULL,
    type varchar(50) DEFAULT 'event'
        CHECK (type IN ('event','project','fundraiser','competition','other')),
    status varchar(20) DEFAULT 'open'
        CHECK (status IN ('open','in_progress','completed','cancelled')),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collaboration_participants (
    collaboration_id uuid NOT NULL REFERENCES collaborations(id) ON DELETE CASCADE,
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    joined_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (collaboration_id, org_id)
);

-- Upload Likes
CREATE TABLE IF NOT EXISTS upload_likes (
    upload_id uuid NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (upload_id, user_id)
);

-- ═══════════════════════════════════════════════
-- 13. HELPER FUNCTIONS
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.is_org_admin(target_org_id uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.memberships m
        WHERE m.org_id = target_org_id
          AND m.user_id = auth.uid()
          AND m.user_permissions = 'admin'
    );
$$;

CREATE OR REPLACE FUNCTION public.is_org_officer_or_admin(target_org_id uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.memberships m
        WHERE m.org_id = target_org_id
          AND m.user_id = auth.uid()
          AND m.user_permissions IN ('officer', 'admin')
    );
$$;

REVOKE ALL ON FUNCTION public.is_org_admin(uuid) FROM public;
REVOKE ALL ON FUNCTION public.is_org_officer_or_admin(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.is_org_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_officer_or_admin(uuid) TO authenticated;

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
-- 14. TRIGGERS
-- ═══════════════════════════════════════════════

-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    meta jsonb;
BEGIN
    meta := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
    INSERT INTO public.profiles (
        id, email, name, grade, school, is_adult,
        bio, phone_number
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(meta->>'name', ''),
        meta->>'grade',
        meta->>'school',
        COALESCE((meta->>'is_adult')::boolean, false),
        meta->>'bio',
        meta->>'phone_number'
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        grade = EXCLUDED.grade,
        school = EXCLUDED.school,
        is_adult = EXCLUDED.is_adult;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update member_count
CREATE OR REPLACE FUNCTION public.update_org_member_count()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE organizations SET member_count = (
            SELECT count(*) FROM memberships WHERE org_id = OLD.org_id AND is_approved = true
        ) WHERE id = OLD.org_id;
        RETURN OLD;
    ELSE
        UPDATE organizations SET member_count = (
            SELECT count(*) FROM memberships WHERE org_id = NEW.org_id AND is_approved = true
        ) WHERE id = NEW.org_id;
        RETURN NEW;
    END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_member_count ON memberships;
CREATE TRIGGER trg_update_member_count
    AFTER INSERT OR UPDATE OR DELETE ON memberships
    FOR EACH ROW EXECUTE FUNCTION public.update_org_member_count();

-- Auto-update event attendee count
CREATE OR REPLACE FUNCTION public.update_event_attendee_count()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE events SET current_attendees = (
            SELECT count(*) FROM event_registrations
            WHERE event_id = OLD.event_id AND status IN ('registered','attended')
        ) WHERE id = OLD.event_id;
        RETURN OLD;
    ELSE
        UPDATE events SET current_attendees = (
            SELECT count(*) FROM event_registrations
            WHERE event_id = NEW.event_id AND status IN ('registered','attended')
        ) WHERE id = NEW.event_id;
        RETURN NEW;
    END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_attendee_count ON event_registrations;
CREATE TRIGGER trg_update_attendee_count
    AFTER INSERT OR UPDATE OR DELETE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION public.update_event_attendee_count();

-- Auto-update upload like count
CREATE OR REPLACE FUNCTION public.update_upload_likes()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE uploads SET likes = (
            SELECT count(*) FROM upload_likes WHERE upload_id = OLD.upload_id
        ) WHERE id = OLD.upload_id;
        RETURN OLD;
    ELSE
        UPDATE uploads SET likes = (
            SELECT count(*) FROM upload_likes WHERE upload_id = NEW.upload_id
        ) WHERE id = NEW.upload_id;
        RETURN NEW;
    END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_upload_likes ON upload_likes;
CREATE TRIGGER trg_update_upload_likes
    AFTER INSERT OR DELETE ON upload_likes
    FOR EACH ROW EXECUTE FUNCTION public.update_upload_likes();

-- Auto-update club_idea vote count
CREATE OR REPLACE FUNCTION public.update_idea_votes()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE club_ideas SET votes = (
            SELECT COALESCE(SUM(vote), 0) FROM club_idea_votes WHERE idea_id = OLD.idea_id
        ) WHERE id = OLD.idea_id;
        RETURN OLD;
    ELSE
        UPDATE club_ideas SET votes = (
            SELECT COALESCE(SUM(vote), 0) FROM club_idea_votes WHERE idea_id = NEW.idea_id
        ) WHERE id = NEW.idea_id;
        RETURN NEW;
    END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_idea_votes ON club_idea_votes;
CREATE TRIGGER trg_update_idea_votes
    AFTER INSERT OR UPDATE OR DELETE ON club_idea_votes
    FOR EACH ROW EXECUTE FUNCTION public.update_idea_votes();

-- Auto-update discussion vote count
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

-- Auto-update discussion reply count
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

-- Auto-accumulate service hours on profiles
CREATE OR REPLACE FUNCTION public.update_profile_service_hours()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_user uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN target_user := OLD.user_id;
    ELSE target_user := NEW.user_id; END IF;
    UPDATE profiles SET total_service_hours = (
        SELECT COALESCE(SUM(hours), 0) FROM service_hours WHERE user_id = target_user AND verified = true
    ) WHERE id = target_user;
    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_profile_service_hours ON service_hours;
CREATE TRIGGER trg_update_profile_service_hours
    AFTER INSERT OR UPDATE OR DELETE ON service_hours
    FOR EACH ROW EXECUTE FUNCTION public.update_profile_service_hours();

-- ═══════════════════════════════════════════════
-- 15. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ═══════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reply_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_idea_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════
-- 16. RLS POLICIES (DROP IF EXISTS for safe re-runs)
-- ═══════════════════════════════════════════════

-- Profiles
DROP POLICY IF EXISTS profiles_select ON profiles;
CREATE POLICY profiles_select ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS profiles_insert ON profiles;
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS profiles_update ON profiles;
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Organizations
DROP POLICY IF EXISTS organizations_select ON organizations;
CREATE POLICY organizations_select ON organizations FOR SELECT USING (true);
DROP POLICY IF EXISTS organizations_insert ON organizations;
CREATE POLICY organizations_insert ON organizations FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);
DROP POLICY IF EXISTS organizations_update ON organizations;
CREATE POLICY organizations_update ON organizations FOR UPDATE
    USING (auth.uid() = created_by);
DROP POLICY IF EXISTS organizations_delete ON organizations;
CREATE POLICY organizations_delete ON organizations FOR DELETE
    USING (auth.uid() = created_by);

-- Organization tags
DROP POLICY IF EXISTS org_tags_select ON organizations_tags;
CREATE POLICY org_tags_select ON organizations_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS org_tags_insert ON organizations_tags;
CREATE POLICY org_tags_insert ON organizations_tags FOR INSERT
    WITH CHECK (public.is_org_admin(org_id));
DROP POLICY IF EXISTS org_tags_update ON organizations_tags;
CREATE POLICY org_tags_update ON organizations_tags FOR UPDATE
    USING (public.is_org_admin(org_id));
DROP POLICY IF EXISTS org_tags_delete ON organizations_tags;
CREATE POLICY org_tags_delete ON organizations_tags FOR DELETE
    USING (public.is_org_admin(org_id));

-- Memberships
DROP POLICY IF EXISTS memberships_select ON memberships;
CREATE POLICY memberships_select ON memberships FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.is_org_officer_or_admin(org_id));
DROP POLICY IF EXISTS memberships_insert ON memberships;
CREATE POLICY memberships_insert ON memberships FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS memberships_update ON memberships;
CREATE POLICY memberships_update ON memberships FOR UPDATE TO authenticated
    USING (public.is_org_officer_or_admin(org_id))
    WITH CHECK (public.is_org_officer_or_admin(org_id));
DROP POLICY IF EXISTS memberships_delete ON memberships;
CREATE POLICY memberships_delete ON memberships FOR DELETE TO authenticated
    USING (auth.uid() = user_id OR public.is_org_admin(org_id));

-- Meetings
DROP POLICY IF EXISTS meetings_select ON meetings;
CREATE POLICY meetings_select ON meetings FOR SELECT USING (true);
DROP POLICY IF EXISTS meetings_insert ON meetings;
CREATE POLICY meetings_insert ON meetings FOR INSERT WITH CHECK (public.is_org_admin(org_id));
DROP POLICY IF EXISTS meetings_update ON meetings;
CREATE POLICY meetings_update ON meetings FOR UPDATE USING (public.is_org_admin(org_id));
DROP POLICY IF EXISTS meetings_delete ON meetings;
CREATE POLICY meetings_delete ON meetings FOR DELETE USING (public.is_org_admin(org_id));

-- Events
DROP POLICY IF EXISTS events_select ON events;
CREATE POLICY events_select ON events FOR SELECT USING (true);
DROP POLICY IF EXISTS events_insert ON events;
CREATE POLICY events_insert ON events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS events_update ON events;
CREATE POLICY events_update ON events FOR UPDATE USING (auth.uid() = created_by OR public.is_org_admin(org_id));
DROP POLICY IF EXISTS events_delete ON events;
CREATE POLICY events_delete ON events FOR DELETE USING (auth.uid() = created_by OR public.is_org_admin(org_id));

-- Event tags
DROP POLICY IF EXISTS event_tags_select ON event_tags;
CREATE POLICY event_tags_select ON event_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS event_tags_insert ON event_tags;
CREATE POLICY event_tags_insert ON event_tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS event_tags_delete ON event_tags;
CREATE POLICY event_tags_delete ON event_tags FOR DELETE USING (auth.uid() IS NOT NULL);

-- Resources
DROP POLICY IF EXISTS resources_select ON resources;
CREATE POLICY resources_select ON resources FOR SELECT USING (true);
DROP POLICY IF EXISTS resources_insert ON resources;
CREATE POLICY resources_insert ON resources FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS resources_update ON resources;
CREATE POLICY resources_update ON resources FOR UPDATE USING (auth.uid() = created_by);
DROP POLICY IF EXISTS resources_delete ON resources;
CREATE POLICY resources_delete ON resources FOR DELETE USING (auth.uid() = created_by);

-- Resource tags
DROP POLICY IF EXISTS resource_tags_select ON resource_tags;
CREATE POLICY resource_tags_select ON resource_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS resource_tags_insert ON resource_tags;
CREATE POLICY resource_tags_insert ON resource_tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS resource_tags_delete ON resource_tags;
CREATE POLICY resource_tags_delete ON resource_tags FOR DELETE USING (auth.uid() IS NOT NULL);

-- Locations
DROP POLICY IF EXISTS locations_select ON locations;
CREATE POLICY locations_select ON locations FOR SELECT USING (true);
DROP POLICY IF EXISTS locations_insert ON locations;
CREATE POLICY locations_insert ON locations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Announcements
DROP POLICY IF EXISTS announcements_select ON announcements;
CREATE POLICY announcements_select ON announcements FOR SELECT USING (true);
DROP POLICY IF EXISTS announcements_insert ON announcements;
CREATE POLICY announcements_insert ON announcements FOR INSERT
    WITH CHECK (auth.uid() = author_id AND public.is_org_creator(org_id));
DROP POLICY IF EXISTS announcements_update ON announcements;
CREATE POLICY announcements_update ON announcements FOR UPDATE
    USING (auth.uid() = author_id AND public.is_org_creator(org_id));
DROP POLICY IF EXISTS announcements_delete ON announcements;
CREATE POLICY announcements_delete ON announcements FOR DELETE
    USING (public.is_org_creator(org_id));

-- Comments
DROP POLICY IF EXISTS comments_select ON comments;
CREATE POLICY comments_select ON comments FOR SELECT USING (true);
DROP POLICY IF EXISTS comments_insert ON comments;
CREATE POLICY comments_insert ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS comments_update ON comments;
CREATE POLICY comments_update ON comments FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS comments_delete ON comments;
CREATE POLICY comments_delete ON comments FOR DELETE
    USING (auth.uid() = user_id OR (org_id IS NOT NULL AND public.is_org_admin(org_id)));

-- Discussions
DROP POLICY IF EXISTS discussions_select ON discussions;
CREATE POLICY discussions_select ON discussions FOR SELECT USING (true);
DROP POLICY IF EXISTS discussions_insert ON discussions;
CREATE POLICY discussions_insert ON discussions FOR INSERT WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS discussions_update ON discussions;
CREATE POLICY discussions_update ON discussions FOR UPDATE USING (auth.uid() = author_id);
DROP POLICY IF EXISTS discussions_delete ON discussions;
CREATE POLICY discussions_delete ON discussions FOR DELETE
    USING (auth.uid() = author_id OR (org_id IS NOT NULL AND public.is_org_admin(org_id)));

-- Discussion Replies
DROP POLICY IF EXISTS replies_select ON discussion_replies;
CREATE POLICY replies_select ON discussion_replies FOR SELECT USING (true);
DROP POLICY IF EXISTS replies_insert ON discussion_replies;
CREATE POLICY replies_insert ON discussion_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS replies_update ON discussion_replies;
CREATE POLICY replies_update ON discussion_replies FOR UPDATE USING (auth.uid() = author_id);
DROP POLICY IF EXISTS replies_delete ON discussion_replies;
CREATE POLICY replies_delete ON discussion_replies FOR DELETE USING (auth.uid() = author_id);

-- Discussion Votes
DROP POLICY IF EXISTS dv_select ON discussion_votes;
CREATE POLICY dv_select ON discussion_votes FOR SELECT USING (true);
DROP POLICY IF EXISTS dv_insert ON discussion_votes;
CREATE POLICY dv_insert ON discussion_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS dv_update ON discussion_votes;
CREATE POLICY dv_update ON discussion_votes FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS dv_delete ON discussion_votes;
CREATE POLICY dv_delete ON discussion_votes FOR DELETE USING (auth.uid() = user_id);

-- Reply Votes
DROP POLICY IF EXISTS rv_select ON reply_votes;
CREATE POLICY rv_select ON reply_votes FOR SELECT USING (true);
DROP POLICY IF EXISTS rv_insert ON reply_votes;
CREATE POLICY rv_insert ON reply_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS rv_update ON reply_votes;
CREATE POLICY rv_update ON reply_votes FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS rv_delete ON reply_votes;
CREATE POLICY rv_delete ON reply_votes FOR DELETE USING (auth.uid() = user_id);

-- Notifications
DROP POLICY IF EXISTS notifications_select ON notifications;
CREATE POLICY notifications_select ON notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS notifications_update ON notifications;
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS notifications_delete ON notifications;
CREATE POLICY notifications_delete ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Club Proposals
DROP POLICY IF EXISTS proposals_select ON club_proposals;
CREATE POLICY proposals_select ON club_proposals FOR SELECT USING (true);
DROP POLICY IF EXISTS proposals_insert ON club_proposals;
CREATE POLICY proposals_insert ON club_proposals FOR INSERT WITH CHECK (auth.uid() = submitted_by);
DROP POLICY IF EXISTS proposals_update ON club_proposals;
CREATE POLICY proposals_update ON club_proposals FOR UPDATE USING (auth.uid() = submitted_by);

-- Event Registrations
DROP POLICY IF EXISTS event_reg_select ON event_registrations;
CREATE POLICY event_reg_select ON event_registrations FOR SELECT USING (true);
DROP POLICY IF EXISTS event_reg_insert ON event_registrations;
CREATE POLICY event_reg_insert ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS event_reg_update ON event_registrations;
CREATE POLICY event_reg_update ON event_registrations FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS event_reg_delete ON event_registrations;
CREATE POLICY event_reg_delete ON event_registrations FOR DELETE USING (auth.uid() = user_id);

-- Projects
DROP POLICY IF EXISTS projects_select ON projects;
CREATE POLICY projects_select ON projects FOR SELECT USING (true);
DROP POLICY IF EXISTS projects_insert ON projects;
CREATE POLICY projects_insert ON projects FOR INSERT WITH CHECK (public.is_org_officer_or_admin(org_id));
DROP POLICY IF EXISTS projects_update ON projects;
CREATE POLICY projects_update ON projects FOR UPDATE USING (public.is_org_officer_or_admin(org_id));

-- Sponsors
DROP POLICY IF EXISTS sponsors_select ON sponsors;
CREATE POLICY sponsors_select ON sponsors FOR SELECT USING (true);

-- Meeting Notes
DROP POLICY IF EXISTS meeting_notes_select ON meeting_notes;
CREATE POLICY meeting_notes_select ON meeting_notes FOR SELECT USING (true);
DROP POLICY IF EXISTS meeting_notes_insert ON meeting_notes;
CREATE POLICY meeting_notes_insert ON meeting_notes FOR INSERT WITH CHECK (public.is_org_officer_or_admin(org_id));

-- Club History
DROP POLICY IF EXISTS club_history_select ON club_history;
CREATE POLICY club_history_select ON club_history FOR SELECT USING (true);

-- User Skills
DROP POLICY IF EXISTS user_skills_select ON user_skills;
CREATE POLICY user_skills_select ON user_skills FOR SELECT USING (true);
DROP POLICY IF EXISTS user_skills_insert ON user_skills;
CREATE POLICY user_skills_insert ON user_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS user_skills_delete ON user_skills;
CREATE POLICY user_skills_delete ON user_skills FOR DELETE USING (auth.uid() = user_id);

-- Achievements
DROP POLICY IF EXISTS achievements_select ON achievements;
CREATE POLICY achievements_select ON achievements FOR SELECT USING (true);

-- User Achievements
DROP POLICY IF EXISTS user_achievements_select ON user_achievements;
CREATE POLICY user_achievements_select ON user_achievements FOR SELECT USING (true);

-- Org Analytics
DROP POLICY IF EXISTS org_analytics_select ON org_analytics;
CREATE POLICY org_analytics_select ON org_analytics FOR SELECT USING (true);

-- Donations
DROP POLICY IF EXISTS donations_select ON donations;
CREATE POLICY donations_select ON donations FOR SELECT USING (true);
DROP POLICY IF EXISTS donations_insert ON donations;
CREATE POLICY donations_insert ON donations FOR INSERT WITH CHECK (true);

-- Service Hours
DROP POLICY IF EXISTS service_hours_select ON service_hours;
CREATE POLICY service_hours_select ON service_hours FOR SELECT
    USING (auth.uid() = user_id OR (org_id IS NOT NULL AND public.is_org_officer_or_admin(org_id)));
DROP POLICY IF EXISTS service_hours_insert ON service_hours;
CREATE POLICY service_hours_insert ON service_hours FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS service_hours_update ON service_hours;
CREATE POLICY service_hours_update ON service_hours FOR UPDATE
    USING (auth.uid() = verified_by OR public.is_org_officer_or_admin(org_id));

-- Quizzes
DROP POLICY IF EXISTS quizzes_select ON quizzes;
CREATE POLICY quizzes_select ON quizzes FOR SELECT USING (is_published OR auth.uid() = created_by);
DROP POLICY IF EXISTS quizzes_insert ON quizzes;
CREATE POLICY quizzes_insert ON quizzes FOR INSERT WITH CHECK (auth.uid() = created_by);
DROP POLICY IF EXISTS quizzes_update ON quizzes;
CREATE POLICY quizzes_update ON quizzes FOR UPDATE USING (auth.uid() = created_by);

-- Quiz Results
DROP POLICY IF EXISTS quiz_results_select ON quiz_results;
CREATE POLICY quiz_results_select ON quiz_results FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS quiz_results_insert ON quiz_results;
CREATE POLICY quiz_results_insert ON quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Uploads
DROP POLICY IF EXISTS uploads_select ON uploads;
CREATE POLICY uploads_select ON uploads FOR SELECT USING (true);
DROP POLICY IF EXISTS uploads_insert ON uploads;
CREATE POLICY uploads_insert ON uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS uploads_update ON uploads;
CREATE POLICY uploads_update ON uploads FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS uploads_delete ON uploads;
CREATE POLICY uploads_delete ON uploads FOR DELETE USING (auth.uid() = user_id);

-- Ratings
DROP POLICY IF EXISTS ratings_select ON ratings;
CREATE POLICY ratings_select ON ratings FOR SELECT USING (true);
DROP POLICY IF EXISTS ratings_insert ON ratings;
CREATE POLICY ratings_insert ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS ratings_update ON ratings;
CREATE POLICY ratings_update ON ratings FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS ratings_delete ON ratings;
CREATE POLICY ratings_delete ON ratings FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks
DROP POLICY IF EXISTS bookmarks_select ON bookmarks;
CREATE POLICY bookmarks_select ON bookmarks FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS bookmarks_insert ON bookmarks;
CREATE POLICY bookmarks_insert ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS bookmarks_delete ON bookmarks;
CREATE POLICY bookmarks_delete ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Activity Log
DROP POLICY IF EXISTS activity_log_select ON activity_log;
CREATE POLICY activity_log_select ON activity_log FOR SELECT USING (
    auth.uid() = user_id OR (org_id IS NOT NULL AND public.is_org_officer_or_admin(org_id))
);
DROP POLICY IF EXISTS activity_log_insert ON activity_log;
CREATE POLICY activity_log_insert ON activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Club Ideas
DROP POLICY IF EXISTS club_ideas_select ON club_ideas;
CREATE POLICY club_ideas_select ON club_ideas FOR SELECT USING (true);
DROP POLICY IF EXISTS club_ideas_insert ON club_ideas;
CREATE POLICY club_ideas_insert ON club_ideas FOR INSERT WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS club_ideas_update ON club_ideas;
CREATE POLICY club_ideas_update ON club_ideas FOR UPDATE USING (auth.uid() = author_id);

-- Club Idea Votes
DROP POLICY IF EXISTS club_idea_votes_select ON club_idea_votes;
CREATE POLICY club_idea_votes_select ON club_idea_votes FOR SELECT USING (true);
DROP POLICY IF EXISTS club_idea_votes_insert ON club_idea_votes;
CREATE POLICY club_idea_votes_insert ON club_idea_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS club_idea_votes_delete ON club_idea_votes;
CREATE POLICY club_idea_votes_delete ON club_idea_votes FOR DELETE USING (auth.uid() = user_id);

-- Mentors
DROP POLICY IF EXISTS mentors_select ON mentors;
CREATE POLICY mentors_select ON mentors FOR SELECT USING (true);
DROP POLICY IF EXISTS mentors_insert ON mentors;
CREATE POLICY mentors_insert ON mentors FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS mentors_update ON mentors;
CREATE POLICY mentors_update ON mentors FOR UPDATE USING (auth.uid() = user_id);

-- Mentorship Requests
DROP POLICY IF EXISTS mentorship_requests_select ON mentorship_requests;
CREATE POLICY mentorship_requests_select ON mentorship_requests FOR SELECT USING (
    auth.uid() = mentee_id OR auth.uid() = (SELECT user_id FROM mentors WHERE id = mentor_id)
);
DROP POLICY IF EXISTS mentorship_requests_insert ON mentorship_requests;
CREATE POLICY mentorship_requests_insert ON mentorship_requests FOR INSERT WITH CHECK (auth.uid() = mentee_id);
DROP POLICY IF EXISTS mentorship_requests_update ON mentorship_requests;
CREATE POLICY mentorship_requests_update ON mentorship_requests FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM mentors WHERE id = mentor_id)
);

-- Success Stories
DROP POLICY IF EXISTS success_stories_select ON success_stories;
CREATE POLICY success_stories_select ON success_stories FOR SELECT USING (true);
DROP POLICY IF EXISTS success_stories_insert ON success_stories;
CREATE POLICY success_stories_insert ON success_stories FOR INSERT WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS success_stories_update ON success_stories;
CREATE POLICY success_stories_update ON success_stories FOR UPDATE USING (auth.uid() = author_id);
DROP POLICY IF EXISTS success_stories_delete ON success_stories;
CREATE POLICY success_stories_delete ON success_stories FOR DELETE USING (auth.uid() = author_id);

-- Collaborations
DROP POLICY IF EXISTS collaborations_select ON collaborations;
CREATE POLICY collaborations_select ON collaborations FOR SELECT USING (true);
DROP POLICY IF EXISTS collaborations_insert ON collaborations;
CREATE POLICY collaborations_insert ON collaborations FOR INSERT WITH CHECK (public.is_org_officer_or_admin(org_id));
DROP POLICY IF EXISTS collaborations_update ON collaborations;
CREATE POLICY collaborations_update ON collaborations FOR UPDATE USING (public.is_org_officer_or_admin(org_id));

-- Collaboration Participants
DROP POLICY IF EXISTS collab_participants_select ON collaboration_participants;
CREATE POLICY collab_participants_select ON collaboration_participants FOR SELECT USING (true);
DROP POLICY IF EXISTS collab_participants_insert ON collaboration_participants;
CREATE POLICY collab_participants_insert ON collaboration_participants FOR INSERT
    WITH CHECK (public.is_org_officer_or_admin(org_id));
DROP POLICY IF EXISTS collab_participants_delete ON collaboration_participants;
CREATE POLICY collab_participants_delete ON collaboration_participants FOR DELETE
    USING (public.is_org_officer_or_admin(org_id));

-- Upload Likes
DROP POLICY IF EXISTS upload_likes_select ON upload_likes;
CREATE POLICY upload_likes_select ON upload_likes FOR SELECT USING (true);
DROP POLICY IF EXISTS upload_likes_insert ON upload_likes;
CREATE POLICY upload_likes_insert ON upload_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS upload_likes_delete ON upload_likes;
CREATE POLICY upload_likes_delete ON upload_likes FOR DELETE USING (auth.uid() = user_id);

-- Advisors
DROP POLICY IF EXISTS advisors_select ON advisors;
CREATE POLICY advisors_select ON advisors FOR SELECT USING (true);
DROP POLICY IF EXISTS advisors_insert ON advisors;
CREATE POLICY advisors_insert ON advisors FOR INSERT WITH CHECK (public.is_org_admin(org_id));
DROP POLICY IF EXISTS advisors_update ON advisors;
CREATE POLICY advisors_update ON advisors FOR UPDATE USING (public.is_org_admin(org_id));
DROP POLICY IF EXISTS advisors_delete ON advisors;
CREATE POLICY advisors_delete ON advisors FOR DELETE USING (public.is_org_admin(org_id));

-- ═══════════════════════════════════════════════
-- 17. VIEWS
-- ═══════════════════════════════════════════════

CREATE OR REPLACE VIEW club_directory AS
SELECT
    o.id, o.name, o.slug, o.description, o.category,
    o.meeting_schedule, o.meeting_location, o.advisor_name,
    o.contact_email, o.logo_url, o.member_count, o.founded_date,
    o.tags, o.website, o.is_featured, o.created_by, o.created_at,
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

CREATE OR REPLACE VIEW my_clubs AS
SELECT
    o.id, o.name, o.slug, o.description, o.category,
    o.is_published, o.is_featured, o.created_at, o.member_count, o.tags,
    (SELECT count(*) FROM announcements a WHERE a.org_id = o.id) AS announcements_count,
    (SELECT count(*) FROM events e        WHERE e.org_id = o.id) AS events_count
FROM organizations o
WHERE o.created_by = auth.uid();

CREATE OR REPLACE VIEW community_uploads AS
SELECT
    u.id, u.user_id,
    p.name       AS author_name,
    p.avatar_url AS author_avatar,
    u.title, u.file_name, u.file_url, u.file_type, u.file_size,
    u.description, u.category, u.tags, u.likes, u.download_count,
    u.org_id,
    o.name AS org_name,
    u.created_at
FROM uploads u
JOIN profiles p ON p.id = u.user_id
LEFT JOIN organizations o ON o.id = u.org_id
WHERE u.is_approved = true
ORDER BY u.created_at DESC;

CREATE OR REPLACE VIEW discussion_threads AS
SELECT
    d.id, d.org_id,
    o.name       AS org_name,
    d.author_id,
    p.name       AS author_name,
    p.avatar_url AS author_avatar,
    d.title, d.content, d.is_pinned, d.category, d.tags,
    d.vote_count, d.reply_count, d.view_count,
    d.created_at, d.updated_at
FROM discussions d
JOIN profiles p ON p.id = d.author_id
LEFT JOIN organizations o ON o.id = d.org_id
ORDER BY d.is_pinned DESC, d.created_at DESC;

-- ═══════════════════════════════════════════════
-- 18. STORAGE BUCKETS
-- ═══════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
    CREATE POLICY avatars_public_read ON storage.objects
        FOR SELECT USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY avatars_authenticated_insert ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY avatars_owner_update ON storage.objects
        FOR UPDATE USING (bucket_id = 'avatars' AND owner = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY avatars_owner_delete ON storage.objects
        FOR DELETE USING (bucket_id = 'avatars' AND owner = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

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

-- ═══════════════════════════════════════════════
-- 19. REALTIME SUBSCRIPTIONS
-- ═══════════════════════════════════════════════

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE discussions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE discussion_replies;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE comments;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMIT;
