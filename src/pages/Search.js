import { useNavigate  } from "react-router-dom";

import {  useState } from 'react';

import { ArtistFolder} from '../components';
import { Route, Routes, Link } from 'react-router-dom';
import {spotifyApi} from "../services/network/spotify-api/spotify-api";
import { FaSearch } from "react-icons/fa";
import { database } from "../services/network/firebase/firebase";
import { FaPlus } from 'react-icons/fa';
import { useAuth } from "../hooks/useAuth";

export function Search() {
  const navigate = useNavigate();

  const [artistSearch, setArtistSearch] = useState([]);

  const [query, setQuery] = useState('');
  const {user} = useAuth(); 

  async function addArtist(artistId, artistName, artistPicture){
      const getArtistRef = await database.ref(`artists/${artistId}`).get();
      if (!getArtistRef.exists()){
          const artistRef = database.ref(`artists/${artistId}/`);

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
    }
    else{
      return
    }
  }

  function SearchResult(){
    if(artistSearch[0] != null){
      return(
        <div id="search-result">
            <div className="title">
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
                          <ArtistFolder
                            artistName = {valor.name}
                            artistPicture = {valor.images[0].url === undefined ? "" : valor.images[0].url}
                            artist_id = {valor.id}
                          >
                          </ArtistFolder>
                          <div className="check-listen">
                              <button  
                              className="check-listen-icon" 
                              onClick={()=> {addArtist(valor.id, valor.name, valor.images[0].url === undefined ? "" : valor.images[0].url)}}
                              >
                                  <FaPlus />
                              </button>
                          </div>
                        </div>
                    </div> 
                  );
                } 
              })}
            </div>
        </div>
      )
    }
    else{
      return(
        <div></div>
      )
    }

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
                onKeyDown={(e) => {if(e.key == "Enter"){
                  doSearch();
                  navigate(`${query}`)
                }}}
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



