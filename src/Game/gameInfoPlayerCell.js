function PlayerCell({player, setTab, setPlayer}){
    // [playername,playerData.elo, playerData.wins, playerData.losses]
        const goToPlayer = () => {
            setTab('playerbio')
            setPlayer(player[0])
        }
    
        return(
            <td class="clickable highlights" onClick={goToPlayer}>
                <h3>{player[0]} ({player[2]}-{player[3]})</h3>
                <p>elo: {player[1]}</p>
            </td>
        );
    }

export default PlayerCell