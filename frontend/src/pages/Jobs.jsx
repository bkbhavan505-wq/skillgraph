import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { LoadingState, ErrorState, EmptyState } from "../components/StateViews.jsx";
import { CardLink } from "../components/Card.jsx";

export default function Jobs() {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setState({ loading: true, error: null, data: null });
    try {
      const data = await api.listJobs();
      setState({ loading: false, error: null, data });
    } catch (e) {
      setState({ loading: false, error: e.message, data: null });
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Open roles</h1>
      <p className="text-papermuted mb-8">Each posting links to ranked candidate matches and similar companies.</p>

      {state.loading && <LoadingState label="Loading jobs" />}
      {state.error && <ErrorState message={state.error} onRetry={load} />}
      {state.data && state.data.length === 0 && (
        <EmptyState title="No jobs yet" hint="Run the seed script to populate CognoDB." />
      )}
      {state.data && state.data.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {state.data.map((j) => (
            <CardLink key={j.id} to={`/jobs/${j.id}`}>
              <h3 className="font-display text-lg mb-1">{j.title}</h3>
              <p className="text-xs font-mono text-papermuted mb-3">
                {j.companyName} &middot; {j.location} &middot; {j.employmentType}
              </p>
              <p className="text-sm text-papermuted leading-relaxed">{j.description}</p>
            </CardLink>
          ))}
        </div>
      )}
    </div>
  );
}
