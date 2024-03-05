import {useState, useEffect } from 'react';
import ReportScore from './reportscore.js';
import LoginButton from '../Login/loginbutton.js';
import { useNavigate, useParams} from 'react-router-dom';

import { aws_getLeague } from '../Database/league.js';
import { aws_getLeaguePlayers } from '../Database/player.js';
import { useAuthenticator } from '@aws-amplify/ui-react';


export default function ReportScoreWrapper({ setLeagueid}){
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const [showReportscore, setShowReportscore] = useState(false)
    
    const {leagueid} = useParams()
    const [roster, setRoster] = useState([])
    setLeagueid(leagueid)
    
    if (user != null){
        aws_getLeague(leagueid).then((leagueobj) =>{
            const adminid = leagueobj['data']['getLeague']['adminUID']
            setShowReportscore(adminid == user.userId)

        }).then(()=>{
            if (showReportscore){
                aws_getLeaguePlayers(leagueid).then((data) =>{
                    if (data==null){
                        return []
                    }
                    setRoster(data['data']['listPlayers']['items'])
                })
            }
        })
    }

    const navigate = useNavigate();
    aws_getLeague(leagueid).then((res)=>{
        if (!res){
            setLeagueid(null)
            navigate("/page/not/found")
        }
    })

    if(user != null){
        if (showReportscore){
            return(
                <ReportScore roster={roster} setLeagueid={setLeagueid}/>
            )
        }
        else{
            return(
                <>
                    <LoginButton text={`Log into [${leagueid}] to Report Score`} />
                    <p>Currently logged into: {user.userId}</p>
                </>
            )
        }
    }else{
        return(
            <LoginButton text={"Log in / Sign up"} />
        )
    }
}