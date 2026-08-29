import { Link } from "react-router-dom";

const stats = [
  {
    value: "128+",
    label: "Active Challenges",
  },
  {
    value: "350+",
    label: "Verified Startups",
  },
  {
    value: "94%",
    label: "AI Match Accuracy",
  },
  {
    value: "₹42Cr+",
    label: "Pilot Opportunity",
  },
];

const workflow = [
  {
    number: "01",
    title: "Post a Challenge",
    description:
      "Government departments publish structured problems with requirements, objectives and measurable outcomes.",
  },
  {
    number: "02",
    title: "AI-Powered Matching",
    description:
      "GovPilot-X identifies relevant startups using technology, capability, sector and solution relevance.",
  },
  {
    number: "03",
    title: "Pilot & Evaluate",
    description:
      "Departments evaluate shortlisted solutions through measurable pilot programs and defined KPIs.",
  },
  {
    number: "04",
    title: "Procure & Scale",
    description:
      "Successful pilots move towards procurement, adoption and wider implementation.",
  },
];

const challenges = [
  {
    category: "SMART CITY",
    title: "Intelligent Urban Waste Management",
    department: "Municipal Administration",
    status: "Open",
  },
  {
    category: "AGRICULTURE",
    title: "AI-Based Crop Disease Detection",
    department: "Agriculture Department",
    status: "Open",
  },
  {
    category: "PUBLIC HEALTH",
    title: "Remote Healthcare Monitoring",
    department: "Health Department",
    status: "Pilot Ready",
  },
];

export default function Home() {
  return (
    <main className="page">

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">

          <span className="eyebrow">
            THE PUBLIC INNOVATION LAYER
          </span>

          <h1>
            Government challenges.
            <span> Startup velocity.</span>
          </h1>

          <p>
            GovPilot-X connects government departments with verified
            startup capabilities and transforms innovative solutions
            into measurable pilot programs.
          </p>

          <div className="hero-actions">

            <Link
              to="/login?role=department"
              className="btn btn-primary"
            >
              Post a Challenge
              <span>→</span>
            </Link>

            <Link
              to="/register?role=startup"
              className="btn btn-secondary"
            >
              Join as a Startup
              <span>→</span>
            </Link>

          </div>

          <div className="hero-trust">
            <span>Built for</span>
            <strong>Government × Startups</strong>
          </div>

        </div>


        {/* AI MATCH PANEL */}

        <div className="match-card">

          <div className="match-card-header">
            <span className="eyebrow">
              LIVE MATCH ENGINE
            </span>

            <span className="live-dot">
              LIVE
            </span>
          </div>

          <div className="match-visual">

            <div className="match-circle">
              <strong>94%</strong>
              <span>semantic match</span>
            </div>

          </div>

          <div className="match-info">

            <div>
              <span>Government Challenge</span>
              <strong>Smart Mobility</strong>
            </div>

            <div>
              <span>Matched Startup</span>
              <strong>UrbanTech Labs</strong>
            </div>

          </div>

          <div className="match-status">
            <span />
            AI matching active
          </div>

        </div>

      </section>


      {/* ================= STATS ================= */}

      <section className="stats-section">

        <div className="stats-grid">

          {stats.map((stat) => (
            <div
              className="stat-card"
              key={stat.label}
            >
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}

        </div>

      </section>


      {/* ================= WORKFLOW ================= */}

      <section className="workflow">

        <div className="section-heading">

          <span className="eyebrow">
            ONE PLATFORM. FULL LOOP.
          </span>

          <h2>
            From civic problem to
            <span> verified outcome.</span>
          </h2>

          <p>
            A structured innovation workflow that helps government
            departments discover, evaluate and scale startup solutions.
          </p>

        </div>


        <div className="workflow-grid">

          {workflow.map((item) => (
            <article
              className="workflow-card"
              key={item.number}
            >
              <small>{item.number}</small>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <span className="card-arrow">
                →
              </span>
            </article>
          ))}

        </div>

      </section>


      {/* ================= CHALLENGES ================= */}

      <section className="challenges-preview">

        <div className="section-heading section-heading-row">

          <div>
            <span className="eyebrow">
              GOVERNMENT CHALLENGES
            </span>

            <h2>
              Problems waiting for
              <span> better solutions.</span>
            </h2>
          </div>

          <Link
            to="/challenges"
            className="text-link"
          >
            View all challenges →
          </Link>

        </div>


        <div className="challenge-grid">

          {challenges.map((challenge) => (
            <article
              className="challenge-card"
              key={challenge.title}
            >

              <div className="challenge-top">

                <span className="challenge-category">
                  {challenge.category}
                </span>

                <span className="challenge-status">
                  {challenge.status}
                </span>

              </div>

              <h3>
                {challenge.title}
              </h3>

              <p>
                {challenge.department}
              </p>

              <Link
                to="/challenges"
                className="challenge-link"
              >
                Explore challenge →
              </Link>

            </article>
          ))}

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="cta-section">

        <div className="cta-content">

          <span className="eyebrow">
            READY TO INNOVATE?
          </span>

          <h2>
            Turn public problems into
            <span> scalable solutions.</span>
          </h2>

          <p>
            Whether you are a government department looking for
            innovation or a startup ready to solve real-world problems,
            GovPilot-X gives you the infrastructure to collaborate.
          </p>

          <div className="hero-actions">

            <Link
              to="/login?role=department"
              className="btn btn-primary"
            >
              I'm a Government Department
            </Link>

            <Link
              to="/register?role=startup"
              className="btn btn-secondary"
            >
              I'm a Startup
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}