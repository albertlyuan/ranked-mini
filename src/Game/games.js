import GamesLog from "./gamesLog.js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageSelector } from "./pageSelector.js";
import { AppLoader } from "../loader.js";
import { aws_getLeague } from "../Database/league.js";
import { aws_getLeagueGames } from "../Database/game.js";

export default function Games({setLeagueid}){
    const [currPageGames, setCurrPageGames] = useState([])

    // WIP
    const [nextPageExists, setNextPageExists] = useState(false)
    const [pagenum, setPageNum] = useState(0)

    const {leagueid} = useParams()
    const navigate = useNavigate();
    aws_getLeague(leagueid).then((res)=>{
        if (!res){
            navigate("/page/not/found")
        }
    })

    useEffect(()=>{
        aws_getLeagueGames(leagueid, 10).then(log => {
            if (log['data'] != null){
                setCurrPageGames(log['data']['gamesByLeagueIDAndTimestamp']['items'])
            }
        })
    }, [pagenum])

    if (currPageGames.length == 0){
        return(<AppLoader/>)
    }else{
        return (
            <div>
                <PageSelector pageNum={pagenum} setPageNum={setPageNum} nextPageExists={nextPageExists}/>
                <GamesLog gamesLog={currPageGames}/>
            </div>
        )
    }
    
}
