import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/spotifyContext";

function SideBar() {
  //const [accessToken, setAccessToken] = useState(null);
  const [userData, setUserData] = useState({
    display_name: "",
    images: [],
  });
  const accessToken = localStorage.getItem("spotify_access_token");
  useEffect(() => {
    // const accessToken = localStorage.getItem("spotify_access_token");
    console.log(accessToken);
    if (accessToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData({
            display_name: data.display_name,
            images: data.images,
          });
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [accessToken]);

  return (
    <div className="sidebar">
      <div className="sidebar__user">
        <img
          src={userData.images[0]?.url}
          alt="user image"
          className="sidebar__user_avatar"
        ></img>
        <p className="sidebar__user_username">{userData.display_name}</p>
      </div>
      <div className="sidebar__option">
        <Link to="/bookmark-page">
          <p className="sidebar__option_like">Bookmark Albums</p>
        </Link>
      </div>
    </div>
  );
}

export default SideBar;
