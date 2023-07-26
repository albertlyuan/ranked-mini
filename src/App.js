import './App.css';
import Leaderboard from './Leaderboard/leaderboard.js';
import ReportScore from './ReportScore/reportscore.js';
import FAQ from './FAQ/faq.js';
import GamesLog from './Game/gamesLog.js';
import GameInfo from './Game/gameInfo.js'
import PlayerBio from './Player/playerbio.js';
import TabButton from './TabButton.js';
import { Suspense, useState, useEffect } from 'react';
import {buildLeaderboard, getGamesLog} from './Elo/firebase.js'


function App() {
  const [tab, setTab] = useState('leaderboard');
  const [player, setPlayer] = useState('');
  const [game, setGame] = useState('');
  const [roster, setRoster] = useState([]);
  const [gameLog, setGameLog] = useState([]);

  useEffect(() => {
    buildLeaderboard().then(leaderboard => setRoster(leaderboard))
    getGamesLog().then(gameLog => setGameLog(gameLog))

  },[])

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <h1 class="clickable" onClick={() => setTab('leaderboard')}>Ranked Mini</h1>
      <div className="toolbar">
        <TabButton
          isActive={tab === 'leaderboard'}
          onClick={() => setTab('leaderboard')}
        >
          Leaderboard
        </TabButton>
        <TabButton
          isActive={tab === 'reportscore'}
          onClick={() => setTab('reportscore')}
        >
          Report Scores
        </TabButton>
        <TabButton
          isActive={tab === 'games'}
          onClick={() => setTab('games')}
        >
          Games Log
        </TabButton>
        <TabButton
          isActive={tab === 'faq'}
          onClick={() => setTab('faq')}
        >
          FAQ
        </TabButton>
      </div>
  
      
      {tab === 'leaderboard' && <Leaderboard roster={roster} setTab={setTab} setPlayer={setPlayer}/>}
      {tab === 'reportscore' && <ReportScore roster={roster} setRoster={setRoster}/>}
      {tab === 'games' && <GamesLog gamesLog={gameLog} setTab={setTab} setGame={setGame}/>}
      {tab === 'faq' && <FAQ />}

      {tab === 'game' && <GameInfo game={game} setTab={setTab} setPlayer={setPlayer}/>}
      {tab === 'playerbio' && <PlayerBio player={player} games={gameLog} setTab={setTab} setGame={setGame}/>}

    </Suspense>
  );
}

export default App;
