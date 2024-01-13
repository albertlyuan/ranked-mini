import {useNavigate, useParams} from "react-router-dom"
import { DayMonthDateYear } from "../Elo/dateutils.js";
import { useEffect, useState } from "react";
/**
 * game = list of [gameid, ts, winners (list), losers (list), winnerPulled (bool)]
 * @param {*} param0 game, setTab, setGame
 * @returns <tr> with gameID, timestamp, winning team, losing team
 */
function GameRow({game, eloGain, dateFilter, playerFilter}){
    //[gameid, ts, winners (list), losers (list), winnerPulled (bool)]
    const navigate = useNavigate();
    const [showRow, setShowRow] = useState("table-row")
    const {leagueid} = useParams()
    const formattedDate = () => {
        return DayMonthDateYear(game[1])
    }

    const goToGame = () => {
        navigate(`/${leagueid}/games/${game[0]}`);
    };

    useEffect(()=>{
        if ((game[2].join(", ").toLowerCase().indexOf(playerFilter) > -1
        || game[3].join(", ").toLowerCase().indexOf(playerFilter) > -1)
        && formattedDate().toLowerCase().indexOf(dateFilter) > -1){
            setShowRow("table-row")
        } else{
            setShowRow("none")
        }
    })

    if (eloGain){
        const deltaElo = () => {
            if (eloGain){
                let idx = 0
                for (idx= 0; idx < eloGain[0].length ; idx++){
                    if (eloGain[0][idx] == game[0]){
                        break
                    }
                }
                const gainloss = eloGain[1][idx]
                return gainloss
            }   
            return 0
        }
        return(

            <tr 
                class={(deltaElo() > 0 ? "elogain " : deltaElo() < 0 ? "eloloss " : "")  + "clickable highlights"} 
                onClick={goToGame}
                style={{display: showRow}}
            >   
                <td>{game[0]} </td>
                <td>{formattedDate()}</td>
                <td>{game[2].join(", ")} </td>
                <td>{game[3].join(", ")} </td>
                <td>{deltaElo() ? deltaElo().toFixed(2) : deltaElo()}</td>
                <td>{game[4]  ? "True" : "False"}</td>
            </tr>

        )
    }
    return (
        <tr 
            class={"clickable highlights"}  
            onClick={goToGame}
            style={{display: showRow}}
            >
            <td>{game[0]}</td>
            <td>{formattedDate()}</td>
            <td>{game[2].join(", ")} </td>
            <td>{game[3].join(", ")} </td>
            <td>{game[4] ? "True" : "False"}</td>
        </tr>
    )
}

export default GameRow