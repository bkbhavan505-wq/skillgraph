import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { LoadingState, ErrorState, EmptyState } from "../components/StateViews.jsx";
import { Card } from "../components/Card.jsx";
import SkillPill from "../components/SkillPill.jsx";

export default function Skills() {
  const [state, setState] = useState({ loading: true, error: null, data: null });
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pathState, setPathState] = useState({ loading: false, error: null, data: null });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setState({ loading: true, error: null, data: null });
    try {
      const data = await api.listSkills();
      setState({ loading: false, error: null, data });
      if (data.length >= 2) {
        setFrom(data[0].name);
        setTo(data[Math.min(5, data.length - 1)].name);
      }
    } catch (e) {
      setState({ loading: false, error: e.message, data: null });
    }
  }

  async function tracePath(e) {
    e.preventDefault();
    if (!from || !to || from === to) return;
    setPathState({ loading: true, error: null, data: null });
    try {
      const data = await api.skillPath(from, to);
      setPathState({ loading: false, error: null, data });
    } catch (err) {
      setPathState({ loading: false, error: err.message, data: null });
    }
  }

  const grouped = {};
  if (state.data) {
    for (const s of state.data) {
      grouped[s.category] = grouped[s.category] || [];
      grouped[s.category].push(s);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Skill paths</h1>
      <p className="text-papermuted mb-8">
        Skills are connected by how often they show up together on real postings. Trace the shortest
        chain between any two &mdash; the query relational databases handle worst.
      </p>

      <Card className="mb-12">
        <form onSubmit={tracePath} className="flex flex-wrap items-end gap-3 mb-4">
          <Field label="From">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-ink border border-white/15 rounded-md px-3 py-2 text-sm font-mono"
            >
              {state.data?.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="To">
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-ink border border-white/15 rounded-md px-3 py-2 text-sm font-mono"
            >
              {state.data?.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-amber text-ink font-mono text-sm hover:bg-amber/90 transition-colors"
          >
            Trace shortest path
          </button>
        </form>

        {pathState.loading && <LoadingState label="Walking the graph" />}
        {pathState.error && <ErrorState message={pathState.error} />}
        {pathState.data && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {pathState.data.skillNames.map((name, i) => (
              <span key={name} className="flex items-center gap-2">
                <SkillPill tone={i === 0 || i === pathState.data.skillNames.length - 1 ? "have" : "neutral"}>
                  {name}
                </SkillPill>
                {i < pathState.data.skillNames.length - 1 && <span className="text-papermuted">&rarr;</span>}
              </span>
            ))}
            <span className="text-xs font-mono text-papermuted ml-2">
              ({pathState.data.hops} hop{pathState.data.hops === 1 ? "" : "s"})
            </span>
          </div>
        )}
      </Card>

      {state.loading && <LoadingState label="Loading skills" />}
      {state.error && <ErrorState message={state.error} onRetry={load} />}
      {state.data && state.data.length === 0 && <EmptyState title="No skills yet" />}
      {state.data && (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, list]) => (
            <div key={category}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-papermuted mb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {list.map((s) => (
                  <SkillPill key={s.name}>{s.name}</SkillPill>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-xs uppercase tracking-wider text-papermuted">{label}</span>
      {children}
    </label>
  );
}
