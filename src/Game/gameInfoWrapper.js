import { AppLoader } from "../loader.js";
import { useParams ,useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react'
import GameInfo from "./gameInfo.js";
import { aws_getLeague } from "../Database/league.js";
import { aws_getGame } from "../Database/game.js";

// [gameid, date string, winners, losers, broke to win]
export default function GameInfoWrapper({setLeagueid}){
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
                setGame(g)
            }
        })

        // getGame(leagueid, `${parseInt(gameid)+1}`).then((g)=>{
        //     if (g[0] == parseInt(gameid)+1){
        //         setNextgame(g)
        //     }else{
        //         setNextgame(null)
        //     }
            
        // })
    }, [game])
    const goToPrevGame = () => {
        navigate(`/${leagueid}/games/${parseInt(gameid)-1}`);
    };
    const goToNextGame = () => {
        navigate(`/${leagueid}/games/${parseInt(gameid)+1}`);
    };
    
    if (game!=null){
        return(
            <GameInfo 
                game={game} 
                goToNextGame={goToNextGame} 
                goToPrevGame={goToPrevGame} 
                nextgame={nextgame}
                />
        );
    }else{
        return (
            <AppLoader />
        )
    }
}



