import Teams from "./gameInfoTeams.js"
import {useState} from 'react'
import { MonthDateYear } from "../Elo/dateutils.js";

// [gameid, date string, winners, losers, broke to win]
export default function GameInfo({game, goToNextGame, goToPrevGame, nextgame, winnerData, loserData, breakToWin}){
    //data = [player,[before.elo, after.elo], before.wins, before.losses]
    const [hypothetical, setHypothetical] = useState(false);  

    const toggleHypothetical = () => {
        setHypothetical(!hypothetical)
    }
    
    return(
        <div>
            <div class="horizontal">
                <a class="clickable highlights arrowbutton" style={{display: game[0] > 0 ? "block" : "none"}} onClick={goToPrevGame}>
                    &lt;
                </a>
                <div class="date">
                    <h3 id="DayOfWeek">Game ID: {game[0]}</h3>
                    <p id="FullDate">{MonthDateYear(game[1])}</p>
                </div> 
                <a class="clickable highlights arrowbutton" style={{display: nextgame!=null ? "block" : "none"}} onClick={goToNextGame}>
                    &gt;
                </a>
            </div>
            <button style={{textAlign:"center"}} class="scoreReportButton clickable highlights" onClick={toggleHypothetical}>Flip Result (Currently: {hypothetical ? "Alternate": "Normal"})</button>
            <br></br>
            {hypothetical 
                ? <h3 style={{textAlign:"center"}}>Broke to win: {breakToWin  ? "False" : "True"}</h3>
                : <h3 style={{textAlign:"center"}}>Broke to win: {breakToWin  ? "True" : "False"}</h3>
            }
            {game 
                ?<Teams gameID={game[0]} winnerData={winnerData} loserData={loserData} alternateResult={hypothetical} breakToWin={breakToWin}/>        
                : null
            }
        </div>        
    );
}



