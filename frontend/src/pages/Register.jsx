import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

const roles = [
  "Department",
  "Startup",
  "Evaluator",
  "Validator",
  "Admin",
];

const roleMap = {
  Department: "department",
  Startup: "startup",
  Evaluator: "evaluator",
  Validator: "validator",
  Admin: "admin",
};

export default function Register() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("Department");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    organisation: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await registerUser({
        email: form.email,
        password: form.password,
        full_name: form.fullName,
        role: roleMap[selectedRole],
        department_name: selectedRole === "Department" ? form.organisation : null,
        company_name: selectedRole === "Startup" ? form.organisation : null,
      });

      if (user.role === "department" || user.role === "admin" || user.role === "evaluator") {
        navigate("/government/dashboard");
      } else {
        navigate("/startup/dashboard");
      }
    } catch (registerError) {
      setError(registerError.message || "Unable to create the account right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="center-page">
      <div className="auth-card">
        <span className="eyebrow">REGISTER</span>

        <h1>Create your account</h1>

        <p>Join the innovation procurement pathway and manage challenge discovery, pilots or evaluation.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              type="text"
              placeholder="Your full name"
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              required
            />
          </label>

          <label>
            Work email
            <input
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
          </label>

          <label>
            Organisation
            <input
              type="text"
              placeholder="Department or startup name"
              value={form.organisation}
              onChange={(event) => setForm((prev) => ({ ...prev, organisation: event.target.value }))}
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}