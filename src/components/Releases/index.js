import "./styles.css"
import { useEffect, useState } from "react";
import { Artist_Folder} from "../../components";
import { Header } from "../../components";

import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/network/firebase/firebase";

export function Releases(){

const [newReleases, setNewReleases] = useState([{}]);

useEffect(()=>{
    const releaseRef = database.ref(`release`);
    releaseRef.once("value", artist => {
      const artistsRelease = artist.val()
      const parsedArtistRelease = Object.entries(artistsRelease).map(([key, value]) => {
          return {
              id: key,
              name: value.artist_name,
              picture: value.artist_picture,
          }
      })
      setNewReleases(parsedArtistRelease);
    })
},[])

return(
    <>
        <Header/>
        <div id="releases">
            <div className="title">
                <h2>
                    New Releases
                </h2> 
                <button className="button">
                    Create Playlist
                </button>
            </div>
            <div className="grid-container">
                
            { 
                newReleases.map(valor =>{
                    if(valor.id !== undefined){
                        return(
                        <div key={valor.id}>
                            <Artist_Folder
                                artistName = {valor.name}
                                artistPicture = {valor.picture}
                                artist_id = {valor.id}
                            > 
                            </Artist_Folder>
                        </div>
                    )}})
            }
            </div>
        </div>

    </>
)

}