import "./styles.css"
import { useEffect, useState } from "react";
import { Artist_Folder, Discography_Page, Album_Folder } from "../../components";
import { Route, Routes, Link, useParams } from 'react-router-dom';
import {spotifyApi} from "../../services/network/spotify-api/spotify-api";
import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/network/firebase/firebase";


export function ProfilePage(){
    const {user} = useAuth();
    const thisYear = new Date('2022-01-01');
    const [savedArtists, setSavedArtists] = useState();

    const [newReleases, setNewReleases] = useState();
    let releasedAlbums = []
    const [updateReleases, setUpdateReleases] = useState();

    const searchRelease = () => {
      if(savedArtists.length > 0){
          savedArtists.map( async (artist) => {
            await spotifyApi.getArtistAlbums(artist.id, {country : 'BR'})
            .then(function(data) {
              let albums = data.body.items;
              albums.map(async (album) => {
                let date = new Date(album.release_date);
                  if(date >= thisYear){
                    addRelease(artist.id, artist.name ,artist.picture, album, album.id);
                  }
              })
              setUpdateReleases([])
            }, function(err) {
              console.error(err);
            });
          })
        }
        else{
          return
        }
    }

async function addRelease(artistId, artistName, artistPicture, album, albumId){
  const getReleaseArtistRef = await database.ref(`releases/${artistId}`).get();
  let trackRef;

  if (!getReleaseArtistRef.exists()){
      const releaseArtistRef = database.ref(`releases/${artistId}`);
      const albumRef = database.ref(`releases/${artistId}/albums/${albumId}`);

      const artistRelease = await releaseArtistRef.set({
        user_id: user?.id,
        artist_id:artistId,
        artist_name: artistName,
        artist_picture:artistPicture
      })

      const albumsRelease = await albumRef.set({
        listened: false,
        id: album.id,
        cover: album.images[0] !== null ? album.images[0].url : "",
        name: album.name,
        type: album.album_type,
        release: album.release_date.slice(0,4),
        total_tracks: album.total_tracks
      })

      await spotifyApi.getAlbum(album.id)
        .then(function(data) {
            data.body.tracks.items.map(async (track) =>{
              trackRef = database.ref(`releases/${artistId}/albums/${albumId}/tracks/${track.id}`);
    
              const trackRelease = await trackRef.set({
                  listened: false,
                  id: track.id,
                  name: track.name,
                  type: track.type,
                  duration_ms: track.duration_ms
              }) 
          })
        }, function(err) {
            console.error(err);
        });
      }
  
    else{
      const getAlbumRef = await database.ref(`releases/${artistId}/albums/${albumId}`).get();
      const albumRef = database.ref(`releases/${artistId}/albums/${albumId}`);

      if (!getAlbumRef.exists()){
        const firebaseRelease = await albumRef.set({
            listened: 0,
            id: album.id,
            cover: album.images[0] !== null ? album.images[0].url : "",
            name: album.name,
            type: album.album_type,
            release: album.release_date.slice(0,4),
            total_tracks: album.total_tracks
        })

      }
    }
}

async function addTrack(artistId, albumId, track){
  const getTrackRef = await database.ref(`releases/${artistId}/albums/${albumId}/tracks/${track.id}`).get();
  
  if (!getTrackRef.exists()){
    const trackRef = database.ref(`releases/${artistId}/albums/${albumId}/tracks/${track.id}`);

    const trackRelease = await trackRef.set({
        listened: false,
        id: track.id,
        name: track.name,
        type: track.type,
        duration_ms: track.duration_ms
    }) 
  }
}

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
},[updateReleases])


  useEffect(()=>{
      if(user){
        const artistRef = database.ref(`artists`);
          artistRef.once("value", artist => {
            const artists = artist.val()
            const parsedArtist = Object.entries(artists).map(([key, value]) => {
                return {
                    id: key,
                    name: value.artist_name,
                    picture: value.artist_picture,
                }
            })
            setSavedArtists(parsedArtist);
          })
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
        }
  },[user])


  const {
    artist_id
  } = useParams(); 

      return(
        <div id="profile-page"> 

            <div className="title">
              <div className="title-button">
                <h2> 
                  New Releases
                </h2>
                <button className="button" onClick={searchRelease}>check for more</button>
              </div> 
              <Link to={`releases`}>
                <h3>
                  SEE ALL
                </h3>
              </Link>
            </div>
  
            <div className="grid-container">
              {
                newReleases ?
                newReleases.slice(0,4).map(valor =>{
                  if(valor.id !== undefined){
                    return(
                      <div key={valor.id}>
                            <div className="folder-wrap">
                            <div id={`${valor.id}`} className ="artist-grid-item">
                            <Link to={`/releases/${valor.id}`}>
                                <div className="picture-wrap">
                                    <img id="picture" src={`${valor.picture}`} alt="artist picture"/>
                                </div>
                                <h4>{`${valor.name}`}</h4>
                            </Link>
                            </div> 
                                {/* <div className="check-listen">
                                    <span>
                                        <FaHeadphones onClick={()=> {addArtist(valor.id, valor.name)}}/>
                                    </span>
                                </div> */}
                            </div>
                      </div>
                  )}})
                  :
                  null
              }
            </div>
            
            <div className="title">
              <h2>
                Completed Discographies
              </h2>
              <Link to={`library`}>
                <h3> 
                  SEE ALL
                </h3>
              </Link>
            </div>
  
            <div className="grid-container">
              {savedArtists ? 
                savedArtists.slice(0,4).map(valor =>{
                  if(valor.id !== undefined){
                    return(
                      <div key={valor.id}>
                          <Artist_Folder
                            artistName = {valor.name}
                            artistPicture = {valor.picture}
                            artist_id = {valor.id}
                          >
                          </Artist_Folder>
                      </div>
                    ) 
                  }
                })
                :
                null
                }
            </div>
        </div>
      )
}