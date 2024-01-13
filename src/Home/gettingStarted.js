import PlayerRow from '../Leaderboard/leaderboardPlayer.js';
import {React, useState} from "react"
import {useNavigate} from 'react-router-dom';
import LoginButton from '../Login/loginbutton.js'
import { getRankFromElo } from '../rank-images/rankImages.js';
import { auth, signout } from '../Firebase/auth.js';

export default function GettingStarted({currLeagueid}){
    const displayRoster = [
        ["Alex", 800, 31, 8],
        ["Beth", 688, 32, 7],
        ["Charlie", 665, 29, 8],
        ["Derek", 174, 22, 14],
    ]

    const playerrows = displayRoster.map((person) => {
        const name=person[0]
        const elo=person[1]
        const wins=person[2]
        const losses=person[3]  
        return (
            <tr>
                <td style={{paddingRight: "50px"}}>
                    <p>{name} ({wins}-{losses})</p>
                </td>
                <td style={{textAlign: "right"}}>
                    <p> 
                    <img title={getRankFromElo(elo, wins,losses).split("static/media/")[1].split(".")[0]} class="rankImg" src={getRankFromElo(elo, wins,losses)}/>
                    </p>
                </td>
            </tr>
        )
    }); 
   
    return(
        <div id="leaderboard" class="tabcontent animatedLoad">
        <table>
            <thead>
                <th style={{"text-align": "left"}}>Player (record)</th>
                <th style={{"text-align": "right"}}>Elo</th>
            </thead>
            {playerrows}
        </table>
        <div class="centered">
            <h1>Play ranked 3v3</h1>
            <h1>Mini Ultimate Frisbee. </h1>

            {currLeagueid != null ? 
                <>
                    <p>Currently Viewing League: <b>{currLeagueid}</b></p>
                    <LeaderboardIDInput/>
                    {auth.currentUser ? 
                        <p>Signed in as: <b>{auth.currentUser.email} ({auth.currentUser.uid})</b></p> 
                        :
                        <p>Log in or sign up to create a league for your team.</p>
                    }
                    
                    <LoginButton text={"Log Into Other Account"}></LoginButton>
                </>
                : 
                <>
                    <p>Log in or sign up to create a league for your team.</p>
                    <LoginButton text={"Log In / Create a Free Account"}></LoginButton>

                    <p>Already joined a league? Paste in the league ID</p>
                    <LeaderboardIDInput/>
                    
                </>
            }
            
        </div>
    </div>
    )
}


function LeaderboardIDInput(){
    const [formData, setFormData] = useState("")
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        signout()
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
