import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "../Header/Header";
import Profile from "../Profile/Profile";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Bookmark from "../Bookmark/Bookmark";
import { AuthContext } from "../../contexts/spotifyContext";
import {
  getAccessToken,
  refreshAccessToken,
  getToken,
} from "../../utils/SpotifyApi";

function App() {
  const [accessToken, setAccessToken] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Generate a random string for the code_verifier
  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  // Generates the code challenge from the code verifier
  const generateCodeChallenge = async (codeVerifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = new Uint8Array(hashBuffer);
    return base64UrlEncode(hashArray);
  };

  // Base64 URL Encoding function
  const base64UrlEncode = (array) => {
    return btoa(String.fromCharCode.apply(null, array))
      .replace(/\+/g, "-") // Replace "+" with "-"
      .replace(/\//g, "_") // Replace "/" with "_"
      .replace(/=+$/, ""); // Remove any trailing "=" padding
  };

  const handleSpotifyLogin = async () => {
    const codeVerifier = generateRandomString(64); // Generate a random code_verifier
    const codeChallenge = await generateCodeChallenge(codeVerifier); // Generate code_challenge

    // Store the code_verifier for later use (for token exchange)
    localStorage.setItem("code_verifier", codeVerifier);

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    // const redirectUri = encodeURIComponent("http://localhost:3000/callback");
    const redirectUri = encodeURIComponent(
      process.env.NODE_ENV === "production"
        ? "https://lupesanchez24.github.io/playlist-frontend/callback"
        : "http://localhost:3000/callback"
    );
    const scope = "user-library-read user-library-modify";

    // Build the authorization URL
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    // Redirect the user to Spotify's authorization page
    window.location.href = authUrl;
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    //localStorage.removeItem("spotify_access_token");
    setAccessToken(null);
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
  };

  // Handle the callback after user logs from spotify account
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");

    if (authorizationCode) {
      getToken(authorizationCode)
        .then((accessToken) => {
          console.log("Access token received:", accessToken);

          localStorage.setItem("spotify_access_token", accessToken);
        })
        .catch((error) => {
          console.error("Failed to get access token:", error);
        });
    }
  }, [navigate]);

  useEffect(() => {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (accessToken) {
      setAccessToken(accessToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    getAccessToken();
    refreshAccessToken();
  });

  useEffect(() => {
    if (isLoggedIn) {
      const token = getAccessToken();
      if (token) {
        fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .catch((err) => console.error("Error fetching user data:", err));
      }
    }
  }, [isLoggedIn]);

  return (
    <div className="page">
      <AuthContext.Provider
        value={{ accessToken, setAccessToken, loading, isLoggedIn }}
      >
        <div className="page__content">
          <Header
            handleLogout={handleLogout}
            handleSpotifyLogin={handleSpotifyLogin}
          />
          <Routes>
            <Route path="/playlist-frontend" element={<Main />} />
            <Route
              path="/callback"
              element={<Profile accessToken={accessToken} />}
            />
            <Route
              path="/bookmark-page"
              element={<Bookmark accessToken={accessToken} />}
            />
          </Routes>

          <Footer />
        </div>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
