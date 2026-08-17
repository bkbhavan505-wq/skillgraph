import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Candidates from "./pages/Candidates.jsx";
import CandidateDetail from "./pages/CandidateDetail.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import Skills from "./pages/Skills.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/skills" element={<Skills />} />
        </Routes>
      </main>
      <footer className="border-t border-white/10 py-6">
        <div className="max-w-6xl mx-auto px-6 text-xs font-mono text-papermuted flex justify-between">
          <span>SkillGraph &middot; built on CognoDB</span>
          <span>openCypher over Bolt</span>
        </div>
      </footer>
    </div>
  );
}
