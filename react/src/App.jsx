
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Dashboard } from './pages/dashboard/Dashboard'
import { Game } from './pages/game/Game';
import { Team } from './pages/team/Team';
import imgUrl from './assets/vector-JUL-2021-61.jpg'

export default function App() {
  console.log(imgUrl);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/game" element={<Game />}/>
        <Route path="/teams/:id" element={<Team />}/>
      </Routes>
    </BrowserRouter>
  )
}
