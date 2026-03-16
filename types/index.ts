export interface Chapter {
  id: string;
  name: string;
  description: string;
  category: ChapterCategory;
  meetingFrequency: MeetingFrequency;
  membershipStatus: MembershipStatus;
  gradeLevel: GradeLevel;
  meetingTime: MeetingTime;
  advisor: Advisor;
  officers: Officer[];
  meetingSchedule: string;
  meetingLocation: ChapterMeetingLocation;
  membershipRequirements: string;
  dues: string;
  socialLinks: SocialLinks;
  achievements: string[];
  photoGallery: string[];
  memberCount: number;
  foundedYear: number;
  isActive: boolean;
}

export interface ChapterMeetingLocation {
  lat: number;
  lng: number;
  parentOrg?: string;
  room?: string;
  internalLocation?: string;
}

export type ChapterCategory =
  | "Academic"
  | "Arts"
  | "Service"
  | "Cultural"
  | "STEM"
  | "Sports"
  | "Leadership"
  | "Media"
  | "Other";

export type MeetingFrequency = "Daily" | "Weekly" | "Bi-weekly" | "Monthly";

export type MembershipStatus =
  | "Open Enrollment"
  | "Tryout Required"
  | "Application Required";

export type GradeLevel = "9th Only" | "10th-12th" | "All Grades";

export type MeetingTime =
  | "Before School"
  | "Lunch"
  | "After School"
  | "Weekends";

export interface Advisor {
  name: string;
  email: string;
  department: string;
  phone?: string;
}

export interface Officer {
  name: string;
  position: string;
  email: string;
  grade: number;
  photo?: string;
}

export interface SocialLinks {
  website?: string;
  instagram?: string;
  twitter?: string;
  discord?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  chapterId: string;
  chapterName: string;
  category: ChapterCategory;
  isPublic: boolean;
  requiresRSVP: boolean;
  maxAttendees?: number;
  currentAttendees: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  fileType: string;
  downloadUrl: string;
  dateAdded: string;
}

export type ResourceCategory =
  | "Templates"
  | "Training Materials"
  | "Forms"
  | "Guides"
  | "Handbooks";

export interface Spotlight {
  id: string;
  chapterId: string;
  chapter: Chapter;
  title: string;
  content: string;
  highlights: string[];
  testimonials: Testimonial[];
  featuredImages: string[];
  datePublished: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface ChapterProposal {
  id: string;
  chapterName: string;
  missionStatement: string;
  proposedAdvisor: string;
  justification: string;
  constitutionDraft: string;
  firstYearPlan: string;
  budgetRequirements: string;
  meetingSpaceNeeds: string;
  submittedBy: string;
  submittedDate: string;
  status: ProposalStatus;
}

export type ProposalStatus =
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Denied"
  | "Needs Revision";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  grade?: number;
  chapters: string[];
}

export type UserRole = "Student" | "Officer" | "Advisor" | "Admin";

export interface Stats {
  activeChapters: number;
  totalMembers: number;
  upcomingEvents: number;
  newMembersThisMonth: number;
}

// ==========================================
// COMMUNITY RESOURCE HUB - Extended Types
// ==========================================

// Club Starter Toolkit Types
export interface StarterGuide {
  id: string;
  title: string;
  description: string;
  category: StarterGuideCategory;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  steps: GuideStep[];
  downloadUrl?: string;
  videoUrl?: string;
  relatedGuides: string[];
  views: number;
  helpful: number;
  dateUpdated: string;
}

export type StarterGuideCategory =
  | "Getting Started"
  | "Constitution & Bylaws"
  | "Recruiting Members"
  | "Running Meetings"
  | "Event Planning"
  | "Fundraising"
  | "Marketing"
  | "Leadership"
  | "Advisor Relations"
  | "Competitions";

export interface GuideStep {
  stepNumber: number;
  title: string;
  content: string;
  tips?: string[];
  warnings?: string[];
  resources?: { title: string; url: string }[];
}

