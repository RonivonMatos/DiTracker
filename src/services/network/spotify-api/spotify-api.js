/**
 * @see http://michaelthelin.se/spotify-web-api-node/
 * @see https://github.com/thelinmichael/spotify-web-api-node
 */

import SpotifyWebApi from 'spotify-web-api-node'

//   const clientId = process.env.SPOTIFY_CLIENT_ID 
//   const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
const clientId =  "27f9689a843344a8ac1fd460366552b6";
const clientSecret =  "56ef3c80b54942c0a90e3ae43af3aeaf";
//const redirectUri = process.env.CALLBACK_URL


 export const spotifyApi = new SpotifyWebApi({
   clientId: clientId,
   clientSecret: clientSecret,
   redirectUri: "http://localhost/3000"
 })

export const getToken = async () => {
  const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
          'Content-Type' : 'application/x-www-form-urlencoded', 
          'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
  });
  const data = await result.json();
  console.log(data.access_token)
  spotifyApi.setAccessToken(data.access_token);
  return data.access_token;
}

export const token = setInterval(getToken(), 3600000);
