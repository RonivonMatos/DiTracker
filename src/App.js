import './App.css';

import { Home } from './pages/Home';
import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import {spotifyApi} from "./services/network/spotify-api/spotify-api";
import { Artist_Page, Album_Page } from './components';
import { Search } from './pages/Search';

spotifyApi.setAccessToken("BQCWMyyWtGPwtcGKKFParNMNtdBPKyyKuJZeuJ_vLJZOU79pBL1cUNZR8ITqJoRCtveBOkLX88pw-ypLmkY");

function App() { 
  return (
    <>
    <header>
      <div className="header">
          <div className="logo" >
            <a  href="/">
              <h1>
                DiTracker
              </h1>
            </a>
          </div>
          <div className='nav'>
            <a href="/">
              <h3>
                Home 
              </h3>
            </a>
            <a  href="/search">
              <h3>
                Search
              </h3>
            </a>
          </div>
      </div>
    </header>
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/search/*" element = {<Search />} />
        <Route path = "/artist/:artist_id/*" element = {<Artist_Page />} />
        <Route path = "/album/:album_id/*" element = {<Album_Page />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
