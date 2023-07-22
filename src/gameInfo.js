import {queryGamePlayersData} from "./firebase.js"
import {useState, useEffect} from 'react'
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
                <h3 id="DayOfWeek">{dayOfWeek(game[1])}</h3>
                <p id="FullDate">{fullDate(game[1])}</p>
            </div> 
            <br></br>
            <Teams gameID={game[0]} winners={game[2]} losers={game[3]} setTab={setTab} setPlayer={setPlayer}/>            
        </div>
        
    );
}

function Teams({gameID, winners, losers, setTab, setPlayer}){
    const [winnerData, setWinnerData] = useState([]);
    const [loserData, setLoserData] = useState([]);

    useEffect(() => {     
        queryGamePlayersData(winners, gameID).then(data => {
            data.sort((a,b) => b[1]-a[1])
            setWinnerData(data)
        })
        queryGamePlayersData(losers, gameID).then(data => {
            data.sort((a,b) => b[1]-a[1])
            setLoserData(data)
        })
    }, [])

    const rows = loserData.map((_,index) => 
        <tr>
            <PlayerCell player={winnerData[index]} setTab={setTab} setPlayer={setPlayer}/>
            <PlayerCell 
                player={loserData[index]} 
                setTab={setTab} 
                setPlayer={setPlayer}/>
        </tr>
    ); 

    return (
        <table class="animatedLoad">
            <tr>
                <th>Winning Team</th>
                <th>Losing Team</th>
            </tr>
            {rows}
        </table>
        
    )
    
}


function PlayerCell({player, setTab, setPlayer}){
// [playername,playerData.elo, playerData.wins, playerData.losses]
    const goToPlayer = () => {
        setTab('playerbio')
        setPlayer(player[0])
    }

    return(
        <td class="playerCell" onClick={goToPlayer}>
            <h3>{player[0]} ({player[2]}-{player[3]})</h3>
            <p>elo: {player[1]}</p>
        </td>
    );
}