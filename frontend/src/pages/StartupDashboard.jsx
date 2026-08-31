import { useEffect, useMemo, useState } from "react";
import { getChallenges } from "../services/api";

const defaultMilestones = [
  { name: "Eligibility submission", status: "Approved" },
  { name: "Prototype demo", status: "In progress" },
  { name: "Pilot KPI report", status: "Due this week" },
  { name: "Payment milestone 02", status: "Pending approval" },
];

export default function StartupDashboard() {
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

  const applications = useMemo(
    () =>
      challenges.slice(0, 3).map((challenge, index) => ({
        challenge: challenge.title,
        status: index === 0 ? "Shortlisted" : index === 1 ? "In review" : "Applied",
        score: index === 0 ? "89" : index === 1 ? "Pending" : "New",
      })),
    [challenges]
  );

  return (
    <main className="page dashboard-page">
      <section className="dashboard-header">
        <div>
          <span className="eyebrow">STARTUP DASHBOARD</span>
          <h1>Application and pilot tracker</h1>
        </div>
        <button className="btn btn-secondary">Browse opportunities</button>
      </section>

      <section className="dashboard-grid">
        <article className="kpi-card">
          <span>Applications</span>
          <strong>{Math.max(challenges.length, 3)}</strong>
        </article>
        <article className="kpi-card">
          <span>Shortlisted</span>
          <strong>{Math.min(Math.max(challenges.length - 1, 1), 5)}</strong>
        </article>
        <article className="kpi-card">
          <span>Pending milestones</span>
          <strong>{defaultMilestones.length}</strong>
        </article>
        <article className="kpi-card">
          <span>Payments due</span>
          <strong>₹{Math.max(challenges.length * 2.5, 8.5).toFixed(1)}L</strong>
        </article>
      </section>

      <section className="dashboard-panels">
        <article className="panel-card wide-panel">
          <div className="panel-header">
            <h2>My applications</h2>
            <button className="link-button">Track</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Challenge</th>
                <th>Status</th>
                <th>Score / progress</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((row) => (
                <tr key={row.challenge}>
                  <td>{row.challenge}</td>
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
            <h2>Milestone status</h2>
            <button className="link-button">Upload evidence</button>
          </div>

          <ul className="check-list">
            {defaultMilestones.map((item) => (
              <li key={item.name}>
                <span className="bullet" />
                <div>
                  <strong>{item.name}</strong>
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