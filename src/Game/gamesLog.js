import { useEffect, useState } from 'react';
import GameRow from './gameRow.js'
import { useParams } from 'react-router-dom';

export default function GamesLog({gamesLog, eloGain, setLeagueid}){
    const [gameList, setGameList] =  useState([]);
    const {leagueid} = useParams()
    useEffect(() => {
        if (gamesLog.length > 0){
            const temp = gamesLog.map((game) =>
                <GameRow 
                    game={game}
                    eloGain={eloGain}
                />
            )
            setGameList(temp)
        }
        setLeagueid(leagueid)
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

