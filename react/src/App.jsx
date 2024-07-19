
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Dashboard } from './pages/dashboard/Dashboard'
import { Game } from './pages/game/Game';
import { Team } from './pages/team/Team';
import imgUrl from './assets/vector-JUL-2021-61.jpg'

export default function App() {
  console.log(imgUrl); // Note: used in index.html
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/game" element={<Game />}/>
        <Route path="/teams/:id" element={<Team />}/>
        <Route path="/teams/:id/:secondId" element={<Team />}/>
      </Routes>
    </BrowserRouter>
  )
}
