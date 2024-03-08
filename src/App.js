import './App.css';
import { AppLoader } from "./loader.js";
import { Suspense, useState, useEffect, lazy } from 'react';
import { buildLeaderboard, getGamesLog } from './Firebase/database.js'
import { Route, BrowserRouter, Routes, NavLink } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth";
import { auth, signout } from './Firebase/auth.js';
import LoginPage from "./Login/loginpage.js"
import PageNotFound from './pageNotFound.js';
import Toolbar from './Home/toolbar.js';

// amplify stuff
import "@aws-amplify/ui-react/styles.css";
import AdminButton from './Login/loginbutton.js';
import { aws_getUIDPlayerMap } from './Database/player.js';

const Leaderboard = lazy(() => import('./Leaderboard/leaderboard.js'));
const ReportScoreWrapper = lazy(() => import('./ReportScore/reportscoreWrapper.js'));
const CalculatingElo = lazy(() => import('./About/calculatingElo.js'));
const RankTable = lazy(() => import('./About/rankTable.js'));
const Games = lazy(() => import('./Game/games.js'));

const GameInfoWrapper = lazy(() => import('./Game/gameInfoWrapper.js'));
const PlayerBio = lazy(() => import('./Player/playerbio.js'));
const GettingStarted = lazy(() => import('./Home/gettingStarted.js'));


function App() {
  const [leagueid, setLeagueid] = useState(null)
  const [uidPlayerMap, setUidPlayerMap] = useState(null)

  useEffect(() => {   
    if (leagueid != null){
      aws_getUIDPlayerMap(leagueid).then(data=>{
        setUidPlayerMap(data)
      })
    }
  },[leagueid])

  return (
    <BrowserRouter>    
      <div className="verticalAlign">
        <AdminButton/>
      </div>
      <h1><NavLink to="/">Ranked Mini</NavLink></h1>

      <Toolbar leagueid={leagueid}/>

      <Suspense fallback={<AppLoader />}>

        <Routes>
          <Route path="/" element={<GettingStarted/>} />
          <Route path="/login" element={<LoginPage/>} />

          <Route path="/:leagueid/" element={<Leaderboard setLeagueid={setLeagueid}/>} />
          <Route path="/:leagueid/reportscore" element={<ReportScoreWrapper setLeagueid={setLeagueid}/>} />
          <Route path="/:leagueid/games" element={<Games uidPlayerMap={uidPlayerMap} setLeagueid={setLeagueid}/>} />
          <Route path="/elo" element={<CalculatingElo/>} />
          <Route path="/ranks" element={<RankTable/>} />


          <Route path="/:leagueid/games/:gameid" element={<GameInfoWrapper uidPlayerMap={uidPlayerMap} setLeagueid={setLeagueid}/>} />
          <Route path="/:leagueid/player/:uid" element={<PlayerBio uidPlayerMap={uidPlayerMap} setLeagueid={setLeagueid}/>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
