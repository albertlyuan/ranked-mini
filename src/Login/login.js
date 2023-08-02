import {React, useState} from "react"
import { login } from "../Firebase/auth.js"

export default function Login(){
    const [formData, setFormData] = useState({email: '', password: ''})

    const handleSubmit = (e) => {
        e.preventDefault()
        login(formData.email,formData.password)              
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type={"email"} onChange={(e)=>setFormData({...formData, email: e.target.value})}/>
            <input type={"password"} onChange={(e)=>setFormData({...formData, password: e.target.value})}/>

            <button>Submit</button>
        </form>    
    )
}