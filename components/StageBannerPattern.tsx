type StageBannerPatternProps = {
  patternId: string;
};

export default function StageBannerPattern({ patternId }: StageBannerPatternProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-black/12 to-black/24" />
      <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={patternId} x="0" y="0" width="520" height="300" patternUnits="userSpaceOnUse">
            <path d="M-20,80 C60,40 120,120 200,90 C280,60 320,130 400,100 C460,78 500,110 540,95" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" fill="none"/>
            <path d="M-20,160 C50,130 100,180 180,155 C260,130 310,175 390,150 C450,132 490,165 540,148" stroke="rgba(255,255,255,0.09)" strokeWidth="2" fill="none"/>
            <path d="M-20,240 C70,210 140,255 220,230 C300,205 360,248 440,222 C490,207 520,232 540,220" stroke="rgba(255,255,255,0.07)" strokeWidth="1.8" fill="none"/>
            <ellipse cx="80" cy="60" rx="48" ry="32" fill="rgba(255,255,255,0.055)" />
            <ellipse cx="300" cy="200" rx="60" ry="38" fill="rgba(255,255,255,0.045)" />
            <ellipse cx="450" cy="80" rx="42" ry="28" fill="rgba(255,255,255,0.05)" />
            <g opacity="0.32" fill="white">
              <circle cx="460" cy="30" r="2.2"/><circle cx="470" cy="30" r="2.2"/><circle cx="480" cy="30" r="2.2"/>
              <circle cx="460" cy="40" r="2.2"/><circle cx="470" cy="40" r="2.2"/><circle cx="480" cy="40" r="2.2"/>
              <circle cx="460" cy="50" r="2.2"/><circle cx="470" cy="50" r="2.2"/><circle cx="480" cy="50" r="2.2"/>
            </g>
            <g opacity="0.25" fill="white">
              <circle cx="20" cy="230" r="2"/><circle cx="30" cy="230" r="2"/><circle cx="40" cy="230" r="2"/>
              <circle cx="20" cy="240" r="2"/><circle cx="30" cy="240" r="2"/><circle cx="40" cy="240" r="2"/>
              <circle cx="20" cy="250" r="2"/><circle cx="30" cy="250" r="2"/><circle cx="40" cy="250" r="2"/>
            </g>
            <circle cx="100" cy="185" r="8" stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" fill="none"/>
            <circle cx="310" cy="55" r="10" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" fill="none"/>
            <circle cx="415" cy="245" r="6" stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" fill="none"/>
            <circle cx="510" cy="190" r="8" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" fill="none"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
