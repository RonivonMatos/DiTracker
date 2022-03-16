import { useEffect, useState } from 'react';

import { Artist_Page, Album_Page, Artist_Folder, Album_Folder, Track } from '../components';
import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import {spotifyApi} from "../services/network/spotify-api/spotify-api";
import { FaSearch } from "react-icons/fa";


// spotifyApi.setAccessToken("BQC1QjAkP1DSbv9FaabaDATc9bL3d12eNo0SYTg0UdZz1EdJezu0nCowsAQ38wj5pdrmrWq8bBRHlAjNbWE");

export function Search() {
  
  const [artistSearch, setArtistSearch] = useState([]);
  const [albumSearch, setAlbumSearch] = useState([]);
  const [trackSearch, setTrackSearch] = useState([]);

  const [query, setQuery] = useState('');
  const [show, setShow] = useState(false);

  //const query = useParams();

  const doSearch = async () => {
    //spotifyApi.setAccessToken("BQBj0Ioaw6iQLKa-g4Jm_NC7-pUNftpXol0uPwUdmrr2RXP4McrvanzB6Iz-89ZzoNj18RAwIiTN3EsvgHc");
    if(query!==''){
      await spotifyApi.searchArtists(query)
      .then(function(data) {
        console.log('Search artists by "Iron Maiden:\n', data.body.artists.items);
        setArtistSearch(data.body.artists.items.slice(0,5));
      }, function(err) {
        console.error(err);
      });
      
      await spotifyApi.searchTracks(query)
      .then(function(data) {
        console.log(`Search by ${query}\n`, data.body.tracks.items);
        setTrackSearch(data.body.tracks.items.slice(0,5));
      }, function(err) {
        console.error(err);
      });

      await spotifyApi.searchAlbums(query, {album_type : 'album'})
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
    return(
      <div>
            <div id="" className="title">
              <h2>
                Top artists from your search...
              </h2>
              <div className="main-separator-line"></div>
            </div>
            
            <div className="grid-container">
    
              {artistSearch.slice(0,5).map(valor =>{
                if(valor !== null && valor.images[0].url !== undefined ){
                  return(
                    <div key={valor.id}>
                      <Link to={`/artist/${valor.id}`}>
                        <Artist_Folder
                          artistName = {valor.name}
                          artistPicture = {valor.images[0].url === undefined ? "" : valor.images[0].url}
                          artist_id = {valor.id}
                        >
                        </Artist_Folder>
                      </Link>
                    </div>
                  );
                } 
              })}


            </div>

            <div className="title">
              <h2>
                Albums...
              </h2>
              <div className="main-separator-line"></div>
            </div>

            <div className="grid-container">
            {albumSearch.map(valor =>{
                if(valor !== null){
                  return(
                    <div key={valor.id}>
                      <Link to={`/album/${valor.id}`}>
                        <Album_Folder
                          artistName = {valor.artists[0].name}
                          albumName = {valor.name}
                          albumCover = {valor.images[0].url}
                          album_id = {valor.id}
                        >
                        </Album_Folder>
                      </Link>
                    </div>
                  )
                }
              })}
            </div>
            <div className="title">
              <h2>
                Tracks...
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
          </div>
        </div>
    )
  }

    return(
      <>
        <div className="App">
        <div>
          <form>
              <input onChange={e => setQuery(e.target.value)} 
              type="text"
              name="searchBar"
              id="searchBar"
              placeholder="Search for one awesome Artist/Album/Song"
              />
              <Link to={`/search/${query}`}>
                <FaSearch onClick={doSearch}/>
              </Link>

            </form>
        </div>
        </div>
        <Routes>
          {/* <Route path = "/search" element = {<Search />} /> */}
          <Route path = "/:query/*" element = {<SearchResult />} />
        </Routes>
      </>
    )

}



