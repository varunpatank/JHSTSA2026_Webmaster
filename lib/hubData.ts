import {
  StarterGuide,
  ClubIdea,
  Competition,
  Mentor,
  CollaborationOpportunity,
  SuccessStory,
  Achievement,
  ClubFinderQuiz,
  CalendarEvent,
  ClubHealthMetrics,
  ClubBenchmark,
  ResourceRequest
} from '@/types';



export const starterGuides: StarterGuide[] = [
  {
    id: 'guide-1',
    title: 'How to Start a Club from Scratch',
    description: 'Complete step-by-step guide covering everything from initial idea to official recognition.',
    category: 'Getting Started',
    difficulty: 'Beginner',
    estimatedTime: '2-4 weeks',
    steps: [
      {
        stepNumber: 1,
        title: 'Define Your Club\'s Purpose',
        content: 'Start by clearly defining what your club will focus on. Consider your passion, the gap in current offerings, and potential member interest. Write a clear mission statement that explains why your club exists and what it aims to achieve.',
        tips: ['Survey classmates to gauge interest', 'Research if similar clubs exist and how yours differs', 'Keep your mission statement concise - under 50 words'],
        resources: [{ title: 'Mission Statement Template', url: '/resources/templates' }]
      },
      {
        stepNumber: 2,
        title: 'Find a Faculty Advisor',
        content: 'Every club needs a faculty advisor. Look for teachers who share interest in your topic or have relevant expertise. Prepare a brief pitch explaining your club concept and what you\'d need from an advisor.',
        tips: ['Approach multiple potential advisors', 'Explain the time commitment honestly', 'Highlight benefits like seeing students pursue interests'],
        warnings: ['Don\'t wait until the last minute - advisors may need time to consider']
      },
      {
        stepNumber: 3,
        title: 'Gather Founding Members',
        content: 'You\'ll need a core group of committed students to start. Most schools require a minimum number of members (typically 5-10) for official recognition.',
        tips: ['Start with friends who share your interest', 'Create a sign-up sheet or online form', 'Host an informal interest meeting']
      },
      {
        stepNumber: 4,
        title: 'Draft Your Constitution',
        content: 'Create your club\'s governing document including purpose, membership requirements, officer positions, meeting procedures, and election processes.',
        resources: [{ title: 'Constitution Template', url: '/resources/templates' }]
      },
      {
        stepNumber: 5,
        title: 'Submit Official Application',
        content: 'Complete your school\'s club application process. This typically includes your constitution, advisor confirmation, and member signatures.',
        tips: ['Follow all formatting requirements carefully', 'Submit before deadlines', 'Keep copies of everything submitted']
      }
    ],
    relatedGuides: ['guide-2', 'guide-4'],
    views: 2847,
    helpful: 456,
    dateUpdated: '2026-01-05'
  },
  {
    id: 'guide-2',
    title: 'Writing an Effective Club Constitution',
    description: 'Learn how to create bylaws and governance documents that will serve your club for years.',
    category: 'Constitution & Bylaws',
    difficulty: 'Intermediate',
    estimatedTime: '1-2 weeks',
    steps: [
      {
        stepNumber: 1,
        title: 'Understand Required Sections',
        content: 'Most constitutions need: Name and Purpose, Membership, Officers and Duties, Meetings, Elections, Amendments, and Advisor Role.',
        tips: ['Review constitutions from successful clubs', 'Check school requirements for specific sections']
      },
      {
        stepNumber: 2,
        title: 'Define Membership Clearly',
        content: 'Specify who can join, any requirements, dues if applicable, and member responsibilities and rights.',
        warnings: ['Ensure your requirements comply with school non-discrimination policies']
      },
      {
        stepNumber: 3,
        title: 'Establish Officer Structure',
        content: 'Define positions (President, VP, Secretary, Treasurer at minimum), duties, term lengths, and succession procedures.',
        tips: ['Consider adding specialized roles for your club type', 'Include impeachment procedures for accountability']
      },
      {
        stepNumber: 4,
        title: 'Set Meeting and Voting Procedures',
        content: 'Establish how often meetings occur, quorum requirements, and voting procedures for decisions.',
        tips: ['Keep procedures simple but clear', 'Include provisions for virtual meetings']
      },
      {
        stepNumber: 5,
        title: 'Create Amendment Process',
        content: 'Define how the constitution can be changed - typically requiring notice and supermajority vote.',
        tips: ['Make it possible but not too easy to change', 'Two-thirds majority is standard']
      }
    ],
    downloadUrl: '/downloads/constitution-template.docx',
    relatedGuides: ['guide-1', 'guide-5'],
    views: 1923,
    helpful: 312,
    dateUpdated: '2025-12-15'
  },
  {
    id: 'guide-3',
    title: 'Recruiting Members: Building Your Base',
    description: 'Proven strategies for attracting and retaining active club members.',
    category: 'Recruiting Members',
    difficulty: 'Beginner',
    estimatedTime: '3-5 days',
    steps: [
      {
        stepNumber: 1,
        title: 'Create Your Recruitment Message',
        content: 'Develop a clear, compelling pitch that explains what your club does, why it matters, and what members gain. Focus on benefits, not just activities.',
        tips: ['Lead with what members GET, not what they do', 'Use testimonials from current members', 'Keep it short and memorable']
      },
      {
        stepNumber: 2,
        title: 'Leverage Club Fairs',
        content: 'Make the most of school club fairs with an engaging booth, interactive elements, and easy sign-up process.',
        tips: ['Have something interactive at your table', 'Collect emails/phone numbers', 'Offer a QR code for digital sign-up', 'Prepare a 30-second elevator pitch']
      },
      {
        stepNumber: 3,
        title: 'Use Social Media Strategically',
        content: 'Create presence on platforms your target members use. Post consistently and engage authentically.',
        tips: ['Focus on 1-2 platforms rather than all', 'Show behind-the-scenes content', 'Feature member spotlights']
      },
      {
        stepNumber: 4,
        title: 'Host Open Events',
        content: 'Organize events specifically designed for non-members to experience what your club offers.',
        tips: ['Make it low-commitment', 'Have current members ready to welcome newcomers', 'Follow up within 48 hours']
      },
      {
        stepNumber: 5,
        title: 'Create a Welcoming Culture',
        content: 'First impressions matter. Design an onboarding experience that makes new members feel valued and connected.',
        tips: ['Assign "buddy" members to newcomers', 'Have a new member orientation', 'Create a welcome packet']
      }
    ],
    relatedGuides: ['guide-6', 'guide-8'],
    views: 3156,
    helpful: 523,
    dateUpdated: '2026-01-08'
  },
  {
    id: 'guide-4',
    title: 'Running Effective Club Meetings',
    description: 'Transform your meetings from boring to engaging with these facilitation techniques.',
    category: 'Running Meetings',
    difficulty: 'Beginner',
    estimatedTime: '1-2 days',
    steps: [
      {
        stepNumber: 1,
        title: 'Create a Structured Agenda',
        content: 'Every meeting needs an agenda shared in advance. Include time allocations, topics, and who\'s leading each section.',
        tips: ['Send agenda 24 hours before', 'Include expected outcomes for each item', 'Leave buffer time'],
        resources: [{ title: 'Meeting Agenda Template', url: '/resources/templates' }]
      },
      {
        stepNumber: 2,
        title: 'Start Strong',
        content: 'Begin on time with something engaging - an icebreaker, quick win, or interesting update. Set the tone immediately.',
        tips: ['Have a rotation of fun icebreakers', 'Celebrate recent achievements first', 'Avoid starting with announcements']
      },
      {
        stepNumber: 3,
        title: 'Encourage Participation',
        content: 'Use techniques to ensure everyone contributes, not just the same vocal members.',
        tips: ['Use round-robins for input', 'Try think-pair-share for discussions', 'Create small groups for brainstorming']
      },
      {
        stepNumber: 4,
        title: 'End with Action Items',
        content: 'Never end a meeting without clear next steps. Assign tasks with deadlines and responsible parties.',
        tips: ['Write action items visibly', 'Confirm understanding with assignees', 'Send summary within 24 hours']
      }
    ],
    videoUrl: 'https://youtube.com/example-meeting-tips',
    relatedGuides: ['guide-5', 'guide-9'],
    views: 2234,
    helpful: 389,
    dateUpdated: '2025-11-20'
  },
  {
    id: 'guide-5',
    title: 'Event Planning 101',
    description: 'Plan and execute successful club events from small workshops to large-scale productions.',
    category: 'Event Planning',
    difficulty: 'Intermediate',
    estimatedTime: '2-6 weeks before event',
    steps: [
      {
        stepNumber: 1,
        title: 'Define Event Goals and Audience',
        content: 'Before planning logistics, be clear about what success looks like. Are you recruiting members, fundraising, educating, or building community?',
        tips: ['Set measurable goals', 'Identify your primary and secondary audiences', 'Consider accessibility needs']
      },
      {
        stepNumber: 2,
        title: 'Create a Timeline and Budget',
        content: 'Work backwards from your event date. Build in buffer time and create a realistic budget with contingency.',
        tips: ['Add 20% buffer to timeline estimates', 'Include hidden costs like printing, decorations', 'Track all expenses carefully'],
        resources: [{ title: 'Event Budget Template', url: '/resources/templates' }]
      },
      {
        stepNumber: 3,
        title: 'Handle Logistics',
        content: 'Book venue, arrange equipment, organize catering, plan setup/cleanup, and confirm all vendors.',
        tips: ['Visit venue in person', 'Have backup plans for key elements', 'Create detailed day-of timeline'],
        warnings: ['Book venues early - popular spaces fill up fast']
      },
      {
        stepNumber: 4,
        title: 'Promote Effectively',
        content: 'Use multiple channels and start promotion 3-4 weeks before. Include clear calls to action.',
        tips: ['Create shareable graphics', 'Use countdown reminders', 'Leverage word of mouth']
      },
      {
        stepNumber: 5,
        title: 'Execute and Evaluate',
        content: 'Have clear roles on event day. Collect feedback and document lessons learned for future events.',
        tips: ['Designate a troubleshooter', 'Take lots of photos', 'Send thank-yous to helpers']
      }
    ],
    downloadUrl: '/downloads/event-checklist.pdf',
    relatedGuides: ['guide-6', 'guide-10'],
    views: 2891,
    helpful: 445,
    dateUpdated: '2026-01-02'
  },
  {
    id: 'guide-6',
    title: 'Fundraising Strategies That Work',
    description: 'Creative and effective ways to fund your club activities without burning out your members.',
    category: 'Fundraising',
    difficulty: 'Intermediate',
    estimatedTime: 'Ongoing',
    steps: [
      {
        stepNumber: 1,
        title: 'Calculate Your Actual Needs',
        content: 'Create a detailed budget of what you need to raise and for what purposes. Being specific helps with asks.',
        tips: ['Break down by activity/event', 'Include dues/registration as part of revenue', 'Plan for the whole year']
      },
      {
        stepNumber: 2,
        title: 'Explore No-Cost Options First',
        content: 'Before fundraising, look for grants, sponsorships, donated goods, and in-kind support.',
        tips: ['Check school activity funds', 'Approach local businesses for sponsorship', 'Apply for community grants'],
        resources: [{ title: 'Grant Application Guide', url: '/resources/guides' }]
      },
      {
        stepNumber: 3,
        title: 'Choose Right Fundraisers',
        content: 'Match fundraising to your club identity. Tech clubs might do services; service clubs might do charity events.',
        tips: ['Consider member effort vs. return', 'Think about fun factor - will members enjoy it?', 'Plan timing around school calendar']
      },
      {
        stepNumber: 4,
        title: 'Execute with Energy',
        content: 'Fundraisers work when there\'s enthusiasm. Set clear goals, create competition, celebrate progress.',
        tips: ['Make it a team effort', 'Use progress trackers', 'Thank every donor/customer']
      }
    ],
    relatedGuides: ['guide-5', 'guide-7'],
    views: 1876,
    helpful: 298,
    dateUpdated: '2025-10-15'
  },
  {
    id: 'guide-7',
    title: 'Social Media Marketing for Clubs',
    description: 'Build your club\'s brand and reach through strategic social media presence.',
    category: 'Marketing',
    difficulty: 'Beginner',
    estimatedTime: 'Ongoing',
    steps: [
      {
        stepNumber: 1,
        title: 'Choose Your Platforms',
        content: 'Don\'t try to be everywhere. Pick 1-2 platforms where your target audience is most active.',
        tips: ['Instagram for visual content', 'Discord for community building', 'TikTok for viral potential']
      },
      {
        stepNumber: 2,
        title: 'Create Consistent Branding',
        content: 'Develop a visual identity with consistent colors, fonts, and style across all posts.',
        tips: ['Use free tools like Canva', 'Create templates for recurring posts', 'Include club name/logo in all graphics']
      },
      {
        stepNumber: 3,
        title: 'Plan Content Calendar',
        content: 'Map out content types and posting schedule. Mix promotional with value-adding content.',
        tips: ['80/20 rule: 80% valuable content, 20% promotional', 'Batch create content weekly', 'Use scheduling tools']
      },
      {
        stepNumber: 4,
        title: 'Engage Authentically',
        content: 'Social media is social. Respond to comments, engage with followers, and build community.',
        tips: ['Respond within 24 hours', 'Ask questions in posts', 'Share member-created content']
      }
    ],
    relatedGuides: ['guide-3', 'guide-8'],
    views: 2456,
    helpful: 412,
    dateUpdated: '2025-12-01'
  },
  {
    id: 'guide-8',
    title: 'Developing Future Leaders',
    description: 'Build a pipeline of capable leaders to ensure your club thrives beyond current officers.',
    category: 'Leadership',
    difficulty: 'Advanced',
    estimatedTime: 'Ongoing',
    steps: [
      {
        stepNumber: 1,
        title: 'Identify Potential Leaders',
        content: 'Look for members who show initiative, reliability, and genuine interest - not just popularity.',
        tips: ['Watch for members who volunteer', 'Notice who others naturally follow', 'Consider diverse leadership styles']
      },
      {
        stepNumber: 2,
        title: 'Create Growth Opportunities',
        content: 'Give emerging leaders chances to develop skills through committee leadership, event coordination, or mentorship.',
        tips: ['Delegate meaningfully, not just tasks', 'Provide support but don\'t micromanage', 'Allow safe failure and learning']
      },
      {
        stepNumber: 3,
        title: 'Formalize Transition Process',
        content: 'Create documentation, shadow opportunities, and clear handoff procedures for officer transitions.',
        tips: ['Start transition 4-6 weeks before', 'Create role-specific guides', 'Schedule overlap meetings'],
        resources: [{ title: 'Leadership Transition Handbook', url: '/resources/handbooks' }]
      }
    ],
    relatedGuides: ['guide-4', 'guide-9'],
    views: 1654,
    helpful: 287,
    dateUpdated: '2025-11-10'
  },
  {
    id: 'guide-9',
    title: 'Working with Your Faculty Advisor',
    description: 'Build a productive partnership with your advisor that benefits everyone.',
    category: 'Advisor Relations',
    difficulty: 'Beginner',
    estimatedTime: '1 day',
    steps: [
      {
        stepNumber: 1,
        title: 'Clarify Expectations Early',
        content: 'Have an explicit conversation about what your advisor expects and what you need from them.',
        tips: ['Discuss communication preferences', 'Clarify their availability', 'Understand their decision-making role']
      },
      {
        stepNumber: 2,
        title: 'Keep Them Informed',
        content: 'Regular updates prevent surprises. Share meeting agendas, event plans, and any concerns proactively.',
        tips: ['Weekly or bi-weekly email updates', 'CC them on important communications', 'Ask for input on big decisions']
      },
      {
        stepNumber: 3,
        title: 'Respect Their Time',
        content: 'Remember advisors have full teaching loads. Be organized and prepared for your interactions.',
        tips: ['Come to meetings with clear agendas', 'Handle what you can independently', 'Express appreciation regularly']
      }
    ],
    relatedGuides: ['guide-1', 'guide-8'],
    views: 1234,
    helpful: 198,
    dateUpdated: '2025-09-20'
  },
  {
    id: 'guide-10',
    title: 'Competing Successfully: A Complete Guide',
    description: 'Prepare your club and members to excel in academic and extracurricular competitions.',
    category: 'Competitions',
    difficulty: 'Advanced',
    estimatedTime: '4-12 weeks before competition',
    steps: [
      {
        stepNumber: 1,
        title: 'Choose Competitions Strategically',
        content: 'Research available competitions and select those matching your club\'s strengths and development goals.',
        tips: ['Consider travel and cost requirements', 'Look at historical performance', 'Balance prestige with realistic chances'],
        resources: [{ title: 'Competition Directory', url: '/hub/competitions' }]
      },
      {
        stepNumber: 2,
        title: 'Build Your Competition Team',
        content: 'Select members based on skills, commitment, and team dynamics. Clarify roles and responsibilities.',
        tips: ['Use tryouts or applications for fairness', 'Consider alternates', 'Balance experience with development']
      },
      {
        stepNumber: 3,
        title: 'Create a Preparation Plan',
        content: 'Develop a structured training schedule with milestones, practice sessions, and skill development.',
        tips: ['Study past competition materials', 'Practice under realistic conditions', 'Focus on both skills and logistics']
      },
      {
        stepNumber: 4,
        title: 'Execute on Competition Day',
        content: 'Arrive prepared with materials, positive mindset, and clear understanding of rules and schedule.',
        tips: ['Pack checklist of needed items', 'Get good sleep before', 'Focus on doing your best, not just winning']
      },
      {
        stepNumber: 5,
        title: 'Debrief and Improve',
        content: 'After competing, analyze performance, document lessons, and plan improvements for next time.',
        tips: ['Celebrate effort regardless of outcome', 'Get specific feedback', 'Start preparing earlier next time']
      }
    ],
    relatedGuides: ['guide-5', 'guide-8'],
    views: 1987,
    helpful: 356,
    dateUpdated: '2025-12-20'
  }
];



