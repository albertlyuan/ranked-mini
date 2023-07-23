import PlayerCell from "./gameInfoPlayerCell.js"
import {queryGamePlayersData} from "../firebase.js"
import {useState, useEffect} from 'react'

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

export default Teams