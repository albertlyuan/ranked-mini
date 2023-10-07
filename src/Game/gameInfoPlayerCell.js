import {getRankFromElo} from "../rank-images/rankImages.js";
import {useNavigate  } from "react-router-dom"
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Firebase/auth.js';
import { getUIDFromName } from "../Firebase/database.js";
import { calculateNewElo } from "../Elo/elo.js";

function PlayerCell({player, alternateResult, winningTeamElo, losingTeamElo, win, breakToWin}){
    const [loggedin, setLoggedin] = useState(false);
    const [uid, setUid] = useState();

    //player = [name,[before.elo, after.elo], before.wins, before.losses]
    const [name, set_name] = useState("");
    const [before_elo, set_before_elo] = useState(0);
    const [after_elo, set_after_elo] = useState(0);
    const [wins, set_wins] = useState(0);
    const [losses, set_losses] = useState(0);

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedin(true)
        }else{
          setLoggedin(false)
        }
      })
      
      getUIDFromName(player[0]).then((id)=>{
        setUid(id)
      })
      if (alternateResult){
        set_name(player[0])
        set_before_elo(player[1][0])
        
        set_wins(player[2])
        set_losses(player[3])
        const hypotheticalNewElo = calculateNewElo(before_elo, winningTeamElo, losingTeamElo, !win, wins+losses, !breakToWin)
        set_after_elo(hypotheticalNewElo)
      }else{
        set_name(player[0])
        set_before_elo(player[1][0])
        set_after_elo(player[1][1])
        set_wins(player[2])
        set_losses(player[3])
      }
      
    }, [player, alternateResult])
    const navigate = useNavigate();
    const goToPlayer = () => {
        navigate(`/player/${uid}`);
    };

    return(
        <td class="clickable highlights" onClick={goToPlayer}>
            <h3>{name} ({wins}-{losses}) <img title={getRankFromElo(before_elo, wins, losses).split("static/media/")[1].split(".")[0]} class="rankImg" src={getRankFromElo(before_elo, wins, losses)}/></h3>
            {wins + losses >= 10 || loggedin ? <p>elo: {before_elo.toFixed(2)} ({after_elo-before_elo > 0 ? "+" : ""}{(after_elo-before_elo).toFixed(2)})</p> : null}
        </td>
    );
}

export default PlayerCell