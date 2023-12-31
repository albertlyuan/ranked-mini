import './App.css';
import { AppLoader } from "./loader.js";
import { Suspense, useState, useEffect, lazy } from 'react';
import {buildLeaderboard, getGamesLog} from './Firebase/database.js'
import { Route, BrowserRouter, Routes, NavLink } from "react-router-dom"
import { AuthProvider } from 'react-auth-kit'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './Firebase/auth.js';
import Logout from "./Login/logout.js"
import Login from "./Login/login.js"

const Leaderboard = lazy(() => import('./Leaderboard/leaderboard.js'));
const ReportScore = lazy(() => import('./ReportScore/reportscore.js'));
const CalculatingElo = lazy(() => import('./About/calculatingElo.js'));
const RankTable = lazy(() => import('./About/rankTable.js'));
const GamesLog = lazy(() => import('./Game/gamesLog.js'));
const GameInfo = lazy(() => import('./Game/gameInfo.js'));
const PlayerBio = lazy(() => import('./Player/playerbio.js'));


function App() {
  const [update, triggerUpdate] = useState(false);
  const [roster, setRoster] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const [loggedin, setLoggedin] = useState(false);

  function updater(){
      triggerUpdate(!update)
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedin(true)
      }else{
        setLoggedin(false)
      }
    })
    buildLeaderboard().then(leaderboard => setRoster(leaderboard))
    getGamesLog().then(gameLog => setGameLog(gameLog))

  },[update])

  

  return (
    <AuthProvider authType = {'cookie'}
                  authName={'_auth'}
                  cookieDomain={window.location.hostname}
                  // cookieSecure={window.location.protocol === "https:"}
                  cookieSecure={false}
    >
      <BrowserRouter>
        <div className="verticalAlign">{loggedin ? <Logout /> : <Login />}</div>
        <h1>Ranked Mini</h1>
        <ul className="toolbar sticky">
          <li><NavLink to="/">Leaderboard</NavLink></li>
          {loggedin ? <li><NavLink to="/reportscore">Report Score</NavLink></li> : null}
          {/* <li><NavLink to="/reportscore">Report Score</NavLink></li> */}
          <li><NavLink to="/games">Games</NavLink></li>
          <li><NavLink to="/elo">Elo</NavLink></li>
          <li><NavLink to="/ranks">Ranks</NavLink></li>
        </ul>
        <Suspense fallback={<AppLoader/>}>

          <Routes>
            <Route path="/" element={<Leaderboard roster={roster}/> } />
            <Route path="/reportscore" element={<ReportScore roster={roster} updater={updater}/> } />
            <Route path="/games" element={<GamesLog gamesLog={gameLog}/> } />
            <Route path="/elo" element={<CalculatingElo /> } />
            <Route path="/ranks" element={<RankTable /> } />

            <Route path="/login" element={<Login /> } />

            <Route path="/games/:gameid" element={<GameInfo/> } />
            <Route path="/player/:uid" element={<PlayerBio/> } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
