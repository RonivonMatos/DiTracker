import "./styles.css"
import { Album_Folder } from '../Album_Folder';
import { useEffect, useState } from "react";
import { Album_Page } from "../Album_Page";
import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import {spotifyApi} from "../../services/network/spotify-api/spotify-api";

export function Artist_Page(){

    const [artistAlbums, setArtistAlbums] = useState([]);
    const [artistSingles, setArtistSingles] = useState([]);
    const [artistComp, setArtistComp] = useState([]);
    
    const {
      artist_id
  } = useParams();
    
  const getInfo = async () => {
      await spotifyApi.getArtistAlbums(artist_id, {album_type : 'album'})
      .then(function(data) {
        console.log(`Search Albums by id\n`, data.body.items);
        setArtistAlbums(data.body.items);
      }, function(err) {
        console.error(err);
      });

      await spotifyApi.getArtistAlbums(artist_id, {album_type : 'single'})
      .then(function(data) {
        console.log(`Search Albums by {id\n`, data.body.items);
        setArtistSingles(data.body.items.slice(0,5));
      }, function(err) {
        console.error(err);
      });

      await spotifyApi.getArtistAlbums(artist_id, {album_type : 'compilation'})
      .then(function(data) {
        console.log(`Search Albums by {id}\n`, data.body.items);
        setArtistComp(data.body.items.slice(0,5));
      }, function(err) {
        console.error(err);
      });

  }

  useEffect(() => {
    getInfo()
  },[]); 

    return(
      <div>
          <div className="title">
            <h2>
              Albums...
            </h2>
            <div className="main-separator-line"></div>
          </div>

          <div className="grid-container">
          {artistAlbums.slice(0,5).map(valor =>{
              if(valor !== null){
                return(
                    <div key={valor.id}>
                        <Link to={`/album/${valor.id}`}>
                            <Album_Folder
                            artistName = {valor.artists[0].name}
                            albumName = {valor.name}
                            albumCover = {valor.images[0] !== null ? valor.images[0].url : ""}
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
              Singles...
            </h2>
            <div className="main-separator-line"></div>
          </div>

          <div className="grid-container">
          {artistSingles.map(valor =>{
              if(valor !== null){
                return(
                    <div key={valor.id}>
                        <Link to={`/album/${valor.id}`}>
                            <Album_Folder
                            artistName = {valor.artists[0].name}
                            albumName = {valor.name}
                            albumCover = {valor.images[0] !== null ? valor.images[0].url : ""}
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
              Compilations...
            </h2>
            <div className="main-separator-line"></div>
          </div>

          <div className="grid-container">
          {artistComp.map(valor =>{
              if(valor !== null){
                return(
                    <div key={valor.id}>
                        <Link to={`/album/${valor.id}`}>
                            <Album_Folder
                            artistName = {valor.artists[0].name}
                            albumName = {valor.name}
                            albumCover = {valor.images[0] !== null ? valor.images[0].url : ""}
                            album_id = {valor.id}
                            >
                            </Album_Folder>
                        </Link>
                    </div>
                )
              }
            })}
          </div>
        </div>
    )

}