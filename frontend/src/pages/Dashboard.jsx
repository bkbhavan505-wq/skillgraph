import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { LoadingState, ErrorState } from "../components/StateViews.jsx";
import NetworkGraph from "../components/NetworkGraph.jsx";
import { CardLink } from "../components/Card.jsx";

export default function Dashboard() {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setState({ loading: true, error: null, data: null });
    try {
      const [candidates, jobs, skills, companies] = await Promise.all([
        api.listCandidates(),
        api.listJobs(),
        api.listSkills(),
        api.listCompanies(),
      ]);
      setState({ loading: false, error: null, data: { candidates, jobs, skills, companies } });
    } catch (e) {
      setState({ loading: false, error: e.message, data: null });
    }
  }

  return (
    <div>
      <section className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
            Job &amp; skills graph &middot; CognoDB
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-4">
            Every hire is a<br />shortest path.
          </h1>
          <p className="text-papermuted leading-relaxed max-w-md mb-6">
            SkillGraph models candidates, skills, jobs and companies as one connected graph,
            so questions like &ldquo;which job is this person two skills away from?&rdquo;
            or &ldquo;how does Docker relate to Java in our skill space?&rdquo; are a single
            traversal, not a pile of joins.
          </p>
          <div className="flex gap-3">
            <Link
              to="/candidates"
              className="px-4 py-2 rounded-md bg-amber text-ink font-mono text-sm hover:bg-amber/90 transition-colors"
            >
              Browse candidates
            </Link>
            <Link
              to="/skills"
              className="px-4 py-2 rounded-md border border-white/20 font-mono text-sm hover:border-amber/50 transition-colors"
            >
              Trace a skill path
            </Link>
          </div>
        </div>
        <div className="border border-white/10 rounded-lg bg-inkraised p-4">
          {state.loading && <LoadingState label="Reading the graph" />}
          {state.error && <ErrorState message={state.error} onRetry={load} />}
          {state.data && <OverviewGraph {...state.data} />}
        </div>
      </section>

      {state.data && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <Stat label="Candidates" value={state.data.candidates.length} to="/candidates" />
          <Stat label="Open roles" value={state.data.jobs.length} to="/jobs" />
          <Stat label="Skills tracked" value={state.data.skills.length} to="/skills" />
          <Stat label="Companies" value={state.data.companies.length} to="/jobs" />
        </section>
      )}

      <section>
        <h2 className="font-display text-2xl mb-2">Why a graph, not a spreadsheet</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <ReasonCard
            title="Multi-hop matching"
            body="Candidate &rarr; skill &rarr; job is a two-hop traversal here. In SQL it's a join through a bridge table, repeated for every entity you want to rank by overlap."
          />
          <ReasonCard
            title="Variable-length paths"
            body="&ldquo;How is Docker related to Java?&rdquo; needs a shortest path through a skill-adjacency graph of unknown length. That's a recursive CTE with a cycle guard in SQL; one pattern here."
          />
          <ReasonCard
            title="Similarity without pre-computing"
            body="&ldquo;Companies like this one&rdquo; and &ldquo;candidates like you&rdquo; both fall out of the same shape: shared neighbours two hops away, ranked live."
          />
        </div>
      </section>
    </div>
  );
}

function OverviewGraph({ candidates, jobs, skills }) {
  const topSkills = skills.slice(0, 6);
  const nodes = [
    { id: "center", label: "SkillGraph", group: "center" },
    ...candidates.slice(0, 3).map((c) => ({ id: `c-${c.id}`, label: c.name, group: "candidate" })),
    ...jobs.slice(0, 3).map((j) => ({ id: `j-${j.id}`, label: j.title, group: "job" })),
    ...topSkills.slice(0, 2).map((s) => ({ id: `s-${s.name}`, label: s.name, group: "skill" })),
  ];
  const edges = nodes.filter((n) => n.id !== "center").map((n) => ({ source: "center", target: n.id }));
  return <NetworkGraph nodes={nodes} edges={edges} size={340} />;
}

function Stat({ label, value, to }) {
  return (
    <CardLink to={to} className="text-center">
      <div className="font-display text-3xl text-amber">{value}</div>
      <div className="font-mono text-xs text-papermuted uppercase tracking-wider mt-1">{label}</div>
    </CardLink>
  );
}

function ReasonCard({ title, body }) {
  return (
    <div className="border border-white/10 rounded-lg p-5 bg-inkraised">
      <h3 className="font-display text-lg mb-2 text-paper">{title}</h3>
      <p
        className="text-sm text-papermuted leading-relaxed"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
}
