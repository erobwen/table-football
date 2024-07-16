
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Dashboard } from './pages/dashboard/Dashboard'
import { Game } from './pages/game/Game';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/game" element={<Game />}/>
      </Routes>
    </BrowserRouter>
  )
}
