import {
    Unranked,
    Bronze1,
    Bronze2,
    Bronze3,
    Silver1,
    Silver2,
    Silver3,
    Gold1,
    Gold2,
    Gold3,
    Platinum1,
    Platinum2,
    Platinum3,
    Diamond1,
    Diamond2,
    Diamond3,
    Champion1,
    Champion2,
    Champion3,
    GrandChampion
} from "../rank-images/rankImages.js"
function getRankFromElo(elo){
    if (elo < 150){
        return Bronze1
    }
    if (elo < 200){
        return Bronze2
    }
    if (elo < 250){
        return Bronze3
    }
    if (elo < 300){
        return Silver1
    }
    if (elo < 350){
        return Silver2
    }
    if (elo < 400){
        return Silver3
    }
    if (elo < 450){
        return Gold1
    }
    if (elo < 500){
        return Gold2
    }
    if (elo < 550){
        return Gold3
    }   
    if (elo < 600){
        return Platinum1
    }
    if (elo < 650){
        return Platinum2
    }
    if (elo < 700){
        return Platinum3
    }
    if (elo < 750){
        return Diamond1
    }
    if (elo < 800){
        return Diamond2
    }
    if (elo < 850){
        return Diamond3
    }
    if (elo < 900){
        return Champion1
    }
    if (elo < 950){
        return Champion2
    }
    if (elo < 1000){
        return Champion3
    }
    return GrandChampion

}

function PlayerRow({name, elo, setTab, setPlayer, wins, losses}){
    const rank = () => {
        if (wins + losses < 10){
            return Unranked
        }
        else{
            return getRankFromElo(elo)
        }   
    }
    const goToPlayer = () => {
        setTab('playerbio')
        setPlayer(name)
    }

    return(
    <tr class="clickable highlights" onClick={goToPlayer}>
        <td style={{paddingRight: "50px"}}>
            <p>{name} ({wins}-{losses})</p>
            
        </td>
        <td style={{textAlign: "right"}}><p> <img class="rankImg" src={rank()}/>{elo}</p></td>
    </tr>
    );
}

export default PlayerRow