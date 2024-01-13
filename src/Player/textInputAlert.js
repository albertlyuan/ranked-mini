import React, { useState } from 'react';
import {firebase_changeName} from '../Firebase/database.js'

function TextInputAlert({leagueid, oldname}){
  const [newName, setNewName] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event) => {
    setNewName(event.target.value);
  };

  const handleAlertClick = () => {
    setShowAlert(true);
  };

  const handleConfirmClick = () => {
    // Do something with the input value, e.g. save it or use it
    firebase_changeName(leagueid, oldname, newName).then(validNameChange => {
        if (validNameChange){
            setShowAlert(false);
            window.location.reload(false);
        }else{
            alert("Name Already Taken")
        }
    })
    
  };

  const handleCancelClick = () => {
    setNewName('');
    setShowAlert(false);
  };

  return (
    <div>
        <button onClick={handleAlertClick} style={{display: showAlert? "none" : "block"}}>Change Name</button>
            
        <div style={{display: showAlert? "block" : "none"}}>
          <input
            type="text"
            value={newName}
            onChange={handleInputChange}
          />
          <div>
            <button onClick={handleConfirmClick}>Confirm</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </div>
        </div>
    </div>
  );
};

export default TextInputAlert;
