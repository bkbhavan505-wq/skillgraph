/**
 * The signature element: a small radial network diagram. Not decoration --
 * this is literally what the graph queries traverse, drawn as it's computed.
 * One center node (the subject) with related nodes arranged around it and
 * edges connecting them. Deterministic radial layout, no physics engine needed
 * at this node count.
 */
const GROUP_COLORS = {
  center: "#E8A33D",
  skill: "#3F7C74",
  job: "#C1503A",
  candidate: "#8AA1C4",
  company: "#B9B6AC",
};

export default function NetworkGraph({ nodes, edges, size = 320, radius }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = radius ?? size * 0.36;

  const center = nodes.find((n) => n.group === "center") || nodes[0];
  const others = nodes.filter((n) => n !== center);
  const positioned = new Map();
  positioned.set(center.id, { x: cx, y: cy, ...center });

  others.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / Math.max(others.length, 1) - Math.PI / 2;
    positioned.set(n.id, {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      ...n,
    });
  });

  return (
    <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      <g>
        {edges.map((e, i) => {
          const a = positioned.get(e.source);
          const b = positioned.get(e.target);
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#B9B6AC"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
          );
        })}
      </g>
      <g>
        {[...positioned.values()].map((n) => (
          <g key={n.id} className="transition-transform duration-300">
            <circle
              cx={n.x}
              cy={n.y}
              r={n.group === "center" ? 9 : 6}
              fill={GROUP_COLORS[n.group] || "#8AA1C4"}
              stroke="#10121B"
              strokeWidth={2}
            />
            <text
              x={n.x}
              y={n.y + (n.group === "center" ? 22 : 18)}
              textAnchor="middle"
              className="fill-papermuted font-mono"
              fontSize={10}
            >
              {n.label.length > 16 ? n.label.slice(0, 15) + "\u2026" : n.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
