import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./components/pageComponents/LoginPage";
import DashboardPage from "./components/pageComponents/DashboardPage";
import ProtectedRoute from "./components/baseComponents/ProtectedRoute";
import JobOpportunities from "./components/pageComponents/JobOpportunities";
import RegisteredCandidate from "./components/pageComponents/RegisteredCandidates";
import Profile from "./components/pageComponents/Profile";
import InviteCandidate from "./components/pageComponents/InviteCandidate";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<JobOpportunities />} />
            <Route path="jobs" element={<JobOpportunities />} />
            <Route path="candidates" element={<RegisteredCandidate />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          {/* Moved out of /dashboard */}
          <Route path="/invite-candidate/:id" element={<InviteCandidate />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
