import {useState, useRef, useEffect } from 'react';
import { useComponentVisible } from './DetectExternalClick.js';
import { func } from 'prop-types';

const dropdownOptions = new Set(["a","b","c","ab","bc","ac","abc"])

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


function Dropdown({availablePlayers, setAvailablePlayers, selection, setSelection}){
    const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(false);
    const [filter, setFilter] = useState('');
    // const [selection, setSelection] = useState('');
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
    const [winner1, setWinner1] = useState('');
    const [winner2, setWinner2] = useState('');
    const [winner3, setWinner3] = useState('');
    const [loser1, setLoser1] = useState('');
    const [loser2, setLoser2] = useState('');
    const [loser3, setLoser3] = useState('');

    function clearSelection(){
        const newItems = [winner1,winner2,winner3,loser1,loser2,loser3]
        for (let val of newItems){
            if (val !== ""){
                setAvailablePlayers(prevSet => new Set(prevSet.add(val)));
            }
        }
        setWinner1('')
        setWinner2('')
        setWinner3('')
        setLoser1('')
        setLoser2('')
        setLoser3('')
    }

    return(
        <div class="scoreReport">
            <div class="winningSide">
                <h3>Winners</h3>
                <Dropdown
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                    selection={winner1}
                    setSelection={setWinner1}
                />                
                <Dropdown 
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                    selection={winner2}
                    setSelection={setWinner2}
                />
                <Dropdown 
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                    selection={winner3}
                    setSelection={setWinner3}
                />
            </div>
            <br></br>
            <div class="losingSide">
                <h3>Losers</h3>
                <Dropdown 
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                    selection={loser1}
                    setSelection={setLoser1}
                />
                <Dropdown 
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                    selection={loser2}
                    setSelection={setLoser2}
                />
                <Dropdown 
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                    selection={loser3}
                    setSelection={setLoser3}
                />
            </div>
            <button>Submit</button>  {/* TODO */}
            <button onClick={clearSelection}>Clear</button>  {/* TODO */}

        </div>
    )
}