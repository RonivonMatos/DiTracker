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
                    releasedAlbums.push(album);
                    addRelease(artist.id, artist.name ,artist.picture)
                  }
              })
              setAllReleases(releasedAlbums);
            }, function(err) {
              console.error(err);
            });
          })
        }
        else{
          return
        }

    }

async function addRelease(artistId, artistName, artistPicture){
  const getReleaseRef = await database.ref(`release/${artistId}`).get();

  if (!getReleaseRef.exists()){
      const releaseRef = database.ref(`release/${artistId}`);
      const releases = database.ref(`release/`);

      const firebaseRelease = await releaseRef.set({
          user_id: user?.id,
          artist_id:artistId,
          artist_name: artistName,
          artist_picture:artistPicture
      })
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
        const releaseRef = database.ref(`release`);
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
                          <Artist_Folder
                            artistName = {valor.name}
                            artistPicture = {valor.picture}
                            artist_id = {valor.id}
                          >
                          </Artist_Folder>
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