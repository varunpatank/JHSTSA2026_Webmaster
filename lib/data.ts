import { Chapter, Event, Resource, Spotlight, Stats } from "@/types";

// Mock data for admin dashboard
const pendingProposals = [
  {
    id: "prop-1",
    name: "Photography Club",
    submitter: "Emily Chen",
    date: "2026-01-10",
    status: "Under Review",
  },
  {
    id: "prop-2",
    name: "Chess Club",
    submitter: "Marcus Johnson",
    date: "2026-01-08",
    status: "Pending Advisor",
  },
  {
    id: "prop-3",
    name: "Entrepreneurship Society",
    submitter: "Sarah Williams",
    date: "2026-01-05",
    status: "Under Review",
  },
];

const recentActivity = [
  { action: "New member joined Model UN", time: "2 hours ago", type: "member" },
  {
    action: "Robotics Team updated meeting schedule",
    time: "5 hours ago",
    type: "update",
  },
  { action: "Drama Club event approved", time: "1 day ago", type: "event" },
  {
    action: "New proposal submitted: Photography Club",
    time: "2 days ago",
    type: "proposal",
  },
  {
    action: "Community Service Club hours verified",
    time: "3 days ago",
    type: "verification",
  },
];

const chapterHealth = [
  { name: "Model UN", score: 95, status: "Excellent", color: "bg-green-500" },
  {
    name: "Robotics Team",
    score: 92,
    status: "Excellent",
    color: "bg-green-500",
  },
  { name: "Drama Club", score: 88, status: "Good", color: "bg-blue-500" },
  { name: "Debate Team", score: 85, status: "Good", color: "bg-blue-500" },
  {
    name: "Environmental Club",
    score: 72,
    status: "Fair",
    color: "bg-yellow-500",
  },
];

// Mock alumni data
const featuredAlumni = [
  {
    id: 1,
    name: "Jessica Chen",
    gradYear: 2022,
    chapter: "Model United Nations",
    college: "Georgetown University",
    major: "International Relations",
    career: "Policy Analyst",
    photo: null,
    available: true,
  },
  {
    id: 2,
    name: "Marcus Williams",
    gradYear: 2021,
    chapter: "Robotics Team",
    college: "MIT",
    major: "Mechanical Engineering",
    career: "Robotics Engineer at Boston Dynamics",
    photo: null,
    available: true,
  },
  {
    id: 3,
    name: "Sarah Martinez",
    gradYear: 2020,
    chapter: "Community Service Club",
    college: "UC Berkeley",
    major: "Social Work",
    career: "Non-profit Director",
    photo: null,
    available: false,
  },
];

const careerPanels = [
  {
    id: 1,
    title: "Careers in Technology",
    date: "2026-02-15",
    time: "4:00 PM - 5:30 PM",
    panelists: 4,
    registrations: 45,
  },
  {
    id: 2,
    title: "Paths to Law School",
    date: "2026-02-22",
    time: "4:00 PM - 5:30 PM",
    panelists: 3,
    registrations: 32,
  },
  {
    id: 3,
    title: "Creative Arts Careers",
    date: "2026-03-05",
    time: "4:00 PM - 5:30 PM",
    panelists: 5,
    registrations: 28,
  },
];

const internships = [
  {
    id: 1,
    title: "Summer Research Internship",
    company: "Tech Innovation Labs",
    location: "Hybrid",
    type: "Summer 2026",
    postedBy: "Marcus Williams (Class of 2021)",
  },
  {
    id: 2,
    title: "Marketing Intern",
    company: "Creative Media Group",
    location: "Remote",
    type: "Part-time during school",
    postedBy: "Emily Thompson (Class of 2023)",
  },
  {
    id: 3,
    title: "Engineering Shadow Program",
    company: "Aerospace Solutions Inc.",
    location: "On-site",
    type: "Spring Break 2026",
    postedBy: "David Park (Class of 2019)",
  },
];

