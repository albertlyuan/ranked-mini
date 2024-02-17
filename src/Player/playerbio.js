import {firebase_getTotalPlayerData, firebase_get30PlayerData, get30PlayerGameLog, getNameFromUID, leagueExists} from '../Firebase/database.js'
import { useEffect, useState, lazy } from 'react'
import { AppLoader } from "../loader.js";
import { getPlayerGameLog } from '../Firebase/database.js';
import {EloChart, blankChartData} from "./eloChart.js"
import {getRankFromElo} from '../rank-images/rankImages.js';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Firebase/auth.js';
import TextInputAlert from './textInputAlert.js';
import { createChartData, makeCroppedChartData, getMostRecentGame, getGamePlayers, getEloHistory} from './playerDataUtils.js';
import GamesLog from '../Game/gamesLog.js';

export default function PlayerBio({setLeagueid}){
    const { leagueid, uid } = useParams();

    const [playerName, setPlayerName] = useState()
    const [playerGames, setPlayerGames] = useState([])
    const [playerData, setPlayerData] = useState()
    const [currWins, setCurrWins] = useState(0)
    const [currLosses, setCurrLosses] = useState(0)
    const [currElo, setCurrElo] = useState(0)
    const [chartData, setChartData] = useState(blankChartData)
    const [loggedin, setLoggedin] = useState(false);
    const [observer, triggerReload] = useState(false);
    const navigate = useNavigate();

    leagueExists(leagueid).then((res)=>{
        if (!res){
            setLeagueid(null)
            navigate("/page/not/found")
        }
    })
    
    useEffect(() => {
        setLeagueid(leagueid)
        onAuthStateChanged(auth, (user) => {
            if (user) {
            setLoggedin(true)
            }else{
            setLoggedin(false)
            }
        })
        
        get30PlayerGameLog(leagueid, uid).then((games) => {
            setPlayerGames(games)
        })

        getNameFromUID(leagueid, uid).then((name) =>{
            setPlayerName(name)
        })
        // firebase_getTotalPlayerData(leagueid, uid)
        firebase_get30PlayerData(leagueid, uid)
        .then(data => {
            setPlayerData(data)
        })
        .then(() => {
            const mostRecentGame = getMostRecentGame(playerData)
            if (!mostRecentGame || mostRecentGame.timestamp === -1){
                return
            }else{
                setCurrElo(mostRecentGame.elo)
                setCurrLosses(mostRecentGame.losses)
                setCurrWins(mostRecentGame.wins)

                const [elos, timestamps, elogain] = getEloHistory(playerData)
                const [gameWinners, gameLosers, pullers] = getGamePlayers(playerGames)

                const chartData = createChartData(elos, timestamps, elogain, gameWinners, gameLosers, pullers)

                setChartData(chartData)
            }
        })
                
    }, [playerGames, playerData, uid, observer])



    if (!playerData){
        <AppLoader></AppLoader>
    }else{
        return(
            <div class="animatedLoad">
                <h2>
                    {playerName} ({currWins}-{currLosses})  
                    <img title={getRankFromElo(currElo, currWins, currLosses).split("static/media/")[1].split(".")[0]} class="rankImg" src={getRankFromElo(currElo, currWins, currLosses)}/>
                </h2>
                {loggedin && playerName ? <TextInputAlert leagueid={leagueid} oldname={playerName} /> : null}
                <div>
                    <h3>Elo: {currWins + currLosses >= 10 ? currElo : loggedin ? currElo : "Unranked"} </h3>
                    {chartData ? <EloChart rawChartData={chartData}/> : null}
                </div>
                <br></br>
                <div>
                    <h3>Game History</h3>
                    {playerGames ? <GamesLog
                        gamesLog={playerGames}
                        eloGain={[chartData["labels"], chartData["datasets"][2].data]} //hide elo gain of placement games
                        setLeagueid={setLeagueid}
                    /> : null}
                </div>
            </div>

        );
    }
}


