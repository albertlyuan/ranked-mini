import { aws_createPlayer, aws_duplicateNameExists } from '../Database/player.js';
import {firebase_addNewPlayer} from '../Firebase/database.js'
import {useState} from 'react';

export default function AddPlayer({setStatusMsgFunc, leagueid}){
    const [inputName, setInputName] = useState('');

    const handleChange = (event) => {
        setInputName((event.target.value).trim());
    };

    const handleSubmit = (event) => {
        event.preventDefault()

        checkValidName(leagueid, inputName)
        .then((status) =>{
            if (status == ""){
                aws_createPlayer(leagueid, inputName)
            }else{
                setStatusMsgFunc(status)
            }
        })
    }
    return(
        <form className="newPlayer" onSubmit={handleSubmit}>
            <input 
                type="text" 
                className="playerNameBox" 
                data-testid="AddNewPlayerBox"
                placeholder="Add New Player" 
                value={inputName}
                onChange={handleChange}
            />
        </form>
    );
}

async function checkValidName(leagueid, name){
    
    if (name === ""){
        return "name cannot be empty"
    }
    if ((await aws_duplicateNameExists(leagueid, name)).length > 0){
        return "name already used"
    }

    return ""
}