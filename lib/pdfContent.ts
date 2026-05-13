export interface PdfSection {
  title: string;
  items: string[];
}

export interface PdfContent {
  subtitle: string;
  sections: PdfSection[];
}

export const PDF_CONTENT: Record<string, PdfContent> = {
  "ig-1": {
    subtitle: "A complete step-by-step guide for students launching a new school club.",
    sections: [
      {
        title: "Step 1 — Validate Your Idea",
        items: [
          "Survey at least 10 students to gauge real interest in your club topic",
          "Search the school directory to confirm no identical club already exists",
          "Define your club's unique purpose and what gap it fills in the school",
          "Write a one-paragraph elevator pitch explaining the club's value",
          "Recruit 5 founding members committed to attending the first 3 meetings",
        ],
      },
      {
        title: "Step 2 — Find a Faculty Advisor",
        items: [
          "Identify 2–3 teachers or staff who share your club's area of interest",
          "Schedule a 10-minute meeting to present your club concept clearly",
          "Clarify the advisor's expected time commitment (typically 1–2 hrs/week)",
          "Confirm the advisor will sign the official advisor agreement form",
          "Backup plan: approach the assistant principal if no teacher volunteers",
        ],
      },
      {
        title: "Step 3 — Draft Your Club Constitution",
        items: [
          "Article I: Club name and mission statement (2–3 sentences)",
          "Article II: Membership eligibility and enrollment process",
          "Article III: Officer positions and their responsibilities",
          "Article IV: Meeting frequency, day, time, and location",
          "Article V: How the constitution can be amended in the future",
          "Have your advisor review and approve before submission",
        ],
      },
      {
        title: "Step 4 — Complete School Approval",
        items: [
          "Obtain the club registration packet from the main office or school website",
          "Attach your signed constitution, advisor agreement, and member roster",
          "Submit all documents to the Activities Director or Student Government",
          "Expect the review process to take 2–4 weeks",
          "Follow up professionally if you haven't heard back after 2 weeks",
          "Once approved, request an official meeting room assignment",
        ],
      },
      {
        title: "Step 5 — Launch Your Club",
        items: [
          "Announce your club via school announcements, social media, and flyers",
          "Hold your kickoff meeting with an icebreaker and a clear agenda",
          "Set up a group communication channel (Discord, Remind, or Google Chat)",
          "Establish a regular meeting schedule and publish it publicly",
          "Set 3 goals for your first semester and share them with all members",
        ],
      },
      {
        title: "Common Mistakes to Avoid",
        items: [
          "Not getting the advisor's commitment in writing before submitting paperwork",
          "Skipping the constitution — it is always required for approval",
          "Naming your club too similarly to an existing one",
          "Underestimating the approval timeline — plan 4–6 weeks ahead",
          "Failing to publicize the club after approval — active recruitment is essential",
        ],
      },
    ],
  },

  "ig-2": {
    subtitle: "Write a constitution that passes school approval on the first submission.",
    sections: [
      {
        title: "How to Use This Template",
        items: [
          "Replace all bracketed placeholders with your club's specific information",
          "Have at least 5 founding members review and sign the final document",
          "Your faculty advisor must sign before you submit to administration",
          "Keep a copy of the approved constitution in a shared club folder",
          "Review and update annually or whenever major changes occur",
        ],
      },
      {
        title: "Article I — Name and Mission",
        items: [
          "Official Name: [Full Club Name] at [School Name]",
          "Mission Statement: [2–3 sentences describing purpose and goals]",
          "Affiliation: State any national/regional organization affiliation if applicable",
          "School Year: Constitution effective as of [Month, Year]",
        ],
      },
      {
        title: "Article II — Membership",
        items: [
          "Eligibility: Open to all students in grades [X–X] at [School Name]",
          "Enrollment: Members must complete the membership form each school year",
          "Good Standing: Attend at least [X]% of meetings and follow club norms",
          "Removal: Members may be removed by a majority officer vote after 2 warnings",
        ],
      },
      {
        title: "Article III — Officers and Elections",
        items: [
          "Positions: President, Vice President, Secretary, Treasurer, [optional roles]",
          "Eligibility: Candidates must be members in good standing for at least 1 semester",
          "Nomination: Open nomination period of [5] school days before election",
          "Voting: Secret ballot vote; simple majority wins; advisor oversees process",
          "Term: Officers serve for [1 academic year]; may run for re-election once",
        ],
      },
      {
        title: "Article IV — Meetings and Quorum",
        items: [
          "Regular Meetings: [Day of week], [Time], [Room/Location]",
          "Frequency: [Weekly / Biweekly / Monthly] during the school year",
          "Quorum: A minimum of [X] members must be present to conduct business",
          "Special Meetings: May be called by the President with 48-hour notice",
          "Meeting minutes must be recorded by the Secretary at every session",
        ],
      },
      {
        title: "Article V — Amendments",
        items: [
          "Proposals: Any member may propose an amendment in writing",
          "Notice: Amendment text must be distributed 1 week before the vote",
          "Ratification: Requires a 2/3 majority vote of members present",
          "Administration: Amended constitution must be resubmitted to school administration",
          "Effective Date: Amendment takes effect immediately upon admin approval",
        ],
      },
    ],
  },

  "ig-3": {
    subtitle: "Checklist for advisor confirmation and school policy alignment.",
    sections: [
      {
        title: "Pre-Confirmation Checklist",
        items: [
          "Identified a willing faculty or staff member to serve as advisor",
          "Shared the club's mission, goals, and meeting schedule with the advisor",
          "Confirmed the advisor understands the time commitment involved",
          "Obtained the advisor's signature on the official Advisor Agreement Form",
          "Verified the advisor has no scheduling conflicts with the meeting time",
        ],
      },
      {
        title: "Advisor Role and Responsibilities",
        items: [
          "Attend all regular club meetings or arrange a substitute when absent",
          "Review and co-sign all financial transactions and purchase requests",
          "Ensure club activities comply with school policies and safety guidelines",
          "Serve as a liaison between the club and school administration",
          "Provide guidance on conflict resolution within the club",
          "Submit the annual advisor renewal form at the start of each school year",
        ],
      },
      {
        title: "Required Documentation",
        items: [
          "Signed Advisor Agreement Form (available from Activities Office)",
          "Copy of the club constitution with advisor signature on the last page",
          "Advisor's current school employee ID and department",
          "Emergency contact information for the advisor",
          "Acknowledgment of the school's student activity policies",
        ],
      },
      {
        title: "School Policy Alignment",
        items: [
          "Club mission does not conflict with school's non-discrimination policy",
          "Meeting location is a school-approved space during supervised hours",
          "All planned activities follow the school's event approval process",
          "The club has no fee requirements that exclude students due to cost",
          "Social media and communications follow the school's digital citizenship policy",
        ],
      },
    ],
  },

  "ig-4": {
    subtitle: "Submission sequence, review expectations, and what happens after approval.",
    sections: [
      {
        title: "Required Documents Checklist",
        items: [
          "Club registration form (obtained from Activities Director or school website)",
          "Club constitution signed by all founding officers and the faculty advisor",
          "Faculty advisor agreement form with advisor's signature",
          "Founding member roster (minimum 5 students with grade levels)",
          "Proposed meeting schedule and location",
          "Optional: club logo, social media handles, or mission poster",
        ],
      },
      {
        title: "Submission Sequence",
        items: [
          "Step 1: Obtain all required forms from the Activities Office",
          "Step 2: Complete and have all parties sign every document",
          "Step 3: Make 2 copies of the complete packet before submitting",
          "Step 4: Submit the packet to the Activities Director in person",
          "Step 5: Request a dated receipt or email confirmation of submission",
          "Step 6: Log the submission date and expected review timeline",
        ],
      },
      {
        title: "What Reviewers Look For",
        items: [
          "A clear, school-appropriate mission that benefits students",
          "A complete and well-written constitution with all required articles",
          "A committed faculty advisor with no eligibility conflicts",
          "Evidence of genuine student interest (the founding member list)",
          "A realistic meeting schedule that works with the school calendar",
        ],
      },
      {
        title: "Timeline Expectations",
        items: [
          "Initial review by Activities Director: 5–10 school days",
          "Secondary review by Principal or designee: 5–7 additional school days",
          "If revisions are requested, you typically have 2 weeks to resubmit",
          "Full approval typically takes 3–5 weeks from initial submission",
          "Plan to submit at least 6 weeks before your target first meeting date",
        ],
      },
      {
        title: "After Approval: Next Steps",
        items: [
          "Receive your official club approval letter — keep it on file",
          "Reserve your recurring meeting room through the scheduling office",
          "Request a club listing in the school directory and website",
          "Set up a school-approved communication channel for members",
          "Plan and announce your first official meeting with a published agenda",
          "Open membership enrollment and begin recruiting beyond founding members",
        ],
      },
    ],
  },

  "lo-1": {
    subtitle: "Promote your club on Instagram, Discord, and other platforms effectively.",
    sections: [
      {
        title: "Choosing the Right Platforms",
        items: [
          "Instagram: Best for visual content, event announcements, and story highlights",
          "Discord: Ideal for ongoing member discussion, channels by topic, and community",
          "Google Classroom or Schoology: Use for official club announcements to members",
          "Remind or GroupMe: Simple group texting for quick updates and reminders",
          "Start with 1–2 platforms — master them before expanding",
        ],
      },
      {
        title: "Instagram Best Practices",
        items: [
          "Use a consistent username format: [SchoolAbbr][ClubName] (e.g., @JHSSTEMClub)",
          "Post at least once per week to stay visible in followers' feeds",
          "Use 5–10 relevant hashtags per post (#studentclub #STEMclub etc.)",
          "Stories are ideal for quick polls, countdowns, and day-of reminders",
          "Pin 3 key posts: club intro, meeting schedule, and how to join",
          "Always tag your school when posting — increases reach significantly",
        ],
      },
      {
        title: "Discord Server Setup",
        items: [
          "Create channels: #announcements, #general, #events, #questions, #resources",
          "Set a clear server description and post the join link on all other platforms",
          "Use roles to distinguish officers, members, and guests",
          "Post meeting reminders 1 week out, 1 day out, and 1 hour before",
          "Archive old announcements so the server doesn't feel overwhelming",
        ],
      },
      {
        title: "Content Strategy",
        items: [
          "60% club updates (meetings, events, achievements)",
          "25% educational or topical content related to your club's focus",
          "15% member spotlights, behind-the-scenes, and fun posts",
          "Always include a clear call to action: 'Join us,' 'RSVP here,' 'DM us'",
          "Use Canva (free) to create professional-looking graphics in minutes",
        ],
      },
      {
        title: "Posting Schedule Template",
        items: [
          "Monday: Weekly meeting reminder post or story",
          "Wednesday: Mid-week content post (educational, spotlight, or fun)",
          "Friday: Upcoming event preview or weekend interest post",
          "After every meeting: Quick recap story or photo update",
          "After every event: Summary post with photos to show the community's value",
        ],
      },
    ],
  },

  "lo-2": {
    subtitle: "Everything you need for a successful club fair booth.",
    sections: [
      {
        title: "2 Weeks Before the Fair",
        items: [
          "Confirm your booth space assignment and table/chair count with organizers",
          "Design and order (or print) a large banner or poster with your club name",
          "Prepare a sign-up sheet with fields: name, grade, email, and phone",
          "Create a one-page club overview handout to give to interested students",
          "Plan an interactive element: demo, activity, or game related to your club",
          "Recruit at least 3 officer volunteers to staff the booth",
        ],
      },
      {
        title: "1 Week Before the Fair",
        items: [
          "Print all materials: sign-up sheets, handouts, schedules, and FAQs",
          "Prepare a visual display (poster board, laptop slideshow, or trifold)",
          "Gather any props, samples, or products that represent your club's work",
          "Brief all booth volunteers on talking points and what to say to newcomers",
          "Confirm who is bringing which supplies and set a booth setup arrival time",
        ],
      },
      {
        title: "Day-Of Booth Setup",
        items: [
          "Arrive 20 minutes early to arrange your table attractively",
          "Place sign-up sheet prominently at the front of the table",
          "Display your banner or poster at eye level",
          "Have a laptop or tablet running a slideshow of past club activities",
          "Offer a small giveaway (sticker, bookmark, or pencil) to drive traffic",
        ],
      },
      {
        title: "Talking to Prospective Members",
        items: [
          "Start with a welcoming question: 'Are you interested in [topic]?'",
          "Share 2–3 exciting things your club has done or plans to do",
          "Give a specific next step: 'Our first meeting is [date] at [time]'",
          "Address the top 3 concerns: time commitment, cost, and skill requirement",
          "Collect emails and follow up within 48 hours of the fair",
        ],
      },
      {
        title: "Post-Fair Follow-Up",
        items: [
          "Send a welcome email to everyone who signed up within 24–48 hours",
          "Add all sign-ups to your club's communication channel",
          "Track how many fair sign-ups actually attend the first meeting",
          "Send a reminder 2 days before the first meeting to all fair recruits",
          "Post a recap photo from the fair to your social media",
        ],
      },
    ],
  },

  "lo-3": {
    subtitle: "Keep members engaged with events, recognition, and meaningful activities.",
    sections: [
      {
        title: "Why Members Leave",
        items: [
          "They feel like passive observers rather than active contributors",
          "Meetings feel unproductive, repetitive, or like a waste of time",
          "They don't see a clear path to leadership or growing their skills",
          "They feel disconnected from the club's social community",
          "Competing commitments weren't addressed proactively",
        ],
      },
      {
        title: "Recognition and Appreciation",
        items: [
          "Acknowledge birthdays and personal achievements at the start of meetings",
          "Award a 'Member of the Month' with a small certificate or shoutout",
          "Create an end-of-year superlatives tradition with fun, meaningful categories",
          "Write personal thank-you notes after members go above and beyond",
          "Feature member spotlights on social media to make members feel seen",
        ],
      },
      {
        title: "Engagement Activity Ideas",
        items: [
          "Host one social event per month that is separate from a business meeting",
          "Rotate who leads a segment of each meeting to give all members ownership",
          "Organize a club challenge or competition with a small prize",
          "Partner with another club for a joint event to expand social connections",
          "Plan a service project so members feel they are making a real impact",
          "Create committees so members can lead work in areas they're passionate about",
        ],
      },
      {
        title: "Communication Best Practices",
        items: [
          "Send meeting reminders 48 hours and 2 hours before each session",
          "Share a clear agenda before every meeting so members know what to expect",
          "Respond to member messages within 24 hours — set this as an officer norm",
          "Create a public-facing calendar with all club dates for the semester",
          "Solicit feedback quarterly: what's working, what should change?",
        ],
      },
    ],
  },

  "lo-4": {
    subtitle: "Customizable flyer designs for announcing your club to new students.",
    sections: [
      {
        title: "Essential Elements Every Flyer Needs",
        items: [
          "Club name and one-line description of what you do",
          "Next meeting date, time, and location (be specific: 'Room 214')",
          "A QR code linking to your sign-up form or club social media",
          "Contact email or Instagram handle for questions",
          "School logo or branding to signal this is an official school club",
        ],
      },
      {
        title: "Design Principles",
        items: [
          "Use at most 2 fonts: one bold for headlines, one clean for body text",
          "Limit your color palette to 2–3 colors that match your club's identity",
          "Leave white space — avoid cramming too much text onto the page",
          "Make the most important detail (meeting time/date) the largest text on the flyer",
          "Use a high-quality image that relates to your club's topic",
          "Canva has free templates perfect for school club flyers",
        ],
      },
      {
        title: "Digital Flyer Guidelines",
        items: [
          "Export at 1080x1080px for Instagram posts or 1080x1920px for stories",
          "Include alt-text when sharing online for accessibility",
          "Post to Instagram, school Facebook group, and Discord simultaneously",
          "Ask the school office if they will include it in the weekly newsletter",
          "Pin the flyer post on your club's Instagram profile",
        ],
      },
      {
        title: "Physical Distribution Strategy",
        items: [
          "Get administration approval before posting any physical flyers",
          "Focus posting on high-traffic areas: cafeteria, library, main hallway",
          "Replace or refresh flyers every 2 weeks to keep information current",
          "Hand-deliver flyers to teachers to post in their classrooms",
          "Post on community bulletin boards near relevant departments (e.g., science wing for STEM clubs)",
        ],
      },
    ],
  },

  "ob-1": {
    subtitle: "Agenda templates, parliamentary procedure basics, and engagement techniques.",
    sections: [
      {
        title: "Sample Meeting Agenda Template",
        items: [
          "1. Call to Order (1 min) — President opens the meeting officially",
          "2. Attendance (2 min) — Secretary records who is present",
          "3. Review of Last Meeting (3 min) — Secretary reads prior action items",
          "4. Officer Reports (5–10 min) — Each officer updates on their area",
          "5. Old Business (10 min) — Follow-up on ongoing initiatives",
          "6. New Business (15 min) — New proposals, announcements, ideas",
          "7. Open Forum (5 min) — Members may raise any topic",
          "8. Adjournment — President formally closes the meeting",
        ],
      },
      {
        title: "Parliamentary Procedure Basics",
        items: [
          "Motion: Any member may 'move' to take a specific action",
          "Second: Another member must 'second' a motion for it to be discussed",
          "Debate: Members speak for or against the motion (time-limited)",
          "Vote: Simple majority passes most motions unless bylaws require more",
          "Table: Move to postpone discussing a topic until a later meeting",
          "Point of Order: Call out when rules are being violated",
        ],
      },
      {
        title: "Engagement Techniques",
        items: [
          "Use a 'talking stick' or raised hand system to ensure equal speaking time",
          "Start meetings with a quick icebreaker or question to energize the group",
          "Break into small groups for brainstorming, then report back to all",
          "Use anonymous polls (Mentimeter or Poll Everywhere) for sensitive votes",
          "Assign specific roles at each meeting: timekeeper, note-taker, energy monitor",
        ],
      },
      {
        title: "Keeping Meetings on Time",
        items: [
          "Assign a timekeeper to track each agenda item",
          "Post the agenda on a shared screen or whiteboard at the front",
          "Use a visible timer for discussion items",
          "If discussion runs long, table the item with a specific follow-up date",
          "End on time — respect members' schedules to build trust",
        ],
      },
    ],
  },

  "ob-2": {
    subtitle: "Standard format for documenting discussions and decisions at every meeting.",
    sections: [
      {
        title: "Minutes Header",
        items: [
          "Club Name: [Official Club Name]",
          "Date of Meeting: [Month Day, Year]",
          "Time: [Start Time] – [End Time]",
          "Location: [Room Number / Building]",
          "Presiding Officer: [President's Name]",
          "Minutes Recorded By: [Secretary's Name]",
        ],
      },
      {
        title: "Attendance Record",
        items: [
          "List all members present by full name",
          "List all members absent and note if absence was excused",
          "Note any guests or non-member attendees",
          "Record whether quorum was achieved",
        ],
      },
      {
        title: "Discussion and Action Items",
        items: [
          "For each agenda topic, record: topic name, summary of discussion, and outcome",
          "Record every motion exactly as stated: 'Motion to [action] made by [name]'",
          "Record who seconded and the vote result (e.g., 'Passed 12–2')",
          "Action items format: WHO will do WHAT by WHEN",
          "Example: 'Sarah will design the event flyer by March 15th'",
        ],
      },
      {
        title: "Distribution and Storage",
        items: [
          "Distribute minutes to all members within 48 hours of the meeting",
          "Store all minutes in a shared Google Drive folder accessible to officers",
          "Read the previous meeting's action items aloud at the start of each meeting",
          "Keep minutes for the entire school year — they are your official record",
          "Submit a copy to your faculty advisor each month",
        ],
      },
    ],
  },

  "ob-3": {
    subtitle: "Define clear roles for President, VP, Secretary, Treasurer, and more.",
    sections: [
      {
        title: "President",
        items: [
          "Preside over all meetings using the approved agenda",
          "Represent the club in all official school communications",
          "Set the strategic direction and goals for the club year",
          "Oversee all officers and ensure accountability",
          "Cast the deciding vote in case of a tie",
          "Maintain the relationship with the faculty advisor",
        ],
      },
      {
        title: "Vice President",
        items: [
          "Assume all presidential responsibilities when the President is absent",
          "Lead at least one major club initiative or committee per semester",
          "Assist in coordinating officer communication and teamwork",
          "Support the President in running meetings and managing logistics",
          "Serve as the primary liaison with partnering clubs or organizations",
        ],
      },
      {
        title: "Secretary",
        items: [
          "Record accurate meeting minutes and distribute within 48 hours",
          "Maintain the official club membership roster and attendance records",
          "Send meeting reminders and follow-up emails to members",
          "Manage club correspondence (emails, announcements, and notices)",
          "Maintain organized club files and documentation",
        ],
      },
      {
        title: "Treasurer",
        items: [
          "Manage all club funds in the school-assigned account",
          "Process all purchase requests and reimbursements with receipts",
          "Present a financial update at each meeting",
          "Prepare the annual budget at the start of each school year",
          "Submit required financial reports to the school Activities Office",
          "Ensure all fundraising income is deposited within 48 hours",
        ],
      },
      {
        title: "Best Practices for All Officers",
        items: [
          "Attend all meetings — notify the President at least 24 hours before any absence",
          "Complete your responsibilities on time without needing reminders",
          "Act as a role model for the club's values and norms",
          "Communicate openly when you are struggling with your responsibilities",
          "Help recruit and mentor your successor before the end of your term",
        ],
      },
    ],
  },

  "ex-1": {
    subtitle: "Comprehensive checklists for planning club events of any size.",
    sections: [
      {
        title: "8 Weeks Before the Event",
        items: [
          "Define the event concept, goals, and intended audience",
          "Select a date that doesn't conflict with major school events",
          "Submit a venue/room reservation request to the school",
          "Identify what budget is available and create a preliminary budget",
          "Assign an event planning committee with clear roles",
          "Draft a project timeline with weekly milestones",
        ],
      },
      {
        title: "4 Weeks Before the Event",
        items: [
          "Confirm venue reservation in writing",
          "Finalize the event agenda and schedule",
          "Begin designing promotional materials (flyers, social posts)",
          "Confirm any speakers, performers, or special guests",
          "Send out formal invitations or announcements",
          "Purchase or order all supplies and materials",
        ],
      },
      {
        title: "1 Week Before the Event",
        items: [
          "Send final reminder to all attendees and volunteers",
          "Confirm all supply orders have arrived",
          "Brief all event volunteers on their specific roles",
          "Conduct a walkthrough of the venue to plan setup",
          "Prepare a day-of emergency contact list",
          "Test any AV equipment or technology you'll use",
        ],
      },
      {
        title: "Day-Of Checklist",
        items: [
          "Arrive 45–60 minutes early for setup",
          "Set up registration table with sign-in sheets",
          "Assign a designated point of contact for questions",
          "Have water and snacks available for long events",
          "Document the event with photos for social media and reports",
          "Leave the space cleaner than you found it",
        ],
      },
      {
        title: "Post-Event Wrap-Up",
        items: [
          "Send thank-you emails to speakers, volunteers, and sponsors within 48 hours",
          "Post event recap on social media with photos",
          "Document attendance numbers and key outcomes",
          "Conduct a brief officer debrief: what worked, what to improve",
          "Update the budget with final actual costs vs. projected costs",
          "Store all event documentation in the club's shared drive",
        ],
      },
    ],
  },

  "ex-2": {
    subtitle: "Proven fundraising strategies including bake sales, sponsorships, and grants.",
    sections: [
      {
        title: "Choosing the Right Fundraiser",
        items: [
          "Match the fundraiser type to your club's mission and member strengths",
          "Estimate your net profit potential (revenue minus all costs)",
          "Confirm the fundraiser is permitted under school policy",
          "Consider the time and effort required versus the potential return",
          "Run no more than 2 major fundraisers per semester to avoid fatigue",
        ],
      },
      {
        title: "Bake Sales and Food Events",
        items: [
          "Check school nutrition policy on homemade vs. store-bought items",
          "Schedule during high-traffic times: before school, lunch, after school",
          "Price items at $1–$3 for quick sales and high volume",
          "Promote 1 week in advance on all club social media channels",
          "Track every dollar collected and keep all receipts",
          "Deposit all cash proceeds within 24 hours of the event",
        ],
      },
      {
        title: "Online Fundraising Campaigns",
        items: [
          "Use school-approved platforms: GoFundMe for Education, DonorDrive, etc.",
          "Write a compelling campaign description explaining what funds will support",
          "Set a specific, realistic goal (e.g., $500 for supplies) with a deadline",
          "Share weekly progress updates to maintain momentum",
          "Personally thank every donor publicly (with permission) or privately",
          "Share the campaign in the school newsletter and on social media",
        ],
      },
      {
        title: "Sponsorships from Local Businesses",
        items: [
          "Research local businesses with a history of supporting youth programs",
          "Prepare a one-page sponsorship proposal explaining the club and the ask",
          "Offer recognition benefits: logo on flyers, shoutouts at events, website listing",
          "Send a formal thank-you letter and recognition after receiving funds",
          "Follow all school policies regarding external sponsorships",
        ],
      },
      {
        title: "Tracking and Reporting",
        items: [
          "Record every transaction in a shared spreadsheet immediately",
          "Categorize income and expenses clearly (bake sale, donations, supplies, etc.)",
          "Present a financial update to the club at every meeting",
          "Submit a fundraising summary to the Activities Office as required",
          "Retain all receipts and deposit slips for the full school year",
        ],
      },
    ],
  },

  "ex-3": {
    subtitle: "Track club finances, submit purchase requests, and maintain transparency.",
    sections: [
      {
        title: "Budget Categories to Track",
        items: [
          "Income: School allocation, fundraising proceeds, donations, dues (if any)",
          "Operations: Office supplies, printing, postage, and meeting materials",
          "Events: Venue, decorations, food, entertainment, and transportation",
          "Marketing: Flyers, banners, social media ads (if school-approved)",
          "Equipment: Technology, tools, uniforms, or gear specific to your club",
          "Reserve Fund: Set aside 10–15% of income as an emergency buffer",
        ],
      },
      {
        title: "Monthly Income and Expenses Log",
        items: [
          "Log every transaction on the day it occurs — don't batch entries",
          "Record: Date, Description, Income Amount, Expense Amount, Running Balance",
          "Color-code categories in your spreadsheet for quick visual review",
          "Reconcile your log against bank statements monthly",
          "Share read-only access to the log with your faculty advisor",
        ],
      },
      {
        title: "Purchase Request Process",
        items: [
          "All purchases over $[X] require a Purchase Request Form before buying",
          "Form fields: Requester name, item description, vendor, cost, purpose",
          "Requires officer majority approval for amounts over budget threshold",
          "Faculty advisor signs off on all purchases",
          "Receipts must be submitted to the Treasurer within 3 school days of purchase",
          "No personal reimbursements without a pre-approved purchase request",
        ],
      },
      {
        title: "Financial Transparency Requirements",
        items: [
          "Treasurer presents a balance update at each club meeting",
          "Full budget report distributed to all members once per semester",
          "Any member may request to view the budget log in a supervised setting",
          "All fundraising totals are reported publicly to the Activities Office",
          "Year-end financial summary is submitted before the final meeting",
        ],
      },
    ],
  },

  "mc-1": {
    subtitle: "How to transition leadership smoothly when officers graduate or step down.",
    sections: [
      {
        title: "When to Start Planning",
        items: [
          "Begin succession planning at least 2 months before the end of the school year",
          "Identify likely leadership gaps: which officers are graduating or stepping down",
          "Discuss succession openly at a spring meeting to set expectations",
          "Encourage interested members to shadow current officers starting in March",
          "Hold elections no later than 6 weeks before the current officers' term ends",
        ],
      },
      {
        title: "Knowledge Transfer Checklist",
        items: [
          "Create a shared folder with all club documents, templates, and passwords",
          "Write a brief 'State of the Club' memo summarizing the year's key events",
          "Document recurring annual tasks with deadlines (renewals, elections, reports)",
          "Record login credentials for club email, social media, and any paid tools",
          "Brief incoming officers on any ongoing commitments or unfinished projects",
        ],
      },
      {
        title: "Transition Meeting Agenda",
        items: [
          "Outgoing and incoming officers meet together for at least 2 transition sessions",
          "Session 1: Overview of each officer role and current club status",
          "Session 2: Hands-on walkthrough of files, tools, and recurring tasks",
          "Introduce the incoming President to the faculty advisor formally",
          "Provide new officers with the school Activities Office contact and procedures",
        ],
      },
      {
        title: "Continuity Checklist",
        items: [
          "New officers have access to all club accounts and shared documents",
          "Faculty advisor has confirmed willingness to continue the following year",
          "Club charter or registration renewal is submitted before the deadline",
          "Returning members are briefed on the incoming leadership team",
          "A written summary of incomplete projects is handed to incoming officers",
        ],
      },
    ],
  },

  "mc-2": {
    subtitle: "End-of-year report template showcasing your club's achievements and impact.",
    sections: [
      {
        title: "Executive Summary",
        items: [
          "Club Name, School, School Year, and Submitting Officer",
          "One-paragraph overview of the club's most significant accomplishments",
          "Total membership count at end of year vs. start of year",
          "Number of meetings held and average attendance percentage",
          "Top 3 highlights of the year in bullet form",
        ],
      },
      {
        title: "Events and Activities",
        items: [
          "List every event held: name, date, attendance, and brief outcome",
          "Identify which events had the highest attendance or community impact",
          "Note any events that were cancelled and the reason",
          "Include photos or links to event coverage where available",
          "Highlight any school, district, or community recognition received",
        ],
      },
      {
        title: "Financial Overview",
        items: [
          "Starting balance at the beginning of the school year",
          "Total income (by category: school allocation, fundraising, donations)",
          "Total expenses (by category: events, supplies, marketing, etc.)",
          "Ending balance to be carried over to next year",
          "Notable financial wins: largest fundraiser, cost savings achieved",
        ],
      },
      {
        title: "Community Impact",
        items: [
          "Total volunteer hours contributed by club members",
          "Number of students, families, or community members served",
          "Partnerships formed with other clubs, organizations, or businesses",
          "Service projects completed and their outcomes",
          "Media coverage or awards received",
        ],
      },
      {
        title: "Goals for Next Year",
        items: [
          "List 3–5 specific, measurable goals for the incoming officer team",
          "Address any areas that fell short this year with a proposed solution",
          "Identify 1–2 new initiatives to pursue",
          "Note any structural changes recommended (new officer roles, new meeting time)",
          "Share this section with incoming officers as part of the transition handoff",
        ],
      },
    ],
  },

  "mc-3": {
    subtitle: "12-week countdown with weekly milestones and practice schedules.",
    sections: [
      {
        title: "Weeks 1–3: Foundation Phase",
        items: [
          "Week 1: Select your competition category and confirm team members",
          "Week 1: Review all official competition rules and judging rubrics thoroughly",
          "Week 2: Research past winning entries and identify what made them successful",
          "Week 2: Brainstorm and narrow down your core concept or project direction",
          "Week 3: Finalize your concept and create a project plan with weekly milestones",
          "Week 3: Assign specific responsibilities to each team member",
        ],
      },
      {
        title: "Weeks 4–6: Development Phase",
        items: [
          "Week 4: Complete an initial draft or prototype of your project",
          "Week 4: Identify any resources, tools, or materials you still need",
          "Week 5: Begin developing your presentation or portfolio components",
          "Week 5: Schedule weekly check-in meetings with all team members",
          "Week 6: Conduct your first internal review — assess progress vs. milestones",
          "Week 6: Gather advisor feedback and make major revisions",
        ],
      },
      {
        title: "Weeks 7–9: Refinement Phase",
        items: [
          "Week 7: Polish all project components based on feedback received",
          "Week 7: Begin rehearsing your oral presentation if required",
          "Week 8: Conduct a full practice run in front of an audience",
          "Week 8: Request feedback from teachers, mentors, or other clubs",
          "Week 9: Finalize all written documentation and portfolio materials",
          "Week 9: Verify that all submission components meet the official guidelines",
        ],
      },
      {
        title: "Weeks 10–12: Final Preparation",
        items: [
          "Week 10: Submit any required pre-competition paperwork and registrations",
          "Week 10: Confirm travel, lodging, and schedule logistics",
          "Week 11: Conduct 2–3 final practice presentations at competition pace",
          "Week 11: Review judging rubric one final time — are all criteria covered?",
          "Week 12: Rest, review key talking points, and prepare all materials",
          "Week 12: Pack and organize all competition supplies and documentation",
        ],
      },
      {
        title: "Competition Week Checklist",
        items: [
          "All team members have confirmed their attendance and logistics",
          "All required materials, devices, and backup copies are prepared",
          "Team has reviewed the event day schedule and knows the room location",
          "Practice once more the morning of the competition",
          "Arrive 30 minutes before your scheduled slot for setup",
          "After competing: debrief as a team regardless of the outcome",
        ],
      },
    ],
  },

  "mc-4": {
    subtitle: "Understand how TSA and other organizations score student projects.",
    sections: [
      {
        title: "How TSA Competitions Are Judged",
        items: [
          "TSA uses standardized rubrics published before each competition season",
          "Judges are typically educators, industry professionals, and past competitors",
          "Each judge scores independently; scores are averaged for final placement",
          "Most events include both a portfolio/documentation score and a presentation score",
          "Ties are broken by the highest score in the most heavily weighted category",
        ],
      },
      {
        title: "Common Judging Criteria",
        items: [
          "Research and Planning: Evidence of thorough, well-documented preparation",
          "Design and Creativity: Originality, innovation, and aesthetic quality",
          "Technical Accuracy: Correct application of concepts, tools, or methods",
          "Communication: Clarity, organization, and persuasiveness of presentation",
          "Teamwork (for team events): Equal contribution and collaboration evidence",
          "Compliance: Meeting all format, length, and submission requirements",
        ],
      },
      {
        title: "Tips for Maximum Scores",
        items: [
          "Read the official rubric at the start of your project — not at the end",
          "Use the rubric categories as your outline for documentation and presentation",
          "Provide concrete evidence for every claim you make (data, photos, citations)",
          "Practice your presentation until it feels completely natural and confident",
          "Dress professionally — appearance is judged even when not explicitly scored",
          "Begin and end with a strong impression — judges remember the first and last minute",
        ],
      },
      {
        title: "Common Mistakes to Avoid",
        items: [
          "Ignoring a low-weight category — every point counts in close competitions",
          "Submitting documentation that exceeds the page or word limit",
          "Speaking too fast, too quietly, or reading directly from notes",
          "Failing to address judge questions during Q&A — prepare for likely questions",
          "Not leaving time for a final review before the submission deadline",
          "Forgetting to include required cover pages, headings, or bibliographies",
        ],
      },
    ],
  },

  "gs-g1": {
    subtitle: "Onboarding template to welcome and orient new members joining your growing club.",
    sections: [
      {
        title: "Welcome Letter Template",
        items: [
          "Opening: Congratulate the new member and express genuine excitement",
          "Paragraph 1: Brief club history and core mission (2–3 sentences)",
          "Paragraph 2: What to expect at meetings and events",
          "Paragraph 3: How to get involved and who to contact with questions",
          "Closing: Officer signatures and contact information",
        ],
      },
      {
        title: "Club Overview for New Members",
        items: [
          "Club Name and official meeting time, day, and location",
          "Names and roles of all current officers with contact info",
          "Club mission statement in plain, approachable language",
          "Brief summary of what the club did last semester (top 3 highlights)",
          "List of upcoming events or initiatives for the current semester",
        ],
      },
      {
        title: "Meeting Schedule and Expectations",
        items: [
          "Regular meeting schedule: [Day], [Time], [Location]",
          "What members are expected to do to stay in good standing",
          "How to notify officers if you need to miss a meeting",
          "What members can bring to meetings (optional: notebook, laptop, etc.)",
          "Club communication channels and how to join them",
        ],
      },
      {
        title: "Getting Involved Quickly",
        items: [
          "Introduce yourself at your first meeting — we'll make it easy!",
          "Check out our upcoming volunteer opportunities on the events calendar",
          "Join a committee based on your interests and skills",
          "Follow our social media to stay updated between meetings",
          "Reach out to any officer with questions — we're all here to help",
        ],
      },
    ],
  },

  "gs-a1": {
    subtitle: "Annual process for renewing your school-approved charter and updating club docs.",
    sections: [
      {
        title: "Renewal Timeline and Deadlines",
        items: [
          "Most schools require charter renewal at the start of each academic year",
          "Submit renewal at least 4 weeks before your first planned meeting",
          "Check with the Activities Office for your school's specific annual deadline",
          "Late renewals risk losing your meeting space or official club status",
          "Set a calendar reminder for the same date every year",
        ],
      },
      {
        title: "Required Update Documentation",
        items: [
          "Updated club constitution (especially if any articles have changed)",
          "Current officer roster with names, grades, and contact info",
          "Renewed faculty advisor agreement form signed by the current advisor",
          "Updated founding/core member list (minimum required by your school)",
          "Any new club policies, norms, or mission updates since last year",
        ],
      },
      {
        title: "Changes That Must Be Reported",
        items: [
          "New faculty advisor replacing the previous one",
          "Change in meeting day, time, or location",
          "Major changes to the club's mission or name",
          "Addition of new officer positions or removal of existing ones",
          "Any affiliation with a new national or regional organization",
        ],
      },
      {
        title: "After Renewal is Approved",
        items: [
          "Confirm your assigned meeting room for the new school year",
          "Request updated club listing in the school directory and website",
          "Send a 'We're Back!' announcement to prior members",
          "Host a kickoff meeting to welcome returning and new members",
          "File the renewal approval letter in the club's shared drive",
        ],
      },
    ],
  },

  "gs-ad1": {
    subtitle: "How to coordinate with sister chapters and maintain consistent standards.",
    sections: [
      {
        title: "Why Coordination Matters",
        items: [
          "Consistent standards build a stronger, more recognizable organization",
          "Shared resources reduce duplication of effort across chapters",
          "Joint events create larger impact and higher visibility",
          "Coordination prevents conflicting activities on the same dates",
          "Alumni and community partners prefer working with organized multi-chapter groups",
        ],
      },
      {
        title: "Establishing a Coordination Framework",
        items: [
          "Designate one officer at each chapter as the inter-chapter liaison",
          "Hold a joint leadership meeting at the start and middle of each school year",
          "Create a shared digital workspace (Google Drive, Notion, or Confluence)",
          "Establish clear boundaries: what is standardized vs. chapter-specific",
          "Create a shared calendar visible to all chapter leadership teams",
        ],
      },
      {
        title: "Shared Resources and Templates",
        items: [
          "Maintain one master template folder for constitutions, forms, and designs",
          "Share a common brand kit: colors, fonts, logo variations",
          "Pool fundraising contacts and sponsor relationships where appropriate",
          "Share event planning templates and post-event documentation",
          "Collaboratively update resource documents at least once per year",
        ],
      },
      {
        title: "Joint Events and Collaborations",
        items: [
          "Plan at least one joint event per semester across all chapters",
          "Rotate the hosting responsibility among chapters fairly",
          "Align on shared goals for the joint event (e.g., recruitment, service, fun)",
          "Document the joint event and share the recap with all chapters",
          "Survey participants from all chapters for feedback after each joint event",
        ],
      },
    ],
  },

  "rp-b1": {
    subtitle: "Practical tactics for recruiting your founding members before your first meeting.",
    sections: [
      {
        title: "Finding Your First Members",
        items: [
          "Start with people you already know who share your club's interest",
          "Target relevant classes or after-school activities where your audience gathers",
          "Ask sympathetic teachers to mention the club in relevant classes",
          "Post a simple interest form on social media 2 weeks before recruiting closes",
          "Attend club fairs, lunch events, or school assemblies to speak briefly",
        ],
      },
      {
        title: "The Personal Ask Strategy",
        items: [
          "A personal, direct ask is 3–5x more effective than a general announcement",
          "Identify 20 students who match your club's target audience",
          "Have a 30-second pitch ready: what the club does and why it matters",
          "Ask directly: 'I think you'd be a great fit — would you be interested?'",
          "Follow up within 3 days if you don't hear back",
        ],
      },
      {
        title: "What to Say When Recruiting",
        items: [
          "Lead with the passion and mission, not the logistics",
          "Share 1–2 specific things the club will do that are exciting",
          "Address the time commitment concern proactively and honestly",
          "Offer a 'no obligation first meeting' to reduce the barrier to entry",
          "Share a compelling personal reason why you started the club",
        ],
      },
      {
        title: "Converting Interest to Commitment",
        items: [
          "Collect name, grade, and email from everyone who expresses interest",
          "Send a follow-up message within 24 hours of first contact",
          "Give interested students a specific action: 'Sign this form by Friday'",
          "Share the date, time, and location of the first meeting clearly",
          "Send a reminder 2 days before and 2 hours before the first meeting",
        ],
      },
    ],
  },

  "rp-a1": {
    subtitle: "Email and pitch templates for forming partnerships with clubs and organizations.",
    sections: [
      {
        title: "Types of Partnerships to Pursue",
        items: [
          "Peer clubs at your school: co-host events, cross-promote membership",
          "Student clubs at other schools: share resources and collaborate",
          "Local nonprofits: volunteer, service projects, and joint programming",
          "Local businesses: sponsorships, guest speakers, and mentorship",
          "Community organizations: event venues, funding, and recognition",
        ],
      },
      {
        title: "Email Template: Reaching Out to Another Club",
        items: [
          "Subject: Collaboration Opportunity — [Your Club Name] x [Their Club Name]",
          "Greeting: Address the club president by name if you know it",
          "Para 1: Introduce yourself, your club, and why you're reaching out",
          "Para 2: Propose a specific collaboration idea with a clear mutual benefit",
          "Para 3: Suggest a brief call or meeting to explore the idea further",
          "Sign off with your name, title, club, and contact information",
        ],
      },
      {
        title: "Email Template: Local Organization Outreach",
        items: [
          "Subject: Student Club Partnership Inquiry — [School Name]",
          "Para 1: Brief intro — who you are, your school, and your club's mission",
          "Para 2: Why this organization aligns with your club's goals",
          "Para 3: Specific ask — volunteer day, guest speaker, event co-hosting",
          "Para 4: What you offer in return — promotion, student volunteers, recognition",
          "Keep the email under 200 words — busy organizations prefer brevity",
        ],
      },
      {
        title: "Managing Active Partnerships",
        items: [
          "Assign one officer as the point of contact for each partnership",
          "Confirm logistics at least 2 weeks before any joint activity",
          "Send a thank-you message after every collaborative event",
          "Evaluate each partnership at end of year: renew, modify, or end it",
          "Document all active partnerships in a shared log with status and notes",
        ],
      },
    ],
  },

  "rp-ad1": {
    subtitle: "Strategies for building a long-term alumni network that supports your club.",
    sections: [
      {
        title: "Why Alumni Networks Matter",
        items: [
          "Alumni provide mentorship, career advice, and real-world perspective",
          "Former members can offer financial support and donations",
          "Alumni ambassadors expand your club's reputation beyond the school",
          "Long-term alumni connections validate the club's lasting impact",
          "Alumni can speak at events, serve on advisory panels, or judge competitions",
        ],
      },
      {
        title: "Building Your Alumni Database",
        items: [
          "Create a simple spreadsheet: name, graduation year, college/career, email",
          "Collect contact info from graduating members at their final meeting",
          "Ask alumni to update their information annually via a quick Google Form",
          "Respect privacy: never share alumni contact info without their permission",
          "Maintain the database with a designated officer responsible for updates",
        ],
      },
      {
        title: "Communication Strategies",
        items: [
          "Send a quarterly alumni newsletter with club highlights and upcoming events",
          "Invite alumni to speak at 1–2 club meetings per year via video call",
          "Create a private alumni social media channel (LinkedIn group or Discord server)",
          "Recognize alumni accomplishments in your newsletter and social media",
          "Include alumni in major milestone events: club anniversaries, competitions",
        ],
      },
      {
        title: "Alumni Mentorship Program",
        items: [
          "Pair each interested current member with an alumni mentor in a similar field",
          "Provide a simple mentorship guide outlining frequency and conversation topics",
          "Host an annual 'Alumni Day' for in-person or virtual mentorship speed rounds",
          "Track mentorship pairs and follow up mid-year with both parties",
          "Celebrate successful mentorship stories publicly (with permission)",
        ],
      },
    ],
  },

  "mo-b1": {
    subtitle: "Agenda template, icebreaker ideas, and ground rules for your very first meeting.",
    sections: [
      {
        title: "Pre-Meeting Preparation",
        items: [
          "Send the meeting agenda to all attendees 24 hours in advance",
          "Prepare a sign-in sheet with name, grade, email, and phone number fields",
          "Set up the room 10 minutes before the start time",
          "Have printed copies of your club mission and membership info available",
          "Prepare a visual display: poster, projected slide, or whiteboard with club name",
          "Prepare your personal 2-minute introduction as club founder/president",
        ],
      },
      {
        title: "Sample First Meeting Agenda",
        items: [
          "Welcome and introductions by the President (5 min)",
          "Icebreaker activity — something fun and related to the club topic (10 min)",
          "Club overview: mission, what we do, goals for the year (10 min)",
          "Membership expectations and how to stay in good standing (5 min)",
          "Q&A — answer any questions from prospective members (10 min)",
          "Open enrollment: collect membership forms and contact info (5 min)",
          "Announce next meeting date and close (5 min)",
        ],
      },
      {
        title: "Icebreaker Ideas",
        items: [
          "Two Truths and a Lie — quick and works for any group size",
          "Topic-specific trivia: 3 questions related to your club's theme",
          "'Find someone who...' bingo sheet with club-relevant prompts",
          "Speed networking: 2-minute paired conversations rotating every bell",
          "Club Kahoot: a short quiz about the club's mission or goals",
        ],
      },
      {
        title: "Setting Ground Rules Together",
        items: [
          "Ask the group to suggest norms rather than dictating them",
          "Common effective norms: 'phones away during meetings,' 'no interrupting'",
          "Write agreed-upon norms on a visible board or shared document",
          "Ask every member to verbally agree to the norms before leaving",
          "Review norms briefly at the start of the second meeting",
        ],
      },
    ],
  },

  "mo-gr1": {
    subtitle: "How to divide your club into subcommittees as you scale beyond founding members.",
    sections: [
      {
        title: "When to Form Committees",
        items: [
          "Your club has grown to 15+ active members",
          "Officers are overwhelmed managing all aspects of club operations",
          "You want to give more members a meaningful leadership role",
          "You have recurring areas of work (events, membership, communications)",
          "You need to operate multiple workstreams at the same time",
        ],
      },
      {
        title: "Core Committee Types",
        items: [
          "Events Committee: plan, execute, and debrief all club events",
          "Membership & Outreach Committee: recruitment, retention, and welcoming",
          "Communications Committee: social media, flyers, and announcements",
          "Finance Committee: budget tracking, fundraising, and financial reporting",
          "Projects Committee: manage any ongoing club-specific projects or competitions",
        ],
      },
      {
        title: "Committee Chair Responsibilities",
        items: [
          "Lead committee meetings (separate from full club meetings as needed)",
          "Provide a brief update to all officers at the main meeting",
          "Submit a written monthly report to the President",
          "Recruit and assign tasks to committee members each month",
          "Escalate issues that require full officer or club decision-making",
        ],
      },
      {
        title: "Making Committees Effective",
        items: [
          "Keep committees to 3–6 members — smaller is more productive",
          "Each committee should have a clear goal and deliverables each month",
          "Rotate committee membership annually to prevent silos",
          "Recognize committee contributions publicly in full club meetings",
          "Provide committees with the resources they need — don't micromanage",
        ],
      },
    ],
  },

  "mo-ad1": {
    subtitle: "Formal process for proposing, debating, and ratifying changes to club bylaws.",
    sections: [
      {
        title: "When Bylaws Need to Change",
        items: [
          "Your club has outgrown the current structure (new roles needed)",
          "A bylaw is being consistently ignored because it no longer fits the club",
          "Your school or national organization has updated its requirements",
          "Members have raised the same concern about a rule more than twice",
          "Officers identify a gap — something important is not covered at all",
        ],
      },
      {
        title: "Proposal Requirements",
        items: [
          "Amendment proposals must be submitted in writing to the Secretary",
          "The proposal must include: the current text, the proposed new text, and the rationale",
          "Any member in good standing may submit a proposal",
          "Officers may also initiate an amendment by majority officer vote",
          "The Secretary logs all proposals with the date received",
        ],
      },
      {
        title: "Notice and Discussion Period",
        items: [
          "The full text of the proposed amendment must be distributed to all members",
          "A minimum notice period of 7 calendar days is required before the vote",
          "The proposal is discussed at an open meeting before the vote takes place",
          "Members who cannot attend may submit written comments in advance",
          "Debate is time-limited: each speaker has a maximum of 2 minutes",
        ],
      },
      {
        title: "Voting and Ratification",
        items: [
          "Ratification requires a 2/3 supermajority of members present",
          "Voting is conducted by secret ballot for significant changes",
          "The result is recorded in the meeting minutes with exact vote counts",
          "The updated constitution is re-signed by all current officers",
          "A copy of the amended constitution is submitted to school administration",
          "Amendment takes effect immediately upon admin approval",
        ],
      },
    ],
  },

  "ef-b1": {
    subtitle: "Checklist and budget template for your club's first small-scale event.",
    sections: [
      {
        title: "What Makes a Micro-Event",
        items: [
          "Small, focused gathering of 10–40 participants",
          "Low budget (typically under $100) and manageable logistics",
          "Directly tied to the club's mission or recruitment goals",
          "Examples: study session, skill workshop, game night, club Q&A",
          "Perfect for a new club's first semester — lower risk, high learning value",
        ],
      },
      {
        title: "1–2 Weeks Before the Event",
        items: [
          "Confirm the event space with the school Activities Office",
          "Set a clear budget limit and list all expected expenses",
          "Create a simple event flyer with date, time, location, and RSVP link",
          "Post the flyer on all club channels and school bulletin boards",
          "Assign event roles to 2–3 volunteers: setup, registration, cleanup",
        ],
      },
      {
        title: "Day-Of Checklist",
        items: [
          "Arrive 20 minutes early to set up the space",
          "Place a sign-in sheet at the entrance with name and contact fields",
          "Have a printed agenda or activity plan available for all attendees",
          "Designate one officer to greet newcomers and make them feel welcome",
          "Take photos for social media and club records",
          "Clean up the space completely before leaving",
        ],
      },
      {
        title: "Micro-Event Budget Template",
        items: [
          "Supplies (paper, markers, name tags): $10–$20",
          "Printed materials (flyers, agendas, handouts): $5–$15",
          "Snacks or refreshments (optional): $20–$40",
          "Decorations (optional): $10–$20",
          "Total estimated budget: $45–$95",
          "Request funds from your Treasurer at least 1 week before the event",
        ],
      },
    ],
  },

  "ef-gr1": {
    subtitle: "Professional letter and pitch template for approaching local business sponsors.",
    sections: [
      {
        title: "Understanding Your Sponsorship Needs",
        items: [
          "Define exactly how much funding you need and what it will be used for",
          "Identify what you can offer sponsors in return (recognition, promotion, etc.)",
          "Set a target: 3–5 sponsors to approach for each major initiative",
          "Research each prospect before outreach — personalization dramatically improves response rates",
          "Determine whether you need cash sponsorship, in-kind goods, or both",
        ],
      },
      {
        title: "Sponsor Research Checklist",
        items: [
          "Business has a history of supporting youth, education, or community programs",
          "Business is local and has a clear interest in the school community",
          "You can identify a specific contact name (owner, manager, marketing director)",
          "Business is not a direct competitor of any current club sponsor",
          "Their values and brand align with your club's mission",
        ],
      },
      {
        title: "Sponsorship Request Letter Template",
        items: [
          "Opening: Address the specific contact by name",
          "Para 1: Introduce your club, school, and mission in 2–3 sentences",
          "Para 2: Describe the specific event or project requiring sponsorship",
          "Para 3: State the sponsorship amount and what it will fund",
          "Para 4: Outline what you offer in return (logo placement, shoutouts, etc.)",
          "Closing: Request a brief meeting or call and provide your contact info",
          "Attach a one-page club overview as supporting material",
        ],
      },
      {
        title: "Follow-Up and Fulfillment",
        items: [
          "Follow up within 1 week if you have not received a response",
          "Send a formal acknowledgment letter upon receiving sponsorship funds",
          "Fulfill all promised recognition deliverables on time",
          "Send a post-event summary to the sponsor showing their impact",
          "Write a thank-you note from your club members for personal touch",
        ],
      },
    ],
  },

  "ef-ad1": {
    subtitle: "Step-by-step workbook for researching, drafting, and submitting grants.",
    sections: [
      {
        title: "Finding the Right Grants",
        items: [
          "Search databases: GrantWatch, Foundation Directory Online, Grants.gov",
          "Check if your national organization (e.g., TSA, FBLA, DECA) offers member grants",
          "Look for local community foundation grants in your city or county",
          "Review corporate foundation grant programs from large local employers",
          "Prioritize grants with realistic eligibility requirements for student organizations",
        ],
      },
      {
        title: "Eligibility and Requirements Check",
        items: [
          "Confirm your club is a registered nonprofit or has a fiscal sponsor",
          "Verify you meet the geographic and demographic eligibility criteria",
          "Review the grant's purpose — it must align closely with your project goals",
          "Note all required attachments: tax forms, letters of support, budgets",
          "Mark the submission deadline on your calendar with a 2-week buffer",
        ],
      },
      {
        title: "Grant Application Components",
        items: [
          "Cover page: Organization name, contact, project name, amount requested",
          "Executive summary: 1 paragraph describing the project and its impact",
          "Statement of need: Why this project is necessary and who it benefits",
          "Project description: Goals, activities, timeline, and evaluation methods",
          "Budget narrative: Itemized budget with justification for each line item",
          "Supporting documents: Letters of support, prior financial statements, photos",
        ],
      },
      {
        title: "Writing a Compelling Narrative",
        items: [
          "Use specific numbers and data to support your case (enrollment, demographics)",
          "Tell a brief story that illustrates the problem you are solving",
          "Connect your project directly to the funder's stated priorities",
          "Use clear, simple language — avoid jargon and overly academic writing",
          "Have two people proofread every narrative before submitting",
        ],
      },
      {
        title: "Submission and Follow-Up",
        items: [
          "Submit at least 48 hours before the deadline to avoid technical issues",
          "Save a complete copy of everything you submitted",
          "Send a brief confirmation email after submitting to verify receipt",
          "Follow up with the funder 2 weeks after the review period if no response",
          "Regardless of outcome, request feedback to improve future applications",
        ],
      },
    ],
  },

  "ll-b1": {
    subtitle: "How to nominate, campaign, and vote for your founding leadership team.",
    sections: [
      {
        title: "Before Elections: Preparation",
        items: [
          "Agree on which officer positions will be elected (refer to your constitution)",
          "Define eligibility requirements: good standing, grade level, attendance",
          "Set the election timeline: nomination period, campaign period, vote date",
          "Announce the election at least 2 weeks in advance to all members",
          "Choose a neutral election facilitator (the faculty advisor is ideal)",
        ],
      },
      {
        title: "Nomination Process",
        items: [
          "Open a 5-day written nomination period for each officer position",
          "Allow self-nominations and peer nominations in writing",
          "Nominees must confirm their acceptance within 24 hours",
          "If a position has no nominees, extend the period by 3 days",
          "Announce the confirmed candidate slate to all members before voting",
        ],
      },
      {
        title: "Campaign Guidelines",
        items: [
          "Each candidate has a 3–5 day campaign period",
          "Candidates may post 1 campaign flyer in the meeting room",
          "A 2-minute speech before the vote is the fairest format",
          "No negative campaigning — focus on your own goals and qualifications",
          "Candidates must not pressure or coerce members to vote for them",
        ],
      },
      {
        title: "Voting and Announcing Results",
        items: [
          "Use secret paper ballot or a private digital form (Google Forms works well)",
          "The advisor counts all votes independently to ensure neutrality",
          "Simple majority wins each position",
          "Announce results at the same meeting or within 24 hours",
          "Thank all candidates publicly — losing is a part of leadership development",
          "Transition to new officers at the next scheduled meeting",
        ],
      },
    ],
  },

  "ll-gr1": {
    subtitle: "Structured self-assessment and peer review for evaluating officer performance.",
    sections: [
      {
        title: "Purpose of the Mid-Year Review",
        items: [
          "Identifies strengths to build on and gaps to address before year-end",
          "Creates accountability and professional growth for all officers",
          "Helps realign the club's second-half priorities based on first-half data",
          "Fosters honest communication within the leadership team",
          "Models the kind of professional feedback culture members will encounter later in life",
        ],
      },
      {
        title: "Self-Assessment Template",
        items: [
          "Name and Position: [Your Name], [Your Role]",
          "What are the 3 most important things I accomplished in my role?",
          "What is 1 area where I fell short of my own expectations?",
          "What will I do differently in the second half of the year?",
          "What support do I need from my fellow officers to succeed?",
          "Rating: How would I rate my overall performance so far? (1–5) and why?",
        ],
      },
      {
        title: "Peer Feedback Guidelines",
        items: [
          "All feedback should be specific and behavioral, not personal",
          "Use the 'SBI' format: Situation, Behavior, Impact",
          "Provide at least one piece of constructive feedback and one strength",
          "Feedback is confidential — shared only between the officer and advisor",
          "Focus on actions and outcomes, never personality or character",
        ],
      },
      {
        title: "Setting Second-Half Goals",
        items: [
          "Each officer sets 2–3 specific, measurable goals for the remainder of the year",
          "Goals are written down and shared with the President and advisor",
          "Officers check in on progress at the next officer meeting",
          "Goals are referenced at the end-of-year review and succession planning",
          "Recognize officers who met or exceeded their second-half goals publicly",
        ],
      },
    ],
  },

  "ll-a1": {
    subtitle: "Template for documenting, measuring, and showcasing your club's community impact.",
    sections: [
      {
        title: "What to Track and Why",
        items: [
          "Impact data tells the story of what your club actually accomplished",
          "Schools, competitions, and colleges value clubs with demonstrated community value",
          "Tracking data motivates members when they can see their collective contribution",
          "Accurate records support your annual report and award applications",
          "Impact data helps the club set meaningful, evidence-based goals each year",
        ],
      },
      {
        title: "Volunteer Hours Log",
        items: [
          "Record: Member Name, Date, Activity, Hours Contributed",
          "Assign a designated officer to verify and approve hours entries",
          "Update the log within 48 hours of each service event",
          "Share cumulative totals with the full club monthly to build momentum",
          "Total hours are a headline figure for annual reports and award applications",
        ],
      },
      {
        title: "Events and Reach Data",
        items: [
          "For each event: name, date, type, number of attendees, and estimated reach",
          "Track both club members and community members served",
          "Note any media coverage: school paper, local news, social media impressions",
          "Record feedback from event participants via a post-event survey",
          "Calculate total people reached across all activities for the year",
        ],
      },
      {
        title: "Compiling Your Impact Report",
        items: [
          "Summarize total volunteer hours for the school year",
          "List all events and the number of people reached",
          "Highlight 2–3 specific impact stories with quotes from participants",
          "Include any awards, recognitions, or press coverage received",
          "Present the report at the final club meeting and submit to the Activities Office",
          "Share a condensed version on social media at year-end",
        ],
      },
    ],
  },
};
