const tones = {
  have: "border-teal/50 text-teal bg-teal/10",
  missing: "border-coral/50 text-coral bg-coral/10",
  neutral: "border-white/15 text-papermuted bg-white/5",
};

export default function SkillPill({ children, tone = "neutral" }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full border text-xs font-mono ${tones[tone]}`}>
      {children}
    </span>
  );
}
