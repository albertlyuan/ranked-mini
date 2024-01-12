import { useEffect, useState } from 'react';
import GameRow from './gameRow.js'
import { useNavigate, useParams } from 'react-router-dom';
import SearchPlayer from '../Leaderboard/searchPlayer.js';
import { leagueExists } from '../Firebase/database.js';

export default function GamesLog({gamesLog, eloGain, setLeagueid}){
    const [gameList, setGameList] =  useState([]);
    const [dateFilter, setDateFilter] = useState('');
    const [playerFilter, setPlayerFilter] = useState('');
    const {leagueid} = useParams()
    const navigate = useNavigate();
    leagueExists(leagueid).then((res)=>{
        if (!res){
            setLeagueid(null)
            navigate("/page/not/found")
        }
    })

    useEffect(() => {
        if (gamesLog.length > 0){
            const temp = gamesLog.map((game) =>
                <GameRow 
                    game={game}
                    eloGain={eloGain}
                    dateFilter={dateFilter}
                    playerFilter={playerFilter}
                />
            )
            setGameList(temp)
        }
        setLeagueid(leagueid)
    },[gamesLog, dateFilter, playerFilter])
    
    return(
        <div class="animatedLoad">
            <table class="gamelog">
                <tr>
                    <td>
                        <SearchPlayer
                            setFilter={setDateFilter}
                            text={"Search Date"}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <SearchPlayer
                            setFilter={setPlayerFilter}
                            text={"Search Players"}
                        />
                    </td>
                </tr>

            </table>
            <table class="gamelog">
                <tr style={{textAlign: "left"}}>
                    <th>Game ID</th>
                    <th>Timestamp</th>
                    <th>Winning Team</th>
                    <th>Losing Team</th>
                    {eloGain ? <th>+/- Elo</th> : <></>}
                    <th>Broke to Win</th>
                </tr>
                
                {gameList}
            </table>
            
        </div>
        
    );
}

