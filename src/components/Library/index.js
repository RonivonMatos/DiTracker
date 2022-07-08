import "./styles.css"
import { useEffect, useState } from "react";
import { ArtistFolder} from "../../components";
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
        <div id="library" className="grid-container">
        {
        savedArtists.map(valor =>{
            if(valor !== null){
            return(
                <div key={valor.id}>
                    <div className="folder-wrap">
                        <ArtistFolder
                        artistName = {valor.name}
                        artistPicture = {valor.picture}
                        artist_id = {valor.id}
                        >
                        </ArtistFolder>
                    </div>
                </div>
            ) 
            }
        })
        }
        </div>
    </>
)

}