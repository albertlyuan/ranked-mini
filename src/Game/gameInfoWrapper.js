import { useParams ,useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react'
import GameInfo from "./gameInfo.js";
import { aws_getLeague } from "../Database/league.js";
import { aws_getGame } from "../Database/game.js";

// [gameid, date string, winners, losers, broke to win]
export default function GameInfoWrapper({setLeagueid, uidPlayerMap}){
    //data = [player,[before.elo, after.elo], before.wins, before.losses]
    const { gameid, leagueid } = useParams();
    const [game, setGame] = useState();
    const [nextgame, setNextgame] = useState();
    setLeagueid(leagueid)

    const navigate = useNavigate();
    aws_getLeague(leagueid).then((res)=>{
        if (!res){
            navigate("/page/not/found")
        }
    })

    useEffect(() => {
        aws_getGame(gameid).then((g)=>{
            if (g){
                setGame(g['data']['getGame'])
            }
        })
    }, [game])
    const goToPrevGame = () => {
        navigate(`/${leagueid}/games/${parseInt(gameid)-1}`);
    };
    const goToNextGame = () => {
        navigate(`/${leagueid}/games/${parseInt(gameid)+1}`);
    };
    
    return(
        <GameInfo 
            game={game} 
            uidPlayerMap={uidPlayerMap} 
            goToNextGame={goToNextGame} 
            goToPrevGame={goToPrevGame} 
            nextgame={nextgame}
            />
    )
}



