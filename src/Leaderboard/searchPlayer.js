import {useState} from 'react';

function SearchPlayer({setFilter}){
    const [search, setSearch] = useState('')

    const handleChange = (event) => {
        setSearch(event.target.value);
    };

    const handleKeyUp = () => {
        setFilter(search.toLowerCase());
    }

    return(
        <input 
            type="text" 
            placeholder="Search.." 
            id="playerNameBox" 
            value={search}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
        >
        </input>
    );
}

export default SearchPlayer