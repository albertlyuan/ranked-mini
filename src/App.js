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
import {
    useAuthenticator,
    Authenticator,
    Button,
    Heading,
    Image,
    View,
    Card,
} from "@aws-amplify/ui-react";
import AdminButton from './Login/loginbutton.js';

const Leaderboard = lazy(() => import('./Leaderboard/leaderboard.js'));
const ReportScoreWrapper = lazy(() => import('./ReportScore/reportscoreWrapper.js'));
const CalculatingElo = lazy(() => import('./About/calculatingElo.js'));
const RankTable = lazy(() => import('./About/rankTable.js'));
const GamesLog = lazy(() => import('./Game/gamesLog.js'));
const GameInfoWrapper = lazy(() => import('./Game/gameInfoWrapper.js'));
const PlayerBio = lazy(() => import('./Player/playerbio.js'));
const GettingStarted = lazy(() => import('./Home/gettingStarted.js'));


function App() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  // {authStatus === 'authenticated' ? ifAuth : else}

  const [update, triggerUpdate] = useState(false);
  const [roster, setRoster] = useState([]);
  const [gameLog, setGameLog] = useState([]);

  function updater() {
      triggerUpdate(!update)
  }

  return (
    <BrowserRouter>    
      <div className="verticalAlign">
        <AdminButton/>
      </div>
      <h1><NavLink to="/">Ranked Mini</NavLink></h1>

      <Toolbar/>

      <Suspense fallback={<AppLoader />}>

        <Routes>
          <Route path="/" element={<GettingStarted/>} />
          <Route path="/login" element={<LoginPage/>} />

          <Route path="/:leagueid/" element={<Leaderboard/>} />
          <Route path="/:leagueid/reportscore" element={<ReportScoreWrapper/>} />
          <Route path="/:leagueid/games" element={<GamesLog gamesLog={gameLog} />} />
          <Route path="/elo" element={<CalculatingElo/>} />
          <Route path="/ranks" element={<RankTable/>} />

          <Route path="/:leagueid/games/:gameid" element={<GameInfoWrapper/>} />
          <Route path="/:leagueid/player/:uid" element={<PlayerBio/>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
