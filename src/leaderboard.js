import {useState} from 'react';
import {firebase_addNewPlayer, firebase_getPlayers, firebase_logNewGame, getNewGameID} from './firebase.js'

var fakeData = [
    ['a',400],
    ['b',500],
    ['c',1000]
  ]

function AddPlayer({setStatusMsgFunc}){
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
            for (let i = 0; i < fakeData.length; i++) {
                if (inputName === fakeData[i][0]){
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
                onChange={handleChange}>
            </input>
        </form>
    );
}

function PlayerRow({name, elo, setTab, setPlayer}){

    const goToPlayer = () => {
        setTab('playerbio')
        setPlayer(name)
    }

    return(
    <tr class="playerRow" onClick={goToPlayer}>
        <td>{name}</td>
        <td style={{textAlign: "right"}}>{elo} </td>

    </tr>
    );
}

export default function Leaderboard({setTab, setPlayer}){
    const [statusMsg, setStatusMsg] = useState('');
    const [roster, setRoster] = useState([]);

    const listItems = roster.map((person) => 
        <PlayerRow
            name={person[0]}
            elo={person[1]}
            setTab={setTab}
            setPlayer={setPlayer}

        />
    ); 
    return (
        <div id="leaderboard" class="tabcontent">
            <table>
                {listItems}
                <tr id="addplayerRow">
                    <td>
                        <AddPlayer
                            setStatusMsgFunc={(msg) => {
                                setStatusMsg(msg)
                            }}
                        />
                    </td>
                    <td>
                        <p id="statusmsg">{statusMsg}</p>
                        <button onClick={() =>{
                            let outp = getNewGameID()
                            alert(outp)
                        }}>
                            new game id    
                        </button>
                        <button onClick={() => {
                            firebase_getPlayers(setRoster)
                            // alert(outp)
                        }}>getplayers</button>
                    </td>
                </tr>
            </table>
            
        </div>
      );
}