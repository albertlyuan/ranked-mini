import {getRankFromElo}  from "../rank-images/rankImages.js" 
import { useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Firebase/auth.js';
import { useEffect, useState } from 'react'
import { getUIDFromName } from "../Firebase/database.js";


function PlayerRow({name, elo, wins, losses, filter}){
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
    getUIDFromName(name).then((id)=>{
      setUid(id)
    })
   

  })
    const navigate = useNavigate();

    const goToPlayer = () => {
      navigate(`/player/${uid}`);
    };

    return(
        <tr class="clickable highlights" onClick={goToPlayer} style={{display: name.toLowerCase().indexOf(filter) > -1 ? "table-row" : "none"}}>
            <td style={{paddingRight: "50px"}}>
              <p>{name} ({wins}-{losses})</p>
            </td>
            <td style={{textAlign: "right"}}>
              <p> 
                {loggedin || (wins+losses >= 10)? elo.toFixed(2) : ""}
                <img title={getRankFromElo(elo, wins,losses).split("static/media/")[1].split(".")[0]} class="rankImg" src={getRankFromElo(elo, wins,losses)}/>
              </p>
            </td>
        </tr>
   );
}

export default PlayerRow