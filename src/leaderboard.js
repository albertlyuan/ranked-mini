import {useState} from 'react';

var fakeData = [
    ['a',400],
    ['b',500],
    ['c',1000]
  ]

//   playerNameBox.addEventListener('keydown', (e) => { 
//     if (e.key === 'Enter') {
//       e.preventDefault()
//       var playerName = document.getElementById("playerNameBox").value
//       document.getElementById("statusmsg").textContent = playerName
  
//       // document.getElementById("addPlayer").submit()//  Trigger form submission
//     }
//   })

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
            fakeData.push([inputName, 0])
            alert("added " + inputName)
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

export default function Leaderboard(){
    const [statusMsg, setStatusMsg] = useState('');

    const listItems = fakeData.map(person => 
        <tr>
            <td>{person[0]}</td>
            <td style={{textAlign: "right"}}>{person[1]} </td>
        </tr>
    ); 
    return (
        <div className="leaderboard">
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
                    </td>
                </tr>
            </table>
          </div>
          

          
        </div>
      );
}