import { useState, useEffect } from 'react';
import { firebase_logNewGame } from '../Firebase/database.js'
import Dropdown from "./dropdown.js"
import PullSelector from './pullSelector.js';
import PullFactorSetter from './pullFactorSetter.js';
import { useParams } from 'react-router-dom';

export default function ReportScore({ roster, updater, setLeagueid }) {
    const [availablePlayers, setAvailablePlayers] = useState(new Set());
    const { leagueid } = useParams()
    const [winner1, setWinner1] = useState('');
    const [winner2, setWinner2] = useState('');
    const [winner3, setWinner3] = useState('');
    const [loser1, setLoser1] = useState('');
    const [loser2, setLoser2] = useState('');
    const [loser3, setLoser3] = useState('');

    const [didSelectPlayers, setDidSelectPlayers] = useState(false);

    const [winnerPulled, setWinnerPulled] = useState(null);
    const [didSetPuller, setDidSetPuller] = useState(false);

    const [dynamicPullFactor, toggleDynamicPullFactor] = useState(true);

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
    }, [winner1, winner2, winner3, loser1, loser2, loser3]);

    // const justPlayerNames = roster.map((person) => person[0])
    function clearSelection() {
        const newItems = [winner1, winner2, winner3, loser1, loser2, loser3]
        for (let val of newItems) {
            if (val !== "") {
                setAvailablePlayers(prevSet => new Set(prevSet.add(val)));
            }
        }
        setWinner1('')
        setWinner2('')
        setWinner3('')
        setLoser1('')
        setLoser2('')
        setLoser3('')
        setDidSelectPlayers(false)
        setDidSetPuller(false)
        setWinnerPulled(null)

    }

    function swapTeams() {
        const tempWinners = [winner1, winner2, winner3]
        setWinner1(loser1)
        setWinner2(loser2)
        setWinner3(loser3)

        setLoser1(tempWinners[0])
        setLoser2(tempWinners[1])
        setLoser3(tempWinners[2])


    }

    function checkForSixPlayers() {
        if (winner1 === "" || winner2 === "" || winner3 === "" || loser1 === "" || loser2 === "" || loser3 === "") {
            return false
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
        await firebase_logNewGame(leagueid, winner1, winner2, winner3, loser1, loser2, loser3, winnerPulled, dynamicPullFactor)
        
        updater()

    }

    return (
        <div className="scoreReport animatedLoad">
            <div style={{ display: "flex", justifyContent: "center", alignContent: "center", textAlign: "center" }}>
                <button onClick={swapTeams} className="swapTeamsButton clickable highlights">Swap Teams</button>
            </div>
            <table >
                {/* <ToggleSwitch label="Broke to Win" puller={winnerPulled} setPuller={setWinnerPulled}/> */}
                <tr>
                    <th>Winning Team</th>
                    <th>Losing Team</th>
                </tr>
                <tr>
                    <td data-testid="winner1">
                        <Dropdown
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={winner1}
                            setSelection={setWinner1}

                        />
                    </td>
                    <td data-testid="loser1">
                        <Dropdown
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={loser1}
                            setSelection={setLoser1}

                        />
                    </td>
                </tr>
                <tr>
                    <td data-testid="winner2">
                        <Dropdown
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={winner2}
                            setSelection={setWinner2}

                        />
                    </td>
                    <td data-testid="loser2">
                        <Dropdown
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={loser2}
                            setSelection={setLoser2}

                        />
                    </td>
                </tr>
                <tr>
                    <td data-testid="winner3">
                        <Dropdown
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={winner3}
                            setSelection={setWinner3}

                        />
                    </td>
                    <td data-testid="loser3">
                        <Dropdown
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={loser3}
                            setSelection={setLoser3}

                        />
                    </td>
                </tr>
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
                                <input type="submit" className="scoreReportButton clickable highlights"></input>
                            </form>
                        </td>
                        <td>
                            <button onClick={clearSelection} className="scoreReportButton clickable highlights">Clear</button>
                        </td>
                    </tr>
                </table>
                : null
            }
        </div>
    )

}