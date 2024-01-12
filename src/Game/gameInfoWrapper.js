import { AppLoader } from "../loader.js";
import { useParams ,useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react'
import { getGame, leagueExists, queryGamePlayersData } from "../Firebase/database.js";
import GameInfo from "./gameInfo.js";

// [gameid, date string, winners, losers, broke to win]
export default function GameInfoWrapper({setLeagueid}){
    //data = [player,[before.elo, after.elo], before.wins, before.losses]
    const { gameid, leagueid } = useParams();
    const [game, setGame] = useState();
    const [nextgame, setNextgame] = useState();
    const [winnerData, setWinnerData] = useState([]);
    const [loserData, setLoserData] = useState([]);
    const [breakToWin, setBreakToWin] = useState(false);

    const navigate = useNavigate();
    leagueExists(leagueid).then((res)=>{
        if (!res){
            setLeagueid(null)
            navigate("/page/not/found")
        }
    })

    useEffect(() => {
        setLeagueid(leagueid)
        getGame(leagueid, gameid).then((g)=>{
            if (g){
                setGame(g)
                const winners = g[2]
                const losers = g[3]
                setBreakToWin(g[4])
                queryGamePlayersData(leagueid, winners, gameid).then(data => {
                    data.sort((a,b) => b[1][0]-a[1][0])
                    setWinnerData(data)
                })
            
                queryGamePlayersData(leagueid, losers, gameid).then(data => {
                    data.sort((a,b) => b[1][0]-a[1][0])
                    setLoserData(data)  
                })
            }
        })

        getGame(leagueid, `${parseInt(gameid)+1}`).then((g)=>{
            if (g[0] == parseInt(gameid)+1){
                setNextgame(g)
            }else{
                setNextgame(null)
            }
            
        })
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
                winnerData={winnerData}
                loserData={loserData}
                breakToWin={breakToWin}
                />
        );
    }else{
        return (
            <AppLoader />
        )
    }
}



