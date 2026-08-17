// ============================================================================
// SkillGraph seed data
// Realistic-ish tech hiring data for Bengaluru/remote entry-to-mid level roles.
// All statements use MERGE so the script is safe to re-run.
// ============================================================================

// --- Constraints (uniqueness, also gives CognoDB fast lookups) -------------
CREATE CONSTRAINT candidate_id IF NOT EXISTS FOR (c:Candidate) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT job_id IF NOT EXISTS FOR (j:Job) REQUIRE j.id IS UNIQUE;
CREATE CONSTRAINT skill_name IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE;
CREATE CONSTRAINT company_name IF NOT EXISTS FOR (co:Company) REQUIRE co.name IS UNIQUE;

// --- Skills ------------------------------------------------------------------
MERGE (s:Skill {name:"Java"}) SET s.category="Language";
MERGE (s:Skill {name:"Python"}) SET s.category="Language";
MERGE (s:Skill {name:"JavaScript"}) SET s.category="Language";
MERGE (s:Skill {name:"TypeScript"}) SET s.category="Language";
MERGE (s:Skill {name:"C++"}) SET s.category="Language";
MERGE (s:Skill {name:"Spring Boot"}) SET s.category="Backend";
MERGE (s:Skill {name:"Hibernate"}) SET s.category="Backend";
MERGE (s:Skill {name:"REST APIs"}) SET s.category="Backend";
MERGE (s:Skill {name:"Node.js"}) SET s.category="Backend";
MERGE (s:Skill {name:"Django"}) SET s.category="Backend";
MERGE (s:Skill {name:"React"}) SET s.category="Frontend";
MERGE (s:Skill {name:"HTML/CSS"}) SET s.category="Frontend";
MERGE (s:Skill {name:"Redux"}) SET s.category="Frontend";
MERGE (s:Skill {name:"MySQL"}) SET s.category="Database";
MERGE (s:Skill {name:"PostgreSQL"}) SET s.category="Database";
MERGE (s:Skill {name:"MongoDB"}) SET s.category="Database";
MERGE (s:Skill {name:"Graph Databases"}) SET s.category="Database";
MERGE (s:Skill {name:"Docker"}) SET s.category="DevOps";
MERGE (s:Skill {name:"Kubernetes"}) SET s.category="DevOps";
MERGE (s:Skill {name:"AWS"}) SET s.category="Cloud";
MERGE (s:Skill {name:"Azure"}) SET s.category="Cloud";
MERGE (s:Skill {name:"CI/CD"}) SET s.category="DevOps";
MERGE (s:Skill {name:"Git"}) SET s.category="Tooling";
MERGE (s:Skill {name:"Microservices"}) SET s.category="Architecture";
MERGE (s:Skill {name:"Machine Learning"}) SET s.category="Data";
MERGE (s:Skill {name:"Data Structures & Algorithms"}) SET s.category="Fundamentals";

