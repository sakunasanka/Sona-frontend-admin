import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp";
import SignIn from './pages/Auth/SignIn';
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import MTDashboard from './pages/ManagementTeam/MTDashboard';
import ExampleUse from './pages/ExampleUse';
import AdminProfile from './pages/Admin/AdminProfile';
import Analytics from './pages/Admin/Analytics';
import Blogs  from './pages/Admin/Blogs'; 
import Counsellor from './pages/Counsellor/Counsellor';
import Client from './pages/Admin/Client';
import ManagementTeam from './pages/Admin/ManagementTeam';
import Reports from './pages/Admin/Reports';
import Psychiatrist from './pages/Admin/Psychiatrist';
import Message from './pages/Admin/Message';
import Team from './pages/ManagementTeam/Team';
import Calendar from './pages/ManagementTeam/Calendar';
import Feedback from './pages/Admin/Feedback';
import FeedbackManagement from './pages/Admin/Feedback';
import ForbiddenPage from './pages/ForbiddenPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import RootRedirect from './components/RootRedirect';

 

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/example-use" element={<ExampleUse />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/management-team-dashboard" element={<ProtectedRoute><MTDashboard /></ProtectedRoute>} />
        <Route path="/admin-profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
        <Route path="/blogs" element={<ProtectedRoute><Blogs /></ProtectedRoute>} />
        <Route path="/counsellor" element={<ProtectedRoute><Counsellor /></ProtectedRoute>} />
        <Route path="/client" element={<ProtectedRoute><Client /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path='/management-team' element={<ProtectedRoute><ManagementTeam /></ProtectedRoute>} />
        <Route path='/reports' element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/psychiatrist" element={<ProtectedRoute><Psychiatrist /></ProtectedRoute>} />
        <Route path="/message" element={<ProtectedRoute><Message /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><FeedbackManagement /></ProtectedRoute>} />

        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/MTDashboard" element={<ProtectedRoute><MTDashboard /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
         
      </Routes>
    </Router>
  );
}

export default App