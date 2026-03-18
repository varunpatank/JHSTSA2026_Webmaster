-- ═══════════════════════════════════════════════════════════════════════
-- Migration 009: FINAL COMPLETE SCHEMA (CLEAN SLATE)
-- Drops ALL previous objects, then recreates the entire schema fresh.
-- This replaces migrations 001–008 entirely.
--
-- Supports:
--   • Auth (login/signup via Supabase Auth)
--   • Profiles with avatar, bio, grade, school
--   • Club creation → appears on Discover, creator shown, manageable
--   • Events stored in DB
--   • Chat messages stored in DB (real-time)
--   • Resource uploads & community file sharing
--   • Discussions, ideas, stories, collaborations
--   • Donations (Stripe), achievements, service hours
--   • All RLS policies, triggers, views, indexes
--   • Storage buckets (avatars, uploads)
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ═══════════════════════════════════════════════
-- 0. DROP EVERYTHING (clean slate)
-- ═══════════════════════════════════════════════

-- Drop all views first (try TABLE then VIEW in case object type was changed)
DO $$ BEGIN
    DROP TABLE IF EXISTS club_directory CASCADE;
    DROP TABLE IF EXISTS my_clubs CASCADE;
    DROP TABLE IF EXISTS user_statistics CASCADE;
    DROP TABLE IF EXISTS club_statistics CASCADE;
    DROP TABLE IF EXISTS community_uploads CASCADE;
    DROP TABLE IF EXISTS discussion_threads CASCADE;
    DROP TABLE IF EXISTS user_club_enrollments CASCADE;
    DROP TABLE IF EXISTS club_member_list CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DROP VIEW IF EXISTS club_directory CASCADE;
DROP VIEW IF EXISTS my_clubs CASCADE;
DROP VIEW IF EXISTS user_statistics CASCADE;
DROP VIEW IF EXISTS club_statistics CASCADE;
DROP VIEW IF EXISTS community_uploads CASCADE;
DROP VIEW IF EXISTS discussion_threads CASCADE;
DROP VIEW IF EXISTS user_club_enrollments CASCADE;
DROP VIEW IF EXISTS club_member_list CASCADE;

-- Drop all triggers (wrapped in exception handler in case tables are already gone)
DO $$ BEGIN
    DROP TRIGGER IF EXISTS trg_update_member_count ON memberships;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
    DROP TRIGGER IF EXISTS trg_update_attendee_count ON event_registrations;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
    DROP TRIGGER IF EXISTS trg_update_upload_likes ON upload_likes;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
    DROP TRIGGER IF EXISTS trg_update_idea_votes ON club_idea_votes;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
    DROP TRIGGER IF EXISTS trg_update_discussion_vote_count ON discussion_votes;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
    DROP TRIGGER IF EXISTS trg_discussion_vote ON discussion_votes;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
    DROP TRIGGER IF EXISTS trg_update_discussion_reply_count ON discussion_replies;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
    DROP TRIGGER IF EXISTS trg_discussion_reply ON discussion_replies;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
    DROP TRIGGER IF EXISTS trg_update_profile_service_hours ON service_hours;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- Drop all functions
DROP FUNCTION IF EXISTS public.update_org_member_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_event_attendee_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_upload_likes() CASCADE;
DROP FUNCTION IF EXISTS public.update_idea_votes() CASCADE;
DROP FUNCTION IF EXISTS public.update_discussion_vote_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_discussion_reply_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_profile_service_hours() CASCADE;
DROP FUNCTION IF EXISTS public.is_org_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_org_officer_or_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_org_creator(uuid) CASCADE;

-- Drop all tables (order matters for foreign keys — children first)
DROP TABLE IF EXISTS collaboration_participants CASCADE;
DROP TABLE IF EXISTS collaborations CASCADE;
DROP TABLE IF EXISTS success_stories CASCADE;
DROP TABLE IF EXISTS mentorship_requests CASCADE;
DROP TABLE IF EXISTS mentors CASCADE;
DROP TABLE IF EXISTS club_idea_votes CASCADE;
DROP TABLE IF EXISTS club_ideas CASCADE;
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS upload_likes CASCADE;
DROP TABLE IF EXISTS uploads CASCADE;
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS org_analytics CASCADE;
DROP TABLE IF EXISTS service_hours CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS advisors CASCADE;
DROP TABLE IF EXISTS club_history CASCADE;
DROP TABLE IF EXISTS meeting_notes CASCADE;
DROP TABLE IF EXISTS sponsors CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS club_proposals CASCADE;
DROP TABLE IF EXISTS chat_channel_members CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_channels CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reply_votes CASCADE;
DROP TABLE IF EXISTS discussion_votes CASCADE;
DROP TABLE IF EXISTS discussion_replies CASCADE;
DROP TABLE IF EXISTS discussions CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS organizations_tags CASCADE;
DROP TABLE IF EXISTS event_tags CASCADE;
DROP TABLE IF EXISTS resource_tags CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop enum
DROP TYPE IF EXISTS user_permissions CASCADE;

-- ═══════════════════════════════════════════════
-- 1. ENUMS
-- ═══════════════════════════════════════════════

CREATE TYPE user_permissions AS ENUM ('admin','officer','parent','teacher','partner','member');

-- ═══════════════════════════════════════════════
-- 2. PROFILES
-- ═══════════════════════════════════════════════

