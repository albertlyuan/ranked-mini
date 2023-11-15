import Teams from "./gameInfoTeams.js"
import { AppLoader } from "../loader.js";
import {queryGamePlayersData} from "../Firebase/database.js"
import { useParams ,useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react'
import { MonthDateYear } from "../Elo/dateutils.js";
import { getGamesLog, getGame } from "../Firebase/database.js";

// [gameid, date string, winners, losers, broke to win]
export default function GameInfo(){
    //data = [player,[before.elo, after.elo], before.wins, before.losses]
    const [winnerData, setWinnerData] = useState([]);
    const [loserData, setLoserData] = useState([]);
    const [breakToWin, setBreakToWin] = useState(false);
    const { gameid } = useParams();
    const [hypothetical, setHypothetical] = useState(false);

    const [game, setGame] = useState();
    const [nextgame, setNextgame] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        getGame(gameid).then((g)=>{
            if (g){
                setGame(g)
                const winners = g[2]
                const losers = g[3]
                setBreakToWin(g[4])
                queryGamePlayersData(winners, gameid).then(data => {
                    data.sort((a,b) => b[1][0]-a[1][0])
                    setWinnerData(data)
                })
            
                queryGamePlayersData(losers, gameid).then(data => {
                    data.sort((a,b) => b[1][0]-a[1][0])
                    setLoserData(data)  
                })
            }
        })
        getGame(`${parseInt(gameid)+1}`).then((g)=>{
            if (g[0] == parseInt(gameid)+1){
                setNextgame(g)
            }else{
                setNextgame(null)
            }
            
        })
    }, [game])
    const goToPrevGame = () => {
        navigate(`/games/${parseInt(gameid)-1}`);
    };
    const goToNextGame = () => {
        navigate(`/games/${parseInt(gameid)+1}`);
    };

    const toggleHypothetical = () => {
        setHypothetical(!hypothetical)
    }
    
    if (game!=null){
        return(
            <div>
                <div class="horizontal">
                    <a class="clickable highlights arrowbutton" style={{display: gameid > 0 ? "block" : "none"}} onClick={goToPrevGame}>
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
                    ?<Teams gameID={gameid} winnerData={winnerData} loserData={loserData} alternateResult={hypothetical} breakToWin={breakToWin}/>        
                    : null
                }
            </div>        
        );
    }else{
        return (
            <AppLoader></AppLoader>
        )
    }
}



