

// // import { Navigate, Route, Routes } from "react-router-dom";
// // import Navbar from "./components/common/Navbar";

// // function Home() {
// //   return (
// //     <main className="page">
// //       {/* HERO SECTION */}
// //       <section className="hero">
// //         <div className="hero-content">
// //           <span className="eyebrow">
// //             THE PUBLIC INNOVATION LAYER
// //           </span>

// //           <h1>
// //             Government challenges.
// //             <span> Startup velocity.</span>
// //           </h1>

// //           <p>
// //             GovPilot-X connects government challenges with verified
// //             startup capabilities and turns innovation into measurable
// //             pilot programs.
// //           </p>

// //           <div className="hero-actions">
// //             <a href="/login" className="btn btn-primary">
// //               Post a Challenge
// //             </a>

// //             <a href="/register" className="btn btn-secondary">
// //               Join as a Startup
// //             </a>
// //           </div>
// //         </div>

// //         <div className="match-card">
// //           <span className="eyebrow">
// //             LIVE MATCH ENGINE
// //           </span>

// //           <div className="match-score">
// //             <strong>94%</strong>
// //             <span>semantic match</span>
// //           </div>

// //           <div className="match-status">
// //             <span />
// //             AI matching active
// //           </div>
// //         </div>
// //       </section>

// //       {/* WORKFLOW */}
// //       <section className="workflow">
// //         <div className="section-heading">
// //           <span className="eyebrow">
// //             ONE PLATFORM, FULL LOOP
// //           </span>

// //           <h2>
// //             From civic problem to
// //             <span> verified outcome.</span>
// //           </h2>
// //         </div>

// //         <div className="workflow-grid">

// //           <article className="workflow-card">
// //             <small>01</small>

// //             <h3>Challenge Posting</h3>

// //             <p>
// //               Government departments can convert real problems
// //               into structured and measurable pilot briefs.
// //             </p>
// //           </article>

// //           <article className="workflow-card">
// //             <small>02</small>

// //             <h3>AI Matching</h3>

// //             <p>
// //               Match government challenges with verified startups
// //               based on technology, capability and relevance.
// //             </p>
// //           </article>

// //           <article className="workflow-card">
// //             <small>03</small>

// //             <h3>Pilot Tracking</h3>

// //             <p>
// //               Track pilot progress, milestones and KPIs before
// //               procurement and scaling.
// //             </p>
// //           </article>

// //         </div>
// //       </section>
// //     </main>
// //   );
// // }


// // /* LOGIN */

// // function Login() {
// //   return (
// //     <main className="center-page">
// //       <div className="auth-card">

// //         <span className="eyebrow">
// //           GOVPILOT-X
// //         </span>

// //         <h1>Login</h1>

// //         <p>
// //           Government departments and startups can access
// //           their workspace.
// //         </p>

// //         <button className="btn btn-primary full-width">
// //           Continue
// //         </button>

// //       </div>
// //     </main>
// //   );
// // }


// // /* REGISTER */

// // function Register() {
// //   return (
// //     <main className="center-page">
// //       <div className="auth-card">

// //         <span className="eyebrow">
// //           GOVPILOT-X
// //         </span>

// //         <h1>Create account</h1>

// //         <p>
// //           Register your department or startup to begin
// //           the procurement journey.
// //         </p>

// //         <button className="btn btn-primary full-width">
// //           Create Account
// //         </button>

// //       </div>
// //     </main>
// //   );
// // }


// // /* 404 */

// // function NotFound() {
// //   return (
// //     <main className="center-page">
// //       <div className="auth-card">

// //         <span className="eyebrow">
// //           GOVPILOT-X
// //         </span>

// //         <h1>404</h1>

// //         <p>
// //           The page you're looking for doesn't exist.
// //         </p>

// //         <a href="/" className="btn btn-primary">
// //           Back to Home
// //         </a>

// //       </div>
// //     </main>
// //   );
// // }


// // /* APP */

// // export default function App() {
// //   return (
// //     <>
// //       <Navbar />

// //       <Routes>

// //         <Route
// //           path="/"
// //           element={<Home />}
// //         />

// //         <Route
// //           path="/login"
// //           element={<Login />}
// //         />

// //         <Route
// //           path="/register"
// //           element={<Register />}
// //         />

// //         <Route
// //           path="/dashboard"
// //           element={
// //             <Navigate
// //               to="/login"
// //               replace
// //             />
// //           }
// //         />

// //         <Route
// //           path="*"
// //           element={<NotFound />}
// //         />

// //       </Routes>
// //     </>
// //   );
// // }



// import { Navigate, Route, Routes, Link } from "react-router-dom";
// import Navbar from "./components/common/Navbar";

// /* =========================
//    HOME PAGE
// ========================= */

// function Home() {
//   return (
//     <main className="page">

//       {/* HERO SECTION */}
//       <section className="hero">

