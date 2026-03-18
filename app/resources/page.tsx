"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { chapters, schoolWideStats } from "@/lib/data";
import HeroSection from "@/components/HeroSection";
import {
  ArrowRight, Award, BarChart3, BookOpen, Bot, Calendar, CheckCircle,
  Compass, Download, ExternalLink, Eye, FileText, Flame, Globe,
  Heart, HelpCircle, Lightbulb, MapPin, MessageCircle, MessageSquare,
  Plus, Rocket, Search, Send, Shield, Star, Target, Trophy, Upload,
  Users, X, Zap, Gift, TrendingUp, Clock,
} from "lucide-react";


const ROCKET_STAGES = [
  {
    id: "ignition", phase: 1, title: "Ignition", subtitle: "Getting Started",
    icon: Flame, color: "from-primary-500 to-primary-600", bgColor: "bg-primary-50", borderColor: "border-primary-200", textColor: "text-primary-700", badgeColor: "bg-primary-100 text-primary-700",
    resources: [
      { id: "ig-1", title: "How to Start a Club", details: "Step-by-step process from idea validation to first meeting launch.", type: "guide", downloads: 342, fileSize: "1.2 MB", format: "PDF" },
      { id: "ig-2", title: "Club Constitution Template", details: "Write a constitution that will pass school approval.", type: "template", downloads: 623, fileSize: "340 KB", format: "DOCX" },
      { id: "ig-3", title: "Faculty Advisor Requirements", details: "Checklist for advisor confirmation and school policy alignment.", type: "checklist", downloads: 215, fileSize: "450 KB", format: "PDF" },
      { id: "ig-4", title: "School Approval Steps", details: "Submission sequence, review expectations, and publication conditions.", type: "guide", downloads: 189, fileSize: "800 KB", format: "PDF" },
    ],
    hubLinks: [
      { href: "/hub/ideas", label: "Ideas Board", icon: Lightbulb },
      { href: "/hub/discussions", label: "Discussions", icon: MessageCircle },
      { href: "/resources", label: "Resources", icon: BookOpen },
      { href: "/guides", label: "Club Guides", icon: FileText },
    ],
  },
  {
    id: "liftoff", phase: 2, title: "Lift Off", subtitle: "Recruiting & Building",
    icon: Rocket, color: "from-primary-600 to-primary-700", bgColor: "bg-primary-50", borderColor: "border-primary-200", textColor: "text-primary-700", badgeColor: "bg-primary-100 text-primary-700",
    resources: [
      { id: "lo-1", title: "Social Media Best Practices", details: "How to promote your club on Instagram, Discord, and other platforms.", type: "guide", downloads: 567, fileSize: "1.8 MB", format: "PDF" },
      { id: "lo-2", title: "Club Fair Preparation", details: "Everything you need for a successful club fair booth.", type: "checklist", downloads: 312, fileSize: "3.2 MB", format: "ZIP" },
      { id: "lo-3", title: "Member Retention Strategies", details: "Keep members engaged with events, recognition, and meaningful activities.", type: "guide", downloads: 245, fileSize: "720 KB", format: "PDF" },
      { id: "lo-4", title: "Recruitment Flyer Templates", details: "Customizable flyer designs for announcing your club.", type: "template", downloads: 489, fileSize: "5.4 MB", format: "ZIP" },
    ],
    hubLinks: [
      { href: "/events", label: "Events", icon: Calendar },
      { href: "/hub/stories", label: "Success Stories", icon: Star },
      { href: "/directory", label: "Club Directory", icon: Compass },
      { href: "/hub/my-collections", label: "My Collections", icon: Heart },
    ],
  },
  {
    id: "orbit", phase: 3, title: "Orbit", subtitle: "Meetings & Operations",
    icon: Globe, color: "from-secondary-500 to-secondary-600", bgColor: "bg-secondary-50", borderColor: "border-secondary-200", textColor: "text-secondary-700", badgeColor: "bg-secondary-100 text-secondary-700",
    resources: [
      { id: "ob-1", title: "Running Effective Meetings", details: "Agenda templates, parliamentary procedure basics, and engagement techniques.", type: "template", downloads: 421, fileSize: "950 KB", format: "DOCX" },
      { id: "ob-2", title: "Meeting Minutes Template", details: "Standard format for documenting meeting discussions and decisions.", type: "template", downloads: 445, fileSize: "120 KB", format: "DOCX" },
      { id: "ob-3", title: "Officer Roles & Responsibilities", details: "Define clear roles for President, VP, Secretary, Treasurer, and more.", type: "handbook", downloads: 278, fileSize: "2.1 MB", format: "PDF" },
      { id: "ob-4", title: "Conflict Resolution Guide", details: "Strategies for handling disagreements between members, officers, and advisors.", type: "guide", downloads: 134, fileSize: "520 KB", format: "PDF" },
    ],
    hubLinks: [
      { href: "/alumni", label: "Alumni Network", icon: Users },
      { href: "/hub/discussions", label: "Discussions", icon: MessageCircle },
      { href: "/hub/ideas", label: "Ideas Board", icon: Lightbulb },
      { href: "/guides", label: "Club Guides", icon: BookOpen },
    ],
  },
  {
    id: "expansion", phase: 4, title: "Expansion", subtitle: "Growing & Events",
    icon: Star, color: "from-primary-700 to-secondary-600", bgColor: "bg-primary-50", borderColor: "border-primary-200", textColor: "text-primary-700", badgeColor: "bg-primary-100 text-primary-700",
    resources: [
      { id: "ex-1", title: "Event Planning Toolkit", details: "Comprehensive checklists for planning club events of any size.", type: "template", downloads: 398, fileSize: "1.5 MB", format: "DOCX" },
      { id: "ex-2", title: "Fundraising Playbook", details: "Proven strategies including bake sales, sponsorships, and grant writing.", type: "guide", downloads: 534, fileSize: "2.3 MB", format: "PDF" },
      { id: "ex-3", title: "Budget Management Sheet", details: "Track club finances, submit purchase requests, and maintain transparency.", type: "template", downloads: 267, fileSize: "180 KB", format: "XLSX" },
      { id: "ex-4", title: "Sponsorship Outreach Kit", details: "Template emails and tips for approaching local businesses.", type: "template", downloads: 312, fileSize: "900 KB", format: "ZIP" },
    ],
    hubLinks: [
      { href: "/hub/stories", label: "Success Stories", icon: Star },
      { href: "/events", label: "Events", icon: Calendar },
      { href: "/hub/my-collections", label: "My Collections", icon: Heart },
      { href: "/resources", label: "Resources", icon: BookOpen },
    ],
  },
  {
    id: "mission-control", phase: 5, title: "Mission Control", subtitle: "Leadership & Legacy",
    icon: Shield, color: "from-secondary-600 to-primary-600", bgColor: "bg-secondary-50", borderColor: "border-secondary-200", textColor: "text-secondary-700", badgeColor: "bg-secondary-100 text-secondary-700",
    resources: [
      { id: "mc-1", title: "Succession Planning", details: "How to transition leadership smoothly when officers graduate or step down.", type: "guide", downloads: 98, fileSize: "380 KB", format: "PDF" },
      { id: "mc-2", title: "Annual Report Template", details: "End-of-year report template showcasing achievements and impact.", type: "template", downloads: 187, fileSize: "650 KB", format: "DOCX" },
      { id: "mc-3", title: "Competition Prep Timeline", details: "12-week countdown with weekly milestones and practice schedules.", type: "guide", downloads: 201, fileSize: "600 KB", format: "PDF" },
      { id: "mc-4", title: "Judging Criteria Overview", details: "Understand how TSA and other organizations score student projects.", type: "handbook", downloads: 234, fileSize: "520 KB", format: "PDF" },
    ],
    hubLinks: [
      { href: "/alumni", label: "Alumni Network", icon: Users },
      { href: "/hub/discussions", label: "Discussions", icon: MessageCircle },
      { href: "/hub/stories", label: "Success Stories", icon: Star },
      { href: "/hub/ideas", label: "Ideas Board", icon: Lightbulb },
    ],
  },
];

