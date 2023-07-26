import {useState } from 'react';
import {buildLeaderboard, firebase_logNewGame} from '../Elo/firebase.js'
import Dropdown from "./dropdown.js"
import ToggleSwitch from './toggleSwitch.js';

export default function ReportScore({roster, setRoster}){
    const [availablePlayers, setAvailablePlayers] = useState(new Set(roster.map((person) => person[0])));
    const [winner1, setWinner1] = useState('');
    const [winner2, setWinner2] = useState('');
    const [winner3, setWinner3] = useState('');
    const [loser1, setLoser1] = useState('');
    const [loser2, setLoser2] = useState('');
    const [loser3, setLoser3] = useState('');
    const [winnerPulled, setWinnerPulled] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');

    // const justPlayerNames = roster.map((person) => person[0])
    function clearSelection(){
        const newItems = [winner1,winner2,winner3,loser1,loser2,loser3]
        setStatusMsg('')
        for (let val of newItems){
            if (val !== ""){
                setAvailablePlayers(prevSet => new Set(prevSet.add(val)));
            }
        }
        setWinner1('')
        setWinner2('')
        setWinner3('')
        setLoser1('')
        setLoser2('')
        setLoser3('')
        
    }

    function swapTeams(){
        const tempWinners = [winner1,winner2,winner3]
        setWinner1(loser1)
        setWinner2(loser2)
        setWinner3(loser3)

        setLoser1(tempWinners[0])
        setLoser2(tempWinners[1])
        setLoser3(tempWinners[2])


    }

    function handleSubmit(event){
        //check for 6 players
        event.preventDefault()

        if (winner1 ==="" || winner2 ==="" || winner3 ==="" || loser1 ==="" || loser2 ==="" || loser3 ===""){
            setStatusMsg('Must Have 6 Players Selected')
            return
        }

        firebase_logNewGame(winner1,winner2,winner3,loser1,loser2,loser3, winnerPulled)
        // const newLeaderboard = await buildLeaderboard()
        // setRoster(newLeaderboard)
        buildLeaderboard().then(newLeaderboard => {
            setRoster(newLeaderboard)
            clearSelection()
            setStatusMsg("Game Submitted")
        })
        
        
    }

    return(
        <div class="scoreReport animatedLoad">
            <table >
            <ToggleSwitch label="Broke to Win" puller={winnerPulled} setPuller={setWinnerPulled}/>
            
                <tr>
                    <th>Winning Team</th>
                    <th>Losing Team</th>
                </tr>
                
                <tr>
                    <td>
                        <Dropdown
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={winner1}
                            setSelection={setWinner1}
                        />   
                    </td>
                    <td>
                        <Dropdown 
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={loser1}
                            setSelection={setLoser1}
                        />
                    </td>
                </tr>
                <tr>             
                    <td>
                        <Dropdown 
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={winner2}
                            setSelection={setWinner2}
                        />
                    </td>
                    <td>
                        <Dropdown 
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={loser2}
                            setSelection={setLoser2}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <Dropdown 
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={winner3}
                            setSelection={setWinner3}
                        />
                    </td>
                    <td>
                        <Dropdown 
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={loser3}
                            setSelection={setLoser3}
                        />
                    </td>
                </tr>
            </table>
            <div style={{display: "flex", justifyContent:"center", alignContent:"center"}}>
                <button onClick={swapTeams} class="swapTeamsButton clickable highlights">Swap Teams</button>
            </div>
            <table>
                <tr>
                    <td style={{textAlign:"center"}}>
                        <form onSubmit={handleSubmit} id="submitGame" >
                            <input type="submit" class="scoreReportButton clickable highlights"></input>  
                        </form>
                    </td>
                    <td>
                        <button onClick={clearSelection} class="scoreReportButton clickable highlights">Clear</button>
                    </td>
                </tr>
            </table>
            <p class="statusmsg">{statusMsg}</p>

        </div>
        
        
    )
}