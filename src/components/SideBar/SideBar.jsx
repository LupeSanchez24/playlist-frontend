import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";
import { Link } from "react-router-dom";
import { checkResponse, SPOTIFY_URL, getProfile } from "../../utils/SpotifyApi";

function SideBar() {
  //const [accessToken, setAccessToken] = useState(null);
  const [userData, setUserData] = useState({
    display_name: "",
    images: [],
  });
  useEffect(() => {
    const accessToken = localStorage.getItem("spotify_access_token");

    if (accessToken) {
      getProfile(accessToken)
        .then((data) => {
          setUserData({
            display_name: data.display_name,
            images: data.images,
          });
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__user">
        <img
          src={userData.images[0]?.url}
          alt="user image"
          className="sidebar__user-avatar"
        ></img>
        <p className="sidebar__user-username">{userData.display_name}</p>
      </div>
      <div className="sidebar__option">
        <Link to="/bookmark-page">
          <p className="sidebar__option_bookmark">Bookmark Albums</p>
        </Link>
      </div>
    </div>
  );
}

export default SideBar;
