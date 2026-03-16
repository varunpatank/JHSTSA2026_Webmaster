import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Profile, Membership, Organization, OrganizationTag, Meeting, Event, EventTag, Location, Resource, ResourceTag, ChatChannel, ChatMessage } from './apiTypes'
import type { } from './apiTypes' // all other types used via table queries
import webpfy from 'webpfy'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY in environment')
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
})

export const authApi = {
    /** Email + password sign in (native) */
    signInWithEmail: (email: string, password: string) =>
        supabase.auth.signInWithPassword({ email, password }),

    /** Sign in using an OIDC id_token (provider like "google", "azure", etc.) */
    signInWithIdToken: (provider: string, idToken: string) =>
        supabase.auth.signInWithIdToken({ provider: provider as any, token : idToken }),

    /** OAuth / social login (redirect-based) */
    signInWithOAuth: (provider: string, options?: { redirectTo?: string }) =>
        supabase.auth.signInWithOAuth({ provider: provider as any, options }),

    /** Create a new user in auth and a corresponding public profile row.
     *  Accepts: name (full name), email, grade (required for non-adults), optional password,
     *  bio, phone, school. Returns both auth and profile responses.
     */
    createUser: async (data: {
        name: string
        email: string
        grade: string
        password: string
        bio?: string
        phone_number?: string
        school?: string
        is_adult?: boolean
    }) => {
        const { name, email, grade, password, bio, phone_number, school, is_adult } = data

        const signUpPayload: any = { email, password }

        const authRes = await supabase.auth.signUp(signUpPayload)
        if (authRes.error) return { auth: authRes, profile: null }

        const userId = authRes.data.user?.id
        if (!userId) {
            return { auth: authRes, profile: { data: null, error: new Error('User ID not available; profile creation deferred') } }
        }

        const profileRes = await supabase.from('profiles').insert({
            id: userId,
            name: name,
            bio: bio ?? null,
            email,
            phone_number: phone_number ?? null,
            grade: grade ?? null,
            school: school ?? null,
            is_adult: !!is_adult,
        }).select().single()

        return { auth: authRes, profile: profileRes }
    },

    /** Returns true if a user is currently logged in */
    isLoggedIn: async () => !!(await supabase.auth.getUser().then(({ data }) => data.user)),

    /**
     * SSO helper: uses idToken when available (OIDC) otherwise falls back to OAuth redirect.
     * provider examples: "google", "github", custom OIDC provider id.
     */
    signInWithSSO: (provider: string, idToken?: string, options?: { redirectTo?: string }) =>
        idToken
            ? supabase.auth.signInWithIdToken({ provider: provider as any, token : idToken })
            : supabase.auth.signInWithOAuth({ provider: provider as any, options }),

    /** Sign out current session */
    signOut: () => supabase.auth.signOut(),
}

// -----------------------------------------------------------------------
// Profiles
// Policy: viewable by everyone; updatable by the profile owner
// -----------------------------------------------------------------------

export const profilesApi = {
    /** Viewable by everyone (authenticated + anon) */
    getAll: () =>
        supabase.from('profiles').select('*').limit(50),

    getById: (id: string) =>
        supabase.from('profiles').select('*').limit(50).eq('id', id).single(),

    /** Only the authenticated user can update their own profile */
    update: (id: string, data: Partial<Profile>) =>
        supabase.from('profiles').update(data).eq('id', id),
}

// -----------------------------------------------------------------------
// Memberships
// Policy: members see own rows; officers/admins see org rows;
//         officers can update non-permission/position fields;
//         admins can update all fields;
//         members can delete own; admins can delete any in their org
// -----------------------------------------------------------------------

