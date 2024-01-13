import { PULL_FACTOR } from "../Elo/elo.js"

export function PullFactorSetter({dynamicPullFactor, toggleDynamicPullFactor}){

    function toggle(){
        toggleDynamicPullFactor(!dynamicPullFactor)
    }

    return (
        <table>
            <tbody>
            <tr style={{textAlign: "center"}}>
                {/* elogain just to get green color */}
                <td className={(dynamicPullFactor===true ? "elogain" : "") + " clickable highlights"} onClick={toggle} >
                    <a >
                        Use Dynamic Pull Factor 
                    </a>
                </td>
                <td className={(dynamicPullFactor===false ? "elogain" : "") + " clickable highlights"} onClick={toggle}>
                    <a>
                        Use Default Pull Factor ({PULL_FACTOR})
                    </a>
                </td>
            </tr>
            </tbody>
        </table>
    )
}

export function PullSelector({setDidSetPuller, winnerPulled, setWinnerPulled}){

    function clickWinner(){
        setWinnerPulled(true)
        setDidSetPuller(true)
    }

    function clickLoser(){
        setWinnerPulled(false)
        setDidSetPuller(true)
    }

    return (
        <table >
            <tbody>
            <tr style={{textAlign: "center"}}>
                {/* elogain just to get green color */}
                <td className={(winnerPulled===true ? "elogain" : "") + " clickable highlights"} onClick={clickWinner} data-testid="winpuller">
                    <a >
                        Pulled
                    </a>
                </td>
                <td className={(winnerPulled===false ? "elogain" : "") + " clickable highlights"} onClick={clickLoser} data-testid="losepuller">
                    <a>
                        Pulled
                    </a>
                </td>
            </tr>
            </tbody>
        </table>
    )
}

export function RandomizeTeamsButton({players, setPlayers}){
    function randomizeTeams() {
        const temp = fisherYatesShuffle([...Object.values(players)])
        setPlayers({
            winner1: temp[0],
            winner2: temp[1],
            winner3: temp[2],
            loser1: temp[3],
            loser2: temp[4],
            loser3: temp[5],
        })
    }

    function fisherYatesShuffle(arr){
        let currentIndex = arr.length,  randomIndex;
        
        // While there remain elements to shuffle.
        while (currentIndex > 0) {
        
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
        
            // And swap it with the current element.
            [arr[currentIndex], arr[randomIndex]] = [
            arr[randomIndex], arr[currentIndex]];
        }
        return arr;
    }


    return (
        <button
            className="reportscoreTeamButtons clickable highlights"
            onClick={randomizeTeams}>
            Randomize Teams
        </button>    
    )
}

export function SwapTeamsButton({players, setPlayers}){
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
            data-testid="swapButton" 
            className="reportscoreTeamButtons clickable highlights"
            onClick={swapTeams}>
            Swap Teams
        </button>    
    )
}