// --- Skill relationships (what tends to travel together in real job postings) -
MATCH (a:Skill {name:"Java"}), (b:Skill {name:"Spring Boot"}) MERGE (a)-[:RELATED_TO {strength:0.9}]->(b);
MATCH (a:Skill {name:"Spring Boot"}), (b:Skill {name:"Hibernate"}) MERGE (a)-[:RELATED_TO {strength:0.8}]->(b);
MATCH (a:Skill {name:"Spring Boot"}), (b:Skill {name:"REST APIs"}) MERGE (a)-[:RELATED_TO {strength:0.85}]->(b);
MATCH (a:Skill {name:"Spring Boot"}), (b:Skill {name:"Microservices"}) MERGE (a)-[:RELATED_TO {strength:0.7}]->(b);
MATCH (a:Skill {name:"JavaScript"}), (b:Skill {name:"React"}) MERGE (a)-[:RELATED_TO {strength:0.9}]->(b);
MATCH (a:Skill {name:"React"}), (b:Skill {name:"Redux"}) MERGE (a)-[:RELATED_TO {strength:0.7}]->(b);
MATCH (a:Skill {name:"JavaScript"}), (b:Skill {name:"TypeScript"}) MERGE (a)-[:RELATED_TO {strength:0.75}]->(b);
MATCH (a:Skill {name:"JavaScript"}), (b:Skill {name:"Node.js"}) MERGE (a)-[:RELATED_TO {strength:0.8}]->(b);
MATCH (a:Skill {name:"HTML/CSS"}), (b:Skill {name:"React"}) MERGE (a)-[:RELATED_TO {strength:0.6}]->(b);
MATCH (a:Skill {name:"Python"}), (b:Skill {name:"Django"}) MERGE (a)-[:RELATED_TO {strength:0.85}]->(b);
MATCH (a:Skill {name:"Python"}), (b:Skill {name:"Machine Learning"}) MERGE (a)-[:RELATED_TO {strength:0.7}]->(b);
MATCH (a:Skill {name:"Microservices"}), (b:Skill {name:"Docker"}) MERGE (a)-[:RELATED_TO {strength:0.8}]->(b);
MATCH (a:Skill {name:"Docker"}), (b:Skill {name:"Kubernetes"}) MERGE (a)-[:RELATED_TO {strength:0.85}]->(b);
MATCH (a:Skill {name:"Docker"}), (b:Skill {name:"CI/CD"}) MERGE (a)-[:RELATED_TO {strength:0.65}]->(b);
MATCH (a:Skill {name:"Kubernetes"}), (b:Skill {name:"AWS"}) MERGE (a)-[:RELATED_TO {strength:0.6}]->(b);
MATCH (a:Skill {name:"AWS"}), (b:Skill {name:"Azure"}) MERGE (a)-[:RELATED_TO {strength:0.4}]->(b);
MATCH (a:Skill {name:"REST APIs"}), (b:Skill {name:"MySQL"}) MERGE (a)-[:RELATED_TO {strength:0.6}]->(b);
MATCH (a:Skill {name:"MySQL"}), (b:Skill {name:"PostgreSQL"}) MERGE (a)-[:RELATED_TO {strength:0.55}]->(b);
MATCH (a:Skill {name:"MongoDB"}), (b:Skill {name:"Node.js"}) MERGE (a)-[:RELATED_TO {strength:0.65}]->(b);
MATCH (a:Skill {name:"Graph Databases"}), (b:Skill {name:"REST APIs"}) MERGE (a)-[:RELATED_TO {strength:0.5}]->(b);
MATCH (a:Skill {name:"Data Structures & Algorithms"}), (b:Skill {name:"Java"}) MERGE (a)-[:RELATED_TO {strength:0.6}]->(b);
MATCH (a:Skill {name:"C++"}), (b:Skill {name:"Data Structures & Algorithms"}) MERGE (a)-[:RELATED_TO {strength:0.7}]->(b);
MATCH (a:Skill {name:"Git"}), (b:Skill {name:"CI/CD"}) MERGE (a)-[:RELATED_TO {strength:0.5}]->(b);

// --- Companies ---------------------------------------------------------------
MERGE (co:Company {name:"Nimbus Retail Systems"}) SET co.industry="E-commerce", co.location="Bengaluru";
MERGE (co:Company {name:"Finstra Payments"}) SET co.industry="Fintech", co.location="Bengaluru";
MERGE (co:Company {name:"Vantage Cloud Labs"}) SET co.industry="Cloud Infrastructure", co.location="Remote";
MERGE (co:Company {name:"HealthBridge Analytics"}) SET co.industry="HealthTech", co.location="Hyderabad";
MERGE (co:Company {name:"Northlane Logistics"}) SET co.industry="Logistics", co.location="Pune";
MERGE (co:Company {name:"Peregrine Data Co"}) SET co.industry="Data & AI", co.location="Remote";

// --- Jobs ----------------------------------------------------------------------
MERGE (j:Job {id:"job-001"}) SET j.title="Associate Java Full Stack Developer", j.description="Build and maintain internal order-management services and their React admin console.", j.location="Bengaluru", j.employmentType="Full-time", j.minExperience=0, j.postedDate="2026-07-20";
MERGE (j:Job {id:"job-002"}) SET j.title="Backend Engineer - Payments", j.description="Own REST services for transaction processing with strict correctness and audit requirements.", j.location="Bengaluru", j.employmentType="Full-time", j.minExperience=1, j.postedDate="2026-07-15";
MERGE (j:Job {id:"job-003"}) SET j.title="Cloud Platform Engineer", j.description="Operate containerized workloads and CI/CD pipelines across multi-region deployments.", j.location="Remote", j.employmentType="Full-time", j.minExperience=2, j.postedDate="2026-07-10";
MERGE (j:Job {id:"job-004"}) SET j.title="Junior Data Engineer", j.description="Build ETL pipelines and dashboards over clinical operations data.", j.location="Hyderabad", j.employmentType="Full-time", j.minExperience=0, j.postedDate="2026-07-25";
MERGE (j:Job {id:"job-005"}) SET j.title="Frontend Developer - React", j.description="Own the shipment-tracking web app used by dispatch teams nationwide.", j.location="Pune", j.employmentType="Full-time", j.minExperience=1, j.postedDate="2026-07-18";
MERGE (j:Job {id:"job-006"}) SET j.title="Machine Learning Engineer", j.description="Build recommendation models over structured operational datasets.", j.location="Remote", j.employmentType="Full-time", j.minExperience=1, j.postedDate="2026-07-05";
MERGE (j:Job {id:"job-007"}) SET j.title="Software Engineer - Microservices", j.description="Decompose a monolith into Spring Boot microservices with Docker-based deployment.", j.location="Bengaluru", j.employmentType="Full-time", j.minExperience=1, j.postedDate="2026-07-22";
MERGE (j:Job {id:"job-008"}) SET j.title="Graduate Software Engineer", j.description="Rotational engineering role across backend, frontend and data teams for fresh graduates.", j.location="Bengaluru", j.employmentType="Full-time", j.minExperience=0, j.postedDate="2026-08-01";

