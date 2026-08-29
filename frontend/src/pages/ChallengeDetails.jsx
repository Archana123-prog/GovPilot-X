import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const challengesData = [
  {
    id: "GPX-001",
    category: "Smart City",
    title: "Intelligent Urban Waste Management",
    department: "Municipal Administration",
    location: "Urban Development",
    budget: "₹25L – ₹50L",
    status: "Open",
    deadline: "30 Sep 2026",
    description:
      "Develop a technology-driven solution for real-time waste monitoring, route optimization and improved municipal collection efficiency.",
    tags: ["AI", "IoT", "Smart City"],
  },
  {
    id: "GPX-002",
    category: "Agriculture",
    title: "AI-Based Crop Disease Detection",
    department: "Agriculture Department",
    location: "Agriculture & Rural Development",
    budget: "₹15L – ₹30L",
    status: "Open",
    deadline: "12 Oct 2026",
    description:
      "Build an AI-assisted system capable of identifying crop diseases and providing actionable insights to farmers.",
    tags: ["AI", "Computer Vision", "AgriTech"],
  },
  {
    id: "GPX-003",
    category: "Healthcare",
    title: "Remote Healthcare Monitoring",
    department: "Health Department",
    location: "Public Health",
    budget: "₹30L – ₹60L",
    status: "Pilot Ready",
    deadline: "20 Oct 2026",
    description:
      "Create a scalable remote monitoring solution that can help healthcare teams track patients and identify risks earlier.",
    tags: ["HealthTech", "IoT", "Analytics"],
  },
  {
    id: "GPX-004",
    category: "Education",
    title: "AI-Powered Learning Support Platform",
    department: "Education Department",
    location: "School Education",
    budget: "₹20L – ₹40L",
    status: "Open",
    deadline: "05 Nov 2026",
    description:
      "Develop an adaptive digital learning platform that helps students receive personalized academic support.",
    tags: ["EdTech", "AI", "Analytics"],
  },
  {
    id: "GPX-005",
    category: "Mobility",
    title: "Intelligent Public Transport Optimization",
    department: "Transport Department",
    location: "Urban Mobility",
    budget: "₹40L – ₹80L",
    status: "Open",
    deadline: "18 Nov 2026",
    description:
      "Use data and intelligent forecasting to improve public transport planning, scheduling and passenger experience.",
    tags: ["AI", "Mobility", "Data"],
  },
  {
    id: "GPX-006",
    category: "Governance",
    title: "Citizen Grievance Intelligence System",
    department: "Department of Administrative Reforms",
    location: "e-Governance",
    budget: "₹10L – ₹25L",
    status: "Pilot Ready",
    deadline: "28 Nov 2026",
    description:
      "Develop an intelligent platform for classifying, routing and analysing citizen grievances across departments.",
    tags: ["NLP", "AI", "e-Governance"],
  },
];

const categories = [
  "All",
  "Smart City",
  "Agriculture",
  "Healthcare",
  "Education",
  "Mobility",
  "Governance",
];

const statuses = [
  "All",
  "Open",
  "Pilot Ready",
];

export default function Challenges() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredChallenges = useMemo(() => {
    const query = search.toLowerCase().trim();

    return challengesData.filter((challenge) => {
      const matchesSearch =
        !query ||
        challenge.title.toLowerCase().includes(query) ||
        challenge.department.toLowerCase().includes(query) ||
        challenge.category.toLowerCase().includes(query) ||
        challenge.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );

      const matchesCategory =
        category === "All" ||
        challenge.category === category;

      const matchesStatus =
        status === "All" ||
        challenge.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [search, category, status]);

  return (
    <main className="challenges-page">

      {/* ================= HEADER ================= */}

      <section className="challenges-hero">

        <div className="challenges-hero-content">

          <span className="eyebrow">
            GOVERNMENT INNOVATION MARKETPLACE
          </span>

          <h1>
            Solve real problems.
            <span> Build real impact.</span>
          </h1>

          <p>
            Explore government challenges and discover opportunities
            where startup innovation can create measurable public value.
          </p>

        </div>

        <div className="challenge-counter">
          <strong>{challengesData.length}</strong>
          <span>active opportunities</span>
        </div>

      </section>


      {/* ================= FILTER BAR ================= */}

      <section className="challenge-tools">

        <div className="challenge-search">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search challenges, departments or technologies..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

        </div>


        <div className="filter-group">

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item === "All"
                  ? "All Categories"
                  : item}
              </option>
            ))}
          </select>


          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            {statuses.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item === "All"
                  ? "All Status"
                  : item}
              </option>
            ))}
          </select>

        </div>

      </section>


      {/* ================= RESULTS ================= */}

      <section className="challenge-results">

        <div className="results-header">

          <div>
            <span className="eyebrow">
              DISCOVER
            </span>

            <h2>
              Available challenges
            </h2>
          </div>

          <span className="results-count">
            {filteredChallenges.length} results
          </span>

        </div>


        {filteredChallenges.length > 0 ? (

          <div className="challenge-market-grid">

            {filteredChallenges.map((challenge) => (

              <article
                className="market-challenge-card"
                key={challenge.id}
              >

                <div className="market-card-top">

                  <span className="challenge-category">
                    {challenge.category}
                  </span>

                  <span
                    className={`challenge-status ${
                      challenge.status === "Pilot Ready"
                        ? "pilot-status"
                        : ""
                    }`}
                  >
                    {challenge.status}
                  </span>

                </div>


                <span className="challenge-id">
                  {challenge.id}
                </span>


                <h3>
                  {challenge.title}
                </h3>


                <p className="market-description">
                  {challenge.description}
                </p>


                <div className="challenge-tags">

                  {challenge.tags.map((tag) => (
                    <span key={tag}>
                      {tag}
                    </span>
                  ))}

                </div>


                <div className="challenge-meta">

                  <div>
                    <span>Department</span>
                    <strong>
                      {challenge.department}
                    </strong>
                  </div>

                  <div>
                    <span>Opportunity</span>
                    <strong>
                      {challenge.budget}
                    </strong>
                  </div>

                </div>


                <div className="market-card-footer">

                  <span>
                    Deadline: {challenge.deadline}
                  </span>

                  <Link
                    to={`/challenge/${challenge.id}`}
                    className="challenge-link"
                  >
                    View Challenge →
                  </Link>

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="no-results">

            <div className="no-results-icon">
              ⌕
            </div>

            <h3>
              No challenges found
            </h3>

            <p>
              Try changing your search or filter criteria.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setStatus("All");
              }}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>

          </div>

        )}

      </section>


      {/* ================= CTA ================= */}

      <section className="challenge-cta">

        <div>

          <span className="eyebrow">
            ARE YOU A GOVERNMENT DEPARTMENT?
          </span>

          <h2>
            Have a problem that needs
            <span> innovation?</span>
          </h2>

          <p>
            Publish your challenge and connect with startups
            capable of building and piloting the solution.
          </p>

        </div>

        <Link
          to="/login?role=department"
          className="btn btn-primary"
        >
          Post a Challenge →
        </Link>

      </section>

    </main>
  );
}