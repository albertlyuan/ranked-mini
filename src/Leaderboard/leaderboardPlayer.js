import {getRankFromElo}  from "../rank-images/rankImages.js" 

function PlayerRow({name, elo, setTab, setPlayer, wins, losses}){
    
    const goToPlayer = () => {
        setTab('playerbio')
        setPlayer(name)
    }

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