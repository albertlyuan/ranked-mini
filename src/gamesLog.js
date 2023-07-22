export default function GamesLog({gamesLog, setTab, setGame}){

    const gameList = gamesLog.map((game) =>
        <GameRow 
            game={game}
            setTab={setTab} 
            setGame={setGame}
        />
    )

    return(
        <div class="animatedLoad">
            <table>
                <tr>
                    <th>Game ID</th>
                    <th>Timestamp</th>
                    <th>Winning Team</th>
                    <th>Losing Team</th>
                </tr>
                {gameList}
            </table>
            
        </div>
        
    );
}

function GameRow({game, setTab, setGame}){
    const goToGame = () => {
        setTab('game')
        setGame(game)
    }
    return(
        <tr class="gameRow" onClick={goToGame}>
            <td>{game[0]}</td>
            <td>{game[1]}</td>
            <td>{game[2].join(", ")} </td>
            <td>{game[3].join(", ")} </td>
        </tr>
        
    )
}