import React, { useState } from 'react';
import {firebase_changeName} from '../Firebase/database.js'

function TextInputAlert({oldname}){
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
    firebase_changeName(oldname, newName).then(validNameChange => {
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
        {!showAlert ? <button onClick={handleAlertClick}>Change Name</button> : null }
        {showAlert && (
            <div className="overlay">
            <div className="alert">
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
        )}
    </div>
  );
};

export default TextInputAlert;
