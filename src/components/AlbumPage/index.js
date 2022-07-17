import "./styles.css"

import { Track } from '../Track';
import {spotifyApi} from "../../services/network/spotify-api/spotify-api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeadphones, FaRegHeart, FaHeart } from 'react-icons/fa';

import { database } from "../../services/network/firebase/firebase";

 
export function AlbumPage(props){
    const [albumTracks, setAlbumTracks] = useState([]);
    const [album, setAlbum] = useState();

    const {
        album_id
    } = useParams();
 
    const {
        artist_id,
        album_id2,
        albumCover,
        albumName,
        albumType,
        release,
        totalTracks,
        listenedAlbum
    } = props; 

    async function toggleListenAlbum(artistId, albumId, listened){
        const albumRef = database.ref(`releases/${artistId}/albums/${albumId}`);
        const firebaseAlbums = await albumRef.update({
            amount_listened: albumRef.total_tracks,
            listened: true
        })
        albumTracks.map(track =>{
            toggleListen(artistId, albumId, track.id, true);
        })
    }

    async function toggleListen(artistId, albumId, trackId, listened){
        const trackRef = database.ref(`releases/${artistId}/albums/${albumId}/tracks/${trackId}`);
        const firebaseTracks = await trackRef.update({
            listened: true
        })
    }

    const getTracks = async () => {
        await spotifyApi.getAlbum(album_id || album_id2)
        .then(function(data) {
            setAlbum(data.body)
        }, function(err) {
            console.error(err);
        });
    } 

    useEffect(() => {
        getTracks()
        const albumRef = database.ref(`releases/${artist_id}/albums/${album_id || album_id2}/tracks`);
        albumRef.once("value", tracks => {
            const tracksRelease = tracks.val()
            const parsedTracksRelease = Object.entries(tracksRelease).map(([key, value]) => {
                return value
            }) 
            setAlbumTracks(parsedTracksRelease)
        });
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
                        <div className="album-desc">
                            <h2>
                                {album.name}
                            </h2>
                            {`${album.album_type} • ${album.release_date.slice(0,4)} • ${album.total_tracks} ${album.total_tracks > 1 ? 'songs' : 'song'}`}
                            <div className="check-album">
                                <span className="color">
                                    {
                                        listenedAlbum 
                                        ?
                                        <FaHeart onClick={()=> {toggleListenAlbum(artist_id, album.id, listenedAlbum)}}/>
                                        :
                                        <FaRegHeart onClick={()=> {toggleListenAlbum(artist_id, album.id, listenedAlbum)}}/>
                                    }
                                </span>
                            </div>
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
                        <div className ="track-item">
                        <div id={`${valor.id}`} className ="track-desc">
                            <div className="track-description">
                                <div id="track-info">
                                    <h4>{`${valor.name}`}</h4>
                                    {/* <p>{`${artistName}`}</p> */}
                                </div>
                                <div className="duration">
                                    <p>{minutes}:{seconds}</p>
                                </div>
                            </div>
                        </div>
                            <div className="check-listen">
                                <span>
                                    {
                                        valor.listened ?
                                        <FaHeart onClick={()=> {toggleListen(artist_id, album_id, valor.id, valor.listened)}}/>
                                        :
                                        <FaRegHeart onClick={()=> {toggleListen(artist_id, album_id, valor.id, valor.listened)}}/>
                                    }
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}