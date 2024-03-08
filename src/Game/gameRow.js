import {useNavigate, useParams} from "react-router-dom"
import { DayMonthDateYear } from "../Elo/dateutils.js";
import { useEffect, useState } from "react";
/**
 * game = list of [gameid, ts, winners (list), losers (list), winnerPulled (bool)]
 * @param {*} param0 game, setTab, setGame
 * @returns <tr> with gameID, timestamp, winning team, losing team
 */
export default function GameRow({game, uidPlayerMap, dateFilter, playerFilter, playerid}){
    const formattedDate = DayMonthDateYear(game['timestamp'])
    const winners = [uidPlayerMap[game['winner1']],uidPlayerMap[game['winner2']],uidPlayerMap[game['winner3']]]
    const winnerdata = [JSON.parse(game['winner1data']),JSON.parse(game['winner2data']),JSON.parse(game['winner3data'])]
    const losers = [uidPlayerMap[game['loser1']],uidPlayerMap[game['loser2']],uidPlayerMap[game['loser3']]]
    const loserdata = [JSON.parse(game['loser1data']),JSON.parse(game['loser2data']),JSON.parse(game['loser3data'])]

    const navigate = useNavigate();
    const [deltaElo, setdeltaElo] = useState(null)

    const [showRow, setShowRow] = useState(satisfiesFilter(winners,losers,formattedDate,playerFilter,dateFilter) ? "table-row" : "none")
    const {leagueid} = useParams()

 
    const goToGame = () => {
        navigate(`/${leagueid}/games/${game['id']}`);
    };

    useEffect(()=>{
        if (playerid){
            const players = [game['winner1'], game['winner2'], game['winner3'], game['loser1'], game['loser2'], game['loser3']]
            const playerdata = winnerdata.concat(loserdata)
            for (const i in players){
                if (players[i] == playerid){
                    setdeltaElo((playerdata[i]['newElo'] - playerdata[i]['oldElo']).toFixed(2))
                    break
                }
            }
        }else{
            setdeltaElo(null)
        }
        
    },[playerid])
        


    if (playerid){ //for player bio
        return(
            <tr 
                class={(deltaElo > 0 ? "elogain " : deltaElo < 0 ? "eloloss " : "")  + "clickable highlights"} 
                onClick={goToGame}
                style={{display: showRow}}
            >   
                <td>{game['id']} </td>
                <td>{formattedDate}</td>
                <td>{winners.join(", ")} </td>
                <td>{losers.join(", ")} </td>
                <td>{deltaElo}</td>
                <td>{game['winnerPulled']  ? "True" : "False"}</td>
            </tr>
        )
    }
    return (
        <tr 
            class={"clickable highlights"}  
            onClick={goToGame}
            style={{display: showRow}}
            >
                <td>{game['id']} </td>
            <td>{formattedDate}</td>
            <td>{winners.join(", ")} </td>
            <td>{losers.join(", ")} </td>
            <td>{game['winnerPulled']  ? "True" : "False"}</td>
        </tr>
    )
}


function satisfiesFilter(winners,losers,date,playerFilter,dateFilter){
    if (winners.join(", ").toLowerCase().indexOf(playerFilter) > -1){
        return true
    }
    if (losers.join(", ").toLowerCase().indexOf(playerFilter) > -1){
        return true
    }
    if (date.toLowerCase().indexOf(dateFilter) > -1){
        return true
    }
    return false
}