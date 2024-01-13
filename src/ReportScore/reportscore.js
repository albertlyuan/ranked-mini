import { useState, useEffect } from 'react';
import { firebase_logNewGame } from '../Firebase/database.js'
import Dropdown from "./dropdown.js"
import PullSelector from './pullSelector.js';
import PullFactorSetter from './pullFactorSetter.js';
import { useParams } from 'react-router-dom';
import RandomizeTeamsButton from './randomizeTeamsButton.js';

export default function ReportScore({ roster, updater, setLeagueid }) {
    const [availablePlayers, setAvailablePlayers] = useState(new Set());
    const { leagueid } = useParams()
    const [players, setPlayers] = useState({winner1: "", winner2: "",winner3:"",loser1:"",loser2:"",loser3:""})

    const [didSelectPlayers, setDidSelectPlayers] = useState(false);

    const [winnerPulled, setWinnerPulled] = useState(null);
    const [didSetPuller, setDidSetPuller] = useState(false);

    const [dynamicPullFactor, toggleDynamicPullFactor] = useState(true);
    
    const playerSelectors = [1,2,3].map((n)=>{
        const winner = `winner${n}`
        const loser = `loser${n}`
        return (
            <tr>
                    <td data-testid={winner}>
                        <Dropdown
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            players={players}
                            setPlayers={setPlayers}
                            thisplayer={winner}
                        />
                    </td>
                    <td data-testid={loser}>
                        <Dropdown
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            players={players}
                            setPlayers={setPlayers}
                            thisplayer={loser}
                        />
                    </td>
                </tr>
        )
    })
    

    useEffect(() => {
        setLeagueid(leagueid)
        if (availablePlayers.size == 0) {
            setAvailablePlayers(new Set(roster.map((person) => person[0])))
        }
    })

    useEffect(() => {
        if (checkForSixPlayers()) {
            setDidSelectPlayers(true)
        } else {
            setDidSelectPlayers(false)
        }
    }, [players]);

    // const justPlayerNames = roster.map((person) => person[0])
    function clearSelection() {
        for (let val of Object.values(players)) {
            if (val !== "") {
                setAvailablePlayers(prevSet => new Set(prevSet.add(val)));
            }
        }
        setPlayers({winner1: "", winner2: "",winner3:"",loser1:"",loser2:"",loser3:""})
        setDidSelectPlayers(false)
        setDidSetPuller(false)
        setWinnerPulled(null)
    }

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

    function checkForSixPlayers() {
        for (const i of Object.values(players)){
            if (i===""){
                return false
            }
        }
        
        return true
    }

    async function handleSubmit(event) {
        //check for 6 players
        event.preventDefault()
        if (!checkForSixPlayers()) {
            return
        }
        clearSelection()
        await firebase_logNewGame(leagueid, ...Object.values(players), winnerPulled, dynamicPullFactor)

        updater()

    }
    
    return (
        <div className="scoreReport animatedLoad">
            <div className='reportscoreTeamButtons'>
                <button
                    className="reportscoreTeamButtons clickable highlights"
                    onClick={swapTeams}>
                    Swap Teams
                </button>
                <RandomizeTeamsButton players={players} setPlayers={setPlayers}/>       
            </div>    
        

            <table >
                {/* <ToggleSwitch label="Broke to Win" puller={winnerPulled} setPuller={setWinnerPulled}/> */}
                <tr>
                    <th>Winning Team</th>
                    <th>Losing Team</th>
                </tr>
                {playerSelectors}
            </table>
            <br></br>

            {didSelectPlayers ?
                <>
                    <PullFactorSetter dynamicPullFactor={dynamicPullFactor} toggleDynamicPullFactor={toggleDynamicPullFactor} />
                    <PullSelector setDidSetPuller={setDidSetPuller} winnerPulled={winnerPulled} setWinnerPulled={setWinnerPulled} data-testid="pullSelector" />
                </>
                : null}

            {didSetPuller ?
                <table>
                    <tr>
                        <td style={{ textAlign: "center" }}>
                            <form onSubmit={handleSubmit} id="submitGame" data-testid="submitButton">
                                <input type="submit" className="neutralColor scoreReportButton clickable highlights"></input>
                            </form>
                        </td>
                        <td>
                            <button onClick={clearSelection} className="eloloss scoreReportButton clickable highlights ">Clear</button>
                        </td>
                    </tr>
                </table>
                : null
            }
        </div>
    )

}