MATCH (j:Job {id:"job-001"}), (co:Company {name:"Nimbus Retail Systems"}) MERGE (j)-[:POSTED_BY]->(co);
MATCH (j:Job {id:"job-002"}), (co:Company {name:"Finstra Payments"}) MERGE (j)-[:POSTED_BY]->(co);
MATCH (j:Job {id:"job-003"}), (co:Company {name:"Vantage Cloud Labs"}) MERGE (j)-[:POSTED_BY]->(co);
MATCH (j:Job {id:"job-004"}), (co:Company {name:"HealthBridge Analytics"}) MERGE (j)-[:POSTED_BY]->(co);
MATCH (j:Job {id:"job-005"}), (co:Company {name:"Northlane Logistics"}) MERGE (j)-[:POSTED_BY]->(co);
MATCH (j:Job {id:"job-006"}), (co:Company {name:"Peregrine Data Co"}) MERGE (j)-[:POSTED_BY]->(co);
MATCH (j:Job {id:"job-007"}), (co:Company {name:"Nimbus Retail Systems"}) MERGE (j)-[:POSTED_BY]->(co);
MATCH (j:Job {id:"job-008"}), (co:Company {name:"Finstra Payments"}) MERGE (j)-[:POSTED_BY]->(co);

// --- Job skill requirements ----------------------------------------------------
MATCH (j:Job {id:"job-001"}), (s:Skill {name:"Java"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:true}]->(s);
MATCH (j:Job {id:"job-001"}), (s:Skill {name:"Spring Boot"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:true}]->(s);
MATCH (j:Job {id:"job-001"}), (s:Skill {name:"React"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:2, mandatory:true}]->(s);
MATCH (j:Job {id:"job-001"}), (s:Skill {name:"MySQL"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:2, mandatory:false}]->(s);
MATCH (j:Job {id:"job-001"}), (s:Skill {name:"REST APIs"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:true}]->(s);
MATCH (j:Job {id:"job-001"}), (s:Skill {name:"Git"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:2, mandatory:false}]->(s);

MATCH (j:Job {id:"job-002"}), (s:Skill {name:"Java"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:4, mandatory:true}]->(s);
MATCH (j:Job {id:"job-002"}), (s:Skill {name:"Spring Boot"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:4, mandatory:true}]->(s);
MATCH (j:Job {id:"job-002"}), (s:Skill {name:"REST APIs"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:4, mandatory:true}]->(s);
MATCH (j:Job {id:"job-002"}), (s:Skill {name:"PostgreSQL"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:true}]->(s);
MATCH (j:Job {id:"job-002"}), (s:Skill {name:"Microservices"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:2, mandatory:false}]->(s);

MATCH (j:Job {id:"job-003"}), (s:Skill {name:"Docker"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:4, mandatory:true}]->(s);
MATCH (j:Job {id:"job-003"}), (s:Skill {name:"Kubernetes"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:true}]->(s);
MATCH (j:Job {id:"job-003"}), (s:Skill {name:"AWS"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:true}]->(s);
MATCH (j:Job {id:"job-003"}), (s:Skill {name:"CI/CD"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:false}]->(s);

MATCH (j:Job {id:"job-004"}), (s:Skill {name:"Python"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:true}]->(s);
MATCH (j:Job {id:"job-004"}), (s:Skill {name:"PostgreSQL"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:2, mandatory:true}]->(s);
MATCH (j:Job {id:"job-004"}), (s:Skill {name:"Machine Learning"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:1, mandatory:false}]->(s);