type ResourceItem = (typeof ROCKET_STAGES)[number]["resources"][number];
const typeIcons: Record<string, React.ReactNode> = { guide: <BookOpen size={12} />, template: <FileText size={12} />, checklist: <Lightbulb size={12} />, handbook: <Users size={12} /> };
const typeColors: Record<string, string> = { guide: "bg-primary-100 text-primary-700", template: "bg-secondary-100 text-secondary-700", checklist: "bg-primary-100 text-primary-700", handbook: "bg-secondary-100 text-secondary-700" };


const PDF_CONTENT: Record<string, { pages: { title: string; body: string }[] }> = {
  "ig-1": {
    pages: [
      { title: "How to Start a Club — Introduction", body: "Starting a club is one of the most rewarding activities you can pursue in high school. This guide walks you through the entire process, from brainstorming your club idea to hosting your very first meeting.\n\nBefore you begin, ask yourself: What am I passionate about? Is there a gap in the current club offerings at my school? Would other students be interested?\n\nA successful club starts with a clear mission and a genuine desire to build community around a shared interest." },
      { title: "Step 1: Validate Your Idea", body: "Before investing time, make sure there's real interest:\n\n• Survey at least 10-15 classmates informally\n• Check if a similar club already exists\n• Research whether your school has any restrictions on club types\n• Identify at least 5 committed founding members\n• Draft a one-paragraph mission statement\n\nTip: Use Google Forms to create a quick interest survey and share it on social media or in class group chats." },
      { title: "Step 2: Find a Faculty Advisor", body: "Most schools require a faculty advisor for every student organization.\n\nIdeal advisor qualities:\n• Genuinely interested in your club's topic\n• Available during your planned meeting times\n• Willing to attend most meetings and events\n• Experienced with school administration processes\n\nApproach teachers professionally — prepare a one-page summary of your club idea and what you'd need from them. Remember, advisors volunteer their time, so be respectful and flexible." },
      { title: "Step 3: Submit for Approval & Launch", body: "With your founding members and advisor confirmed:\n\n1. Draft your club constitution (see our Constitution Template)\n2. Complete the school's official club application form\n3. Submit to the Student Activities office\n4. Attend any required orientation sessions\n5. Plan your first meeting — make it welcoming and fun!\n\nFirst Meeting Agenda:\n• Icebreaker activity (15 min)\n• Present the club's mission and goals (10 min)\n• Elect interim officers (15 min)\n• Brainstorm first semester activities (15 min)\n• Set recurring meeting schedule (5 min)" },
    ],
  },
  "ig-3": {
    pages: [
      { title: "Faculty Advisor Requirements — Overview", body: "Every school-recognized club must have a faculty advisor. This checklist ensures your advisor selection and onboarding meets all school policy requirements.\n\nAdvisor Eligibility:\n☐ Must be a current full-time faculty or staff member\n☐ Must have been employed at the school for at least one semester\n☐ Cannot advise more than 2 clubs simultaneously\n☐ Must pass a background check (if not already on file)" },
      { title: "Advisor Responsibilities & Agreement", body: "Your faculty advisor agrees to:\n\n☐ Attend at least 75% of regular club meetings\n☐ Be present at all off-campus events and field trips\n☐ Review and approve all financial transactions\n☐ Ensure compliance with school policies\n☐ Sign off on event proposals and room reservations\n☐ Mediate conflicts between members or officers\n☐ Submit a semester-end activity report to administration\n\nAdvisor Compensation:\nMost schools offer a small stipend ($200-$500/year) for club advisors. Check with your activities coordinator for details." },
      { title: "Confirmation Checklist", body: "Complete these steps to confirm your advisor:\n\n☐ Verbal agreement from the faculty member\n☐ Signed Faculty Advisor Agreement Form\n☐ Copy submitted to Student Activities office\n☐ Advisor added to club communication channels\n☐ Advisor introduced at first club meeting\n☐ Emergency contact information on file\n☐ Advisor briefed on club constitution and bylaws\n\nKeep a dated copy of all signed documents for your club records." },
    ],
  },
  "ig-4": {
    pages: [
      { title: "School Approval Steps — Timeline", body: "Getting your club officially recognized typically takes 2-4 weeks. Here's the standard sequence:\n\nWeek 1: Preparation\n• Finalize club name, mission, and constitution\n• Confirm 5+ founding members and faculty advisor\n• Gather all required signatures\n\nWeek 2: Submission\n• Submit application packet to Student Activities\n• Include: application form, constitution, member list, advisor agreement\n• Request a confirmation receipt" },
      { title: "Review & Approval Process", body: "Week 3: Administrative Review\n• Activities coordinator reviews application\n• May request modifications to constitution or plans\n• Possible interview with club founders\n\nWeek 4: Decision\n• Approval notification (email or letter)\n• Assignment of meeting room/space\n• Addition to school club directory\n• Budget allocation (if applicable)\n\nIf Denied:\n• Request specific feedback in writing\n• Address concerns and resubmit within 2 weeks\n• Appeal to Student Government if needed" },
      { title: "Post-Approval Requirements", body: "After official recognition, your club must:\n\n☐ Maintain minimum 5 active members at all times\n☐ Hold at least 2 meetings per month during the school year\n☐ Submit attendance records monthly\n☐ Complete a mid-year progress report (December)\n☐ Complete an end-of-year summary (May)\n☐ Participate in at least 1 school-wide event per semester\n☐ Maintain a clean financial record\n☐ Re-register annually before September 30th\n\nFailure to meet these requirements may result in probation or loss of official status." },
    ],
  },
  "lo-1": {
    pages: [
      { title: "Social Media Best Practices — Strategy", body: "Social media is your club's most powerful recruitment and engagement tool. This guide covers proven strategies across platforms.\n\nPlatform Priority:\n1. Instagram — Visual content, Stories, Reels (best reach)\n2. Discord — Community building, real-time communication\n3. TikTok — Viral content, event promotion\n4. GroupMe — Meeting reminders, quick polls\n\nContent Calendar:\nPost 3-4 times per week during active periods. Use a consistent color scheme and template for brand recognition." },
      { title: "Content Ideas & Templates", body: "High-Performing Content Types:\n\n📸 Meeting Recaps — Photo carousel with highlights\n🎥 Behind-the-Scenes — Prep for events, competitions\n👤 Member Spotlights — Feature one member weekly\n📅 Event Announcements — Eye-catching graphics with details\n🏆 Achievement Posts — Competitions, milestones, awards\n📊 Polls & Questions — Drive engagement in Stories\n💡 Tips & Facts — Educational content related to your club\n\nBranding Tips:\n• Create templates in Canva (free for students)\n• Use 2-3 consistent brand colors\n• Include your club logo on every post\n• Use relevant hashtags: #ClubConnect #SchoolClubs #[YourClub]" },
      { title: "Growing Your Following & Engagement", body: "Growth Strategies:\n\n• Follow-for-follow with other school clubs\n• Cross-promote with partnering organizations\n• Run social media contests (tag a friend, share to story)\n• Go live during events for real-time engagement\n• Create a club hashtag challenge\n• Post member takeovers on Stories\n\nDo's and Don'ts:\n✅ Respond to comments and DMs within 24 hours\n✅ Credit photographers and contributors\n✅ Get permission before posting photos of members\n❌ Never post controversial or political content\n❌ Don't spam or over-post (max 1-2 per day)\n❌ Avoid posting during school hours" },
    ],
  },
  "lo-3": {
    pages: [
      { title: "Member Retention Strategies — Why Members Leave", body: "Understanding why members disengage is the first step to keeping them.\n\nTop Reasons Members Leave:\n1. Meetings feel repetitive or boring (38%)\n2. Don't feel valued or included (27%)\n3. Schedule conflicts (18%)\n4. Lost interest in the topic (12%)\n5. Social dynamics / cliques (5%)\n\nKey Insight: 65% of members who leave cite fixable reasons. Invest in engagement and inclusion to dramatically improve retention." },
      { title: "Engagement Techniques", body: "Proven Retention Strategies:\n\n🎯 Assign roles to every member — even small responsibilities create ownership\n🎉 Celebrate milestones — birthdays, membership anniversaries, achievements\n📋 Rotate meeting formats — workshops, guest speakers, field trips, socials\n🗳️ Let members vote on activities — democratic involvement increases buy-in\n👥 Buddy system for new members — pair them with experienced members\n📱 Active group chat — share memes, articles, and casual conversation\n\nMonthly Check-in Template:\n• \"What's one thing you enjoyed this month?\"\n• \"What would you change about our meetings?\"\n• \"Any ideas for upcoming events?\"" },
      { title: "Recognition & Reward Programs", body: "Create a recognition system that motivates continued participation:\n\n🏅 Attendance Awards — Perfect attendance certificates each semester\n⭐ Member of the Month — Voted by peers, featured on social media\n📜 Service Hours — Track and certify community service\n🎖️ Leadership Ladder — Clear pathway from member to officer\n🎁 Small Rewards — Gift cards, school store credits, priority seating at events\n\nEnd-of-Year Awards:\n• Most Dedicated Member\n• Best New Member\n• Leadership Excellence\n• Creative Contributor\n• Community Impact Award\n\nTip: Public recognition on social media and at school assemblies goes a long way!" },
    ],
  },
  "ob-3": {
    pages: [
      { title: "Officer Roles & Responsibilities — Overview", body: "Clear role definitions prevent confusion and ensure smooth operations. Every club should define these core positions:\n\n👤 President\n• Leads all general meetings and executive board meetings\n• Represents the club to school administration\n• Sets the vision and agenda for each semester\n• Final decision-maker in tie-breaking votes\n• Delegates tasks and follows up on progress" },
      { title: "Vice President, Secretary & Treasurer", body: "👤 Vice President\n• Assists President and assumes duties in their absence\n• Manages committees and special projects\n• Coordinates with other clubs for joint events\n• Oversees membership recruitment\n\n📝 Secretary\n• Records minutes at every meeting\n• Maintains official member roster\n• Handles correspondence (emails, announcements)\n• Manages the club calendar and room reservations\n• Archives documents and records\n\n💰 Treasurer\n• Manages club budget and financial records\n• Collects dues and processes reimbursements\n• Submits purchase requests to the advisor\n• Provides monthly financial reports\n• Coordinates fundraising logistics" },
      { title: "Additional Roles & Election Process", body: "Optional Positions:\n• Social Media Manager — handles all online presence\n• Event Coordinator — plans and executes events\n• Historian — documents club history, photos, scrapbook\n• Community Liaison — manages partnerships and outreach\n\nElection Process:\n1. Open nominations 2 weeks before election\n2. Self-nominations allowed with a brief speech\n3. Campaign period: 1 week (posters, social media)\n4. Election day: secret ballot, majority wins\n5. Runoff vote if no candidate gets 50%+\n6. Results announced within 24 hours\n7. Transition period: 1 week overlap with outgoing officers\n\nTerm: One academic year (August–May)\nImpeachment: Requires 2/3 vote of all active members" },
    ],
  },
  "ob-4": {
    pages: [
      { title: "Conflict Resolution Guide — Types of Conflict", body: "Conflicts are normal in any organization. The key is addressing them quickly and fairly.\n\nCommon Conflict Types:\n\n🔴 Member vs. Member\n• Personality clashes, disagreements on projects\n• Competition for leadership roles\n\n🟡 Member vs. Officer\n• Perceived unfair treatment or favoritism\n• Disagreement with decisions or policies\n\n🟠 Officer vs. Officer\n• Power struggles, overlapping responsibilities\n• Different visions for the club's direction\n\n🔵 Club vs. Administration\n• Policy violations, event denials, budget disputes" },
      { title: "Resolution Steps & Mediation", body: "5-Step Resolution Process:\n\n1. Listen — Let each party explain their perspective without interruption\n2. Identify — Clarify the core issue (often different from the surface complaint)\n3. Brainstorm — Generate multiple possible solutions together\n4. Agree — Choose a solution both parties can accept\n5. Follow Up — Check in after 1-2 weeks to ensure the resolution holds\n\nMediation Guidelines:\n• Choose a neutral mediator (advisor or uninvolved officer)\n• Meet in a private, comfortable space\n• Set ground rules: no interrupting, no personal attacks\n• Focus on behaviors and impacts, not personalities\n• Document the agreement and any action items" },
      { title: "Prevention & Escalation Procedures", body: "Prevention Strategies:\n✅ Establish clear expectations from day one\n✅ Create a club code of conduct (have members sign it)\n✅ Address small issues before they escalate\n✅ Encourage open feedback through anonymous surveys\n✅ Rotate responsibilities to prevent burnout and resentment\n\nWhen to Escalate:\n• If the conflict involves safety concerns → advisor immediately\n• If mediation fails after two attempts → advisor + administration\n• If it involves harassment or discrimination → school counselor + administration\n• If it affects the club's ability to function → student activities office\n\nDocumentation: Keep a written record of all formal complaints and resolutions. This protects both the club and individuals involved." },
    ],
  },
  "ex-2": {
    pages: [
      { title: "Fundraising Playbook — Getting Started", body: "Fundraising is essential for clubs that want to fund events, competitions, trips, and supplies. This playbook covers proven strategies.\n\nBefore You Start:\n• Set a specific monetary goal (e.g., $500 for competition travel)\n• Get advisor and administration approval for all fundraisers\n• Check school policies on types of fundraisers allowed\n• Create a timeline with milestones\n\nFundraising Categories:\n1. 🍰 Product Sales — bake sales, candy grams, merchandise\n2. 🎉 Events — car washes, talent shows, game nights\n3. 💼 Sponsorships — local business partnerships\n4. 📝 Grants — school, district, and nonprofit grants\n5. 💻 Online — GoFundMe, DonorsChoose, social media campaigns" },
      { title: "Top Fundraising Ideas (Ranked by ROI)", body: "Highest ROI Fundraisers:\n\n1. Candy Grams (Valentine's/Holiday) — Cost: $30 → Revenue: $200-400\n2. Custom Merchandise (t-shirts, stickers) — Cost: $150 → Revenue: $400-800\n3. Bake Sales — Cost: $20 → Revenue: $150-300\n4. Car Wash — Cost: $15 → Revenue: $200-500\n5. Talent Show / Open Mic — Cost: $50 → Revenue: $300-600\n6. Game Tournament — Cost: $25 → Revenue: $100-250\n7. Sponsor-a-Member Walkathon — Cost: $10 → Revenue: $500-2000\n\nPro Tips:\n• Combine fundraising with fun (people donate more when entertained)\n• Always have a clear \"what this funds\" message\n• Thank every donor publicly (with permission)\n• Track all income and expenses meticulously" },
      { title: "Sponsorship & Grant Writing", body: "Approaching Local Businesses:\n\n1. Research businesses aligned with your club's mission\n2. Prepare a sponsorship packet including:\n   • Club overview and mission\n   • Sponsorship tiers (Bronze $50, Silver $100, Gold $250)\n   • Benefits for sponsors (logo on shirts, social media shoutouts)\n   • Contact information and tax-deductible receipt offer\n3. Send a professional email, then follow up within a week\n4. Always write a thank-you letter after receiving support\n\nGrant Opportunities:\n• School Activity Fund — apply through Student Activities\n• PTA/PTO Grants — usually $100-$500\n• DonorsChoose.org — for educational materials\n• Youth Service America — for service-oriented projects\n• Local community foundations — check your city's website\n\nGrant Writing Tip: Be specific about how funds will be used and who benefits." },
    ],
  },
  "mc-1": {
    pages: [
      { title: "Succession Planning — Why It Matters", body: "Clubs that don't plan for leadership transitions often struggle or dissolve when officers graduate. Start succession planning early.\n\nThe Problem:\n• 40% of school clubs become inactive within 2 years of founding\n• #1 cause: leadership vacuum when founders leave\n• Knowledge, relationships, and institutional memory are lost\n\nThe Solution:\nBuild systems that survive beyond any individual — documented processes, trained successors, and a strong club culture." },
      { title: "Building Your Succession Plan", body: "12-Month Succession Timeline:\n\nSeptember-November: Identify & Develop\n• Identify potential future leaders among underclassmen\n• Assign them shadow roles alongside current officers\n• Include them in executive board discussions\n\nDecember-February: Train & Delegate\n• Have successors lead at least one meeting each\n• Share access to all club accounts and documents\n• Create a \"Club Operations Manual\" together\n\nMarch-April: Transition\n• Hold officer elections (ensure underclassmen run)\n• 2-week overlap where old and new officers co-govern\n• Transfer all digital accounts, files, and contacts\n\nMay: Handoff & Celebration\n• New officers run the final meetings independently\n• Outgoing officers serve as advisors (not decision-makers)\n• Celebrate the outgoing team's contributions" },
      { title: "The Club Operations Manual", body: "Every club should maintain a living document that includes:\n\n📋 Core Information:\n• Club mission, vision, and values\n• Constitution and bylaws\n• Member roster and contact list\n• Meeting schedule and room reservation process\n\n📁 Operational Details:\n• How to book rooms and equipment\n• Social media login credentials (use a password manager)\n• Budget history and financial procedures\n• Event planning checklists and templates\n• Vendor contacts and sponsor relationships\n\n📝 Institutional Knowledge:\n• What worked well (and what didn't) each year\n• Relationships with administrators and advisors\n• Competition preparation timelines\n• Recurring annual events and traditions\n\nStore this in a shared Google Drive folder that transfers to new officers each year." },
    ],
  },
  "mc-3": {
    pages: [
      { title: "Competition Prep Timeline — 12-Week Countdown", body: "Whether it's TSA, DECA, Science Olympiad, or Debate, this timeline ensures your team is fully prepared.\n\nWeek 12-10: Foundation\n☐ Register for competition and confirm deadlines\n☐ Form teams and assign roles/events\n☐ Review judging rubrics and scoring criteria\n☐ Set weekly practice schedule (minimum 2x/week)\n☐ Create a shared resource folder for all materials\n\nWeek 9-7: Deep Work\n☐ Complete first draft of any written deliverables\n☐ Begin building prototypes or presentations\n☐ Study previous winning entries for your events\n☐ Conduct peer review sessions\n☐ Schedule a mock competition or dry run" },
      { title: "Weeks 6-3: Refine & Practice", body: "Week 6-4: Refinement\n☐ Revise all deliverables based on peer feedback\n☐ Practice presentations with timer (stay within limits)\n☐ Prepare for Q&A and judge questions\n☐ Run at least 2 full mock competitions\n☐ Get advisor feedback and make final adjustments\n\nWeek 3-2: Polish\n☐ Final edits on all submissions\n☐ Print/assemble physical materials\n☐ Prepare professional attire (dress code check)\n☐ Create a packing checklist for competition day\n☐ Review logistics: transportation, schedule, room assignments\n☐ Practice 30-second elevator pitch for each project" },
      { title: "Final Week & Competition Day", body: "Week 1: Final Preparation\n☐ Complete packing — check list twice\n☐ Charge all devices, bring backup batteries\n☐ Print extra copies of all documents\n☐ Team dinner/bonding activity for morale\n☐ Get a good night's sleep!\n\nCompetition Day Checklist:\n☐ Arrive 30+ minutes early\n☐ Check in and locate your rooms/stations\n☐ Review schedule and set phone alarms\n☐ Team huddle — positive energy and encouragement\n☐ After each event, debrief as a team\n\nPost-Competition:\n☐ Write down lessons learned while fresh\n☐ Thank your advisor, parents, and sponsors\n☐ Post results on social media (win or lose — celebrate the effort)\n☐ Start planning for next year immediately!" },
    ],
  },
  "mc-4": {
    pages: [
      { title: "Judging Criteria Overview — How Competitions Score", body: "Understanding how judges evaluate your work is the single most important factor in competition success.\n\nCommon Judging Categories:\n\n📊 Content & Knowledge (30-40% of score)\n• Accuracy of information presented\n• Depth of research and analysis\n• Understanding of the topic demonstrated in Q&A\n\n🎨 Presentation & Design (20-30%)\n• Visual appeal and professionalism\n• Clarity of communication\n• Effective use of media/technology\n\n💡 Creativity & Innovation (15-25%)\n• Original thinking and unique approaches\n• Problem-solving methodology\n• Going beyond the minimum requirements" },
      { title: "TSA-Specific Scoring Rubrics", body: "TSA (Technology Student Association) Events:\n\nWebmaster:\n• Design & Layout: 20 pts (responsive, accessible, clean)\n• Content: 20 pts (relevant, well-written, organized)\n• Functionality: 20 pts (navigation, forms, features work)\n• Creativity: 15 pts (unique design choices, innovation)\n• Documentation: 15 pts (plan of work, bibliography)\n• Presentation: 10 pts (Q&A, team knowledge, professionalism)\n\nVideo Game Design:\n• Gameplay: 25 pts (fun, challenging, replayable)\n• Graphics & Sound: 20 pts (quality, consistency, polish)\n• Technical Achievement: 20 pts (complexity, bug-free)\n• Documentation: 15 pts (storyline, storyboard, references)\n• Presentation: 20 pts (demo, Q&A, team collaboration)\n\nTip: Print the rubric and score yourself before submission. If you wouldn't give yourself full marks, keep improving." },
      { title: "Maximizing Your Score — Pro Tips", body: "Judge Psychology — What They Notice:\n\n✅ First impressions matter — your opening 30 seconds set the tone\n✅ Professionalism counts — dress code, body language, eye contact\n✅ Enthusiasm is contagious — judges prefer passionate teams\n✅ Anticipate questions — prepare answers for the obvious ones\n✅ Admit what you don't know — honesty > bluffing\n\nCommon Mistakes That Cost Points:\n❌ Going over time limits (instant deductions)\n❌ Reading directly from notes or slides\n❌ Not involving all team members in the presentation\n❌ Ignoring the rubric — judges score what's listed, not what you think matters\n❌ Poor documentation — many teams lose 10-15 points here\n\nThe Winning Formula:\n1. Study the rubric until you can recite it\n2. Score yourself honestly against every criterion\n3. Get outside feedback (teachers, parents, other clubs)\n4. Practice presenting until it feels natural\n5. Submit documentation early — don't rush the paperwork" },
    ],
  },
};


