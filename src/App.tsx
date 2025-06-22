import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp";
import SignIn from './pages/Auth/SignIn';
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import MTDashboard from './pages/ManagementTeam/MTDashboard';
import ExampleUse from './pages/ExampleUse'

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
      </Routes>
    </Router>
  );
}

export default App