// Club Ideas Generator Types
export interface ClubIdea {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ChapterCategory;
  targetAudience: string[];
  estimatedInterest: "Low" | "Medium" | "High" | "Very High";
  startupCost: "Free" | "Low ($0-50)" | "Medium ($50-200)" | "High ($200+)";
  difficultyToStart: "Easy" | "Moderate" | "Challenging";
  suggestedActivities: string[];
  potentialPartners: string[];
  successTips: string[];
  existsAtSchool: boolean;
  votes: number;
  submittedBy?: string;
  dateSubmitted: string;
}

export interface ClubIdeaSubmission {
  name: string;
  tagline: string;
  description: string;
  category: ChapterCategory;
  targetAudience: string[];
  suggestedActivities: string[];
  submitterName: string;
  submitterEmail: string;
  submitterGrade: string;
}

// Competition Hub Types
export interface Competition {
  id: string;
  name: string;
  organization: string;
  description: string;
  category: ChapterCategory;
  eligibility: string[];
  registrationDeadline: string;
  competitionDates: string;
  location: string;
  locationType: "In-Person" | "Virtual" | "Hybrid";
  entryFee: string;
  prizes: string[];
  websiteUrl: string;
  difficulty: "Beginner-Friendly" | "Intermediate" | "Advanced" | "Elite";
  teamSize: string;
  preparationResources: CompetitionResource[];
  pastWinners?: string[];
  schoolParticipationHistory: SchoolParticipation[];
  isFeatured: boolean;
}

export interface CompetitionResource {
  title: string;
  type: "Guide" | "Video" | "Practice" | "Template" | "External";
  url: string;
}

export interface SchoolParticipation {
  year: number;
  placement?: string;
  participants: string[];
  highlights?: string;
}

export interface CompetitionTracker {
  id: string;
  competitionId: string;
  chapterId: string;
  status: "Interested" | "Registered" | "Preparing" | "Completed" | "Won";
  teamMembers: string[];
  notes: string;
  preparationChecklist: { task: string; completed: boolean }[];
  dateAdded: string;
}

// Club Health Dashboard Types
export interface ClubHealthMetrics {
  chapterId: string;
  clubId: string;
  clubName: string;
  overallScore: number; // 0-100
  metrics: {
    memberEngagement: number;
    eventFrequency: number;
    memberRetention: number;
    leadershipDevelopment: number;
    communityImpact: number;
    financialHealth: number;
  };
  // Additional metrics used by dashboard
  memberRetention: number;
  eventAttendance: number;
  memberSatisfaction: number;
  leadershipDevelopment: number;
  communityImpact: number;
  financialHealth: number;
  growthRate: number;
  engagementScore: number;
  totalMembers: number;
  activeMembers: number;
  eventsThisMonth: number;
  newMembersLast30Days: number;
  trends: {
    metric: string;
    direction: "up" | "down" | "stable";
    change: number;
  }[];
  recommendations: string[];
  lastUpdated: string;
}

export interface ClubBenchmark {
  category: ChapterCategory;
  averageMembers: number;
  averageEventsPerMonth: number;
  averageRetentionRate: number;
  topPerformers: string[];
}

// Mentorship Network Types
export interface Mentor {
  id: string;
  name: string;
  type: "Alumni" | "Current Officer" | "Advisor" | "Community Partner";
  title: string;
  organization?: string;
  bio: string;
  expertise: string[];
  chaptersAdvised: string[];
  availability: "Available" | "Limited" | "Full";
  contactMethod: "Email" | "Platform Message" | "Schedule Meeting";
  email?: string;
  linkedIn?: string;
  testimonials: MentorTestimonial[];
  sessionsCompleted: number;
  rating: number;
  photoUrl?: string;
}

export interface MentorTestimonial {
  quote: string;
  author: string;
  role: string;
  date: string;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  menteeId: string;
  menteeName: string;
  menteeEmail: string;
  chapterName?: string;
  topics: string[];
  message: string;
  preferredSchedule: string;
  status: "Pending" | "Accepted" | "Declined" | "Completed";
  dateSubmitted: string;
}

