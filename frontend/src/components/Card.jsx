import { Link } from "react-router-dom";

export function Card({ children, className = "" }) {
  return (
    <div className={`border border-white/10 rounded-lg bg-inkraised p-5 ${className}`}>{children}</div>
  );
}

export function CardLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`block border border-white/10 rounded-lg bg-inkraised p-5 hover:border-amber/40 hover:bg-white/5 transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}
