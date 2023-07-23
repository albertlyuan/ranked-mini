/**
 * game = list of [gameid, ts, winners (list), losers (list)]
 * @param {*} param0 game, setTab, setGame
 * @returns <tr> with gameID, timestamp, winning team, losing team
 */
function GameRow({game, setTab, setGame}){
    const goToGame = () => {
        setTab('game')
        setGame(game)
    }
    return(
        <tr class="clickable highlights" onClick={goToGame}>
            <td>{game[0]}</td>
            <td>{game[1]}</td>
            <td>{game[2].join(", ")} </td>
            <td>{game[3].join(", ")} </td>
        </tr>
        
    )
}

export default GameRow