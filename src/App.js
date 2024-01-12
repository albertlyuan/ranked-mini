import './App.css';
import { AppLoader } from "./loader.js";
import { Suspense, useState, useEffect, lazy } from 'react';
import {buildLeaderboard, getGamesLog} from './Firebase/database.js'
import { Route, BrowserRouter, Routes, NavLink } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './Firebase/auth.js';
import Logout from "./Login/logout.js"
import LoginPage from "./Login/loginpage.js"
import LoginButton from "./Login/loginbutton.js"
import PageNotFound from './pageNotFound.js';
import Toolbar from './Home/toolbar.js';


const Leaderboard = lazy(() => import('./Leaderboard/leaderboard.js'));
const ReportScoreWrapper = lazy(() => import('./ReportScore/reportscoreWrapper.js'));
const CalculatingElo = lazy(() => import('./About/calculatingElo.js'));
const RankTable = lazy(() => import('./About/rankTable.js'));
const GamesLog = lazy(() => import('./Game/gamesLog.js'));
const GameInfoWrapper = lazy(() => import('./Game/gameInfoWrapper.js'));
const PlayerBio = lazy(() => import('./Player/playerbio.js'));
const GettingStarted = lazy(() => import('./Home/gettingStarted.js'));

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
    buildLeaderboard(leagueid).then(leaderboard => setRoster(leaderboard))
    getGamesLog(leagueid).then(gameLog => setGameLog(gameLog))

  },[update, leagueid])

  

  return (
    <BrowserRouter>
      <div className="verticalAlign">{loggedin ? <Logout /> : <LoginButton text={"Log in"}/>}</div>
      <h1><NavLink to="/">Ranked Mini</NavLink></h1>

      <Toolbar leagueid={leagueid} loggedin={loggedin}/>

      <Suspense fallback={<AppLoader/>}>

        <Routes>
          <Route path="/" element={<GettingStarted currLeagueid={leagueid}/> } />
          <Route path="/login" element={<LoginPage/>}/>

          <Route path="/:leagueid/" element={<Leaderboard roster={roster} setLeagueid={setLeagueid}/> } />
          <Route path="/:leagueid/reportscore" element={<ReportScoreWrapper roster={roster} updater={updater} setLeagueid={setLeagueid}/> } />
          <Route path="/:leagueid/games" element={<GamesLog gamesLog={gameLog} setLeagueid={setLeagueid}/> }/>
          <Route path="/elo" element={<CalculatingElo setLeagueid={setLeagueid}/> } />
          <Route path="/ranks" element={<RankTable setLeagueid={setLeagueid}/> } />

          <Route path="/:leagueid/games/:gameid" element={<GameInfoWrapper setLeagueid={setLeagueid}/> } />
          <Route path="/:leagueid/player/:uid" element={<PlayerBio setLeagueid={setLeagueid}/> } />
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