// Collaboration Finder Types
export interface CollaborationOpportunity {
  id: string;
  title: string;
  description: string;
  hostChapterId: string;
  hostChapterName: string;
  type: CollaborationType;
  category: ChapterCategory[];
  targetChapters: string[];
  requirements: string[];
  benefits: string[];
  proposedDate?: string;
  deadline: string;
  maxParticipants?: number;
  currentInterest: number;
  status: "Open" | "In Progress" | "Completed" | "Cancelled";
  interestedChapters: {
    chapterId: string;
    chapterName: string;
    dateExpressed: string;
  }[];
  datePosted: string;
}

export type CollaborationType =
  | "Joint Event"
  | "Fundraiser"
  | "Community Service"
  | "Competition Team"
  | "Workshop"
  | "Mentorship Exchange"
  | "Resource Sharing"
  | "Cross-Promotion";

export interface CollaborationProposal {
  title: string;
  description: string;
  type: CollaborationType;
  category: ChapterCategory[];
  requirements: string[];
  benefits: string[];
  proposedDate?: string;
  deadline: string;
  maxParticipants?: number;
  submitterName: string;
  submitterEmail: string;
  chapterName: string;
}

// Success Stories Types
export interface SuccessStory {
  id: string;
  title: string;
  summary: string;
  fullStory: string;
  chapterId?: string;
  chapterName?: string;
  authorName: string;
  authorRole: string;
  authorGrade?: string;
  category: SuccessCategory;
  tags: string[];
  impactMetrics?: { label: string; value: string }[];
  images?: string[];
  videoUrl?: string;
  featured: boolean;
  likes: number;
  shares: number;
  datePublished: string;
}

export type SuccessCategory =
  | "Personal Growth"
  | "Competition Victory"
  | "Community Impact"
  | "Club Turnaround"
  | "Innovative Event"
  | "Leadership Journey"
  | "Collaboration Success"
  | "Fundraising Achievement"
  | "Alumni Career";

export interface StorySubmission {
  title: string;
  summary: string;
  fullStory: string;
  chapterName?: string;
  authorName: string;
  authorEmail: string;
  authorRole: string;
  category: SuccessCategory;
  tags: string[];
  impactMetrics?: { label: string; value: string }[];
}

// Resource Request Types
export interface ResourceRequest {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory | "New Category";
  requestType:
    | "New Resource"
    | "Update Existing"
    | "Translation"
    | "Accessibility";
  urgency: "Low" | "Medium" | "High" | "Critical";
  suggestedFormat?: string;
  requesterName: string;
  requesterEmail: string;
  chapterName?: string;
  status:
    | "Submitted"
    | "Under Review"
    | "In Progress"
    | "Completed"
    | "Declined";
  adminNotes?: string;
  dateSubmitted: string;
  dateResolved?: string;
  upvotes: number;
  upvoters: string[];
}

// Club Comparison Types
export interface ComparisonCriteria {
  id: string;
  label: string;
  description: string;
  category: "Basic Info" | "Commitment" | "Opportunities" | "Culture";
}

// Achievement System Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  points: number;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  requirements: string[];
  unlockedBy: number; // percentage of users
}

export type AchievementCategory =
  | "Participation"
  | "Leadership"
  | "Events"
  | "Service"
  | "Competitions"
  | "Mentorship"
  | "Community";

export interface UserAchievements {
  odingerId: string;
  achievements: { achievementId: string; dateEarned: string }[];
  totalPoints: number;
  level: number;
  rank: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  chapterName?: string;
  points: number;
  achievementCount: number;
  level: number;
}

// Calendar Integration Types
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  chapterId?: string;
  chapterName?: string;
  eventType: "Meeting" | "Event" | "Competition" | "Deadline" | "Workshop";
  isRecurring: boolean;
  recurrencePattern?: string;
  reminders: { time: string; method: "Email" | "Push" | "Both" }[];
  attendees?: string[];
  color: string;
  icsUrl?: string;
}

export interface CalendarSubscription {
  id: string;
  userId: string;
  chapterIds: string[];
  categories: ChapterCategory[];
  includeDeadlines: boolean;
  includeCompetitions: boolean;
  syncMethod: "Google" | "Apple" | "Outlook" | "ICS";
  lastSynced: string;
}

// Quiz and Assessment Types
export interface ClubFinderQuiz {
  id: string;
  question: string;
  questionType: "single" | "multiple" | "scale" | "ranking";
  options: QuizOption[];
  weight: number;
}