export const clubIdeas: ClubIdea[] = [
  {
    id: 'idea-1',
    name: 'Podcast Production Club',
    tagline: 'Your Voice, Amplified',
    description: 'Learn the art of podcast creation from concept to publication. Members develop shows on topics they\'re passionate about, learning audio production, interviewing, storytelling, and marketing.',
    category: 'Media',
    targetAudience: ['Content creators', 'Journalists', 'Tech enthusiasts', 'Storytellers'],
    estimatedInterest: 'High',
    startupCost: 'Medium ($50-200)',
    difficultyToStart: 'Moderate',
    suggestedActivities: [
      'Weekly recording sessions',
      'Guest speaker interviews',
      'Audio editing workshops',
      'School news podcast episodes',
      'Podcast festival hosting'
    ],
    potentialPartners: ['School newspaper', 'Drama club', 'Tech club'],
    successTips: [
      'Start with simple equipment - phones work great',
      'Create a consistent release schedule',
      'Partner with other clubs for content'
    ],
    existsAtSchool: false,
    votes: 47,
    dateSubmitted: '2025-11-15'
  },
  {
    id: 'idea-2',
    name: 'Financial Literacy Club',
    tagline: 'Master Your Money Future',
    description: 'Prepare students for financial independence with practical education on budgeting, investing, taxes, credit, and financial planning.',
    category: 'Academic',
    targetAudience: ['All grades', 'Future business students', 'Anyone seeking independence'],
    estimatedInterest: 'Very High',
    startupCost: 'Free',
    difficultyToStart: 'Easy',
    suggestedActivities: [
      'Stock market simulation competitions',
      'Guest speakers from finance industry',
      'Budget challenge games',
      'Tax preparation workshops',
      'Scholarship searching sessions'
    ],
    potentialPartners: ['Local banks', 'Business teachers', 'Parent volunteers in finance'],
    successTips: [
      'Make it interactive, not lecture-based',
      'Use real-life scenarios students relate to',
      'Partner with local credit union for resources'
    ],
    existsAtSchool: false,
    votes: 89,
    dateSubmitted: '2025-10-20'
  },
  {
    id: 'idea-3',
    name: 'Mental Wellness Ambassadors',
    tagline: 'Supporting Each Other',
    description: 'Train students to be peer supporters and mental health advocates. Reduce stigma, provide resources, and create a more supportive school culture.',
    category: 'Service',
    targetAudience: ['Empathetic students', 'Future healthcare workers', 'Peer leaders'],
    estimatedInterest: 'High',
    startupCost: 'Low ($0-50)',
    difficultyToStart: 'Moderate',
    suggestedActivities: [
      'Mental Health First Aid training',
      'Awareness campaign weeks',
      'Stress relief events during exams',
      'Anonymous support resources',
      'Mindfulness sessions'
    ],
    potentialPartners: ['School counselors', 'Local mental health organizations', 'Healthcare professionals'],
    successTips: [
      'Work closely with school counselors',
      'Focus on connecting students to resources, not providing therapy',
      'Prioritize member wellness too'
    ],
    existsAtSchool: false,
    votes: 72,
    dateSubmitted: '2025-09-10'
  },
  {
    id: 'idea-4',
    name: 'Esports & Gaming Club',
    tagline: 'Level Up Together',
    description: 'Competitive gaming meets community. Participate in esports leagues, host tournaments, and build a positive gaming culture.',
    category: 'Sports',
    targetAudience: ['Gamers', 'Tech enthusiasts', 'Competitive spirits'],
    estimatedInterest: 'Very High',
    startupCost: 'High ($200+)',
    difficultyToStart: 'Challenging',
    suggestedActivities: [
      'League of Legends/Valorant team competitions',
      'Inter-school tournaments',
      'Game development workshops',
      'Streaming and content creation',
      'Charity gaming marathons'
    ],
    potentialPartners: ['Computer lab teachers', 'IT department', 'Local gaming cafes'],
    successTips: [
      'Start with games that require minimal equipment',
      'Emphasize good sportsmanship and inclusion',
      'Create multiple teams for different skill levels'
    ],
    existsAtSchool: false,
    votes: 156,
    dateSubmitted: '2025-08-25'
  },
  {
    id: 'idea-5',
    name: 'Social Entrepreneurship Lab',
    tagline: 'Business for Good',
    description: 'Develop and launch ventures that address social problems. Learn entrepreneurship while making a positive impact.',
    category: 'Leadership',
    targetAudience: ['Future business leaders', 'Social change makers', 'Creative problem solvers'],
    estimatedInterest: 'Medium',
    startupCost: 'Low ($0-50)',
    difficultyToStart: 'Challenging',
    suggestedActivities: [
      'Pitch competitions',
      'Lean startup methodology workshops',
      'Mentorship from local entrepreneurs',
      'Pop-up social enterprise projects',
      'Impact measurement training'
    ],
    potentialPartners: ['Local business incubators', 'Junior Achievement', 'Business teachers'],
    successTips: [
      'Start with small, achievable projects',
      'Document your journey for college applications',
      'Partner with existing non-profits'
    ],
    existsAtSchool: false,
    votes: 38,
    dateSubmitted: '2025-11-01'
  },
  {
    id: 'idea-6',
    name: 'Culinary Arts & Food Culture Club',
    tagline: 'Taste the World',
    description: 'Explore global cuisines, learn cooking techniques, and understand food\'s role in culture and community.',
    category: 'Cultural',
    targetAudience: ['Food enthusiasts', 'Cultural explorers', 'Future chefs'],
    estimatedInterest: 'High',
    startupCost: 'Medium ($50-200)',
    difficultyToStart: 'Moderate',
    suggestedActivities: [
      'Monthly themed cooking sessions',
      'Restaurant field trips',
      'Cookbook creation project',
      'Cultural food festivals',
      'Cooking competition events'
    ],
    potentialPartners: ['Family and consumer science teachers', 'Local restaurants', 'Cultural clubs'],
    successTips: [
      'Address dietary restrictions and allergies carefully',
      'Partner with cultural clubs for authentic recipes',
      'Focus on accessible, budget-friendly cooking'
    ],
    existsAtSchool: false,
    votes: 64,
    dateSubmitted: '2025-10-05'
  },
  {
    id: 'idea-7',
    name: 'Civic Engagement Corps',
    tagline: 'Democracy in Action',
    description: 'Engage students in local government, voting rights, civic participation, and community advocacy.',
    category: 'Leadership',
    targetAudience: ['Future politicians', 'Activists', 'Community-minded students'],
    estimatedInterest: 'Medium',
    startupCost: 'Free',
    difficultyToStart: 'Easy',
    suggestedActivities: [
      'Local government meeting attendance',
      'Voter registration drives (for 18+)',
      'Mock elections and debates',
      'Letter-writing campaigns',
      'Community issue research projects'
    ],
    potentialPartners: ['Social studies teachers', 'League of Women Voters', 'Local elected officials'],
    successTips: [
      'Stay non-partisan to be inclusive',
      'Focus on process and engagement, not specific policies',
      'Connect with real local issues students care about'
    ],
    existsAtSchool: false,
    votes: 29,
    dateSubmitted: '2025-09-28'
  },
  {
    id: 'idea-8',
    name: 'Sustainable Fashion Collective',
    tagline: 'Style with Purpose',
    description: 'Explore fashion through a sustainability lens. Upcycling, thrifting, ethical fashion, and creative expression meet environmental consciousness.',
    category: 'Arts',
    targetAudience: ['Fashion lovers', 'Environmentalists', 'Creative artists'],
    estimatedInterest: 'High',
    startupCost: 'Low ($0-50)',
    difficultyToStart: 'Easy',
    suggestedActivities: [
      'Clothing swap events',
      'Upcycling workshops',
      'Sustainable fashion show',
      'Industry documentary screenings',
      'Thrift store field trips'
    ],
    potentialPartners: ['Art department', 'Environmental club', 'Local thrift stores'],
    successTips: [
      'Focus on creativity, not expensive materials',
      'Partner with environmental club for shared mission',
      'Create inclusive events for all style preferences'
    ],
    existsAtSchool: false,
    votes: 51,
    dateSubmitted: '2025-11-08'
  }
];



