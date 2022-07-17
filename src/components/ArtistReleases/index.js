import "./styles.css"
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { AlbumPage } from "../../components";
import { FaHeadphones, FaRegHeart, FaHeart } from 'react-icons/fa';

import { database } from "../../services/network/firebase/firebase";

export function ArtistReleases(props){
    const [artistReleases, setArtistReleases] = useState();
    const [releases, setReleases] = useState();
    const {
        artist_id
    } = useParams();

    const {
        artist_id2,
    } = props;

    async function toggleListenAlbum(artistId, albumId, listened, amount, total){
        const albumRef = database.ref(`releases/${artistId}/albums/${albumId}`);
        const firebaseAlbums = await albumRef.update({
            amount_listened: listened ? 0 : total,
            listened: !listened
        })
        let updateRelease = artistReleases
        setReleases(updateRelease);
        Object.entries(artistReleases[albumId].tracks).map(([id, track]) => {
            const trackRef = database.ref(`releases/${artistId}/albums/${albumId}/tracks/${track.id}`);
            const firebaseTracks = trackRef.update({
                listened: !listened
            })
        })
    }

    async function toggleListen(artistId, albumId, trackId, listened, amount, total){
        console.log(amount)
        const albumRef = database.ref(`releases/${artistId}/albums/${albumId}`);
        const trackRef = database.ref(`releases/${artistId}/albums/${albumId}/tracks/${trackId}`);
        const firebaseAlbums = await albumRef.update({
            amount_listened: listened ? amount-1 : amount+1,
            listened: !listened && amount+1 == total ? true : false
        })
        const firebaseTracks = await trackRef.update({
            listened: !listened
        })
        // const firebaseAlbums = await albumRef.update({
        //     amount_listened: listened ? albumRef.amount_listened - 1 : albumRef.amount_listened + 1,
        //     listened: albumRef.amount_listened==albumRef.total_tracks ? true : false
        // })
        setReleases([]);
    }

    useEffect(()=>{
        const albumRef = database.ref(`releases/${artist_id}/albums`);
        albumRef.once("value", artist => {
          const artistRelease = artist.val()
          const parsedAlbumsRelease = Object.entries(artistRelease).map(([id, album]) => {
              return album
          }) 
          setArtistReleases(artistRelease);
        })
    },[releases])

    useEffect(()=>{
        const albumRef = database.ref(`releases/${artist_id}/albums`);
        albumRef.once("value", artist => {
          const artistRelease = artist.val()
        //   setReleases(artistRelease);
          const parsedAlbumsRelease = Object.entries(artistRelease).map(([id, album]) => {
              return album
          }) 
          setArtistReleases(parsedAlbumsRelease);
        })
    },[])

    return(
        <div id="artistReleases">
        {
            artistReleases ?
            Object.entries(artistReleases).map(([id, album]) => {
                if(album !== null){
                  return(
                      <div key={album.id}>
                            <div className="track-container">
                                <div className="album-header">
                                    <div className="album-header">
                                        <div className="album-cover">
                                            <img src={album.cover}/>
                                        </div> 
                                        <div className="album-desc">
                                            <h2>
                                                {album.name}
                                            </h2>
                                            {`${album.type} • ${album.release} • ${album.total_tracks} ${album.total_tracks > 1 ? 'songs' : 'song'}`}
                                            <div className="check-album">
                                                <span  className="color">
                                                    {
                                                        album.listened 
                                                        ?
                                                        <FaHeart fill="#1DB954" onClick={()=> {toggleListenAlbum(artist_id, album.id, album.listened, album.amount_listened, album.total_tracks)}}/>
                                                        :
                                                        <FaRegHeart onClick={()=> {toggleListenAlbum(artist_id, album.id, album.listened, album.amount_listened, album.total_tracks)}}/>
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                { Object.entries(album.tracks).map(([id, valor]) => {
                                    // console.log(valor)
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
                                                        <FaHeart fill="#1DB954" onClick={()=> {toggleListen(artist_id, album.id, valor.id, valor.listened, album.amount_listened, album.total_tracks)}}/>
                                                        :
                                                        <FaRegHeart onClick={()=> {toggleListen(artist_id, album.id, valor.id, valor.listened, album.amount_listened, album.total_tracks)}}/>
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
              })
            :
            null
        }
        </div>
    )
}