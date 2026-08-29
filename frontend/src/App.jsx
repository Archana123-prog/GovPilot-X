import { useState } from 'react';

const metrics = [
  ['₹42Cr', 'pilot capital unlocked'],
  ['128', 'active challenges'],
  ['3.2x', 'faster vendor discovery'],
];

function App() {
  const [role, setRole] = useState('department');

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">GovPilot<span>-X</span></a>
        <nav aria-label="Primary navigation">
          <a href="#challenges">Challenges</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <button className="login-button" type="button" onClick={() => setRole(role === 'department' ? 'startup' : 'department')}>
          {role === 'department' ? 'Startup portal' : 'Department portal'}
        </button>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">The public innovation layer</p>
            <h1 id="hero-title">Government challenges.<br /><em>Startup velocity.</em></h1>
            <p className="lede">Connect public-sector problems with verified startup capability, then turn promising ideas into measurable pilot programs.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#challenges">Explore challenges</a>
              <a className="text-link" href="#how-it-works">See how it works <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <aside className="match-panel" aria-label="Live match engine status">
            <p className="panel-label">Live match engine</p>
            <div className="match-score"><strong>94%</strong><span>semantic match</span></div>
            <div className="signal"><span aria-hidden="true" /> AI matching active</div>
          </aside>
        </section>

        <section className="metrics" aria-label="Platform metrics">
          {metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
        </section>

        <section className="challenge-section" id="challenges" aria-labelledby="challenge-title">
          <div>
            <p className="eyebrow">Open opportunities</p>
            <h2 id="challenge-title">Problems worth solving.</h2>
          </div>
          <p className="section-note">A focused starting point for the next generation of civic solutions.</p>
        </section>

        <section className="steps" id="how-it-works" aria-label="How GovPilot-X works">
          {[
            ['01', 'Post a challenge', 'Turn a public problem into a clear, fundable pilot brief.'],
            ['02', 'Find the right fit', 'Rank verified startups by capability, not connections.'],
            ['03', 'Prove the outcome', 'Gate progress and payouts against transparent KPIs.'],
          ].map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
        </section>
      </main>
    </div>
  );
}

export default App;
