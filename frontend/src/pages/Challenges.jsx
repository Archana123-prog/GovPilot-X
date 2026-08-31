import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getChallenges } from "../services/api";

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");

  useEffect(() => {
    let mounted = true;
    getChallenges().then((items) => {
      if (mounted) setChallenges(items);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const sectors = useMemo(() => {
    const values = new Set(challenges.map((challenge) => challenge.sector).filter(Boolean));
    return ["All", ...Array.from(values)];
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    const query = search.trim().toLowerCase();

    return challenges.filter((challenge) => {
      const matchesSearch =
        !query ||
        challenge.title.toLowerCase().includes(query) ||
        challenge.problem_context.toLowerCase().includes(query) ||
        (challenge.tags || []).some((tag) => tag.toLowerCase().includes(query));

      const matchesSector = sector === "All" || challenge.sector === sector;
      return matchesSearch && matchesSector;
    });
  }, [challenges, search, sector]);

  return (
    <main className="page challenges-page">
      <section className="section-heading challenge-header">
        <div>
          <span className="eyebrow">OPEN CHALLENGES</span>
          <h1>Government Innovation Challenges</h1>
          <p>Browse active challenges published by government departments and discover where your solution fits best.</p>
        </div>
        <div className="challenge-counter">
          <strong>{challenges.length}</strong>
          <span>active opportunities</span>
        </div>
      </section>

      <section className="challenge-tools">
        <div className="challenge-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search challenges, outcomes or technology tags..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={sector} onChange={(event) => setSector(event.target.value)}>
            {sectors.map((value) => (
              <option key={value} value={value}>
                {value === "All" ? "All sectors" : value}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="challenge-results">
        <div className="results-header">
          <div>
            <span className="eyebrow">DISCOVER</span>
            <h2>Available challenge opportunities</h2>
          </div>
          <span className="results-count">{filteredChallenges.length} results</span>
        </div>

        {filteredChallenges.length > 0 ? (
          <div className="challenge-market-grid">
            {filteredChallenges.map((challenge) => (
              <article className="market-challenge-card" key={challenge.id || challenge.title}>
                <div className="market-card-top">
                  <span className="mini-tag">{challenge.sector || "Public Sector"}</span>
                  <span className="mini-tag muted">{challenge.status || "ACTIVE"}</span>
                </div>

                <h3>{challenge.title}</h3>
                <p>{challenge.problem_context}</p>

                <div className="challenge-meta">
                  <span>Budget: ₹{Number(challenge.pilot_budget_lakhs || 0).toFixed(0)}L</span>
                  <span>{challenge.timeline_months || 6} months</span>
                </div>

                <div className="tag-row">
                  {(challenge.tags || []).slice(0, 3).map((tag) => (
                    <span className="tag" key={`${challenge.id}-${tag}`}>{tag}</span>
                  ))}
                </div>

                <Link className="btn btn-secondary" to={`/challenge/${challenge.id || challenge.title}`}>
                  View details
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No challenges match your current search filters.</p>
          </div>
        )}
      </section>
    </main>
  );
}