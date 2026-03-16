// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

export type UserPermissions = 'admin' | 'officer' | 'parent' | 'teacher' | 'partner' | 'member'

export interface Profile {
    id: string
    name?: string
    email: string
    bio?: string
    phone_number?: string
    grade?: string
    school?: string
    is_adult?: boolean
    avatar_url?: string
    total_service_hours?: number
    total_events_attended?: number
    achievement_points?: number
    interests?: string[]
    graduation_year?: number
    created_at?: string
    [key: string]: unknown
}

export interface Membership {
    id: string
    org_id: string
    user_id: string
    user_permissions: UserPermissions
    position: string
    attendance?: number
    joined_at?: string
    notes?: string
    is_approved?: boolean
    [key: string]: unknown
}

export interface Organization {
    id: string
    name: string
    slug?: string
    description?: string
    parent_org_id?: string
    website?: string
    category?: string
    meeting_frequency?: string
    meeting_time?: string
    meeting_schedule?: string
    membership_status?: string
    grade_level?: string
    dues?: string
    membership_requirements?: string
    founded_year?: number
    is_active?: boolean
    member_count?: number
    logo_url?: string
    banner_url?: string
    social_links?: Record<string, string>
    is_featured?: boolean
    created_at?: string
    [key: string]: unknown
}

export interface OrganizationTag {
    org_id: string
    tag: string
    [key: string]: unknown
}

export interface Meeting {
    id: string
    org_id: string
    frequency?: string
    details?: string
    next_occurrence?: string
    [key: string]: unknown
}

export interface Event {
    id: string
    name: string
    org_id?: string
    description?: string
    time?: string
    start_time?: string
    end_time?: string
    location_text?: string
    website?: string
    category?: string
    is_public?: boolean
    requires_rsvp?: boolean
    max_attendees?: number
    current_attendees?: number
    image_url?: string
    recap?: string
    recap_images?: unknown[]
    is_featured?: boolean
    created_by?: string
    created_at?: string
    [key: string]: unknown
}

export interface EventTag {
    event_id: string
    tag: string
    [key: string]: unknown
}

export interface Location {
    id: string
    address?: string
    building?: string
    room?: string
    lat?: number
    lng?: number
    org_id?: string
    meeting_id?: string
    event_id?: string
    [key: string]: unknown
}

export interface Resource {
    id: string
    name?: string
    resource_link: string
    org_id?: string
    event_id?: string
    created_by?: string
    description: string
    is_featured?: boolean
    category?: string
    type?: string
    downloads?: number
    file_size?: string
    format?: string
    created_at?: string
    [key: string]: unknown
}

export interface ResourceTag {
    resource_id: string
    tag: string
    [key: string]: unknown
}

export interface Comment {
    id: string
    user_id: string
    content: string
    org_id?: string
    event_id?: string
    resource_id?: string
    parent_comment_id?: string
    created_at?: string
    updated_at?: string
    [key: string]: unknown
}

export interface Announcement {
    id: string
    org_id?: string
    author_id: string
    title: string
    content: string
    priority?: string
    is_pinned?: boolean
    created_at?: string
    expires_at?: string
    [key: string]: unknown
}

export interface Discussion {
    id: string
    org_id?: string
    author_id: string
    title: string
    content: string
    is_pinned?: boolean
    created_at?: string
    [key: string]: unknown
}

export interface DiscussionReply {
    id: string
    discussion_id: string
    author_id: string
    content: string
    created_at?: string
    [key: string]: unknown
}

export interface Notification {
    id: string
    user_id: string
    title: string
    message?: string
    type?: string
    link?: string
    is_read?: boolean
    created_at?: string
    [key: string]: unknown
}

export interface ClubProposal {
    id: string
    submitted_by: string
    club_name: string
    mission_statement: string
    category?: string
    proposed_advisor?: string
    advisor_email?: string
    justification?: string
    constitution_draft?: string
    first_year_plan?: string
    budget_requirements?: string
    meeting_space_needs?: string
    interested_members?: string
    logo_url?: string
    poster_url?: string
    status?: string
    admin_notes?: string
    submitted_at?: string
    reviewed_at?: string
    [key: string]: unknown
}

export interface EventRegistration {
    id: string
    event_id: string
    user_id: string
    status?: string
    registered_at?: string
    [key: string]: unknown
}

export interface Project {
    id: string
    org_id: string
    title: string
    description?: string
    status?: string
    start_date?: string
    end_date?: string
    image_url?: string
    external_url?: string
    created_by?: string
    created_at?: string
    [key: string]: unknown
}

