import "./styles.css"
import { useEffect, useState } from "react";
import { Artist_Folder} from "../../components";
import { Header } from "../../components";

import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/network/firebase/firebase";

export function Library(){

const [savedArtists, setSavedArtists] = useState([{}]);

useEffect(()=>{
const artistRef = database.ref(`artists`);
artistRef.once("value", artist => {
    const artists = artist.val()
    const parsedArtist = Object.entries(artists).map(([key, value]) => {
        return {
            id: key,
            name: value.artist_name,
            picture: value.artist_picture,
        }
    })
    setSavedArtists(parsedArtist);
})
},[])

return(
    <>
        <Header/>
        <div id="library" className="grid-container">
        {
        savedArtists.map(valor =>{
            if(valor !== null){
            return(
                <div key={valor.id}>
                    <Artist_Folder
                    artistName = {valor.name}
                    artistPicture = {valor.picture}
                    artist_id = {valor.id}
                    >
                    </Artist_Folder>
                </div>
            ) 
            }
        })
        }
        </div>
    </>
)

}