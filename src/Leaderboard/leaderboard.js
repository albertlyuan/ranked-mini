import {useState, useEffect} from 'react';
import AddPlayer from './addPlayer.js';
import PlayerRow from './leaderboardPlayer.js';
import SearchPlayer from './searchPlayer.js';
import { SelectTeam } from './selectTeam.js';
import { firebase_getAllTeams } from '../Firebase/database.js';

export default function Leaderboard({roster}){
    const [statusMsg, setStatusMsg] = useState('');
    const [filter, setFilter] = useState('');
    const [listItems, setListItems] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [teamfilter, setTeamFilter] = useState('brimstone');

    useEffect(() => {
        let playerrows = []
        if (teamfilter.length > 0 ){
            playerrows = roster.map((person) => {
                if (person[4].find((teamname) => teamname == teamfilter)){
                    return (<PlayerRow
                        name={person[0]}
                        elo={person[1]}
                        wins={person[2]}
                        losses={person[3]}
                        filter={filter}
                    />)
                }
            })
        }else{
            playerrows = roster.map((person) => {
                return (<PlayerRow
                    name={person[0]}
                    elo={person[1]}
                    wins={person[2]}
                    losses={person[3]}
                    filter={filter}
                />)
            }); 
        }

        
        setListItems(playerrows)

        firebase_getAllTeams()
        .then(teamnames => {
            setTeamList(teamnames.map(name => {
                return (<SelectTeam teamname={name} teamfilter={teamfilter} setTeamFilter={setTeamFilter}/>)
            }))
        })

      },[roster, teamfilter, filter])
    
    return (
        <div id="leaderboard" class="tabcontent animatedLoad horizontal_left">
            {filter}
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
                        />
                    </td>
                    <td>
                        <p class="statusmsg">{statusMsg}</p>
                    </td>
                </tr>
                {listItems}
                
            </table>
            <div class="vertical">
                <h3>Teams</h3>
                {teamList}
            </div>
        </div>
      );
}