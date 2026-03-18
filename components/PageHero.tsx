import { ReactNode } from "react";

type HeroStat = {
  label: string;
  value: ReactNode;
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  stats?: HeroStat[];
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  icon,
  stats,
  actions,
  children,
  className = "",
}: PageHeroProps) {
  return (
    <section className={`page-hero ${className}`.trim()}>
      <div className="page-hero-shell">
        {eyebrow ? <p className="page-hero-eyebrow">{eyebrow}</p> : null}
        <h1 className="page-hero-title">
          {icon ? <span className="page-hero-icon">{icon}</span> : null}
          <span>{title}</span>
        </h1>
        {description ? <p className="page-hero-description">{description}</p> : null}
        {actions ? <div className="page-hero-actions">{actions}</div> : null}
        {stats?.length ? (
          <div className="page-hero-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="page-hero-stat">
                <p className="page-hero-stat-value">{stat.value}</p>
                <p className="page-hero-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
