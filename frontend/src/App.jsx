import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Challenges from "./pages/Challenges";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import StartupDashboard from "./pages/StartupDashboard";
import ChallengeDetails from "./pages/ChallengeDetails";

function NotFound() {
  return (
    <main className="center-page">
      <div className="auth-card">
        <span className="eyebrow">GOVPILOT-X</span>
        <h1>404</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/" className="btn btn-primary">
          Back to Home
        </a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/challenges" element={<Challenges />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/government/dashboard" element={<GovernmentDashboard />} />
        <Route path="/startup/dashboard" element={<StartupDashboard />} />

        {/* Challenge Details */}
        <Route path="/challenge/:id" element={<ChallengeDetails />} />

        {/* Temporary redirect */}
        <Route
          path="/dashboard"
          element={<Navigate to="/government/dashboard" replace />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}