import {React, useState} from "react"
import { login, auth } from "../Firebase/auth.js"
import { onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"

export default function LoginPage(){
    const [formData, setFormData] = useState({email: "", password: ""})
    const navigate = useNavigate();

    function handleSubmit(){
        login(formData.email,formData.password)     
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate(`/${user.uid}`);
            }
          })         
    }

    return (
        <>  
            <h1>Log in or create an account</h1>
            <p>Track your stats, check elo, and compete against friends.</p>
            <input 
                className="LoginTextInput"
                placeholder="Email" 
                onChange={(e)=>setFormData({...formData, email: e.target.value})}
            />
            <br></br>
            <br></br>

            <input 
                className="LoginTextInput"
                type={"password"}
                placeholder="Password"  
                onChange={(e)=>setFormData({...formData, password: e.target.value})}
            />
            <br></br>
            <br></br>

            <button className="LoginButton" onClick={handleSubmit}>Sign in</button>
        </>
    )
}