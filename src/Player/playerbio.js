import {firebase_getTotalPlayerData, blankPlayer, getNameFromUID, firebase_getPlayerTeams} from '../Firebase/database.js'
import { useEffect, useState, lazy } from 'react'
import {EloChart, blankChartData} from "./eloChart.js"
import {getRankFromElo} from '../rank-images/rankImages.js';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Firebase/auth.js';
import TextInputAlert from './textInputAlert.js';
import { PlayerTeam, AddPlayerTeam } from './playerteam.js';
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
const NUM_PLACEMENTS = 10  
export default function PlayerBio({games}){
    const { uid } = useParams();

    const [playerName, setPlayerName] = useState()
    const [playerGames, setPlayerGames] = useState()
    const [playerData, setPlayerData] = useState()
    const [currWins, setCurrWins] = useState(0)
    const [currLosses, setCurrLosses] = useState(0)
    const [currElo, setCurrElo] = useState(0)
    const [chartData, setChartData] = useState(blankChartData)
    const [loggedin, setLoggedin] = useState(false);
    const [teams, setTeams] = useState([]);
    const [observer, triggerReload] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
            setLoggedin(true)
            }else{
            setLoggedin(false)
            }
        })
        getNameFromUID(uid).then((name) =>{
            setPlayerName(name)
        })
        firebase_getTotalPlayerData(uid)
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
        
        getTeams()
        
    }, [playerData, uid, observer])

    function getTeams(){
        firebase_getPlayerTeams(uid)
        .then(teamnames => {
            const namecomponents = teamnames.map(name => {
                return (<PlayerTeam uid={uid} teamname={name} triggerReload={triggerReload} observer={observer}/>)
            })
            setTeams(namecomponents)
        })
    }

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

    function makeCroppedChartData(){
        const data = {
            labels: chartData.labels.slice(NUM_PLACEMENTS),
            datasets: [
            {
                label: "Elo",
                data: chartData.datasets[0].data.slice(NUM_PLACEMENTS),
                backgroundColor: "black",
                borderColor:"black",
                borderWidth: 2
            },
            {
                label: "timestamps",
                data: chartData.datasets[1].data.slice(NUM_PLACEMENTS),
                hidden: true
            },
            {
                label: "elogain",
                data: chartData.datasets[2].data.slice(NUM_PLACEMENTS),
                hidden: true
            },
            {
                label: "winners",
                data: chartData.datasets[3].data.slice(NUM_PLACEMENTS),
                hidden: true
            },
            {
                label: "losers",
                data: chartData.datasets[4].data.slice(NUM_PLACEMENTS),
                hidden: true
            },
            {
                label: "pulled",
                data: chartData.datasets[5].data.slice(NUM_PLACEMENTS),
                hidden: true
            }, 
            ]
        }
        data.datasets[2].data[0] = 0
        return data
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
            timestamps.push([intGameId, `${ts.getMonth()+1}/${ts.getDate()}/${ts.getFullYear()}`])
        }
        elos.sort(sortListByGameID)

        for (let i = 1; i < elos.length; i++){
            elogain.push([elos[i][0], elos[i][1] - elos[i-1][1]])
        }

        return [elos, timestamps, elogain]
    }


    return(
        <div class="animatedLoad">
            <h2>
                {playerName} ({currWins}-{currLosses})  
                <img title={getRankFromElo(currElo, currWins, currLosses).split("static/media/")[1].split(".")[0]} class="rankImg" src={getRankFromElo(currElo, currWins, currLosses)}/>
            </h2>
            {loggedin && playerName ? <TextInputAlert oldname={playerName} /> : null}
            <div class="horizontal_left">
                {teams}
                <AddPlayerTeam uid={uid} getTeams={getTeams}/> 
            </div>
            <div>
                <h3>Elo: {currWins + currLosses >= 10 ? currElo : loggedin ? currElo : "Unranked"} </h3>
                {chartData ? <EloChart rawChartData={chartData} noPlacementGames={makeCroppedChartData()}/> : null}
            </div>
            <br></br>
            <div>
                <h3>Game History</h3>
                {playerGames ? <GamesLog
                    gamesLog={playerGames}
                    eloGain={loggedin ? 
                        [chartData["labels"], chartData["datasets"][2].data]  //show all elo gain if logged in
                        : [chartData["labels"].slice(NUM_PLACEMENTS+1), chartData["datasets"][2].data.slice(NUM_PLACEMENTS+1)]} //hide elo gain of placement games
                /> : null}
            </div>
        </div>

    );
}


