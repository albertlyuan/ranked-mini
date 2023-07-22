import {useState, useRef, useEffect } from 'react';
import { useComponentVisible } from './DetectExternalClick.js';
import {buildLeaderboard, firebase_logNewGame, getNewGameID} from './firebase.js'

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
        <a 
            onClick={toggle} 
            class="dropbtn">
        {selection === "" ? "Select Player" : selection}
        
        </a>
    );
}

function Player({filter, name, setSelectionHandler}){
    const sendSelection = () => {
        setSelectionHandler(name)
    }

    return(
        <a  
            class="clickable highlights"
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

export default function ReportScore({roster, setRoster}){
    const [availablePlayers, setAvailablePlayers] = useState(new Set(roster.map((person) => person[0])));
    const [winner1, setWinner1] = useState('');
    const [winner2, setWinner2] = useState('');
    const [winner3, setWinner3] = useState('');
    const [loser1, setLoser1] = useState('');
    const [loser2, setLoser2] = useState('');
    const [loser3, setLoser3] = useState('');
    const [statusMsg, setStatusMsg] = useState('');

    // const justPlayerNames = roster.map((person) => person[0])
    function clearSelection(){
        const newItems = [winner1,winner2,winner3,loser1,loser2,loser3]
        setStatusMsg('')
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
    function handleSubmit(event){
        //check for 6 players
        event.preventDefault()

        if (winner1 ==="" || winner2 ==="" || winner3 ==="" || loser1 ==="" || loser2 ==="" || loser3 ===""){
            setStatusMsg('Must Have 6 Players Selected')
            return
        }

        firebase_logNewGame(winner1,winner2,winner3,loser1,loser2,loser3)
        // const newLeaderboard = await buildLeaderboard()
        // setRoster(newLeaderboard)
        buildLeaderboard().then(newLeaderboard => {
            setRoster(newLeaderboard)
            clearSelection()
            setStatusMsg("Game Submitted")
        })
        
        
    }

    return(
        <div class="scoreReport animatedLoad">
            <table >
                <tr>
                    <th>Winning Team</th>
                    <th>Losing Team</th>
                </tr>
                
                <tr>
                    <td>
                        <Dropdown
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={winner1}
                            setSelection={setWinner1}
                        />   
                    </td>
                    <td>
                        <Dropdown 
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={loser1}
                            setSelection={setLoser1}
                        />
                    </td>
                </tr>
                <tr>             
                    <td>
                        <Dropdown 
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={winner2}
                            setSelection={setWinner2}
                        />
                    </td>
                    <td>
                        <Dropdown 
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={loser2}
                            setSelection={setLoser2}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <Dropdown 
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={winner3}
                            setSelection={setWinner3}
                        />
                    </td>
                    <td>
                        <Dropdown 
                            availablePlayers={availablePlayers}
                            setAvailablePlayers={setAvailablePlayers}
                            selection={loser3}
                            setSelection={setLoser3}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <form onSubmit={handleSubmit} id="submitGame" >
                            <input type="submit" class="scoreReportButton clickable highlights"></input>  
                        </form>
                    </td>
                    <td>
                        <button onClick={clearSelection} class="scoreReportButton clickable highlights">Clear</button>
                    </td>
                </tr>
            </table>
            <p class="statusmsg">{statusMsg}</p>

        </div>
        
        
    )
}