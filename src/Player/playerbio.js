import {firebase_getTotalPlayerData, blankPlayer} from '../Elo/firebase.js'
import { useEffect, useState, lazy } from 'react'
import {EloChart, blankChartData} from "./eloChart.js"
import {getRankFromElo} from '../rank-images/rankImages.js';
import { useParams } from 'react-router-dom';

const GamesLog = lazy(() => import('../Game/gamesLog.js'));

function sortListByGameID(a,b){
    if (a[0] < b[0]) {
        return -1;
    } else if (a[0] > b[0]) {
        return 1;
    } else {
        return 0;
    }
}

export default function PlayerBio({games}){
    const { playername } = useParams();
    const [playerGames, setPlayerGames] = useState()
    const [playerData, setPlayerData] = useState()
    const [currWins, setCurrWins] = useState(0)
    const [currLosses, setCurrLosses] = useState(0)
    const [currElo, setCurrElo] = useState(0)
    const [chartData, setChartData] = useState(blankChartData)

    useEffect(() => {     
        firebase_getTotalPlayerData(playername)
        .then(data => {
            setPlayerData(data)
        })
        .then(() => {
            const mostRecentGame = getMostRecentGame()
            if (!mostRecentGame || mostRecentGame.timestamp === -1){
                return
            }else{
                setCurrElo(mostRecentGame.elo)
                setCurrLosses(mostRecentGame.losses)
                setCurrWins(mostRecentGame.wins)

                const [elos, timestamps, elogain] = eloHistory()
                const [gameWinners, gameLosers, pullers] = getGamePlayers()

                const dataobj = {
                    labels: elos.map(x => x[0]),
                    datasets: [
                        {
                            label: "Elo",
                            data: elos.map(x => x[1]),
                            backgroundColor: "black",
                            borderColor:"black",
                            borderWidth: 2
                        },
                        {
                            label: "timestamps",
                            data: timestamps.map(x => x[1]),
                            hidden: true,
                        },
                        {
                            label: "elogain",
                            data: elogain.map(x => x[1]),
                            hidden: true,
                        },
                        {
                            label: "winners",
                            data: gameWinners.map(x => x[1]),
                            hidden: true,
                        },
                        {
                            label: "losers",
                            data: gameLosers.map(x => x[1]),
                            hidden: true,
                        },
                        {
                            label: "pulled",
                            data: pullers.map(x => x[1]),
                            hidden: true,
                        }
                    ]
                }
                setChartData(dataobj)
            }
        })
    }, [playerData, playername])
    
    function getMostRecentGame(){
        if (!playerData){
            return
        }
        let gameIDs = Object.keys(playerData)
        if (gameIDs.length < 1){
            return blankPlayer("")
        }
        let maxGameID = Math.max.apply(0,gameIDs)

        return playerData[maxGameID]
    }

    function getGamePlayers(){
        const gameWinners = [[-1,null]]
        const gameLosers = [[-1,null]]
        const pullers = [[-1,null]]
        const thisplayerGames = []
        let gameIDs = new Set(Object.keys(playerData))
        
        for (const g of games){
            if (gameIDs.has(g[0])){
                const intGameId = parseInt(g[0])
                gameWinners.push([intGameId,g[2]])
                gameLosers.push([intGameId,g[3]])
                pullers.push([intGameId,g[4]])
                thisplayerGames.push(g)
            }
            if (gameWinners.length === gameIDs.length){
                break
            }
        }
        gameLosers.sort(sortListByGameID)
        gameWinners.sort(sortListByGameID)
        pullers.sort(sortListByGameID)

        setPlayerGames(thisplayerGames)
        return [gameWinners, gameLosers, pullers]
    }

    const eloHistory = () => {
        const elos = []
        const timestamps = []
        const elogain = [0]

        for (const [gameid, game] of Object.entries(playerData)){
            // ret.push([new Date(game.timestamp), game.elo])
            const intGameId = parseInt(gameid)
            const ts = new Date(game.timestamp)
            elos.push([intGameId, game.elo])
            timestamps.push([intGameId, `${ts.getMonth()}/${ts.getDate()}/${ts.getFullYear()}`])
        }
        elos.sort(sortListByGameID)

        for (let i = 1; i < elos.length; i++){
            elogain.push([elos[i][0], elos[i][1] - elos[i-1][1]])
        }

        return [elos, timestamps, elogain]
    }

    return(
        <div class="animatedLoad">
            <h2>{playername} ({currWins}-{currLosses})  <img title={getRankFromElo(currElo, currWins, currLosses).split("static/media/")[1].split(".")[0]} class="rankImg" src={getRankFromElo(currElo, currWins, currLosses)}/></h2>
            <div>
                <h3>Elo: {currElo} </h3>
                {chartData ? <EloChart chartData={chartData}/> : null}
            </div>
            <br></br>
            <div>
                <h3>Game History</h3>
                {playerGames ? <GamesLog
                    gamesLog={playerGames}
                    eloGain={[chartData["labels"], chartData["datasets"][2].data]}
                /> : null}
            </div>
        </div>

    );
}


