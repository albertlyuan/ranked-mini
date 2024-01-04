import PlayerRow from '../Leaderboard/leaderboardPlayer.js';
import {React, useState} from "react"
import {useNavigate} from 'react-router-dom';

// 7zDTQ16f3Sah2sOSncu3zLf6PeG3
export default function GettingStarted(){
    
    return(
        <div id="leaderboard" class="tabcontent animatedLoad">
        <table>
            <thead>
                <th style={{"text-align": "left"}}>Player (record)</th>
                <th style={{"text-align": "right"}}>Elo</th>
            </thead>
            <PlayerRow
                name={'Alex'}
                elo={800}
                wins={31}
                losses={8}
                filter={''}
                position={1}
            />
            <PlayerRow
                name={'Beth'}
                elo={688}
                wins={32}
                losses={7}
                filter={''}
                position={2}
            />
            <PlayerRow
                name={'Charlie'}
                elo={665}
                wins={29}
                losses={8}
                filter={''}
                position={3}
            />
            <PlayerRow
                name={'Derek'}
                elo={174}
                wins={22}
                losses={14}
                filter={''}
                position={4}
            />
        </table>
        <div class="centered">
            <h1>Play ranked 3v3</h1>
            <h1>Mini Ultimate Frisbee. </h1>
            <p>Sign up to create a league for your group.</p>
            <button class="createAccountButton">Create a Free Account</button>
            <p>Already joined a league? Paste in the league ID</p>
            <LeaderboardIDInput></LeaderboardIDInput>
        </div>
    </div>
    )
}


function LeaderboardIDInput(){
    const [formData, setFormData] = useState("")
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate(`/${formData}`);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                id="textInput"
                placeholder="Enter your league key"  
                onChange={(e)=>setFormData(e.target.value)}/>
            <input 
                type={"submit"} 
                style={{display:"none"}}/>
        </form>    
    )
}
