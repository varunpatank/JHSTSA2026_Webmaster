'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ExternalResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  subcategory: string;
  tags: string[];
  type: 'Website' | 'Tool' | 'Template' | 'Video' | 'Course' | 'Article' | 'Community';
  free: boolean;
  featured?: boolean;
}

const externalResources: ExternalResource[] = [
  // LEADERSHIP & MANAGEMENT
  { id: '1', title: 'Harvard Leadership Principles', description: 'Free leadership courses from Harvard Business School Online', url: 'https://online.hbs.edu/subjects/leadership-management/', category: 'Leadership', subcategory: 'Courses', tags: ['leadership', 'management', 'free course'], type: 'Course', free: true, featured: true },
  { id: '2', title: 'TED Talks - Leadership Playlist', description: 'Curated playlist of the best TED talks on leadership', url: 'https://www.ted.com/topics/leadership', category: 'Leadership', subcategory: 'Videos', tags: ['leadership', 'inspiration', 'video'], type: 'Video', free: true },
  { id: '3', title: 'MindTools Leadership Skills', description: 'Comprehensive leadership skills toolkit and assessments', url: 'https://www.mindtools.com/pages/main/newMN_LDR.htm', category: 'Leadership', subcategory: 'Skills', tags: ['leadership', 'skills', 'assessment'], type: 'Website', free: true },
  { id: '4', title: 'Coursera - Organizational Leadership', description: 'Northwestern University leadership specialization', url: 'https://www.coursera.org/specializations/organizational-leadership', category: 'Leadership', subcategory: 'Courses', tags: ['leadership', 'organization', 'certificate'], type: 'Course', free: false },
  { id: '5', title: 'Simon Sinek - Start With Why', description: 'Official resources from bestselling author Simon Sinek', url: 'https://simonsinek.com/inspire/', category: 'Leadership', subcategory: 'Inspiration', tags: ['leadership', 'purpose', 'motivation'], type: 'Website', free: true },
  
  // EVENT PLANNING
  { id: '6', title: 'Eventbrite - Free Event Planning', description: 'Create and manage events for free with ticketing', url: 'https://www.eventbrite.com/', category: 'Event Planning', subcategory: 'Tools', tags: ['events', 'ticketing', 'registration'], type: 'Tool', free: true, featured: true },
  { id: '7', title: 'Canva Event Templates', description: 'Thousands of free event flyer and poster templates', url: 'https://www.canva.com/templates/?query=event', category: 'Event Planning', subcategory: 'Design', tags: ['design', 'flyers', 'posters'], type: 'Template', free: true },
  { id: '8', title: 'Google Forms', description: 'Create registration forms and surveys for free', url: 'https://docs.google.com/forms/', category: 'Event Planning', subcategory: 'Tools', tags: ['forms', 'registration', 'surveys'], type: 'Tool', free: true },
  { id: '9', title: 'Doodle Scheduling', description: 'Find the best time for group meetings', url: 'https://doodle.com/', category: 'Event Planning', subcategory: 'Scheduling', tags: ['scheduling', 'meetings', 'polls'], type: 'Tool', free: true },
  { id: '10', title: 'When2meet', description: 'Simple group availability scheduling', url: 'https://www.when2meet.com/', category: 'Event Planning', subcategory: 'Scheduling', tags: ['scheduling', 'free', 'simple'], type: 'Tool', free: true },
  { id: '11', title: 'Splash Event Marketing', description: 'Event marketing and management platform', url: 'https://splashthat.com/', category: 'Event Planning', subcategory: 'Marketing', tags: ['events', 'marketing', 'professional'], type: 'Tool', free: false },
  
  // FUNDRAISING
  { id: '12', title: 'GoFundMe Charity', description: 'Crowdfunding platform for charitable causes', url: 'https://www.gofundme.com/start/charity-fundraising', category: 'Fundraising', subcategory: 'Crowdfunding', tags: ['crowdfunding', 'donations', 'charity'], type: 'Tool', free: true, featured: true },
  { id: '13', title: 'DoSomething.org Grants', description: 'Grants specifically for youth-led initiatives', url: 'https://www.dosomething.org/', category: 'Fundraising', subcategory: 'Grants', tags: ['grants', 'youth', 'social impact'], type: 'Website', free: true },
  { id: '14', title: 'Youth Service America Grants', description: 'Database of grants for youth service projects', url: 'https://ysa.org/grants/', category: 'Fundraising', subcategory: 'Grants', tags: ['grants', 'service', 'youth'], type: 'Website', free: true },
  { id: '15', title: 'Donors Choose', description: 'Funding platform for educational projects', url: 'https://www.donorschoose.org/', category: 'Fundraising', subcategory: 'Education', tags: ['education', 'classroom', 'projects'], type: 'Tool', free: true },
  { id: '16', title: 'Classy Fundraising', description: 'Professional nonprofit fundraising platform', url: 'https://www.classy.org/', category: 'Fundraising', subcategory: 'Platform', tags: ['nonprofit', 'fundraising', 'professional'], type: 'Tool', free: false },
  { id: '17', title: 'Fundraising Ideas - SignUpGenius', description: '100+ fundraising ideas for clubs and groups', url: 'https://www.signupgenius.com/fundraising/fundraising-ideas.cfm', category: 'Fundraising', subcategory: 'Ideas', tags: ['ideas', 'fundraising', 'list'], type: 'Article', free: true },
  
  // MARKETING & SOCIAL MEDIA
  { id: '18', title: 'Canva - Free Design Tool', description: 'Create stunning graphics, presentations, and more', url: 'https://www.canva.com/', category: 'Marketing', subcategory: 'Design', tags: ['design', 'graphics', 'social media'], type: 'Tool', free: true, featured: true },
  { id: '19', title: 'Buffer - Social Media Scheduler', description: 'Schedule and manage social media posts', url: 'https://buffer.com/', category: 'Marketing', subcategory: 'Social Media', tags: ['social media', 'scheduling', 'analytics'], type: 'Tool', free: true },
  { id: '20', title: 'Mailchimp - Email Marketing', description: 'Free email marketing for up to 500 contacts', url: 'https://mailchimp.com/', category: 'Marketing', subcategory: 'Email', tags: ['email', 'newsletter', 'marketing'], type: 'Tool', free: true },
  { id: '21', title: 'Later - Instagram Scheduler', description: 'Visual social media planner and scheduler', url: 'https://later.com/', category: 'Marketing', subcategory: 'Social Media', tags: ['instagram', 'scheduling', 'visual'], type: 'Tool', free: true },
  { id: '22', title: 'Unsplash - Free Photos', description: 'Beautiful, free images for any project', url: 'https://unsplash.com/', category: 'Marketing', subcategory: 'Images', tags: ['photos', 'free', 'stock images'], type: 'Website', free: true },
  { id: '23', title: 'Pexels - Free Videos & Photos', description: 'Free stock videos and photos', url: 'https://www.pexels.com/', category: 'Marketing', subcategory: 'Media', tags: ['video', 'photos', 'free'], type: 'Website', free: true },
  { id: '24', title: 'Hootsuite Academy', description: 'Free social media marketing courses', url: 'https://education.hootsuite.com/', category: 'Marketing', subcategory: 'Courses', tags: ['social media', 'courses', 'certification'], type: 'Course', free: true },
  
  // COMMUNICATION & COLLABORATION
  { id: '25', title: 'Slack - Team Communication', description: 'Free team messaging and collaboration', url: 'https://slack.com/', category: 'Communication', subcategory: 'Messaging', tags: ['communication', 'team', 'messaging'], type: 'Tool', free: true, featured: true },
  { id: '26', title: 'Discord - Community Server', description: 'Free voice, video, and text communication', url: 'https://discord.com/', category: 'Communication', subcategory: 'Community', tags: ['voice', 'community', 'gaming'], type: 'Tool', free: true },
  { id: '27', title: 'Microsoft Teams', description: 'Free for education - meetings, chat, and files', url: 'https://www.microsoft.com/en-us/microsoft-teams/group-chat-software', category: 'Communication', subcategory: 'Meetings', tags: ['video', 'meetings', 'microsoft'], type: 'Tool', free: true },
  { id: '28', title: 'Google Workspace for Education', description: 'Free productivity tools for schools', url: 'https://edu.google.com/workspace-for-education/', category: 'Communication', subcategory: 'Productivity', tags: ['google', 'education', 'collaboration'], type: 'Tool', free: true },
  { id: '29', title: 'Notion - All-in-One Workspace', description: 'Notes, docs, and project management', url: 'https://www.notion.so/', category: 'Communication', subcategory: 'Productivity', tags: ['notes', 'wiki', 'project management'], type: 'Tool', free: true },
  { id: '30', title: 'Trello - Project Boards', description: 'Visual project management with boards', url: 'https://trello.com/', category: 'Communication', subcategory: 'Project Management', tags: ['kanban', 'projects', 'tasks'], type: 'Tool', free: true },
  
  // COMPETITIONS & ACADEMIC
  { id: '31', title: 'TSA Official Website', description: 'Technology Student Association resources and competitions', url: 'https://tsaweb.org/', category: 'Competitions', subcategory: 'TSA', tags: ['tsa', 'technology', 'stem'], type: 'Website', free: true, featured: true },
  { id: '32', title: 'DECA Official', description: 'Business and marketing competition resources', url: 'https://www.deca.org/', category: 'Competitions', subcategory: 'Business', tags: ['deca', 'business', 'marketing'], type: 'Website', free: true },
  { id: '33', title: 'FBLA Official', description: 'Future Business Leaders of America', url: 'https://www.fbla.org/', category: 'Competitions', subcategory: 'Business', tags: ['fbla', 'business', 'leadership'], type: 'Website', free: true },
  { id: '34', title: 'Science Olympiad', description: 'STEM competition resources and events', url: 'https://www.soinc.org/', category: 'Competitions', subcategory: 'Science', tags: ['science', 'olympiad', 'stem'], type: 'Website', free: true },
  { id: '35', title: 'Model UN Resources', description: 'Best Delegate MUN preparation guides', url: 'https://bestdelegate.com/', category: 'Competitions', subcategory: 'Model UN', tags: ['mun', 'debate', 'diplomacy'], type: 'Website', free: true },
  { id: '36', title: 'Debate Resources - NSDA', description: 'National Speech & Debate Association', url: 'https://www.speechanddebate.org/', category: 'Competitions', subcategory: 'Debate', tags: ['debate', 'speech', 'forensics'], type: 'Website', free: true },
  { id: '37', title: 'FIRST Robotics', description: 'Robotics competition programs', url: 'https://www.firstinspires.org/', category: 'Competitions', subcategory: 'Robotics', tags: ['robotics', 'stem', 'engineering'], type: 'Website', free: true },
  { id: '38', title: 'Math Olympiad', description: 'Mathematical Association of America competitions', url: 'https://www.maa.org/math-competitions', category: 'Competitions', subcategory: 'Math', tags: ['math', 'olympiad', 'competition'], type: 'Website', free: true },
  
  // TEMPLATES & DOCUMENTS
  { id: '39', title: 'Club Constitution Template', description: 'Free editable constitution templates', url: 'https://templates.office.com/', category: 'Templates', subcategory: 'Documents', tags: ['constitution', 'bylaws', 'template'], type: 'Template', free: true },
  { id: '40', title: 'Google Docs Templates', description: 'Free document templates for any purpose', url: 'https://docs.google.com/document/u/0/?tgif=d&ftv=1', category: 'Templates', subcategory: 'Documents', tags: ['documents', 'google', 'templates'], type: 'Template', free: true },
  { id: '41', title: 'Meeting Agenda Templates', description: 'Professional meeting agenda templates', url: 'https://www.smartsheet.com/free-meeting-agenda-templates', category: 'Templates', subcategory: 'Meetings', tags: ['meeting', 'agenda', 'template'], type: 'Template', free: true },
  { id: '42', title: 'Budget Spreadsheet Templates', description: 'Free Excel budget templates', url: 'https://templates.office.com/en-us/budgets', category: 'Templates', subcategory: 'Finance', tags: ['budget', 'finance', 'excel'], type: 'Template', free: true },
  { id: '43', title: 'Presentation Templates', description: 'Google Slides and PowerPoint templates', url: 'https://slidesgo.com/', category: 'Templates', subcategory: 'Presentations', tags: ['slides', 'presentation', 'powerpoint'], type: 'Template', free: true },
  
  // VOLUNTEER & SERVICE
  { id: '44', title: 'VolunteerMatch', description: 'Find local volunteer opportunities', url: 'https://www.volunteermatch.org/', category: 'Service', subcategory: 'Opportunities', tags: ['volunteer', 'service', 'local'], type: 'Website', free: true, featured: true },
  { id: '45', title: 'Idealist.org', description: 'Nonprofit jobs and volunteer opportunities', url: 'https://www.idealist.org/', category: 'Service', subcategory: 'Opportunities', tags: ['nonprofit', 'jobs', 'volunteer'], type: 'Website', free: true },
  { id: '46', title: 'Points of Light', description: 'Volunteer and civic engagement resources', url: 'https://www.pointsoflight.org/', category: 'Service', subcategory: 'Resources', tags: ['civic', 'engagement', 'service'], type: 'Website', free: true },
  { id: '47', title: 'UN Volunteers', description: 'Online volunteering opportunities globally', url: 'https://www.onlinevolunteering.org/', category: 'Service', subcategory: 'Global', tags: ['un', 'global', 'online'], type: 'Website', free: true },
  { id: '48', title: 'Create the Good (AARP)', description: 'Service project ideas and resources', url: 'https://createthegood.aarp.org/', category: 'Service', subcategory: 'Ideas', tags: ['projects', 'ideas', 'community'], type: 'Website', free: true },
  
  // SKILLS & LEARNING
  { id: '49', title: 'Khan Academy', description: 'Free courses on any subject', url: 'https://www.khanacademy.org/', category: 'Learning', subcategory: 'General', tags: ['learning', 'free', 'courses'], type: 'Course', free: true, featured: true },
  { id: '50', title: 'Coursera - Free Courses', description: 'University courses from top institutions', url: 'https://www.coursera.org/', category: 'Learning', subcategory: 'University', tags: ['courses', 'university', 'certificate'], type: 'Course', free: true },
  { id: '51', title: 'edX - Free Online Courses', description: 'Courses from Harvard, MIT, and more', url: 'https://www.edx.org/', category: 'Learning', subcategory: 'University', tags: ['harvard', 'mit', 'courses'], type: 'Course', free: true },
  { id: '52', title: 'LinkedIn Learning', description: 'Professional skills courses (free trial)', url: 'https://www.linkedin.com/learning/', category: 'Learning', subcategory: 'Professional', tags: ['linkedin', 'professional', 'skills'], type: 'Course', free: false },
  { id: '53', title: 'Skillshare', description: 'Creative and business courses', url: 'https://www.skillshare.com/', category: 'Learning', subcategory: 'Creative', tags: ['creative', 'design', 'business'], type: 'Course', free: false },
  { id: '54', title: 'Codecademy', description: 'Learn to code for free', url: 'https://www.codecademy.com/', category: 'Learning', subcategory: 'Coding', tags: ['coding', 'programming', 'free'], type: 'Course', free: true },
  { id: '55', title: 'freeCodeCamp', description: 'Free coding bootcamp and certifications', url: 'https://www.freecodecamp.org/', category: 'Learning', subcategory: 'Coding', tags: ['coding', 'bootcamp', 'free'], type: 'Course', free: true },
  
  // WEBSITES & TECHNOLOGY
  { id: '56', title: 'Wix - Free Website Builder', description: 'Create a free club website', url: 'https://www.wix.com/', category: 'Technology', subcategory: 'Websites', tags: ['website', 'builder', 'free'], type: 'Tool', free: true },
  { id: '57', title: 'Weebly - Simple Websites', description: 'Drag-and-drop website builder', url: 'https://www.weebly.com/', category: 'Technology', subcategory: 'Websites', tags: ['website', 'simple', 'free'], type: 'Tool', free: true },
  { id: '58', title: 'Google Sites', description: 'Free website creation with Google', url: 'https://sites.google.com/', category: 'Technology', subcategory: 'Websites', tags: ['google', 'free', 'simple'], type: 'Tool', free: true },
  { id: '59', title: 'GitHub Pages', description: 'Free hosting for web projects', url: 'https://pages.github.com/', category: 'Technology', subcategory: 'Hosting', tags: ['github', 'hosting', 'free'], type: 'Tool', free: true },
  { id: '60', title: 'Linktree', description: 'One link for all your social media', url: 'https://linktr.ee/', category: 'Technology', subcategory: 'Social', tags: ['link', 'social', 'bio'], type: 'Tool', free: true },
  
  // COMMUNITY BUILDING
  { id: '61', title: 'Circle - Community Platform', description: 'Build online communities for your club', url: 'https://circle.so/', category: 'Community', subcategory: 'Platform', tags: ['community', 'members', 'forum'], type: 'Tool', free: false },
  { id: '62', title: 'Mighty Networks', description: 'All-in-one community platform', url: 'https://www.mightynetworks.com/', category: 'Community', subcategory: 'Platform', tags: ['community', 'courses', 'membership'], type: 'Tool', free: false },
  { id: '63', title: 'Facebook Groups Guide', description: 'How to create and manage Facebook groups', url: 'https://www.facebook.com/help/1629740080681586', category: 'Community', subcategory: 'Social', tags: ['facebook', 'groups', 'community'], type: 'Article', free: true },
  { id: '64', title: 'Reddit Community Guide', description: 'Create and moderate subreddits', url: 'https://mods.reddithelp.com/', category: 'Community', subcategory: 'Social', tags: ['reddit', 'moderation', 'community'], type: 'Article', free: true },
  
  // FINANCE & BUDGETING
  { id: '65', title: 'Wave Accounting', description: 'Free accounting software for small orgs', url: 'https://www.waveapps.com/', category: 'Finance', subcategory: 'Accounting', tags: ['accounting', 'free', 'invoicing'], type: 'Tool', free: true },
  { id: '66', title: 'Mint Budget Tracker', description: 'Personal and organizational budgeting', url: 'https://mint.intuit.com/', category: 'Finance', subcategory: 'Budgeting', tags: ['budget', 'tracking', 'free'], type: 'Tool', free: true },
  { id: '67', title: 'PayPal for Nonprofits', description: 'Payment processing for organizations', url: 'https://www.paypal.com/us/webapps/mpp/nonprofit', category: 'Finance', subcategory: 'Payments', tags: ['payments', 'donations', 'nonprofit'], type: 'Tool', free: true },
  { id: '68', title: 'Venmo for Business', description: 'Accept payments for club dues/events', url: 'https://venmo.com/business/', category: 'Finance', subcategory: 'Payments', tags: ['payments', 'venmo', 'mobile'], type: 'Tool', free: true },
  
  // AWARDS & RECOGNITION
  { id: '69', title: 'Congressional Award', description: 'Congress\'s award for young Americans', url: 'https://www.congressionalaward.org/', category: 'Awards', subcategory: 'National', tags: ['congress', 'service', 'recognition'], type: 'Website', free: true },
  { id: '70', title: "President's Volunteer Service Award", description: 'National recognition for volunteers', url: 'https://www.presidentialserviceawards.gov/', category: 'Awards', subcategory: 'National', tags: ['president', 'volunteer', 'award'], type: 'Website', free: true },
  { id: '71', title: 'Prudential Spirit of Community', description: 'Youth volunteer recognition program', url: 'https://spirit.prudential.com/', category: 'Awards', subcategory: 'Youth', tags: ['prudential', 'youth', 'volunteer'], type: 'Website', free: true },
  { id: '72', title: 'Gloria Barron Prize', description: 'Award for young heroes', url: 'https://barronprize.org/', category: 'Awards', subcategory: 'Youth', tags: ['heroes', 'youth', 'award'], type: 'Website', free: true },
  
  // MENTAL HEALTH & WELLNESS
  { id: '73', title: 'Active Minds', description: 'Mental health resources for students', url: 'https://www.activeminds.org/', category: 'Wellness', subcategory: 'Mental Health', tags: ['mental health', 'students', 'support'], type: 'Website', free: true },
  { id: '74', title: 'Crisis Text Line', description: 'Text HOME to 741741 for crisis support', url: 'https://www.crisistextline.org/', category: 'Wellness', subcategory: 'Crisis', tags: ['crisis', 'text', 'support'], type: 'Website', free: true },
  { id: '75', title: 'Headspace for Students', description: 'Free meditation app for students', url: 'https://www.headspace.com/students', category: 'Wellness', subcategory: 'Meditation', tags: ['meditation', 'students', 'free'], type: 'Tool', free: true },
  
  // ADDITIONAL RESOURCES (continuing to 100+)
  { id: '76', title: 'Adobe Express', description: 'Free design and video creation tool', url: 'https://www.adobe.com/express/', category: 'Marketing', subcategory: 'Design', tags: ['design', 'video', 'adobe'], type: 'Tool', free: true },
  { id: '77', title: 'Figma', description: 'Collaborative design tool', url: 'https://www.figma.com/', category: 'Technology', subcategory: 'Design', tags: ['design', 'collaborative', 'ui'], type: 'Tool', free: true },
  { id: '78', title: 'Loom - Video Messaging', description: 'Record and share video messages', url: 'https://www.loom.com/', category: 'Communication', subcategory: 'Video', tags: ['video', 'messaging', 'screen recording'], type: 'Tool', free: true },
  { id: '79', title: 'Calendly', description: 'Easy scheduling for meetings', url: 'https://calendly.com/', category: 'Event Planning', subcategory: 'Scheduling', tags: ['scheduling', 'meetings', 'calendar'], type: 'Tool', free: true },
  { id: '80', title: 'Zoom', description: 'Video conferencing platform', url: 'https://zoom.us/', category: 'Communication', subcategory: 'Meetings', tags: ['video', 'meetings', 'webinar'], type: 'Tool', free: true },
  { id: '81', title: 'Asana', description: 'Project and task management', url: 'https://asana.com/', category: 'Communication', subcategory: 'Project Management', tags: ['projects', 'tasks', 'teams'], type: 'Tool', free: true },
  { id: '82', title: 'Airtable', description: 'Flexible database and spreadsheet', url: 'https://airtable.com/', category: 'Technology', subcategory: 'Database', tags: ['database', 'spreadsheet', 'flexible'], type: 'Tool', free: true },
  { id: '83', title: 'Typeform', description: 'Beautiful forms and surveys', url: 'https://www.typeform.com/', category: 'Event Planning', subcategory: 'Forms', tags: ['forms', 'surveys', 'beautiful'], type: 'Tool', free: true },
  { id: '84', title: 'SurveyMonkey', description: 'Online survey creation', url: 'https://www.surveymonkey.com/', category: 'Event Planning', subcategory: 'Surveys', tags: ['surveys', 'research', 'feedback'], type: 'Tool', free: true },
  { id: '85', title: 'Miro - Online Whiteboard', description: 'Collaborative whiteboard for teams', url: 'https://miro.com/', category: 'Communication', subcategory: 'Collaboration', tags: ['whiteboard', 'brainstorming', 'visual'], type: 'Tool', free: true },
  { id: '86', title: 'Mentimeter', description: 'Interactive presentations and polls', url: 'https://www.mentimeter.com/', category: 'Event Planning', subcategory: 'Presentations', tags: ['polls', 'interactive', 'presentations'], type: 'Tool', free: true },
  { id: '87', title: 'Kahoot!', description: 'Game-based learning and trivia', url: 'https://kahoot.com/', category: 'Learning', subcategory: 'Games', tags: ['games', 'trivia', 'learning'], type: 'Tool', free: true },
  { id: '88', title: 'Quizlet', description: 'Flashcards and study tools', url: 'https://quizlet.com/', category: 'Learning', subcategory: 'Study', tags: ['flashcards', 'study', 'learning'], type: 'Tool', free: true },
  { id: '89', title: 'Grammarly', description: 'Writing assistant and grammar checker', url: 'https://www.grammarly.com/', category: 'Technology', subcategory: 'Writing', tags: ['writing', 'grammar', 'editing'], type: 'Tool', free: true },
  { id: '90', title: 'Hemingway Editor', description: 'Make your writing clear and bold', url: 'https://hemingwayapp.com/', category: 'Technology', subcategory: 'Writing', tags: ['writing', 'clarity', 'editing'], type: 'Tool', free: true },
  { id: '91', title: 'Remove.bg', description: 'Remove image backgrounds instantly', url: 'https://www.remove.bg/', category: 'Marketing', subcategory: 'Images', tags: ['images', 'background', 'editing'], type: 'Tool', free: true },
  { id: '92', title: 'TinyPNG', description: 'Compress images for web', url: 'https://tinypng.com/', category: 'Technology', subcategory: 'Images', tags: ['compression', 'images', 'optimization'], type: 'Tool', free: true },
  { id: '93', title: 'Coolors', description: 'Color palette generator', url: 'https://coolors.co/', category: 'Marketing', subcategory: 'Design', tags: ['colors', 'palette', 'design'], type: 'Tool', free: true },
  { id: '94', title: 'Font Awesome', description: 'Free icons for web projects', url: 'https://fontawesome.com/', category: 'Technology', subcategory: 'Icons', tags: ['icons', 'web', 'free'], type: 'Tool', free: true },
  { id: '95', title: 'Flaticon', description: 'Free vector icons', url: 'https://www.flaticon.com/', category: 'Marketing', subcategory: 'Icons', tags: ['icons', 'vector', 'free'], type: 'Website', free: true },
  { id: '96', title: 'Dribbble', description: 'Design inspiration gallery', url: 'https://dribbble.com/', category: 'Marketing', subcategory: 'Inspiration', tags: ['design', 'inspiration', 'portfolio'], type: 'Community', free: true },
  { id: '97', title: 'Behance', description: 'Creative portfolio platform', url: 'https://www.behance.net/', category: 'Marketing', subcategory: 'Inspiration', tags: ['portfolio', 'creative', 'inspiration'], type: 'Community', free: true },
  { id: '98', title: 'Product Hunt', description: 'Discover new tools and apps', url: 'https://www.producthunt.com/', category: 'Technology', subcategory: 'Discovery', tags: ['tools', 'apps', 'new'], type: 'Community', free: true },
  { id: '99', title: 'Zapier', description: 'Automate workflows between apps', url: 'https://zapier.com/', category: 'Technology', subcategory: 'Automation', tags: ['automation', 'workflows', 'integration'], type: 'Tool', free: true },
  { id: '100', title: 'IFTTT', description: 'Connect your apps and devices', url: 'https://ifttt.com/', category: 'Technology', subcategory: 'Automation', tags: ['automation', 'iot', 'connection'], type: 'Tool', free: true },
];

