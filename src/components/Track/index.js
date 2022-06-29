import "./styles.css"

import { FaHeadphones, FaRegHeart, FaHeart } from 'react-icons/fa';


export function Track(props){
    const {
        artistName,
        trackTitle,
        track_id,
        duration,
    } = props; 
    
    return(  
    <div className ="track-item">
    <div id={`${track_id}`} className ="track-desc">
        <div className="track-description">
            <div id="track-info">
                <h4>{`${trackTitle}`}</h4>
                <p>{`${artistName}`}</p>
            </div>
            <div className="duration">
                <p>{duration}</p>
            </div>
        </div>
    </div>
        <div className="check-listen">
            <span>
                <FaRegHeart/>
            </span>
        </div>
    </div>
    )
}