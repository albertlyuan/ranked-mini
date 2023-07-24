import Teams from "./gameInfoTeams.js"

var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function GameInfo({game, setTab, setPlayer}){
    // [gameid, date string, winners, losers]
    const dayOfWeek = (dateString) => {
        const date = new Date(dateString)
        return daysOfWeek[date.getDay()]
    }

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
            <Teams gameID={game[0]} winners={game[2]} losers={game[3]} setTab={setTab} setPlayer={setPlayer}/>            
        </div>
        
    );
}



