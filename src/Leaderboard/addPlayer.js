import {firebase_addNewPlayer} from '../Elo/firebase.js'
import {useState} from 'react';

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
                if (inputName.trim() === roster[i][0]){
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

export default AddPlayer