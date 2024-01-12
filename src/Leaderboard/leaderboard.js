import {useState, useEffect} from 'react';
import AddPlayer from './addPlayer.js';
import {useParams } from 'react-router-dom'
import PlayerRow from './leaderboardPlayer.js';
import SearchPlayer from './searchPlayer.js';

export default function Leaderboard({roster, setLeagueid}){
    const [statusMsg, setStatusMsg] = useState('');
    const [filter, setFilter] = useState('');
    const [listItems, setListItems] = useState([]);
    const {leagueid} = useParams()

    useEffect(() => {
        setLeagueid(leagueid)
        const playerrows = roster.map((person) => {
            return (<PlayerRow
                name={person[0]}
                elo={person[1]}
                wins={person[2]}
                losses={person[3]}
                filter={filter}
            />)
        }); 

        setListItems(playerrows)

      },[roster, filter])
    
    return (
        <div id="leaderboard" class="tabcontent animatedLoad">
            <table>
                <thead>
                    <th style={{"text-align": "left"}}>Player (record)</th>
                    <th style={{"text-align": "right"}}>Elo</th>
                </thead>
                <tr id="searchplayerRow">
                    <td>
                        <SearchPlayer
                            setFilter={setFilter}
                        />
                    </td>
                </tr>
                <tr id="addplayerRow">
                    <td>
                        <AddPlayer
                            roster={roster}
                            setStatusMsgFunc={(msg) => {
                                setStatusMsg(msg)
                            }}
                            leagueid={leagueid}
                        />
                    </td>
                    <td>
                        <p class="statusmsg">{statusMsg}</p>
                    </td>
                </tr>
                {listItems}
                
            </table>
        </div>
      );
}