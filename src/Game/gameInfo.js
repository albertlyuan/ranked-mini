import Teams from "./gameInfoTeams.js"
import { useParams } from 'react-router-dom';

var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function GameInfo({gamesLog}){
    // [gameid, date string, winners, losers, broke to win]
    // const dayOfWeek = (dateString) => {
    //     const date = new Date(dateString)
    //     return daysOfWeek[date.getDay()]
    // }
    const { gameid } = useParams();
    const game = gamesLog.find((game) => game[0] === gameid);
    

    const fullDate = (dateString) => {
        const date = new Date(dateString)
        const formattedDate = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
        return formattedDate
    }

    return(
        <div>
            <div class="date">
                <h3 id="DayOfWeek">Game ID: {game[0]}</h3>
                <p id="FullDate">{fullDate(game[1])}</p>
            </div> 
            <br></br>
            <h3 style={{textAlign:"center"}}>Broke to win: {game[4]  ? "True" : "False"}</h3>

            <Teams gameID={game[0]} winners={game[2]} losers={game[3]}/>            
        </div>
        
    );
}



