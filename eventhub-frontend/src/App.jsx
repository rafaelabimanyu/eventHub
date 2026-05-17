import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="App font-sans bg-slate-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
