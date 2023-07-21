import {firebase_getTotalPlayerData, blankPlayer} from './firebase.js'
import { useEffect, useState } from 'react'

export default function PlayerBio({player, setTab, setGame}){
    const [playerData, setPlayerData] = useState([])

    useEffect(() => {     
        firebase_getTotalPlayerData(player).then(data => {
            setPlayerData(Object.values(data))
        })
    }, [])

    const mostRecentGame = () => {
        if (playerData.length < 1){
            return blankPlayer
        }
        else if (playerData.length == 1){
            return playerData[0]
        } else{
            return playerData[playerData.length-2]
        }
    }
    const currElo = () => {
        return mostRecentGame().elo
    }
    const currRecord = () => {
        return [mostRecentGame().wins, mostRecentGame().losses]
    }

    const gameHistory = () => {
        //TODO QUERY GAMES like in games log
    }

    const eloHistory = () => {
        const ret = []
        for (let game of playerData){
            ret.push([new Date(game.timestamp), game.elo])
        }
        ret.sort((a,b) => a[0]-b[0])

    }

    return(
        <div>
            <h2>{player} ({currRecord()[0]}-{currRecord()[1]})</h2>
            <p>{currElo()}</p>
            <div class="split left">
                {/* <div class="centered"> */}
                <h3>Elo</h3>
                {/* </div> */}
                

            </div>
            <div class="split right">
                {/* <div class="centered"> */}
                <h3>Game History</h3>
                {/* </div> */}
            </div>
        </div>

    );
}
