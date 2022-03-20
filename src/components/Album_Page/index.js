import "./styles.css"

import { Track } from '../Track';
import {spotifyApi} from "../../services/network/spotify-api/spotify-api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
 
 
export function Album_Page(props){
    const [albumTracks, setAlbumTracks] = useState([]);
 
    const {
        album_id
    } = useParams();

    const {
        album_id2,
        albumCover,
        albumName,
        albumType,
        release,
        totalTracks
    } = props;

    const getTracks = async () => {
        spotifyApi.getAlbumTracks(album_id || album_id2)
        .then(function(data) {
            console.log(data.body.items);
            setAlbumTracks(data.body.items)
        }, function(err) {
            console.log('Something went wrong!', err);
        });
    } 

    console.log(album_id)

    useEffect(() => {
        getTracks()
    },[]); 

    console.log(album_id)
    
    return( 
        <div>
            <div className="track-container">
                <div className="album-header">
                    <div className="album-cover">
                        <img src={albumCover}/>
                    </div> 
                    <div>
                        <h2>
                            {albumName}
                        </h2>
                        {`${albumType} & ${release} & ${totalTracks} ${totalTracks > 1 ? 'songs' : 'song'}`}
                    </div>
                </div>
                {albumTracks.map(valor =>{
                    let minutes = Math.floor(valor.duration_ms / 60000);
                    let seconds = Math.round((valor.duration_ms - minutes * 60000)/1000);
                    if(seconds<10){
                        seconds=`0${seconds}`
                    }
                    return(
                        <>
                        <Track
                            artistName = {valor.artists[0].name}
                            // albumName = {valor.album.name}
                            // albumCover = {valor.album.images[0] !== null ? valor.album.images[0].url : ""}
                            trackTitle = {valor.name}
                            track_id = {valor.id}
                            duration = {`${minutes}:${seconds}`}
                        > 
                        </Track>
                        </>
                    )
                })}
            </div>
        </div>
    )
}