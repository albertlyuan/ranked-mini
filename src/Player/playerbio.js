import {firebase_get30PlayerData, get30PlayerGameLog, getNameFromUID, leagueExists} from '../Firebase/database.js'
import { useEffect, useState } from 'react'
import { AppLoader } from "../loader.js";
import {EloChart, blankChartData} from "./eloChart.js"
import {getRankFromElo} from '../rank-images/rankImages.js';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Firebase/auth.js';
import TextInputAlert from './textInputAlert.js';
import { createChartData, getMostRecentGame, getGamePlayers, getEloHistory, cleanPlayerData} from './playerDataUtils.js';
import GamesLog from '../Game/gamesLog.js';
import { aws_getLeague } from '../Database/league.js';
import { aws_getPlayerGames } from '../Database/game.js';

export default function PlayerBio({setLeagueid, uidPlayerMap}){
    const { leagueid, uid } = useParams();
    setLeagueid(leagueid)

    const [playerName, setPlayerName] = useState()
    const [playerData, setPlayerData] = useState([])
    const [currWins, setCurrWins] = useState(0)
    const [currLosses, setCurrLosses] = useState(0)
    const [currElo, setCurrElo] = useState(0)
    const [chartData, setChartData] = useState(blankChartData)

    const navigate = useNavigate();
    aws_getLeague(leagueid).then((res)=>{
        if (!res){
            navigate("/page/not/found")
        }
    })
    
    useEffect(() => {   

        aws_getPlayerGames(leagueid, uid, 30).then((games) => {
            const data = games['data']['gamesByLeagueIDAndTimestamp']['items']
            setPlayerData(data)
            return data
        }).then((playerData)=>{
            if (playerData.length == 0){
                return
            }
            const justPlayerData = getEloHistory(playerData, uid)

            const mostRecentGame = justPlayerData[0]
            setCurrElo(mostRecentGame.newElo)
            setCurrLosses(mostRecentGame.losses)
            setCurrWins(mostRecentGame.wins)
            const elos = []
            const timestamps = []
            const elogain = []
            const gameWinners = []
            const gameLosers = []
            const pullers = []
            for (let i = justPlayerData.length - 1; i >= 0; i--){
                elos.push(justPlayerData[i].newElo)
                timestamps.push(justPlayerData[i].timestamp)
                elogain.push(justPlayerData[i].newElo - justPlayerData[i].oldElo)
                gameWinners.push([playerData[i]['winner1'], playerData[i]['winner2'], playerData[i]['winner3']])
                gameLosers.push([playerData[i]['loser1'], playerData[i]['loser2'], playerData[i]['loser3']])
                pullers.push(playerData[i].winnerPulled)
            }
        
            const chartData = createChartData(elos, timestamps, elogain, gameWinners, gameLosers, pullers)        
            setChartData(chartData)
            
        })
                
    }, [uid])



    if (!chartData){
        <AppLoader></AppLoader>
    }else{
        return(
            <div class="animatedLoad">
                <h2>
                    {uidPlayerMap[uid]} ({currWins}-{currLosses})  
                    <img title={getRankFromElo(currElo, currWins, currLosses).split("static/media/")[1].split(".")[0]} class="rankImg" src={getRankFromElo(currElo, currWins, currLosses)}/>
                </h2>
                {playerName ? <TextInputAlert leagueid={leagueid} oldname={playerName} /> : null}
                <div>
                    <h3>Elo: {currWins + currLosses >= 10 ? currElo : "Unranked"} </h3>
                    {chartData ? <EloChart chartData={chartData}/> : null}
                </div>
                <br></br>
                <div>
                    <h3>Game History</h3>
                    {playerData ? <GamesLog
                        gamesLog={playerData}
                        playerid={uid}
                        uidPlayerMap={uidPlayerMap} 
                    /> : null}
                </div>
            </div>

        );
    }
}


