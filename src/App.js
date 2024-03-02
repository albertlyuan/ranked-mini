// amplify stuff
import "@aws-amplify/ui-react/styles.css";
import {
  useAuthenticator,
} from "@aws-amplify/ui-react";
import Home_reg from './Home/home_regular.js';
import Home_auth from './Home/home_authenticated.js';
import { BrowserRouter } from "react-router-dom"

function App() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

  return (
    <BrowserRouter>    
      {authStatus === 'authenticated' ? <Home_auth /> : <Home_reg />}
    </BrowserRouter>
  );
}

export default App;