// Mock funding data
const budgetAllocations = [
  {
    chapter: "Model United Nations",
    allocated: 3500,
    spent: 2100,
    remaining: 1400,
  },
  { chapter: "Robotics Team", allocated: 8000, spent: 5500, remaining: 2500 },
  { chapter: "Drama Club", allocated: 4500, spent: 3200, remaining: 1300 },
  {
    chapter: "Community Service Club",
    allocated: 1500,
    spent: 800,
    remaining: 700,
  },
  { chapter: "Debate Team", allocated: 2500, spent: 1900, remaining: 600 },
  {
    chapter: "Environmental Club",
    allocated: 1200,
    spent: 650,
    remaining: 550,
  },
];

const purchaseRequests = [
  {
    id: 1,
    chapter: "Robotics Team",
    item: "Motor Controllers (x5)",
    amount: 450,
    status: "Pending",
    date: "2026-01-10",
  },
  {
    id: 2,
    chapter: "Drama Club",
    item: "Costume Materials",
    amount: 320,
    status: "Approved",
    date: "2026-01-08",
  },
  {
    id: 3,
    chapter: "Model UN",
    item: "Conference Registration",
    amount: 800,
    status: "Pending",
    date: "2026-01-05",
  },
];

const grants = [
  {
    id: 1,
    title: "Innovation Grant",
    amount: "$2,500",
    deadline: "2026-02-15",
    description:
      "For chapters developing new technology or innovative programs.",
    eligibility: "STEM and Academic chapters",
  },
  {
    id: 2,
    title: "Community Impact Award",
    amount: "$1,500",
    deadline: "2026-03-01",
    description: "For chapters with outstanding community service projects.",
    eligibility: "Service and Cultural chapters",
  },
  {
    id: 3,
    title: "Arts Enrichment Fund",
    amount: "$2,000",
    deadline: "2026-02-28",
    description: "Support for arts programs, productions, and equipment.",
    eligibility: "Arts and Media chapters",
  },
];

// Mock officer data

const memberRoster = [
  {
    id: 1,
    name: "James Chen",
    role: "President",
    grade: 12,
    attendance: 95,
    duesPaid: true,
  },
  {
    id: 2,
    name: "Maria Santos",
    role: "Vice President",
    grade: 11,
    attendance: 92,
    duesPaid: true,
  },
  {
    id: 3,
    name: "David Kim",
    role: "Secretary",
    grade: 11,
    attendance: 88,
    duesPaid: true,
  },
  {
    id: 4,
    name: "Emma Wilson",
    role: "Treasurer",
    grade: 10,
    attendance: 90,
    duesPaid: true,
  },
  {
    id: 5,
    name: "Alex Thompson",
    role: "Member",
    grade: 10,
    attendance: 78,
    duesPaid: false,
  },
  {
    id: 6,
    name: "Sophie Brown",
    role: "Member",
    grade: 9,
    attendance: 85,
    duesPaid: true,
  },
  {
    id: 7,
    name: "Michael Lee",
    role: "Member",
    grade: 11,
    attendance: 82,
    duesPaid: false,
  },
  {
    id: 8,
    name: "Olivia Davis",
    role: "Member",
    grade: 10,
    attendance: 91,
    duesPaid: true,
  },
];

const pendingJoinRequests = [
  {
    id: 1,
    name: "Ryan Foster",
    grade: 10,
    date: "2026-01-10",
    message: "I have always been interested in international relations.",
  },
  {
    id: 2,
    name: "Lisa Wang",
    grade: 9,
    date: "2026-01-08",
    message: "I want to improve my public speaking skills.",
  },
];

// Mock user data

const upcomingDeadlines = [
  {
    id: 1,
    title: "Model UN Conference Registration",
    date: "2026-01-20",
    type: "event",
  },
  {
    id: 2,
    title: "Robotics Team Dues Payment",
    date: "2026-01-25",
    type: "dues",
  },
  {
    id: 3,
    title: "Drama Club Audition Sign-up",
    date: "2026-01-16",
    type: "application",
  },
];

