import { useNavigate } from "react-router-dom";
import { signout } from "../Firebase/auth.js";

export default function LoginButton({text}){
    const navigate = useNavigate();

    function goToLogin(){
        signout()
        navigate(`/login`);
    }

    return(
        <button class="createAccountButton" onClick={goToLogin}>{text}</button>
    )
}