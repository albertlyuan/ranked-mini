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
import { PageSelector } from '../Game/pageSelector.js';

export default function PlayerBio({setLeagueid, uidPlayerMap}){
    const { leagueid, uid } = useParams();
    setLeagueid(leagueid)

    const [playerName, setPlayerName] = useState()
    const [currWins, setCurrWins] = useState(null)
    const [currLosses, setCurrLosses] = useState(null)
    const [currElo, setCurrElo] = useState(null)

    const [loadedPages, setLoadedPages] = useState([])
    const [nexttoken, setNextToken] = useState(null)
    const [pagenum, setPageNum] = useState(0)
    const [maxPagenum, setMaxPagenum] = useState(0)

    const [currPlayerData, setCurrPlayerData] = useState([])
    const [chartData, setChartData] = useState(blankChartData)

    const navigate = useNavigate();
    aws_getLeague(leagueid).then((res)=>{
        if (!res){
            navigate("/page/not/found")
        }
    })
    
    useEffect(() => {   
        if (pagenum >= loadedPages.length){
            if (nexttoken == null && loadedPages.length > 0){
                return
            }else{
                aws_getPlayerGames(leagueid, uid, 10, nexttoken).then((data) => {
                    if (data != null){
                        const games = data['data']['gamesByLeagueIDAndTimestamp']['items']
                        setCurrPlayerData(games)
                        setLoadedPages([...loadedPages, games])
                        const token = data['data']['gamesByLeagueIDAndTimestamp']['nextToken']
                        setNextToken(token)
                        if (token){
                            setMaxPagenum(maxPagenum+1)
                        }

                        const [chartdata, mostRecentGame] = createChartData(games, uid)
                        if (currElo==null){
                            setCurrElo(mostRecentGame.newElo)
                            setCurrLosses(mostRecentGame.losses)
                            setCurrWins(mostRecentGame.wins)
                        }
                        setChartData(chartdata)
                    }
                })
            }
        }else{
            setCurrPlayerData(loadedPages[pagenum], uid)
            const [chartdata, mostRecentGame] = createChartData(loadedPages[pagenum], uid)
            setChartData(chartdata)
        }

    }, [uid, pagenum])



    if (!chartData || uidPlayerMap == null){
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
                    <PageSelector pageNum={pagenum} setPageNum={setPageNum} maxPagenum={maxPagenum}/>
                    {currPlayerData ? <GamesLog
                        gamesLog={currPlayerData}
                        playerid={uid}
                        uidPlayerMap={uidPlayerMap} 
                    /> : null}
                </div>
            </div>

        );
    }
}


