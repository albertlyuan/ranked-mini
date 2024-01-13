import {useState } from 'react'

function DropdownSearch({sendSearchInput, inputRef}){

    const [search, setSearch] = useState('')

    const handleChange = (event) => {
        setSearch(event.target.value);
    };

    const handleKeyUp = () => {
        sendSearchInput(search.toLowerCase())
    }
    return(
        <input 
            type="text" 
            placeholder="Search.." 
            id="dropdownSearch" 
            value={search}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            ref={inputRef}
        >
        </input>
    );
}

function DropdownButton({toggle, selection}){
    return(
        <a 
            onClick={toggle} 
            className="dropbtn">
        {selection === "" ? "Select Player" : selection}
        
        </a>
    );
}


function DropdownPlayer({filter, name, setSelectionHandler}){
    const sendSelection = () => {
        setSelectionHandler(name)
    }
    
    return(
        <a  
        className="clickable highlights"
            style={{display: name.toLowerCase().indexOf(filter) > -1 ? "block" : "none"}}
            onClick={sendSelection}
        >
        {name}</a>
    )
}

export {DropdownSearch, DropdownButton, DropdownPlayer}