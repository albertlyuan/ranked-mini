import {useState} from 'react';

function SearchPlayer({setFilter, text}){
    const [search, setSearch] = useState('')

    const handleChange = (event) => {
        setSearch(event.target.value);
    };

    const handleKeyUp = () => {
        setFilter(search.toLowerCase());
    }
    
    return(
        <tr>
            <td>
                <input 
                    type="text" 
                    placeholder={text}
                    className="playerNameBox" 
                    value={search}
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                />
            </td>
        </tr>
    );
}

export default SearchPlayer