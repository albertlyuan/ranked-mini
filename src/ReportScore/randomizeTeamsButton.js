
export default function RandomizeTeamsButton({players, setPlayers}){
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