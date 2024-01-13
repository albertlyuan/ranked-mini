import { useComponentVisible } from './DetectExternalClick.js';
import {useState, useRef, useEffect } from 'react'
import { DropdownSearch, DropdownButton, DropdownPlayer } from './dropdownComponents.js';

function Dropdown({availablePlayers, setAvailablePlayers, players, setPlayers, thisplayer}){
    const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(false);
    const [filter, setFilter] = useState('');
    const inputRef = useRef(null);
    
    useEffect(() => {
        if (isComponentVisible){
            inputRef.current.focus();
        }
    },[isComponentVisible])

    const toggleDropdown = () => {
        if(!isComponentVisible){
            setIsComponentVisible(true)
            setFilter('')
        }
    }
    
    const sendSearchInput = (inp) => {
        setFilter(inp)
    }

    const addToAvailablePlayers = () => {
        setAvailablePlayers(prevSet => new Set(prevSet.add(players[thisplayer])))    
    }

    const removeFromAvailablePlayers = (removeItem) => {
        // setAvailablePlayers(oldSet => new Set(oldSet).delete(removeItem))
        const updatedSet = new Set(availablePlayers);
        updatedSet.delete(removeItem);
        setAvailablePlayers(updatedSet);
    }

    const setSelectionHandler = (newSelection) => {
        if (players[thisplayer] !== ""){
            addToAvailablePlayers()
        }
        // setSelection(newSelection)

        setPlayers({...players, [thisplayer]: newSelection})
        removeFromAvailablePlayers(newSelection)
        setIsComponentVisible(false)
    }

    const playerOptions = Array.from(availablePlayers).map(name => 
        <DropdownPlayer
            filter={filter}
            name={name}
            setSelectionHandler={setSelectionHandler}
            toggleDropdown={toggleDropdown}
            addToAvailablePlayers={addToAvailablePlayers}
            removeFromAvailablePlayers={removeFromAvailablePlayers}
        />
    ); 

    

    return(
        <div className="dropdown" ref={ref}>  
            <DropdownButton 
                toggle={toggleDropdown}
                selection={players[thisplayer]}
            />
            
            { isComponentVisible && (
            <div id="dropdownOptions" className={isComponentVisible ? 'dropdown-show' : "dropdown-hide"}>
                <DropdownSearch id="dropdownSearch"
                    sendSearchInput={sendSearchInput}
                    inputRef={inputRef}
                />
                {playerOptions}
            </div>
            )}
        </div>
    );
}

export default Dropdown