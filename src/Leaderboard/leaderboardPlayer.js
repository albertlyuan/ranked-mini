import {getRankFromElo}  from "../rank-images/rankImages.js" 
import { useNavigate } from "react-router-dom"

function PlayerRow({name, elo, wins, losses}){
    const navigate = useNavigate();

    const goToPlayer = () => {
      navigate(`/player/${name}`);
    };

    return(
        <tr class="clickable highlights" onClick={goToPlayer}>
            <td style={{paddingRight: "50px"}}>
            <p>{name} ({wins}-{losses})</p>
            </td>
            <td style={{textAlign: "right"}}><p> <img title={getRankFromElo(elo, wins,losses).split("static/media/")[1].split(".")[0]} class="rankImg" src={getRankFromElo(elo, wins,losses)}/>{elo}</p></td>
        </tr>
   );
}

export default PlayerRow