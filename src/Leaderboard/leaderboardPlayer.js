function PlayerRow({name, elo, setTab, setPlayer, wins, losses}){

    const goToPlayer = () => {
        setTab('playerbio')
        setPlayer(name)
    }

    return(
    <tr class="clickable highlights" onClick={goToPlayer}>
        <td>{name} ({wins}-{losses})</td>
        <td style={{textAlign: "right"}}>{elo} </td>
    </tr>
    );
}

export default PlayerRow