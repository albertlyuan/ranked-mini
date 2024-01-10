import {firebase_addNewPlayer} from '../Firebase/database.js'
import {useState} from 'react';

function AddPlayer({setStatusMsgFunc, roster, leagueid}){
    const [inputName, setInputName] = useState('');

    const handleChange = (event) => {
        setInputName((event.target.value).trim());
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
            firebase_addNewPlayer(leagueid, inputName)
        }else{
            event.preventDefault()
        }

    }
    return(
        <form className="newPlayer" onSubmit={handleSubmit}>
            <input 
                type="text" 
                id="playerNameBox" 
                data-testid="AddNewPlayerBox"
                placeholder="Add New Player" 
                value={inputName}
                onChange={handleChange}
            />
        </form>
    );
}

export default AddPlayer