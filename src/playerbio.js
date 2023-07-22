import {firebase_getTotalPlayerData, blankPlayer} from './firebase.js'
import { useEffect, useState } from 'react'
import { Line  } from "react-chartjs-2"
import {Chart, LinearScale, CategoryScale, PointElement, LineElement, Tooltip} from "chart.js";
import GamesLog from "./gamesLog.js";

Chart.register(CategoryScale,LinearScale, PointElement, LineElement, Tooltip);

export default function PlayerBio({player, games, setTab, setGame}){
    const [playerGames, setPlayerGames] = useState([])
    const [playerData, setPlayerData] = useState({0:blankPlayer("")})
    const [currWins, setCurrWins] = useState(0)
    const [currLosses, setCurrLosses] = useState(0)
    const [currElo, setCurrElo] = useState(0)
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{ //const elos
            label: "Elo",
            data: [],
            backgroundColor: "black",
            borderColor:"black",
            borderWidth: 2
        },
        {data: []}, //const timestamps 1
        {data: []}, //for showing elogain 2
        {data: []}, //for showing teammates 3
        {data: []}, //for showing opponents 4

        ]
    })

    useEffect(() => {     
        firebase_getTotalPlayerData(player)
        .then(data => {
            setPlayerData(data)
        })
        .then(() => {
            const mostRecentGame = getMostRecentGame()
            if (mostRecentGame.timestamp === -1){
                return
            }else{
                setCurrElo(mostRecentGame.elo)
                setCurrLosses(mostRecentGame.losses)
                setCurrWins(mostRecentGame.wins)
                const [elos, timestamps, elogain] = eloHistory()
                const [gameWinners, gameLosers] = getGamePlayers()

                const dataobj = {
                    labels: elos.map(x => x[0]),
                    datasets: [{
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
                    }
                    ]
                }
                setChartData(dataobj)
            }
        })
    }, [playerData, player])
    
    function getMostRecentGame(){
        let gameIDs = Object.keys(playerData)
        if (gameIDs.length < 1){
            return blankPlayer("")
        }
        let maxGameID = Math.max.apply(0,gameIDs)

        return playerData[maxGameID]
    }

    function getGamePlayers(){
        const gameWinners = []
        const gameLosers = []
        const thisplayerGames = []
        let gameIDs = new Set(Object.keys(playerData))
        
        for (const g of games){
            if (gameIDs.has(g[0])){
                gameWinners.push([g[0],g[2]])
                gameLosers.push([g[0],g[3]])
                thisplayerGames.push(g)
            }
            if (gameWinners.length === gameIDs.length){
                break
            }
        }
        setPlayerGames(thisplayerGames)
        return [gameWinners, gameLosers]
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
        elos.sort((a,b) => {
            if (a[0] < b[0]) {
                return -1;
            } else if (a[0] > b[0]) {
                return 1;
            } else {
                return 0;
            }
        })

        for (let i = 1; i < elos.length; i++){
            elogain.push([elos[i][0], elos[i][1] - elos[i-1][1]])
        }

        return [elos, timestamps, elogain]
    }

        
    

    return(
        <div class="animatedLoad">
            <h2>{player} ({currWins}-{currLosses})</h2>

            {/* <p>{ chartData.datasets[0].data.join(",")}</p> */}
            {/* <p>{ chartData.labels.join(",")}</p> */}
            <br></br>
            <div>
                <h3>Elo: {currElo}</h3>
                <LineChart chartData={chartData}/>
            </div>
            <br></br>
            <div>
                <h3>Game History</h3>
                <GamesLog
                    gamesLog={playerGames}
                    setTab={setTab} 
                    setGame={setGame}
                />
            </div>
        </div>

    );
}


function LineChart({chartData}) {    
    const options = {
        scales: {
            x: {
               ticks: {
                   display: false
              }
           },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins:{
            tooltip: {
                // enabled: true,
                callbacks: {
                    beforeTitle: (context) => {
                        // const dataidx = Object.values(context)[0].dataIndex

                        // return Object.keys(Object.values(context)[0])
                        return "Game ID: " + Object.values(context)[0].label 
                    },
                    title: (context) => {
                        return "Timestamp: " + chartData.datasets[1].data[Object.values(context)[0].dataIndex]
                    },
                    label: function(context){
                        const elogain = chartData.datasets[2].data[context.dataIndex]
                        return context.formattedValue + ` (${elogain > 0 ? "+" : ""}${elogain ? elogain.toFixed(2) : ""})`
                    },
                    labelTextColor: function(context) {
                        const elogain = chartData.datasets[2].data[context.dataIndex]
                        if (elogain > 0){
                            return 'green'
                        }else if (elogain < 0){
                            return 'red'
                        }
                        return 'white';
                    },
                    body: (context) => {
                        return Object.values(context)[0];
                        // context.dataset.label + ": " + 

                    },

                    footer: (context) => {
                        return "Winning team: " + chartData.datasets[3].data[Object.values(context)[0].dataIndex]
                    },
                    afterFooter: (context) => {
                        return "Losing team: " + chartData.datasets[4].data[Object.values(context)[0].dataIndex]
                    },
                },
            },
        }
      }

    return (
        <Line 
            data={chartData} 
            options={options} 
        />
    );

}