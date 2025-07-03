import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp";
import SignIn from './pages/Auth/SignIn';
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import MTDashboard from './pages/ManagementTeam/MTDashboard';
import ExampleUse from './pages/ExampleUse';
import AdminProfile from './pages/Admin/AdminProfile';
// import Analytics from './pages/Admin/Analytics';
import Blogs  from './pages/Admin/Blogs'; 
// import Calendar from './pages/Admin/Calendar';
import Counsellor from './pages/Counsellor/Counsellor';
 

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/example-use" element={<ExampleUse />} />
        <Route path="/signup" element={<SignUp/>} ></Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/management-team-dashboard" element={<MTDashboard />} />

        <Route path="/admin-profile" element={<AdminProfile />} />
        {/* Add more routes as needed */}
        {/* <Route path="/admin-management-team" element={<ManagementTeam />} /> */}
        
        {/* <Route path="/admin-analytics" element={<Analytics />} /> */}
        <Route path="/blogs" element={<Blogs />} />
        {/* <Route path="/admin-calendar" element={<Calendar />} /> */}
        <Route path="/counsellor" element={<Counsellor />} /> 
         

         
      </Routes>
    </Router>
  );
}

export default App