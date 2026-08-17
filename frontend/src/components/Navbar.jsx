import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Overview", end: true },
  { to: "/candidates", label: "Candidates" },
  { to: "/jobs", label: "Jobs" },
  { to: "/skills", label: "Skill paths" },
];

export default function Navbar() {
  return (
    <header className="border-b border-white/10 sticky top-0 z-10 bg-ink/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="2.4" fill="#E8A33D" />
            <circle cx="19" cy="6" r="2.4" fill="#3F7C74" />
            <circle cx="19" cy="18" r="2.4" fill="#3F7C74" />
            <line x1="7" y1="11" x2="17" y2="7" stroke="#B9B6AC" strokeWidth="1" />
            <line x1="7" y1="13" x2="17" y2="17" stroke="#B9B6AC" strokeWidth="1" />
          </svg>
          <span className="font-display text-xl tracking-tight">SkillGraph</span>
        </NavLink>
        <nav className="flex gap-1 font-mono text-xs uppercase tracking-wider">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md transition-colors ${
                  isActive ? "text-amber bg-white/5" : "text-papermuted hover:text-paper"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
