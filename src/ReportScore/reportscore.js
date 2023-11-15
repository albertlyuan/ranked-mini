import {useState, useEffect } from 'react';
import {buildLeaderboard, firebase_logNewGame} from '../Firebase/database.js'
import Dropdown from "./dropdown.js"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Firebase/auth.js';
import PullSelector from './pullSelector.js';
import PullFactorSetter from './pullFactorSetter.js';

export default function ReportScore({roster, updater}){
    const [availablePlayers, setAvailablePlayers] = useState(new Set());
    
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

    const [loggedin, setLoggedin] = useState(false);

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedin(true)
        }else{
          setLoggedin(false)
        }
      })      
      if (availablePlayers.size == 0){
        setAvailablePlayers(new Set(roster.map((person) => person[0])))
      }
    })

    useEffect(() => {
        if (checkForSixPlayers()){
            setDidSelectPlayers(true)
        }else{
            setDidSelectPlayers(false)
        }
    }, [winner1,winner2,winner3,loser1,loser2,loser3]);

    // const justPlayerNames = roster.map((person) => person[0])
    function clearSelection(){
        const newItems = [winner1,winner2,winner3,loser1,loser2,loser3]
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
        setDidSelectPlayers(false)
        setDidSetPuller(false)
        setWinnerPulled(null)
        
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
    
    function checkForSixPlayers(){
        if (winner1 ==="" || winner2 ==="" || winner3 ==="" || loser1 ==="" || loser2 ==="" || loser3 ===""){
            return false
        }   
        return true
    }

    function handleSubmit(event){
        //check for 6 players
        event.preventDefault()
        if (!checkForSixPlayers()){
            return
        }
        

        firebase_logNewGame(winner1,winner2,winner3,loser1,loser2,loser3, winnerPulled,dynamicPullFactor).then(()=>{
            updater()
            clearSelection()
        })
        
    }

    if (loggedin){
        return(
            <div class="scoreReport animatedLoad">
                <div style={{display: "flex", justifyContent:"center", alignContent:"center", textAlign: "center"}}>
                    <button onClick={swapTeams} class="swapTeamsButton clickable highlights">Swap Teams</button>
                </div>
                <table >
                {/* <ToggleSwitch label="Broke to Win" puller={winnerPulled} setPuller={setWinnerPulled}/> */}
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
                <br></br>

                {didSelectPlayers ? 
                    <>
                        <PullFactorSetter dynamicPullFactor={dynamicPullFactor} toggleDynamicPullFactor={toggleDynamicPullFactor}/>
                        <PullSelector setDidSetPuller={setDidSetPuller} winnerPulled={winnerPulled} setWinnerPulled={setWinnerPulled}/>
                    </>
                : null}

                {didSetPuller ? 
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
                    : null
                }
            </div>
        )
    }else{
        return(
            <>
                <h2>Login To Report Score</h2>
            </>
        )
    }
}