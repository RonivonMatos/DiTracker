import "./styles.css"
import { useEffect, useState } from "react";
import { ArtistReleases} from "../../components";
import { Route, Routes, Link } from 'react-router-dom';

import { database } from "../../services/network/firebase/firebase";

export function Releases(){

const [newReleases, setNewReleases] = useState([{}]);
 
useEffect(()=>{
    const releaseRef = database.ref(`releases`);
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

function Artists(){
    return(
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
                        <div class="folder-wrap">
                        <div id={`${valor.id}`} className ="artist-grid-item">
                        <Link to={`${valor.id}`}>
                            <div className="picture-wrap">
                                <img id="picture" src={`${valor.picture}`} alt="artist picture"/>
                            </div>
                            <h4>{`${valor.name}`}</h4>
                        </Link>
                        </div> 
                        </div>
                    </div>
                )}})
        }
        </div> 

        <div className="title">
            <h2>
                Listened
            </h2> 
        </div>
        {/* <div className="grid-container">
         
        { 
            newReleases.map(valor =>{
                if(valor.id !== undefined){
                    return(
                    <div key={valor.id}>
                        <div class="folder-wrap">
                        <div id={`${valor.id}`} className ="artist-grid-item">
                        <Link to={`${valor.id}`}>
                            <div className="picture-wrap">
                                <img id="picture" src={`${valor.picture}`} alt="artist picture"/>
                            </div>
                            <h4>{`${valor.name}`}</h4>
                        </Link>
                        </div> 
                        </div>
                    </div>
                )}})
        }
        </div>  */}
        
    </div>
    )
}

return(
    <div>
        <Routes>
          <Route path = "/" element = {<Artists />} />
          <Route path = "/:artist_id" element = {<ArtistReleases />} />
        </Routes>
    </div>
)

}