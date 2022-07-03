import "./styles.css"

import { FaHeadphones, FaRegHeart, FaHeart } from 'react-icons/fa';
import { database } from "../../services/network/firebase/firebase";


export function Track(props){
    const {
        // artistName,
        trackTitle,
        track_id,
        album_id,
        artist_id,
        duration,
        listened
    } = props;

    async function toggleListen(artistId, albumId, trackId){
        const trackRef = database.ref(`releases/${artistId}/albums/${albumId}/tracks/${trackId}`);
        const firebaseTracks = await trackRef.update({
            listened: !listened
        })
    }
    
    return(  
    <div className ="track-item">
    <div id={`${track_id}`} className ="track-desc">
        <div className="track-description">
            <div id="track-info">
                <h4>{`${trackTitle}`}</h4>
                {/* <p>{`${artistName}`}</p> */}
            </div>
            <div className="duration">
                <p>{duration}</p>
            </div>
        </div>
    </div>
        <div className="check-listen">
            <span>
                {
                    listened ?
                    <FaHeart onClick={()=> {toggleListen(artist_id, album_id, track_id)}}/>
                    :
                    <FaRegHeart onClick={()=> {toggleListen(artist_id, album_id, track_id)}}/>
                }
            </span>
        </div>
    </div>
    )
}