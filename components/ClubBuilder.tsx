'use client';

import { useState } from 'react';

const categories = ['Academic','Arts','Service','Cultural','STEM','Sports','Leadership','Media','Other'];
const emojis = ['🎯','💡','🚀','🎨','🎵','🤝','📚','🏆','💻','🔬','🎮','⚙️'];

function makeNameSuggestions(focus: string, category: string) {
  const base = focus.trim() || category || 'Student Club';
  return [
    `${base} Collective`,
    `${base} Society`,
    `The ${base} Initiative`,
  ];
}

function makeMission(focus: string, category: string) {
  return `To create an inclusive ${category.toLowerCase()} group focused on ${focus.trim() || 'shared activities and skill development'}, providing members with hands-on experience, mentorship, and leadership opportunities.`;
}

function makeProposalMessage(name: string, focus: string, meetingTime: string) {
  return `Hello [Advisor Name],\n\nMy name is [Your Name] and I would like to start a new student club called "${name}" focused on ${focus}. We plan to meet ${meetingTime || 'weekly after school'} and our goals are to provide members with learning opportunities, community engagement, and hands-on projects. I would appreciate the chance to discuss this proposal and next steps for advisor support and room scheduling.\n\nThank you for your consideration,\n[Your Name]`;
}

function svgDataUrl(emoji: string, bg = '#2563eb', fg = '#ffffff') {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><rect width='100%' height='100%' fill='${bg}' rx='32'/><text x='50%' y='50%' font-size='120' text-anchor='middle' dominant-baseline='central' fill='${fg}'>${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function ClubBuilder({ onCreate }: { onCreate?: (club: any) => void }) {
  const [focus, setFocus] = useState('');
  const [category, setCategory] = useState<string>('Other');
  const [meetingTime, setMeetingTime] = useState<string>('Weekly after school');
  const [emoji, setEmoji] = useState(emojis[0]);
  const [color, setColor] = useState('#2563eb');
  const [name, setName] = useState('');

  const suggestions = makeNameSuggestions(focus || category, category);
  const mission = makeMission(focus, category);
  const proposal = makeProposalMessage(name || suggestions[0], focus || 'club activities', meetingTime);
  const logoUrl = svgDataUrl(emoji, color);

  function handleGenerate() {
    const chosen = suggestions[0];
    setName(chosen);
  }

  function handleDownloadLogo() {
    const a = document.createElement('a');
    a.href = logoUrl;
    a.download = `${(name||'club').replace(/\s+/g,'_')}-logo.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function copyToClipboard(text: string) {
    navigator.clipboard?.writeText(text);
  }

  return (
    <div className="bg-white border border-neutral-200  p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-800 mb-2">Club Builder — personalized suggestions</h3>
      <p className="text-sm text-neutral-500 mb-4">Tell us what you want to create and we'll suggest a name, logo, mission statement, and a ready-to-send proposal message.</p>

      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <input value={focus} onChange={(e)=>setFocus(e.target.value)} placeholder="What is the club about? (e.g. robotics, chess, film)" className="input-field" />
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="select-field">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <input value={meetingTime} onChange={(e)=>setMeetingTime(e.target.value)} className="input-field" />
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-500">Logo emoji</label>
          <select value={emoji} onChange={(e)=>setEmoji(e.target.value)} className="select-field">
            {emojis.map(em => <option key={em} value={em}>{em}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-500">Color</label>
          <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} className="w-12 h-8 p-0 border rounded" />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={handleGenerate} className="btn-primary">Generate suggestions</button>
        <button onClick={()=>{ setName(''); setFocus(''); setMeetingTime('Weekly after school'); setEmoji(emojis[0]); setColor('#2563eb'); }} className="btn-outline">Reset</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 border border-neutral-100 ">
          <div className="text-xs text-neutral-500 mb-2">Name suggestions</div>
          <div className="space-y-2">
            {suggestions.map(s => (
              <div key={s} className="flex items-center justify-between gap-2">
                <button onClick={()=>setName(s)} className="text-sm text-neutral-700 text-left hover:underline">{s}</button>
                <button onClick={()=>navigator.clipboard?.writeText(s)} className="text-xs text-neutral-400">Copy</button>
              </div>
            ))}
            <div className="mt-2">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Selected name" className="input-field" />
            </div>
          </div>
        </div>

        <div className="p-4 border border-neutral-100  text-center">
          <div className="text-xs text-neutral-500 mb-2">Logo preview</div>
          <div className="mx-auto w-24 h-24  flex items-center justify-center" style={{ background: color }}>
            <div style={{ fontSize: 48 }}>{emoji}</div>
          </div>
          <div className="mt-3 flex justify-center gap-2">
            <button onClick={handleDownloadLogo} className="btn-outline text-sm px-3 py-1">Download SVG</button>
            <a href={logoUrl} target="_blank" rel="noreferrer" className="text-sm text-neutral-500 underline">Open</a>
          </div>
        </div>

        <div className="p-4 border border-neutral-100 ">
          <div className="text-xs text-neutral-500 mb-2">Mission statement</div>
          <div className="text-sm text-neutral-700 mb-3">{mission}</div>
          <div className="flex gap-2">
            <button onClick={()=>copyToClipboard(mission)} className="btn-primary btn-sm">Copy</button>
            <a href={`/propose?name=${encodeURIComponent(name||suggestions[0])}&mission=${encodeURIComponent(mission)}`} className="btn-outline btn-sm">Use in Proposal</a>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-neutral-500 mb-2">Proposal message (ready to send to an advisor)</div>
        <textarea readOnly value={proposal} className="input-field w-full h-28" />
        <div className="flex gap-2 mt-2">
          <button onClick={()=>copyToClipboard(proposal)} className="btn-primary">Copy message</button>
          <a href={`mailto:activities@school.edu?subject=${encodeURIComponent('Proposal: ' + (name||suggestions[0]))}&body=${encodeURIComponent(proposal)}`} className="btn-outline">Email advisor</a>
          <button onClick={()=>onCreate?.({ name: name||suggestions[0], focus, category, emoji, color })} className="ml-auto btn-secondary">Save & Start</button>
        </div>
      </div>
    </div>
  );
}