function downloadResource(id: string, title: string, format: string) {
  const pdf = PDF_CONTENT[id];
  if (pdf) {
    const text = pdf.pages.map((p, i) => `${"=".repeat(60)}\n  PAGE ${i + 1}: ${p.title}\n${"=".repeat(60)}\n\n${p.body}\n`).join("\n\n");
    const header = `ClubConnect Resource Library\n${title}\nFormat: ${format} | Generated: ${new Date().toLocaleDateString()}\n${"─".repeat(60)}\n\n`;
    const blob = new Blob([header + text], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_")}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    const content = `ClubConnect Resource Library\n${title}\nFormat: ${format}\n\nThis resource is available for download.\nVisit ClubConnect for the full document.`;
    const blob = new Blob([content], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_")}.${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  }
}


function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("revealed"); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal-on-scroll ${className}`}>{children}</div>;
}


interface AIChatMsg { role: "user" | "assistant"; text: string; link?: { label: string; href: string } }

function useResourceAI() {
  const [messages, setMessages] = useState<AIChatMsg[]>([
    { role: "assistant", text: "Hey there! Tell me what you need and I'll find the **best resource** for you!\n\nTry asking about starting a club, fundraising, competitions, or anything else." },
  ]);
  const [loading, setLoading] = useState(false);
  const [pendingResource, setPendingResource] = useState<ResourceItem | null>(null);

  const allResources = ROCKET_STAGES.flatMap(s => s.resources);

  const send = useCallback(async (input: string) => {
    setMessages(prev => [...prev, { role: "user", text: input }]);
    setLoading(true);

    if (pendingResource && /yes|yeah|sure|yep|ok|go|take me|please/i.test(input)) {
      const r = pendingResource;
      const stage = ROCKET_STAGES.find(s => s.resources.some(res => res.id === r.id));
      setPendingResource(null);
      setMessages(prev => [...prev, { role: "assistant", text: `Taking you to "${r.title}" in the ${stage?.title ?? ""} stage!`, link: { label: `Open ${r.title}`, href: `#resource-${r.id}` } }]);
      setLoading(false);
      return;
    }
    if (pendingResource && /no|nah|nope|different|other/i.test(input)) {
      setPendingResource(null);
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
      const resourceList = ROCKET_STAGES.map(s =>
        `Stage ${s.phase} "${s.title}" (${s.subtitle}): ${s.resources.map(r => `"${r.title}" [id:${r.id}, ${r.type}, ${r.format}] — ${r.details}`).join("; ")}`
      ).join("\n");
      const hubPages = ROCKET_STAGES.flatMap(s => s.hubLinks.map(l => `${l.label} (${l.href})`)).join(", ");
      const context = `You are the ClubConnect Smart Finder. When recommending a resource, respond with EXACTLY this format:\nRECOMMEND: <resource_id>\n<Your 2-3 sentence explanation of why this resource fits and what stage it's in. End by asking: "Would you like me to take you there?">\n\nIf no resource matches, just give a helpful answer without RECOMMEND.\n\nAll resources:\n${resourceList}\n\nHub pages: ${hubPages}\n\nAvailable clubs: ${chapters.map(c => c.name).join(", ")}.`;
      const conversationHistory = messages.filter((_, i) => i > 0).map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] }));
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: context }] },
              { role: "model", parts: [{ text: "Got it! I'll recommend the best resource and ask if you want to navigate there." }] },
              ...conversationHistory,
              { role: "user", parts: [{ text: input }] },
            ],
          }),
        }
      );
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) throw new Error("Empty response");
      const recommendMatch = raw.match(/RECOMMEND:\s*(\S+)/);
      let cleanText = raw.replace(/RECOMMEND:\s*\S+\n?/, "").trim();
      if (recommendMatch) {
        const found = allResources.find(r => r.id === recommendMatch[1]);
        if (found) {
          setPendingResource(found);
          if (!/would you like|want me to take|shall i/i.test(cleanText)) {
            cleanText += " Would you like me to take you there?";
          }
        }
      }
      setMessages(prev => [...prev, { role: "assistant", text: cleanText }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Something went wrong. Try browsing the rocket stages!" }]);
    }
    setLoading(false);
  }, [messages, pendingResource, allResources]);

  return { messages, loading, send, pendingResource };
}


