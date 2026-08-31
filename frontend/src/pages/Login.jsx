import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "../services/api";

const roles = [
  "Department officer",
  "Startup founder",
  "Evaluator",
  "Validator",
  "Nodal admin",
];

const roleMap = {
  department: "Department officer",
  startup: "Startup founder",
  evaluator: "Evaluator",
  validator: "Validator",
  admin: "Nodal admin",
};

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState("Department officer");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && roleMap[roleParam]) {
      setSelectedRole(roleMap[roleParam]);
    }
  }, [searchParams]);

  const getRequestRole = (label) => {
    const normalized = label.toLowerCase();
    if (normalized.includes("startup")) return "startup";
    if (normalized.includes("department")) return "department";
    if (normalized.includes("admin")) return "admin";
    if (normalized.includes("validator")) return "validator";
    return "evaluator";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await loginUser({
        email: form.email,
        password: form.password,
        role: getRequestRole(selectedRole),
      });

      if (user.role === "department" || user.role === "admin" || user.role === "evaluator") {
        navigate("/government/dashboard");
      } else {
        navigate("/startup/dashboard");
      }
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="center-page">
      <div className="auth-card">
        <span className="eyebrow">LOGIN</span>

        <h1>Welcome back</h1>

        <p>Access your procurement workflow, challenge pipeline or pilot dashboard.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="name@agency.gov.in"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
          </label>

          <div className="role-row">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                className={`role-chip ${selectedRole === role ? "selected" : ""}`}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="btn btn-primary full-width" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}