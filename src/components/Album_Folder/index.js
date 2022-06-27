import "./styles.css"
 
import { FaHeadphones } from 'react-icons/fa';
import { database } from "../../services/network/firebase/firebase";

import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";


export function Album_Folder(props){
    const {
        artistName,
        albumName,
        albumCover,
        album_id,
        artist_id
    } = props;  
       
    const {user} = useAuth();

    async function addAlbum(artistId, albumId){
        const roomRef = await database.ref(`artists/${artistId}/albums/${albumId}`).get();

        if (!roomRef.exists()){
            const albumRef = await database.ref(`artists/${artistId}/albums/${albumId}`);
        
            const firebaseAlbums = await albumRef.set({
                listend: true,
            })
        }
    }


    return(
    <div class="folder-wrap">
        <div id={`${album_id}`} className ="album-grid-item">
        <Link to={`/album/${album_id}`}>
            <div>
                <img id = "cover" src={`${albumCover}`} alt="album cover"/>
            </div>
            <div>
                <h4>{`${albumName}`}</h4>
                <div id="separator-line"></div>
                <div id="artist-info">
                    <div id="album-artist">
                        <p>{`${artistName}`}</p>
                    </div>
                </div>
            </div>
        </Link>
    </div>
        <div className="check-listen">
            <FaHeadphones onClick={()=> {addAlbum(artist_id, album_id)}}/>
        </div>
    </div>
    )
}