export const competitions: Competition[] = [
  {
    id: 'comp-1',
    name: 'Technology Student Association (TSA) Nationals',
    organization: 'Technology Student Association',
    description: 'Comprehensive STEM competition with 60+ events including engineering, technology, and leadership challenges. State and national conferences.',
    category: 'STEM',
    eligibility: ['Current high school students', 'TSA chapter members'],
    registrationDeadline: '2026-03-15',
    competitionDates: 'June 25-29, 2026',
    location: 'Orlando, Florida',
    locationType: 'In-Person',
    entryFee: 'Varies by state - typically $75-150 per student',
    prizes: ['Trophies', 'Scholarships up to $5,000', 'Industry recognition'],
    websiteUrl: 'https://tsaweb.org',
    difficulty: 'Intermediate',
    teamSize: '1-6 depending on event',
    preparationResources: [
      { title: 'Official Competition Guidelines', type: 'Guide', url: 'https://tsaweb.org/competitions' },
      { title: 'Rubric Analysis Workshop', type: 'Video', url: '/resources/tsa-prep' },
      { title: 'Sample Projects Archive', type: 'Practice', url: '/resources/tsa-samples' }
    ],
    pastWinners: ['Robotics Team (2025 - 3rd Place VEX)'],
    schoolParticipationHistory: [
      { year: 2025, placement: '3rd Place VEX Robotics', participants: ['Alex Johnson', 'Sophie Lee'], highlights: 'First time qualifying for nationals' },
      { year: 2024, placement: 'State Qualifier', participants: ['Marcus Brown', 'Emma Wilson'] }
    ],
    isFeatured: true
  },
  {
    id: 'comp-2',
    name: 'FIRST Robotics Competition',
    organization: 'FIRST',
    description: 'Build an industrial-size robot to compete in an exciting field game. Learn real-world engineering skills while building a robot.',
    category: 'STEM',
    eligibility: ['High school students ages 14-18', 'Must be part of a registered team'],
    registrationDeadline: '2026-01-05',
    competitionDates: 'February-April 2026',
    location: 'Regional Events + Championships',
    locationType: 'In-Person',
    entryFee: '$6,000 team registration + build costs',
    prizes: ['Scholarships (over $80 million available)', 'Awards', 'Recognition'],
    websiteUrl: 'https://firstinspires.org',
    difficulty: 'Advanced',
    teamSize: '10-25 students recommended',
    preparationResources: [
      { title: 'Game Manual', type: 'Guide', url: 'https://firstinspires.org/resources' },
      { title: 'CAD Training Series', type: 'Video', url: '/resources/first-cad' },
      { title: 'Programming Tutorials', type: 'Practice', url: '/resources/first-code' }
    ],
    schoolParticipationHistory: [
      { year: 2025, placement: 'Regional Champions', participants: ['Robotics Team - 38 members'], highlights: 'Won Innovation Award' }
    ],
    isFeatured: true
  },
  {
    id: 'comp-3',
    name: 'Model United Nations (MUN) National Conference',
    organization: 'National High School Model UN',
    description: 'Simulate UN committees, debate international issues, and develop diplomacy, research, and public speaking skills.',
    category: 'Academic',
    eligibility: ['High school students', 'No experience required for many conferences'],
    registrationDeadline: '2026-02-01',
    competitionDates: 'March 12-15, 2026',
    location: 'New York City (United Nations)',
    locationType: 'In-Person',
    entryFee: '$125 per delegate',
    prizes: ['Best Delegate Awards', 'Outstanding Position Paper', 'Diplomacy Awards'],
    websiteUrl: 'https://nhsmun.nyc',
    difficulty: 'Beginner-Friendly',
    teamSize: 'Delegations of 10-30 typically',
    preparationResources: [
      { title: 'How to Write Position Papers', type: 'Guide', url: '/resources/mun-papers' },
      { title: 'Public Speaking for MUN', type: 'Video', url: '/resources/mun-speaking' },
      { title: 'Practice Debates', type: 'Practice', url: '/resources/mun-practice' }
    ],
    pastWinners: ['James Chen (Best Delegate 2025)', 'Maria Santos (Outstanding Delegate 2024)'],
    schoolParticipationHistory: [
      { year: 2025, placement: 'Best Delegation', participants: ['Model UN Team - 45 members'], highlights: '15 individual awards' }
    ],
    isFeatured: true
  },
  {
    id: 'comp-4',
    name: 'National History Day',
    organization: 'National History Day',
    description: 'Year-long academic program where students conduct original research on historical topics resulting in exhibits, papers, documentaries, websites, or performances.',
    category: 'Academic',
    eligibility: ['Students grades 6-12', 'Individual or group entries'],
    registrationDeadline: '2026-02-15',
    competitionDates: 'State: March-April, Nationals: June 2026',
    location: 'University of Maryland',
    locationType: 'In-Person',
    entryFee: 'Free at regional level',
    prizes: ['Scholarships', 'Cash awards up to $1,000', 'Recognition'],
    websiteUrl: 'https://nhd.org',
    difficulty: 'Intermediate',
    teamSize: '1-5 students',
    preparationResources: [
      { title: 'Research Guide', type: 'Guide', url: 'https://nhd.org/resources' },
      { title: 'Documentary Production Tips', type: 'Video', url: '/resources/nhd-video' }
    ],
    schoolParticipationHistory: [],
    isFeatured: false
  },
  {
    id: 'comp-5',
    name: 'DECA International Career Development Conference',
    organization: 'DECA Inc.',
    description: 'Business and marketing competition with events in principles, case studies, and professional presentations.',
    category: 'Academic',
    eligibility: ['DECA chapter members', 'State competition qualification required'],
    registrationDeadline: '2026-01-31',
    competitionDates: 'April 25-28, 2026',
    location: 'Atlanta, Georgia',
    locationType: 'In-Person',
    entryFee: '$175-200 per student',
    prizes: ['Trophies', 'Scholarship opportunities', 'Industry connections'],
    websiteUrl: 'https://deca.org',
    difficulty: 'Intermediate',
    teamSize: '1-3 depending on event',
    preparationResources: [
      { title: 'Event Guidelines', type: 'Guide', url: 'https://deca.org/compete' },
      { title: 'Role Play Practice', type: 'Practice', url: '/resources/deca-roleplay' }
    ],
    schoolParticipationHistory: [],
    isFeatured: false
  },
  {
    id: 'comp-6',
    name: 'Science Olympiad',
    organization: 'Science Olympiad',
    description: 'Team competition featuring 23 events covering biology, earth science, chemistry, physics, and engineering.',
    category: 'STEM',
    eligibility: ['High school students', 'Must be part of school team (15 members)'],
    registrationDeadline: '2025-11-15',
    competitionDates: 'Regional: January-February, State: March-April, Nationals: May 2026',
    location: 'Various + Ohio State University (Nationals)',
    locationType: 'In-Person',
    entryFee: 'Varies by region - typically $75 per team',
    prizes: ['Medals', 'Trophies', 'Scholarship opportunities'],
    websiteUrl: 'https://scioly.org',
    difficulty: 'Advanced',
    teamSize: '15 members per team',
    preparationResources: [
      { title: 'Event Descriptions', type: 'Guide', url: 'https://scioly.org/events' },
      { title: 'Practice Tests Archive', type: 'Practice', url: '/resources/scioly-tests' }
    ],
    schoolParticipationHistory: [],
    isFeatured: false
  },
  {
    id: 'comp-7',
    name: 'National Speech & Debate Tournament',
    organization: 'National Speech & Debate Association',
    description: 'The largest academic competition in the nation with events in debate, speech, and interpretation.',
    category: 'Academic',
    eligibility: ['NSDA members', 'Must qualify through district competition'],
    registrationDeadline: 'Through district qualification',
    competitionDates: 'June 14-19, 2026',
    location: 'Des Moines, Iowa',
    locationType: 'In-Person',
    entryFee: 'Included in district fees',
    prizes: ['Trophies', 'Scholarship opportunities ($200K+ awarded)'],
    websiteUrl: 'https://speechanddebate.org',
    difficulty: 'Elite',
    teamSize: '1-2 per event',
    preparationResources: [
      { title: 'Judge Training Videos', type: 'Video', url: 'https://speechanddebate.org/resources' },
      { title: 'Topic Analysis', type: 'Guide', url: '/resources/debate-topics' }
    ],
    pastWinners: ['Andrew Park (State Champion 2025)'],
    schoolParticipationHistory: [
      { year: 2025, placement: 'National Qualifier (4 students)', participants: ['Andrew Park', 'Rachel Green', 'others'] }
    ],
    isFeatured: false
  },
  {
    id: 'comp-8',
    name: 'Scholastic Art & Writing Awards',
    organization: 'Alliance for Young Artists & Writers',
    description: 'The nation\'s longest-running and most prestigious recognition program for creative teens.',
    category: 'Arts',
    eligibility: ['Students in grades 7-12', 'Individual work'],
    registrationDeadline: '2025-12-15',
    competitionDates: 'Regional: January-March, Nationals: May 2026',
    location: 'Judging online, ceremony in New York',
    locationType: 'Hybrid',
    entryFee: 'Free in most regions',
    prizes: ['Gold/Silver Keys', 'Scholarships up to $10,000', 'Publication opportunities'],
    websiteUrl: 'https://artandwriting.org',
    difficulty: 'Beginner-Friendly',
    teamSize: '1 (individual)',
    preparationResources: [
      { title: 'Submission Guidelines', type: 'Guide', url: 'https://artandwriting.org/guidelines' },
      { title: 'Past Winner Portfolios', type: 'Practice', url: '/resources/scholastic-examples' }
    ],
    schoolParticipationHistory: [],
    isFeatured: false
  }
];



