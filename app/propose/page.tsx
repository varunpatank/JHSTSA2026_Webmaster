"use client";

import { useState } from "react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle, FileText, Globe,
  Heart, HelpCircle, Lightbulb, MapPin, Phone, Send, Star, Upload,
  Users, X, Zap,
} from "lucide-react";

const RESOURCE_CATEGORIES = [
  "Non-Profit Organization",
  "Support Service",
  "Community Event / Program",
  "Educational Resource",
  "Health & Wellness",
  "Youth Development",
  "Arts & Culture",
  "Environmental",
  "Legal Aid",
  "Food & Housing",
  "Technology & STEM",
  "Mentorship / Tutoring",
  "Other",
];

const AVAILABILITY_OPTIONS = [
  "Year-Round",
  "Seasonal (Summer)",
  "Seasonal (School Year)",
  "Weekly",
  "Monthly",
  "One-Time Event",
  "By Appointment",
];

const TARGET_AUDIENCE = [
  "All Students",
  "High School Students",
  "Middle School Students",
  "Parents & Families",
  "Teachers & Staff",
  "Community Members",
  "Underserved Populations",
];

export default function ProposeResourcePage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    resourceName: "",
    category: "",
    description: "",
    website: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    availability: "",
    targetAudience: [] as string[],
    whyAdd: "",
    submitterName: "",
    submitterEmail: "",
    submitterRole: "",
    additionalNotes: "",
  });

  const update = (field: string, value: string | string[]) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleAudience = (aud: string) => {
    setForm(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(aud)
        ? prev.targetAudience.filter(a => a !== aud)
        : [...prev.targetAudience, aud],
    }));
  };

  const canProceed = () => {
    if (step === 1) return form.resourceName.trim() && form.category && form.description.trim();
    if (step === 2) return form.contactName.trim() && form.contactEmail.trim();
    if (step === 3) return form.submitterName.trim() && form.submitterEmail.trim() && form.whyAdd.trim();
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border-2 border-green-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 mx-auto flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary-800">Resource Submitted!</h1>
          <p className="mt-2 text-neutral-600 text-sm">
            Thank you for suggesting <strong>{form.resourceName}</strong>. Our team will review it and add it to the Community Resource Hub if approved.
          </p>
          <p className="mt-3 text-xs text-neutral-400">You&apos;ll receive a confirmation at {form.submitterEmail}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/resources" className="btn-primary flex items-center justify-center gap-2 text-sm">
              <BookOpen size={14} /> Browse Resources
            </Link>
            <button onClick={() => { setSubmitted(false); setStep(1); setForm({ resourceName: "", category: "", description: "", website: "", contactName: "", contactEmail: "", contactPhone: "", address: "", availability: "", targetAudience: [], whyAdd: "", submitterName: "", submitterEmail: "", submitterRole: "", additionalNotes: "" }); }}
              className="btn-outline text-sm flex items-center justify-center gap-2">
              <Send size={14} /> Submit Another
            </button>
            <Link href="/" className="text-xs text-primary-600 hover:underline mt-1">&larr; Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0 min-h-screen bg-neutral-50">
      <HeroSection
        bgImage="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=75"
        texture="diagonal"
      >
        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 text-xs font-semibold">
          <Lightbulb size={12} /> Community Resource Hub
        </div>
        <h1 className="hero-title"><span>Suggest a New Resource</span></h1>
        <p className="hero-description max-w-xl text-sm">
          Know a community resource that should be in our hub? Non-profits, support services, programs, events &mdash; help us grow our directory for everyone.
        </p>
      </HeroSection>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[
            { num: 1, label: "Resource Info" },
            { num: 2, label: "Contact Details" },
            { num: 3, label: "Your Info & Review" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <button onClick={() => { if (s.num < step || canProceed()) setStep(s.num); }}
                className={`w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors ${step === s.num ? "bg-primary-900 text-white" : step > s.num ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-400"}`}>
                {step > s.num ? "\u2713" : s.num}
              </button>
              <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? "text-primary-700" : "text-neutral-400"}`}>{s.label}</span>
              {i < 2 && <div className={`w-8 h-0.5 ${step > s.num ? "bg-green-400" : "bg-neutral-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white border-2 border-neutral-200 p-6">
          {}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-heading font-bold text-primary-800 flex items-center gap-2"><FileText size={18} /> Resource Information</h2>
                <p className="text-xs text-neutral-500 mt-1">Tell us about the community resource you&apos;d like to add.</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1 mb-1"><Star size={12} className="text-red-500" /> Resource Name</label>
                <input type="text" value={form.resourceName} onChange={e => update("resourceName", e.target.value)}
                  placeholder="e.g., Downtown Youth Center, Community Food Bank"
                  className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400" />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1 mb-1"><Star size={12} className="text-red-500" /> Category</label>
                <select value={form.category} onChange={e => update("category", e.target.value)}
                  className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400 bg-white">
                  <option value="">Select a category&hellip;</option>
                  {RESOURCE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1 mb-1"><Star size={12} className="text-red-500" /> Description</label>
                <textarea value={form.description} onChange={e => update("description", e.target.value)}
                  placeholder="Describe what this resource provides, who it serves, and why it's valuable to the community…"
                  rows={4} className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400 resize-none" />
                <p className="text-[10px] text-neutral-400 mt-0.5">{form.description.length}/500 characters</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1 mb-1"><Globe size={12} /> Website (optional)</label>
                <input type="url" value={form.website} onChange={e => update("website", e.target.value)}
                  placeholder="https://example.org"
                  className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400" />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1 mb-1"><MapPin size={12} /> Address / Location (optional)</label>
                <input type="text" value={form.address} onChange={e => update("address", e.target.value)}
                  placeholder="123 Main St, City, State"
                  className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400" />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 mb-1 block">Availability</label>
                <select value={form.availability} onChange={e => update("availability", e.target.value)}
                  className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400 bg-white">
                  <option value="">Select availability&hellip;</option>
                  {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 mb-2 block">Target Audience (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {TARGET_AUDIENCE.map(aud => (
                    <button key={aud} onClick={() => toggleAudience(aud)} type="button"
                      className={`px-3 py-1.5 text-xs font-semibold border-2 transition-colors ${form.targetAudience.includes(aud) ? "bg-primary-900 text-white border-primary-600" : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-300"}`}>
                      {aud}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-heading font-bold text-primary-800 flex items-center gap-2"><Phone size={18} /> Resource Contact Details</h2>
                <p className="text-xs text-neutral-500 mt-1">How can community members reach this resource?</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1 mb-1"><Star size={12} className="text-red-500" /> Contact Person / Organization Name</label>
                <input type="text" value={form.contactName} onChange={e => update("contactName", e.target.value)}
                  placeholder="John Smith or Organization Name"
                  className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400" />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1 mb-1"><Star size={12} className="text-red-500" /> Contact Email</label>
                <input type="email" value={form.contactEmail} onChange={e => update("contactEmail", e.target.value)}
                  placeholder="contact@organization.org"
                  className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400" />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1 mb-1"><Phone size={12} /> Contact Phone (optional)</label>
                <input type="tel" value={form.contactPhone} onChange={e => update("contactPhone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400" />
              </div>

              <div className="bg-primary-50 border border-primary-200 p-4">
                <h3 className="font-bold text-xs text-primary-700 flex items-center gap-1 mb-2"><HelpCircle size={12} /> Tips for Contact Info</h3>
                <ul className="space-y-1 text-xs text-neutral-600">
                  <li>&bull; Provide the main public contact &mdash; not personal numbers</li>
                  <li>&bull; Use an organization email if available</li>
                  <li>&bull; Include the best person for community inquiries</li>
                </ul>
              </div>
            </div>
          )}

          {}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-heading font-bold text-primary-800 flex items-center gap-2"><Users size={18} /> Your Information</h2>
                <p className="text-xs text-neutral-500 mt-1">Tell us a bit about yourself so we can follow up if needed.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1 mb-1"><Star size={12} className="text-red-500" /> Your Name</label>
                  <input type="text" value={form.submitterName} onChange={e => update("submitterName", e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1 mb-1"><Star size={12} className="text-red-500" /> Your Email</label>
                  <input type="email" value={form.submitterEmail} onChange={e => update("submitterEmail", e.target.value)}
                    placeholder="you@school.edu"
                    className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 mb-1 block">Your Role (optional)</label>
                <select value={form.submitterRole} onChange={e => update("submitterRole", e.target.value)}
                  className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400 bg-white">
                  <option value="">Select your role&hellip;</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher / Staff</option>
                  <option value="parent">Parent / Guardian</option>
                  <option value="community">Community Member</option>
                  <option value="organization">Organization Representative</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1 mb-1"><Star size={12} className="text-red-500" /> Why should this resource be added?</label>
                <textarea value={form.whyAdd} onChange={e => update("whyAdd", e.target.value)}
                  placeholder="Explain how this resource benefits the community and why it belongs in our hub…"
                  rows={3} className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400 resize-none" />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 mb-1 block">Additional Notes (optional)</label>
                <textarea value={form.additionalNotes} onChange={e => update("additionalNotes", e.target.value)}
                  placeholder="Any other details, special hours, eligibility requirements, etc."
                  rows={2} className="w-full px-3 py-2 border-2 border-neutral-200 text-sm focus:outline-none focus:border-primary-400 resize-none" />
              </div>

              {}
              <div className="border-2 border-primary-200 bg-primary-50/50 p-4">
                <h3 className="font-bold text-sm text-primary-700 mb-3 flex items-center gap-1"><FileText size={14} /> Submission Summary</h3>
                <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div><span className="text-neutral-500">Resource:</span> <span className="font-semibold text-primary-800">{form.resourceName || "\u2014"}</span></div>
                  <div><span className="text-neutral-500">Category:</span> <span className="font-semibold text-primary-800">{form.category || "\u2014"}</span></div>
                  <div><span className="text-neutral-500">Contact:</span> <span className="font-semibold text-primary-800">{form.contactName || "\u2014"}</span></div>
                  <div><span className="text-neutral-500">Email:</span> <span className="font-semibold text-primary-800">{form.contactEmail || "\u2014"}</span></div>
                  <div><span className="text-neutral-500">Website:</span> <span className="font-semibold text-primary-800">{form.website || "\u2014"}</span></div>
                  <div><span className="text-neutral-500">Availability:</span> <span className="font-semibold text-primary-800">{form.availability || "\u2014"}</span></div>
                  <div className="sm:col-span-2"><span className="text-neutral-500">Audience:</span> <span className="font-semibold text-primary-800">{form.targetAudience.length ? form.targetAudience.join(", ") : "\u2014"}</span></div>
                  <div className="sm:col-span-2"><span className="text-neutral-500">Description:</span> <span className="font-medium text-neutral-700">{form.description ? form.description.slice(0, 120) + (form.description.length > 120 ? "\u2026" : "") : "\u2014"}</span></div>
                </div>
              </div>
            </div>
          )}

          {}
          <div className="mt-6 flex items-center justify-between">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 text-sm font-semibold text-primary-600 border-2 border-primary-200 hover:bg-primary-50 flex items-center gap-1">
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <Link href="/resources" className="px-4 py-2 text-sm font-semibold text-neutral-500 border-2 border-neutral-200 hover:bg-neutral-50 flex items-center gap-1">
                <ArrowLeft size={14} /> Resources
              </Link>
            )}

            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
                className="px-4 py-2 text-sm font-bold bg-primary-900 text-white hover:bg-primary-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                Next <ArrowRight size={14} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!canProceed()}
                className="px-5 py-2 text-sm font-bold bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                <Send size={14} /> Submit Resource
              </button>
            )}
          </div>
        </div>

        {}
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <div className="bg-white border-2 border-neutral-200 p-4 text-center">
            <Heart size={20} className="mx-auto text-red-500 mb-2" />
            <h3 className="font-bold text-sm text-primary-800">Community Driven</h3>
            <p className="text-xs text-neutral-600 mt-1">Resources are added by community members like you.</p>
          </div>
          <div className="bg-white border-2 border-neutral-200 p-4 text-center">
            <CheckCircle size={20} className="mx-auto text-green-600 mb-2" />
            <h3 className="font-bold text-sm text-primary-800">Reviewed &amp; Verified</h3>
            <p className="text-xs text-neutral-600 mt-1">Every submission is reviewed by our team before publishing.</p>
          </div>
          <div className="bg-white border-2 border-neutral-200 p-4 text-center">
            <Zap size={20} className="mx-auto text-secondary-600 mb-2" />
            <h3 className="font-bold text-sm text-primary-800">Quick Process</h3>
            <p className="text-xs text-neutral-600 mt-1">Submitted resources are typically reviewed within 48 hours.</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
