-- Migration 006: Comprehensive Expansion
-- Adds tables for: announcements, comments, discussions, notifications,
-- club proposals, event registrations, projects, sponsors, meeting notes,
-- club history, user skills, achievements, leaderboard, analytics.

BEGIN;

-- ═══════════════════════════════════════════════
-- ANNOUNCEMENTS
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS announcements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title varchar(512) NOT NULL,
    content text NOT NULL,
    priority varchar(20) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low','medium','high','critical')),
    is_pinned boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_announcements_org ON announcements(org_id);

-- ═══════════════════════════════════════════════
-- COMMENTS (polymorphic: org, event, or resource)
-- ═══════════════════════════════════════════════
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
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

-- ═══════════════════════════════════════════════
-- DISCUSSIONS & REPLIES
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS discussions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title varchar(512) NOT NULL,
    content text NOT NULL,
    is_pinned boolean NOT NULL DEFAULT false,
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

-- ═══════════════════════════════════════════════
-- NOTIFICATIONS
-- ═══════════════════════════════════════════════
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

-- ═══════════════════════════════════════════════
-- CLUB PROPOSALS
-- ═══════════════════════════════════════════════
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
    interested_members text,
    status varchar(30) NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted','under_review','approved','denied','needs_revision')),
    admin_notes text,
    submitted_at timestamptz NOT NULL DEFAULT now(),
    reviewed_at timestamptz
);

-- ═══════════════════════════════════════════════
-- EVENT REGISTRATIONS / RSVP
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
-- PROJECTS / SHOWCASES
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

-- ═══════════════════════════════════════════════
-- SPONSORS / PARTNERSHIPS
-- ═══════════════════════════════════════════════
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

-- ═══════════════════════════════════════════════
-- MEETING NOTES / MINUTES
-- ═══════════════════════════════════════════════
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

-- ═══════════════════════════════════════════════
-- CLUB HISTORY / TIMELINE
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS club_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_type varchar(50) NOT NULL
        CHECK (event_type IN ('founded','achievement','milestone','leadership_change','event_highlight','membership_milestone','competition_result')),
    title varchar(512) NOT NULL,
    description text,
    event_date date NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_club_history_org ON club_history(org_id);

-- ═══════════════════════════════════════════════
-- USER SKILLS & INTERESTS
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS user_skills (
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill varchar(255) NOT NULL,
    level varchar(20) DEFAULT 'beginner'
        CHECK (level IN ('beginner','intermediate','advanced','expert')),
    PRIMARY KEY (user_id, skill)
);

-- ═══════════════════════════════════════════════
-- ACHIEVEMENTS
-- ═══════════════════════════════════════════════
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

-- ═══════════════════════════════════════════════
-- ANALYTICS / STATISTICS (aggregated snapshots)
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
    UNIQUE(org_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_org_analytics_org ON org_analytics(org_id);

-- ═══════════════════════════════════════════════
-- DONATIONS / FUNDRAISING
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS donations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
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
-- SERVICE HOURS
-- ═══════════════════════════════════════════════
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

-- ═══════════════════════════════════════════════
-- Add columns to existing tables
-- ═══════════════════════════════════════════════

-- organizations: add more info columns
ALTER TABLE IF EXISTS organizations
    ADD COLUMN IF NOT EXISTS category varchar(50),
    ADD COLUMN IF NOT EXISTS meeting_frequency varchar(50),
    ADD COLUMN IF NOT EXISTS meeting_time varchar(50),
    ADD COLUMN IF NOT EXISTS meeting_schedule text,
    ADD COLUMN IF NOT EXISTS membership_status varchar(50),
    ADD COLUMN IF NOT EXISTS grade_level varchar(50),
    ADD COLUMN IF NOT EXISTS dues text,
    ADD COLUMN IF NOT EXISTS membership_requirements text,
    ADD COLUMN IF NOT EXISTS founded_year integer,
    ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS member_count integer DEFAULT 0,
    ADD COLUMN IF NOT EXISTS logo_url text,
    ADD COLUMN IF NOT EXISTS banner_url text,
    ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}';

-- events: add more detail columns
ALTER TABLE IF EXISTS events
    ADD COLUMN IF NOT EXISTS start_time text,
    ADD COLUMN IF NOT EXISTS end_time text,
    ADD COLUMN IF NOT EXISTS location_text text,
    ADD COLUMN IF NOT EXISTS category varchar(50),
    ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS requires_rsvp boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS max_attendees integer,
    ADD COLUMN IF NOT EXISTS current_attendees integer DEFAULT 0,
    ADD COLUMN IF NOT EXISTS image_url text,
    ADD COLUMN IF NOT EXISTS recap text,
    ADD COLUMN IF NOT EXISTS recap_images jsonb DEFAULT '[]';

