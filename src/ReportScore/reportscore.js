import { useState, useEffect } from 'react';
import { firebase_logNewGame } from '../Firebase/database.js'
import Dropdown from "./dropdown.js"
import { useParams } from 'react-router-dom';
import {PullFactorSetter, PullSelector, SwapTeamsButton, RandomizeTeamsButton} from "./reportscoreButtons.js"

export default function ReportScore({ roster, updater, setLeagueid }) {
    const [availablePlayers, setAvailablePlayers] = useState(new Set());
    const { leagueid } = useParams()
    const [players, setPlayers] = useState({winner1: "", winner2: "",winner3:"",loser1:"",loser2:"",loser3:""})
    const [statusMsg, setStatusMsg] = useState("")
    const [didSelectPlayers, setDidSelectPlayers] = useState(false);

    const [winnerPulled, setWinnerPulled] = useState(null);
    const [didSetPuller, setDidSetPuller] = useState(false);

    const [dynamicPullFactor, toggleDynamicPullFactor] = useState(true);
    
    const playerSelectors = [1,2,3].map((n)=>{
        const winner = `winner${n}`
        const loser = `loser${n}`
        return (
            <tr key={n}>
                <td data-testid={winner}>
                    <Dropdown
                        availablePlayers={availablePlayers}
                        setAvailablePlayers={setAvailablePlayers}
                        players={players}
                        setPlayers={setPlayers}
                        thisplayer={winner}
                        setStatusMsg={setStatusMsg}

                    />
                </td>
                <td data-testid={loser}>
                    <Dropdown
                        availablePlayers={availablePlayers}
                        setAvailablePlayers={setAvailablePlayers}
                        players={players}
                        setPlayers={setPlayers}
                        thisplayer={loser}
                        setStatusMsg={setStatusMsg}
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
        await firebase_logNewGame(leagueid, ...Object.values(players), winnerPulled, dynamicPullFactor)
        updater()
        clearSelection()
        setStatusMsg("Success!")
    }
    
    return (
        <div className="scoreReport animatedLoad">
            <div className='reportscoreTeamButtons'>
                <SwapTeamsButton players={players} setPlayers={setPlayers}/>       
                <RandomizeTeamsButton players={players} setPlayers={setPlayers}/>       
            </div>    
        

            <table >
                <thead>
                    <tr>
                        <th>Winning Team</th>
                        <th>Losing Team</th>
                    </tr>
                </thead>
                <tbody>
                    {playerSelectors}
                </tbody>
            </table>
            <br></br>
            <h3 className='reportscoreTeamButtons'>{statusMsg}</h3>
            {didSelectPlayers ?
                <>
                    <PullFactorSetter dynamicPullFactor={dynamicPullFactor} toggleDynamicPullFactor={toggleDynamicPullFactor} />
                    <PullSelector setDidSetPuller={setDidSetPuller} winnerPulled={winnerPulled} setWinnerPulled={setWinnerPulled} data-testid="pullSelector" />
                </>
                : null}

            {didSetPuller ?
                <table>
                    <tbody>
                    <tr>
                        <td style={{ textAlign: "center" }}>
                            <form onSubmit={handleSubmit} id="submitGame" data-testid="submitButton">
                                <input type="submit" className="neutralColor scoreReportButton clickable highlights"></input>
                            </form>
                        </td>
                        <td>
                            <button onClick={clearSelection} data-testid="clearButton" className="eloloss scoreReportButton clickable highlights ">Clear</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                : null
            }
        </div>
    )

}