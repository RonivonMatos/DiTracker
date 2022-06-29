import { Header } from "../components";
import { ProfilePage } from '../components/ProfilePage';
// import { useAuth } from "../hooks/useAuth";
export function Home() {
 
  // function LoginLogout(){
  //   if(!user){
  //     return(
  //       <div>
  //         <button className="button" onClick={signIn}>sign In</button>
  //       </div> 
  //     )}
  //     else{
  //       return(
  //         <div>
  //           {user.name}
  //         </div> 
  //       )
  //   } 
  // };
  // const {user, signInWithGoogle} = useAuth();

  // async function signIn()
  // {
  //     signInWithGoogle();
  // } 

  return(
    <div>
      {/* <Header/> */}
      <ProfilePage/>
    </div> 
    )
  
}