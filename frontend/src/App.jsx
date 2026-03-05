import { Routes, Route } from "react-router-dom";

import Landing from "./components/landing";
import Auth from "./components/auth";
import UserDashboard from "./components/userDashboard";
import AdminDashboard from "./components/adminDashboard";
function App() {

  return (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/dashboard" element={<UserDashboard />} />
    <Route path="/admin" element={<AdminDashboard />} />
  </Routes>  
  
  );
}

export default App;