const categories = [...new Set(externalResources.map(r => r.category))];
const types = ['All', 'Website', 'Tool', 'Template', 'Video', 'Course', 'Article', 'Community'];

export default function ExternalResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const filteredResources = useMemo(() => {
    return externalResources.filter(resource => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches = resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.tags.some(t => t.toLowerCase().includes(query));
        if (!matches) return false;
      }
      if (selectedCategory && resource.category !== selectedCategory) return false;
      if (selectedType !== 'All' && resource.type !== selectedType) return false;
      if (showFreeOnly && !resource.free) return false;
      if (showSavedOnly && !savedResources.includes(resource.id)) return false;
      return true;
    });
  }, [searchQuery, selectedCategory, selectedType, showFreeOnly, showSavedOnly, savedResources]);

  const featuredResources = externalResources.filter(r => r.featured);

  const toggleSave = (id: string) => {
    if (savedResources.includes(id)) {
      setSavedResources(savedResources.filter(r => r !== id));
    } else {
      setSavedResources([...savedResources, id]);
    }
  };

  const typeColors: Record<string, string> = {
    'Website': 'bg-blue-100 text-blue-700',
    'Tool': 'bg-green-100 text-green-700',
    'Template': 'bg-purple-100 text-purple-700',
    'Video': 'bg-red-100 text-red-700',
    'Course': 'bg-amber-100 text-amber-700',
    'Article': 'bg-teal-100 text-teal-700',
    'Community': 'bg-pink-100 text-pink-700'
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80"
            alt="Library"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/95 to-teal-600/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
            🌐 External Resources Library
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            {externalResources.length}+ curated links to the best tools, websites, courses, and resources 
            for running successful student organizations.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#resources" className="btn-secondary">
              Browse Resources
            </a>
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-6 py-2.5 font-semibold border-2 transition-all ${
                showSavedOnly 
                  ? 'bg-white text-emerald-600 border-white' 
                  : 'bg-white/20 text-white border-white/50 hover:bg-white hover:text-emerald-600'
              }`}
            >
              ❤️ My Saved ({savedResources.length})
            </button>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-bold text-neutral-700 mb-4">⭐ Featured Resources</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {featuredResources.map(resource => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-64 p-4 border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-semibold ${typeColors[resource.type]}`}>
                    {resource.type}
                  </span>
                  {resource.free && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold">FREE</span>}
                </div>
                <h3 className="font-bold text-primary-500 group-hover:text-secondary-500 transition-colors mb-1">
                  {resource.title}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2">{resource.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section id="resources" className="py-6 bg-neutral-50 border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field max-w-xs"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select-field"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="select-field"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFreeOnly}
                onChange={(e) => setShowFreeOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-neutral-700">Free only</span>
            </label>
            <span className="text-sm text-neutral-500 ml-auto">
              {filteredResources.length} resources found
            </span>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(resource => (
              <div key={resource.id} className="card p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-0.5 text-xs font-semibold ${typeColors[resource.type]}`}>
                      {resource.type}
                    </span>
                    {resource.free && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold">FREE</span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleSave(resource.id)}
                    className={`text-xl transition-transform hover:scale-110 ${
                      savedResources.includes(resource.id) ? 'text-red-500' : 'text-neutral-300 hover:text-red-400'
                    }`}
                  >
                    {savedResources.includes(resource.id) ? '❤️' : '🤍'}
                  </button>
                </div>

                <h3 className="font-bold text-primary-500 font-heading mb-2">{resource.title}</h3>
                <p className="text-sm text-neutral-600 mb-3 flex-grow">{resource.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">{resource.category}</span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary-500 hover:text-secondary-500 flex items-center gap-1"
                  >
                    Visit Site <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-neutral-700 mb-2">No resources found</h3>
              <p className="text-neutral-600 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedType('All');
                  setShowFreeOnly(false);
                  setShowSavedOnly(false);
                }}
                className="text-primary-500 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Suggest Resource */}
      <section className="py-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold font-heading mb-4">Know a Great Resource?</h2>
          <p className="text-white/90 mb-6">
            Help the community by suggesting tools and resources you&apos;ve found helpful.
          </p>
          <Link href="/hub/request" className="btn-secondary">
            Suggest a Resource
          </Link>
        </div>
      </section>
    </div>
  );
}
