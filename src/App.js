import './App.css';
import { AppLoader } from "./loader.js";
import { Suspense, useState, useEffect, lazy } from 'react';
import {buildLeaderboard, getGamesLog} from './Elo/firebase.js'
import { Route, BrowserRouter, Routes, NavLink } from "react-router-dom"

const Leaderboard = lazy(() => import('./Leaderboard/leaderboard.js'));
const ReportScore = lazy(() => import('./ReportScore/reportscore.js'));
const CalculatingElo = lazy(() => import('./About/calculatingElo.js'));
const RankTable = lazy(() => import('./About/rankTable.js'));
const GamesLog = lazy(() => import('./Game/gamesLog.js'));
const GameInfo = lazy(() => import('./Game/gameInfo.js'));
const PlayerBio = lazy(() => import('./Player/playerbio.js'));


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
          <li><NavLink to="/">Leaderboard</NavLink></li>
          <li><NavLink to="/reportscore">Report Score</NavLink></li>
          <li><NavLink to="/games">Games</NavLink></li>
          <li><NavLink to="/elo">Elo</NavLink></li>
          <li><NavLink to="/ranks">Ranks</NavLink></li>
        </ul>
        <Suspense fallback={<AppLoader/>}>

          <Routes>
            <Route path="/" element={<Leaderboard roster={roster}/> } />
            <Route path="/reportscore" element={<ReportScore roster={roster} setRoster={setRoster} /> } />
            <Route path="/games" element={<GamesLog gamesLog={gameLog} /> } />
            <Route path="/elo" element={<CalculatingElo /> } />
            <Route path="/ranks" element={<RankTable /> } />

            <Route path="/game/:gameid" element={<GameInfo gamesLog={gameLog}/> } />
            <Route path="/player/:playername" element={<PlayerBio games={gameLog}/> } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
