import "./styles.css"

import { FaHeadphones } from 'react-icons/fa';


export function Track(props){
    const {
        artistName,
        trackTitle,
        track_id,
        duration,
    } = props;
    
    return(  
    <div>
    <div id={`${track_id}`} className ="track-item">
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
    
    </div>
    )
}