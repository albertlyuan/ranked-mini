import {useState, useEffect } from 'react';
import { auth } from '../Firebase/auth.js';
import ReportScore from './reportscore.js';
import LoginButton from '../Login/loginbutton.js';
import { useNavigate, useParams} from 'react-router-dom';
import { leagueExists } from '../Firebase/database.js';


export default function ReportScoreWrapper({roster, setLeagueid}){
    const {leagueid} = useParams()
    const [currUser, setCurrUser ] = useState()
    const navigate = useNavigate();
    leagueExists(leagueid).then((res)=>{
        if (!res){
            setLeagueid(null)
            navigate("/page/not/found")
        }
    })

    useEffect(()=>{
        if (auth.currentUser){
            setCurrUser(auth.currentUser)
        }
    },[auth.currentUser])

    useEffect(() => {
        setLeagueid(leagueid)
    })

    if(currUser){
        if (leagueid == currUser.uid){
            return(
                <ReportScore roster={roster} setLeagueid={setLeagueid}/>
            )
        }
        else{
            return(
                <>
                    <LoginButton text={`Log into [${leagueid}] to Report Score`} />
                    <p>Currently logged into: {currUser.uid}</p>
                </>
            )
        }
    }else{
        return(
            <LoginButton text={"Log in / Sign up"} />
        )
    }
}