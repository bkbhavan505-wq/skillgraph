import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client.js";
import { LoadingState, ErrorState, EmptyState } from "../components/StateViews.jsx";
import { Card, CardLink } from "../components/Card.jsx";
import NetworkGraph from "../components/NetworkGraph.jsx";
import MatchBar from "../components/MatchBar.jsx";
import SkillPill from "../components/SkillPill.jsx";

export default function CandidateDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setState({ loading: true, error: null, data: null });
    try {
      const data = await api.getCandidate(id);
      setState({ loading: false, error: null, data });
    } catch (e) {
      setState({ loading: false, error: e.message, data: null });
    }
  }

  if (state.loading) return <LoadingState label="Loading candidate" />;
  if (state.error) return <ErrorState message={state.error} onRetry={load} />;
  if (!state.data) return null;

  const { candidate, skills, jobMatches, similarCandidates } = state.data;

  const graphNodes = [
    { id: "center", label: candidate.name, group: "center" },
    ...skills.slice(0, 8).map((s) => ({ id: `s-${s.skillName}`, label: s.skillName, group: "skill" })),
  ];
  const graphEdges = graphNodes.filter((n) => n.id !== "center").map((n) => ({ source: "center", target: n.id }));

  return (
    <div>
      <Link to="/candidates" className="text-xs font-mono text-papermuted hover:text-amber">
        &larr; All candidates
      </Link>

      <div className="grid md:grid-cols-3 gap-8 mt-4 mb-12">
        <div className="md:col-span-2">
          <h1 className="font-display text-3xl mb-1">{candidate.name}</h1>
          <p className="text-sm font-mono text-papermuted mb-4">
            {candidate.location} &middot; {candidate.experienceYears} yr experience &middot; {candidate.email}
          </p>
          <p className="text-papermuted leading-relaxed mb-6">{candidate.bio}</p>

          <h2 className="font-display text-lg mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((s) => (
              <SkillPill key={s.skillName} tone="have">
                {s.skillName} &middot; L{s.proficiency}
              </SkillPill>
            ))}
          </div>
        </div>
        <Card>
          <NetworkGraph nodes={graphNodes} edges={graphEdges} size={260} />
        </Card>
      </div>

      <section className="mb-12">
        <h2 className="font-display text-2xl mb-1">Matching jobs</h2>
        <p className="text-sm text-papermuted mb-4">
          Ranked by required-skill overlap &mdash; a two-hop traversal from candidate to job through skills.
        </p>
        {jobMatches.length === 0 ? (
          <EmptyState title="No job matches yet" hint="This candidate doesn't share any skills with open roles." />
        ) : (
          <div className="space-y-3">
            {jobMatches.map((m) => (
              <CardLink key={m.job.id} to={`/jobs/${m.job.id}`}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-display text-lg">{m.job.title}</h3>
                    <p className="text-xs font-mono text-papermuted">{m.job.companyName} &middot; {m.job.location}</p>
                  </div>
                </div>
                <MatchBar matched={m.matchedSkillCount} required={m.requiredSkillCount} />
                {m.missingSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {m.missingSkills.map((s) => (
                      <SkillPill key={s} tone="missing">
                        needs {s}
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
        <h2 className="font-display text-2xl mb-1">Candidates like {candidate.name.split(" ")[0]}</h2>
        <p className="text-sm text-papermuted mb-4">Shared skills, ranked by overlap.</p>
        {similarCandidates.length === 0 ? (
          <EmptyState title="No overlapping candidates found" />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {similarCandidates.map((sc) => (
              <CardLink key={sc.candidate.id} to={`/candidates/${sc.candidate.id}`}>
                <h3 className="font-display text-base mb-1">{sc.candidate.name}</h3>
                <p className="text-xs font-mono text-papermuted mb-2">
                  {sc.sharedSkillCount} shared skill{sc.sharedSkillCount === 1 ? "" : "s"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sc.sharedSkills.slice(0, 5).map((s) => (
                    <SkillPill key={s}>{s}</SkillPill>
                  ))}
                </div>
              </CardLink>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