MATCH (j:Job {id:"job-005"}), (s:Skill {name:"React"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:4, mandatory:true}]->(s);
MATCH (j:Job {id:"job-005"}), (s:Skill {name:"JavaScript"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:4, mandatory:true}]->(s);
MATCH (j:Job {id:"job-005"}), (s:Skill {name:"Redux"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:2, mandatory:false}]->(s);
MATCH (j:Job {id:"job-005"}), (s:Skill {name:"HTML/CSS"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:true}]->(s);

MATCH (j:Job {id:"job-006"}), (s:Skill {name:"Python"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:4, mandatory:true}]->(s);
MATCH (j:Job {id:"job-006"}), (s:Skill {name:"Machine Learning"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:4, mandatory:true}]->(s);
MATCH (j:Job {id:"job-006"}), (s:Skill {name:"Data Structures & Algorithms"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:false}]->(s);

MATCH (j:Job {id:"job-007"}), (s:Skill {name:"Java"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:true}]->(s);
MATCH (j:Job {id:"job-007"}), (s:Skill {name:"Spring Boot"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:true}]->(s);
MATCH (j:Job {id:"job-007"}), (s:Skill {name:"Microservices"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:3, mandatory:true}]->(s);
MATCH (j:Job {id:"job-007"}), (s:Skill {name:"Docker"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:2, mandatory:true}]->(s);

MATCH (j:Job {id:"job-008"}), (s:Skill {name:"Java"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:2, mandatory:true}]->(s);
MATCH (j:Job {id:"job-008"}), (s:Skill {name:"Data Structures & Algorithms"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:2, mandatory:true}]->(s);
MATCH (j:Job {id:"job-008"}), (s:Skill {name:"Git"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:1, mandatory:false}]->(s);
MATCH (j:Job {id:"job-008"}), (s:Skill {name:"REST APIs"}) MERGE (j)-[:REQUIRES_SKILL {minProficiency:1, mandatory:false}]->(s);

// --- Candidates ------------------------------------------------------------------
MERGE (c:Candidate {id:"cand-001"}) SET c.name="Ananya Rao", c.email="ananya.rao@example.com", c.location="Bengaluru", c.experienceYears=0, c.bio="Fresher, ECE background, self-taught full stack.";
MERGE (c:Candidate {id:"cand-002"}) SET c.name="Rohit Malhotra", c.email="rohit.m@example.com", c.location="Bengaluru", c.experienceYears=1, c.bio="One year at a fintech startup building payment APIs.";
MERGE (c:Candidate {id:"cand-003"}) SET c.name="Sneha Iyer", c.email="sneha.iyer@example.com", c.location="Remote", c.experienceYears=2, c.bio="Cloud-focused engineer, ex-DevOps intern.";
MERGE (c:Candidate {id:"cand-004"}) SET c.name="Vikram Desai", c.email="vikram.d@example.com", c.location="Hyderabad", c.experienceYears=0, c.bio="Recent CS graduate interested in data engineering.";
MERGE (c:Candidate {id:"cand-005"}) SET c.name="Priya Nair", c.email="priya.nair@example.com", c.location="Pune", c.experienceYears=1, c.bio="Frontend-leaning full stack developer.";
MERGE (c:Candidate {id:"cand-006"}) SET c.name="Arjun Mehta", c.email="arjun.mehta@example.com", c.location="Remote", c.experienceYears=1, c.bio="Applied ML enthusiast, Kaggle competitor.";
MERGE (c:Candidate {id:"cand-007"}) SET c.name="Divya Kulkarni", c.email="divya.k@example.com", c.location="Bengaluru", c.experienceYears=1, c.bio="Backend engineer transitioning into microservices work.";
MERGE (c:Candidate {id:"cand-008"}) SET c.name="Kabir Singh", c.email="kabir.singh@example.com", c.location="Bengaluru", c.experienceYears=0, c.bio="Fresher, strong DSA fundamentals, learning Spring Boot.";

