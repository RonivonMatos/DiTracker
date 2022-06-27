import "./styles.css"

import { Track } from '../Track';
import {spotifyApi} from "../../services/network/spotify-api/spotify-api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
 
 
export function Album_Page(props){
    const [albumTracks, setAlbumTracks] = useState([]);
    const [album, setAlbum] = useState();
    // const [albumType, setAlbumType] = useState([]);
    // const [albumName, setAlbumName] = useState([]);
    // const [release, setRelease] = useState([]);
    // const [totalTracks, setTotalTracks] = useState([]);
 
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
        await spotifyApi.getAlbumTracks(album_id || album_id2)
        .then(function(data) {
            console.log(data.body.items);
            setAlbumTracks(data.body.items)
        }, function(err) {
            console.log('Something went wrong!', err);
        });

        await spotifyApi.getAlbum(album_id || album_id2)
        .then(function(data) {
            console.log('Album information', data.body);
            setAlbum(data.body)
            // setAlbumType(data.body.album_type)
            // setRelease(data.body.release_date.slice(0,4))
            // setAlbumName(data.body.album_type)
            // setAlbumType(data.body.album_type)
        }, function(err) {
            console.error(err);
        });
    } 

    useEffect(() => {
        getTracks()
    },[]); 
    
    return( 
        <div>
            <div className="track-container">
                <div className="album-header">
                    {
                    album ?
                    <div className="album-header">
                        <div className="album-cover">
                            <img src={album.images[0] !== null ? album.images[0].url : ""}/>
                        </div> 
                        <div>
                            <h2>
                                {album.name}
                            </h2>
                            {`${album.album_type} • ${album.release_date.slice(0,4)} • ${album.total_tracks} ${album.total_tracks > 1 ? 'songs' : 'song'}`}
                        </div> 
                    </div>
                    :
                    <div>
                    </div>
                    }
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