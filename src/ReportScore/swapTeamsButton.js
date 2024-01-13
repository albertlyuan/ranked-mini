
export default function SwapTeamsButton({players, setPlayers}){
    function swapTeams() {
        const tempWinners = [players["winner1"],players["winner2"],players["winner3"]]
        setPlayers({
            winner1: players["loser1"],
            winner2: players["loser2"],
            winner3: players["loser3"],
            loser1:tempWinners[0],
            loser2:tempWinners[1],
            loser3:tempWinners[2],
        })
    }

    return (
        <button
            className="reportscoreTeamButtons clickable highlights"
            onClick={swapTeams}>
            Swap Teams
        </button>    
    )
}