export const mentors: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Dr. Marcus Williams',
    type: 'Alumni',
    title: 'Founder & CEO',
    organization: 'EdTech Innovations Inc.',
    bio: 'Former Model UN President (Class of 2015) who went on to study International Relations at Georgetown. Now runs an educational technology company and loves helping students develop leadership skills.',
    expertise: ['Public speaking', 'Entrepreneurship', 'College applications', 'Leadership development'],
    chaptersAdvised: ['Model United Nations', 'Debate Team'],
    availability: 'Available',
    contactMethod: 'Schedule Meeting',
    linkedIn: 'https://linkedin.com/in/example',
    testimonials: [
      { quote: 'Dr. Williams helped me completely transform my college application essays. His insights were invaluable!', author: 'James Chen', role: 'Model UN President', date: '2025-10-15' }
    ],
    sessionsCompleted: 47,
    rating: 4.9
  },
  {
    id: 'mentor-2',
    name: 'Sarah Kim',
    type: 'Alumni',
    title: 'Software Engineer',
    organization: 'Google',
    bio: 'Former Robotics Team member (Class of 2018). Studied Computer Science at MIT and now works on AI systems at Google. Passionate about helping students explore STEM careers.',
    expertise: ['Programming', 'Robotics', 'Tech careers', 'STEM competitions', 'College prep'],
    chaptersAdvised: ['Robotics Team'],
    availability: 'Limited',
    contactMethod: 'Email',
    email: 'example@email.com',
    testimonials: [
      { quote: 'Sarah\'s technical guidance helped our team win regionals. She understands both the competition and industry.', author: 'Alex Johnson', role: 'Robotics Captain', date: '2025-11-20' }
    ],
    sessionsCompleted: 23,
    rating: 4.8
  },
  {
    id: 'mentor-3',
    name: 'Ms. Jennifer Adams',
    type: 'Advisor',
    title: 'School Counselor',
    organization: 'Jefferson High School',
    bio: 'Faculty advisor to Community Service Club for 8 years. Expert in volunteer coordination, non-profit partnerships, and student leadership development.',
    expertise: ['Community service', 'Non-profit partnerships', 'Service learning', 'Student leadership'],
    chaptersAdvised: ['Community Service Club'],
    availability: 'Available',
    contactMethod: 'Platform Message',
    testimonials: [
      { quote: 'Ms. Adams goes above and beyond to connect students with meaningful service opportunities.', author: 'Isabella Martinez', role: 'Service Club President', date: '2025-09-10' }
    ],
    sessionsCompleted: 156,
    rating: 5.0
  },
  {
    id: 'mentor-4',
    name: 'David Chen',
    type: 'Community Partner',
    title: 'Executive Director',
    organization: 'Youth Leadership Foundation',
    bio: 'Leads local non-profit focused on youth development. Has worked with dozens of school clubs on community impact projects and leadership training.',
    expertise: ['Grant writing', 'Community organizing', 'Fundraising', 'Project management'],
    chaptersAdvised: [],
    availability: 'Available',
    contactMethod: 'Email',
    email: 'david@example.org',
    testimonials: [
      { quote: 'David helped us secure our first community grant. His guidance was incredibly practical.', author: 'Sierra Woods', role: 'Environmental Club', date: '2025-08-22' }
    ],
    sessionsCompleted: 34,
    rating: 4.7
  },
  {
    id: 'mentor-5',
    name: 'Rachel Torres',
    type: 'Current Officer',
    title: 'Student Body President',
    organization: 'Jefferson High School',
    bio: 'Current senior and student body president. Experienced in club leadership, school governance, and getting things done. Here to help new officers navigate the system.',
    expertise: ['Student government', 'Club management', 'School policies', 'Event planning'],
    chaptersAdvised: ['Student Council', 'Key Club'],
    availability: 'Available',
    contactMethod: 'Platform Message',
    testimonials: [
      { quote: 'Rachel helped me understand how to work with administration effectively. Game changer!', author: 'Anonymous Officer', role: 'Junior Officer', date: '2025-12-01' }
    ],
    sessionsCompleted: 18,
    rating: 4.9
  },
  {
    id: 'mentor-6',
    name: 'Prof. Robert Hayes',
    type: 'Advisor',
    title: 'Engineering Teacher',
    organization: 'Jefferson High School',
    bio: 'Faculty advisor to Robotics Team. Former aerospace engineer with 20 years industry experience before teaching. Expert in engineering design and competition strategy.',
    expertise: ['Engineering design', 'Robotics', 'STEM competitions', 'Career guidance'],
    chaptersAdvised: ['Robotics Team'],
    availability: 'Limited',
    contactMethod: 'Schedule Meeting',
    testimonials: [
      { quote: 'Mr. Hayes brings real-world engineering experience to everything. The best advisor a team could have.', author: 'Sophie Lee', role: 'Build Lead', date: '2025-10-05' }
    ],
    sessionsCompleted: 89,
    rating: 4.9
  }
];



