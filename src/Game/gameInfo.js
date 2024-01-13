import { calculateTeamElo, calculateNewElo } from "../Elo/elo.js";
import {useState, useEffect} from 'react'
import { MonthDateYear } from "../Elo/dateutils.js";
import {getRankFromElo, getRankTitleFromElo} from "../rank-images/rankImages.js";
import {useNavigate, useParams  } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Firebase/auth.js';
import { getUIDFromName } from "../Firebase/database.js";

// [gameid, date string, winners, losers, broke to win]
export default function GameInfo({game, goToNextGame, goToPrevGame, nextgame, winnerData, loserData, breakToWin}){
    //data = [player,[before.elo, after.elo], before.wins, before.losses]
    const [hypothetical, setHypothetical] = useState(false);  

    const toggleHypothetical = () => {
        setHypothetical(!hypothetical)
    }
    
    return(
        <div>
            <div class="horizontal">
                <a class="clickable highlights arrowbutton" data-testid="prevGameButton" style={{display: game[0] > 0 ? "block" : "none"}} onClick={goToPrevGame}>
                    &lt;
                </a>
                <div class="date">
                    <h3 id="DayOfWeek">Game ID: {game[0]}</h3>
                    <p id="FullDate">{MonthDateYear(game[1])}</p>
                </div> 
                <a class="clickable highlights arrowbutton" data-testid="nextGameButton" style={{display: nextgame!=null ? "block" : "none"}} onClick={goToNextGame}>
                    &gt;
                </a>
            </div>
            <button style={{textAlign:"center"}} class="scoreReportButton clickable highlights" onClick={toggleHypothetical}>Flip Result (Currently: {hypothetical ? "Alternate": "Normal"})</button>
            <br></br>
            {hypothetical 
                ? <h3 style={{textAlign:"center"}}>Broke to win: {breakToWin  ? "False" : "True"}</h3>
                : <h3 style={{textAlign:"center"}}>Broke to win: {breakToWin  ? "True" : "False"}</h3>
            }
            {game 
                ?<Teams gameID={game[0]} winnerData={winnerData} loserData={loserData} alternateResult={hypothetical} breakToWin={breakToWin}/>        
                : null
            }
        </div>        
    );
}

function Teams({gameID, winnerData, loserData, alternateResult, breakToWin}){
    const [winnerTeamElo, setWinnerTeamElo] = useState(0);
    const [loserTeamElo, setLoserTeamElo] = useState(0);
    const [rows, setRows] = useState();

    useEffect(() => {
        if (loserData==null || winnerData==null){
            return
        }
        //data = [player,[before.elo, after.elo], before.wins, before.losses]
        if(loserData.length > 0){
            setLoserTeamElo(calculateTeamElo(loserData.map(i => ({elo: i[1][0]}))).toFixed(2))
        }
        if(winnerData.length > 0){
            setWinnerTeamElo(calculateTeamElo(winnerData.map(i => ({elo: i[1][0]}))).toFixed(2))
        }

        const players = loserData.map((_,index) => 
            <tr>
                <PlayerCell player={winnerData[index]} alternateResult={alternateResult} winningTeamElo={winnerTeamElo} losingTeamElo={loserTeamElo} win={true} breakToWin={breakToWin}/>
                <PlayerCell player={loserData[index]} alternateResult={alternateResult} winningTeamElo={winnerTeamElo} losingTeamElo={loserTeamElo} win={false} breakToWin={breakToWin}/>
            </tr>
        ); 
        setRows(players)
    }, [gameID, winnerData, loserData, alternateResult])

    

    return (
        <table class="animatedLoad">
            <tr>
                <th>{!alternateResult ? "Winning Team" : "Losing Team"} {"("+winnerTeamElo+")"}</th>
                <th>{!alternateResult ? "Losing Team" : "Winning Team"} { "("+loserTeamElo+")"} </th>
            </tr>
            {rows}
        </table>
        
    )
}

function PlayerCell({player, alternateResult, winningTeamElo, losingTeamElo, win, breakToWin}){
    const [loggedin, setLoggedin] = useState(false);
    const [uid, setUid] = useState();
    const {leagueid} = useParams()
    //player = [name,[before.elo, after.elo], before.wins, before.losses]
    const [name, set_name] = useState("");
    const [before_elo, set_before_elo] = useState(0);
    const [after_elo, set_after_elo] = useState(0);
    const [wins, set_wins] = useState(0);
    const [losses, set_losses] = useState(0);
    const [rank, setRank] = useState(getRankFromElo(0,0,0));
    const [rankTitle, setRankTitle] = useState(getRankTitleFromElo(0,0,0));

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedin(true)
        }else{
          setLoggedin(false)
        }
      })
      
      getUIDFromName(leagueid, player[0]).then((id)=>{
        setUid(id)
      })
      if (alternateResult){
        set_name(player[0])
        set_before_elo(player[1][0])
        
        set_wins(player[2][0])
        set_losses(player[2][1])
        const hypotheticalNewElo = calculateNewElo(before_elo, winningTeamElo, losingTeamElo, !win, wins+losses, !breakToWin)
        set_after_elo(hypotheticalNewElo)
      }else{
        set_name(player[0])
        set_before_elo(player[1][0])
        set_after_elo(player[1][1])
        set_wins(player[2][0])
        set_losses(player[2][1])
      }
      setRank(getRankFromElo(before_elo, wins, losses))
      setRankTitle(getRankTitleFromElo(before_elo, wins, losses))

    }, [player, alternateResult])
    const navigate = useNavigate();
    const goToPlayer = () => {
        navigate(`/${leagueid}/player/${uid}`);
    };

    return(
        <td class="clickable highlights" onClick={goToPlayer}>
            <h3>{name} ({wins}-{losses}) <img src={rank} class="rankImg" title={rankTitle}/></h3>
            {wins + losses >= 10 || loggedin ? <p>elo: {before_elo.toFixed(2)} ({after_elo-before_elo > 0 ? "+" : ""}{(after_elo-before_elo).toFixed(2)})</p> : null}
        </td>
    );
}

