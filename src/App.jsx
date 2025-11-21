import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Projects from "./Pages/Projects/Projects";
import Supervisors from "./Pages/Supervisors/Supervisors";
import Vendors from "./Pages/Vendors/Vendors";
import Machinery from "./Pages/Machinery/Machinery";
import DER from "./Pages/DER/DER";
import HomeDashboard from "./Pages/HomeDashboard/HomeDashboard";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/supervisors" element={<Supervisors />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/machinery" element={<Machinery />} />
        <Route path="/daily-execution" element={<DER />} />
      </Routes>

    </>
  );
};

export default App;
