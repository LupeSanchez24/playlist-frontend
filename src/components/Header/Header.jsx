import { useEffect, useState, useContext } from "react";
import home from "../../assets/home.svg";
//import { Link } from "react-router-dom";
import "./Header.css";
import { AuthContext } from "../../contexts/spotifyContext";

function Header({ handleSpotifyLogin, handleLogout }) {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <header className="header">
      <img className="header__image-home" src={home} alt="home logo" />
      <div className="header__button">
        {isLoggedIn ? (
          <>
            <button
              type="button"
              className="header__button-logout"
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        ) : (
          <button
            type="button"
            className="header__button-login"
            onClick={handleSpotifyLogin}
          >
            Login with Spotify
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
