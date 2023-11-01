import { useEffect, useState } from 'react';
import GameRow from './gameRow.js'

export default function GamesLog({gamesLog, eloGain}){
    const [gameList, setGameList] =  useState([]);

    useEffect(() => {
        const temp = gamesLog.map((game) =>
            <GameRow 
                game={game}
                eloGain={eloGain}
            />
        )
        setGameList(temp)
    },[gamesLog])
    

    return(
        <div class="animatedLoad">
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

