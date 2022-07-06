import { useAuth } from "../../hooks/useAuth";
import "./styles.css"

export function Header(){
    const {user, signInWithGoogle} = useAuth();

    function LoginLogout(){
        if(!user){
          return(
            <div>
              <button className="button" onClick={signIn}>sign In</button>
            </div> 
          )}
          else{
            return(
              <div className="profile-container">
                <div className="profile-img">
                    <img src={user.avatar} alt=""/>
                </div>
                {user.name}
              </div> 
            )
        } 
      };
    
      async function signIn()
      {
          signInWithGoogle();
      } 
    return(
        <div> 
            <header>
                <LoginLogout/>
            </header>
            <div id ="menu">
                <div className="header">
                    <div className="logo" >
                    <a  href="/">
                        <h1>
                        DiTracker
                        </h1>
                    </a>
                    </div>
                    <div className='nav'>
                    <a href="/">
                        <h3>
                        Home 
                        </h3>
                    </a>
                    <a  href="/search">
                        <h3>
                        Search
                        </h3>
                    </a>
                    </div>
                </div>
            </div>
        </div>
    )
}