import './App.css';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ArtistPage, AlbumPage , Library, Releases, Header} from './components';
import { Search } from './pages/Search';

import {AuthContextProvider} from "./contexts/AuthContext"

function App() { 
  return (
    <>
    <BrowserRouter>
      <AuthContextProvider>
        <Header/> 
        <Routes>
            <Route path = "/" element = {<Home />} />
            <Route path = "/library/*" element = {<Library />} />
            <Route path = "/releases/*" element = {<Releases />} />
            <Route path = "/login" element = {<Login />} />
            <Route path = "/search/*" element = {<Search />} />
            <Route path = "/artist/:artist_id/*" element = {<ArtistPage />} />
            <Route path = "/album/:album_id/*" element = {<AlbumPage />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
    </>
  );
}

export default App;
