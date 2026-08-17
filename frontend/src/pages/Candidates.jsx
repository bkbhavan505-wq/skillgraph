import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { LoadingState, ErrorState, EmptyState } from "../components/StateViews.jsx";
import { CardLink } from "../components/Card.jsx";

export default function Candidates() {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setState({ loading: true, error: null, data: null });
    try {
      const data = await api.listCandidates();
      setState({ loading: false, error: null, data });
    } catch (e) {
      setState({ loading: false, error: e.message, data: null });
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Candidates</h1>
      <p className="text-papermuted mb-8">Every profile links to ranked job matches, computed live.</p>

      {state.loading && <LoadingState label="Loading candidates" />}
      {state.error && <ErrorState message={state.error} onRetry={load} />}
      {state.data && state.data.length === 0 && (
        <EmptyState title="No candidates yet" hint="Run the seed script to populate CognoDB." />
      )}
      {state.data && state.data.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.data.map((c) => (
            <CardLink key={c.id} to={`/candidates/${c.id}`}>
              <h3 className="font-display text-lg mb-1">{c.name}</h3>
              <p className="text-xs font-mono text-papermuted mb-3">
                {c.location} &middot; {c.experienceYears} yr exp
              </p>
              <p className="text-sm text-papermuted leading-relaxed">{c.bio}</p>
            </CardLink>
          ))}
        </div>
      )}
    </div>
  );
}
