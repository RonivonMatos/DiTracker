import {  useState } from 'react';

import { Artist_Folder, Album_Folder, Track, Header } from '../components';
import { Route, Routes, Link } from 'react-router-dom';
import {spotifyApi} from "../services/network/spotify-api/spotify-api";
import { FaSearch } from "react-icons/fa";
import { database } from "../services/network/firebase/firebase";
import { FaHeadphones, FaPlus, FaPlusSquare } from 'react-icons/fa';
import { useAuth } from "../hooks/useAuth";

export function Search() {
  
  const [artistSearch, setArtistSearch] = useState([]);
  const [albumSearch, setAlbumSearch] = useState([]);
  const [trackSearch, setTrackSearch] = useState([]);

  const [query, setQuery] = useState('');
  const {user} = useAuth(); 

  async function addArtist(artistId, artistName, artistPicture){
      const getArtistRef = await database.ref(`artists/${artistId}`).get();
      if (!getArtistRef.exists()){
          const artistRef = database.ref(`artists/${artistId}/`);
          const artists = database.ref(`artists/`);

          const firebaseArtists = await artistRef.set({
              user_id: user?.id,
              artist_id:artistId,
              artist_name: artistName,
              artist_picture:artistPicture
          })
      }
  }

  const doSearch = async () => {
    if(query!==''){
      await spotifyApi.searchArtists(query, {country : 'BR'})
      .then(function(data) {
        setArtistSearch(data.body.artists.items.slice(0,5));
      }, function(err) {
        console.error(err);
      });
      
      await spotifyApi.searchTracks(query, {country : 'BR'})
      .then(function(data) {
        setTrackSearch(data.body.tracks.items.slice(0,5));
      }, function(err) {
        console.error(err);
      });

      await spotifyApi.searchAlbums(query, {country : 'BR', album_type : 'album'})
      .then(function(data) {
        console.log(`Search Albums by ${query}\n`, data.body.albums.items);
        setAlbumSearch(data.body.albums.items.slice(0,5));
      }, function(err) {
        console.error(err);
      }); 
    }
    else{
      return
    }
  }

  function SearchResult(){
    {if(artistSearch[0] != null){
      return(
        <div>
            <div id="" className="title">
              <h2>
                Top artists from your search
              </h2>
            </div>
            
            <div className="grid-container">
              {artistSearch.slice(0,4).map(valor =>{
                if(valor !== null && valor.images[0] !== undefined ){
                  return(
                    <div key={valor.id}>
                        <div className="folder-wrap">
                          <Artist_Folder
                            artistName = {valor.name}
                            artistPicture = {valor.images[0].url === undefined ? "" : valor.images[0].url}
                            artist_id = {valor.id}
                          >
                          </Artist_Folder>
                          <div className="check-listen">
                              <button  className="check-listen-icon" onClick={()=> {addArtist(valor.id, valor.name, valor.images[0].url === undefined ? "" : valor.images[0].url)}}>
                                  <FaPlus />
                              </button>
                          </div>
                        </div>
                    </div> 
                  );
                } 
              })}


            </div>

            {/* <div className="title">
              <h2>
                Albums
              </h2>
            </div>

            <div className="grid-container">
            {albumSearch.slice(0,4).map(valor =>{
                if(valor !== null  && valor.images[0] !== undefined ){
                  return(
                    <div key={valor.id}>
                        <Album_Folder
                          artistName = {valor.artists[0].name}
                          albumName = {valor.name}
                          albumCover = {valor.images[0].url}
                          album_id = {valor.id}
                          artist_id={valor.artists[0].id}
                        >
                        </Album_Folder>
                    </div>
                  )
                }
              })}
            </div>
            <div className="title">
              <h2>
                Tracks
              </h2>
              <div className="main-separator-line"></div>
            </div>
          
          <div className="track-container">
            {trackSearch.map(valor =>{
              let minutes = Math.floor(valor.duration_ms / 60000);
              let seconds = Math.round((valor.duration_ms - minutes * 60000)/1000);
              if(seconds<10){
                seconds=`0${seconds}`
              }
              return(
                <Track
                  artistName = {valor.artists[0].name}
                  albumName = {valor.album.name}
                  albumCover =  ""
                  trackTitle = {valor.name}
                  track_id = {valor.id}
                  duration = {`${minutes}:${seconds}`}
                > 
                </Track>
              )
            })}
          </div> */}
        </div>
      )
    }
    else{
      return(
        <div></div>
      )
    }}

  }

    return(
      <>
        <div className="App">
          <div>
            <div className ="form">
                <input 
                onChange={e =>setQuery(e.target.value)}
                type="text"
                name="searchBar"
                id="searchBar"
                placeholder="Search for one awesome Artist"
                />
                <Link  to={`/search/${query}`}>
                  <FaSearch  id="searchBtn" onClick={doSearch}/>
                </Link>
            </div> 
          </div>
        </div>
        <Routes>
          <Route path = "/:query/*" element = {<SearchResult />} />
        </Routes>
      </>
    )

}



