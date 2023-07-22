import {useState} from 'react';
import {firebase_addNewPlayer} from './firebase.js'


function AddPlayer({setStatusMsgFunc, roster}){
    const [inputName, setInputName] = useState('');

    const handleChange = (event) => {
        setInputName(event.target.value);
    };

    const handleSubmit = (event) => {
        let validNewName = true
        if (inputName === ""){
            validNewName = false
            setStatusMsgFunc("name cannot be empty")
        }else{
            for (let i = 0; i < roster.length; i++) {
                if (inputName === roster[i][0]){
                    validNewName = false
                    setStatusMsgFunc("name already exists")
                }
            }
        }

        if (validNewName){
            firebase_addNewPlayer(inputName)
        }else{
            event.preventDefault()
        }

    }
    return(
        <form class="newPlayer" onSubmit={handleSubmit}>
            <input 
                type="text" 
                id="playerNameBox" 
                placeholder="Add New Player" 
                value={inputName}
                onChange={handleChange}
            />
        </form>
    );
}

function PlayerRow({name, elo, setTab, setPlayer, wins, losses}){

    const goToPlayer = () => {
        setTab('playerbio')
        setPlayer(name)
    }

    return(
    <tr class="playerRow" onClick={goToPlayer}>
        <td>{name} ({wins}-{losses})</td>
        <td style={{textAlign: "right"}}>{elo} </td>
    </tr>
    );
}

export default function Leaderboard({roster, setTab, setPlayer}){
    const [statusMsg, setStatusMsg] = useState('');

    const listItems = roster.map((person) => 
        <PlayerRow
            name={person[0]}
            elo={person[1]}
            wins={person[2]}
            losses={person[3]}
            setTab={setTab}
            setPlayer={setPlayer}

        />
    ); 
    return (
        <div id="leaderboard" class="tabcontent animatedLoad">
            <table>
                <thead>
                    <th>Player (record)</th>
                    <th>Elo</th>
                </thead>
                {listItems}
                <tr id="addplayerRow">
                    <td>
                        <AddPlayer
                            roster={roster}
                            setStatusMsgFunc={(msg) => {
                                setStatusMsg(msg)
                            }}
                        />
                    </td>
                    <td>
                        <p class="statusmsg">{statusMsg}</p>
                    </td>
                </tr>
            </table>
            
        </div>
      );
}