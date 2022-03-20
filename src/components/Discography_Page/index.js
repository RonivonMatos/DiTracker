import "./styles.css"
import { useEffect, useState } from "react";
import { Album_Page, Album_Folder } from "../../components";
import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import {spotifyApi} from "../../services/network/spotify-api/spotify-api";

export function Discography_Page(){

    const [artistAlbums, setArtistAlbums] = useState([]);
    // const [artistSingles, setArtistSingles] = useState([]);
    // const [artistComp, setArtistComp] = useState([]);
    // const [albumTracks, setAlbumTracks] = useState([]);

    const {
      artist_id,
      type
  } = useParams();

  const getAll = () => {
    spotifyApi.getArtistAlbums(artist_id, {limit: 50, country: 'BR', album_type : type})
        .then(function(data) {
        console.log(`Search Albums by {id}\n`, data.body);
        setArtistAlbums(data.body.items);
        }, function(err) {
        console.error(err);
      })
  }
  useEffect(() => {
    getAll()
  },[]); 

    return(
        <div>
          {artistAlbums.map(valor =>{
          if(valor !== null){
            return(
                <div key={valor.id}>
                  <Album_Page
                  album_id2 = {valor.id}
                  albumCover = {valor.images[0] !== null ? valor.images[0].url : ""}
                  albumName = {valor.name}
                  albumType= {valor.album_type}
                  release= {valor.release_date.slice(0,4)}
                  totalTracks = {valor.total_tracks}
                  /> 
                </div>
            )
          } 
        })}
        </div>
    )
}