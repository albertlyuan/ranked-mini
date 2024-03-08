import GamesLog from "./gamesLog.js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageSelector } from "./pageSelector.js";
import { AppLoader } from "../loader.js";
import { aws_getLeague } from "../Database/league.js";
import { aws_getLeagueGames } from "../Database/game.js";

export default function Games({setLeagueid, uidPlayerMap}){
    const [currPageGames, setCurrPageGames] = useState([])

    // WIP
    const [loadedPages, setLoadedPages] = useState([])
    const [nexttoken, setNextToken] = useState(null)
    const [pagenum, setPageNum] = useState(0)
    const [maxPagenum, setMaxPagenum] = useState(0)


    const {leagueid} = useParams()
    const navigate = useNavigate();
    aws_getLeague(leagueid).then((res)=>{
        if (!res){
            navigate("/page/not/found")
        }
    })

    useEffect(()=>{
        if (pagenum >= loadedPages.length){
            if (nexttoken == null && loadedPages.length > 0){
                return
            }else{
                aws_getLeagueGames(leagueid, 10, nexttoken).then(data => {
                    if (data != null){
                        setCurrPageGames(data['data']['gamesByLeagueIDAndTimestamp']['items'])        
                        setLoadedPages([...loadedPages, data['data']['gamesByLeagueIDAndTimestamp']['items']])       
                        const token = data['data']['gamesByLeagueIDAndTimestamp']['nextToken']
                        setNextToken(token)
                        if (token){
                            setMaxPagenum(maxPagenum+1)
                        }
                        
                    }
                })
            }
        }else{
            setCurrPageGames(loadedPages[pagenum])
        }
    }, [pagenum])

    if (currPageGames.length == 0){
        return(<AppLoader/>)
    }else{
        return (
            <div>
                <p>loadedpages {loadedPages.length}</p>
                <p>{Object.keys(loadedPages)}</p>
                <PageSelector pageNum={pagenum} setPageNum={setPageNum} maxPagenum={maxPagenum}/>
                <GamesLog gamesLog={currPageGames} uidPlayerMap={uidPlayerMap} />
            </div>
        )
    }
    
}
