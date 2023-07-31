import './App.css';
import Leaderboard from './Leaderboard/leaderboard.js';
import ReportScore from './ReportScore/reportscore.js';
import FAQ from './FAQ/faq.js';
import GamesLog from './Game/gamesLog.js';
import GameInfo from './Game/gameInfo.js'
import PlayerBio from './Player/playerbio.js';
import { Suspense, useState, useEffect } from 'react';
import {buildLeaderboard, getGamesLog} from './Elo/firebase.js'
import { Route, BrowserRouter, Routes, NavLink } from "react-router-dom"

function App() {
  const [roster, setRoster] = useState([]);
  const [gameLog, setGameLog] = useState([]);

  useEffect(() => {
    buildLeaderboard().then(leaderboard => setRoster(leaderboard))
    getGamesLog().then(gameLog => setGameLog(gameLog))

  },[])

  

  return (
    <>
      <h1>Ranked Mini</h1>
      <BrowserRouter>
      <ul className="toolbar sticky">
        <li><NavLink to="/leaderboard">Leaderboard</NavLink></li>
        <li><NavLink to="/reportscore">Report Score</NavLink></li>
        <li><NavLink to="/games">Games</NavLink></li>
        <li><NavLink to="/faq">FAQ</NavLink></li>
      </ul>
        <Routes>
          <Route path="/leaderboard" element={<Leaderboard roster={roster}/> } />
          <Route path="/reportscore" element={<ReportScore roster={roster} setRoster={setRoster} /> } />
          <Route path="/games" element={<GamesLog gamesLog={gameLog} /> } />
          <Route path="/faq" element={<FAQ /> } />

          <Route path="/game/:gameid" element={<GameInfo gamesLog={gameLog}/> } />
          <Route path="/player/:playername" element={<PlayerBio games={gameLog}/> } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
