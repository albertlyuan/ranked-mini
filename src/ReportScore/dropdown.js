import {useState, useRef, useEffect } from 'react'

export default function Dropdown({availablePlayers, setAvailablePlayers, players, setPlayers, thisplayer}){
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
            key={name}
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

function useComponentVisible(initialIsVisible) {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return { ref, isComponentVisible, setIsComponentVisible };
}