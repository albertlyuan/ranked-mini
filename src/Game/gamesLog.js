import GameRow from './gameRow.js'
export default function GamesLog({gamesLog, setTab, setGame, eloGain}){

    const gameList = gamesLog.map((game) =>
        <GameRow 
            game={game}
            setTab={setTab} 
            setGame={setGame}
            eloGain={eloGain}
        />
    )

    return(
        <div class="animatedLoad">
            <table class="gamelog">
                <tr style={{textAlign: "left"}}>
                    <th>Game ID</th>
                    <th>Timestamp</th>
                    <th>Winning Team</th>
                    <th>Losing Team</th>
                    {eloGain ? <th>+/- Elo</th> : <></>}
                </tr>
                {gameList}
            </table>
            
        </div>
        
    );
}

