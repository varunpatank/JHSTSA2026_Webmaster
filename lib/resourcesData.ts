export type ResourceType = "guide" | "template" | "checklist" | "handbook";

export interface Resource {
  id: string;
  title: string;
  details: string;
  type: ResourceType;
  category: string;
  stage: string;
  downloads: number;
  format: string;
  tags: string[];
  img: string;
  rating: number;
  saved: number;
}

export const RESOURCES: Resource[] = [
  { id: "ig-1", title: "How to Start a Club", details: "Step-by-step process from idea validation to first meeting launch.", type: "guide", category: "Getting Started", stage: "Beginner", downloads: 342, format: "PDF", tags: ["basics", "admin"], img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80", rating: 4.8, saved: 92 },
  { id: "ig-2", title: "Club Constitution Template", details: "Write a constitution that will pass school approval on the first submission.", type: "template", category: "Getting Started", stage: "Beginner", downloads: 623, format: "DOCX", tags: ["constitution", "template"], img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80", rating: 4.9, saved: 187 },
  { id: "ig-3", title: "Faculty Advisor Requirements", details: "Checklist for advisor confirmation and school policy alignment.", type: "checklist", category: "Getting Started", stage: "Beginner", downloads: 215, format: "PDF", tags: ["advisor", "policy"], img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80", rating: 4.5, saved: 63 },
  { id: "ig-4", title: "School Approval Steps", details: "Submission sequence, review expectations, and publication conditions.", type: "guide", category: "Getting Started", stage: "Beginner", downloads: 189, format: "PDF", tags: ["approval", "submission"], img: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=600&q=80", rating: 4.3, saved: 47 },
  { id: "lo-1", title: "Social Media Best Practices", details: "Promote your club on Instagram, Discord, and other platforms effectively.", type: "guide", category: "Recruiting & Promoting", stage: "Growing", downloads: 567, format: "PDF", tags: ["social media", "promotion"], img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80", rating: 4.7, saved: 143 },
  { id: "lo-2", title: "Club Fair Preparation", details: "Everything you need for a successful club fair booth.", type: "checklist", category: "Recruiting & Promoting", stage: "Growing", downloads: 312, format: "PDF", tags: ["club fair", "recruiting"], img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80", rating: 4.6, saved: 88 },
  { id: "lo-3", title: "Member Retention Strategies", details: "Keep members engaged with events, recognition, and meaningful activities.", type: "guide", category: "Recruiting & Promoting", stage: "Growing", downloads: 245, format: "PDF", tags: ["retention", "engagement"], img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80", rating: 4.4, saved: 71 },
  { id: "lo-4", title: "Recruitment Flyer Templates", details: "Customizable flyer designs for announcing your club to new students.", type: "template", category: "Recruiting & Promoting", stage: "Growing", downloads: 489, format: "PDF", tags: ["flyer", "design"], img: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=600&q=80", rating: 4.6, saved: 122 },
  { id: "ob-1", title: "Running Effective Meetings", details: "Agenda templates, parliamentary procedure basics, and engagement techniques.", type: "template", category: "Meetings & Operations", stage: "Active", downloads: 421, format: "DOCX", tags: ["meetings", "agenda"], img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80", rating: 4.8, saved: 104 },
  { id: "ob-2", title: "Meeting Minutes Template", details: "Standard format for documenting discussions and decisions at every meeting.", type: "template", category: "Meetings & Operations", stage: "Active", downloads: 445, format: "DOCX", tags: ["minutes", "documentation"], img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80", rating: 4.7, saved: 98 },
  { id: "ob-3", title: "Officer Roles & Responsibilities", details: "Define clear roles for President, VP, Secretary, Treasurer, and more.", type: "handbook", category: "Meetings & Operations", stage: "Active", downloads: 278, format: "PDF", tags: ["officers", "roles"], img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80", rating: 4.5, saved: 77 },
  { id: "ex-1", title: "Event Planning Toolkit", details: "Comprehensive checklists for planning club events of any size.", type: "template", category: "Events & Funding", stage: "Active", downloads: 398, format: "DOCX", tags: ["events", "planning"], img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80", rating: 4.9, saved: 156 },
  { id: "ex-2", title: "Fundraising Playbook", details: "Proven strategies including bake sales, sponsorships, and grant writing.", type: "guide", category: "Events & Funding", stage: "Active", downloads: 534, format: "PDF", tags: ["fundraising", "grants"], img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80", rating: 4.8, saved: 178 },
  { id: "ex-3", title: "Budget Management Sheet", details: "Track club finances, submit purchase requests, and maintain transparency.", type: "template", category: "Events & Funding", stage: "Active", downloads: 267, format: "DOCX", tags: ["budget", "finance"], img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80", rating: 4.4, saved: 83 },
  { id: "mc-1", title: "Succession Planning", details: "How to transition leadership smoothly when officers graduate or step down.", type: "guide", category: "Leadership & Legacy", stage: "Advanced", downloads: 98, format: "PDF", tags: ["succession", "leadership"], img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80", rating: 4.6, saved: 55 },
  { id: "mc-2", title: "Annual Report Template", details: "End-of-year report template showcasing achievements and impact.", type: "template", category: "Leadership & Legacy", stage: "Advanced", downloads: 187, format: "DOCX", tags: ["annual report", "impact"], img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80", rating: 4.5, saved: 69 },
  { id: "mc-3", title: "Competition Prep Timeline", details: "12-week countdown with weekly milestones and practice schedules.", type: "guide", category: "Leadership & Legacy", stage: "Advanced", downloads: 201, format: "PDF", tags: ["competition", "prep"], img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80", rating: 4.7, saved: 91 },
  { id: "mc-4", title: "Judging Criteria Overview", details: "Understand how TSA and other organizations score student projects.", type: "handbook", category: "Leadership & Legacy", stage: "Advanced", downloads: 234, format: "PDF", tags: ["judging", "TSA"], img: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80", rating: 4.8, saved: 112 },
];

export const CATEGORIES = ["All", "Getting Started", "Recruiting & Promoting", "Meetings & Operations", "Events & Funding", "Leadership & Legacy"];
export const STAGES = ["All Stages", "Beginner", "Growing", "Active", "Advanced"];

export const TYPE_COLORS: Record<ResourceType, string> = {
  guide:     "bg-blue-100 text-blue-700",
  template:  "bg-amber-100 text-amber-700",
  checklist: "bg-green-100 text-green-700",
  handbook:  "bg-purple-100 text-purple-700",
};

export const STAGE_COLORS: Record<string, string> = {
  "All Stages": "bg-primary-800 text-white",
  Beginner: "bg-emerald-100 text-emerald-800",
  Growing: "bg-blue-100 text-blue-800",
  Active: "bg-amber-100 text-amber-800",
  Advanced: "bg-purple-100 text-purple-800",
};