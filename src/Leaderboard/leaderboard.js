import {useState} from 'react';
import AddPlayer from './addPlayer.js';
import PlayerRow from './leaderboardPlayer.js';
import SearchPlayer from './searchPlayer.js';

export default function Leaderboard({roster}){
    const [statusMsg, setStatusMsg] = useState('');
    const [filter, setFilter] = useState('');

    const listItems = roster.map((person) => 
        <PlayerRow
            name={person[0]}
            elo={person[1]}
            wins={person[2]}
            losses={person[3]}
            filter={filter}
        />
    ); 
    return (
        <div id="leaderboard" class="tabcontent animatedLoad">
            <table>
                <thead>
                    <th style={{"text-align": "left"}}>Player (record)</th>
                    <th style={{"text-align": "right"}}>Elo</th>
                </thead>
                <tr id="addplayerRow">
                    <td>
                        <AddPlayer
                            roster={roster}
                            setStatusMsgFunc={(msg) => {
                                setStatusMsg(msg)
                            }}
                        />
                    </td>
                    <td>
                        <p class="statusmsg">{statusMsg}</p>
                    </td>
                </tr>
                <tr id="searchplayerRow">
                    <td>
                        <SearchPlayer
                            setFilter={setFilter}
                        />
                    </td>
                </tr>
                {listItems}
                
            </table>
            
        </div>
      );
}