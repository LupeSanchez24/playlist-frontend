import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "../Header/Header";
import Profile from "../Profile/Profile";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
//import SignUpModal from "../SignupModal/SignUpModal";
//import LogInModal from "../LogInModal/LogInModal";
import Bookmark from "../Bookmark/Bookmark";
import { AuthContext } from "../../contexts/spotifyContext";
import {
  getAccessToken,
  refreshAccessToken,
  isAccessTokenExpired,
  authOptions,
} from "../../utils/SpotifyApi";

function App() {
  //const [activeModal, setActiveModal] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  /*const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleSignUpClick = () => {
    setActiveModal("signup-modal");
  };

  const handleLogInClick = () => {
    setActiveModal("login-modal");
  };*/

  const handleSpotifyLogin = () => {
    const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent("http://localhost:3000/callback");
    const scope = "user-library-read user-library-modify";
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    setAccessToken(null);
    setUserData(null);
    navigate("/");
  };

  // Fetch access token
  const fetchAccessToken = async () => {
    let token = getAccessToken(); // Try to get the token, it will refresh if expired
    if (isAccessTokenExpired() && token) {
      setLoading(true);
      token = await refreshAccessToken(); // Refresh token if expired
    }
    setAccessToken(token); // Set the (refreshed) token
    setLoading(false);
  };

  useEffect(() => {
    fetchAccessToken(); // Fetch the access token when the component mounts
  }, []);

  useEffect(() => {
    const accessToken = getAccessToken(); // Get the access token (or refresh it if expired)

    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

  //  the user is redirected back
  useEffect(() => {
    console.log("Current URL: ", window.location.search);
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      setLoading(true);

      authOptions(code)
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error during authentication:", error);
          setLoading(false);
        });
    }
  }, []);

  // Fetch user data after login
  useEffect(() => {
    const accessToken = getAccessToken(); // Get the access token (or refresh it if expired)

    if (accessToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }
  }, []);

  return (
    <div className="page">
      <AuthContext.Provider value={{ accessToken, loading, isLoggedIn }}>
        <div className="page__content">
          <Header
            handleLogout={handleLogout}
            handleSpotifyLogin={handleSpotifyLogin}
          />
          <Routes>
            <Route path="/" element={<Main />} />
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
        <ModalWithForm />
        {/*  {activeModal === "signup-modal" && (
          <SignUpModal
            activeModal={activeModal}
            closeActiveModal={closeActiveModal}
            isOpen={activeModal === "signup-modal"}
          />
        )}
        {activeModal === "login-modal" && (
          <LogInModal
            activeModal={activeModal}
            closeActiveModal={closeActiveModal}
            isOpen={activeModal === "login-modal"}
            handlelogin={handlelogin}
          />
        )} */}
      </AuthContext.Provider>
    </div>
  );
}

export default App;
