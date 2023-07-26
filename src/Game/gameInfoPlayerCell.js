import {getRankFromElo} from "../rank-images/rankImages.js";

function PlayerCell({player, setTab, setPlayer}){
        //player = [name,[before.elo, after.elo], before.wins, before.losses]
        const goToPlayer = () => {
            setTab('playerbio')
            setPlayer(player[0])
        }
    
        return(
            <td class="clickable highlights" onClick={goToPlayer}>
                <h3>{player[0]} ({player[2]}-{player[3]}) <img title={getRankFromElo(player[1][0], player[2], player[3]).split("static/media/")[1].split(".")[0]} class="rankImg" src={getRankFromElo(player[1][0], player[2], player[3])}/></h3>
                <p>elo: {player[1][0]} {player[1][1]-player[1][0] > 0 ? "+" : ""}{player[1][1]-player[1][0]}</p>
            </td>
        );
    }

export default PlayerCell