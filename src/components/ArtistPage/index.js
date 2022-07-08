import "./styles.css"
import { useEffect, useState } from "react";
import { AlbumFolder, DiscographyPage } from "..";
import { Route, Routes, Link, useParams } from 'react-router-dom';
import {spotifyApi} from "../../services/network/spotify-api/spotify-api";

export function ArtistPage(){

    const [artistAlbums, setArtistAlbums] = useState([]);
    const [artistSingles, setArtistSingles] = useState([]);
    const [artistComp, setArtistComp] = useState([]);

    const {
      artist_id
    } = useParams();
    
  const getInfo = async () => {
      await spotifyApi.getArtistAlbums(artist_id, {country : 'BR', album_type : 'album'})
      .then(function(data) {
        console.log(`Search Albums by id\n`, data.body.items);
        setArtistAlbums(data.body.items);
      }, function(err) {
        console.error(err);
      });

      await spotifyApi.getArtistAlbums(artist_id, {country : 'BR', album_type : 'single'})
      .then(function(data) {
        console.log(`Search Albums by {id\n`, data.body.items);
        setArtistSingles(data.body.items);
      }, function(err) {
        console.error(err);
      });

      await spotifyApi.getArtistAlbums(artist_id, {country : 'BR', album_type : 'compilation'})
      .then(function(data) {
        console.log(`Search Albums by {id}\n`, data.body.items);
        setArtistComp(data.body.items);
      }, function(err) {
        console.error(err);
      });

  }

  useEffect(() => {
    getInfo()
  },[]); 

  function MainArtistPage(){
    return(
      <div>
        <div className="title">
            <h2>
              Albums
            </h2>
            <Link to={`discography/album`}>
              <h3>
                SEE DISCOGRAPHY
              </h3>
            </Link>
          </div>

          <div className="grid-container">
          {artistAlbums.slice(0,4).map(valor =>{
              if(valor !== null){
                return(
                    <div key={valor.id}>
                            <AlbumFolder
                            artistName = {valor.artists[0].name}
                            albumName = {valor.name}
                            albumCover = {valor.images[0] !== null ? valor.images[0].url : ""}
                            album_id = {valor.id}
                            >
                            </AlbumFolder>
                    </div>
                )
              } 
            })}
          </div>

          <div className="title">
            <h2> 
              Singles
            </h2>
            <Link to={`discography/single`}>
              <h3>
                SEE DISCOGRAPHY
              </h3>
            </Link>
          </div>

          <div className="grid-container">
          {artistSingles.slice(0,4).map(valor =>{
              if(valor !== null){
                return(
                    <div key={valor.id}>
                            <AlbumFolder
                            artistName = {valor.artists[0].name}
                            albumName = {valor.name}
                            albumCover = {valor.images[0] !== null ? valor.images[0].url : ""}
                            album_id = {valor.id}
                            artist_id = {valor.artists[0].id}
                            >
                            </AlbumFolder>
                    </div>
                )
              }
            })}
          </div>
      </div>
    )
  }

    return(
      <div>
          <Routes>
            <Route path = "/" element = {<MainArtistPage />} />
            <Route path = "/discography/:type/*" element = {<DiscographyPage />} />
          </Routes>
        </div>
    )
}