//         <div className="hero-content">

//           <span className="eyebrow">
//             THE PUBLIC INNOVATION LAYER
//           </span>

//           <h1>
//             Government challenges.
//             <span> Startup velocity.</span>
//           </h1>

//           <p>
//             GovPilot-X connects government challenges with verified
//             startup capabilities and turns innovation into measurable
//             pilot programs.
//           </p>

//           <div className="hero-actions">

//             <Link
//               to="/login?role=department"
//               className="btn btn-primary"
//             >
//               Post a Challenge
//               <span>→</span>
//             </Link>

//             <Link
//               to="/register?role=startup"
//               className="btn btn-secondary"
//             >
//               Join as a Startup
//               <span>→</span>
//             </Link>

//           </div>

//         </div>


//         {/* AI MATCH CARD */}
//         <div className="match-card">

//           <span className="eyebrow">
//             LIVE MATCH ENGINE
//           </span>

//           <div className="match-score">
//             <strong>94%</strong>
//             <span>semantic match</span>
//           </div>

//           <div className="match-status">
//             <span></span>
//             AI matching active
//           </div>

//         </div>

//       </section>


//       {/* WORKFLOW SECTION */}
//       <section className="workflow">

//         <div className="section-heading">

//           <span className="eyebrow">
//             ONE PLATFORM, FULL LOOP
//           </span>

//           <h2>
//             From civic problem to
//             <span> verified outcome.</span>
//           </h2>

//           <p>
//             GovPilot-X creates a structured path from government
//             challenges to startup discovery, pilot programs and
//             measurable outcomes.
//           </p>

//         </div>


//         <div className="workflow-grid">

//           {/* CARD 01 */}
//           <article className="workflow-card">

//             <small>01</small>

//             <h3>
//               Challenge Posting
//             </h3>

//             <p>
//               Government departments can convert real problems
//               into structured and measurable pilot briefs.
//             </p>

//           </article>


//           {/* CARD 02 */}
//           <article className="workflow-card">

//             <small>02</small>

//             <h3>
//               AI Matching
//             </h3>

//             <p>
//               Match government challenges with verified startups
//               based on technology, capability and relevance.
//             </p>

//           </article>


//           {/* CARD 03 */}
//           <article className="workflow-card">

//             <small>03</small>

//             <h3>
//               Pilot Tracking
//             </h3>

//             <p>
//               Track pilot progress, milestones and KPIs before
//               procurement and scaling.
//             </p>

//           </article>

//         </div>

//       </section>

//     </main>
//   );
// }


// /* =========================
//    LOGIN PAGE
// ========================= */

// function Login() {
//   return (
//     <main className="center-page">

//       <div className="auth-card">

//         <span className="eyebrow">
//           GOVPILOT-X
//         </span>

//         <h1>
//           Login
//         </h1>

//         <p>
//           Government departments and startups can access
//           their workspace.
//         </p>

//         <button
//           className="btn btn-primary full-width"
//           type="button"
//         >
//           Continue
//         </button>

//       </div>

//     </main>
//   );
// }


// /* =========================
//    REGISTER PAGE
// ========================= */

// function Register() {
//   return (
//     <main className="center-page">

//       <div className="auth-card">

//         <span className="eyebrow">
//           GOVPILOT-X
//         </span>

//         <h1>
//           Create account
//         </h1>

//         <p>
//           Register your department or startup to begin
//           the procurement journey.
//         </p>

//         <button
//           className="btn btn-primary full-width"
//           type="button"
//         >
//           Create Account
//         </button>

//       </div>

//     </main>
//   );
// }


// /* =========================
//    404 PAGE
// ========================= */

// function NotFound() {
//   return (
//     <main className="center-page">

//       <div className="auth-card">

//         <span className="eyebrow">
//           GOVPILOT-X
//         </span>

//         <h1>
//           404
//         </h1>

//         <p>
//           The page you're looking for doesn't exist.
//         </p>

//         <Link
//           to="/"
//           className="btn btn-primary"
//         >
//           Back to Home
//         </Link>

//       </div>

//     </main>
//   );
// }


// /* =========================
//    APPLICATION ROUTES
// ========================= */

// export default function App() {
//   return (
//     <>
//       <Navbar />

//       <Routes>

//         {/* Home */}
//         <Route
//           path="/"
//           element={<Home />}
//         />


//         {/* Login */}
//         <Route
//           path="/login"
//           element={<Login />}
//         />


//         {/* Register */}
//         <Route
//           path="/register"
//           element={<Register />}
//         />


//         {/* Dashboard */}
//         <Route
//           path="/dashboard"
//           element={
//             <Navigate
//               to="/login"
//               replace
//             />
//           }
//         />


//         {/* 404 */}
//         <Route
//           path="*"
//           element={<NotFound />}
//         />

//       </Routes>
//     </>
//   );
// }


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