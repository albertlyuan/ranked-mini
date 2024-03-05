import { useEffect, useState } from "react";
import { aws_listAdminLeagues } from "../Database/league.js";
import { useNavigate } from "react-router-dom";

export default function AdminLeagues({adminuid}){
    const [adminleagues, setAdminleagues] = useState([])
    useEffect(()=>{
        aws_listAdminLeagues(adminuid).then(data=>{
            const leagueids = []
            for (const league of data["data"]["listLeagues"]["items"]){
                leagueids.push(league)
            }

            const displayLeagues = leagueids.map(league =>{
                return(<LeagueButton leagueid={league["id"]} leaguename={league["leagueName"]} />)
            })
            setAdminleagues(displayLeagues)
        })
    })


    return (
        <table>
            <thead>
                Your Leagues
            </thead>
            <tbody>
                {adminleagues}
            </tbody>
        </table>
    )
}

function LeagueButton({leagueid, leaguename}){
    const navigate = useNavigate();

    function goToLeague(){
        navigate(`/${leagueid}`);
    }

    return(
        <tr class="clickable highlights" onClick={goToLeague}>
            <td style={{paddingRight: "50px"}}>
              <p>{leaguename}</p>
            </td>
        </tr>
    )
}