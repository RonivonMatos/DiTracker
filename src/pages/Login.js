import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const {user, signInWithGoogle} = useContext(AuthContext)

    async function signIn()
    {
      if(!user){
        signInWithGoogle();
      }
      else{
        navigate('/')
      }
    } 
  return(
      <div>
        <button className="button" onClick={signIn}>sign In</button>
      </div>
  );
}