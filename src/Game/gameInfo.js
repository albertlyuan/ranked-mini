import Teams from "./gameInfoTeams.js"
import { useParams  } from 'react-router-dom';
import {useNavigate  } from "react-router-dom"

// var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function GameInfo({gamesLog}){
    // [gameid, date string, winners, losers, broke to win]
    const { gameid } = useParams();
    const navigate = useNavigate();

    const game = gamesLog.find((game) => game[0] == parseInt(gameid))
    const nextgame = gamesLog.find((game) => game[0] == parseInt(gameid)+1)

    const goToPrevGame = () => {
        navigate(`/game/${parseInt(gameid)-1}`);
    };
    const goToNextGame = () => {
        navigate(`/game/${parseInt(gameid)+1}`);
    };

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
                <br></br>
                <h3 style={{textAlign:"center"}}>Broke to win: {game[4]  ? "True" : "False"}</h3>

                <Teams gameID={game[0]} winners={game[2]} losers={game[3]}/>        
            </div>        
        );
    }else{
        return (
            <p>No game found</p>
        )
    }
}



