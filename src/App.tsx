import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp";
import SignIn from './pages/Auth/SignIn';
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import MTDashboard from './pages/ManagementTeam/MTDashboard';
import ExampleUse from './pages/ExampleUse';
import AdminProfile from './pages/Admin/AdminProfile';
import Analytics from './pages/Admin/Analytics';
import Blogs  from './pages/Admin/Blogs'; 
import Calendar from './pages/Admin/Calendar';
import Counsellor from './pages/Counsellor/Counsellor';
import Client from './pages/Admin/Client';
import ManagementTeam from './pages/Admin/ManagementTeam';
import Reports from './pages/Admin/Reports';
import Psychiatrist from './pages/Admin/Psychiatrist';
import Message from './pages/Admin/Message';
import Team from './pages/ManagementTeam/Team';
 

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/example-use" element={<ExampleUse />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/management-team-dashboard" element={<MTDashboard />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/counsellor" element={<Counsellor />} />
        <Route path="/client" element={<Client />} />
        <Route path="/admin-analytics" element={<Analytics />} />  
        <Route path="/calendar" element={<Calendar />} />
        <Route path='/management-team' element={<ManagementTeam />} />
        <Route path='/reports' element={<Reports />} />
        <Route path="/psychiatrist" element={<Psychiatrist />} />
        <Route path="/message" element={<Message />} />

        <Route path="*" element={<div className="text-center text-red-500">404 Not Found</div>} />
        <Route path="/MTDashboard" element={<MTDashboard />} />
        <Route path="/team" element={<Team />} />
         
      </Routes>
    </Router>
  );
}

export default App