export const collaborationOpportunities: CollaborationOpportunity[] = [
  {
    id: 'collab-1',
    title: 'Spring Community Service Day',
    description: 'Planning a large-scale community service event and looking for partner clubs to expand impact. Multiple service sites throughout the community.',
    hostChapterId: 'community-service',
    hostChapterName: 'Community Service Club',
    type: 'Community Service',
    category: ['Service'],
    targetChapters: ['Any'],
    requirements: ['Minimum 10 volunteers per club', 'Saturday availability'],
    benefits: ['Service hours for all participants', 'Community recognition', 'Joint media coverage'],
    proposedDate: '2026-04-18',
    deadline: '2026-03-15',
    maxParticipants: 5,
    currentInterest: 3,
    status: 'Open',
    interestedChapters: [
      { chapterId: 'environmental-club', chapterName: 'Environmental Action Club', dateExpressed: '2026-01-08' },
      { chapterId: 'cultural-club', chapterName: 'Multicultural Student Alliance', dateExpressed: '2026-01-10' }
    ],
    datePosted: '2026-01-05'
  },
  {
    id: 'collab-2',
    title: 'STEM + Arts: Interdisciplinary Exhibition',
    description: 'Creating an exhibition that combines technology, engineering, and artistic expression. Seeking creative clubs to partner on unique displays.',
    hostChapterId: 'robotics',
    hostChapterName: 'Robotics Team',
    type: 'Joint Event',
    category: ['STEM', 'Arts'],
    targetChapters: ['Drama Club', 'Art Club', 'Music groups'],
    requirements: ['Creative project proposals', 'Commitment to monthly planning meetings'],
    benefits: ['Showcase space', 'Technical support', 'Media coverage'],
    proposedDate: '2026-05-10',
    deadline: '2026-02-28',
    maxParticipants: 4,
    currentInterest: 2,
    status: 'Open',
    interestedChapters: [
      { chapterId: 'drama-club', chapterName: 'Drama Club & Theater Society', dateExpressed: '2026-01-12' }
    ],
    datePosted: '2026-01-10'
  },
  {
    id: 'collab-3',
    title: 'Debate-MUN Invitational Planning',
    description: 'Hosting our first combined debate and MUN invitational. Need help with logistics, judging, and event management.',
    hostChapterId: 'model-un',
    hostChapterName: 'Model United Nations',
    type: 'Competition Team',
    category: ['Academic'],
    targetChapters: ['Debate Team', 'Student Council'],
    requirements: ['10+ volunteers for event day', 'Experience with competition formats'],
    benefits: ['Leadership experience', 'Competition organization skills', 'Networking'],
    proposedDate: '2026-03-21',
    deadline: '2026-02-01',
    currentInterest: 1,
    status: 'Open',
    interestedChapters: [
      { chapterId: 'debate-team', chapterName: 'Debate Team', dateExpressed: '2026-01-14' }
    ],
    datePosted: '2026-01-08'
  },
  {
    id: 'collab-4',
    title: 'Cultural Food Festival Fundraiser',
    description: 'Annual multicultural food festival to celebrate diversity and raise funds for all participating clubs.',
    hostChapterId: 'cultural-club',
    hostChapterName: 'Multicultural Student Alliance',
    type: 'Fundraiser',
    category: ['Cultural', 'Service'],
    targetChapters: ['All cultural and service clubs'],
    requirements: ['Authentic food contributions', 'Cultural presentation/booth'],
    benefits: ['Share of fundraising proceeds', 'Cultural representation', 'Community building'],
    proposedDate: '2026-05-01',
    deadline: '2026-04-01',
    maxParticipants: 10,
    currentInterest: 6,
    status: 'Open',
    interestedChapters: [],
    datePosted: '2026-01-02'
  }
];