const stageRocketColors: Record<string, { body: string; nose: string; flame1: string; flame2: string; fin: string; window: string }> = {
  ignition: { body: "#1e3a5f", nose: "#152d4a", flame1: "#3a6b9f", flame2: "#7ba3cc", fin: "#1a3352", window: "#5b8db8" },
  liftoff: { body: "#254a72", nose: "#1e3a5f", flame1: "#4a7fac", flame2: "#8bb5d5", fin: "#1e3a5f", window: "#6b9fc4" },
  orbit: { body: "#b8860b", nose: "#8b6508", flame1: "#d4a017", flame2: "#f0d060", fin: "#a07a0a", window: "#e0c040" },
  expansion: { body: "#1e3a5f", nose: "#b8860b", flame1: "#3a6b9f", flame2: "#d4a017", fin: "#152d4a", window: "#e0c040" },
  "mission-control": { body: "#b8860b", nose: "#1e3a5f", flame1: "#d4a017", flame2: "#3a6b9f", fin: "#8b6508", window: "#5b8db8" },
};

function StageRocket({ stageId, phase }: { stageId: string; phase: number }) {
  const c = stageRocketColors[stageId] || stageRocketColors.ignition;
  return (
    <div className={`stage-rocket stage-rocket-${phase}`}>
      <svg width="100" height="140" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {}
        <circle className="rocket-stars" cx="10" cy="20" r="1.5" fill="white" opacity="0.6" />
        <circle className="rocket-stars" cx="90" cy="15" r="1" fill="white" opacity="0.5" style={{ animationDelay: "0.5s" }} />
        <circle className="rocket-stars" cx="15" cy="80" r="1.2" fill="white" opacity="0.4" style={{ animationDelay: "1s" }} />
        <circle className="rocket-stars" cx="88" cy="70" r="1.5" fill="white" opacity="0.5" style={{ animationDelay: "0.7s" }} />
        <circle className="rocket-stars" cx="25" cy="45" r="0.8" fill="white" opacity="0.3" style={{ animationDelay: "1.3s" }} />
        {}
        <circle className="rocket-smoke" cx="44" cy="120" r="6" fill={c.flame2} opacity="0.3" />
        <circle className="rocket-smoke" cx="56" cy="122" r="5" fill={c.flame2} opacity="0.2" style={{ animationDelay: "0.5s" }} />
        <circle className="rocket-smoke" cx="50" cy="125" r="7" fill={c.flame2} opacity="0.15" style={{ animationDelay: "1s" }} />
        <g className="rocket-body">
          {}
          <rect x="35" y="35" width="30" height="55" rx="4" fill={c.body} />
          {}
          <rect x="35" y="35" width="12" height="55" rx="4" fill="white" opacity="0.15" />
          {}
          <path d="M35 38 L50 10 L65 38Z" fill={c.nose} />
          <path d="M35 38 L50 10 L50 38Z" fill="white" opacity="0.12" />
          {}
          <circle cx="50" cy="50" r="8" fill={c.nose} stroke="white" strokeWidth="2" opacity="0.9" />
          <circle cx="50" cy="50" r="5.5" fill={c.window} />
          <ellipse cx="48" cy="48" rx="2" ry="2.5" fill="white" opacity="0.4" />
          {}
          <rect x="35" y="65" width="30" height="3" fill="white" opacity="0.3" />
          {}
          <path d="M35 80 L20 100 L35 90Z" fill={c.fin} />
          <path d="M65 80 L80 100 L65 90Z" fill={c.fin} />
          <path d="M35 80 L28 95 L35 90Z" fill="white" opacity="0.15" />
          {}
          <rect x="40" y="88" width="20" height="6" rx="2" fill={c.nose} />
          <rect x="42" y="93" width="16" height="3" rx="1.5" fill={c.fin} />
          {}
          <text x="50" y="80" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">{phase}</text>
        </g>
        {}
        <g className="rocket-flame">
          <ellipse cx="50" cy="105" rx="10" ry="14" fill={c.flame1} opacity="0.9" />
          <ellipse cx="50" cy="105" rx="6" ry="10" fill={c.flame2} opacity="0.95" />
          <ellipse cx="50" cy="107" rx="3" ry="6" fill="white" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}


export default function ResourcesPage() {
  const [activeStage, setActiveStage] = useState("ignition");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [popup, setPopup] = useState<ResourceItem | null>(null);
  const [previewPage, setPreviewPage] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [formatFilter, setFormatFilter] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const chatTopRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const { messages: aiMessages, loading: aiLoading, send: aiSend, pendingResource } = useResourceAI();

  useEffect(() => { chatTopRef.current?.scrollIntoView({ behavior: "instant", block: "start" }); }, [aiMessages]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popup && popupRef.current && !popupRef.current.contains(e.target as Node)) setPopup(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [popup]);


  const currentStage = ROCKET_STAGES.find(s => s.id === activeStage) || ROCKET_STAGES[0];
  const allResources = ROCKET_STAGES.flatMap(s => s.resources);

  const filteredResources = currentStage.resources.filter(r => {
    if (typeFilter !== "All" && r.type !== typeFilter) return false;
    if (formatFilter !== "All" && r.format !== formatFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.details.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "popular") return b.downloads - a.downloads;
    if (sortBy === "name") return a.title.localeCompare(b.title);
    return 0;
  });

  const globalSearch = searchQuery.trim()
    ? allResources.filter(r => {
        const q = searchQuery.toLowerCase();
        return r.title.toLowerCase().includes(q) || r.details.toLowerCase().includes(q);
      })
    : [];

  const totalDownloads = allResources.reduce((s, r) => s + r.downloads, 0);
  const StageIcon = currentStage.icon;

  return (
    <div className="bg-neutral-50">
      {}
      <HeroSection align="left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-secondary-300">
              <BookOpen size={12} /> Resource Hub &amp; Knowledge Base
            </div>
            <h1 className="hero-title"><span>Resource Center</span></h1>
            <p className="hero-description max-w-lg text-sm">Your launch pad for club success &mdash; guides, templates, tools, and smart recommendations organized by growth stage.</p>
          </div>
          <div className="flex flex-col gap-3 items-end">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Resources", value: allResources.length },
                { label: "Downloads", value: totalDownloads.toLocaleString() },
                { label: "Clubs", value: schoolWideStats.totalClubs },
              ].map(s => (
                <div key={s.label} className="hero-stat p-2 text-center">
                  <p className="text-lg font-bold">{s.value}</p>
                  <p className="text-[10px] text-neutral-300">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search resources..." className="w-full bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-secondary-400" />
            </div>
          </div>
        </div>
      </HeroSection>

      {}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="space-y-3">
          {/* Main content */}
          <div className="space-y-3">

                {}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {ROCKET_STAGES.map(stage => {
                    const Icon = stage.icon;
                    const isActive = activeStage === stage.id;
                    return (
                      <button key={stage.id} onClick={() => setActiveStage(stage.id)}
                        className={`flex items-center gap-2 px-3 py-2  border text-sm font-semibold shrink-0 transition-all ${isActive ? `${stage.bgColor} ${stage.borderColor} ${stage.textColor} shadow-sm` : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"}`}>
                        <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${stage.color} text-white flex items-center justify-center`}>
                          <Icon size={14} />
                        </div>
                        <span>{stage.phase}. {stage.title}</span>
                      </button>
                    );
                  })}
                </div>

                {}
                <div className={`overflow-hidden border ${currentStage.borderColor}`}>
                  <div className={`bg-gradient-to-r ${currentStage.color} text-white p-5`}>
                    <div className="flex items-center gap-4">
                      <div className="shrink-0">
                        <StageRocket stageId={currentStage.id} phase={currentStage.phase} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">STAGE {currentStage.phase}</span>
                        <h2 className="text-xl font-heading font-bold">{currentStage.title} &mdash; {currentStage.subtitle}</h2>
                        <p className="text-sm text-white/80 mt-1">{currentStage.resources.length} resources &bull; {currentStage.hubLinks.length} tools</p>
                      </div>
                    </div>
                    {/* Inline filters */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-white/15 border border-white/25 text-white text-xs py-1.5 px-2 focus:outline-none focus:border-white/50 [&>option]:text-neutral-800">
                        {["All", "guide", "template", "checklist", "handbook"].map(o => <option key={o} value={o}>{o === "All" ? "All Types" : o.charAt(0).toUpperCase() + o.slice(1) + "s"}</option>)}
                      </select>
                      <select value={formatFilter} onChange={e => setFormatFilter(e.target.value)} className="bg-white/15 border border-white/25 text-white text-xs py-1.5 px-2 focus:outline-none focus:border-white/50 [&>option]:text-neutral-800">
                        {["All", "PDF", "DOCX", "ZIP", "XLSX"].map(o => <option key={o} value={o}>{o === "All" ? "All Formats" : o}</option>)}
                      </select>
                      <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-white/15 border border-white/25 text-white text-xs py-1.5 px-2 focus:outline-none focus:border-white/50 [&>option]:text-neutral-800">
                        <option value="popular">Most Popular</option>
                        <option value="name">Alphabetical</option>
                      </select>
                      {(typeFilter !== "All" || formatFilter !== "All") && (
                        <button onClick={() => { setTypeFilter("All"); setFormatFilter("All"); setSortBy("popular"); }}
                          className="text-[10px] font-semibold text-white/80 hover:text-white underline">
                          Clear Filters
                        </button>
                      )}
                      <span className="ml-auto text-[10px] text-white/70">{filteredResources.length} of {currentStage.resources.length} resources</span>
                    </div>
                    {/* Smart Finder search bar */}
                    <form onSubmit={e => { e.preventDefault(); if (aiInput.trim()) { if (!showAI) setShowAI(true); aiSend(aiInput.trim()); setAiInput(""); } }} className="mt-4 flex items-center gap-2">
                      <div className="flex-1 relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Find a resource... (press Enter)" className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/50 focus:border-white/50 focus:bg-white/15 focus:outline-none transition-colors" />
                      </div>
                      <button type="submit" className="px-4 py-2.5 bg-white text-primary-700 text-xs font-bold hover:bg-white/90 disabled:opacity-50 transition-colors" disabled={aiLoading || !aiInput.trim()}>Search</button>
                    </form>
                    {showAI && (
                      <div className="mt-4 bg-white/10 backdrop-blur-sm border border-white/15 overflow-hidden">
                        <div className="max-h-56 overflow-y-auto p-3 space-y-2">
                          <div ref={chatTopRef} />
                          {aiMessages.map((msg, i) => {
                            const formatted = msg.role === "assistant" ? msg.text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/(Would you like me to take you there\??)/gi, "<strong>$1</strong>").replace(/\n/g, "<br/>") : msg.text;
                            return (
                            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                              <div className={`max-w-[75%] px-3 py-2 text-xs leading-relaxed ${msg.role === "user" ? "bg-white/25 text-white" : "bg-white text-neutral-700 shadow-sm"}`}>
                                {msg.role === "assistant" ? <span dangerouslySetInnerHTML={{ __html: formatted }} /> : msg.text}
                              </div>
                              {msg.link && (
                                <button
                                  onClick={() => { const rid = msg.link!.href.replace("#resource-", ""); const allRes = ROCKET_STAGES.flatMap(s => s.resources); const found = allRes.find(r => r.id === rid); if (found) { const stage = ROCKET_STAGES.find(s => s.resources.some(r => r.id === rid)); if (stage) setActiveStage(stage.id); setPopup(found); } }}
                                  className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 bg-white text-primary-700 text-[11px] font-bold hover:bg-white/90 transition-colors">
                                  <ArrowRight size={11} /> {msg.link.label}
                                </button>
                              )}
                              {!msg.link && i === aiMessages.length - 1 && pendingResource && msg.role === "assistant" && (
                                <button
                                  onClick={() => { const r = pendingResource; const stage = ROCKET_STAGES.find(s => s.resources.some(res => res.id === r.id)); if (stage) setActiveStage(stage.id); setPopup(r); }}
                                  className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 bg-white text-primary-700 text-[11px] font-bold hover:bg-white/90 transition-colors">
                                  <ArrowRight size={11} /> Go to {pendingResource.title}
                                </button>
                              )}
                            </div>
                            );
                          })}
                          {aiLoading && (
                            <div className="flex justify-start">
                              <div className="bg-white px-3 py-2 shadow-sm">
                                <div className="flex gap-1"><span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} /><span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} /></div>
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </div>
                        <div className="flex flex-wrap gap-1.5 px-3 pt-2 pb-1 bg-white/5 border-t border-white/10">
                          {["How do I start a club?", "Fundraising help", "Competition prep", "Meeting templates"].map(suggestion => (
                            <button key={suggestion} onClick={() => aiSend(suggestion)} className="px-2 py-1 bg-white/15 border border-white/20 text-[10px] font-semibold text-white hover:bg-white/25 transition-colors">
                              {suggestion}
                            </button>
                          ))}
                        </div>
                        <form onSubmit={e => { e.preventDefault(); if (aiInput.trim()) { aiSend(aiInput.trim()); setAiInput(""); } }} className="flex items-center gap-1.5 p-2.5 border-t border-white/10 bg-white/5">
                          <input value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Ask for a resource..." className="flex-1 px-3 py-2 bg-white/10 border border-white/20 text-xs text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none" />
                          <button type="submit" className="px-3 py-2 bg-white text-primary-700 text-xs font-semibold hover:bg-white/90 disabled:opacity-50" disabled={aiLoading || !aiInput.trim()}>
                            <Send size={14} />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>

                {}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentStage.hubLinks.map((link, idx) => {
                    const Icon = link.icon;
                    const btnColors = [
                      "from-blue-500 to-blue-600 border-blue-300",
                      "from-emerald-500 to-emerald-600 border-emerald-300",
                      "from-violet-500 to-violet-600 border-violet-300",
                      "from-rose-500 to-rose-600 border-rose-300",
                      "from-amber-500 to-amber-600 border-amber-300",
                      "from-teal-500 to-teal-600 border-teal-300",
                      "from-pink-500 to-pink-600 border-pink-300",
                      "from-cyan-500 to-cyan-600 border-cyan-300",
                    ];
                    const colorSet = btnColors[idx % btnColors.length];
                    const borderClass = colorSet.split(" ").pop() || "";
                    const gradientClass = colorSet.split(" ").slice(0, 2).join(" ");
                    return (
                      <Link key={link.href} href={link.href}
                        className={`card p-3 border hover:shadow-md hover:scale-[1.02] transition-all flex items-center gap-2 ${borderClass}`}>
                        <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${gradientClass} text-white flex items-center justify-center shrink-0`}>
                          <Icon size={13} />
                        </div>
                        <span className="font-semibold text-xs text-primary-800 truncate">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {}
                {searchQuery.trim() && globalSearch.length > 0 && (
                  <div className="card  p-3 border border-secondary-200 bg-secondary-50/50">
                    <h3 className="font-bold text-xs text-yellow-800 mb-2 flex items-center gap-1"><Search size={12} /> Results across all stages ({globalSearch.length})</h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {globalSearch.map(item => (
                        <button key={item.id} onClick={() => setPopup(item)} className="border border-yellow-200  p-2 hover:bg-white transition-all text-left">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${typeColors[item.type]}`}>{typeIcons[item.type]} {item.type}</span>
                          <h4 className="font-bold text-xs text-primary-700 mt-1">{item.title}</h4>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {}
                <div>
                  <h3 className={`text-sm font-bold ${currentStage.textColor} mb-2 flex items-center gap-1`}><FileText size={14} /> Downloadable Resources</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {filteredResources.map(item => (
                      <button key={item.id} onClick={() => setPopup(item)} className="card  p-4 hover:border-primary-300 text-left group hover:shadow-sm transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${typeColors[item.type]}`}>{typeIcons[item.type]} {item.type}</span>
                          <span className="text-[10px] text-neutral-400 flex items-center gap-1"><Download size={10} /> {item.downloads}</span>
                        </div>
                        <h3 className="font-bold text-sm text-primary-700 group-hover:text-primary-600">{item.title}</h3>
                        <p className="mt-1 text-xs text-neutral-600 line-clamp-2">{item.details}</p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400">
                          <span>{item.format} &middot; {item.fileSize}</span>
                          <span className="text-primary-500 font-semibold flex items-center gap-1"><Eye size={10} /> View</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {filteredResources.length === 0 && (
                    <div className="card  p-6 text-center">
                      <Search size={24} className="mx-auto text-neutral-300" />
                      <p className="text-sm text-neutral-500 mt-2">No resources match your filters.</p>
                    </div>
                  )}
                </div>

            {}
            <div className="card  p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200">
              <div>
                <h3 className="text-base font-heading font-bold text-primary-600">Ready to Launch Your Club?</h3>
                <p className="text-xs text-neutral-600">Join hundreds of student leaders building amazing communities.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/start-a-club" className="btn-primary  text-sm flex items-center gap-1 px-3 py-1.5"><Rocket size={14} /> Launch</Link>
                <Link href="/donate" className="btn-secondary  text-sm px-3 py-1.5">Support Us</Link>
              </div>
            </div>

            {}
            <div className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
              <div>
                <h3 className="text-base font-heading font-bold text-green-700 flex items-center gap-2"><Upload size={16} /> Know a Community Resource?</h3>
                <p className="text-xs text-neutral-600">Help grow our hub — suggest non-profits, support services, events, and programs for the community.</p>
              </div>
              <Link href="/propose" className="btn-primary text-sm flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 border-green-600 shrink-0">
                <Plus size={14} /> Suggest a Resource
              </Link>
            </div>
          </div>
        </div>
      </div>

      {}
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-up">
          <div ref={popupRef} className="bg-white  shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${typeColors[popup.type]}`}>{typeIcons[popup.type]} {popup.type}</span>
                  <h2 className="mt-2 text-lg font-heading font-bold text-primary-700">{popup.title}</h2>
                </div>
                <button onClick={() => { setPopup(null); setShowPreview(false); setPreviewPage(0); }} className="p-1  hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600"><X size={18} /></button>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">{popup.details}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="bg-primary-50  p-2"><p className="text-base font-bold text-primary-700">{popup.downloads}</p><p className="text-[10px] text-neutral-500">Downloads</p></div>
                <div className="bg-primary-50  p-2"><p className="text-base font-bold text-primary-700">{popup.format}</p><p className="text-[10px] text-neutral-500">Format</p></div>
                <div className="bg-secondary-50  p-2"><p className="text-base font-bold text-secondary-700">{popup.fileSize}</p><p className="text-[10px] text-neutral-500">Size</p></div>
              </div>

              {/* Preview for ALL resources */}
              {(() => {
                const pdfContent = PDF_CONTENT[popup.id];
                const pages = pdfContent
                  ? pdfContent.pages
                  : [{ title: popup.title, body: `${popup.details}\n\nFormat: ${popup.format}\nFile Size: ${popup.fileSize}\nType: ${popup.type}\nDownloads: ${popup.downloads}\n\nThis document is available for download. Click the download button below to get the full ${popup.format} file.` }];
                return (
                <div className="mt-4">
                  {!showPreview ? (
                    <button onClick={() => { setShowPreview(true); setPreviewPage(0); }}
                      className="btn-outline w-full flex items-center justify-center gap-2 text-xs  border-2 border-primary-200 hover:bg-primary-50">
                      <Eye size={14} /> Preview Document ({pages.length} {pages.length === 1 ? 'page' : 'pages'})
                    </button>
                  ) : (
                    <div className="border-2 border-neutral-200  overflow-hidden">
                      {}
                      <div className="bg-neutral-800 text-white px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <FileText size={14} />
                          <span className="font-semibold">{popup.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-neutral-300">Page {previewPage + 1} of {pages.length}</span>
                          <button onClick={() => { setShowPreview(false); setPreviewPage(0); }} className="p-0.5 rounded hover:bg-neutral-700"><X size={12} /></button>
                        </div>
                      </div>
                      {}
                      <div className="bg-neutral-100 p-4">
                        <div className="bg-white shadow-lg mx-auto max-w-lg p-6 min-h-[300px] border border-neutral-200" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                          {}
                          <div className="flex items-center justify-between border-b-2 border-primary-600 pb-2 mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center text-white text-[8px] font-bold">CC</div>
                              <span className="text-[9px] font-semibold text-primary-700 tracking-wide uppercase">ClubConnect Resource Library</span>
                            </div>
                            <span className="text-[9px] text-neutral-400">Page {previewPage + 1}</span>
                          </div>
                          {}
                          <h3 className="text-base font-bold text-primary-800 mb-3">{pages[previewPage].title}</h3>
                          {}
                          <div className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line">{pages[previewPage].body}</div>
                          {}
                          <div className="border-t border-neutral-200 mt-6 pt-2 flex items-center justify-between text-[8px] text-neutral-400">
                            <span>ClubConnect &copy; {new Date().getFullYear()}</span>
                            <span>{popup.fileSize} &middot; {popup.format}</span>
                          </div>
                        </div>
                      </div>
                      {}
                      {pages.length > 1 && (
                      <div className="bg-neutral-800 px-4 py-2 flex items-center justify-between">
                        <button onClick={() => setPreviewPage(p => Math.max(0, p - 1))}
                          disabled={previewPage === 0}
                          className="px-3 py-1 text-xs text-white bg-neutral-700 rounded hover:bg-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed">
                          &larr; Previous
                        </button>
                        <div className="flex gap-1">
                          {pages.map((_, i) => (
                            <button key={i} onClick={() => setPreviewPage(i)}
                              className={`w-6 h-6 rounded text-[10px] font-bold transition-colors ${previewPage === i ? "bg-primary-500 text-white" : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"}`}>
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => setPreviewPage(p => Math.min(pages.length - 1, p + 1))}
                          disabled={previewPage === pages.length - 1}
                          className="px-3 py-1 text-xs text-white bg-neutral-700 rounded hover:bg-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed">
                          Next &rarr;
                        </button>
                      </div>
                      )}
                    </div>
                  )}
                </div>
                );
              })()}

              <div className="mt-4 space-y-2">
                <button onClick={() => downloadResource(popup.id, popup.title, popup.format)} className="btn-primary w-full flex items-center justify-center gap-2  text-sm"><Download size={14} /> Download {popup.format}</button>
                {popup.format !== "PDF" && (
                  <button onClick={() => downloadResource(popup.id, popup.title, popup.format)} className="btn-outline w-full flex items-center justify-center gap-2 text-xs "><Download size={12} /> Save File</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
