export default function MatchBar({ matched, required }) {
  const pct = required > 0 ? Math.round((matched / required) * 100) : 0;
  const color = pct === 100 ? "bg-teal" : pct >= 50 ? "bg-amber" : "bg-coral";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs text-papermuted whitespace-nowrap">
        {matched}/{required} skills
      </span>
    </div>
  );
}
