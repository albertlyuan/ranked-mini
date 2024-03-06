import { useEffect, useState } from 'react';
import GameRow from './gameRow.js'
import { useNavigate, useParams } from 'react-router-dom';
import SearchPlayer from '../Leaderboard/searchPlayer.js';
import { leagueExists } from '../Firebase/database.js';

export default function GamesLog({gamesLog, playerid}){
    const [gameList, setGameList] =  useState([]);

    // WIP
    const [dateFilter, setDateFilter] = useState('');
    const [playerFilter, setPlayerFilter] = useState('');


    useEffect(() => {
        if (gamesLog.length > 0){
            const temp = gamesLog.map((game) =>
                <GameRow 
                    game={game}
                    playerid={playerid}//for player bio
                    dateFilter={dateFilter}
                    playerFilter={playerFilter}
                />
            )
            setGameList(temp)
        }
    },[gamesLog, dateFilter, playerFilter])
    
    return(
        <div class="animatedLoad">
            {/* <table class="gamelog">
                <SearchPlayer
                    setFilter={setDateFilter}
                    text={"Search Date"}
                />
                <SearchPlayer
                    setFilter={setPlayerFilter}
                    text={"Search Players"}
                />
            </table> */}
            <table class="gamelog">
                <tr style={{textAlign: "left"}}>
                    <th>Game ID</th>
                    <th>Timestamp</th>
                    <th>Winning Team</th>
                    <th>Losing Team</th>
                    {playerid ? <th>+/- Elo</th> : <></>}
                    <th>Broke to Win</th>
                </tr>
                
                {gameList}
            </table>
            
        </div>
        
    );
}

