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
const GettingStarted = lazy(() => import('./About/gettingStarted.js'));

function App() {
  const [update, triggerUpdate] = useState(false);
  const [roster, setRoster] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const [loggedin, setLoggedin] = useState(false);
  const [leagueid, setLeagueid] = useState()

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
        <div className="verticalAlign">{loggedin ? <Logout leagueid={leagueid} /> : <Login />}</div>
        <h1>Ranked Mini</h1>
        <ul className="toolbar sticky">
          <li><NavLink to={`/${leagueid}/`}>Leaderboard</NavLink></li>
          {loggedin ? <li><NavLink to="/:leagueid/reportscore">Report Score</NavLink></li> : null}
          {/* <li><NavLink to="/reportscore">Report Score</NavLink></li> */}
          <li><NavLink to={`/${leagueid}/games`}>Games</NavLink></li>
          <li><NavLink to={`/${leagueid}/elo`}>Elo</NavLink></li>
          <li><NavLink to={`/${leagueid}/ranks`}>Ranks</NavLink></li>
        </ul>
        <Suspense fallback={<AppLoader/>}>

          <Routes>
            <Route path="/" element={<GettingStarted/> } />
            <Route path="/:leagueid/" element={<Leaderboard roster={roster} setLeagueid={setLeagueid}/> } />
            <Route path="/:leagueid/reportscore" element={<ReportScore roster={roster} updater={updater}/> } />
            <Route path="/:leagueid/games" element={<GamesLog gamesLog={gameLog}/> } />
            <Route path="/:leagueid/elo" element={<CalculatingElo /> } />
            <Route path="/:leagueid/ranks" element={<RankTable /> } />

            <Route path="/:leagueid/login" element={<Login /> } />

            <Route path="/:leagueid/games/:gameid" element={<GameInfo/> } />
            <Route path="/:leagueid/player/:uid" element={<PlayerBio/> } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