-- profiles: add activity tracking columns
ALTER TABLE IF EXISTS profiles
    ADD COLUMN IF NOT EXISTS total_service_hours numeric(7,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_events_attended integer DEFAULT 0,
    ADD COLUMN IF NOT EXISTS achievement_points integer DEFAULT 0,
    ADD COLUMN IF NOT EXISTS interests text[],
    ADD COLUMN IF NOT EXISTS graduation_year integer;

-- memberships: add insert policy for joining
ALTER TABLE IF EXISTS memberships
    ADD COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT true;

-- ═══════════════════════════════════════════════
-- RLS Policies for new tables
-- ═══════════════════════════════════════════════

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
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

-- Announcements: public read, org admin write
CREATE POLICY announcements_select ON announcements FOR SELECT USING (true);
CREATE POLICY announcements_insert ON announcements FOR INSERT
    WITH CHECK (auth.uid() = author_id);
CREATE POLICY announcements_update ON announcements FOR UPDATE
    USING (auth.uid() = author_id OR public.is_org_officer_or_admin(org_id));
CREATE POLICY announcements_delete ON announcements FOR DELETE
    USING (auth.uid() = author_id OR public.is_org_admin(org_id));

-- Comments: public read, authenticated write own
CREATE POLICY comments_select ON comments FOR SELECT USING (true);
CREATE POLICY comments_insert ON comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY comments_update ON comments FOR UPDATE
    USING (auth.uid() = user_id);
CREATE POLICY comments_delete ON comments FOR DELETE
    USING (auth.uid() = user_id OR (org_id IS NOT NULL AND public.is_org_admin(org_id)));

-- Discussions: public read, authenticated write
CREATE POLICY discussions_select ON discussions FOR SELECT USING (true);
CREATE POLICY discussions_insert ON discussions FOR INSERT
    WITH CHECK (auth.uid() = author_id);
CREATE POLICY discussions_update ON discussions FOR UPDATE
    USING (auth.uid() = author_id);
CREATE POLICY discussions_delete ON discussions FOR DELETE
    USING (auth.uid() = author_id OR (org_id IS NOT NULL AND public.is_org_admin(org_id)));

-- Discussion Replies
CREATE POLICY discussion_replies_select ON discussion_replies FOR SELECT USING (true);
CREATE POLICY discussion_replies_insert ON discussion_replies FOR INSERT
    WITH CHECK (auth.uid() = author_id);
CREATE POLICY discussion_replies_delete ON discussion_replies FOR DELETE
    USING (auth.uid() = author_id);

-- Notifications: user sees own only
CREATE POLICY notifications_select ON notifications FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY notifications_update ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Club Proposals: submitter sees own, admins see all
CREATE POLICY proposals_select_own ON club_proposals FOR SELECT
    USING (auth.uid() = submitted_by);
CREATE POLICY proposals_insert ON club_proposals FOR INSERT
    WITH CHECK (auth.uid() = submitted_by);

-- Event Registrations: public read, authenticated register
CREATE POLICY event_reg_select ON event_registrations FOR SELECT USING (true);
CREATE POLICY event_reg_insert ON event_registrations FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY event_reg_update ON event_registrations FOR UPDATE
    USING (auth.uid() = user_id);
CREATE POLICY event_reg_delete ON event_registrations FOR DELETE
    USING (auth.uid() = user_id);

-- Projects: public read, org admin write
CREATE POLICY projects_select ON projects FOR SELECT USING (true);
CREATE POLICY projects_insert ON projects FOR INSERT
    WITH CHECK (public.is_org_officer_or_admin(org_id));
CREATE POLICY projects_update ON projects FOR UPDATE
    USING (public.is_org_officer_or_admin(org_id));

-- Sponsors: public read
CREATE POLICY sponsors_select ON sponsors FOR SELECT USING (true);

-- Meeting Notes: public read, org officer/admin write
CREATE POLICY meeting_notes_select ON meeting_notes FOR SELECT USING (true);
CREATE POLICY meeting_notes_insert ON meeting_notes FOR INSERT
    WITH CHECK (public.is_org_officer_or_admin(org_id));

-- Club History: public read
CREATE POLICY club_history_select ON club_history FOR SELECT USING (true);

-- User Skills: user manages own
CREATE POLICY user_skills_select ON user_skills FOR SELECT USING (true);
CREATE POLICY user_skills_insert ON user_skills FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_skills_delete ON user_skills FOR DELETE
    USING (auth.uid() = user_id);

-- Achievements: public read
CREATE POLICY achievements_select ON achievements FOR SELECT USING (true);

-- User Achievements: public read
CREATE POLICY user_achievements_select ON user_achievements FOR SELECT USING (true);

-- Org Analytics: public read
CREATE POLICY org_analytics_select ON org_analytics FOR SELECT USING (true);

-- Donations: org admin can see their org's donations
CREATE POLICY donations_select ON donations FOR SELECT USING (true);
CREATE POLICY donations_insert ON donations FOR INSERT WITH CHECK (true);

-- Service Hours: user sees own, org admin sees org's
CREATE POLICY service_hours_select_own ON service_hours FOR SELECT
    USING (auth.uid() = user_id OR (org_id IS NOT NULL AND public.is_org_officer_or_admin(org_id)));
CREATE POLICY service_hours_insert ON service_hours FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY service_hours_update ON service_hours FOR UPDATE
    USING (auth.uid() = verified_by OR public.is_org_officer_or_admin(org_id));

-- Memberships: allow authenticated users to insert (join clubs)
CREATE POLICY "Memberships insertable by authenticated users"
ON memberships FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

COMMIT;
