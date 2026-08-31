import { useEffect, useMemo, useState } from "react";
import { getChallenges } from "../services/api";

const defaultMilestones = [
  { item: "Problem statement review", status: "Approved" },
  { item: "Startup eligibility screening", status: "In progress" },
  { item: "Expert evaluation", status: "Completed" },
  { item: "Sandbox pilot agreement", status: "Due this week" },
];

export default function GovernmentDashboard() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    let mounted = true;
    getChallenges().then((items) => {
      if (mounted) setChallenges(items);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const pipeline = useMemo(
    () =>
      challenges.slice(0, 3).map((challenge) => ({
        name: challenge.title,
        status: challenge.status || "ACTIVE",
        score: challenge.pilot_budget_lakhs ? `${challenge.pilot_budget_lakhs}L budget` : "Pending",
      })),
    [challenges]
  );

  const kpis = [
    { label: "Open challenges", value: String(challenges.length || 0) },
    { label: "Startup matches", value: String(Math.max(challenges.length * 3, 12)) },
    { label: "Pilots in progress", value: String(Math.min(challenges.length + 2, 8)) },
    { label: "Milestone approvals", value: String(Math.max(challenges.length * 6, 14)) },
  ];

  return (
    <main className="page dashboard-page">
      <section className="dashboard-header">
        <div>
          <span className="eyebrow">GOVERNMENT DASHBOARD</span>
          <h1>Department innovation workspace</h1>
        </div>
        <button className="btn btn-primary">Publish new challenge</button>
      </section>

      <section className="dashboard-grid">
        {kpis.map((kpi) => (
          <article className="kpi-card" key={kpi.label}>
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-panels">
        <article className="panel-card wide-panel">
          <div className="panel-header">
            <h2>Challenge pipeline</h2>
            <button className="link-button">View all</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Challenge</th>
                <th>Status</th>
                <th>Budget / plan</th>
              </tr>
            </thead>
            <tbody>
              {pipeline.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>
                    <span className="status-pill">{row.status}</span>
                  </td>
                  <td>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="panel-card">
          <div className="panel-header">
            <h2>Milestones</h2>
            <button className="link-button">Manage</button>
          </div>

          <ul className="check-list">
            {defaultMilestones.map((item) => (
              <li key={item.item}>
                <span className="bullet" />
                <div>
                  <strong>{item.item}</strong>
                  <small>{item.status}</small>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}