import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client.js";
import { LoadingState, ErrorState, EmptyState } from "../components/StateViews.jsx";
import { Card, CardLink } from "../components/Card.jsx";
import NetworkGraph from "../components/NetworkGraph.jsx";
import MatchBar from "../components/MatchBar.jsx";
import SkillPill from "../components/SkillPill.jsx";

export default function JobDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setState({ loading: true, error: null, data: null });
    try {
      const data = await api.getJob(id);
      setState({ loading: false, error: null, data });
    } catch (e) {
      setState({ loading: false, error: e.message, data: null });
    }
  }

  if (state.loading) return <LoadingState label="Loading job" />;
  if (state.error) return <ErrorState message={state.error} onRetry={load} />;
  if (!state.data) return null;

  const { job, requirements, candidateMatches, similarCompanies } = state.data;

  const graphNodes = [
    { id: "center", label: job.title, group: "center" },
    ...requirements.slice(0, 8).map((r) => ({ id: `s-${r.skillName}`, label: r.skillName, group: "skill" })),
  ];
  const graphEdges = graphNodes.filter((n) => n.id !== "center").map((n) => ({ source: "center", target: n.id }));

  return (
    <div>
      <Link to="/jobs" className="text-xs font-mono text-papermuted hover:text-amber">
        &larr; All jobs
      </Link>

      <div className="grid md:grid-cols-3 gap-8 mt-4 mb-12">
        <div className="md:col-span-2">
          <h1 className="font-display text-3xl mb-1">{job.title}</h1>
          <p className="text-sm font-mono text-papermuted mb-4">
            {job.companyName} &middot; {job.location} &middot; {job.employmentType} &middot; min {job.minExperience} yr exp
          </p>
          <p className="text-papermuted leading-relaxed mb-6">{job.description}</p>

          <h2 className="font-display text-lg mb-3">Required skills</h2>
          <div className="flex flex-wrap gap-2">
            {requirements.map((r) => (
              <SkillPill key={r.skillName} tone={r.mandatory ? "have" : "neutral"}>
                {r.skillName} {r.mandatory ? "" : "(nice to have)"}
              </SkillPill>
            ))}
          </div>
        </div>
        <Card>
          <NetworkGraph nodes={graphNodes} edges={graphEdges} size={260} />
        </Card>
      </div>

      <section className="mb-12">
        <h2 className="font-display text-2xl mb-1">Matching candidates</h2>
        <p className="text-sm text-papermuted mb-4">
          Ranked by required-skill overlap, including near-misses worth an upskilling conversation.
        </p>
        {candidateMatches.length === 0 ? (
          <EmptyState title="No matching candidates yet" hint="No one in the pool shares a required skill." />
        ) : (
          <div className="space-y-3">
            {candidateMatches.map((m) => (
              <CardLink key={m.candidate.id} to={`/candidates/${m.candidate.id}`}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-display text-lg">{m.candidate.name}</h3>
                    <p className="text-xs font-mono text-papermuted">
                      {m.candidate.location} &middot; {m.candidate.experienceYears} yr exp
                    </p>
                  </div>
                </div>
                <MatchBar matched={m.matchedSkillCount} required={m.requiredSkillCount} />
                {m.missingSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {m.missingSkills.map((s) => (
                      <SkillPill key={s} tone="missing">
                        gap: {s}
                      </SkillPill>
                    ))}
                  </div>
                )}
              </CardLink>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl mb-1">Companies hiring similar skills</h2>
        <p className="text-sm text-papermuted mb-4">
          Found by walking job &rarr; skill &rarr; job &rarr; company, two hops out from {job.companyName}.
        </p>
        {similarCompanies.length === 0 ? (
          <EmptyState title="No overlapping companies found" />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {similarCompanies.map((sc) => (
              <Card key={sc.company.name}>
                <h3 className="font-display text-base mb-1">{sc.company.name}</h3>
                <p className="text-xs font-mono text-papermuted mb-2">
                  {sc.company.industry} &middot; {sc.sharedSkillCount} shared skill{sc.sharedSkillCount === 1 ? "" : "s"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sc.sharedSkills.slice(0, 5).map((s) => (
                    <SkillPill key={s}>{s}</SkillPill>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
