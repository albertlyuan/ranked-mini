import React, { useState } from 'react';
import {addTeam, removeTeam} from '../Firebase/database.js'

export function PlayerTeam({uid, teamname, triggerReload, observer}){
    const [showAlert, setShowAlert] = useState(false);

    function toggleAlert(){
        setShowAlert(true)
    }

    function handleDeleteClick(){
        removeTeam(uid, teamname)
        triggerReload(!observer)
    }

    function handleCancelClick(){
        setShowAlert(false)
    }

    return (
        <>
        <button 
            id="teambutton" 
            onClick={toggleAlert} 
            class="teambutton_unselected"
            style={{display: showAlert? "none" : "block"}}
        > 
            <p>{teamname}</p>
        </button>

        <div id="deleteTeam" style={{display: showAlert? "block" : "none"}}>
            <p>Remove {teamname}?</p>
            <button onClick={handleDeleteClick} class="eloloss optionButton">Delete</button>
            <button onClick={handleCancelClick} class="optionButton">Cancel</button>
        </div>
    </>
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
        addTeam(uid, teamname.trim().toLowerCase())
        getTeams()
        setTeamname('');
        setShowAlert(false);

    };

    const handleCancelClick = () => {
        setTeamname('');
        setShowAlert(false);
    };

    return (
        <div id="addTeam">
            <button id="addTeamButton" onClick={handleAlertClick} style={{display: showAlert? "none" : "block"}}>Add Team</button>
                
            <div style={{display: showAlert? "block" : "none"}}>
                <input
                    id="textInput"
                    type="text"
                    placeholder='Enter team name'
                    value={teamname}
                    onChange={handleInputChange}
                />
                <button onClick={handleConfirmClick} class="optionButton elogain">Confirm</button>
                <button onClick={handleCancelClick} class="optionButton">Cancel</button>
            </div>
        </div>
    )
}