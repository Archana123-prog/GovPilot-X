const pillars = [
  {
    title: "Outcome-based challenge design",
    description:
      "Departments can define measurable public outcomes, required constraints, target metrics and permissible pilot scopes before publishing a challenge.",
  },
  {
    title: "Transparent startup discovery",
    description:
      "Matching tools help identify startups based on sector readiness, technical capability, compliance profile and relevant prior work.",
  },
  {
    title: "Structured evaluation and screening",
    description:
      "Eligibility checks, evaluator rubrics and conflict-of-interest safeguards reduce bias while creating a defensible selection record.",
  },
  {
    title: "Risk-controlled pilots",
    description:
      "Pilot design includes cybersecurity clauses, data protection safeguards, IP ownership, milestone assumptions and exit planning for controlled rollout.",
  },
  {
    title: "Milestone-based contracting",
    description:
      "Departments pay on evidence, not assumptions. Milestone approvals, payment routing and progress tracking are visible to both parties.",
  },
  {
    title: "Independent validation and scale-up",
    description:
      "The platform supports validation, performance measurement and nodal review so successful pilots become compliant procurement or cross-department scale-up decisions.",
  },
];

export default function About() {
  return (
    <main className="page about-page">
      <section className="about-hero">
        <div className="section-heading">
          <span className="eyebrow">ABOUT GOVPILOT-X</span>

          <h1>
            A transparent innovation-procurement pathway for
            <span> government and startups.</span>
          </h1>

          <p>
            GovPilot-X bridges a long-standing gap in public procurement: how
            government departments identify real civic problems, discover fit-for-purpose
            startups and run controlled pilots without losing compliance, speed or accountability.
          </p>
        </div>
      </section>

      <section className="about-grid">
        {pillars.map((pillar) => (
          <article className="info-card" key={pillar.title}>
            <small>GOVPILOT-X</small>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}