import './App.css';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Artist_Page, Album_Page , Library, Releases, Header} from './components';
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
            <Route path = "/artist/:artist_id/*" element = {<Artist_Page />} />
            <Route path = "/album/:album_id/*" element = {<Album_Page />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
    </>
  );
}

export default App;
