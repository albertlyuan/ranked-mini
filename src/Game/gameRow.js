/**
 * game = list of [gameid, ts, winners (list), losers (list)]
 * @param {*} param0 game, setTab, setGame
 * @returns <tr> with gameID, timestamp, winning team, losing team
 */
function GameRow({game, setTab, setGame, eloGain}){
    const formattedDate = () => {
        const date = game[1].split(/\b\d{2}:\d{2}:\d{2}\b/)
        if (date.length < 2){
            return game[1]
        }
        return date[0]
    }
    const goToGame = () => {
        setTab('game')
        setGame(game)
    }
    if (eloGain){
        const deltaElo = () => {
            if (eloGain){
                let idx = 0
                for (idx= 0; idx < eloGain[0].length ; idx++){
                    if (eloGain[0][idx] == game[0]){
                        break
                    }
                }
                const gainloss = eloGain[1][idx]
                return gainloss
            }   
            return 0
        }
        return(
            <tr class={(deltaElo() > 0 ? "elogain " : deltaElo() < 0 ? "eloloss " : "")  + "clickable highlights"} onClick={goToGame}>
                <td>{game[0]} </td>
                <td>{formattedDate()}</td>
                <td>{game[2].join(", ")} </td>
                <td>{game[3].join(", ")} </td>
                <td>{deltaElo() ? deltaElo().toFixed(2) : deltaElo()}</td>
            </tr>
            
        )
    }
    return (
        <tr class={"clickable highlights"} onClick={goToGame}>
            <td>{game[0]}</td>
            <td>{formattedDate()}</td>
            <td>{game[2].join(", ")} </td>
            <td>{game[3].join(", ")} </td>
        </tr>
    )
}

export default GameRow