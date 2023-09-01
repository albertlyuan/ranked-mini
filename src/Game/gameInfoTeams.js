import PlayerCell from "./gameInfoPlayerCell.js"
import {queryGamePlayersData} from "../Firebase/database.js"
import { calculateTeamElo } from "../Elo/elo.js";
import {useState, useEffect} from 'react'
function Teams({gameID, winners, losers}){
    const [winnerData, setWinnerData] = useState([]);
    const [loserData, setLoserData] = useState([]);

    useEffect(() => {
       
        //data = [player,[before.elo, after.elo], before.wins, before.losses]

        queryGamePlayersData(winners, gameID).then(data => {
            data.sort((a,b) => b[1][0]-a[1][0])
            setWinnerData(data)
        })
        queryGamePlayersData(losers, gameID).then(data => {
            data.sort((a,b) => b[1][0]-a[1][0])
            setLoserData(data)
        })
    }, [gameID])

    const rows = loserData.map((_,index) => 
        <tr>
            <PlayerCell player={winnerData[index]}/>
            <PlayerCell player={loserData[index]} />
        </tr>
    ); 

    return (
        <table class="animatedLoad">
            <tr>
                <th>Winning Team {winnerData.length > 0  ? "("+calculateTeamElo(winnerData.map(i => ({elo: i[1][0]}))).toFixed(2)+")" : ""}</th>
                <th>Losing Team {loserData.length > 0  ? "("+calculateTeamElo(loserData.map(i => ({elo: i[1][0]}))).toFixed(2)+")" : ""} </th>
            </tr>
            {rows}
        </table>
        
    )
}

export default Teams