// --- Candidate skills --------------------------------------------------------
MATCH (c:Candidate {id:"cand-001"}), (s:Skill {name:"Java"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);
MATCH (c:Candidate {id:"cand-001"}), (s:Skill {name:"Spring Boot"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);
MATCH (c:Candidate {id:"cand-001"}), (s:Skill {name:"React"}) MERGE (c)-[:HAS_SKILL {proficiency:2, years:1}]->(s);
MATCH (c:Candidate {id:"cand-001"}), (s:Skill {name:"MySQL"}) MERGE (c)-[:HAS_SKILL {proficiency:2, years:1}]->(s);
MATCH (c:Candidate {id:"cand-001"}), (s:Skill {name:"REST APIs"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);
MATCH (c:Candidate {id:"cand-001"}), (s:Skill {name:"Git"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);

MATCH (c:Candidate {id:"cand-002"}), (s:Skill {name:"Java"}) MERGE (c)-[:HAS_SKILL {proficiency:4, years:1}]->(s);
MATCH (c:Candidate {id:"cand-002"}), (s:Skill {name:"Spring Boot"}) MERGE (c)-[:HAS_SKILL {proficiency:4, years:1}]->(s);
MATCH (c:Candidate {id:"cand-002"}), (s:Skill {name:"REST APIs"}) MERGE (c)-[:HAS_SKILL {proficiency:4, years:1}]->(s);
MATCH (c:Candidate {id:"cand-002"}), (s:Skill {name:"PostgreSQL"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);
MATCH (c:Candidate {id:"cand-002"}), (s:Skill {name:"Git"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);

MATCH (c:Candidate {id:"cand-003"}), (s:Skill {name:"Docker"}) MERGE (c)-[:HAS_SKILL {proficiency:4, years:2}]->(s);
MATCH (c:Candidate {id:"cand-003"}), (s:Skill {name:"Kubernetes"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);
MATCH (c:Candidate {id:"cand-003"}), (s:Skill {name:"AWS"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:2}]->(s);
MATCH (c:Candidate {id:"cand-003"}), (s:Skill {name:"CI/CD"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:2}]->(s);
MATCH (c:Candidate {id:"cand-003"}), (s:Skill {name:"Git"}) MERGE (c)-[:HAS_SKILL {proficiency:4, years:2}]->(s);

MATCH (c:Candidate {id:"cand-004"}), (s:Skill {name:"Python"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);
MATCH (c:Candidate {id:"cand-004"}), (s:Skill {name:"PostgreSQL"}) MERGE (c)-[:HAS_SKILL {proficiency:2, years:1}]->(s);
MATCH (c:Candidate {id:"cand-004"}), (s:Skill {name:"Machine Learning"}) MERGE (c)-[:HAS_SKILL {proficiency:1, years:1}]->(s);
MATCH (c:Candidate {id:"cand-004"}), (s:Skill {name:"Data Structures & Algorithms"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);

MATCH (c:Candidate {id:"cand-005"}), (s:Skill {name:"React"}) MERGE (c)-[:HAS_SKILL {proficiency:4, years:1}]->(s);
MATCH (c:Candidate {id:"cand-005"}), (s:Skill {name:"JavaScript"}) MERGE (c)-[:HAS_SKILL {proficiency:4, years:1}]->(s);
MATCH (c:Candidate {id:"cand-005"}), (s:Skill {name:"Redux"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);
MATCH (c:Candidate {id:"cand-005"}), (s:Skill {name:"HTML/CSS"}) MERGE (c)-[:HAS_SKILL {proficiency:4, years:1}]->(s);

MATCH (c:Candidate {id:"cand-006"}), (s:Skill {name:"Python"}) MERGE (c)-[:HAS_SKILL {proficiency:4, years:1}]->(s);
MATCH (c:Candidate {id:"cand-006"}), (s:Skill {name:"Machine Learning"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);
MATCH (c:Candidate {id:"cand-006"}), (s:Skill {name:"Data Structures & Algorithms"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);

MATCH (c:Candidate {id:"cand-007"}), (s:Skill {name:"Java"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);
MATCH (c:Candidate {id:"cand-007"}), (s:Skill {name:"Spring Boot"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);
MATCH (c:Candidate {id:"cand-007"}), (s:Skill {name:"Microservices"}) MERGE (c)-[:HAS_SKILL {proficiency:2, years:1}]->(s);
MATCH (c:Candidate {id:"cand-007"}), (s:Skill {name:"Docker"}) MERGE (c)-[:HAS_SKILL {proficiency:2, years:1}]->(s);

MATCH (c:Candidate {id:"cand-008"}), (s:Skill {name:"Java"}) MERGE (c)-[:HAS_SKILL {proficiency:2, years:0}]->(s);
MATCH (c:Candidate {id:"cand-008"}), (s:Skill {name:"Data Structures & Algorithms"}) MERGE (c)-[:HAS_SKILL {proficiency:4, years:1}]->(s);
MATCH (c:Candidate {id:"cand-008"}), (s:Skill {name:"Git"}) MERGE (c)-[:HAS_SKILL {proficiency:2, years:0}]->(s);
MATCH (c:Candidate {id:"cand-008"}), (s:Skill {name:"C++"}) MERGE (c)-[:HAS_SKILL {proficiency:3, years:1}]->(s);
