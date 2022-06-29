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

    var releasedAlbums = []
    const [allReleases, setAllReleases] = useState();
    const [newReleases, setNewReleases] = useState();

    const searchRelease = () => {
      if(savedArtists.length > 0){
          savedArtists.map( async (artist) => {
            await spotifyApi.getArtistAlbums(artist.id, {country : 'BR'})
            .then(function(data) {
              let albums = data.body.items;
              albums.map((album) => {
                  let date = new Date(album.release_date);
                  if(date >= thisYear){
                    console.log(album)
                    releasedAlbums.push(album);
                    addRelease(artist.id, artist.name ,artist.picture, album, album.id)
                    // addAlbum(artist.id, album, album.id)
                  }
              })
              setAllReleases(releasedAlbums);
              releasedAlbums = [];
            }, function(err) {
              console.error(err);
            });
          })
        }
        else{
          return
        }
    }


// async function addAlbum(artistId, album, albumId){
//       const getAlbumRef = await database.ref(`releases/${artistId}/albums/${albumId}`).get();
//       const albumRef = database.ref(`releases/${artistId}/albums/${albumId}`);

//       if (!getAlbumRef.exists()){
//         const firebaseRelease = await albumRef.set({
//             listened: false,
//             id: album.id,
//             cover: album.images[0] !== null ? album.images[0].url : "",
//             name: album.name,
//             type: album.album_type,
//             release: album.release_date.slice(0,4),
//             total_tracks: album.total_tracks
//         })
//       }
// }
async function addRelease(artistId, artistName, artistPicture, album, albumId){
  const getReleaseRef = await database.ref(`releases/${artistId}`).get();

  if (!getReleaseRef.exists()){
      const releaseRef = database.ref(`releases/${artistId}`);
      const albumRef = database.ref(`releases/${artistId}/albums/${albumId}`);

      const firebaseRelease = await releaseRef.set({
          user_id: user?.id,
          artist_id:artistId,
          artist_name: artistName,
          artist_picture:artistPicture
      })
      const firebaseAlbums = await albumRef.set({
        listened: false,
        id: album.id,
        cover: album.images[0] !== null ? album.images[0].url : "",
        name: album.name,
        type: album.album_type,
        release: album.release_date.slice(0,4),
        total_tracks: album.total_tracks
    })
  }
    else{
      const getAlbumRef = await database.ref(`releases/${artistId}/albums/${albumId}`).get();
      const albumRef = database.ref(`releases/${artistId}/albums/${albumId}`);

      if (!getAlbumRef.exists()){
        const firebaseRelease = await albumRef.set({
            listened: false,
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