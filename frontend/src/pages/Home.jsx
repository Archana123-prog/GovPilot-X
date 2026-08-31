import { Link } from "react-router-dom";

const stats = [
  { value: "180+", label: "Challenge statements published" },
  { value: "640+", label: "Startup profiles matched" },
  { value: "92%", label: "Eligibility review confidence" },
  { value: "₹58Cr+", label: "Pilot value in pipeline" },
];

const workflow = [
  {
    number: "01",
    title: "Identify the problem",
    description:
      "Departments convert civic pain points into outcome-based challenge statements with measurable public impact, budget ceilings, timelines and success criteria.",
  },
  {
    number: "02",
    title: "Discover eligible startups",
    description:
      "Matching logic surfaces startups with the right technical capability, sector focus and compliance posture without exhaustive manual search.",
  },
  {
    number: "03",
    title: "Screen and evaluate",
    description:
      "Eligibility checks, weighted rubrics and expert review create a transparent and defensible shortlist for government departments.",
  },
  {
    number: "04",
    title: "Design the pilot sandbox",
    description:
      "A controlled pilot defines scope, duration, data/IP clauses, cybersecurity controls, risk plans and exit criteria before any deployment begins.",
  },
  {
    number: "05",
    title: "Track milestones and payment",
    description:
      "Milestone-based contracts align deliverables, evidence submission and approval gates so payment follows progress rather than promises.",
  },
  {
    number: "06",
    title: "Validate and scale",
    description:
      "Independent validation and nodal review convert successful pilots into procurement decisions, template reuse and district-wide scale-up.",
  },
];

const challenges = [
  {
    category: "SMART CITY",
    title: "Smart Waste Collection Route Optimization",
    department: "Municipal Administration",
    status: "Open",
  },
  {
    category: "AGRICULTURE",
    title: "AI-powered Crop Health Monitoring",
    department: "Agriculture Department",
    status: "Open",
  },
  {
    category: "PUBLIC HEALTH",
    title: "Remote Patient Risk Monitoring",
    department: "Health Department",
    status: "Pilot Ready",
  },
];

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">INNOVATION PROCUREMENT PLATFORM</span>

          <h1>
            Turn government pain points into
            <span> pilot-ready innovation.</span>
          </h1>

          <p>
            GovPilot-X helps departments identify outcome-based challenges,
            discover eligible startups, run compliant pilots and convert proof
            into procurement decisions with transparency, risk control and speed.
          </p>

          <div className="hero-actions">
            <Link to="/login?role=department" className="btn btn-primary">
              Post a challenge
            </Link>

            <Link to="/register?role=startup" className="btn btn-secondary">
              Join as a startup
            </Link>
          </div>

          <div className="hero-trust">
            <span>Built for</span>
            <strong>Departments • Startups • Evaluators • Validators</strong>
          </div>
        </div>

        <div className="match-card">
          <div className="match-card-header">
            <span className="eyebrow">LIVE MATCH ENGINE</span>
            <span className="live-dot">ACTIVE</span>
          </div>

          <div className="match-visual">
            <div className="match-circle">
              <strong>94%</strong>
              <span>challenge fit</span>
            </div>
          </div>

          <div className="match-info">
            <div>
              <span>Department need</span>
              <strong>Smart mobility compliance</strong>
            </div>

            <div>
              <span>Recommended startup</span>
              <strong>UrbanTech Labs</strong>
            </div>
          </div>

          <div className="match-status">
            <span />
            Eligibility and evaluation flow active
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="workflow">
        <div className="section-heading">
          <span className="eyebrow">FULL PROCUREMENT FLOW</span>

          <h2>
            From challenge identification to
            <span> scalable government adoption.</span>
          </h2>

          <p>
            A structured innovation pathway that keeps procurement compliant,
            pilot risk low and startup participation accessible.
          </p>
        </div>

        <div className="workflow-grid">
          {workflow.map((item) => (
            <article className="workflow-card" key={item.number}>
              <small>{item.number}</small>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="card-arrow">→</span>
            </article>
          ))}
        </div>
      </section>

      <section className="challenges-preview">
        <div className="section-heading section-heading-row">
          <div>
            <span className="eyebrow">PUBLIC CHALLENGES</span>
            <h2>
              Problems waiting for the right
              <span> startup solution.</span>
            </h2>
          </div>

          <Link to="/challenges" className="text-link">
            View all challenges →
          </Link>
        </div>

        <div className="challenge-grid">
          {challenges.map((challenge) => (
            <article className="challenge-card" key={challenge.title}>
              <div className="challenge-top">
                <span className="challenge-category">{challenge.category}</span>
                <span className="challenge-status">{challenge.status}</span>
              </div>

              <h3>{challenge.title}</h3>
              <p>{challenge.department}</p>

              <Link to="/challenges" className="challenge-link">
                Explore challenge →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <span className="eyebrow">READY TO INNOVATE?</span>

          <h2>
            Build trusted public solutions with
            <span> measurable impact.</span>
          </h2>

          <p>
            GovPilot-X gives departments and startups a transparent, compliant
            pathway from challenge statement to pilot validation and scale-up.
          </p>

          <div className="hero-actions">
            <Link to="/login?role=department" className="btn btn-primary">
              Department login
            </Link>

            <Link to="/register?role=startup" className="btn btn-secondary">
              Startup registration
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}