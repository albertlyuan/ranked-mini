import {useState, useEffect} from 'react';
import AddPlayer from './addPlayer.js';
import {useNavigate, useParams } from 'react-router-dom'
import PlayerRow from './leaderboardPlayer.js';
import SearchPlayer from './searchPlayer.js';
import { aws_getLeaguePlayers } from '../Database/player.js';
import { aws_getLeague } from '../Database/league.js';

export default function Leaderboard({setLeagueid}){
    const [statusMsg, setStatusMsg] = useState('');
    const [filter, setFilter] = useState('');
    const [listItems, setListItems] = useState([]);
    const {leagueid} = useParams()
    setLeagueid(leagueid)

    const navigate = useNavigate();
    aws_getLeague(leagueid).then((res)=>{
        if (!res){
            navigate("/page/not/found")
        }
    })

    useEffect(() => {
        aws_getLeaguePlayers(leagueid).then((data) =>{
            if (data==null){
                return []
            }
            return data['data']['listPlayers']['items']
        }).then((roster) =>{
            roster.sort((a,b) => b.elo-a.elo)

            const playerrows = roster.map((person) => {
                return (<PlayerRow
                    name={person['displayName']}
                    uid={person['id']}
                    elo={person['elo']}
                    wins={person['wins']}
                    losses={person['losses']}
                    filter={filter}
                />)
            }); 
            setListItems(playerrows)
        })
      },[filter])
    
    return (
        <div id="leaderboard" class="tabcontent animatedLoad">
            <table>
                <thead>
                    <th style={{"text-align": "left"}}>Player (record)</th>
                    <th style={{"text-align": "right"}}>Elo</th>
                </thead>
                <SearchPlayer
                    setFilter={setFilter}
                    text={"Search Player"}
                />
                <tr id="addplayerRow">
                    <td>
                        <AddPlayer
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