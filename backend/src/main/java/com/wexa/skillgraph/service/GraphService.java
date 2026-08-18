package com.wexa.skillgraph.service;

import com.wexa.skillgraph.exception.NotFoundException;
import com.wexa.skillgraph.model.*;
import com.wexa.skillgraph.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/** Thin orchestration layer between controllers and the graph repositories. */
@Service
public class GraphService {

    private final CandidateRepository candidateRepo;
    private final JobRepository jobRepo;
    private final SkillRepository skillRepo;
    private final CompanyRepository companyRepo;
    private final MatchRepository matchRepo;

    public GraphService(CandidateRepository candidateRepo, JobRepository jobRepo, SkillRepository skillRepo,
                         CompanyRepository companyRepo, MatchRepository matchRepo) {
        this.candidateRepo = candidateRepo;
        this.jobRepo = jobRepo;
        this.skillRepo = skillRepo;
        this.companyRepo = companyRepo;
        this.matchRepo = matchRepo;
    }

    public List<Candidate> listCandidates() {
        return candidateRepo.findAll();
    }

    public Map<String, Object> getCandidateProfile(String id) {
        Candidate candidate = candidateRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("No candidate with id " + id));
        List<CandidateSkill> skills = candidateRepo.findSkills(id);
        List<JobMatch> jobMatches = matchRepo.jobsForCandidate(id, 10);
        List<Map<String, Object>> similar = candidateRepo.findSimilarCandidates(id, 5);
        return Map.of(
                "candidate", candidate,
                "skills", skills,
                "jobMatches", jobMatches,
                "similarCandidates", similar
        );
    }

    public List<Job> listJobs() {
        return jobRepo.findAll();
    }

    public Map<String, Object> getJobProfile(String id) {
        Job job = jobRepo.findById(id).orElseThrow(() -> new NotFoundException("No job with id " + id));
        List<SkillRequirement> requirements = jobRepo.findRequirements(id);
        List<CandidateMatch> candidateMatches = matchRepo.candidatesForJob(id, 10);
        List<Map<String, Object>> similarCompanies = companyRepo.findSimilarCompanies(job.companyName(), 5);
        return Map.of(
                "job", job,
                "requirements", requirements,
                "candidateMatches", candidateMatches,
                "similarCompanies", similarCompanies
        );
    }


    public Map<String, Object> getSkillGap(String candidateId, String jobId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new NotFoundException("No job with id " + jobId));

        Candidate candidate = candidateRepo.findById(candidateId)
                .orElseThrow(() -> new NotFoundException("No candidate with id " + candidateId));

        List<CandidateMatch> matches = matchRepo.candidatesForJob(jobId, 100);

        return matches.stream()
                .filter(match -> match.candidate().id().equals(candidate.id()))
                .findFirst()
                .map(match -> Map.<String, Object>of(
                        "candidateName", candidate.name(),
                        "jobTitle", job.title(),
                        "matchedSkills", match.matchedSkills(),
                        "missingSkills", match.missingSkills(),
                        "matchedSkillCount", match.matchedSkillCount(),
                        "requiredSkillCount", match.requiredSkillCount(),
                        "matchPercentage",
                        match.requiredSkillCount() == 0
                                ? 0.0
                                : match.matchedSkillCount() * 100.0
                                  / match.requiredSkillCount()
                ))
                .orElseThrow(() ->
                        new NotFoundException(
                                "No match data found for candidate " + candidateId +
                                        " and job " + jobId
                        ));
    }

    public List<Skill> listSkills() {
        return skillRepo.findAll();
    }

    public List<Skill> relatedSkills(String skillName) {
        return skillRepo.findRelated(skillName);
    }

    public SkillPath skillPath(String from, String to) {
        return skillRepo.shortestSkillPath(from, to)
                .orElseThrow(() -> new NotFoundException("No connection found between \"" + from + "\" and \"" + to + "\" within 6 hops"));
    }

    public List<Company> listCompanies() {
        return companyRepo.findAll();
    }
}
