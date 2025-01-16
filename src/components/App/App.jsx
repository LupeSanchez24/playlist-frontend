import { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Header from "../Header/Header";
import Profile from "../Profile/Profile";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Bookmark from "../Bookmark/Bookmark";
import { AuthContext } from "../../contexts/spotifyContext";
import { getToken, APP_URL } from "../../utils/SpotifyApi";

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
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  const handleSpotifyLogin = async () => {
    try {
      const codeVerifier = generateRandomString(64);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      localStorage.setItem("code_verifier", codeVerifier);
      console.log(codeVerifier);

      const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      if (!client_id) {
        throw new Error("Spotify Client ID is missing.");
      }

      const redirectUri =
        import.meta.env.MODE === "production"
          ? `${APP_URL}/#/callback`
          : "http://localhost:3000/#/callback";

      const scope = "user-library-read user-library-modify";

      const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=${scope}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

      console.log("Redirect URI used:", redirectUri);

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error during Spotify login:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_token_expiration");
    setAccessToken(null);
    setIsLoggedIn(false);
    setUserData(null);
    window.location.href = "/";
  };

  // Handle the callback after user logs from spotify account
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");
    console.log("Authorization Code:", authorizationCode);

    if (authorizationCode) {
      getToken(authorizationCode)
        .then((accessToken) => {
          if (accessToken) {
            console.log("Access token received:", accessToken);
            localStorage.setItem("spotify_access_token", accessToken);
            setAccessToken(accessToken); // Update the state for user data and routing
            setIsLoggedIn(true);
            navigate("/callback");
          }
        })
        .catch((error) => {
          console.error("Failed to get access token:", error);
        });
    }
  }, []);

  //this is for access toeken

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("spotify_access_token");
      if (accessToken) {
        setAccessToken(accessToken);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="page">
      <AuthContext.Provider
        value={{ accessToken, isLoggedIn, setIsLoggedIn, setAccessToken }}
      >
        <div className="page__content">
          <Header
            handleLogout={handleLogout}
            handleSpotifyLogin={handleSpotifyLogin}
          />

          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/callback" element={<Profile />} />
            <Route path="/bookmark-page" element={<Bookmark />} />
          </Routes>

          <Footer />
        </div>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
