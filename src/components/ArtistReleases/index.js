import "./styles.css"
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Album_Page } from "../../components";

import { database } from "../../services/network/firebase/firebase";

export function ArtistReleases(props){
    const [artistReleases, setArtistReleases] = useState();
    const {
        artist_id
    } = useParams();

    const {
        artist_id2,
    } = props;

    useEffect(()=>{
        const albumRef = database.ref(`releases/${artist_id}/albums`);
        albumRef.once("value", artist => {
          const artistRelease = artist.val()
          const parsedAlbumsRelease = Object.entries(artistRelease).map(([key, value]) => {
              return {
                  id: key,
                  listened: false,
                  cover: value.cover,
                  name: value.name,
                  type: value.type,
                  release: value.release,
                  total_tracks: value.total_tracks,
              }
          }) 
          setArtistReleases(parsedAlbumsRelease);
          console.log(parsedAlbumsRelease)
        })
    },[]) 
    return(
        <div id="artistReleases">
        {
            artistReleases ?
            artistReleases.map(valor =>{
                if(valor !== null){
                  return(
                      <div key={valor.id}>
                        <Album_Page
                        album_id2 = {valor.id}
                        albumCover = {valor.cover}
                        albumName = {valor.name}
                        albumType= {valor.type}
                        release= {valor.release}
                        totalTracks = {valor.total_tracks}
                        /> 
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