export interface Sponsor {
    id: string
    org_id?: string
    name: string
    description?: string
    logo_url?: string
    website?: string
    tier?: string
    active?: boolean
    created_at?: string
    [key: string]: unknown
}

export interface MeetingNote {
    id: string
    meeting_id?: string
    org_id: string
    title?: string
    content: string
    recorded_by?: string
    meeting_date: string
    attendee_count?: number
    action_items?: unknown[]
    created_at?: string
    [key: string]: unknown
}

export interface ClubHistory {
    id: string
    org_id: string
    event_type: string
    title: string
    description?: string
    event_date: string
    created_at?: string
    [key: string]: unknown
}

export interface Rating {
    id: string
    org_id: string
    user_id: string
    rating: number
    review?: string
    created_at?: string
    [key: string]: unknown
}

export interface Bookmark {
    id: string
    user_id: string
    org_id?: string
    event_id?: string
    resource_id?: string
    discussion_id?: string
    created_at?: string
    [key: string]: unknown
}

export interface ActivityLogEntry {
    id: string
    user_id: string
    org_id?: string
    action: string
    target_type?: string
    target_id?: string
    metadata?: Record<string, unknown>
    created_at?: string
    [key: string]: unknown
}

export interface OrgAnalytics {
    id: string
    org_id: string
    snapshot_date: string
    total_members?: number
    active_members?: number
    events_held?: number
    avg_attendance?: number
    new_members?: number
    retention_rate?: number
    engagement_score?: number
    meetings_held?: number
    service_hours_total?: number
    competition_wins?: number
    [key: string]: unknown
}

export interface Donation {
    id: string
    org_id?: string
    donor_id?: string
    donor_name?: string
    donor_email?: string
    amount: number
    message?: string
    is_recurring?: boolean
    stripe_session_id?: string
    status?: string
    created_at?: string
    [key: string]: unknown
}

export interface ServiceHour {
    id: string
    user_id: string
    org_id?: string
    event_id?: string
    hours: number
    description?: string
    date: string
    verified?: boolean
    verified_by?: string
    created_at?: string
    [key: string]: unknown
}

export interface Advisor {
    id: string
    org_id: string
    name: string
    email?: string
    phone?: string
    department?: string
    title?: string
    is_primary?: boolean
    created_at?: string
    [key: string]: unknown
}

export interface ClubIdea {
    id: string
    author_id: string
    title: string
    description: string
    category?: string
    votes?: number
    status?: string
    created_at?: string
    [key: string]: unknown
}

export interface Mentor {
    id: string
    user_id?: string
    name: string
    bio?: string
    expertise?: string[]
    availability?: string
    avatar_url?: string
    is_alumni?: boolean
    graduation_year?: number
    is_active?: boolean
    created_at?: string
    [key: string]: unknown
}

export interface SuccessStory {
    id: string
    author_id: string
    org_id?: string
    title: string
    content: string
    image_url?: string
    is_featured?: boolean
    created_at?: string
    [key: string]: unknown
}

export interface Collaboration {
    id: string
    org_id: string
    title: string
    description: string
    type?: string
    status?: string
    created_at?: string
    [key: string]: unknown
}

export interface Upload {
    id: string
    user_id: string
    org_id?: string
    file_name: string
    file_url: string
    file_type?: string
    file_size?: number
    description?: string
    likes?: number
    created_at?: string
    [key: string]: unknown
}

export interface Achievement {
    id: string
    name: string
    description?: string
    icon?: string
    category?: string
    points?: number
    rarity?: string
    [key: string]: unknown
}

export interface UserAchievement {
    user_id: string
    achievement_id: string
    earned_at?: string
    [key: string]: unknown
}

export interface Quiz {
    id: string
    title: string
    description?: string
    org_id?: string
    created_by?: string
    questions?: unknown[]
    is_published?: boolean
    created_at?: string
    [key: string]: unknown
}

export interface QuizResult {
    id: string
    quiz_id: string
    user_id: string
    answers?: unknown[]
    score?: number
    completed_at?: string
    [key: string]: unknown
}

export interface ChatChannel {
    id: string
    name: string
    description?: string
    org_id?: string
    channel_type: 'public' | 'club' | 'direct' | 'announcement'
    created_by?: string
    is_archived?: boolean
    created_at?: string
    [key: string]: unknown
}

export interface ChatMessage {
    id: string
    channel_id: string
    sender_id: string
    content: string
    reply_to?: string
    is_edited?: boolean
    is_deleted?: boolean
    created_at?: string
    updated_at?: string
    [key: string]: unknown
}

export interface ChatChannelMember {
    channel_id: string
    user_id: string
    role: 'member' | 'moderator' | 'admin'
    last_read_at?: string
    joined_at?: string
    [key: string]: unknown
}
