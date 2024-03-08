import { calculateTeamElo, calculateNewElo } from "../Elo/elo.js";
import {useState, useEffect} from 'react'
import { MonthDateYear } from "../Elo/dateutils.js";
import {getRankFromElo, getRankTitleFromElo} from "../rank-images/rankImages.js";
import {useNavigate, useParams  } from "react-router-dom"
import { AppLoader } from "../loader.js";

// [gameid, date string, winners, losers, broke to win]
export default function GameInfo({game, uidPlayerMap, goToNextGame, goToPrevGame, nextgame}){
    
    const [hypothetical, setHypothetical] = useState(false);  
    if (game == null){
        return(<AppLoader />)
    }
    const winners = [uidPlayerMap[game['winner1']],uidPlayerMap[game['winner2']],uidPlayerMap[game['winner3']]]
    const losers = [uidPlayerMap[game['loser1']],uidPlayerMap[game['loser2']],uidPlayerMap[game['loser3']]]
    const breakToWin = game['winnerPulled']
    const loserData = [JSON.parse(game['loser1data']),JSON.parse(game['loser2data']),JSON.parse(game['loser3data'])]
    const winnerData = [JSON.parse(game['winner1data']),JSON.parse(game['winner2data']),JSON.parse(game['winner3data'])]
    const pullFactor = game['pullfactor']
    const toggleHypothetical = () => {
        setHypothetical(!hypothetical)
    }
    
    return(
        <div>
            <div class="horizontal">
                {/* <a class="clickable highlights arrowbutton" data-testid="prevGameButton" style={{display: game[0] > 0 ? "block" : "none"}} onClick={goToPrevGame}>
                    &lt;
                </a> */}
                <div class="date">
                    <h3 id="DayOfWeek">Game ID: {game['id']}</h3>
                    <p id="FullDate">{MonthDateYear(game['timestamp'])}</p>
                </div> 
                {/* <a class="clickable highlights arrowbutton" data-testid="nextGameButton" style={{display: nextgame!=null ? "block" : "none"}} onClick={goToNextGame}>
                    &gt;
                </a> */}
            </div>
            <button style={{textAlign:"center"}} class="scoreReportButton clickable highlights" onClick={toggleHypothetical}>Flip Result (Currently: {hypothetical ? "Alternate": "Normal"})</button>
            {hypothetical 
                ? <h3 style={{textAlign:"center"}}>Broke to win: {breakToWin  ? "False" : "True"}</h3>
                : <h3 style={{textAlign:"center"}}>Broke to win: {breakToWin  ? "True" : "False"}</h3>
            }
            <h3 style={{textAlign:"center"}} >Pull Factor: {pullFactor.toFixed(2)}</h3>

            <Teams gameID={game['id']} winners={winners} losers={losers} winnerData={winnerData} loserData={loserData} alternateResult={hypothetical} breakToWin={breakToWin}/>
        </div>        
    );
}

function Teams({gameID, winners, losers, winnerData, loserData, alternateResult, breakToWin}){
    const [winnerTeamElo, setWinnerTeamElo] = useState(0);
    const [loserTeamElo, setLoserTeamElo] = useState(0);
    const [rows, setRows] = useState();

    useEffect(() => {
        if (loserData==null || winnerData==null){
            return
        }
        // data = [player,[before.elo, after.elo], before.wins, before.losses]
        if(loserData.length > 0){
            setLoserTeamElo(calculateTeamElo(loserData.map(i => ({elo: i['oldElo']}))).toFixed(2))
        }
        if(winnerData.length > 0){
            setWinnerTeamElo(calculateTeamElo(winnerData.map(i => ({elo: i['oldElo']}))).toFixed(2))
        }

        const players = loserData.map((_,index) => 
            <tr>
                <PlayerCell playeruid={winners[index]} playerdata={winnerData[index]} alternateResult={alternateResult} winningTeamElo={winnerTeamElo} losingTeamElo={loserTeamElo} win={true} breakToWin={breakToWin}/>
                <PlayerCell playeruid={losers[index]} playerdata={loserData[index]} alternateResult={alternateResult} winningTeamElo={winnerTeamElo} losingTeamElo={loserTeamElo} win={false} breakToWin={breakToWin}/>
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

function PlayerCell({playeruid, playerdata, alternateResult, winningTeamElo, losingTeamElo, win, breakToWin}){
    const {leagueid} = useParams()
    //player = [name,[before.elo, after.elo], before.wins, before.losses]
    const [before_elo, set_before_elo] = useState(0);
    const [after_elo, set_after_elo] = useState(0);
    const [wins, set_wins] = useState(0);
    const [losses, set_losses] = useState(0);
    const [rank, setRank] = useState(getRankFromElo(0,0,0));
    const [rankTitle, setRankTitle] = useState(getRankTitleFromElo(0,0,0));

    useEffect(() => {

      if (alternateResult){
        set_before_elo(playerdata['oldElo'])
        
        set_wins(playerdata['wins'])
        set_losses(playerdata['losses'])
        const hypotheticalNewElo = calculateNewElo(before_elo, losingTeamElo, winningTeamElo, !win, wins+losses, !breakToWin)
        set_after_elo(hypotheticalNewElo)
      }else{
        set_before_elo(playerdata['oldElo'])
        set_after_elo(playerdata['newElo'])
        set_wins(playerdata['wins'])
        set_losses(playerdata['losses'])
      }
      setRank(getRankFromElo(before_elo, wins, losses))
      setRankTitle(getRankTitleFromElo(before_elo, wins, losses))

    }, [playeruid, alternateResult])
    const navigate = useNavigate();
    const goToPlayer = () => {
        navigate(`/${leagueid}/player/${playeruid}`);
    };

    return(
        <td class="clickable highlights" onClick={goToPlayer}>
            <h3>{playeruid} ({wins}-{losses}) <img src={rank} class="rankImg" title={rankTitle}/></h3>
            {wins + losses >= 10 ? <p>elo: {before_elo.toFixed(2)} ({after_elo-before_elo > 0 ? "+" : ""}{(after_elo-before_elo).toFixed(2)})</p> : null}
        </td>
    );
}

