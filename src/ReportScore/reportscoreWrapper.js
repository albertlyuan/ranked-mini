import {useState, useEffect } from 'react';
import { auth } from '../Firebase/auth.js';
import ReportScore from './reportscore.js';
import LoginButton from '../Login/loginbutton.js';
import { useParams} from 'react-router-dom';


export default function ReportScoreWrapper({roster, updater, setLeagueid}){
    const {leagueid} = useParams()
    const [currUser, setCurrUser ] = useState()
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
                <ReportScore roster={roster} updater={updater} setLeagueid={setLeagueid}/>
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