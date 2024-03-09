import { useEffect, useState } from 'react'
import { AppLoader } from "../loader.js";
import {EloChart, blankChartData} from "./eloChart.js"
import {getRankFromElo} from '../rank-images/rankImages.js';
import { useNavigate, useParams } from 'react-router-dom';
import TextInputAlert from './textInputAlert.js';
import { createChartData} from './playerDataUtils.js';
import GamesLog from '../Game/gamesLog.js';
import { aws_getLeague } from '../Database/league.js';
import { aws_getPlayerGames } from '../Database/game.js';

export default function PlayerBio({setLeagueid, uidPlayerMap}){
    const { leagueid, uid } = useParams();

    const [playerName, setPlayerName] = useState()
    const [currWins, setCurrWins] = useState(null)
    const [currLosses, setCurrLosses] = useState(null)
    const [currElo, setCurrElo] = useState(null)

    const [nexttoken, setNextToken] = useState(null)
    const [currPlayerData, setCurrPlayerData] = useState([])
    const [chartData, setChartData] = useState(blankChartData)
    const [gamesExist, setGamesExist] = useState(true)

    const navigate = useNavigate();
    aws_getLeague(leagueid).then((res)=>{
        if (!res){
            navigate("/page/not/found")
        }
        setLeagueid(leagueid)
    })

    async function queryGames(){
        if (!gamesExist){
            return
        }
        const data = await aws_getPlayerGames(leagueid, uid, 50, nexttoken)
        if (data == null){
            // error catching: revert to initial states
            setCurrPlayerData([])
            setChartData(blankChartData)
            setNextToken(null)
            setCurrElo(null)
            return
        }

        const games = data['data']['gamesByLeagueIDAndTimestamp']['items']
        const token = data['data']['gamesByLeagueIDAndTimestamp']['nextToken']

        setNextToken(token)  
        
        // make sure games isn't empty list
        // update loaded pages
        setCurrPlayerData(currPlayerData.concat(games))
    }
    
    useEffect(() => {   
        queryGames()     
    }, [uid])

    useEffect(()=>{
        if (currPlayerData.length > 0){
            // create chart data
            const [chartdata, mostRecentGame] = createChartData(currPlayerData, uid, uidPlayerMap)
            if (currElo==null){
                setCurrElo(mostRecentGame.newElo)
                setCurrLosses(mostRecentGame.losses)
                setCurrWins(mostRecentGame.wins)
            }
            setChartData(chartdata)
            if (nexttoken==null){
                setGamesExist(false)
            }
        }
    },[currPlayerData])



    if (uidPlayerMap == null || currPlayerData == null){
        return(<AppLoader/>)
    }else{
        return(
            <div class="animatedLoad">
                <p>here {gamesExist ? "true": "false"}</p>
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
                    <button style={{textAlign:"center"}} class={`scoreReportButton ${gamesExist ? "clickable highlights":""}`} onClick={queryGames}>Load More Data (Current Amount of Games: {currPlayerData.length})</button>
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


