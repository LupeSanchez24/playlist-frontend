import { useEffect, useState, useContext } from "react";
import home from "../../assets/home.svg";
//import { Link } from "react-router-dom";
import "./Header.css";
import { AuthContext } from "../../contexts/spotifyContext";

function Header({ handleSpotifyLogin, handleLogout }) {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <header className="header">
      <img className="header__home" src={home} alt="home logo" />
      <div className="header__button">
        {/*   {isLoggedIn ? (
          <>
            <button
              type="button"
              className="header__spotify-btn"
              onClick={handleSpotifyLogin}
            >
              Login with Spotify
            </button>
          </>
        ) : (
          <button
            type="button"
            className="header__logout-btn"
            onClick={handleLogout}
          >
            Log out
        </button> 
        )} */}

        <button
          type="button"
          className="header__spotify-btn"
          onClick={handleSpotifyLogin}
        >
          Login with Spotify
        </button>
        <button
          type="button"
          className="header__logout-btn"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </header>
  );
}

export default Header;
