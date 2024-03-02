import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "../Firebase/auth.js";
import { onAuthStateChanged } from "firebase/auth";

export default function Toolbar({leagueid}){  
    const [authUseruid, setAuthUseruid ] = useState()
    useEffect(()=>{
        
        
    })
    if (authUseruid != null || (leagueid != null && leagueid != undefined)){
        return(
            <ul className="toolbar sticky">
                <li><NavLink to={`/${leagueid}/`}>Leaderboard</NavLink></li>
                {authUseruid == leagueid ? <li><NavLink to={`/${leagueid}/reportscore`}>Report Score</NavLink></li> : null}
                <li><NavLink to={`/${leagueid}/games`}>Games</NavLink></li>
                <li><NavLink to={`/elo`}>Elo</NavLink></li>
                <li><NavLink to={`/ranks`}>Ranks</NavLink></li>
            </ul>
            
        )
    }else{
        return(
            <ul className="toolbar sticky">
                <li><NavLink to={`/elo`}>Elo</NavLink></li>
                <li><NavLink to={`/ranks`}>Ranks</NavLink></li>
            </ul>
        )
    }
}