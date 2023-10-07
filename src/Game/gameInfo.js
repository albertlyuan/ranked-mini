import Teams from "./gameInfoTeams.js"
import {queryGamePlayersData} from "../Firebase/database.js"
import { useParams ,useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react'

// var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// [gameid, date string, winners, losers, broke to win]
export default function GameInfo({gamesLog}){
    //data = [player,[before.elo, after.elo], before.wins, before.losses]
    const [winnerData, setWinnerData] = useState([]);
    const [loserData, setLoserData] = useState([]);
    const [breakToWin, setBreakToWin] = useState(false);
    const { gameid } = useParams();
    const [hypothetical, setHypothetical] = useState(false);

    const navigate = useNavigate();
    const game = gamesLog.find((game_obj) => game_obj[0] == parseInt(gameid))
    const nextgame = gamesLog.find((game_obj) => game_obj[0] == parseInt(gameid)+1)

    useEffect(() => {
        const winners = game[2]
        const losers = game[3]
        setBreakToWin(game[4])
        queryGamePlayersData(winners, gameid).then(data => {
            data.sort((a,b) => b[1][0]-a[1][0])
            setWinnerData(data)
        })
        queryGamePlayersData(losers, gameid).then(data => {
            data.sort((a,b) => b[1][0]-a[1][0])
            setLoserData(data)  
        })
    }, [game])
    const goToPrevGame = () => {
        navigate(`/game/${parseInt(gameid)-1}`);
    };
    const goToNextGame = () => {
        navigate(`/game/${parseInt(gameid)+1}`);
    };

    const toggleHypothetical = () => {
        setHypothetical(!hypothetical)
    }

    const fullDate = (dateString) => {
        const date = new Date(dateString)
        const formattedDate = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
        return formattedDate
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
                        <p id="FullDate">{fullDate(game[1])}</p>
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
                <Teams gameID={gameid} winnerData={winnerData} loserData={loserData} alternateResult={hypothetical} breakToWin={breakToWin}/>        
            </div>        
        );
    }else{
        return (
            <p>No game found</p>
        )
    }
}



