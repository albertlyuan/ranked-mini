import PlayerCell from "./gameInfoPlayerCell.js"
import { calculateTeamElo } from "../Elo/elo.js";
import {useState, useEffect} from 'react'
function Teams({gameID, winnerData, loserData, alternateResult, breakToWin}){
    const [winnerTeamElo, setWinnerTeamElo] = useState(0);
    const [loserTeamElo, setLoserTeamElo] = useState(0);
    const [rows, setRows] = useState();

    useEffect(() => {
        if (loserData==null || winnerData==null){
            return
        }
        //data = [player,[before.elo, after.elo], before.wins, before.losses]
        if(loserData.length > 0){
            setLoserTeamElo(calculateTeamElo(loserData.map(i => ({elo: i[1][0]}))).toFixed(2))
        }
        if(winnerData.length > 0){
            setWinnerTeamElo(calculateTeamElo(winnerData.map(i => ({elo: i[1][0]}))).toFixed(2))
        }

        const players = loserData.map((_,index) => 
            <tr>
                <PlayerCell player={winnerData[index]} alternateResult={alternateResult} winningTeamElo={winnerTeamElo} losingTeamElo={loserTeamElo} win={true} breakToWin={breakToWin}/>
                <PlayerCell player={loserData[index]} alternateResult={alternateResult} winningTeamElo={winnerTeamElo} losingTeamElo={loserTeamElo} win={false} breakToWin={breakToWin}/>
            </tr>
        ); 
        setRows(players)
    }, [gameID, winnerData, loserData, alternateResult])

    

    return (
        <table class="animatedLoad">
            <tr>
                <th>{!alternateResult ? "Winning Team" : "Losing Team"} {"("+winnerTeamElo+")"}</th>
                <th>{!alternateResult ? "Losing Team" : "Winning Team"} { "("+loserTeamElo+")"} </th>
            </tr>
            {rows}
        </table>
        
    )
}

export default Teams