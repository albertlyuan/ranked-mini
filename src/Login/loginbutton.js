import {Button} from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

export default function LoginButton(){
    const navigate = useNavigate();

    const goToLogin = () => {
      navigate(`/login`);
    };

    return(                
        <Button onClick={goToLogin}>Log in</Button>
    )
}
