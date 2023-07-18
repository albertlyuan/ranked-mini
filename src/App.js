import './App.css';
import Leaderboard from './leaderboard.js';
import ReportScore from './reportscore.js';
import TabButton from './TabButton.js';
import { Suspense, useState } from 'react';


function App() {
  const [tab, setTab] = useState('leaderboard');
  
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
      </div>
  
      
      {tab === 'leaderboard' && <Leaderboard />}
      {tab === 'reportscore' && <ReportScore />}
    </Suspense>
  );
}

export default App;