CREATE TABLE profiles (
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

-- ═══════════════════════════════════════════════
-- 3. ORGANIZATIONS (clubs)
-- ═══════════════════════════════════════════════

CREATE TABLE organizations (
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
    is_published boolean NOT NULL DEFAULT false,
    is_featured boolean NOT NULL DEFAULT false,
    member_count integer DEFAULT 0,
    logo_url text,
    banner_url text,
    social_links jsonb DEFAULT '{}',
    advisor_name text,
    contact_email varchar(255),
    tags text[],
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_organizations_created_by ON organizations(created_by);
CREATE INDEX idx_organizations_published  ON organizations(is_published);

-- ═══════════════════════════════════════════════
-- 4. MEMBERSHIPS
-- ═══════════════════════════════════════════════

CREATE TABLE memberships (
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

CREATE INDEX idx_memberships_org ON memberships(org_id);
CREATE INDEX idx_memberships_user ON memberships(user_id);

-- ═══════════════════════════════════════════════
-- 5. MEETINGS
-- ═══════════════════════════════════════════════

CREATE TABLE meetings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    frequency text,
    details text,
    next_occurrence timestamptz
);

CREATE INDEX idx_meetings_org ON meetings(org_id);

-- ═══════════════════════════════════════════════
-- 6. EVENTS
-- ═══════════════════════════════════════════════

CREATE TABLE events (
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

CREATE INDEX idx_events_org ON events(org_id);
CREATE INDEX idx_events_time ON events(time);
CREATE INDEX idx_events_created_by ON events(created_by);

-- Event Registrations / RSVP
CREATE TABLE event_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status varchar(20) NOT NULL DEFAULT 'registered'
        CHECK (status IN ('registered','waitlisted','cancelled','attended')),
    registered_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (event_id, user_id)
);

CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON event_registrations(user_id);

-- ═══════════════════════════════════════════════
-- 7. RESOURCES
-- ═══════════════════════════════════════════════

CREATE TABLE resources (
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

-- ═══════════════════════════════════════════════
-- 8. TAG TABLES
-- ═══════════════════════════════════════════════

CREATE TABLE resource_tags (
    resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    tag varchar(255) NOT NULL,
    PRIMARY KEY (resource_id, tag)
);

CREATE TABLE event_tags (
    event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    tag varchar(255) NOT NULL,
    PRIMARY KEY (event_id, tag)
);

CREATE TABLE organizations_tags (
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tag varchar(255) NOT NULL,
    PRIMARY KEY (org_id, tag)
);

-- ═══════════════════════════════════════════════
-- 9. LOCATIONS
-- ═══════════════════════════════════════════════

CREATE TABLE locations (
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
        ((org_id IS NOT NULL)::integer + (meeting_id IS NOT NULL)::integer
         + (event_id IS NOT NULL)::integer) = 1
    )
);

-- ═══════════════════════════════════════════════
-- 10. ANNOUNCEMENTS
-- ═══════════════════════════════════════════════

CREATE TABLE announcements (
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

CREATE INDEX idx_announcements_org ON announcements(org_id);

-- ═══════════════════════════════════════════════
-- 11. COMMENTS (polymorphic)
-- ═══════════════════════════════════════════════

CREATE TABLE comments (
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
        ((org_id IS NOT NULL)::integer + (event_id IS NOT NULL)::integer
         + (resource_id IS NOT NULL)::integer) = 1
    )
);

CREATE INDEX idx_comments_org ON comments(org_id);
CREATE INDEX idx_comments_event ON comments(event_id);
CREATE INDEX idx_comments_resource ON comments(resource_id);
CREATE INDEX idx_comments_user ON comments(user_id);

-- ═══════════════════════════════════════════════
-- 12. DISCUSSIONS & REPLIES
-- ═══════════════════════════════════════════════

CREATE TABLE discussions (
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

CREATE TABLE discussion_replies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id uuid NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_discussions_org ON discussions(org_id);
CREATE INDEX idx_discussion_replies_discussion ON discussion_replies(discussion_id);

-- Discussion Votes
CREATE TABLE discussion_votes (
    discussion_id uuid NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vote smallint NOT NULL DEFAULT 1 CHECK (vote IN (-1, 1)),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (discussion_id, user_id)
);

CREATE TABLE reply_votes (
    reply_id uuid NOT NULL REFERENCES discussion_replies(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vote smallint NOT NULL DEFAULT 1 CHECK (vote IN (-1, 1)),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (reply_id, user_id)
);

CREATE INDEX idx_discussion_votes_disc ON discussion_votes(discussion_id);
CREATE INDEX idx_reply_votes_reply ON reply_votes(reply_id);

-- ═══════════════════════════════════════════════
-- 13. NOTIFICATIONS
-- ═══════════════════════════════════════════════

CREATE TABLE notifications (
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

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = false;

-- ═══════════════════════════════════════════════
-- 14. CHAT SYSTEM (real-time messaging)
-- ═══════════════════════════════════════════════

CREATE TABLE chat_channels (
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

CREATE INDEX idx_chat_channels_org ON chat_channels(org_id);
CREATE INDEX idx_chat_channels_type ON chat_channels(channel_type);

CREATE TABLE chat_messages (
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

CREATE INDEX idx_chat_messages_channel ON chat_messages(channel_id, created_at DESC);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);

CREATE TABLE chat_channel_members (
    channel_id uuid NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role varchar(20) NOT NULL DEFAULT 'member'
        CHECK (role IN ('member','moderator','admin')),
    last_read_at timestamptz DEFAULT now(),
    joined_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (channel_id, user_id)
);

-- ═══════════════════════════════════════════════
-- 15. CLUB PROPOSALS (Start-a-Club)
-- ═══════════════════════════════════════════════

CREATE TABLE club_proposals (
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
    interested_members text,
    logo_url text,
    poster_url text,
    status varchar(30) NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted','under_review','approved','denied','needs_revision')),
    admin_notes text,
    submitted_at timestamptz NOT NULL DEFAULT now(),
    reviewed_at timestamptz
);

-- ═══════════════════════════════════════════════
-- 16. PROJECTS, SPONSORS, MEETING NOTES, HISTORY
-- ═══════════════════════════════════════════════

CREATE TABLE projects (
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

CREATE TABLE sponsors (
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

CREATE TABLE meeting_notes (
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

CREATE TABLE club_history (
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

CREATE TABLE advisors (
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

CREATE INDEX idx_projects_org ON projects(org_id);
CREATE INDEX idx_meeting_notes_org ON meeting_notes(org_id);
CREATE INDEX idx_club_history_org ON club_history(org_id);
CREATE INDEX idx_advisors_org ON advisors(org_id);

-- ═══════════════════════════════════════════════
-- 17. ACHIEVEMENTS & SERVICE HOURS
-- ═══════════════════════════════════════════════

CREATE TABLE user_skills (
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill varchar(255) NOT NULL,
    level varchar(20) DEFAULT 'beginner'
        CHECK (level IN ('beginner','intermediate','advanced','expert')),
    PRIMARY KEY (user_id, skill)
);

CREATE TABLE achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    description text,
    icon varchar(100),
    category varchar(50),
    points integer NOT NULL DEFAULT 10,
    rarity varchar(20) DEFAULT 'common'
        CHECK (rarity IN ('common','uncommon','rare','epic','legendary'))
);

CREATE TABLE user_achievements (
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE service_hours (
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

CREATE INDEX idx_service_hours_user ON service_hours(user_id);
CREATE INDEX idx_service_hours_org ON service_hours(org_id);

-- ═══════════════════════════════════════════════
-- 18. ANALYTICS & DONATIONS
-- ═══════════════════════════════════════════════

CREATE TABLE org_analytics (
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

CREATE INDEX idx_org_analytics_org ON org_analytics(org_id);

CREATE TABLE donations (
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

CREATE INDEX idx_donations_org ON donations(org_id);

-- ═══════════════════════════════════════════════
-- 19. QUIZZES
-- ═══════════════════════════════════════════════

CREATE TABLE quizzes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    questions jsonb NOT NULL DEFAULT '[]'::jsonb,
    is_published boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE quiz_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    answers jsonb NOT NULL DEFAULT '[]'::jsonb,
    score integer,
    completed_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(quiz_id, user_id)
);

-- ═══════════════════════════════════════════════
-- 20. UPLOADS (community file sharing)
-- ═══════════════════════════════════════════════

CREATE TABLE uploads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_type text,
    file_size integer,
    description text,
    title text,
    category varchar(50),
    tags text[],
    likes integer DEFAULT 0,
    download_count integer DEFAULT 0,
    is_approved boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_uploads_user ON uploads(user_id);
CREATE INDEX idx_uploads_org ON uploads(org_id);
CREATE INDEX idx_uploads_approved ON uploads(is_approved);

CREATE TABLE upload_likes (
    upload_id uuid NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (upload_id, user_id)
);

-- ═══════════════════════════════════════════════
-- 21. RATINGS, BOOKMARKS, ACTIVITY LOG
-- ═══════════════════════════════════════════════

CREATE TABLE ratings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    UNIQUE(org_id, user_id)
);

CREATE TABLE bookmarks (
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

CREATE TABLE activity_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    action varchar(100) NOT NULL,
    target_type varchar(50),
    target_id uuid,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ratings_org ON ratings(org_id);
CREATE INDEX idx_ratings_user ON ratings(user_id);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_org ON activity_log(org_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);

-- ═══════════════════════════════════════════════
-- 22. HUB / COMMUNITY TABLES
-- ═══════════════════════════════════════════════

CREATE TABLE club_ideas (
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

CREATE TABLE club_idea_votes (
    idea_id uuid NOT NULL REFERENCES club_ideas(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vote smallint NOT NULL DEFAULT 1 CHECK (vote IN (-1, 1)),
    PRIMARY KEY (idea_id, user_id)
);

CREATE INDEX idx_club_ideas_status ON club_ideas(status);

CREATE TABLE mentors (
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

CREATE TABLE mentorship_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id uuid NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    mentee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message text,
    status varchar(20) DEFAULT 'pending'
        CHECK (status IN ('pending','accepted','declined','completed')),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(mentor_id, mentee_id)
);

CREATE INDEX idx_mentors_active ON mentors(is_active) WHERE is_active = true;

CREATE TABLE success_stories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    title varchar(255) NOT NULL,
    content text NOT NULL,
    image_url text,
    is_featured boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_success_stories_featured ON success_stories(is_featured) WHERE is_featured = true;

CREATE TABLE collaborations (
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

CREATE TABLE collaboration_participants (
    collaboration_id uuid NOT NULL REFERENCES collaborations(id) ON DELETE CASCADE,
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    joined_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (collaboration_id, org_id)
);

-- ═══════════════════════════════════════════════
-- 22b. USER COLLECTIONS
-- ═══════════════════════════════════════════════

CREATE TABLE user_collections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name varchar(200) NOT NULL,
    description text DEFAULT '',
    icon varchar(10) DEFAULT '📁',
    color varchar(50) DEFAULT 'bg-primary-500',
    is_public boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE collection_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id uuid NOT NULL REFERENCES user_collections(id) ON DELETE CASCADE,
    title varchar(300) NOT NULL,
    item_type varchar(20) NOT NULL DEFAULT 'link',
    url text,
    note text,
    added_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_collections_user ON user_collections(user_id);
CREATE INDEX idx_collection_items_collection ON collection_items(collection_id);

-- ═══════════════════════════════════════════════
-- 23. HELPER FUNCTIONS
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.is_org_admin(target_org_id uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.memberships m
        WHERE m.org_id = target_org_id AND m.user_id = auth.uid()
          AND m.user_permissions = 'admin'
    );
$$;

CREATE OR REPLACE FUNCTION public.is_org_officer_or_admin(target_org_id uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.memberships m
        WHERE m.org_id = target_org_id AND m.user_id = auth.uid()
          AND m.user_permissions IN ('officer', 'admin')
    );
$$;

CREATE OR REPLACE FUNCTION public.is_org_creator(p_org_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.organizations
        WHERE id = p_org_id AND created_by = auth.uid()
    );
$$;

REVOKE ALL ON FUNCTION public.is_org_admin(uuid) FROM public;
REVOKE ALL ON FUNCTION public.is_org_officer_or_admin(uuid) FROM public;
REVOKE ALL ON FUNCTION public.is_org_creator(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.is_org_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_officer_or_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_creator(uuid) TO authenticated;

-- ═══════════════════════════════════════════════
-- 24. TRIGGERS
-- ═══════════════════════════════════════════════

-- Member count
CREATE OR REPLACE FUNCTION public.update_org_member_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE organizations SET member_count = (SELECT count(*) FROM memberships WHERE org_id = OLD.org_id AND is_approved = true) WHERE id = OLD.org_id;
        RETURN OLD;
    ELSE
        UPDATE organizations SET member_count = (SELECT count(*) FROM memberships WHERE org_id = NEW.org_id AND is_approved = true) WHERE id = NEW.org_id;
        RETURN NEW;
    END IF;
END; $$;
CREATE TRIGGER trg_update_member_count AFTER INSERT OR UPDATE OR DELETE ON memberships FOR EACH ROW EXECUTE FUNCTION public.update_org_member_count();

-- Event attendee count
CREATE OR REPLACE FUNCTION public.update_event_attendee_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE events SET current_attendees = (SELECT count(*) FROM event_registrations WHERE event_id = OLD.event_id AND status IN ('registered','attended')) WHERE id = OLD.event_id;
        RETURN OLD;
    ELSE
        UPDATE events SET current_attendees = (SELECT count(*) FROM event_registrations WHERE event_id = NEW.event_id AND status IN ('registered','attended')) WHERE id = NEW.event_id;
        RETURN NEW;
    END IF;
END; $$;
CREATE TRIGGER trg_update_attendee_count AFTER INSERT OR UPDATE OR DELETE ON event_registrations FOR EACH ROW EXECUTE FUNCTION public.update_event_attendee_count();

-- Upload likes
CREATE OR REPLACE FUNCTION public.update_upload_likes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE uploads SET likes = (SELECT count(*) FROM upload_likes WHERE upload_id = OLD.upload_id) WHERE id = OLD.upload_id;
        RETURN OLD;
    ELSE
        UPDATE uploads SET likes = (SELECT count(*) FROM upload_likes WHERE upload_id = NEW.upload_id) WHERE id = NEW.upload_id;
        RETURN NEW;
    END IF;
END; $$;
CREATE TRIGGER trg_update_upload_likes AFTER INSERT OR DELETE ON upload_likes FOR EACH ROW EXECUTE FUNCTION public.update_upload_likes();

-- Idea votes
CREATE OR REPLACE FUNCTION public.update_idea_votes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE club_ideas SET votes = (SELECT COALESCE(SUM(vote), 0) FROM club_idea_votes WHERE idea_id = OLD.idea_id) WHERE id = OLD.idea_id;
        RETURN OLD;
    ELSE
        UPDATE club_ideas SET votes = (SELECT COALESCE(SUM(vote), 0) FROM club_idea_votes WHERE idea_id = NEW.idea_id) WHERE id = NEW.idea_id;
        RETURN NEW;
    END IF;
END; $$;
CREATE TRIGGER trg_update_idea_votes AFTER INSERT OR UPDATE OR DELETE ON club_idea_votes FOR EACH ROW EXECUTE FUNCTION public.update_idea_votes();

-- Discussion vote count
CREATE OR REPLACE FUNCTION public.update_discussion_vote_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target_id uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN target_id := OLD.discussion_id;
    ELSE target_id := NEW.discussion_id; END IF;
    UPDATE discussions SET vote_count = (SELECT COALESCE(SUM(vote), 0) FROM discussion_votes WHERE discussion_id = target_id) WHERE id = target_id;
    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END; $$;
CREATE TRIGGER trg_update_discussion_vote_count AFTER INSERT OR UPDATE OR DELETE ON discussion_votes FOR EACH ROW EXECUTE FUNCTION public.update_discussion_vote_count();

-- Discussion reply count
CREATE OR REPLACE FUNCTION public.update_discussion_reply_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target_id uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN target_id := OLD.discussion_id;
    ELSE target_id := NEW.discussion_id; END IF;
    UPDATE discussions SET reply_count = (SELECT count(*) FROM discussion_replies WHERE discussion_id = target_id) WHERE id = target_id;
    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END; $$;
CREATE TRIGGER trg_update_discussion_reply_count AFTER INSERT OR DELETE ON discussion_replies FOR EACH ROW EXECUTE FUNCTION public.update_discussion_reply_count();

-- Service hours rollup
CREATE OR REPLACE FUNCTION public.update_profile_service_hours()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target_user uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN target_user := OLD.user_id;
    ELSE target_user := NEW.user_id; END IF;
    UPDATE profiles SET total_service_hours = (SELECT COALESCE(SUM(hours), 0) FROM service_hours WHERE user_id = target_user AND verified = true) WHERE id = target_user;
    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END; $$;
CREATE TRIGGER trg_update_profile_service_hours AFTER INSERT OR UPDATE OR DELETE ON service_hours FOR EACH ROW EXECUTE FUNCTION public.update_profile_service_hours();

-- ═══════════════════════════════════════════════
-- 25. ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════

-- Enable RLS on ALL tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_likes ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

-- ─── Profiles ───
CREATE POLICY profiles_select ON profiles FOR SELECT USING (true);
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- ─── Organizations ───
CREATE POLICY organizations_select ON organizations FOR SELECT USING (true);
CREATE POLICY organizations_insert ON organizations FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);
CREATE POLICY organizations_update ON organizations FOR UPDATE
    USING (auth.uid() = created_by);
CREATE POLICY organizations_delete ON organizations FOR DELETE
    USING (auth.uid() = created_by);

-- ─── Memberships ───
CREATE POLICY memberships_select ON memberships FOR SELECT USING (true);
CREATE POLICY memberships_insert ON memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY memberships_update ON memberships FOR UPDATE USING (auth.uid() = user_id OR public.is_org_admin(org_id));
CREATE POLICY memberships_delete ON memberships FOR DELETE USING (auth.uid() = user_id OR public.is_org_admin(org_id));

-- ─── Meetings, Events, Resources — public read ───
CREATE POLICY meetings_select ON meetings FOR SELECT USING (true);
CREATE POLICY events_select ON events FOR SELECT USING (true);
CREATE POLICY events_insert ON events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY events_update ON events FOR UPDATE USING (auth.uid() = created_by OR (org_id IS NOT NULL AND public.is_org_officer_or_admin(org_id)));
CREATE POLICY events_delete ON events FOR DELETE USING (auth.uid() = created_by OR (org_id IS NOT NULL AND public.is_org_creator(org_id)));
CREATE POLICY resources_select ON resources FOR SELECT USING (true);
CREATE POLICY resources_insert ON resources FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ─── Tags — public read ───
CREATE POLICY resource_tags_select ON resource_tags FOR SELECT USING (true);
CREATE POLICY event_tags_select ON event_tags FOR SELECT USING (true);
CREATE POLICY org_tags_select ON organizations_tags FOR SELECT USING (true);

-- ─── Locations — public read ───
CREATE POLICY locations_select ON locations FOR SELECT USING (true);

-- ─── Announcements ───
CREATE POLICY announcements_select ON announcements FOR SELECT USING (true);
CREATE POLICY announcements_insert ON announcements FOR INSERT
    WITH CHECK (auth.uid() = author_id AND public.is_org_creator(org_id));
CREATE POLICY announcements_update ON announcements FOR UPDATE
    USING (auth.uid() = author_id AND public.is_org_creator(org_id));
CREATE POLICY announcements_delete ON announcements FOR DELETE
    USING (public.is_org_creator(org_id));

-- ─── Comments ───
CREATE POLICY comments_select ON comments FOR SELECT USING (true);
CREATE POLICY comments_insert ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY comments_update ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY comments_delete ON comments FOR DELETE USING (auth.uid() = user_id);

-- ─── Discussions & Replies ───
CREATE POLICY discussions_select ON discussions FOR SELECT USING (true);
CREATE POLICY discussions_insert ON discussions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY discussions_update ON discussions FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY discussion_replies_select ON discussion_replies FOR SELECT USING (true);
CREATE POLICY discussion_replies_insert ON discussion_replies FOR INSERT WITH CHECK (auth.uid() = author_id);

-- ─── Discussion/Reply Votes ───
CREATE POLICY dv_select ON discussion_votes FOR SELECT USING (true);
CREATE POLICY dv_insert ON discussion_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY dv_update ON discussion_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY dv_delete ON discussion_votes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY rv_select ON reply_votes FOR SELECT USING (true);
CREATE POLICY rv_insert ON reply_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY rv_update ON reply_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY rv_delete ON reply_votes FOR DELETE USING (auth.uid() = user_id);

-- ─── Notifications ───
CREATE POLICY notifications_select ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notifications_insert ON notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ─── Chat ───
CREATE POLICY chat_channels_select ON chat_channels FOR SELECT USING (
    channel_type = 'public'
    OR (org_id IS NOT NULL AND EXISTS (SELECT 1 FROM memberships m WHERE m.org_id = chat_channels.org_id AND m.user_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM chat_channel_members cm WHERE cm.channel_id = chat_channels.id AND cm.user_id = auth.uid())
);
CREATE POLICY chat_channels_insert ON chat_channels FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY chat_channels_update ON chat_channels FOR UPDATE USING (auth.uid() = created_by OR (org_id IS NOT NULL AND public.is_org_admin(org_id)));

CREATE POLICY chat_messages_select ON chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM chat_channels c WHERE c.id = chat_messages.channel_id AND (
        c.channel_type = 'public'
        OR EXISTS (SELECT 1 FROM chat_channel_members cm WHERE cm.channel_id = c.id AND cm.user_id = auth.uid())
        OR (c.org_id IS NOT NULL AND EXISTS (SELECT 1 FROM memberships m WHERE m.org_id = c.org_id AND m.user_id = auth.uid()))
    ))
);
CREATE POLICY chat_messages_insert ON chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY chat_messages_update ON chat_messages FOR UPDATE USING (auth.uid() = sender_id);
CREATE POLICY chat_messages_delete ON chat_messages FOR DELETE USING (auth.uid() = sender_id);

CREATE POLICY chat_channel_members_select ON chat_channel_members FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM chat_channel_members cm2 WHERE cm2.channel_id = chat_channel_members.channel_id AND cm2.user_id = auth.uid())
);
CREATE POLICY chat_channel_members_insert ON chat_channel_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY chat_channel_members_delete ON chat_channel_members FOR DELETE USING (auth.uid() = user_id);

-- ─── Club Proposals ───
CREATE POLICY club_proposals_select ON club_proposals FOR SELECT USING (true);
CREATE POLICY club_proposals_insert ON club_proposals FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY club_proposals_update ON club_proposals FOR UPDATE USING (auth.uid() = submitted_by);

-- ─── Event Registrations ───
CREATE POLICY event_registrations_select ON event_registrations FOR SELECT USING (true);
CREATE POLICY event_registrations_insert ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY event_registrations_update ON event_registrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY event_registrations_delete ON event_registrations FOR DELETE USING (auth.uid() = user_id);

-- ─── Projects, Sponsors, Meeting Notes, History, Advisors ───
CREATE POLICY projects_select ON projects FOR SELECT USING (true);
CREATE POLICY sponsors_select ON sponsors FOR SELECT USING (true);
CREATE POLICY meeting_notes_select ON meeting_notes FOR SELECT USING (true);
CREATE POLICY club_history_select ON club_history FOR SELECT USING (true);
CREATE POLICY advisors_select ON advisors FOR SELECT USING (true);
CREATE POLICY advisors_insert ON advisors FOR INSERT WITH CHECK (public.is_org_admin(org_id));
CREATE POLICY advisors_update ON advisors FOR UPDATE USING (public.is_org_admin(org_id));
CREATE POLICY advisors_delete ON advisors FOR DELETE USING (public.is_org_admin(org_id));

-- ─── Achievements, Service Hours, Skills ───
CREATE POLICY achievements_select ON achievements FOR SELECT USING (true);
CREATE POLICY user_achievements_select ON user_achievements FOR SELECT USING (true);
CREATE POLICY service_hours_select ON service_hours FOR SELECT USING (true);
CREATE POLICY service_hours_insert ON service_hours FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_skills_select ON user_skills FOR SELECT USING (true);
CREATE POLICY user_skills_insert ON user_skills FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── Analytics, Donations ───
CREATE POLICY org_analytics_select ON org_analytics FOR SELECT USING (true);
CREATE POLICY donations_select ON donations FOR SELECT USING (true);
CREATE POLICY donations_insert ON donations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ─── Quizzes ───
CREATE POLICY quizzes_select ON quizzes FOR SELECT USING (true);
CREATE POLICY quiz_results_select ON quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY quiz_results_insert ON quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── Uploads ───
CREATE POLICY uploads_select ON uploads FOR SELECT USING (true);
CREATE POLICY uploads_insert ON uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY uploads_update ON uploads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY uploads_delete ON uploads FOR DELETE USING (auth.uid() = user_id);

-- ─── Upload Likes ───
CREATE POLICY upload_likes_select ON upload_likes FOR SELECT USING (true);
CREATE POLICY upload_likes_insert ON upload_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY upload_likes_delete ON upload_likes FOR DELETE USING (auth.uid() = user_id);

-- ─── Ratings ───
CREATE POLICY ratings_select ON ratings FOR SELECT USING (true);
CREATE POLICY ratings_insert ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY ratings_update ON ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY ratings_delete ON ratings FOR DELETE USING (auth.uid() = user_id);

-- ─── Bookmarks ───
CREATE POLICY bookmarks_select ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY bookmarks_insert ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY bookmarks_delete ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- ─── Activity Log ───
CREATE POLICY activity_log_select ON activity_log FOR SELECT USING (auth.uid() = user_id OR (org_id IS NOT NULL AND public.is_org_officer_or_admin(org_id)));
CREATE POLICY activity_log_insert ON activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── Club Ideas ───
CREATE POLICY club_ideas_select ON club_ideas FOR SELECT USING (true);
CREATE POLICY club_ideas_insert ON club_ideas FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY club_ideas_update ON club_ideas FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY club_idea_votes_select ON club_idea_votes FOR SELECT USING (true);
CREATE POLICY club_idea_votes_insert ON club_idea_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY club_idea_votes_delete ON club_idea_votes FOR DELETE USING (auth.uid() = user_id);

-- ─── Mentors ───
CREATE POLICY mentors_select ON mentors FOR SELECT USING (true);
CREATE POLICY mentors_insert ON mentors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY mentors_update ON mentors FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY mentorship_requests_select ON mentorship_requests FOR SELECT USING (
    auth.uid() = mentee_id OR auth.uid() = (SELECT user_id FROM mentors WHERE id = mentor_id)
);
CREATE POLICY mentorship_requests_insert ON mentorship_requests FOR INSERT WITH CHECK (auth.uid() = mentee_id);
CREATE POLICY mentorship_requests_update ON mentorship_requests FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM mentors WHERE id = mentor_id)
);

-- ─── Success Stories ───
CREATE POLICY success_stories_select ON success_stories FOR SELECT USING (true);
CREATE POLICY success_stories_insert ON success_stories FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY success_stories_update ON success_stories FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY success_stories_delete ON success_stories FOR DELETE USING (auth.uid() = author_id);

-- ─── Collaborations ───
CREATE POLICY collaborations_select ON collaborations FOR SELECT USING (true);
CREATE POLICY collaborations_insert ON collaborations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY collaborations_update ON collaborations FOR UPDATE USING (public.is_org_officer_or_admin(org_id));

CREATE POLICY collab_participants_select ON collaboration_participants FOR SELECT USING (true);
CREATE POLICY collab_participants_insert ON collaboration_participants FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY collab_participants_delete ON collaboration_participants FOR DELETE USING (public.is_org_officer_or_admin(org_id));

-- ─── User Collections ───
CREATE POLICY collections_select ON user_collections FOR SELECT USING (user_id = auth.uid() OR is_public = true);
CREATE POLICY collections_insert ON user_collections FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY collections_update ON user_collections FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY collections_delete ON user_collections FOR DELETE USING (user_id = auth.uid());

CREATE POLICY collection_items_select ON collection_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_collections c WHERE c.id = collection_id AND (c.user_id = auth.uid() OR c.is_public = true))
);
CREATE POLICY collection_items_insert ON collection_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_collections c WHERE c.id = collection_id AND c.user_id = auth.uid())
);
CREATE POLICY collection_items_delete ON collection_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_collections c WHERE c.id = collection_id AND c.user_id = auth.uid())
);

-- ═══════════════════════════════════════════════
-- 26. VIEWS
-- ═══════════════════════════════════════════════

-- Club Directory (published user-created clubs)
CREATE VIEW club_directory AS
SELECT
    o.id, o.name, o.slug, o.description, o.category,
    o.meeting_schedule, o.meeting_location, o.advisor_name,
    o.contact_email, o.logo_url, o.member_count, o.founded_date,
    o.tags, o.website, o.is_featured, o.created_by, o.created_at,
    p.name AS creator_name, p.email AS creator_email,
    (SELECT count(*) FROM events e WHERE e.org_id = o.id) AS events_count,
    (SELECT count(*) FROM resources r WHERE r.org_id = o.id) AS resources_count,
    (SELECT count(*) FROM announcements a WHERE a.org_id = o.id) AS announcements_count,
    (SELECT count(*) FROM discussions d WHERE d.org_id = o.id) AS discussions_count,
    (SELECT count(*) FROM uploads u WHERE u.org_id = o.id) AS uploads_count
FROM organizations o
LEFT JOIN profiles p ON p.id = o.created_by
WHERE o.is_published = true;

-- My Clubs (clubs current user created)
CREATE VIEW my_clubs AS
SELECT
    o.id, o.name, o.slug, o.description, o.category,
    o.is_published, o.is_featured, o.created_at, o.member_count, o.tags,
    (SELECT count(*) FROM announcements a WHERE a.org_id = o.id) AS announcements_count,
    (SELECT count(*) FROM events e WHERE e.org_id = o.id) AS events_count
FROM organizations o
WHERE o.created_by = auth.uid();

-- User Statistics
CREATE VIEW user_statistics AS
SELECT
    p.id AS user_id, p.name, p.email, p.grade, p.school,
    p.avatar_url, p.total_service_hours, p.total_events_attended,
    p.achievement_points, p.graduation_year,
    COALESCE(mem.club_count, 0) AS clubs_enrolled,
    COALESCE(disc.discussion_count, 0) AS discussions_started,
    COALESCE(upl.upload_count, 0) AS uploads_shared,
    COALESCE(evt.event_count, 0) AS events_registered,
    COALESCE(ach.achievement_count, 0) AS achievements_earned,
    p.created_at AS member_since
FROM profiles p
LEFT JOIN (SELECT user_id, count(*) AS club_count FROM memberships WHERE is_approved = true GROUP BY user_id) mem ON mem.user_id = p.id
LEFT JOIN (SELECT author_id, count(*) AS discussion_count FROM discussions GROUP BY author_id) disc ON disc.author_id = p.id
LEFT JOIN (SELECT user_id, count(*) AS upload_count FROM uploads GROUP BY user_id) upl ON upl.user_id = p.id
LEFT JOIN (SELECT user_id, count(*) AS event_count FROM event_registrations WHERE status IN ('registered','attended') GROUP BY user_id) evt ON evt.user_id = p.id
LEFT JOIN (SELECT user_id, count(*) AS achievement_count FROM user_achievements GROUP BY user_id) ach ON ach.user_id = p.id;

-- Club Statistics
CREATE VIEW club_statistics AS
SELECT
    o.id AS org_id, o.name, o.slug, o.description, o.category,
    o.meeting_frequency, o.meeting_time, o.logo_url, o.banner_url,
    o.is_featured, o.is_active, o.founded_year, o.created_at,
    COALESCE(mem.total_members, 0) AS total_members,
    COALESCE(evt.event_count, 0) AS events_count,
    COALESCE(res.resource_count, 0) AS resources_count,
    COALESCE(disc.discussion_count, 0) AS discussions_count,
    COALESCE(rat.avg_rating, 0) AS avg_rating,
    COALESCE(rat.rating_count, 0) AS rating_count
FROM organizations o
LEFT JOIN (SELECT org_id, count(*) AS total_members FROM memberships WHERE is_approved = true GROUP BY org_id) mem ON mem.org_id = o.id
LEFT JOIN (SELECT org_id, count(*) AS event_count FROM events GROUP BY org_id) evt ON evt.org_id = o.id
LEFT JOIN (SELECT org_id, count(*) AS resource_count FROM resources GROUP BY org_id) res ON res.org_id = o.id
LEFT JOIN (SELECT org_id, count(*) AS discussion_count FROM discussions GROUP BY org_id) disc ON disc.org_id = o.id
LEFT JOIN (SELECT org_id, ROUND(AVG(rating)::numeric, 1) AS avg_rating, count(*) AS rating_count FROM ratings GROUP BY org_id) rat ON rat.org_id = o.id;

-- Community Uploads
CREATE VIEW community_uploads AS
SELECT
    u.id, u.user_id, p.name AS author_name, p.avatar_url AS author_avatar,
    u.title, u.file_name, u.file_url, u.file_type, u.file_size,
    u.description, u.category, u.tags, u.likes, u.download_count,
    u.org_id, o.name AS org_name, u.created_at
FROM uploads u
JOIN profiles p ON p.id = u.user_id
LEFT JOIN organizations o ON o.id = u.org_id
WHERE u.is_approved = true
ORDER BY u.created_at DESC;

-- Discussion Threads
CREATE VIEW discussion_threads AS
SELECT
    d.id, d.org_id, o.name AS org_name, d.author_id,
    p.name AS author_name, p.avatar_url AS author_avatar,
    d.title, d.content, d.is_pinned, d.category, d.tags,
    d.vote_count, d.reply_count, d.view_count,
    d.created_at, d.updated_at
FROM discussions d
JOIN profiles p ON p.id = d.author_id
LEFT JOIN organizations o ON o.id = d.org_id
ORDER BY d.is_pinned DESC, d.created_at DESC;

-- User Club Enrollments
CREATE VIEW user_club_enrollments AS
SELECT
    m.user_id, m.org_id, o.name AS club_name, o.slug AS club_slug,
    o.category AS club_category, o.logo_url AS club_logo,
    m.user_permissions AS role, m.position, m.attendance,
    m.joined_at, m.is_approved,
    CASE WHEN m.user_permissions = 'admin' THEN true ELSE false END AS is_owner
FROM memberships m
JOIN organizations o ON o.id = m.org_id
WHERE m.is_approved = true;

-- Club Member List
CREATE VIEW club_member_list AS
SELECT
    m.org_id, o.name AS club_name, m.user_id,
    p.name AS member_name, p.email AS member_email,
    p.avatar_url AS member_avatar, p.grade AS member_grade,
    m.user_permissions AS role, m.position, m.attendance, m.joined_at
FROM memberships m
JOIN profiles p ON p.id = m.user_id
JOIN organizations o ON o.id = m.org_id
WHERE m.is_approved = true;

-- ═══════════════════════════════════════════════
-- 27. REALTIME
-- ═══════════════════════════════════════════════

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE chat_channel_members; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE discussions; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE discussion_replies; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE announcements; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE comments; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE notifications; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE uploads; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ═══════════════════════════════════════════════
-- 28. STORAGE BUCKETS
-- ═══════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Avatar policies
DO $$ BEGIN
    CREATE POLICY avatars_public_read ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY avatars_auth_insert ON storage.objects FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY avatars_owner_update ON storage.objects FOR UPDATE USING (
        bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY avatars_owner_delete ON storage.objects FOR DELETE USING (
        bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Upload policies
DO $$ BEGIN
    CREATE POLICY uploads_public_read ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY uploads_auth_insert ON storage.objects FOR INSERT WITH CHECK (
        bucket_id = 'uploads' AND auth.role() = 'authenticated'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY uploads_owner_update ON storage.objects FOR UPDATE USING (
        bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY uploads_owner_delete ON storage.objects FOR DELETE USING (
        bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ═══════════════════════════════════════════════
-- 29. SEED: DEFAULT PUBLIC CHAT CHANNEL
-- ═══════════════════════════════════════════════

INSERT INTO chat_channels (id, name, description, channel_type)
VALUES ('00000000-0000-0000-0000-000000000001', 'General Chat', 'Public chat for all ClubConnect members', 'public')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- 30. AUTO-CREATE PROFILE ON SIGNUP (safety net)
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, grade, school, is_adult, bio, phone_number)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
        NEW.email,
        NEW.raw_user_meta_data ->> 'grade',
        NEW.raw_user_meta_data ->> 'school',
        COALESCE((NEW.raw_user_meta_data ->> 'is_adult')::boolean, false),
        NEW.raw_user_meta_data ->> 'bio',
        NEW.raw_user_meta_data ->> 'phone_number'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════
-- 31. SEED: ALL CLUBS INTO ORGANIZATIONS TABLE
-- ═══════════════════════════════════════════════

INSERT INTO organizations (name, slug, description, category, meeting_schedule, meeting_location, advisor_name, contact_email, member_count, founded_date, is_published, is_featured) VALUES
('Model United Nations', 'model-un', 'Engage in diplomatic simulations, debate global issues, and develop public speaking and negotiation skills through competitive conferences.', 'Academic', 'Every Tuesday, 3:30 PM - 5:00 PM', 'Juanita High School - Social Studies Wing', 'Dr. Sarah Mitchell', 's.mitchell@school.edu', 45, '2008-09-01', true, true),
('Robotics Team', 'robotics', 'Design, build, and program competitive robots while learning engineering principles, teamwork, and problem-solving skills.', 'STEM', 'Monday, Wednesday, Friday 3:30 PM - 6:00 PM', 'Tesla STEM High School - Engineering Lab', 'Mr. Robert Hayes', 'r.hayes@school.edu', 38, '2012-09-01', true, true),
('Community Service Club', 'community-service', 'Make a positive impact in our community through volunteer work, fundraising events, and partnerships with local organizations.', 'Service', 'Every other Thursday during lunch', 'Redmond High School - Main Building', 'Ms. Jennifer Adams', 'j.adams@school.edu', 72, '2005-09-01', true, true),
('Drama Club & Theater Society', 'drama-club', 'Explore the performing arts through productions, workshops, and competitions. All skill levels welcome.', 'Arts', 'Every Wednesday, 3:30 PM - 5:30 PM', 'Lake Washington High School - Auditorium', 'Ms. Patricia Coleman', 'p.coleman@school.edu', 54, '1998-09-01', true, false),
('Debate Team', 'debate-team', 'Develop critical thinking, research, and public speaking skills through competitive debate formats including Policy, Lincoln-Douglas, and Public Forum.', 'Academic', 'Tuesday and Thursday, 3:30 PM - 5:00 PM', 'Eastlake High School - Room 302', 'Mr. Thomas Wright', 't.wright@school.edu', 28, '2001-09-01', true, false),
('Multicultural Student Alliance', 'cultural-club', 'Celebrate diversity and promote cultural awareness through events, discussions, and community engagement.', 'Cultural', 'Every Friday during lunch', 'International Community School - Commons', 'Dr. Angela Rodriguez', 'a.rodriguez@school.edu', 63, '2010-09-01', true, false),
('Environmental Action Club', 'environmental-club', 'Take action on environmental issues through campus sustainability projects, advocacy, and community clean-up events.', 'Service', 'Every Monday, 3:30 PM - 4:30 PM', 'Inglemoor High School - Science Wing', 'Mr. David Chen', 'd.chen@school.edu', 41, '2015-09-01', true, false),
('The School Chronicle', 'student-newspaper', 'Produce the official school newspaper covering news, sports, arts, and opinion pieces. Learn journalism skills and media literacy.', 'Media', 'Tuesday and Thursday, 3:30 PM - 5:00 PM', 'Bothell High School - Media Lab', 'Mrs. Karen Phillips', 'k.phillips@school.edu', 22, '1965-09-01', true, false),
('Math Olympiad Team', 'math-olympiad', 'Compete in mathematics competitions at local, state, and national levels while sharpening problem-solving skills.', 'Academic', 'Every Wednesday, 3:30 PM - 5:00 PM', 'Juanita High School - Room 118', 'Mr. Kevin Park', 'k.park@school.edu', 30, '2010-09-01', true, false),
('Art & Design Studio', 'jhs-art-club', 'Explore visual arts including painting, sculpture, digital art, and graphic design through workshops and exhibitions.', 'Arts', 'Every Thursday, 3:30 PM - 5:00 PM', 'Juanita High School - Art Room', 'Ms. Lisa Nakamura', 'l.nakamura@school.edu', 35, '2014-09-01', true, false),
('Spanish Language & Culture Club', 'jhs-spanish-club', 'Practice conversational Spanish, explore Latin American cultures, and participate in cultural events and exchanges.', 'Cultural', 'Every Friday during lunch', 'Juanita High School - Room 215', 'Sra. Maria Fernandez', 'm.fernandez@school.edu', 28, '2016-09-01', true, false),
('Science Bowl Team', 'tesla-science-bowl', 'Compete in fast-paced science trivia competitions covering biology, chemistry, physics, earth science, and math.', 'Academic', 'Every Tuesday, 3:30 PM - 5:00 PM', 'Tesla STEM High School - Room 401', 'Dr. James Wong', 'j.wong@school.edu', 24, '2013-09-01', true, false),
('Cybersecurity Club', 'tesla-cyber-security', 'Learn ethical hacking, network security, and compete in CTF (Capture the Flag) competitions.', 'STEM', 'Every Thursday, 3:30 PM - 5:30 PM', 'Tesla STEM High School - Computer Lab', 'Mr. Chris Yang', 'c.yang@school.edu', 20, '2018-09-01', true, false),
('Key Club International', 'redmond-key-club', 'Service leadership program dedicated to serving the community through charitable activities and building leadership skills.', 'Service', 'Every Monday during lunch', 'Redmond High School - Commons', 'Ms. Rachel Kim', 'r.kim@school.edu', 55, '2006-09-01', true, false),
('Coding & App Development Club', 'redmond-coding-club', 'Build software projects, learn new programming languages, and participate in hackathons together.', 'STEM', 'Every Wednesday, 3:30 PM - 5:00 PM', 'Redmond High School - Tech Lab', 'Mr. Brian Taylor', 'b.taylor@school.edu', 32, '2017-09-01', true, false),
('Marching & Concert Band', 'lwhs-band', 'Perform at football games, concerts, parades, and regional competitions. All instrument players welcome.', 'Arts', 'Daily 7:00 AM - 8:00 AM, plus after-school rehearsals', 'Lake Washington High School - Band Room', 'Mr. George Simmons', 'g.simmons@school.edu', 68, '1985-09-01', true, false),
('Student Government Association', 'lwhs-student-gov', 'Represent the student body, plan school-wide events, and develop leadership skills through governance.', 'Leadership', 'Every Wednesday during lunch', 'Lake Washington High School - Student Center', 'Mrs. Sandra Wells', 's.wells@school.edu', 25, '1990-09-01', true, false),
('Film & Media Production Club', 'eastlake-film-club', 'Create short films, documentaries, and multimedia projects while learning cinematography and editing.', 'Media', 'Every Friday, 3:30 PM - 5:30 PM', 'Eastlake High School - Media Room', 'Mr. Paul Anderson', 'p.anderson@school.edu', 18, '2019-09-01', true, false),
('Track & Field Club', 'eastlake-track', 'Train and compete in track and field events including sprints, distance, jumps, and throws.', 'Sports', 'Monday - Friday, 3:30 PM - 5:30 PM (spring season)', 'Eastlake High School - Athletic Complex', 'Coach Mike Torres', 'm.torres@school.edu', 45, '2000-09-01', true, false),
('Global Issues Forum', 'ics-global-issues', 'Discuss and research pressing global challenges including climate change, human rights, and international development.', 'Academic', 'Every other Tuesday, 3:30 PM - 4:30 PM', 'International Community School - Room 201', 'Dr. Amara Osei', 'a.osei@school.edu', 22, '2020-09-01', true, false),
('International Dance Ensemble', 'ics-dance', 'Learn and perform traditional and contemporary dances from cultures around the world.', 'Arts', 'Every Wednesday, 3:30 PM - 5:00 PM', 'International Community School - Dance Studio', 'Ms. Chen Wei', 'c.wei@school.edu', 30, '2018-09-01', true, false),
('Chess Club', 'inglemoor-chess', 'Play casual and competitive chess, learn strategies, and compete in local and state tournaments.', 'Academic', 'Every Tuesday and Thursday during lunch', 'Inglemoor High School - Library', 'Mr. Tom Richards', 't.richards@school.edu', 26, '2012-09-01', true, false),
('Hiking & Outdoor Adventures Club', 'inglemoor-hiking', 'Explore Pacific Northwest trails, learn outdoor skills, and build community through weekend hikes and camping trips.', 'Sports', 'Every other Friday, 3:30 PM - 4:30 PM + weekend outings', 'Inglemoor High School - Room 109', 'Ms. Amy Brooks', 'a.brooks@school.edu', 33, '2016-09-01', true, false),
('Yearbook Committee', 'bothell-yearbook', 'Design, photograph, write, and produce the annual school yearbook. Learn journalism, design, and photography.', 'Media', 'Every Monday and Wednesday, 3:30 PM - 5:00 PM', 'Bothell High School - Yearbook Room', 'Mrs. Julie Hansen', 'j.hansen@school.edu', 20, '1970-09-01', true, false),
('National Honor Society - Bothell Chapter', 'bothell-nhs', 'Recognize outstanding students who demonstrate excellence in scholarship, leadership, service, and character.', 'Leadership', 'First Thursday of each month, 3:30 PM - 4:30 PM', 'Bothell High School - Lecture Hall', 'Dr. Lisa Morgan', 'l.morgan@school.edu', 82, '1995-09-01', true, true)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