export const successStories: SuccessStory[] = [
  {
    id: 'story-1',
    title: 'From Shy Freshman to National Champion',
    summary: 'How joining Model UN transformed my high school experience and led to unexpected opportunities.',
    fullStory: `When I walked into my first Model UN meeting as a freshman, I couldn't speak in front of more than three people without freezing. The idea of debating international policy in front of hundreds seemed impossible.

But something about the club kept me coming back. The upperclassmen were welcoming, and the topics fascinated me. I started small - taking notes, doing research, eventually speaking in smaller practice sessions.

By sophomore year, I attended my first conference. I didn't win anything, but I survived. More importantly, I wanted to do it again.

Junior year everything clicked. Hours of practice, countless position papers, and the support of my teammates paid off. I won my first Best Delegate award at a regional conference.

This year, as president, I led our delegation to nationals where we won Best Large Delegation. But the real victory isn't the trophy - it's who I've become. I'm applying to study International Relations at Georgetown, and I can trace every bit of my confidence back to that nervous freshman who almost didn't show up to the second meeting.

My advice? Start. Just start. The growth will come.`,
    chapterId: 'model-un',
    chapterName: 'Model United Nations',
    authorName: 'James Chen',
    authorRole: 'President',
    authorGrade: '12',
    category: 'Personal Growth',
    tags: ['Leadership', 'Public Speaking', 'Competition'],
    impactMetrics: [
      { label: 'Conferences Attended', value: '24' },
      { label: 'Individual Awards', value: '12' },
      { label: 'Team Awards', value: '8' }
    ],
    featured: true,
    likes: 234,
    shares: 45,
    datePublished: '2026-01-08'
  },
  {
    id: 'story-2',
    title: 'Building More Than Robots',
    summary: 'Our robotics team\'s journey from regional competitors to world championship qualifiers - and the lessons we learned along the way.',
    fullStory: `Three years ago, our robotics team was struggling. We had passionate members but couldn't seem to break through at competitions. We'd build great robots that would fail when it mattered most.

The turning point came when we stopped focusing only on the robot. We realized we were trying to compete like an engineering team, but we needed to operate like a company.

We restructured into sub-teams: mechanical, electrical, programming, business, and outreach. Each team had clear responsibilities and leadership. We started documenting everything, creating training materials, and building processes.

The change was dramatic. Our build quality improved because we had checklists. Our programming got better because we could test while the robot was being built. Our interviews impressed judges because we had a real story to tell.

Last season, we didn't just qualify for the world championship - we won the Innovation Award for our design approach. But the real innovation was in how we worked together.

The students who graduated from our program aren't just good engineers - they're effective collaborators, communicators, and leaders. That's the real build.`,
    chapterId: 'robotics',
    chapterName: 'Robotics Team',
    authorName: 'Alex Johnson',
    authorRole: 'Team Captain',
    authorGrade: '12',
    category: 'Club Turnaround',
    tags: ['STEM', 'Teamwork', 'Competition', 'Leadership'],
    impactMetrics: [
      { label: 'World Championship Qualifications', value: '3 years' },
      { label: 'Awards Won', value: '15' },
      { label: 'Scholarships Earned', value: '$45,000' }
    ],
    featured: true,
    likes: 189,
    shares: 67,
    datePublished: '2025-12-20'
  },
  {
    id: 'story-3',
    title: '5,000 Hours of Impact',
    summary: 'How our community service club went from a small group to a force for change in our community.',
    fullStory: `When I joined the Community Service Club as a sophomore, we had about 20 members and organized maybe one event per month. Nice, but not exactly world-changing.

I saw an opportunity to do more. Not just more events, but more meaningful connections. We weren't just looking for service hours - we were looking for real partnerships.

The first thing I did as president was reach out to local non-profits to understand their actual needs. It turned out they didn't need one-day volunteers as much as they needed consistent, skilled support.

We created specialized service teams: tutoring, senior companionship, environmental, and food security. Each team built relationships with specific community partners and committed to regular service.

The results speak for themselves: this year we logged over 5,000 volunteer hours across 72 members. But more importantly, our partners tell us they can count on us. The students at the elementary school we tutor have improved their reading levels. The seniors at the care home ask for us by name.

Service isn't about checking a box. It's about showing up, again and again, for your community.`,
    chapterId: 'community-service',
    chapterName: 'Community Service Club',
    authorName: 'Isabella Martinez',
    authorRole: 'President',
    authorGrade: '12',
    category: 'Community Impact',
    tags: ['Service', 'Leadership', 'Community'],
    impactMetrics: [
      { label: 'Volunteer Hours', value: '5,000+' },
      { label: 'Community Partners', value: '12' },
      { label: 'Students Tutored', value: '85' }
    ],
    featured: true,
    likes: 312,
    shares: 89,
    datePublished: '2025-11-28'
  },
  {
    id: 'story-4',
    title: 'Starting a Club Saved My High School Experience',
    summary: 'When I couldn\'t find a club that fit, I created one - and found my people.',
    fullStory: `I spent freshman year feeling like I didn't belong. I tried a few clubs but nothing clicked. I was interested in podcasting and audio production, but there was no club for that.

Second semester, I decided to change that. With the help of my English teacher as advisor, I started the Podcast Production Club with just five friends.

Starting a club is hard. Nobody shows up to your first interest meeting. You have to beg for a meeting room. But we kept at it.

We started releasing episodes about school life, and slowly people started listening. Then they started joining. By junior year, we had 25 members and three active shows.

But the best part isn't the content - it's the community. The Podcast Club is where I found my best friends. It's where I discovered my passion for storytelling. It's where I learned that if something doesn't exist, you can create it.

Now we're the most listened-to student media at school, and I'm applying to communications programs at college. All because I couldn't find a club that fit.`,
    chapterName: 'Podcast Production Club',
    authorName: 'Maya Rodriguez',
    authorRole: 'Founder & President',
    authorGrade: '12',
    category: 'Leadership Journey',
    tags: ['Starting a Club', 'Media', 'Finding Community'],
    impactMetrics: [
      { label: 'Episodes Produced', value: '75+' },
      { label: 'Monthly Listeners', value: '2,000' },
      { label: 'Members Grown', value: '5 to 25' }
    ],
    featured: false,
    likes: 156,
    shares: 34,
    datePublished: '2025-12-05'
  },
  {
    id: 'story-5',
    title: 'Debate Taught Me to Listen',
    summary: 'Competitive debate isn\'t just about winning arguments - it\'s about understanding perspectives.',
    fullStory: `I joined debate because I liked to argue. I thought I was good at it because I was loud and confident. I learned I was wrong.

My first tournament was humbling. I made passionate arguments, but I kept losing. My coach gave me feedback I'll never forget: "You're good at talking. You need to learn to listen."

In debate, you have to argue both sides of every issue. At first, I hated arguing positions I disagreed with. But something changed. Understanding the other side didn't weaken my own views - it made my arguments stronger and more nuanced.

Now, three years later, I've won state championships in two events. But more importantly, I approach every conversation differently. When someone disagrees with me, I'm genuinely curious about why. I look for the kernel of truth in opposing views.

This skill has helped me everywhere - in college interviews, in family discussions, in friendships. Debate didn't just teach me to argue. It taught me to understand.`,
    chapterId: 'debate-team',
    chapterName: 'Debate Team',
    authorName: 'Andrew Park',
    authorRole: 'Captain',
    authorGrade: '12',
    category: 'Personal Growth',
    tags: ['Debate', 'Communication', 'Personal Development'],
    impactMetrics: [
      { label: 'State Championships', value: '2' },
      { label: 'Tournament Rounds Won', value: '200+' },
      { label: 'Topics Researched', value: '15+' }
    ],
    featured: false,
    likes: 178,
    shares: 41,
    datePublished: '2025-11-15'
  },
  {
    id: 'story-6',
    title: 'From Member to Mentor: The Environmental Club Story',
    summary: 'How our environmental initiatives created lasting change and inspired the next generation.',
    fullStory: `When I joined Environmental Action Club, our school recycling rate was under 20%. The campus was littered with single-use plastics. Most students didn't think about environmental issues at all.

We set ambitious goals: double the recycling rate, eliminate unnecessary single-use plastics, and engage 500 students in environmental action. Everyone said we were dreaming.

It took three years of consistent work. We conducted waste audits. We met with administration about water fountains. We organized campus clean-ups. We ran awareness campaigns. We planted trees.

This year, our recycling rate hit 60%. The school installed water bottle filling stations throughout campus. We planted our 200th tree. And over 400 students participated in our Earth Week activities.

But the accomplishment I'm most proud of? The underclassmen leading our club are even more passionate and effective than we were. They're already planning initiatives we never imagined. The movement will continue long after I graduate.

That's what real impact looks like - not just what you do, but what you enable others to do.`,
    chapterId: 'environmental-club',
    chapterName: 'Environmental Action Club',
    authorName: 'Sierra Woods',
    authorRole: 'President',
    authorGrade: '12',
    category: 'Community Impact',
    tags: ['Environment', 'Sustainability', 'School Change'],
    impactMetrics: [
      { label: 'Recycling Rate Increase', value: '20% to 60%' },
      { label: 'Trees Planted', value: '200' },
      { label: 'Students Engaged', value: '400+' }
    ],
    featured: false,
    likes: 267,
    shares: 78,
    datePublished: '2025-10-22'
  }
];



