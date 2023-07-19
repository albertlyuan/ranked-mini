import './App.css';
import Leaderboard from './leaderboard.js';
import ReportScore from './reportscore.js';
import FAQ from './faq';
import Games from './games';
import GameInfo from './gameInfo'
import PlayerBio from './playerbio.js';
import TabButton from './TabButton.js';
import { Suspense, useState } from 'react';


function App() {
  const [tab, setTab] = useState('leaderboard');
  const [player, setPlayer] = useState('');
  const [game, setGame] = useState('');


  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <h1 id="home" onClick={() => setTab('leaderboard')}>Brimstone Ranked Mini</h1>
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
  
      
      {tab === 'leaderboard' && <Leaderboard setTab={setTab} setPlayer={setPlayer}/>}
      {tab === 'reportscore' && <ReportScore />}
      {tab === 'games' && <Games setTab={setTab} setGame={setGame}/>}
      {tab === 'faq' && <FAQ />}
      {tab === 'game' && <GameInfo game={game} setTab={setTab} setPlayer={setPlayer}/>}
      {tab === 'playerbio' && <PlayerBio player={player} setTab={setTab} setPlayer={setPlayer}/>}

    </Suspense>
  );
}

export default App;
