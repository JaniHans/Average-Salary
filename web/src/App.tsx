import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import TopBar from "./topbar/TopBar";
import LandingPage from "./landingpage/LandingPage";
import Analyzer from "./analyzer/Analyzer";



function App() {
  return (
    <div>
    <TopBar/>
    <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/analyzer" element={<Analyzer/>}/>
    </Routes>
    </div>
  );
}

export default App;