export const achievements: Achievement[] = [
  {
    id: 'ach-1',
    name: 'First Steps',
    description: 'Join your first club',
    icon: '🎓',
    category: 'Participation',
    points: 10,
    rarity: 'Common',
    requirements: ['Sign up for one club'],
    unlockedBy: 85
  },
  {
    id: 'ach-2',
    name: 'Well Rounded',
    description: 'Join clubs in 3 different categories',
    icon: '🌈',
    category: 'Participation',
    points: 50,
    rarity: 'Uncommon',
    requirements: ['Be member of 3+ clubs', 'Clubs must be in different categories'],
    unlockedBy: 23
  },
  {
    id: 'ach-3',
    name: 'Rising Leader',
    description: 'Hold your first officer position',
    icon: '⭐',
    category: 'Leadership',
    points: 100,
    rarity: 'Uncommon',
    requirements: ['Elected or appointed to officer role'],
    unlockedBy: 15
  },
  {
    id: 'ach-4',
    name: 'Event Organizer',
    description: 'Help plan and execute a club event',
    icon: '📅',
    category: 'Events',
    points: 75,
    rarity: 'Uncommon',
    requirements: ['Be part of event planning committee', 'Event successfully completed'],
    unlockedBy: 28
  },
  {
    id: 'ach-5',
    name: 'Giving Back',
    description: 'Complete 20 hours of community service',
    icon: '💝',
    category: 'Service',
    points: 100,
    rarity: 'Uncommon',
    requirements: ['Log 20+ verified service hours'],
    unlockedBy: 31
  },
  {
    id: 'ach-6',
    name: 'Competitor',
    description: 'Participate in your first competition',
    icon: '🏅',
    category: 'Competitions',
    points: 75,
    rarity: 'Uncommon',
    requirements: ['Represent school at any competition'],
    unlockedBy: 18
  },
  {
    id: 'ach-7',
    name: 'Podium Finish',
    description: 'Place in top 3 at a competition',
    icon: '🏆',
    category: 'Competitions',
    points: 200,
    rarity: 'Rare',
    requirements: ['Win 1st, 2nd, or 3rd place at official competition'],
    unlockedBy: 7
  },
  {
    id: 'ach-8',
    name: 'Mentor',
    description: 'Mentor a newer member for a full semester',
    icon: '🤝',
    category: 'Mentorship',
    points: 150,
    rarity: 'Rare',
    requirements: ['Be assigned mentee', 'Complete semester of mentorship', 'Mentee positive feedback'],
    unlockedBy: 8
  },
  {
    id: 'ach-9',
    name: 'Service Champion',
    description: 'Complete 100 hours of community service',
    icon: '🌟',
    category: 'Service',
    points: 300,
    rarity: 'Rare',
    requirements: ['Log 100+ verified service hours'],
    unlockedBy: 5
  },
  {
    id: 'ach-10',
    name: 'Founder',
    description: 'Start a new club at school',
    icon: '🚀',
    category: 'Leadership',
    points: 500,
    rarity: 'Epic',
    requirements: ['Submit approved club proposal', 'Club officially recognized', 'Lead club for at least one semester'],
    unlockedBy: 2
  },
  {
    id: 'ach-11',
    name: 'National Competitor',
    description: 'Qualify for and compete at a national competition',
    icon: '🎯',
    category: 'Competitions',
    points: 400,
    rarity: 'Epic',
    requirements: ['Qualify through local/state competition', 'Compete at national level'],
    unlockedBy: 3
  },
  {
    id: 'ach-12',
    name: 'Legend',
    description: 'Make lasting impact that continues after graduation',
    icon: '👑',
    category: 'Leadership',
    points: 1000,
    rarity: 'Legendary',
    requirements: ['Create lasting program or initiative', 'Recognized by administration', 'Continued by future members'],
    unlockedBy: 1
  }
];



