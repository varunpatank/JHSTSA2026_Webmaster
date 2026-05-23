import { Chapter, Event, Resource, Spotlight, Stats } from "@/types";

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

export const featuredAlumni = [
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

export const careerPanels = [
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

export const quizQuestions = [
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
      lat: 47.7148986,
      lng: -122.1997857,
      parentOrg: "Juanita High School",
      room: "Juanita High School",
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
      lat: 47.6485536,
      lng: -122.0383183,
      parentOrg: "Tesla STEM High School",
      room: "Tesla STEM High School",
      internalLocation: "Engineering Lab",
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
      lat: 47.6943909,
      lng: -122.1080762,
      parentOrg: "Redmond High School",
      room: "Redmond High School",
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
      lat: 47.6728118,
      lng: -122.1802551,
      parentOrg: "Lake Washington High School",
      room: "Lake Washington High School",
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
      lat: 47.6145585,
      lng: -122.0308307,
      parentOrg: "Eastlake High School",
      room: "Eastlake High School",
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
      lat: 47.664105,
      lng: -122.1912096,
      parentOrg: "International Community School",
      room: "International Community School",
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
      lat: 47.7414843,
      lng: -122.222623,
      parentOrg: "Inglemoor High School",
      room: "Inglemoor High School",
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
      lat: 47.760475,
      lng: -122.2205602,
      parentOrg: "Bothell High School",
      room: "Bothell High School",
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
  /* ── Additional clubs across all schools ── */
  {
    id: "math-olympiad",
    name: "Math Olympiad Team",
    description:
      "Compete in mathematics competitions at local, state, and national levels while sharpening problem-solving skills.",
    category: "Academic",
    meetingFrequency: "Weekly",
    membershipStatus: "Tryout Required",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Mr. Kevin Park",
      email: "k.park@school.edu",
      department: "Mathematics",
    },
    officers: [
      {
        name: "Ethan Liu",
        position: "Captain",
        email: "e.liu@student.edu",
        grade: 12,
      },
      {
        name: "Priya Sharma",
        position: "Vice Captain",
        email: "p.sharma@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Every Wednesday, 3:30 PM - 5:00 PM",
    meetingLocation: {
      lat: 47.71455,
      lng: -122.20035,
      parentOrg: "Juanita High School",
      room: "Juanita High School",
      internalLocation: "Math Wing Room 112",
    },
    membershipRequirements: "Strong interest in mathematics, tryout required",
    dues: "$15 per semester",
    socialLinks: { instagram: "@jhs_mathteam" },
    achievements: [
      "State Math Olympiad 3rd Place 2025",
      "12 AIME qualifiers this year",
    ],
    photoGallery: [],
    memberCount: 30,
    foundedYear: 2010,
    isActive: true,
  },
  {
    id: "jhs-art-club",
    name: "Art & Design Studio",
    description:
      "Explore visual arts including painting, sculpture, digital art, and graphic design through workshops and exhibitions.",
    category: "Arts",
    meetingFrequency: "Weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Ms. Lisa Nakamura",
      email: "l.nakamura@school.edu",
      department: "Fine Arts",
    },
    officers: [
      {
        name: "Chloe Kim",
        position: "President",
        email: "c.kim@student.edu",
        grade: 12,
      },
      {
        name: "Daniel Orozco",
        position: "Vice President",
        email: "d.orozco@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Every Thursday, 3:30 PM - 5:00 PM",
    meetingLocation: {
      lat: 47.7152,
      lng: -122.1991,
      parentOrg: "Juanita High School",
      room: "Juanita High School",
      internalLocation: "Art Studio B",
    },
    membershipRequirements: "Open to all students with interest in visual arts",
    dues: "$10 per semester (materials fee)",
    socialLinks: { instagram: "@jhs_artstudio" },
    achievements: [
      "Annual Art Show - 200+ attendees",
      "5 students selected for regional exhibitions",
    ],
    photoGallery: [],
    memberCount: 35,
    foundedYear: 2014,
    isActive: true,
  },
  {
    id: "jhs-spanish-club",
    name: "Spanish Language & Culture Club",
    description:
      "Practice conversational Spanish, explore Latin American cultures, and participate in cultural events and exchanges.",
    category: "Cultural",
    meetingFrequency: "Weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "Lunch",
    advisor: {
      name: "Sra. Maria Fernandez",
      email: "m.fernandez@school.edu",
      department: "World Languages",
    },
    officers: [
      {
        name: "Sofia Reyes",
        position: "President",
        email: "s.reyes@student.edu",
        grade: 12,
      },
    ],
    meetingSchedule: "Every Friday during lunch",
    meetingLocation: {
      lat: 47.7142,
      lng: -122.19955,
      parentOrg: "Juanita High School",
      room: "Juanita High School",
      internalLocation: "Language Lab",
    },
    membershipRequirements: "Open to all, no Spanish experience required",
    dues: "None",
    socialLinks: { instagram: "@jhs_spanish" },
    achievements: [
      "Dia de los Muertos festival annual tradition",
      "Cultural exchange program with sister school in Mexico",
    ],
    photoGallery: [],
    memberCount: 28,
    foundedYear: 2016,
    isActive: true,
  },
  {
    id: "tesla-science-bowl",
    name: "Science Bowl Team",
    description:
      "Compete in fast-paced science trivia competitions covering biology, chemistry, physics, earth science, and math.",
    category: "Academic",
    meetingFrequency: "Weekly",
    membershipStatus: "Tryout Required",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Dr. James Wong",
      email: "j.wong@school.edu",
      department: "Science",
    },
    officers: [
      {
        name: "Nathan Lee",
        position: "Captain",
        email: "n.lee@student.edu",
        grade: 12,
      },
      {
        name: "Anika Patel",
        position: "Vice Captain",
        email: "a.patel@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Every Tuesday, 3:30 PM - 5:00 PM",
    meetingLocation: {
      lat: 47.64825,
      lng: -122.03795,
      parentOrg: "Tesla STEM High School",
      room: "Tesla STEM High School",
      internalLocation: "Science Lab 3",
    },
    membershipRequirements: "Tryout required, strong science knowledge",
    dues: "$20 per year",
    socialLinks: { website: "https://teslasciencebowl.org" },
    achievements: [
      "Regional Science Bowl Champions 2025",
      "National qualifier 2 consecutive years",
    ],
    photoGallery: [],
    memberCount: 24,
    foundedYear: 2013,
    isActive: true,
  },
  {
    id: "tesla-cyber-security",
    name: "Cybersecurity Club",
    description:
      "Learn ethical hacking, network security, and compete in CTF (Capture the Flag) competitions.",
    category: "STEM",
    meetingFrequency: "Weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Mr. Chris Yang",
      email: "c.yang@school.edu",
      department: "Computer Science",
    },
    officers: [
      {
        name: "Jake Morrison",
        position: "President",
        email: "j.morrison@student.edu",
        grade: 12,
      },
      {
        name: "Mei Lin",
        position: "Vice President",
        email: "m.lin@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Every Thursday, 3:30 PM - 5:30 PM",
    meetingLocation: {
      lat: 47.64895,
      lng: -122.03755,
      parentOrg: "Tesla STEM High School",
      room: "Tesla STEM High School",
      internalLocation: "Computer Lab A",
    },
    membershipRequirements:
      "Interest in cybersecurity, no prior experience needed",
    dues: "None",
    socialLinks: { discord: "tesla-cybersec" },
    achievements: [
      "CyberPatriot State Finalist 2025",
      "Top 20 nationally in picoCTF",
    ],
    photoGallery: [],
    memberCount: 20,
    foundedYear: 2018,
    isActive: true,
  },
  {
    id: "redmond-key-club",
    name: "Key Club International",
    description:
      "Service leadership program dedicated to serving the community through charitable activities and building leadership skills.",
    category: "Service",
    meetingFrequency: "Weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "Lunch",
    advisor: {
      name: "Ms. Rachel Kim",
      email: "r.kim@school.edu",
      department: "Counseling",
    },
    officers: [
      {
        name: "Olivia Chen",
        position: "President",
        email: "o.chen@student.edu",
        grade: 12,
      },
      {
        name: "Liam Nguyen",
        position: "Vice President",
        email: "l.nguyen@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Every Monday during lunch",
    meetingLocation: {
      lat: 47.6947,
      lng: -122.1078,
      parentOrg: "Redmond High School",
      room: "Redmond High School",
      internalLocation: "Room 206",
    },
    membershipRequirements: "Minimum 15 service hours per semester",
    dues: "$20 per year (international dues)",
    socialLinks: { instagram: "@redmond_keyclub" },
    achievements: [
      "Distinguished Club Award 2025",
      "Over 3,000 service hours this year",
    ],
    photoGallery: [],
    memberCount: 55,
    foundedYear: 2006,
    isActive: true,
  },
  {
    id: "redmond-coding-club",
    name: "Coding & App Development Club",
    description:
      "Build software projects, learn new programming languages, and participate in hackathons together.",
    category: "STEM",
    meetingFrequency: "Weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Mr. Brian Taylor",
      email: "b.taylor@school.edu",
      department: "Technology",
    },
    officers: [
      {
        name: "Ryan Zhao",
        position: "President",
        email: "r.zhao@student.edu",
        grade: 12,
      },
    ],
    meetingSchedule: "Every Wednesday, 3:30 PM - 5:00 PM",
    meetingLocation: {
      lat: 47.69435,
      lng: -122.10895,
      parentOrg: "Redmond High School",
      room: "Redmond High School",
      internalLocation: "Tech Lab",
    },
    membershipRequirements: "Open to all skill levels",
    dues: "None",
    socialLinks: { discord: "redmond-coders", instagram: "@rhs_coding" },
    achievements: [
      "Won Best High School Hack at HackWA 2025",
      "Published 3 apps on app stores",
    ],
    photoGallery: [],
    memberCount: 32,
    foundedYear: 2017,
    isActive: true,
  },
  {
    id: "lwhs-band",
    name: "Marching & Concert Band",
    description:
      "Perform at football games, concerts, parades, and regional competitions. All instrument players welcome.",
    category: "Arts",
    meetingFrequency: "Daily",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "Before School",
    advisor: {
      name: "Mr. George Simmons",
      email: "g.simmons@school.edu",
      department: "Music",
    },
    officers: [
      {
        name: "Emma Wright",
        position: "Drum Major",
        email: "e.wright@student.edu",
        grade: 12,
      },
      {
        name: "Carlos Mendez",
        position: "Section Leader",
        email: "c.mendez@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Daily 7:00 AM - 8:00 AM, plus after-school rehearsals",
    meetingLocation: {
      lat: 47.6731,
      lng: -122.18095,
      parentOrg: "Lake Washington High School",
      room: "Lake Washington High School",
      internalLocation: "Band Room",
    },
    membershipRequirements:
      "Ability to play an instrument, commitment to daily rehearsals",
    dues: "$30 per year (uniform fee)",
    socialLinks: { instagram: "@lwhs_band" },
    achievements: [
      "State Marching Band Competition - Gold 2025",
      "150+ member ensemble",
    ],
    photoGallery: [],
    memberCount: 68,
    foundedYear: 1985,
    isActive: true,
  },
  {
    id: "lwhs-student-gov",
    name: "Student Government Association",
    description:
      "Represent the student body, plan school-wide events, and develop leadership skills through governance.",
    category: "Leadership",
    meetingFrequency: "Weekly",
    membershipStatus: "Application Required",
    gradeLevel: "All Grades",
    meetingTime: "Lunch",
    advisor: {
      name: "Mrs. Sandra Wells",
      email: "s.wells@school.edu",
      department: "Administration",
    },
    officers: [
      {
        name: "Harper Johnson",
        position: "President",
        email: "h.johnson@student.edu",
        grade: 12,
      },
      {
        name: "Mason Clark",
        position: "Vice President",
        email: "m.clark@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Every Wednesday during lunch",
    meetingLocation: {
      lat: 47.67295,
      lng: -122.1796,
      parentOrg: "Lake Washington High School",
      room: "Lake Washington High School",
      internalLocation: "Student Commons",
    },
    membershipRequirements:
      "Elected or appointed position, application process",
    dues: "None",
    socialLinks: { instagram: "@lwhs_sga" },
    achievements: [
      "Organized Homecoming and Prom",
      "Raised $15,000 for school improvements",
    ],
    photoGallery: [],
    memberCount: 25,
    foundedYear: 1990,
    isActive: true,
  },
  {
    id: "eastlake-film-club",
    name: "Film & Media Production Club",
    description:
      "Create short films, documentaries, and multimedia projects while learning cinematography and editing.",
    category: "Media",
    meetingFrequency: "Weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Mr. Paul Anderson",
      email: "p.anderson@school.edu",
      department: "Media Arts",
    },
    officers: [
      {
        name: "Zoe Mitchell",
        position: "Director",
        email: "z.mitchell@student.edu",
        grade: 12,
      },
      {
        name: "Kai Ramirez",
        position: "Editor-in-Chief",
        email: "k.ramirez@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Every Friday, 3:30 PM - 5:30 PM",
    meetingLocation: {
      lat: 47.6143,
      lng: -122.0311,
      parentOrg: "Eastlake High School",
      room: "Eastlake High School",
      internalLocation: "Media Lab",
    },
    membershipRequirements:
      "Passion for filmmaking, open to all experience levels",
    dues: "None",
    socialLinks: { instagram: "@eastlake_films" },
    achievements: [
      "Best Short Film - WA Student Film Festival 2025",
      "Produced school documentary series",
    ],
    photoGallery: [],
    memberCount: 18,
    foundedYear: 2019,
    isActive: true,
  },
  {
    id: "eastlake-track",
    name: "Track & Field Club",
    description:
      "Train and compete in track and field events including sprints, distance, jumps, and throws.",
    category: "Sports",
    meetingFrequency: "Daily",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Coach Mike Torres",
      email: "m.torres@school.edu",
      department: "Athletics",
    },
    officers: [
      {
        name: "Jordan Williams",
        position: "Team Captain",
        email: "j.williams@student.edu",
        grade: 12,
      },
    ],
    meetingSchedule: "Monday - Friday, 3:30 PM - 5:30 PM (spring season)",
    meetingLocation: {
      lat: 47.6151,
      lng: -122.0301,
      parentOrg: "Eastlake High School",
      room: "Eastlake High School",
      internalLocation: "Athletic Complex",
    },
    membershipRequirements:
      "Physical clearance form, commitment to daily practice",
    dues: "$25 per season",
    socialLinks: { instagram: "@eastlake_track" },
    achievements: ["KingCo Conference Champions 2025", "3 state qualifiers"],
    photoGallery: [],
    memberCount: 45,
    foundedYear: 2000,
    isActive: true,
  },
  {
    id: "ics-global-issues",
    name: "Global Issues Forum",
    description:
      "Discuss and research pressing global challenges including climate change, human rights, and international development.",
    category: "Academic",
    meetingFrequency: "Bi-weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Dr. Amara Osei",
      email: "a.osei@school.edu",
      department: "Social Studies",
    },
    officers: [
      {
        name: "Layla Ahmed",
        position: "President",
        email: "l.ahmed@student.edu",
        grade: 12,
      },
    ],
    meetingSchedule: "Every other Tuesday, 3:30 PM - 4:30 PM",
    meetingLocation: {
      lat: 47.66455,
      lng: -122.1911,
      parentOrg: "International Community School",
      room: "International Community School",
      internalLocation: "Conference Room",
    },
    membershipRequirements: "Open to all students",
    dues: "None",
    socialLinks: { instagram: "@ics_globalforum" },
    achievements: [
      "Hosted district-wide Global Awareness Week",
      "Student-led UN simulation event",
    ],
    photoGallery: [],
    memberCount: 22,
    foundedYear: 2020,
    isActive: true,
  },
  {
    id: "ics-dance",
    name: "International Dance Ensemble",
    description:
      "Learn and perform traditional and contemporary dances from cultures around the world.",
    category: "Arts",
    meetingFrequency: "Weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Ms. Chen Wei",
      email: "c.wei@school.edu",
      department: "Fine Arts",
    },
    officers: [
      {
        name: "Rani Kapoor",
        position: "Lead Choreographer",
        email: "r.kapoor@student.edu",
        grade: 12,
      },
      {
        name: "Luis Herrera",
        position: "Performance Manager",
        email: "l.herrera@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Every Wednesday, 3:30 PM - 5:00 PM",
    meetingLocation: {
      lat: 47.66375,
      lng: -122.19085,
      parentOrg: "International Community School",
      room: "International Community School",
      internalLocation: "Dance Studio",
    },
    membershipRequirements: "No dance experience required, all are welcome",
    dues: "$10 per semester (costume fund)",
    socialLinks: { instagram: "@ics_dance" },
    achievements: [
      "Annual Multicultural Dance Showcase",
      "Featured at district cultural festival",
    ],
    photoGallery: [],
    memberCount: 30,
    foundedYear: 2018,
    isActive: true,
  },
  {
    id: "inglemoor-chess",
    name: "Chess Club",
    description:
      "Play casual and competitive chess, learn strategies, and compete in local and state tournaments.",
    category: "Academic",
    meetingFrequency: "Weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "Lunch",
    advisor: {
      name: "Mr. Tom Richards",
      email: "t.richards@school.edu",
      department: "Mathematics",
    },
    officers: [
      {
        name: "Victor Petrov",
        position: "President",
        email: "v.petrov@student.edu",
        grade: 12,
      },
    ],
    meetingSchedule: "Every Tuesday and Thursday during lunch",
    meetingLocation: {
      lat: 47.74135,
      lng: -122.22305,
      parentOrg: "Inglemoor High School",
      room: "Inglemoor High School",
      internalLocation: "Library",
    },
    membershipRequirements: "Open to all skill levels",
    dues: "None",
    socialLinks: {},
    achievements: [
      "State Chess Tournament Top 10",
      "Lunchtime chess league with 40+ participants",
    ],
    photoGallery: [],
    memberCount: 26,
    foundedYear: 2012,
    isActive: true,
  },
  {
    id: "inglemoor-hiking",
    name: "Hiking & Outdoor Adventures Club",
    description:
      "Explore Pacific Northwest trails, learn outdoor skills, and build community through weekend hikes and camping trips.",
    category: "Sports",
    meetingFrequency: "Bi-weekly",
    membershipStatus: "Open Enrollment",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Ms. Amy Brooks",
      email: "a.brooks@school.edu",
      department: "PE",
    },
    officers: [
      {
        name: "Sam Everett",
        position: "Trail Leader",
        email: "s.everett@student.edu",
        grade: 12,
      },
      {
        name: "Nina Park",
        position: "Safety Officer",
        email: "n.park@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule:
      "Every other Friday, 3:30 PM - 4:30 PM (planning) + weekend outings",
    meetingLocation: {
      lat: 47.7411,
      lng: -122.22245,
      parentOrg: "Inglemoor High School",
      room: "Inglemoor High School",
      internalLocation: "Room 104",
    },
    membershipRequirements:
      "Signed parent waiver, appropriate gear for outings",
    dues: "$25 per semester (transportation costs)",
    socialLinks: { instagram: "@inglemoor_hike" },
    achievements: [
      "Completed all 10 WTA trail challenge hikes",
      "Annual Mt. Si summit tradition",
    ],
    photoGallery: [],
    memberCount: 33,
    foundedYear: 2016,
    isActive: true,
  },
  {
    id: "bothell-yearbook",
    name: "Yearbook Committee",
    description:
      "Design, photograph, write, and produce the annual school yearbook. Learn journalism, design, and photography.",
    category: "Media",
    meetingFrequency: "Weekly",
    membershipStatus: "Application Required",
    gradeLevel: "All Grades",
    meetingTime: "After School",
    advisor: {
      name: "Mrs. Julie Hansen",
      email: "j.hansen@school.edu",
      department: "English",
    },
    officers: [
      {
        name: "Ava Thompson",
        position: "Editor-in-Chief",
        email: "a.thompson@student.edu",
        grade: 12,
      },
      {
        name: "Chris Lopez",
        position: "Photo Editor",
        email: "c.lopez@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "Every Monday and Wednesday, 3:30 PM - 5:00 PM",
    meetingLocation: {
      lat: 47.76025,
      lng: -122.22095,
      parentOrg: "Bothell High School",
      room: "Bothell High School",
      internalLocation: "Publications Room",
    },
    membershipRequirements: "Application with portfolio, interview process",
    dues: "None",
    socialLinks: { instagram: "@bothell_yearbook" },
    achievements: [
      "Best Yearbook - Jostens National Award 2025",
      "Sold 800+ copies",
    ],
    photoGallery: [],
    memberCount: 20,
    foundedYear: 1970,
    isActive: true,
  },
  {
    id: "bothell-nhs",
    name: "National Honor Society - Bothell Chapter",
    description:
      "Recognize outstanding students who demonstrate excellence in scholarship, leadership, service, and character.",
    category: "Leadership",
    meetingFrequency: "Monthly",
    membershipStatus: "Application Required",
    gradeLevel: "10th-12th",
    meetingTime: "After School",
    advisor: {
      name: "Dr. Lisa Morgan",
      email: "l.morgan@school.edu",
      department: "Counseling",
    },
    officers: [
      {
        name: "Emily Zhang",
        position: "President",
        email: "e.zhang@student.edu",
        grade: 12,
      },
      {
        name: "David Park",
        position: "Vice President",
        email: "d.park@student.edu",
        grade: 11,
      },
    ],
    meetingSchedule: "First Thursday of each month, 3:30 PM - 4:30 PM",
    meetingLocation: {
      lat: 47.76095,
      lng: -122.22085,
      parentOrg: "Bothell High School",
      room: "Bothell High School",
      internalLocation: "Library Conference Room",
    },
    membershipRequirements:
      "3.5+ GPA, 20+ service hours, faculty recommendation",
    dues: "$15 per year",
    socialLinks: { instagram: "@bothell_nhs" },
    achievements: [
      "80+ active members",
      "Annual scholarship fundraiser raises $5,000+",
    ],
    photoGallery: [],
    memberCount: 82,
    foundedYear: 1995,
    isActive: true,
  },
];

export const events: Event[] = [
  {
    id: "event-1",
    title: "Model UN Practice Session",
    description:
      "Weekly practice session focusing on resolution writing and debate skills.",
    date: "2026-05-14",
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
    date: "2026-05-15",
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
    date: "2026-05-28",
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
    date: "2026-05-27",
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
    date: "2026-05-21",
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
    date: "2026-05-30",
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
    downloadUrl: "/Webmaster%20Work%20Log.pdf",
    dateAdded: "2025-08-15",
  },
  {
    id: "res-2",
    title: "Budget Request Form",
    description:
      "Standard form for requesting funds from the school activities budget. Required for all chapter expenses.",
    category: "Forms",
    fileType: "PDF",
    downloadUrl: "/Webmaster%20Work%20Log.pdf",
    dateAdded: "2025-08-10",
  },
  {
    id: "res-3",
    title: "Event Planning Checklist",
    description:
      "Comprehensive checklist for planning chapter events, including timeline, permissions, and logistics.",
    category: "Templates",
    fileType: "PDF",
    downloadUrl: "/Webmaster%20Work%20Log.pdf",
    dateAdded: "2025-09-01",
  },
  {
    id: "res-4",
    title: "Running Effective Meetings Guide",
    description:
      "Best practices for conducting productive chapter meetings, including agenda templates and facilitation tips.",
    category: "Guides",
    fileType: "PDF",
    downloadUrl: "/Webmaster%20Work%20Log.pdf",
    dateAdded: "2025-08-20",
  },
  {
    id: "res-5",
    title: "Fundraising Proposal Template",
    description:
      "Template for submitting fundraising event proposals to administration for approval.",
    category: "Forms",
    fileType: "DOCX",
    downloadUrl: "/WhatsApp%20Image%202026-01-21%20at%202.41.55%20PM.pdf",
    dateAdded: "2025-09-05",
  },
  {
    id: "res-6",
    title: "Leadership Transition Handbook",
    description:
      "Guide for outgoing and incoming officers on smooth leadership transitions, including knowledge transfer.",
    category: "Handbooks",
    fileType: "PDF",
    downloadUrl: "/WhatsApp%20Image%202026-01-21%20at%202.41.55%20PM.pdf",
    dateAdded: "2025-04-15",
  },
  {
    id: "res-7",
    title: "Meeting Minutes Template",
    description:
      "Standard template for recording chapter meeting minutes with action items tracking.",
    category: "Templates",
    fileType: "DOCX",
    downloadUrl: "/Webmaster%20Work%20Log.pdf",
    dateAdded: "2025-08-25",
  },
  {
    id: "res-8",
    title: "Advisor Training Module",
    description:
      "Comprehensive training materials for faculty advisors covering policies, responsibilities, and best practices.",
    category: "Training Materials",
    fileType: "PDF",
    downloadUrl: "/WhatsApp%20Image%202026-01-21%20at%202.41.55%20PM.pdf",
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

export const clubHistoryData: Record<
  string,
  {
    id: string;
    eventType: string;
    title: string;
    description: string;
    eventDate: string;
  }[]
> = {
  "model-un": [
    {
      id: "h1",
      eventType: "founded",
      title: "Club Founded",
      description:
        "Model UN was established by a group of 12 passionate students interested in international affairs.",
      eventDate: "2008-09-15",
    },
    {
      id: "h2",
      eventType: "milestone",
      title: "First Conference Attendance",
      description:
        "Attended Northwest MUN Conference in Seattle with 8 delegates.",
      eventDate: "2009-02-20",
    },
    {
      id: "h3",
      eventType: "achievement",
      title: "First Award Win",
      description: "Won Outstanding Delegate at Pacific Northwest MUN.",
      eventDate: "2011-03-15",
    },
    {
      id: "h4",
      eventType: "membership_milestone",
      title: "25 Members Reached",
      description:
        "Club grew to 25 active members, doubling in size from the previous year.",
      eventDate: "2015-10-01",
    },
    {
      id: "h5",
      eventType: "competition_result",
      title: "State Champions",
      description:
        "Won Best Delegation at the Washington State MUN Conference.",
      eventDate: "2023-04-12",
    },
    {
      id: "h6",
      eventType: "event_highlight",
      title: "Hosted First Invitational",
      description:
        "Organized the inaugural Juanita MUN Invitational with 200+ delegates from 15 schools.",
      eventDate: "2024-11-05",
    },
    {
      id: "h7",
      eventType: "achievement",
      title: "National Recognition",
      description: "Ranked in the top 25 high school MUN programs nationally.",
      eventDate: "2025-06-01",
    },
  ],
  robotics: [
    {
      id: "h8",
      eventType: "founded",
      title: "Team Established",
      description:
        "Robotics team formed as FIRST Robotics Competition Team #8492.",
      eventDate: "2012-01-10",
    },
    {
      id: "h9",
      eventType: "milestone",
      title: "First Robot Built",
      description:
        "Completed first competition robot 'Phoenix' for the Rebound Rumble challenge.",
      eventDate: "2012-03-01",
    },
    {
      id: "h10",
      eventType: "competition_result",
      title: "Regional Champions",
      description: "Won the Pacific Northwest Regional for the first time.",
      eventDate: "2020-03-15",
    },
    {
      id: "h11",
      eventType: "achievement",
      title: "Innovation Award",
      description:
        "Received the Innovation in Control Award at the State Championship.",
      eventDate: "2024-04-20",
    },
    {
      id: "h12",
      eventType: "milestone",
      title: "World Championship Qualified",
      description:
        "Qualified for FIRST World Championship for the 3rd consecutive year.",
      eventDate: "2025-04-01",
    },
  ],
  "community-service": [
    {
      id: "h13",
      eventType: "founded",
      title: "Club Founded",
      description: "Started as a small volunteer group of 8 students.",
      eventDate: "2005-09-01",
    },
    {
      id: "h14",
      eventType: "milestone",
      title: "1,000 Hours Milestone",
      description:
        "Collectively logged 1,000 volunteer hours in a single year.",
      eventDate: "2010-06-15",
    },
    {
      id: "h15",
      eventType: "achievement",
      title: "Youth Volunteer Award",
      description:
        "Named Youth Volunteer Organization of the Year by the city.",
      eventDate: "2024-05-20",
    },
    {
      id: "h16",
      eventType: "membership_milestone",
      title: "Largest Club",
      description: "Became the largest club at JHS with 72 members.",
      eventDate: "2025-09-15",
    },
  ],
};

export const projectsData: Record<
  string,
  {
    id: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate?: string;
  }[]
> = {
  robotics: [
    {
      id: "p1",
      title: "Phoenix V - Competition Robot",
      description:
        "2026 competition robot featuring advanced swerve drive and autonomous scoring capabilities.",
      status: "in_progress",
      startDate: "2025-09-01",
    },
    {
      id: "p2",
      title: "Community STEM Workshop",
      description:
        "Monthly workshops teaching robotics basics to middle school students.",
      status: "completed",
      startDate: "2025-01-15",
      endDate: "2025-06-15",
    },
    {
      id: "p3",
      title: "3D Printing Lab Expansion",
      description:
        "Adding 3 new 3D printers and a laser cutter to the engineering lab.",
      status: "planning",
      startDate: "2026-02-01",
    },
  ],
  "model-un": [
    {
      id: "p4",
      title: "Juanita MUN Invitational 2026",
      description:
        "Planning our 3rd annual invitational conference for high schools across Washington.",
      status: "in_progress",
      startDate: "2025-11-01",
    },
    {
      id: "p5",
      title: "MUN Prep Guide",
      description:
        "Comprehensive guide for new delegates with resolution writing examples and debate tips.",
      status: "completed",
      startDate: "2025-08-01",
      endDate: "2025-10-15",
    },
  ],
  "community-service": [
    {
      id: "p6",
      title: "Community Garden Project",
      description: "Building a community garden at the local community center.",
      status: "in_progress",
      startDate: "2025-10-01",
    },
    {
      id: "p7",
      title: "Tutoring Network",
      description:
        "Free after-school tutoring for underserved middle school students.",
      status: "completed",
      startDate: "2025-01-10",
      endDate: "2025-06-10",
    },
  ],
  "environmental-club": [
    {
      id: "p8",
      title: "Campus Solar Initiative",
      description:
        "Proposal to install solar panels on the school gymnasium. Working with administration and local energy companies.",
      status: "planning",
      startDate: "2026-01-15",
    },
    {
      id: "p9",
      title: "Zero Waste Campaign",
      description:
        "Campus-wide initiative to reduce waste by 50% through composting and recycling programs.",
      status: "in_progress",
      startDate: "2025-09-01",
    },
  ],
};

export const meetingNotesData: Record<
  string,
  {
    id: string;
    title: string;
    meetingDate: string;
    attendeeCount: number;
    content: string;
    actionItems: { task: string; assignee: string; completed: boolean }[];
  }[]
> = {
  "model-un": [
    {
      id: "mn1",
      title: "Weekly Meeting - Conference Prep",
      meetingDate: "2026-01-07",
      attendeeCount: 38,
      content:
        "Discussed upcoming PACMUN conference logistics. Assigned country positions. Reviewed Robert's Rules of Order procedures.",
      actionItems: [
        {
          task: "Submit country preference forms",
          assignee: "All delegates",
          completed: true,
        },
        {
          task: "Book hotel rooms for conference",
          assignee: "Emma Wilson",
          completed: false,
        },
        {
          task: "Complete position papers draft",
          assignee: "All delegates",
          completed: false,
        },
      ],
    },
    {
      id: "mn2",
      title: "Practice Debate Session",
      meetingDate: "2026-01-14",
      attendeeCount: 35,
      content:
        "Practiced formal debate procedures. Simulated Security Council session on cybersecurity. Feedback provided on speaking skills.",
      actionItems: [
        {
          task: "Review speaking feedback notes",
          assignee: "New delegates",
          completed: false,
        },
        {
          task: "Prepare opening speeches",
          assignee: "Committee chairs",
          completed: false,
        },
      ],
    },
  ],
  robotics: [
    {
      id: "mn3",
      title: "Build Season Kickoff",
      meetingDate: "2026-01-06",
      attendeeCount: 34,
      content:
        "Reviewed 2026 game rules. Brainstormed robot design concepts. Split into sub-teams: mechanical, electrical, programming, business.",
      actionItems: [
        {
          task: "Create CAD prototypes by Friday",
          assignee: "Mechanical team",
          completed: true,
        },
        {
          task: "Order sensor components",
          assignee: "Olivia Garcia",
          completed: true,
        },
        {
          task: "Set up GitHub repository for new season",
          assignee: "Marcus Brown",
          completed: true,
        },
      ],
    },
  ],
};

export const sponsorsData = [
  {
    id: "s1",
    name: "TechForward Inc.",
    description:
      "Local technology company supporting STEM education initiatives.",
    website: "https://techforward.example.com",
    tier: "gold",
    logoUrl: null,
  },
  {
    id: "s2",
    name: "Community First Bank",
    description: "Supporting student organizations through annual grants.",
    website: "https://communityfirst.example.com",
    tier: "silver",
    logoUrl: null,
  },
  {
    id: "s3",
    name: "Northwest Engineering Solutions",
    description: "Providing mentorship and equipment to the Robotics Team.",
    website: "https://nwes.example.com",
    tier: "gold",
    logoUrl: null,
  },
  {
    id: "s4",
    name: "Green Earth Foundation",
    description: "Environmental grants and sustainability resources.",
    website: "https://greenearth.example.com",
    tier: "bronze",
    logoUrl: null,
  },
  {
    id: "s5",
    name: "Juanita HS PTSA",
    description:
      "Parent-Teacher-Student Association funding enrichment programs.",
    website: null,
    tier: "platinum",
    logoUrl: null,
  },
  {
    id: "s6",
    name: "Local Arts Council",
    description: "Grant funding for Drama Club productions and art programs.",
    website: "https://artscouncil.example.com",
    tier: "silver",
    logoUrl: null,
  },
];

export const faqData = [
  {
    id: "faq-1",
    category: "Getting Started",
    question: "How do I join a club?",
    answer:
      "Browse our directory, find a club that interests you, and click 'Join Club' on its detail page. Some clubs have open enrollment (instant join), while others require an application or tryout. You'll be notified about next steps after applying.",
  },
  {
    id: "faq-2",
    category: "Getting Started",
    question: "Can I join multiple clubs?",
    answer:
      "Absolutely! Many students participate in 2-4 clubs. Just make sure you can commit to each club's meeting schedule and requirements. Check for time conflicts before joining.",
  },
  {
    id: "faq-3",
    category: "Getting Started",
    question: "What if I want to start a new club?",
    answer:
      "Visit our Start a Club page for a step-by-step guide. You'll need a faculty advisor, at least 5 interested students, a mission statement, and a proposed meeting schedule. Submit your proposal through our online form.",
  },
  {
    id: "faq-4",
    category: "Membership",
    question: "Are there any fees to join clubs?",
    answer:
      "It varies by club. Some clubs are free, while others charge dues ranging from $15-$50 per semester to cover materials, competition fees, or event costs. Fee waivers are available for students with financial need — speak to your advisor.",
  },
  {
    id: "faq-5",
    category: "Membership",
    question: "Can freshmen join any club?",
    answer:
      "Most clubs welcome all grade levels! A few competitive clubs (like Debate Team) may have grade restrictions or require tryouts. Check each club's requirements on their detail page.",
  },
  {
    id: "faq-6",
    category: "Membership",
    question: "How do I leave a club?",
    answer:
      "Go to your Profile page, find the club under 'My Clubs', and click 'Leave'. If you've paid dues, check with the club treasurer about refund policies.",
  },
  {
    id: "faq-7",
    category: "Events",
    question: "How do I RSVP for events?",
    answer:
      "Visit the Events page, find the event you're interested in, and click 'RSVP'. Some events have limited capacity, so register early. You'll receive a confirmation and reminders.",
  },
  {
    id: "faq-8",
    category: "Events",
    question: "Can non-members attend club events?",
    answer:
      "Public events are open to all students. Check the event listing — it will indicate whether the event is public or members-only.",
  },
  {
    id: "faq-9",
    category: "Leadership",
    question: "How do I become a club officer?",
    answer:
      "Most clubs hold officer elections annually, typically in spring for the following year. Build your involvement first — attend meetings regularly, volunteer for projects, and demonstrate leadership. Talk to current officers about the election process.",
  },
  {
    id: "faq-10",
    category: "Leadership",
    question: "What are the responsibilities of a club officer?",
    answer:
      "Officers help plan meetings, organize events, manage communications, and represent the club to administration. Specific roles (President, VP, Secretary, Treasurer) have distinct duties outlined in each club's constitution.",
  },
  {
    id: "faq-11",
    category: "Resources",
    question: "Where can I find club documents and templates?",
    answer:
      "Visit our Resources page for templates (constitutions, budgets, meeting minutes), guides, handbooks, and training materials.",
  },
  {
    id: "faq-12",
    category: "Resources",
    question: "How do I request funding for my club?",
    answer:
      "Submit a Budget Request Form (available on the Resources page) to the Activities Office. Include itemized expenses, justification, and timeline. The approval process typically takes 1-2 weeks.",
  },
  {
    id: "faq-13",
    category: "Safety",
    question: "What should I do if I experience issues in a club?",
    answer:
      "Report concerns to your club advisor, school counselor, or the Activities Office. ClubConnect takes safety seriously — all clubs must follow school conduct policies. Anonymous reporting is also available through the school's reporting system.",
  },
  {
    id: "faq-14",
    category: "Technical",
    question: "How do I update my profile?",
    answer:
      "Go to your Profile page and click 'Edit Profile'. You can update your name, bio, grade, interests, and profile photo. Changes are saved to your account automatically.",
  },
  {
    id: "faq-15",
    category: "Technical",
    question: "I forgot my password. What do I do?",
    answer:
      "Click 'Forgot Password' on the login page. Enter your school email, and you'll receive a reset link. If you continue having issues, contact the Activities Office.",
  },
];

export const guidesData = [
  {
    id: "guide-joining",
    slug: "joining",
    title: "How to Join a Club",
    description:
      "Complete guide to finding and joining the right club for you.",
    category: "Getting Started",
    sections: [
      {
        heading: "Step 1: Explore Your Options",
        content:
          "Browse the Club Directory to see all active organizations. Use filters to narrow by category, meeting time, and grade level. Read descriptions and check requirements carefully.",
      },
      {
        heading: "Step 2: Attend a Meeting",
        content:
          "Most clubs welcome visitors! Attend a meeting or two before committing. This lets you experience the club culture and meet current members.",
      },
      {
        heading: "Step 3: Apply or Enroll",
        content:
          "For Open Enrollment clubs, click 'Join' on the club page. For Application Required or Tryout Required clubs, follow the specific instructions on the club's detail page.",
      },
      {
        heading: "Step 4: Get Involved",
        content:
          "Once you're a member, attend meetings regularly, participate in events, and connect with other members. The more you put in, the more you'll get out!",
      },
      {
        heading: "Tips for Success",
        content:
          "Start with 1-2 clubs and expand later. Ask questions during meetings. Volunteer for small tasks to build connections. Don't be afraid to try something new!",
      },
    ],
  },
  {
    id: "guide-starting",
    slug: "starting",
    title: "Starting a New Club",
    description:
      "Everything you need to know about launching a student organization.",
    category: "Getting Started",
    sections: [
      {
        heading: "Is There Interest?",
        content:
          "Before starting a club, gauge interest. Talk to classmates, post on social media, or create a sign-up sheet. You'll need at least 5 committed students to start.",
      },
      {
        heading: "Find a Faculty Advisor",
        content:
          "Every club needs a faculty advisor who will attend meetings, approve activities, and serve as the responsible adult. Approach teachers in related departments.",
      },
      {
        heading: "Write Your Constitution",
        content:
          "Draft a constitution outlining your club's mission, officer positions, meeting schedule, membership requirements, and bylaws. Use our template from the Resources page.",
      },
      {
        heading: "Submit Your Proposal",
        content:
          "Fill out the Club Proposal Form on our Start a Club page. Include your constitution, advisor confirmation, member list, and first-year plan. The Activities Office reviews proposals within 2-3 weeks.",
      },
      {
        heading: "Launch and Grow",
        content:
          "Once approved, schedule your first meeting, promote at the Club Fair, create social media accounts, and plan your first event. Start small and build momentum!",
      },
    ],
  },
  {
    id: "guide-leadership",
    slug: "leadership",
    title: "Leadership Guide for Officers",
    description: "Best practices for running an effective club as an officer.",
    category: "Leadership",
    sections: [
      {
        heading: "Setting the Tone",
        content:
          "As an officer, you set the culture. Be organized, punctual, and enthusiastic. Create a welcoming environment where every member feels valued.",
      },
      {
        heading: "Running Effective Meetings",
        content:
          "Always have an agenda. Start and end on time. Mix business items with fun activities. Encourage participation from quieter members. Take minutes and share them.",
      },
      {
        heading: "Communication Best Practices",
        content:
          "Use consistent channels (email, Discord, Instagram). Send weekly reminders. Keep your club's ClubConnect page updated with current information.",
      },
      {
        heading: "Event Planning",
        content:
          "Plan events at least 3-4 weeks in advance. Create checklists, delegate tasks, and always have a backup plan. File necessary paperwork with administration early.",
      },
      {
        heading: "Handling Conflicts",
        content:
          "Address issues early and privately. Listen to all sides. Involve your advisor when needed. Focus on solutions, not blame.",
      },
      {
        heading: "Transitioning Leadership",
        content:
          "Start training successors in spring. Document procedures, passwords, and key contacts. Create a transition binder or guide for incoming officers.",
      },
    ],
  },
  {
    id: "guide-fundraising",
    slug: "fundraising",
    title: "Fundraising Guide",
    description: "Strategies and rules for raising money for your club.",
    category: "Resources",
    sections: [
      {
        heading: "School Fundraising Policies",
        content:
          "All fundraising must be approved by the Activities Office at least 2 weeks before the event. Complete the Fundraising Proposal Form and submit it for review.",
      },
      {
        heading: "Popular Fundraising Ideas",
        content:
          "Bake sales, car washes, spirit wear sales, dine-out nights, online crowdfunding (with approval), talent shows, and skill-based workshops.",
      },
      {
        heading: "Online Donations",
        content:
          "ClubConnect supports online donations through our donation page. Clubs receive funds through the school's accounting system.",
      },
      {
        heading: "Grant Opportunities",
        content:
          "Apply for school grants (Innovation Grant, Community Impact Award, Arts Enrichment Fund) through the Resources page. External grants are also available for qualifying programs.",
      },
      {
        heading: "Financial Best Practices",
        content:
          "Keep detailed records of all income and expenses. Have the treasurer report finances monthly. Follow school policies on handling cash.",
      },
    ],
  },
];

export const schoolWideStats = {
  totalClubs: 47,
  totalMembers: 1283,
  totalEvents: 156,
  totalServiceHours: 12450,
  totalDonations: 28750,
  avgClubSize: 27.3,
  clubRetentionRate: 89,
  studentParticipationRate: 68,
  clubCategories: [
    { category: "Academic", count: 8 },
    { category: "STEM", count: 7 },
    { category: "Service", count: 9 },
    { category: "Arts", count: 6 },
    { category: "Cultural", count: 5 },
    { category: "Media", count: 4 },
    { category: "Sports", count: 5 },
    { category: "Leadership", count: 3 },
  ],
  monthlyGrowth: [
    { month: "Sep 2025", members: 980, events: 8 },
    { month: "Oct 2025", members: 1050, events: 14 },
    { month: "Nov 2025", members: 1120, events: 18 },
    { month: "Dec 2025", members: 1180, events: 12 },
    { month: "Jan 2026", members: 1283, events: 16 },
  ],
  topClubs: [
    { name: "Community Service Club", members: 72, events: 24, score: 96 },
    { name: "Model United Nations", members: 45, events: 18, score: 95 },
    { name: "Robotics Team", members: 38, events: 15, score: 92 },
    { name: "Drama Club", members: 54, events: 20, score: 88 },
    { name: "Multicultural Alliance", members: 63, events: 16, score: 87 },
  ],
};

export const studentStories = [
  {
    id: "story-1",
    name: "Aiden Cooper",
    grade: 12,
    club: "Model United Nations",
    quote:
      "MUN transformed me from a shy freshman into a confident public speaker. I've attended 12 conferences, won 5 awards, and made lifelong friends. It directly helped me get into my dream college.",
    impact: "4 years, 12 conferences, 5 awards",
    category: "Leadership Journey",
  },
  {
    id: "story-2",
    name: "Maya Patel",
    grade: 11,
    club: "Robotics Team",
    quote:
      "I had zero engineering experience when I joined. Now I can design in CAD, program autonomous systems, and lead a build team. The mentorship from upperclassmen and industry sponsors is incredible.",
    impact: "Learned CAD, Python, Java",
    category: "Personal Growth",
  },
  {
    id: "story-3",
    name: "Carlos Mendez",
    grade: 10,
    club: "Community Service Club",
    quote:
      "Volunteering 200+ hours showed me the impact one person can make. We built a community garden, tutored 50 students, and raised $3,000 for the local food bank.",
    impact: "200+ service hours, $3,000 raised",
    category: "Community Impact",
  },
  {
    id: "story-4",
    name: "Sophia Kim",
    grade: 12,
    club: "Drama Club",
    quote:
      "From backstage crew to lead actress — Drama Club gave me a family. The skills I learned in performance, teamwork, and creative problem-solving apply to everything in life.",
    impact: "8 productions, lead in 3 musicals",
    category: "Personal Growth",
  },
  {
    id: "story-5",
    name: "Jordan Williams",
    grade: 11,
    club: "Environmental Action Club",
    quote:
      "We increased campus recycling by 40%, planted 200 trees, and got the school Green Certification. It feels amazing to make a tangible environmental difference.",
    impact: "40% recycling increase, 200 trees planted",
    category: "Community Impact",
  },
  {
    id: "story-6",
    name: "Emma Zhang",
    grade: 12,
    club: "The School Chronicle",
    quote:
      "Running the school newspaper taught me journalism, design, and leadership. We publish bi-weekly and have won 10 national awards. It's the best resume builder you can imagine.",
    impact: "24 issues/year, 10 national awards",
    category: "Leadership Journey",
  },
];

export const weeklyOpportunities = [
  {
    id: "opp-1",
    type: "event",
    title: "Model UN Practice Session",
    date: "2026-01-14",
    club: "Model United Nations",
    urgent: false,
  },
  {
    id: "opp-2",
    type: "deadline",
    title: "Robotics Competition Registration Due",
    date: "2026-01-18",
    club: "Robotics Team",
    urgent: true,
  },
  {
    id: "opp-3",
    type: "volunteer",
    title: "Community Food Drive",
    date: "2026-01-18",
    club: "Community Service Club",
    urgent: false,
  },
  {
    id: "opp-4",
    type: "event",
    title: "Drama Club Auditions",
    date: "2026-01-16",
    club: "Drama Club",
    urgent: false,
  },
  {
    id: "opp-5",
    type: "meeting",
    title: "Environmental Club Planning Meeting",
    date: "2026-01-13",
    club: "Environmental Club",
    urgent: false,
  },
  {
    id: "opp-6",
    type: "competition",
    title: "Debate State Qualifier Prep",
    date: "2026-01-14",
    club: "Debate Team",
    urgent: true,
  },
  {
    id: "opp-7",
    type: "social",
    title: "Cultural Heritage Celebration",
    date: "2026-01-20",
    club: "Multicultural Alliance",
    urgent: false,
  },
  {
    id: "opp-8",
    type: "deadline",
    title: "Spring Budget Requests Due",
    date: "2026-01-31",
    club: "All Clubs",
    urgent: true,
  },
];

export const safetyGuidelines = [
  {
    title: "Conduct Standards",
    content:
      "All club members must follow the school's Student Code of Conduct. Bullying, harassment, and discrimination are not tolerated.",
  },
  {
    title: "Supervision Requirements",
    content:
      "A faculty advisor must be present at all official club meetings and events. Off-campus events require additional approval and parent permission slips.",
  },
  {
    title: "Reporting Concerns",
    content:
      "Students should report safety concerns to their club advisor, school counselor, or Activities Office. Anonymous reporting is available through the school's online system.",
  },
  {
    title: "Online Safety",
    content:
      "Club social media accounts must follow school social media policies. No personal information, bullying, or inappropriate content. All accounts must be supervised by the advisor.",
  },
  {
    title: "Financial Safety",
    content:
      "All club funds must be managed through the school's accounting system. Officers should never handle cash alone — always have two people present when counting money.",
  },
  {
    title: "Event Safety",
    content:
      "All events must have a safety plan, including emergency contacts, first aid kit location, and evacuation procedures. File events with administration at least 2 weeks in advance.",
  },
  {
    title: "Inclusion Policy",
    content:
      "Every club must welcome all interested students regardless of race, gender, religion, orientation, disability, or socioeconomic status. Accommodations will be provided as needed.",
  },
  {
    title: "Transportation",
    content:
      "Students under 18 must have signed parent permission for off-campus activities. School-arranged transportation is preferred. Student drivers require additional forms.",
  },
];
