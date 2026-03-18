import { ReactNode } from "react";

type HeroStat = {
  label: string;
  value: ReactNode;
};

type HeroSectionProps = {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  stats?: HeroStat[];
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  shellClassName?: string;
  contentClassName?: string;
  align?: "center" | "left";
};

export default function HeroSection({
  eyebrow,
  title,
  description,
  icon,
  stats,
  actions,
  children,
  className = "",
  shellClassName = "",
  contentClassName = "",
  align = "center",
}: HeroSectionProps) {
  const alignClass = align === "left" ? "hero-section-content-left" : "hero-section-content-center";

  return (
    <section className={["hero-section", className].filter(Boolean).join(" ")}>
      <div className={["hero-section-shell", shellClassName].filter(Boolean).join(" ")}>
        <div className={["hero-section-content", alignClass, contentClassName].filter(Boolean).join(" ")}>
          {eyebrow ? <p className="hero-eyebrow">{eyebrow}</p> : null}
          {title ? (
            <h1 className="hero-title">
              {icon ? <span className="hero-icon">{icon}</span> : null}
              <span>{title}</span>
            </h1>
          ) : null}
          {description ? <p className="hero-description">{description}</p> : null}
          {actions ? <div className="hero-actions">{actions}</div> : null}
          {stats?.length ? (
            <div className="hero-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <p className="hero-stat-value">{stat.value}</p>
                  <p className="hero-stat-label">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