export interface QuizOption {
  id: string;
  text: string;
  categoryScores: { category: ChapterCategory; score: number }[];
}

export interface QuizResult {
  topCategories: { category: ChapterCategory; matchPercentage: number }[];
  recommendedChapters: Chapter[];
  personalityTraits: string[];
  suggestedActivities: string[];
}

// Analytics Types (for database-ready features)
export interface PageAnalytics {
  pageId: string;
  pageName: string;
  views: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  topReferrers: { source: string; count: number }[];
  dateRange: { start: string; end: string };
}

export interface UserEngagement {
  userId: string;
  sessionsCount: number;
  pagesViewed: string[];
  actionsCompleted: string[];
  lastActive: string;
  engagementScore: number;
}

// Notification System Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  dateCreated: string;
}

export type NotificationType =
  | "Event Reminder"
  | "New Resource"
  | "Competition Deadline"
  | "Mentorship Update"
  | "Achievement Unlocked"
  | "Collaboration Request"
  | "Announcement";

// ==========================================
// EXPANDED TYPES FOR COMPREHENSIVE FEATURES
// ==========================================

// Club History / Timeline
export interface ClubHistoryEvent {
  id: string;
  orgId: string;
  eventType: "founded" | "achievement" | "milestone" | "leadership_change" | "event_highlight" | "membership_milestone" | "competition_result";
  title: string;
  description?: string;
  eventDate: string;
}

// Project Showcase
export interface Project {
  id: string;
  orgId: string;
  title: string;
  description?: string;
  status: "planning" | "in_progress" | "completed" | "on_hold";
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  externalUrl?: string;
  createdBy?: string;
}

// Sponsor / Partnership
export interface Sponsor {
  id: string;
  orgId?: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  tier: "supporter" | "bronze" | "silver" | "gold" | "platinum";
  active: boolean;
}

// Meeting Notes
export interface MeetingNote {
  id: string;
  orgId: string;
  meetingId?: string;
  title?: string;
  content: string;
  recordedBy?: string;
  meetingDate: string;
  attendeeCount?: number;
  actionItems?: { task: string; assignee?: string; completed: boolean }[];
}

// Event Registration
export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: "registered" | "waitlisted" | "cancelled" | "attended";
  registeredAt: string;
}

// Service Hours
export interface ServiceHour {
  id: string;
  userId: string;
  orgId?: string;
  eventId?: string;
  hours: number;
  description?: string;
  date: string;
  verified: boolean;
}

// Donation
export interface Donation {
  id: string;
  orgId?: string;
  donorName?: string;
  donorEmail?: string;
  amount: number;
  message?: string;
  isRecurring: boolean;
  status: "pending" | "completed" | "refunded" | "failed";
  createdAt: string;
}

// Club Proposal (DB-backed)
export interface ClubProposalDB {
  id: string;
  submittedBy: string;
  clubName: string;
  missionStatement: string;
  category?: string;
  proposedAdvisor?: string;
  advisorEmail?: string;
  justification?: string;
  constitutionDraft?: string;
  firstYearPlan?: string;
  budgetRequirements?: string;
  meetingSpaceNeeds?: string;
  interestedMembers?: string;
  status: "submitted" | "under_review" | "approved" | "denied" | "needs_revision";
  adminNotes?: string;
  submittedAt: string;
}

// Org Analytics Snapshot
export interface OrgAnalyticsSnapshot {
  id: string;
  orgId: string;
  snapshotDate: string;
  totalMembers: number;
  activeMembers: number;
  eventsHeld: number;
  avgAttendance: number;
  newMembers: number;
  retentionRate: number;
  engagementScore: number;
}

// FAQ Item
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Guide
export interface Guide {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  sections: { heading: string; content: string }[];
}

// School-wide Stats
export interface SchoolStats {
  totalClubs: number;
  totalMembers: number;
  totalEvents: number;
  totalServiceHours: number;
  totalDonations: number;
  clubCategories: { category: string; count: number }[];
  monthlyGrowth: { month: string; members: number; events: number }[];
  topClubs: { name: string; members: number; events: number; score: number }[];
}
