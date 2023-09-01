import {getRankFromElo} from "../rank-images/rankImages.js";
import {useNavigate  } from "react-router-dom"
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Firebase/auth.js';
import { getUIDFromName } from "../Firebase/database.js";

function PlayerCell({player}){
    const [loggedin, setLoggedin] = useState(false);
    const [uid, setUid] = useState();

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
    })
    //player = [name,[before.elo, after.elo], before.wins, before.losses]
    const navigate = useNavigate();
    const goToPlayer = () => {
        navigate(`/player/${uid}`);
    };

    return(
        <td class="clickable highlights" onClick={goToPlayer}>
            <h3>{player[0]} ({player[2]}-{player[3]}) <img title={getRankFromElo(player[1][0], player[2], player[3]).split("static/media/")[1].split(".")[0]} class="rankImg" src={getRankFromElo(player[1][0], player[2], player[3])}/></h3>
            {player[2] + player[3] >= 10 || loggedin ? <p>elo: {player[1][0].toFixed(2)} ({player[1][1]-player[1][0] > 0 ? "+" : ""}{(player[1][1]-player[1][0]).toFixed(2)})</p> : null}
        </td>
    );
}

export default PlayerCell