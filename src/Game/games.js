import GamesLog from "./gamesLog.js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLoader } from "../loader.js";
import { aws_getLeague } from "../Database/league.js";
import { aws_getLeagueGames } from "../Database/game.js";

export default function Games({setLeagueid, uidPlayerMap}){
    const [currPageGames, setCurrPageGames] = useState([])
    const [nexttoken, setNextToken] = useState(null)
    const [gamesExist, setGamesExist] = useState(true)


    const {leagueid} = useParams()
    const navigate = useNavigate();
    aws_getLeague(leagueid).then((res)=>{
        if (!res){
            navigate("/page/not/found")
        }
        setLeagueid(leagueid)
    })

    function queryGames(){
        if (!gamesExist){
            return
        }
        aws_getLeagueGames(leagueid, 10, nexttoken).then(data => {
            if (data != null){
                const games = data['data']['gamesByLeagueIDAndTimestamp']['items']
                setCurrPageGames(currPageGames.concat(games))        
                const token = data['data']['gamesByLeagueIDAndTimestamp']['nextToken']
                setNextToken(token)    
                
                if (token == null){
                    setGamesExist(false)
                }
            }
        })
    }
    
    useEffect(()=>{
        if (currPageGames.length == 0){
            queryGames()
        }
    })

    if (uidPlayerMap == null){
        return(<AppLoader/>)
    }else{
        return (
            <div>
                <button style={{textAlign:"center"}} class={`scoreReportButton ${gamesExist ? "clickable highlights":""}`} onClick={queryGames}>Load More Data (Current Amount of Games: {currPageGames.length})</button>
                <GamesLog gamesLog={currPageGames} uidPlayerMap={uidPlayerMap} />
            </div>
        )
    }
    
}