export const clubFinderQuiz: ClubFinderQuiz[] = [
  {
    id: 'q1',
    question: 'What gets you most excited?',
    questionType: 'single',
    options: [
      { id: 'q1a', text: 'Solving complex problems and building things', categoryScores: [{ category: 'STEM', score: 3 }, { category: 'Academic', score: 1 }] },
      { id: 'q1b', text: 'Expressing myself creatively', categoryScores: [{ category: 'Arts', score: 3 }, { category: 'Media', score: 2 }] },
      { id: 'q1c', text: 'Making a difference in my community', categoryScores: [{ category: 'Service', score: 3 }, { category: 'Leadership', score: 1 }] },
      { id: 'q1d', text: 'Debating ideas and learning about the world', categoryScores: [{ category: 'Academic', score: 3 }, { category: 'Cultural', score: 1 }] },
      { id: 'q1e', text: 'Competition and pushing my limits', categoryScores: [{ category: 'Sports', score: 3 }, { category: 'STEM', score: 1 }] }
    ],
    weight: 2
  },
  {
    id: 'q2',
    question: 'How much time can you commit per week?',
    questionType: 'single',
    options: [
      { id: 'q2a', text: '1-2 hours (casual involvement)', categoryScores: [{ category: 'Cultural', score: 2 }, { category: 'Service', score: 1 }] },
      { id: 'q2b', text: '3-5 hours (regular member)', categoryScores: [{ category: 'Academic', score: 2 }, { category: 'Arts', score: 2 }] },
      { id: 'q2c', text: '6-10 hours (dedicated member)', categoryScores: [{ category: 'STEM', score: 2 }, { category: 'Media', score: 2 }] },
      { id: 'q2d', text: '10+ hours (highly committed)', categoryScores: [{ category: 'Sports', score: 3 }, { category: 'STEM', score: 2 }] }
    ],
    weight: 1
  },
  {
    id: 'q3',
    question: 'What environment do you thrive in?',
    questionType: 'single',
    options: [
      { id: 'q3a', text: 'Collaborative team settings', categoryScores: [{ category: 'STEM', score: 2 }, { category: 'Service', score: 2 }, { category: 'Sports', score: 2 }] },
      { id: 'q3b', text: 'Independent work with group feedback', categoryScores: [{ category: 'Arts', score: 2 }, { category: 'Academic', score: 2 }] },
      { id: 'q3c', text: 'Mix of both', categoryScores: [{ category: 'Media', score: 2 }, { category: 'Leadership', score: 2 }, { category: 'Cultural', score: 2 }] }
    ],
    weight: 1
  },
  {
    id: 'q4',
    question: 'What do you want to get out of clubs? (Select all that apply)',
    questionType: 'multiple',
    options: [
      { id: 'q4a', text: 'Learn new skills', categoryScores: [{ category: 'STEM', score: 1 }, { category: 'Arts', score: 1 }, { category: 'Academic', score: 1 }] },
      { id: 'q4b', text: 'Make friends with similar interests', categoryScores: [{ category: 'Cultural', score: 1 }, { category: 'Sports', score: 1 }] },
      { id: 'q4c', text: 'Build my college application', categoryScores: [{ category: 'Academic', score: 2 }, { category: 'Leadership', score: 2 }] },
      { id: 'q4d', text: 'Compete and win', categoryScores: [{ category: 'Sports', score: 2 }, { category: 'Academic', score: 1 }, { category: 'STEM', score: 1 }] },
      { id: 'q4e', text: 'Help others', categoryScores: [{ category: 'Service', score: 2 }] },
      { id: 'q4f', text: 'Express myself', categoryScores: [{ category: 'Arts', score: 2 }, { category: 'Media', score: 2 }] }
    ],
    weight: 2
  },
  {
    id: 'q5',
    question: 'Which subjects interest you most?',
    questionType: 'multiple',
    options: [
      { id: 'q5a', text: 'Science & Technology', categoryScores: [{ category: 'STEM', score: 3 }] },
      { id: 'q5b', text: 'Arts & Music', categoryScores: [{ category: 'Arts', score: 3 }] },
      { id: 'q5c', text: 'Social Studies & History', categoryScores: [{ category: 'Academic', score: 2 }, { category: 'Cultural', score: 1 }] },
      { id: 'q5d', text: 'English & Communication', categoryScores: [{ category: 'Media', score: 2 }, { category: 'Academic', score: 1 }] },
      { id: 'q5e', text: 'Business & Leadership', categoryScores: [{ category: 'Leadership', score: 3 }] },
      { id: 'q5f', text: 'Physical Education & Athletics', categoryScores: [{ category: 'Sports', score: 3 }] }
    ],
    weight: 1.5
  }
];



export const calendarEvents: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Club Fair',
    description: 'Annual club fair - all clubs showcase and recruit new members',
    startDate: '2026-01-25T11:00:00',
    endDate: '2026-01-25T14:00:00',
    location: 'Main Gymnasium',
    eventType: 'Event',
    isRecurring: false,
    reminders: [{ time: '1 day before', method: 'Email' }],
    color: '#b8860b'
  },
  {
    id: 'cal-2',
    title: 'Spring Budget Requests Due',
    description: 'Deadline for clubs to submit spring semester budget requests',
    startDate: '2026-01-31T23:59:00',
    endDate: '2026-01-31T23:59:00',
    location: 'Activities Office',
    eventType: 'Deadline',
    isRecurring: false,
    reminders: [{ time: '1 week before', method: 'Email' }, { time: '1 day before', method: 'Email' }],
    color: '#8b0000'
  },
  {
    id: 'cal-3',
    title: 'TSA State Conference',
    description: 'State-level TSA competition',
    startDate: '2026-03-20T08:00:00',
    endDate: '2026-03-22T16:00:00',
    location: 'State Convention Center',
    chapterName: 'Robotics Team, TSA',
    eventType: 'Competition',
    isRecurring: false,
    reminders: [{ time: '1 month before', method: 'Email' }],
    color: '#1e3a5f'
  }
];



export const clubHealthMetrics: ClubHealthMetrics[] = [
  {
    chapterId: 'model-un',
    clubId: 'model-un',
    clubName: 'Model United Nations',
    overallScore: 92,
    metrics: {
      memberEngagement: 95,
      eventFrequency: 90,
      memberRetention: 88,
      leadershipDevelopment: 94,
      communityImpact: 85,
      financialHealth: 98
    },
    memberRetention: 88,
    eventAttendance: 82,
    memberSatisfaction: 8.5,
    leadershipDevelopment: 94,
    communityImpact: 85,
    financialHealth: 98,
    growthRate: 12,
    engagementScore: 87,
    totalMembers: 45,
    activeMembers: 38,
    eventsThisMonth: 5,
    newMembersLast30Days: 8,
    trends: [
      { metric: 'memberEngagement', direction: 'up', change: 5 },
      { metric: 'memberRetention', direction: 'up', change: 8 }
    ],
    recommendations: [
      'Consider creating more community outreach programs',
      'Document leadership training for future officers'
    ],
    lastUpdated: '2026-01-10'
  },
  {
    chapterId: 'robotics',
    clubId: 'robotics',
    clubName: 'Robotics Team',
    overallScore: 88,
    metrics: {
      memberEngagement: 92,
      eventFrequency: 85,
      memberRetention: 82,
      leadershipDevelopment: 90,
      communityImpact: 88,
      financialHealth: 91
    },
    memberRetention: 82,
    eventAttendance: 78,
    memberSatisfaction: 8.2,
    leadershipDevelopment: 90,
    communityImpact: 88,
    financialHealth: 91,
    growthRate: 8,
    engagementScore: 84,
    totalMembers: 32,
    activeMembers: 28,
    eventsThisMonth: 4,
    newMembersLast30Days: 5,
    trends: [
      { metric: 'memberRetention', direction: 'down', change: 3 },
      { metric: 'communityImpact', direction: 'up', change: 10 }
    ],
    recommendations: [
      'Focus on freshman/sophomore engagement and mentorship',
      'Create more opportunities for non-competition involvement'
    ],
    lastUpdated: '2026-01-10'
  }
];



export const clubBenchmarks: ClubBenchmark[] = [
  { category: 'Academic', averageMembers: 35, averageEventsPerMonth: 4, averageRetentionRate: 78, topPerformers: ['Model United Nations', 'Debate Team'] },
  { category: 'STEM', averageMembers: 32, averageEventsPerMonth: 3, averageRetentionRate: 75, topPerformers: ['Robotics Team'] },
  { category: 'Service', averageMembers: 55, averageEventsPerMonth: 6, averageRetentionRate: 82, topPerformers: ['Community Service Club'] },
  { category: 'Arts', averageMembers: 40, averageEventsPerMonth: 4, averageRetentionRate: 80, topPerformers: ['Drama Club'] },
  { category: 'Cultural', averageMembers: 48, averageEventsPerMonth: 3, averageRetentionRate: 85, topPerformers: ['Multicultural Student Alliance'] }
];



export const resourceRequests: ResourceRequest[] = [
  {
    id: 'req-1',
    title: 'Virtual Meeting Best Practices Guide',
    description: 'Need a guide for running effective hybrid/virtual club meetings for members who can\'t attend in person.',
    category: 'Guides',
    requestType: 'New Resource',
    urgency: 'Medium',
    requesterName: 'Anonymous',
    requesterEmail: 'anonymous@school.edu',
    chapterName: 'Drama Club',
    status: 'Under Review',
    dateSubmitted: '2026-01-05',
    upvotes: 23,
    upvoters: []
  },
  {
    id: 'req-2',
    title: 'Updated Budget Template with Categories',
    description: 'The current budget template is too basic. Would like one with pre-set categories and formulas for tracking.',
    category: 'Templates',
    requestType: 'Update Existing',
    urgency: 'Low',
    requesterName: 'Anonymous',
    requesterEmail: 'anonymous@school.edu',
    status: 'Submitted',
    dateSubmitted: '2026-01-08',
    upvotes: 15,
    upvoters: []
  }
];



export const hubStats = {
  totalGuides: starterGuides.length,
  totalIdeas: clubIdeas.length,
  totalCompetitions: competitions.length,
  totalMentors: mentors.length,
  totalSuccessStories: successStories.length,
  totalCollaborations: collaborationOpportunities.filter(c => c.status === 'Open').length,
  totalAchievements: achievements.length,
  communityMembers: 1283,
  resourcesDownloaded: 4521,
  mentorshipSessionsCompleted: 367,
  collaborationsFormed: 28
};
