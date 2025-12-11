import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Projects from "./Pages/Projects/Projects";
import Supervisors from "./Pages/Supervisors/Supervisors";
import Vendors from "./Pages/Vendors/Vendors";
import Machinery from "./Pages/Machinery/Machinery";
import DER from "./Pages/DER/DER";
import HomeDashboard from "./Pages/HomeDashboard/HomeDashboard";
import ProjectDetails from "./Pages/Details/ProjectDetails/ProjectDetails";
import DerDetails from "./Pages/Details/DerDetails/DerDetails";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/supervisors" element={<Supervisors />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/machinery" element={<Machinery />} />
        <Route path="/daily-execution" element={<DER />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/daily-execution/:id" element={<DerDetails />} />

        {/* ⛔ If route not found → Go to Home */}
        <Route path="*" element={<HomeDashboard />} />
      </Routes>
    </>
  );
};

export default App;
