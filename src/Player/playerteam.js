import React, { useState } from 'react';
import {addTeam, firebase_changeName} from '../Firebase/database.js'

export function PlayerTeam({teamname}){
    return (
        <button>
            <p>{teamname}</p>
        </button>
    )
}

export function AddPlayerTeam({uid, getTeams}){
    const [teamname, setTeamname] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleInputChange = (event) => {
        setTeamname(event.target.value);
    };

    const handleAlertClick = () => {
        setShowAlert(true);
    };

    const handleConfirmClick = () => {
        // Do something with the input value, e.g. save it or use it
        addTeam(uid, teamname)
        getTeams()
        setTeamname('');
        setShowAlert(false);

    };

    const handleCancelClick = () => {
        setTeamname('');
        setShowAlert(false);
    };

    return (
        <div >
            <button onClick={handleAlertClick} style={{display: showAlert? "none" : "block"}}>+</button>
                
            <div class="horizontal_left" style={{display: showAlert? "block" : "none"}}>
            <input
                type="text"
                value={teamname}
                onChange={handleInputChange}
            />
            <button onClick={handleConfirmClick}>Confirm</button>
            <button onClick={handleCancelClick}>Cancel</button>
            </div>
        </div>
    )
}