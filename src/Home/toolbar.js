import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { auth } from "../Firebase/auth.js";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { aws_getLeague } from "../Database/league.js";

export default function Toolbar({leagueid}){  
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const [showReportscore, setShowReportscore] = useState(false)
    
    if (user != null){
        aws_getLeague(leagueid).then((leagueobj) =>{
            const adminid = leagueobj['data']['getLeague']['adminUID']
            setShowReportscore(adminid == user.userId)
        })
    }

    if (leagueid != null && leagueid != undefined){
        
        return(
            <ul className="toolbar sticky">
                <li><NavLink to={`/${leagueid}/`}>Leaderboard</NavLink></li>
                {showReportscore ? <li><NavLink to={`/${leagueid}/reportscore/`}>Report Score</NavLink></li> : null}
                <li><NavLink to={`/${leagueid}/games/`}>Games</NavLink></li>
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