import GamesLog from "./gamesLog.js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { leagueExists, getMostRecentGamesLog, getGame } from "../Firebase/database.js";
import { PageSelector } from "./pageSelector.js";
import { AppLoader } from "../loader.js";

export default function Games({setLeagueid}){
    const [currPage, setCurrPage] = useState([])
    const [nextPageExists, setNextPageExists] = useState(false)

    const [pagenum, setPageNum] = useState(0)

    const {leagueid} = useParams()
    const navigate = useNavigate();

    leagueExists(leagueid).then((res)=>{
        if (!res){
            setLeagueid(null)
            navigate("/page/not/found")
        }
    })

    useEffect(()=>{
        getMostRecentGamesLog(leagueid,pagenum).then(log => {
            setCurrPage(log)
            if (log.length > 0){
                const nextGameId = log[log.length-1][0] + 1

                getGame(leagueid, nextGameId).then(game =>{
                    if (game.length != 0){
                        setNextPageExists(true)
                    }else{
                        setNextPageExists(false)
                    }
                })
            }
        })
    }, [pagenum])

    if (currPage.length == 0){
        return(<AppLoader/>)
    }else{
        return (
            <div>
                <GamesLog gamesLog={currPage} setLeagueid={setLeagueid}/>
                <PageSelector pageNum={pagenum} setPageNum={setPageNum} nextPageExists={nextPageExists}/>
            </div>
        )
    }
    
}
