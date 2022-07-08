import "./styles.css"

import { FaHeadphones, FaPlus, FaPlusSquare } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { database } from "../../services/network/firebase/firebase";
import { useAuth } from "../../hooks/useAuth";
 

export function ArtistFolder(props){

    const {user} = useAuth(); 

    async function addArtist(artistId, artistName){
        const getArtistRef = await database.ref(`artists/${artistId}`).get();
        if (!getArtistRef.exists()){
            const artistRef = database.ref(`artists/${artistId}/`);
            const artists = database.ref(`artists/`);

            const firebaseArtists = await artistRef.set({
                user_id: user?.id,
                artist_id:artistId,
                artist_name: artistName,
                artist_picture:artistPicture
            })
        }

    }

    const {
        artistName,
        artistPicture,
        artist_id
    } = props;
    
    return(
    // <div className="folder-wrap">
    <div id={`${artist_id}`} className ="artist-grid-item">
    <Link to={`/artist/${artist_id}`}>
        <div className="picture-wrap">
            <img id="picture" src={`${artistPicture}`} alt="artist picture"/>
        </div>
        <h4>{`${artistName}`}</h4>
    </Link>
    {/* </div> 
        <div className="check-listen">
            <button className="check-listen-icon" onClick={()=> {addArtist(artist_id, artistName)}}>
                <FaPlus />
            </button>
        </div> */}
    </div>
    )
}