export const membershipsApi = {
    /** Returns all memberships visible to the current user (RLS filters automatically) */
    getForCurrentUser: () =>
        supabase.from('memberships').select('*').limit(50),

    /** All memberships for a given org (RLS ensures only officers/admins see them) */
    getByOrg: (orgId: string) =>
        supabase.from('memberships').select('*').limit(50).eq('org_id', orgId),

    getById: (id: string) =>
        supabase.from('memberships').select('*').limit(50).eq('id', id).single(),

    /**
     * Officers: update fields other than user_permissions and position.
     * Admins: update any field including user_permissions and position.
     * RLS enforces the distinction — pass only the fields you are allowed to change.
     */
    update: (id: string, data: Partial<Membership>) =>
        supabase.from('memberships').update(data).eq('id', id),

    /** Members delete their own; admins delete any in their org (RLS enforced) */
    delete: (id: string) =>
        supabase.from('memberships').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Organizations
// Policy: selectable by everyone; creatable by authenticated users;
//         updatable/deletable by admins
// -----------------------------------------------------------------------

export const organizationsApi = {
    /** Selectable by everyone */
    getAll: () =>
        supabase.from('organizations').select('*').limit(50),

    getById: (id: string) =>
        supabase.from('organizations').select('*').limit(50).eq('id', id).single(),

    /** Creatable by any authenticated user */
    create: (data: Partial<Organization>) =>
        supabase.from('organizations').insert(data).select().single(),

    /** Only admins of the org can update (RLS enforced) */
    update: (id: string, data: Partial<Organization>) =>
        supabase.from('organizations').update(data).eq('id', id),

    /** Only admins of the org can delete (RLS enforced) */
    delete: (id: string) =>
        supabase.from('organizations').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Organization Tags
// Policy: selectable by everyone; insert/update/delete by org admins
// -----------------------------------------------------------------------

export const organizationTagsApi = {
    getAll: () =>
        supabase.from('organizations_tags').select('*').limit(50),

    getByOrg: (orgId: string) =>
        supabase.from('organizations_tags').select('*').limit(50).eq('org_id', orgId),

    /** Only org admins can create (RLS enforced) */
    create: (data: Partial<OrganizationTag>) =>
        supabase.from('organizations_tags').insert(data).select().single(),

    /** Only org admins can update (RLS enforced) */
    update: (id: string, data: Partial<OrganizationTag>) =>
        supabase.from('organizations_tags').update(data).eq('id', id),

    /** Only org admins can delete (RLS enforced) */
    delete: (id: string) =>
        supabase.from('organizations_tags').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Meetings
// Policy: selectable by everyone; insert/update/delete by org admins
// -----------------------------------------------------------------------

export const meetingsApi = {
    getAll: () =>
        supabase.from('meetings').select('*').limit(50),

    getByOrg: (orgId: string) =>
        supabase.from('meetings').select('*').limit(50).eq('org_id', orgId),

    getById: (id: string) =>
        supabase.from('meetings').select('*').limit(50).eq('id', id).single(),

    /** Only org admins can create (RLS enforced) */
    create: (data: Partial<Meeting>) =>
        supabase.from('meetings').insert(data).select().single(),

    /** Only org admins can update (RLS enforced) */
    update: (id: string, data: Partial<Meeting>) =>
        supabase.from('meetings').update(data).eq('id', id),

    /** Only org admins can delete (RLS enforced) */
    delete: (id: string) =>
        supabase.from('meetings').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Events
// Policy: selectable by everyone; insert/update/delete by org admins
// -----------------------------------------------------------------------

export const eventsApi = {
    getAll: () =>
        supabase.from('events').select('*').limit(50),

    getByOrg: (orgId: string) =>
        supabase.from('events').select('*').limit(50).eq('org_id', orgId),

    getById: (id: string) =>
        supabase.from('events').select('*').eq('id', id).single(),

    /** Only org admins can create (RLS enforced) */
    create: (data: Partial<Event>) =>
        supabase.from('events').insert(data).select().single(),

    /** Only org admins can update (RLS enforced) */
    update: (id: string, data: Partial<Event>) =>
        supabase.from('events').update(data).eq('id', id),

    /** Only org admins can delete (RLS enforced) */
    delete: (id: string) =>
        supabase.from('events').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Event Tags
// Policy: selectable by everyone; insert/update/delete by org admins
//         (via join on events → memberships)
// -----------------------------------------------------------------------

export const eventTagsApi = {
    getAll: () =>
        supabase.from('event_tags').select('*').limit(50),

    getByEvent: (eventId: string) =>
        supabase.from('event_tags').select('*').limit(50).eq('event_id', eventId),

    /** Only org admins of the related event's org can create (RLS enforced) */
    create: (data: Partial<EventTag>) =>
        supabase.from('event_tags').insert(data).select().single(),

    /** Only org admins of the related event's org can update (RLS enforced) */
    update: (id: string, data: Partial<EventTag>) =>
        supabase.from('event_tags').update(data).eq('id', id),

    /** Only org admins of the related event's org can delete (RLS enforced) */
    delete: (id: string) =>
        supabase.from('event_tags').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Locations
// Policy: selectable by everyone; insert/update/delete by org admins
// -----------------------------------------------------------------------

export const locationsApi = {
    getAll: () =>
        supabase.from('locations').select('*').limit(50),

    getByOrg: (orgId: string) =>
        supabase.from('locations').select('*').limit(50).eq('org_id', orgId),

    getById: (id: string) =>
        supabase.from('locations').select('*').eq('id', id).single(),

    /** Only org admins can create (RLS enforced) */
    create: (data: Partial<Location>) =>
        supabase.from('locations').insert(data).select().single(),

    /** Only org admins can update (RLS enforced) */
    update: (id: string, data: Partial<Location>) =>
        supabase.from('locations').update(data).eq('id', id),

    /** Only org admins can delete (RLS enforced) */
    delete: (id: string) =>
        supabase.from('locations').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Resources
// Policy: selectable by everyone; creatable by authenticated users;
//         update/delete by uploader OR org admin
// -----------------------------------------------------------------------

export const resourcesApi = {
    getAll: () =>
        supabase.from('resources').select('*').limit(50),

    getByOrg: (orgId: string) =>
        supabase.from('resources').select('*').limit(50).eq('org_id', orgId),

    getById: (id: string) =>
        supabase.from('resources').select('*').eq('id', id).single(),

    /** Any authenticated user can create a resource */
    create: (data: Partial<Resource>) =>
        supabase.from('resources').insert(data).select().single(),

    /** Uploader or org admin can update (RLS enforced) */
    update: (id: string, data: Partial<Resource>) =>
        supabase.from('resources').update(data).eq('id', id),

    /** Uploader or org admin can delete (RLS enforced) */
    delete: (id: string) =>
        supabase.from('resources').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Resource Tags
// Policy: selectable by everyone;
//         insert/update/delete by uploader OR org admin
// -----------------------------------------------------------------------

export const resourceTagsApi = {
    getAll: () =>
        supabase.from('resource_tags').select('*').limit(50),

    getByResource: (resourceId: string) =>
        supabase.from('resource_tags').select('*').limit(50).eq('resource_id', resourceId),

    /** Uploader of the resource or org admin can create (RLS enforced) */
    create: (data: Partial<ResourceTag>) =>
        supabase.from('resource_tags').insert(data).select().single(),

    /** Uploader of the resource or org admin can update (RLS enforced) */
    update: (id: string, data: Partial<ResourceTag>) =>
        supabase.from('resource_tags').update(data).eq('id', id),

    /** Uploader of the resource or org admin can delete (RLS enforced) */
    delete: (id: string) =>
        supabase.from('resource_tags').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Storage helpers (avatars)
// -----------------------------------------------------------------------

export const storageApi = {
    /**
     * Upload a user's avatar to the `avatars` bucket.
     * Returns `{ path, publicUrl }` on success.
     */
    uploadAvatar: async (userId: string, file: File | Blob) => {
        // Attempt to convert image files to webp in-browser for smaller, consistent uploads.
        let uploadBlob : Blob = file as Blob;
        const isImage = (file as any).type && String((file as any).type).startsWith('image/')
        if (isImage) {
            try {
                console.log("Compressing...")
                uploadBlob = (await webpfy({image : file, quality : 50})).webpBlob;
                console.log("Compressed!")
            }
            catch (e) {
                console.log("Error converting image to webp:", e);
            }
        } else {
            console.warn("Image not recognized as image")
        }

        const path = `${userId}/${Date.now()}.webp`

        const { data, error } = await supabase.storage.from('avatars').upload(path, uploadBlob, { upsert: true, contentType: 'image/webp' })
        if (error) return { data: null, error }

        const publicUrl = supabase.storage.from('avatars').getPublicUrl(data.path).data.publicUrl

        // After a successful upload, attempt to delete the user's previous avatar
        // (if any). We read the `avatar_url` from the profiles table, derive the
        // storage object path from the public URL, and remove it. Failures here
        // are non-fatal (we still return the new avatar info).
        try {
            const prevProfile = await supabase.from('profiles').select('avatar_url').eq('id', userId).single()
            if (!prevProfile.error && prevProfile.data && prevProfile.data.avatar_url) {
                const prevUrl: string = prevProfile.data.avatar_url
                const parts = prevUrl.split('/avatars/')
                const prevPath = parts.length > 1 ? decodeURIComponent(parts[1]) : null
                if (prevPath && prevPath !== data.path) {
                    await supabase.storage.from('avatars').remove([prevPath])
                }
            }
        }
        catch (e) {
            console.warn('Failed to remove previous avatar:', e)
        }

        return { data: { path: data.path, publicUrl }, error: null }
    },

    /**
     * Get a public URL for an avatar path. If your bucket is private,
     * replace this with `createSignedUrl` usage.
     */
    getAvatarPublicUrl: (path: string | null) => {
        if (!path) return null
        return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
    },
}

// -----------------------------------------------------------------------
// Comments
// -----------------------------------------------------------------------

export const commentsApi = {
    getByOrg: (orgId: string) =>
        supabase.from('comments').select('*, profiles(name, avatar_url)').eq('org_id', orgId).order('created_at', { ascending: false }).limit(100),

    getByEvent: (eventId: string) =>
        supabase.from('comments').select('*, profiles(name, avatar_url)').eq('event_id', eventId).order('created_at', { ascending: false }).limit(100),

    getByResource: (resourceId: string) =>
        supabase.from('comments').select('*, profiles(name, avatar_url)').eq('resource_id', resourceId).order('created_at', { ascending: false }).limit(100),

    create: (data: { user_id: string; content: string; org_id?: string; event_id?: string; resource_id?: string; parent_comment_id?: string }) =>
        supabase.from('comments').insert(data).select('*, profiles(name, avatar_url)').single(),

    update: (id: string, content: string) =>
        supabase.from('comments').update({ content, updated_at: new Date().toISOString() }).eq('id', id),

    delete: (id: string) =>
        supabase.from('comments').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Announcements
// -----------------------------------------------------------------------

export const announcementsApi = {
    getAll: () =>
        supabase.from('announcements').select('*, profiles(name)').order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(50),

    getByOrg: (orgId: string) =>
        supabase.from('announcements').select('*, profiles(name)').eq('org_id', orgId).order('created_at', { ascending: false }).limit(50),

    create: (data: { author_id: string; title: string; content: string; org_id?: string; priority?: string }) =>
        supabase.from('announcements').insert(data).select().single(),

    update: (id: string, data: { title?: string; content?: string; priority?: string; is_pinned?: boolean }) =>
        supabase.from('announcements').update(data).eq('id', id),

    delete: (id: string) =>
        supabase.from('announcements').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Discussions
// -----------------------------------------------------------------------

export const discussionsApi = {
    getAll: () =>
        supabase.from('discussions').select('*, profiles(name, avatar_url)').order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(50),

    getByOrg: (orgId: string) =>
        supabase.from('discussions').select('*, profiles(name, avatar_url)').eq('org_id', orgId).order('created_at', { ascending: false }).limit(50),

    getById: (id: string) =>
        supabase.from('discussions').select('*, profiles(name, avatar_url)').eq('id', id).single(),

    create: (data: { author_id: string; title: string; content: string; org_id?: string }) =>
        supabase.from('discussions').insert(data).select().single(),

    getReplies: (discussionId: string) =>
        supabase.from('discussion_replies').select('*, profiles(name, avatar_url)').eq('discussion_id', discussionId).order('created_at').limit(200),

    addReply: (data: { discussion_id: string; author_id: string; content: string }) =>
        supabase.from('discussion_replies').insert(data).select('*, profiles(name, avatar_url)').single(),
}

// -----------------------------------------------------------------------
// Notifications
// -----------------------------------------------------------------------

export const notificationsApi = {
    getForUser: () =>
        supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50),

    markRead: (id: string) =>
        supabase.from('notifications').update({ is_read: true }).eq('id', id),

    markAllRead: (userId: string) =>
        supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false),

    delete: (id: string) =>
        supabase.from('notifications').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Quizzes
// -----------------------------------------------------------------------

export const quizzesApi = {
    getAll: () =>
        supabase.from('quizzes').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(50),

    getById: (id: string) =>
        supabase.from('quizzes').select('*').eq('id', id).single(),

    create: (data: { title: string; description?: string; created_by: string; questions: unknown[]; org_id?: string; is_published?: boolean }) =>
        supabase.from('quizzes').insert(data).select().single(),

    submitResult: (data: { quiz_id: string; user_id: string; answers: unknown[]; score?: number }) =>
        supabase.from('quiz_results').insert(data).select().single(),

    getResults: (quizId: string, userId: string) =>
        supabase.from('quiz_results').select('*').eq('quiz_id', quizId).eq('user_id', userId).single(),
}

// -----------------------------------------------------------------------
// Uploads
// -----------------------------------------------------------------------

export const uploadsApi = {
    getAll: () =>
        supabase.from('uploads').select('*, profiles(name)').order('created_at', { ascending: false }).limit(50),

    getByOrg: (orgId: string) =>
        supabase.from('uploads').select('*, profiles(name)').eq('org_id', orgId).order('created_at', { ascending: false }).limit(50),

    create: (data: { user_id: string; file_name: string; file_url: string; file_type?: string; file_size?: number; description?: string; org_id?: string }) =>
        supabase.from('uploads').insert(data).select().single(),

    delete: (id: string) =>
        supabase.from('uploads').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Event Registrations (RSVP)
// -----------------------------------------------------------------------

export const eventRegistrationsApi = {
    getByEvent: (eventId: string) =>
        supabase.from('event_registrations').select('*, profiles(name, avatar_url)').eq('event_id', eventId).limit(200),

    getByUser: (userId: string) =>
        supabase.from('event_registrations').select('*, events(*)').eq('user_id', userId).limit(50),

    register: (data: { event_id: string; user_id: string }) =>
        supabase.from('event_registrations').insert(data).select().single(),

    updateStatus: (id: string, status: string) =>
        supabase.from('event_registrations').update({ status }).eq('id', id),

    cancel: (eventId: string, userId: string) =>
        supabase.from('event_registrations').update({ status: 'cancelled' }).eq('event_id', eventId).eq('user_id', userId),
}

// -----------------------------------------------------------------------
// Club Proposals
// -----------------------------------------------------------------------

export const clubProposalsApi = {
    getByUser: (userId: string) =>
        supabase.from('club_proposals').select('*').eq('submitted_by', userId).order('submitted_at', { ascending: false }).limit(20),

    create: (data: {
        submitted_by: string; club_name: string; mission_statement: string;
        category?: string; proposed_advisor?: string; advisor_email?: string;
        justification?: string; constitution_draft?: string; first_year_plan?: string;
        budget_requirements?: string; meeting_space_needs?: string; interested_members?: string;
        logo_url?: string; poster_url?: string;
    }) =>
        supabase.from('club_proposals').insert(data).select().single(),

    getById: (id: string) =>
        supabase.from('club_proposals').select('*').eq('id', id).single(),
}

// -----------------------------------------------------------------------
// Donations
// -----------------------------------------------------------------------

export const donationsApi = {
    getByOrg: (orgId: string) =>
        supabase.from('donations').select('*').eq('org_id', orgId).order('created_at', { ascending: false }).limit(50),

    create: (data: {
        org_id?: string; donor_id?: string; donor_name?: string; donor_email?: string;
        amount: number; message?: string; is_recurring?: boolean; stripe_session_id?: string;
        status?: string;
    }) =>
        supabase.from('donations').insert(data).select().single(),
}

// -----------------------------------------------------------------------
// Service Hours
// -----------------------------------------------------------------------

export const serviceHoursApi = {
    getByUser: (userId: string) =>
        supabase.from('service_hours').select('*, organizations(name)').eq('user_id', userId).order('date', { ascending: false }).limit(50),

    getByOrg: (orgId: string) =>
        supabase.from('service_hours').select('*, profiles(name)').eq('org_id', orgId).order('date', { ascending: false }).limit(100),

    create: (data: { user_id: string; org_id?: string; event_id?: string; hours: number; description?: string; date: string }) =>
        supabase.from('service_hours').insert(data).select().single(),

    verify: (id: string, verifiedBy: string) =>
        supabase.from('service_hours').update({ verified: true, verified_by: verifiedBy }).eq('id', id),
}

// -----------------------------------------------------------------------
// Ratings
// -----------------------------------------------------------------------

export const ratingsApi = {
    getByOrg: (orgId: string) =>
        supabase.from('ratings').select('*, profiles(name, avatar_url)').eq('org_id', orgId).order('created_at', { ascending: false }).limit(50),

    getAverageForOrg: async (orgId: string) => {
        const { data, error } = await supabase.from('ratings').select('rating').eq('org_id', orgId)
        if (error || !data?.length) return { avg: 0, count: 0, error }
        const avg = data.reduce((s, r) => s + r.rating, 0) / data.length
        return { avg: Math.round(avg * 10) / 10, count: data.length, error: null }
    },

    upsert: (data: { org_id: string; user_id: string; rating: number; review?: string }) =>
        supabase.from('ratings').upsert(data, { onConflict: 'org_id,user_id' }).select().single(),

    delete: (orgId: string, userId: string) =>
        supabase.from('ratings').delete().eq('org_id', orgId).eq('user_id', userId),
}

// -----------------------------------------------------------------------
// Bookmarks
// -----------------------------------------------------------------------

export const bookmarksApi = {
    getByUser: () =>
        supabase.from('bookmarks').select('*, organizations(name, slug), events(name, time), resources(name), discussions(title)').order('created_at', { ascending: false }).limit(50),

    create: (data: { user_id: string; org_id?: string; event_id?: string; resource_id?: string; discussion_id?: string }) =>
        supabase.from('bookmarks').insert(data).select().single(),

    delete: (id: string) =>
        supabase.from('bookmarks').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Activity Log
// -----------------------------------------------------------------------

export const activityLogApi = {
    getByUser: (userId: string) =>
        supabase.from('activity_log').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(30),

    getByOrg: (orgId: string) =>
        supabase.from('activity_log').select('*, profiles(name)').eq('org_id', orgId).order('created_at', { ascending: false }).limit(50),

    log: (data: { user_id: string; org_id?: string; action: string; target_type?: string; target_id?: string; metadata?: Record<string, unknown> }) =>
        supabase.from('activity_log').insert(data),
}

// -----------------------------------------------------------------------
// Org Analytics
// -----------------------------------------------------------------------

export const orgAnalyticsApi = {
    getByOrg: (orgId: string) =>
        supabase.from('org_analytics').select('*').eq('org_id', orgId).order('snapshot_date', { ascending: false }).limit(30),

    getLatest: (orgId: string) =>
        supabase.from('org_analytics').select('*').eq('org_id', orgId).order('snapshot_date', { ascending: false }).limit(1).single(),

    upsert: (data: {
        org_id: string; snapshot_date?: string; total_members?: number; active_members?: number;
        events_held?: number; avg_attendance?: number; new_members?: number;
        retention_rate?: number; engagement_score?: number;
        meetings_held?: number; service_hours_total?: number; competition_wins?: number;
    }) =>
        supabase.from('org_analytics').upsert(data, { onConflict: 'org_id,snapshot_date' }).select().single(),
}

// -----------------------------------------------------------------------
// Projects
// -----------------------------------------------------------------------

export const projectsApi = {
    getByOrg: (orgId: string) =>
        supabase.from('projects').select('*').eq('org_id', orgId).order('created_at', { ascending: false }).limit(20),

    create: (data: { org_id: string; title: string; description?: string; status?: string; start_date?: string; created_by?: string }) =>
        supabase.from('projects').insert(data).select().single(),

    update: (id: string, data: Partial<{ title: string; description: string; status: string; end_date: string; image_url: string; external_url: string }>) =>
        supabase.from('projects').update(data).eq('id', id),
}

// -----------------------------------------------------------------------
// Sponsors
// -----------------------------------------------------------------------

export const sponsorsApi = {
    getByOrg: (orgId: string) =>
        supabase.from('sponsors').select('*').eq('org_id', orgId).eq('active', true).order('tier').limit(20),

    create: (data: { org_id: string; name: string; description?: string; logo_url?: string; website?: string; tier?: string }) =>
        supabase.from('sponsors').insert(data).select().single(),
}

// -----------------------------------------------------------------------
// Meeting Notes
// -----------------------------------------------------------------------

export const meetingNotesApi = {
    getByOrg: (orgId: string) =>
        supabase.from('meeting_notes').select('*').eq('org_id', orgId).order('meeting_date', { ascending: false }).limit(20),

    create: (data: { org_id: string; meeting_id?: string; title?: string; content: string; recorded_by?: string; meeting_date: string; attendee_count?: number; action_items?: unknown[] }) =>
        supabase.from('meeting_notes').insert(data).select().single(),
}

// -----------------------------------------------------------------------
// Club History
// -----------------------------------------------------------------------

export const clubHistoryApi = {
    getByOrg: (orgId: string) =>
        supabase.from('club_history').select('*').eq('org_id', orgId).order('event_date', { ascending: false }).limit(50),

    create: (data: { org_id: string; event_type: string; title: string; description?: string; event_date: string }) =>
        supabase.from('club_history').insert(data).select().single(),
}

// -----------------------------------------------------------------------
// Advisors
// -----------------------------------------------------------------------

export const advisorsApi = {
    getByOrg: (orgId: string) =>
        supabase.from('advisors').select('*').eq('org_id', orgId).limit(10),

    create: (data: { org_id: string; name: string; email?: string; phone?: string; department?: string; title?: string; is_primary?: boolean }) =>
        supabase.from('advisors').insert(data).select().single(),

    update: (id: string, data: Partial<{ name: string; email: string; phone: string; department: string; title: string; is_primary: boolean }>) =>
        supabase.from('advisors').update(data).eq('id', id),

    delete: (id: string) =>
        supabase.from('advisors').delete().eq('id', id),
}

// -----------------------------------------------------------------------
// Club Ideas
// -----------------------------------------------------------------------

export const clubIdeasApi = {
    getAll: () =>
        supabase.from('club_ideas').select('*, profiles(name)').order('votes', { ascending: false }).limit(50),

    create: (data: { author_id: string; title: string; description: string; category?: string }) =>
        supabase.from('club_ideas').insert(data).select().single(),

    vote: (ideaId: string, userId: string, vote: 1 | -1) =>
        supabase.from('club_idea_votes').upsert({ idea_id: ideaId, user_id: userId, vote }, { onConflict: 'idea_id,user_id' }),

    removeVote: (ideaId: string, userId: string) =>
        supabase.from('club_idea_votes').delete().eq('idea_id', ideaId).eq('user_id', userId),
}

// -----------------------------------------------------------------------
// Mentors
// -----------------------------------------------------------------------

export const mentorsApi = {
    getAll: () =>
        supabase.from('mentors').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(50),

    getById: (id: string) =>
        supabase.from('mentors').select('*').eq('id', id).single(),

    requestMentor: (data: { mentor_id: string; mentee_id: string; message?: string }) =>
        supabase.from('mentorship_requests').insert(data).select().single(),
}

// -----------------------------------------------------------------------
// Success Stories
// -----------------------------------------------------------------------

export const successStoriesApi = {
    getAll: () =>
        supabase.from('success_stories').select('*, profiles(name, avatar_url), organizations(name)').order('created_at', { ascending: false }).limit(20),

    getFeatured: () =>
        supabase.from('success_stories').select('*, profiles(name, avatar_url), organizations(name)').eq('is_featured', true).limit(5),

    create: (data: { author_id: string; org_id?: string; title: string; content: string; image_url?: string }) =>
        supabase.from('success_stories').insert(data).select().single(),
}

// -----------------------------------------------------------------------
// Collaborations
// -----------------------------------------------------------------------

export const collaborationsApi = {
    getAll: () =>
        supabase.from('collaborations').select('*, organizations(name, logo_url)').order('created_at', { ascending: false }).limit(20),

    create: (data: { org_id: string; title: string; description: string; type?: string }) =>
        supabase.from('collaborations').insert(data).select().single(),

    join: (collaborationId: string, orgId: string) =>
        supabase.from('collaboration_participants').insert({ collaboration_id: collaborationId, org_id: orgId }),
}

// -----------------------------------------------------------------------
// Upload Likes
// -----------------------------------------------------------------------

export const uploadLikesApi = {
    like: (uploadId: string, userId: string) =>
        supabase.from('upload_likes').insert({ upload_id: uploadId, user_id: userId }),

    unlike: (uploadId: string, userId: string) =>
        supabase.from('upload_likes').delete().eq('upload_id', uploadId).eq('user_id', userId),

    hasLiked: async (uploadId: string, userId: string) => {
        const { data } = await supabase.from('upload_likes').select('upload_id').eq('upload_id', uploadId).eq('user_id', userId).maybeSingle()
        return !!data
    },
}

// -----------------------------------------------------------------------
// Achievements
// -----------------------------------------------------------------------

export const achievementsApi = {
    getAll: () =>
        supabase.from('achievements').select('*').order('points', { ascending: false }).limit(50),

    getUserAchievements: (userId: string) =>
        supabase.from('user_achievements').select('*, achievements(*)').eq('user_id', userId).limit(50),

    award: (userId: string, achievementId: string) =>
        supabase.from('user_achievements').insert({ user_id: userId, achievement_id: achievementId }),
}

// -----------------------------------------------------------------------
// Chat Channels & Messages (Real-time)
// -----------------------------------------------------------------------

export const chatChannelsApi = {
    getAll: () =>
        supabase.from('chat_channels').select('*').eq('is_archived', false).order('created_at', { ascending: false }).limit(50),

    getByOrg: (orgId: string) =>
        supabase.from('chat_channels').select('*').eq('org_id', orgId).eq('is_archived', false).order('created_at').limit(20),

    getById: (id: string) =>
        supabase.from('chat_channels').select('*').eq('id', id).single(),

    create: (data: { name: string; description?: string; org_id?: string; channel_type?: string; created_by: string }) =>
        supabase.from('chat_channels').insert(data).select().single(),

    update: (id: string, data: Partial<ChatChannel>) =>
        supabase.from('chat_channels').update(data).eq('id', id),

    archive: (id: string) =>
        supabase.from('chat_channels').update({ is_archived: true }).eq('id', id),
}

export const chatMessagesApi = {
    getByChannel: (channelId: string, limit = 100) =>
        supabase.from('chat_messages').select('*, profiles(name, avatar_url)')
            .eq('channel_id', channelId).eq('is_deleted', false)
            .order('created_at', { ascending: true }).limit(limit),

    send: (data: { channel_id: string; sender_id: string; content: string; reply_to?: string }) =>
        supabase.from('chat_messages').insert(data).select('*, profiles(name, avatar_url)').single(),

    edit: (id: string, content: string) =>
        supabase.from('chat_messages').update({ content, is_edited: true, updated_at: new Date().toISOString() }).eq('id', id),

    softDelete: (id: string) =>
        supabase.from('chat_messages').update({ is_deleted: true, content: '[deleted]' }).eq('id', id),

    /** Subscribe to real-time messages in a channel */
    subscribe: (channelId: string, callback: (msg: ChatMessage) => void) => {
        return supabase
            .channel(`chat:${channelId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `channel_id=eq.${channelId}`,
            }, (payload) => callback(payload.new as ChatMessage))
            .subscribe()
    },
}

export const chatMembersApi = {
    getByChannel: (channelId: string) =>
        supabase.from('chat_channel_members').select('*, profiles(name, avatar_url)').eq('channel_id', channelId),

    join: (channelId: string, userId: string) =>
        supabase.from('chat_channel_members').insert({ channel_id: channelId, user_id: userId }),

    leave: (channelId: string, userId: string) =>
        supabase.from('chat_channel_members').delete().eq('channel_id', channelId).eq('user_id', userId),

    updateLastRead: (channelId: string, userId: string) =>
        supabase.from('chat_channel_members').update({ last_read_at: new Date().toISOString() })
            .eq('channel_id', channelId).eq('user_id', userId),
}

// -----------------------------------------------------------------------
// Statistics Views (read-only)
// -----------------------------------------------------------------------

export const statisticsApi = {
    /** Get aggregated stats for a specific user */
    getUserStats: (userId: string) =>
        supabase.from('user_statistics').select('*').eq('user_id', userId).single(),

    /** Get aggregated stats for a specific club */
    getClubStats: (orgId: string) =>
        supabase.from('club_statistics').select('*').eq('org_id', orgId).single(),

    /** Get all club stats (for directory/leaderboard) */
    getAllClubStats: () =>
        supabase.from('club_statistics').select('*').eq('is_active', true).order('total_members', { ascending: false }).limit(100),

    /** Get clubs a user is enrolled in */
    getUserClubs: (userId: string) =>
        supabase.from('user_club_enrollments').select('*').eq('user_id', userId).order('joined_at', { ascending: false }),

    /** Get member list for a club */
    getClubMembers: (orgId: string) =>
        supabase.from('club_member_list').select('*').eq('org_id', orgId).order('joined_at'),

    /** Get community uploads with author info */
    getCommunityUploads: () =>
        supabase.from('community_uploads').select('*').limit(50),

    /** Get discussion threads with details */
    getDiscussionThreads: (orgId?: string) => {
        let query = supabase.from('discussion_threads').select('*').limit(50)
        if (orgId) query = query.eq('org_id', orgId)
        return query
    },
}

// -----------------------------------------------------------------------
// Membership (join a club)
// -----------------------------------------------------------------------

export const membershipJoinApi = {
    /** Join a club (creates membership with 'member' role) */
    joinClub: (orgId: string, userId: string) =>
        supabase.from('memberships').insert({
            org_id: orgId,
            user_id: userId,
            user_permissions: 'member',
        }).select().single(),

    /** Leave a club */
    leaveClub: (orgId: string, userId: string) =>
        supabase.from('memberships').delete().eq('org_id', orgId).eq('user_id', userId),

    /** Check if user is member of a club */
    isMember: async (orgId: string, userId: string) => {
        const { data } = await supabase.from('memberships')
            .select('id').eq('org_id', orgId).eq('user_id', userId).maybeSingle()
        return !!data
    },
}