import {React, useState} from "react"
import { login } from "../Firebase/auth.js"

export default function Login(){
    const [formData, setFormData] = useState({email: "albert@a.com", password: ''})

    const handleSubmit = (e) => {
        e.preventDefault()
        login(formData.email,formData.password)              
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* <input 
                type={"email"} 
                onChange={(e)=>setFormData({...formData, email: e.target.value})}/> */}
            <input 
                id="password"
                type={"password"}
                placeholder="Login for Admin Access"  
                onChange={(e)=>setFormData({...formData, password: e.target.value})}/>
            <input 
                type={"submit"} 
                style={{display:"none"}}/>
        </form>    
    )
}