import {useNavigate, useParams} from "react-router-dom"
import { DayMonthDateYear } from "../Elo/dateutils.js";
import { useEffect, useState } from "react";
/**
 * game = list of [gameid, ts, winners (list), losers (list), winnerPulled (bool)]
 * @param {*} param0 game, setTab, setGame
 * @returns <tr> with gameID, timestamp, winning team, losing team
 */
export default function GameRow({game, eloGain, dateFilter, playerFilter}){
    //[gameid, ts, winners (list), losers (list), winnerPulled (bool)]
    const navigate = useNavigate();
    const [showRow, setShowRow] = useState("table-row")
    const {leagueid} = useParams()
    const formattedDate = () => {
        return DayMonthDateYear(game['timestamp'])
    }
    const winners = [game['winner1'],game['winner2'],game['winner3']]
    const losers = [game['loser1'],game['loser2'],game['loser3']]

    const goToGame = () => {
        navigate(`/${leagueid}/games/${game['id']}`);
    };

    const deltaElo = () => {
        if (eloGain){
            let idx = 0
            for (idx= 0; idx < eloGain[0].length ; idx++){
                if (eloGain[0][idx] == game['id']){
                    break
                }
            }
            const gainloss = eloGain[1][idx]
            return gainloss
        }   
        return 0
    }

    useEffect(()=>{
        if ((winners.join(", ").toLowerCase().indexOf(playerFilter) > -1
        || losers.join(", ").toLowerCase().indexOf(playerFilter) > -1)
        && formattedDate().toLowerCase().indexOf(dateFilter) > -1){
            setShowRow("table-row")
        } else{
            setShowRow("none")
        }
    })

    if (eloGain){ //for player bio
        return(
            <tr 
                class={(deltaElo() > 0 ? "elogain " : deltaElo() < 0 ? "eloloss " : "")  + "clickable highlights"} 
                onClick={goToGame}
                style={{display: showRow}}
            >   
                <td>{game['id']} </td>
                <td>{formattedDate()}</td>
                <td>{winners.join(", ")} </td>
                <td>{losers.join(", ")} </td>
                <td>{deltaElo() ? deltaElo().toFixed(2) : deltaElo()}</td>
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
            <td>{formattedDate()}</td>
            <td>{winners.join(", ")} </td>
            <td>{losers.join(", ")} </td>
            <td>{game['winnerPulled']  ? "True" : "False"}</td>
        </tr>
    )
}
