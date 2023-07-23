import GameRow from './gameRow.js'
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

