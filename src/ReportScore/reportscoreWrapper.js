import {useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Firebase/auth.js';
import ReportScore from './reportscore.js';


export default function ReportScoreWrapper({roster, updater, setLeagueid}){
    const [loggedin, setLoggedin] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedin(true)
            }else{
                setLoggedin(false)
            }
        })      
    })

    if (loggedin){
        return(
            <ReportScore roster={roster} updater={updater} setLeagueid={setLeagueid}/>
        )
    }else{
        return(
            <>
                <h2>Login To Report Score</h2>
            </>
        )
    }
}