const quizQuestions = [
  {
    id: 1,
    question: "What activities interest you most?",
    options: [
      "Academic competitions",
      "Creative arts",
      "Community service",
      "Technology & Engineering",
      "Sports & Recreation",
    ],
  },
  {
    id: 2,
    question: "How often would you like to meet?",
    options: ["Daily", "Weekly", "Bi-weekly", "Monthly"],
  },
  {
    id: 3,
    question: "What time works best for you?",
    options: ["Before school", "During lunch", "After school", "Weekends"],
  },
];

// Mock Statistics
export const stats: Stats = {
  activeChapters: 47,
  totalMembers: 1283,
  upcomingEvents: 12,
  newMembersThisMonth: 89,
};

export const chapters: Chapter[] = [
  {
    id: "model-un",
    name: "Model United Nations",
    description:
      "Engage in diplomatic simulations, debate global issues, and develop public speaking and negotiation skills through competitive conferences.",
    category: "Academic",
    meetingFrequency: "Weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Dr. Sarah Mitchell",
      email: "s.mitchell@school.edu",
      department: "Social Studies",
      phone: "(555) 123-4567",
    },
    officers: [
      {
        name: "James Chen",
        position: "President",
        email: "j.chen@student.edu",
        grade: 12,
      },
      {
        name: "Maria Santos",
        position: "Vice President",
        email: "m.santos@student.edu",
        grade: 11,
      },
      {
        name: "David Kim",
        position: "Secretary",
        email: "d.kim@student.edu",
        grade: 11,
      },
      {
        name: "Emma Wilson",
        position: "Treasurer",
        email: "e.wilson@student.edu",
        grade: 10,
      },
    ],
    meetingSchedule: "Every Tuesday, 3:30 PM - 5:00 PM",
    meetingLocation: {
      lat: 47.715639,
      lng: -122.198944,
      parentOrg: "Juanita High School",
      address: "10601 NE 132nd St, Kirkland, WA 98034",
      room: "Room 204",
      internalLocation: "Social Studies Wing",
    },
    membershipRequirements:
      "Interest in international affairs and commitment to attend weekly meetings",
    dues: "$25 per semester (covers conference fees)",
    socialLinks: {
      website: "https://schoolmun.org",
      instagram: "@school_mun",
    },
    achievements: [
      "Best Delegation - State MUN Conference 2025",
      "Outstanding Position Papers - National MUN 2024",
      "15 individual delegate awards this year",
    ],
    photoGallery: [],
    memberCount: 45,
    foundedYear: 2008,
    isActive: true,
  },
  {
    id: "robotics",
    name: "Robotics Team",
    description:
      "Design, build, and program competitive robots while learning engineering principles, teamwork, and problem-solving skills.",
    category: "STEM",
    meetingFrequency: "Weekly",
    membershipStatus: "Application Required",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Mr. Robert Hayes",
      email: "r.hayes@school.edu",
      department: "Engineering",
      phone: "(555) 123-4568",
    },
    officers: [
      {
        name: "Alex Johnson",
        position: "Team Captain",
        email: "a.johnson@student.edu",
        grade: 12,
      },
      {
        name: "Sophie Lee",
        position: "Build Lead",
        email: "s.lee@student.edu",
        grade: 11,
      },
      {
        name: "Marcus Brown",
        position: "Programming Lead",
        email: "m.brown@student.edu",
        grade: 12,
      },
      {
        name: "Olivia Garcia",
        position: "Business Manager",
        email: "o.garcia@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Monday, Wednesday, Friday 3:30 PM - 6:00 PM",
    meetingLocation: {
      lat: 47.67674,
      lng: -122.12125,
      parentOrg: "Juanita High School",
      address: "10601 NE 132nd St, Kirkland, WA 98034",
      room: "Engineering Lab",
      internalLocation: "Building C",
    },
    membershipRequirements:
      "Application with interest statement, basic technical skills preferred but not required",
    dues: "$50 per year (materials and competition fees)",
    socialLinks: {
      website: "https://schoolrobotics.org",
      instagram: "@school_robotics",
      discord: "school-robotics",
    },
    achievements: [
      "Regional Champions - FIRST Robotics 2025",
      "Innovation Award - State Championship 2024",
      "Qualified for World Championship 3 consecutive years",
    ],
    photoGallery: [],
    memberCount: 38,
    foundedYear: 2012,
    isActive: true,
  },
  {
    id: "community-service",
    name: "Community Service Club",
    description:
      "Make a positive impact in our community through volunteer work, fundraising events, and partnerships with local organizations.",
    category: "Service",
    meetingFrequency: "Bi-weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "Lunch",
    advisor: {
      name: "Ms. Jennifer Adams",
      email: "j.adams@school.edu",
      department: "Counseling",
    },
    officers: [
      {
        name: "Isabella Martinez",
        position: "President",
        email: "i.martinez@student.edu",
        grade: 12,
      },
      {
        name: "Noah Thompson",
        position: "Vice President",
        email: "n.thompson@student.edu",
        grade: 11,
      },
      {
        name: "Ava Williams",
        position: "Volunteer Coordinator",
        email: "a.williams@student.edu",
        grade: 11,
      },
      {
        name: "Ethan Davis",
        position: "Outreach Chair",
        email: "e.davis@student.edu",
        grade: 10,
      },
    ],
    meetingSchedule: "Every other Thursday during lunch",
    meetingLocation: {
      lat: 47.67674,
      lng: -122.12125,
      parentOrg: "Juanita High School",
      address: "10601 NE 132nd St, Kirkland, WA 98034",
      room: "Room 115",
      internalLocation: "Main Building",
    },
    membershipRequirements:
      "Commitment to complete at least 20 volunteer hours per semester",
    dues: "None",
    socialLinks: {
      instagram: "@school_service",
    },
    achievements: [
      "5,000+ volunteer hours completed this year",
      "Partnership with 12 local non-profits",
      "Youth Volunteer Organization of the Year 2024",
    ],
    photoGallery: [],
    memberCount: 72,
    foundedYear: 2005,
    isActive: true,
  },
  {
    id: "drama-club",
    name: "Drama Club & Theater Society",
    description:
      "Explore the performing arts through productions, workshops, and competitions. All skill levels welcome.",
    category: "Arts",
    meetingFrequency: "Weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Ms. Patricia Coleman",
      email: "p.coleman@school.edu",
      department: "Fine Arts",
    },
    officers: [
      {
        name: "Grace Taylor",
        position: "President",
        email: "g.taylor@student.edu",
        grade: 12,
      },
      {
        name: "Michael Roberts",
        position: "Stage Manager",
        email: "m.roberts@student.edu",
        grade: 11,
      },
      {
        name: "Lily Chang",
        position: "Publicity Chair",
        email: "l.chang@student.edu",
        grade: 10,
      },
    ],
    meetingSchedule: "Every Wednesday, 3:30 PM - 5:30 PM",
    meetingLocation: {
      lat: 47.67731,
      lng: -122.12062,
      parentOrg: "Juanita High School",
      address: "10601 NE 132nd St, Kirkland, WA 98034",
      room: "Auditorium",
      internalLocation: "Performing Arts Center",
    },
    membershipRequirements:
      "Passion for theater, attendance at weekly meetings",
    dues: "$15 per semester",
    socialLinks: {
      instagram: "@school_drama",
    },
    achievements: [
      "State Drama Competition - First Place 2025",
      "3 productions per year",
      "Best Musical - Regional Theater Awards 2024",
    ],
    photoGallery: [],
    memberCount: 54,
    foundedYear: 1998,
    isActive: true,
  },
  {
    id: "debate-team",
    name: "Debate Team",
    description:
      "Develop critical thinking, research, and public speaking skills through competitive debate formats including Policy, Lincoln-Douglas, and Public Forum.",
    category: "Academic",
    meetingFrequency: "Weekly",
    membershipStatus: "Tryout Required",
    gradeLevel: "10th-12th",
    meetingTime: "After School",
    advisor: {
      name: "Mr. Thomas Wright",
      email: "t.wright@school.edu",
      department: "English",
    },
    officers: [
      {
        name: "Andrew Park",
        position: "Captain",
        email: "a.park@student.edu",
        grade: 12,
      },
      {
        name: "Rachel Green",
        position: "Vice Captain",
        email: "r.green@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Tuesday and Thursday, 3:30 PM - 5:00 PM",
    meetingLocation: {
      lat: 47.67674,
      lng: -122.12125,
      parentOrg: "Juanita High School",
      address: "10601 NE 132nd St, Kirkland, WA 98034",
      room: "Room 301",
      internalLocation: "English Wing",
    },
    membershipRequirements:
      "Tryout required, commitment to tournament participation",
    dues: "$40 per semester (tournament fees)",
    socialLinks: {
      website: "https://schooldebate.org",
    },
    achievements: [
      "National Debate Tournament Qualifiers - 4 teams",
      "State Champions - Policy Debate 2025",
      "Top 10 nationally ranked program",
    ],
    photoGallery: [],
    memberCount: 28,
    foundedYear: 2001,
    isActive: true,
  },
  {
    id: "cultural-club",
    name: "Multicultural Student Alliance",
    description:
      "Celebrate diversity and promote cultural awareness through events, discussions, and community engagement.",
    category: "Cultural",
    meetingFrequency: "Weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "Lunch",
    advisor: {
      name: "Dr. Angela Rodriguez",
      email: "a.rodriguez@school.edu",
      department: "World Languages",
    },
    officers: [
      {
        name: "Jasmine Patel",
        position: "President",
        email: "j.patel@student.edu",
        grade: 12,
      },
      {
        name: "Omar Hassan",
        position: "Vice President",
        email: "o.hassan@student.edu",
        grade: 11,
      },
      {
        name: "Yuki Tanaka",
        position: "Events Coordinator",
        email: "y.tanaka@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Every Friday during lunch",
    meetingLocation: {
      lat: 47.67674,
      lng: -122.12125,
      parentOrg: "Juanita High School",
      address: "10601 NE 132nd St, Kirkland, WA 98034",
      room: "Room 210",
      internalLocation: "Language Wing",
    },
    membershipRequirements:
      "Open to all students interested in cultural exchange",
    dues: "None",
    socialLinks: {
      instagram: "@school_msa",
    },
    achievements: [
      "Annual Cultural Festival - 500+ attendees",
      "Heritage Month celebrations throughout the year",
      "Community Partnership Award 2024",
    ],
    photoGallery: [],
    memberCount: 63,
    foundedYear: 2010,
    isActive: true,
  },
  {
    id: "environmental-club",
    name: "Environmental Action Club",
    description:
      "Take action on environmental issues through campus sustainability projects, advocacy, and community clean-up events.",
    category: "Service",
    meetingFrequency: "Weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Mr. David Chen",
      email: "d.chen@school.edu",
      department: "Science",
    },
    officers: [
      {
        name: "Sierra Woods",
        position: "President",
        email: "s.woods@student.edu",
        grade: 12,
      },
      {
        name: "Lucas Rivera",
        position: "Vice President",
        email: "l.rivera@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Every Monday, 3:30 PM - 4:30 PM",
    meetingLocation: {
      lat: 47.67674,
      lng: -122.12125,
      parentOrg: "Juanita High School",
      address: "10601 NE 132nd St, Kirkland, WA 98034",
      room: "Room 105",
      internalLocation: "Science Building",
    },
    membershipRequirements: "Passion for environmental issues",
    dues: "None",
    socialLinks: {
      instagram: "@school_eco",
    },
    achievements: [
      "Campus recycling rate increased by 40%",
      "Planted 200 trees in community",
      "Green School Certification achieved",
    ],
    photoGallery: [],
    memberCount: 41,
    foundedYear: 2015,
    isActive: true,
  },
  {
    id: "student-newspaper",
    name: "The School Chronicle",
    description:
      "Produce the official school newspaper covering news, sports, arts, and opinion pieces. Learn journalism skills and media literacy.",
    category: "Media",
    meetingFrequency: "Weekly",
    membershipStatus: "Application Required",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Mrs. Karen Phillips",
      email: "k.phillips@school.edu",
      department: "English",
    },
    officers: [
      {
        name: "Ryan Foster",
        position: "Editor-in-Chief",
        email: "r.foster@student.edu",
        grade: 12,
      },
      {
        name: "Maya Johnson",
        position: "Managing Editor",
        email: "m.johnson@student.edu",
        grade: 11,
      },
      {
        name: "Tyler Scott",
        position: "Sports Editor",
        email: "t.scott@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Tuesday and Thursday, 3:30 PM - 5:00 PM",
    meetingLocation: {
      lat: 47.67674,
      lng: -122.12125,
      parentOrg: "Juanita High School",
      address: "10601 NE 132nd St, Kirkland, WA 98034",
      room: "Media Room 202",
      internalLocation: "Media Center",
    },
    membershipRequirements: "Writing sample required, interview process",
    dues: "None",
    socialLinks: {
      website: "https://schoolchronicle.org",
      instagram: "@school_chronicle",
    },
    achievements: [
      "State Journalism Award - Best High School Paper 2025",
      "Published bi-weekly, 24 issues per year",
      "10 national scholastic journalism awards",
    ],
    photoGallery: [],
    memberCount: 22,
    foundedYear: 1965,
    isActive: true,
  },
];

export const events: Event[] = [
  {
    id: "event-1",
    title: "Model UN Practice Session",
    description:
      "Weekly practice session focusing on resolution writing and debate skills.",
    date: "2026-01-14",
    startTime: "3:30 PM",
    endTime: "5:00 PM",
    location: "Room 204, Social Studies Wing",
    chapterId: "model-un",
    chapterName: "Model United Nations",
    category: "Academic",
    isPublic: true,
    requiresRSVP: false,
    currentAttendees: 32,
  },
  {
    id: "event-2",
    title: "Robotics Build Night",
    description:
      "Extended build session for upcoming regional competition. All team members expected.",
    date: "2026-01-15",
    startTime: "3:30 PM",
    endTime: "7:00 PM",
    location: "Engineering Lab, Building C",
    chapterId: "robotics",
    chapterName: "Robotics Team",
    category: "STEM",
    isPublic: false,
    requiresRSVP: true,
    maxAttendees: 40,
    currentAttendees: 35,
  },
  {
    id: "event-3",
    title: "Community Food Drive",
    description:
      "Partner event with local food bank. Volunteers needed for sorting and distribution.",
    date: "2026-01-18",
    startTime: "9:00 AM",
    endTime: "2:00 PM",
    location: "Community Center",
    chapterId: "community-service",
    chapterName: "Community Service Club",
    category: "Service",
    isPublic: true,
    requiresRSVP: true,
    maxAttendees: 50,
    currentAttendees: 28,
  },
  {
    id: "event-4",
    title: "Winter Drama Production Auditions",
    description:
      'Auditions for the spring musical "Into the Woods". Prepare a 1-minute monologue and 16 bars of a song.',
    date: "2026-01-16",
    startTime: "3:30 PM",
    endTime: "6:00 PM",
    location: "Auditorium",
    chapterId: "drama-club",
    chapterName: "Drama Club & Theater Society",
    category: "Arts",
    isPublic: true,
    requiresRSVP: true,
    currentAttendees: 45,
  },
  {
    id: "event-5",
    title: "Debate Tournament Prep",
    description:
      "Intensive preparation session for upcoming state qualifiers. Mock debates and feedback.",
    date: "2026-01-14",
    startTime: "3:30 PM",
    endTime: "5:00 PM",
    location: "Room 301, English Wing",
    chapterId: "debate-team",
    chapterName: "Debate Team",
    category: "Academic",
    isPublic: false,
    requiresRSVP: false,
    currentAttendees: 24,
  },
  {
    id: "event-6",
    title: "Cultural Heritage Celebration",
    description:
      "Monthly cultural showcase featuring food, performances, and presentations from different cultures.",
    date: "2026-01-20",
    startTime: "12:00 PM",
    endTime: "1:00 PM",
    location: "Cafeteria",
    chapterId: "cultural-club",
    chapterName: "Multicultural Student Alliance",
    category: "Cultural",
    isPublic: true,
    requiresRSVP: false,
    currentAttendees: 85,
  },
];

export const resources: Resource[] = [
  {
    id: "res-1",
    title: "Chapter Constitution Template",
    description:
      "Official template for creating a new chapter constitution, including required sections and sample bylaws.",
    category: "Templates",
    fileType: "DOCX",
    downloadUrl: "#",
    dateAdded: "2025-08-15",
  },
  {
    id: "res-2",
    title: "Budget Request Form",
    description:
      "Standard form for requesting funds from the school activities budget. Required for all chapter expenses.",
    category: "Forms",
    fileType: "PDF",
    downloadUrl: "#",
    dateAdded: "2025-08-10",
  },
  {
    id: "res-3",
    title: "Event Planning Checklist",
    description:
      "Comprehensive checklist for planning chapter events, including timeline, permissions, and logistics.",
    category: "Templates",
    fileType: "PDF",
    downloadUrl: "#",
    dateAdded: "2025-09-01",
  },
  {
    id: "res-4",
    title: "Running Effective Meetings Guide",
    description:
      "Best practices for conducting productive chapter meetings, including agenda templates and facilitation tips.",
    category: "Guides",
    fileType: "PDF",
    downloadUrl: "#",
    dateAdded: "2025-08-20",
  },
  {
    id: "res-5",
    title: "Fundraising Proposal Template",
    description:
      "Template for submitting fundraising event proposals to administration for approval.",
    category: "Forms",
    fileType: "DOCX",
    downloadUrl: "#",
    dateAdded: "2025-09-05",
  },
  {
    id: "res-6",
    title: "Leadership Transition Handbook",
    description:
      "Guide for outgoing and incoming officers on smooth leadership transitions, including knowledge transfer.",
    category: "Handbooks",
    fileType: "PDF",
    downloadUrl: "#",
    dateAdded: "2025-04-15",
  },
  {
    id: "res-7",
    title: "Meeting Minutes Template",
    description:
      "Standard template for recording chapter meeting minutes with action items tracking.",
    category: "Templates",
    fileType: "DOCX",
    downloadUrl: "#",
    dateAdded: "2025-08-25",
  },
  {
    id: "res-8",
    title: "Advisor Training Module",
    description:
      "Comprehensive training materials for faculty advisors covering policies, responsibilities, and best practices.",
    category: "Training Materials",
    fileType: "PDF",
    downloadUrl: "#",
    dateAdded: "2025-07-01",
  },
];

export const spotlights: Spotlight[] = [
  {
    id: "spotlight-1",
    chapterId: "model-un",
    chapter: chapters.find((c) => c.id === "model-un")!,
    title: "Model UN: Shaping Future Diplomats",
    content:
      "Our Model United Nations chapter has grown from a small group of 12 students to one of the most decorated programs in the state. Members represent countries in simulated UN committees, debating real-world issues from climate change to international security. The skills developed—research, public speaking, negotiation, and critical thinking—prepare students for success in college and beyond.",
    highlights: [
      "Attended 8 conferences this academic year",
      "Won Best Delegation at 5 conferences",
      "Hosted our own invitational with 200+ delegates",
      "Partnership with local university MUN program",
    ],
    testimonials: [
      {
        quote:
          "Model UN taught me how to think on my feet and consider multiple perspectives. These skills have been invaluable in my college applications and interviews.",
        author: "James Chen",
        role: "President, Class of 2026",
      },
      {
        quote:
          "Watching students grow from nervous first-timers to confident delegates winning awards is the most rewarding part of advising this chapter.",
        author: "Dr. Sarah Mitchell",
        role: "Faculty Advisor",
      },
    ],
    featuredImages: [],
    datePublished: "2026-01-05",
  },
  {
    id: "spotlight-2",
    chapterId: "robotics",
    chapter: chapters.find((c) => c.id === "robotics")!,
    title: "Robotics Team: Engineering Excellence",
    content:
      'The Robotics Team combines engineering, programming, and business skills to compete in FIRST Robotics competitions. Students work in specialized sub-teams including mechanical, electrical, programming, and business/outreach. The program emphasizes "gracious professionalism" and collaboration, teaching students that competition and cooperation can coexist.',
    highlights: [
      "Regional Champions 2025",
      "Qualified for World Championship 3 years running",
      "$15,000 in scholarships awarded to seniors",
      "Mentorship program with local engineering firms",
    ],
    testimonials: [
      {
        quote:
          "Robotics gave me hands-on experience that my college engineering program recognized. I came into university already knowing CAD, fabrication, and project management.",
        author: "Former Member",
        role: "Now Engineering Student at State University",
      },
      {
        quote:
          "The teamwork and problem-solving skills I developed on the robotics team have been more valuable than any single class I took in high school.",
        author: "Alex Johnson",
        role: "Team Captain, Class of 2026",
      },
    ],
    featuredImages: [],
    datePublished: "2025-12-15",
  },
  {
    id: "spotlight-3",
    chapterId: "community-service",
    chapter: chapters.find((c) => c.id === "community-service")!,
    title: "Community Service Club: Making a Difference",
    content:
      "The Community Service Club connects students with opportunities to give back to our local community. From food drives and tutoring programs to environmental clean-ups and senior center visits, members log thousands of volunteer hours each year. The club partners with over a dozen local non-profits, creating meaningful and lasting relationships.",
    highlights: [
      "5,000+ volunteer hours logged this year",
      "Partnerships with 12 local non-profits",
      "Monthly service projects open to all students",
      "Service hour verification for college applications",
    ],
    testimonials: [
      {
        quote:
          "Being part of this club showed me that even small actions can make a big difference. I have found my passion for community organizing through our projects.",
        author: "Isabella Martinez",
        role: "President, Class of 2026",
      },
      {
        quote:
          "The students in this club inspire me every day. Their dedication to service and their genuine care for others gives me hope for the future.",
        author: "Ms. Jennifer Adams",
        role: "Faculty Advisor",
      },
    ],
    featuredImages: [],
    datePublished: "2025-11-20",
  },
];

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
  author: string;
}

export const announcements: Announcement[] = [
  {
    id: "ann-1",
    title: "Spring Semester Chapter Registration Now Open",
    content:
      "All chapters must complete their spring semester registration by February 1st. Update your officer roster and meeting schedules in your chapter portal.",
    date: "2026-01-10",
    priority: "high",
    author: "Activities Office",
  },
  {
    id: "ann-2",
    title: "Chapter Fair - January 25th",
    content:
      "The annual Chapter Fair will be held in the gymnasium. All active chapters should reserve a table to recruit new members.",
    date: "2026-01-08",
    priority: "medium",
    author: "Student Council",
  },
  {
    id: "ann-3",
    title: "Budget Requests Due January 31st",
    content:
      "Chapters requesting funding for spring semester activities must submit their budget proposals by the end of January.",
    date: "2026-01-05",
    priority: "medium",
    author: "Activities Office",
  },
  {
    id: "ann-4",
    title: "Winter Sports Tryouts Schedule",
    content:
      "Tryouts for winter sports clubs will be held next week. Check with your advisor for specific times and requirements.",
    date: "2026-01-03",
    priority: "medium",
    author: "Athletics Department",
  },
  {
    id: "ann-5",
    title: "New Club Fair Date Announced",
    content:
      "The spring Club Fair has been scheduled for January 25th in the main gymnasium. All chapters should plan to participate.",
    date: "2026-01-01",
    priority: "high",
    author: "Student Activities",
  },
  {
    id: "ann-6",
    title: "Leadership Workshop Series",
    content:
      "A new leadership workshop series for chapter officers begins February 1st. Registration is now open.",
    date: "2025-12-20",
    priority: "low",
    author: "Student Leadership Council",
  },
  {
    id: "ann-7",
    title: "Community Service Hours Deadline",
    content:
      "Reminder: All service hours must be logged by January 31st to count for the fall semester.",
    date: "2025-12-15",
    priority: "high",
    author: "Community Service Office",
  },
];
