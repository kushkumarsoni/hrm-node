import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Team from './pages/Team';
import TeamAttendance from './pages/TeamAttendance';
import LeaveRequests from './pages/LeaveRequests';
import MyAttendance from './pages/MyAttendance';
import MyLeaves from './pages/MyLeaves';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="employees" element={<Employees />} />
          </Route>

          <Route element={<ProtectedRoute roles={['manager']} />}>
            <Route path="team" element={<Team />} />
          </Route>

          <Route element={<ProtectedRoute roles={['admin', 'manager']} />}>
            <Route path="team-attendance" element={<TeamAttendance />} />
            <Route path="leave-requests" element={<LeaveRequests />} />
          </Route>

          <Route element={<ProtectedRoute roles={['manager', 'employee']} />}>
            <Route path="attendance" element={<MyAttendance />} />
            <Route path="leaves" element={<MyLeaves />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
