import {useState, useRef, useEffect } from 'react';
import { useComponentVisible } from './DetectExternalClick.js';

const dropdownOptions = new Set(["a","b","c","ab","bc","ac","abc"])

// window.onclick = function(event) {
//   if (!event.target.matches('.dropbtn') && !event.target.matches('#myInput') ) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     for (var i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// };


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
            id="searchInput" 
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
        <button 
            onClick={toggle} 
            class="dropbtn">
        {selection === "" ? "Select Player" : selection}
        
        </button>
    );
}

function Player({filter, name, setSelectionHandler}){

    
    const sendSelection = () => {
        setSelectionHandler(name)
    }

    return(
        <a 
            style={{display: name.toLowerCase().indexOf(filter) > -1 ? "block" : "none"}}
            onClick={sendSelection}
        >
        {name}</a>
    )
}


function Dropdown({availablePlayers, setAvailablePlayers}){
    const {
        ref,
        isComponentVisible,
        setIsComponentVisible
    } = useComponentVisible(false);

    const [selection, setSelection] = useState('');
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
        }
    }
    
    const sendSearchInput = (inp) => {
        setFilter(inp)
    }

    const addToAvailablePlayers = () => {
        setAvailablePlayers(prevSet => new Set(prevSet.add(selection)))    
    }

    const removeFromAvailablePlayers = (removeItem) => {
        // setAvailablePlayers(oldSet => new Set(oldSet).delete(removeItem))
        const updatedSet = new Set(availablePlayers);
        updatedSet.delete(removeItem);
        setAvailablePlayers(updatedSet);
    }

    const setSelectionHandler = (newSelection) => {
        if (selection !== ""){
            addToAvailablePlayers()
        }
        setSelection(newSelection)
        removeFromAvailablePlayers(newSelection)
        setIsComponentVisible(false)
    }

    const playerOptions = Array.from(availablePlayers).map(name => 
        <Player
            filter={filter}
            name={name}
            setSelectionHandler={setSelectionHandler}
            toggleDropdown={toggleDropdown}
            addToAvailablePlayers={addToAvailablePlayers}
            removeFromAvailablePlayers={removeFromAvailablePlayers}
        />
    ); 

    

    return(
        <div class="dropdown" ref={ref}>  
            <DropdownButton 
                toggle={toggleDropdown}
                selection={selection}
            />
            
            { isComponentVisible && (
            <div id="myDropdown" class={isComponentVisible ? 'dropdown-show' : "dropdown-hide"}>
                <DropdownSearch 
                    sendSearchInput={sendSearchInput}
                    inputRef={inputRef}
                />
                {playerOptions}
            </div>
            )}
        </div>
    );
}

export default function ReportScore(){
    const [availablePlayers, setAvailablePlayers] = useState(dropdownOptions);
    
    return(
        <div class="scoreReport">
            <div class="winningSide">
                <h3>Winners</h3>
                
                <Dropdown
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                />
                <Dropdown 
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                />
                <Dropdown 
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                />
            </div>
            <br></br>
            <div class="losingSide">
                <h3>Losers</h3>
                <Dropdown 
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                />
                <Dropdown 
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                />
                <Dropdown 
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                />
            </div>
            <button>Submit</button>
            <button>Clear</button>  {/* TODO */}

        </div>
    )
}