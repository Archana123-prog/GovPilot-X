import { Routes, Route, Navigate } from 'react-router-dom';
import useAppStore from '@store/useAppStore';

// Public
import Landing            from '@pages/Landing';
import About              from '@pages/About';
import PublicChallenges   from '@pages/PublicChallenges';
import DepartmentLogin    from '@pages/auth/DepartmentLogin';
import StartupLogin       from '@pages/auth/StartupLogin';

// Layout
import AppShell from '@components/layout/AppShell';

// Department portal
import DepartmentDashboard from '@pages/department/DepartmentDashboard';
import ChallengeCreate     from '@pages/department/ChallengeCreate';
import ChallengeList       from '@pages/department/ChallengeList';
import MatchResults        from '@pages/department/MatchResults';

// Startup portal
import StartupDashboard from '@pages/startup/StartupDashboard';
import ProfileSetup     from '@pages/startup/ProfileSetup';
import ChallengeExplore from '@pages/startup/ChallengeExplore';
import PitchUpload      from '@pages/startup/PitchUpload';

// Shared
import PilotTracker from '@pages/tracker/PilotTracker';

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role } = useAppStore();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"                  element={<Landing />} />
      <Route path="/about"             element={<About />} />
      <Route path="/challenges"        element={<PublicChallenges />} />
      <Route path="/login/department"  element={<DepartmentLogin />} />
      <Route path="/login/startup"     element={<StartupLogin />} />

      {/* Department portal */}
      <Route element={
        <ProtectedRoute requiredRole="department"><AppShell /></ProtectedRoute>
      }>
        <Route path="/department"           element={<DepartmentDashboard />} />
        <Route path="/department/create"    element={<ChallengeCreate />} />
        <Route path="/department/challenges"element={<ChallengeList />} />
        <Route path="/department/matches"   element={<MatchResults />} />
        <Route path="/tracker"              element={<PilotTracker />} />
      </Route>

      {/* Startup portal */}
      <Route element={
        <ProtectedRoute requiredRole="startup"><AppShell /></ProtectedRoute>
      }>
        <Route path="/startup"          element={<StartupDashboard />} />
        <Route path="/startup/profile"  element={<ProfileSetup />} />
        <Route path="/startup/explore"  element={<ChallengeExplore />} />
        <Route path="/startup/pitch"    element={<PitchUpload />} />
        {/* Also expose tracker for startup role */}
        <Route path="/tracker"          element={<PilotTracker />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
