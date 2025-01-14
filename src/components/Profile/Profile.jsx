import "./Profile.css";
import SideBar from "../SideBar/SideBar";
import { useState } from "react";
import { searchAlbums } from "../../utils/SpotifyApi";

function Profile() {
  const [searchInput, setSearchInput] = useState("");
  const [albums, setAlbums] = useState([]);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem("spotify_access_token");

    if (accessToken && searchInput.trim() !== "") {
      searchAlbums(searchInput, accessToken)
        .then((data) => {
          setAlbums(data);
        })
        .catch((err) => {
          console.error("Error fetching albums:", err);
        });
    }
  };

  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar />
      </section>
      <div className="profile__search">
        <form className="profile__search_input" onSubmit={handleSearch}>
          <label htmlFor="myInput">Search:</label>
          <input
            type="text"
            id="myInput"
            className="profile__search_album"
            value={searchInput}
            onChange={handleChange}
            placeholder="Search Album"
          />
          <button className="profile__search_button" type="submit">
            Search
          </button>
        </form>

        <section className="profile__album">
          {albums.length > 0 ? (
            albums.map((album) => (
              <div key={album.id} className="profile__album_card">
                <img
                  src={album.images[0]?.url || "default-image-url.jpg"}
                  alt={album.name}
                  className="profile__album_image"
                />
                <p className="profile__album_name">{album.name}</p>
                <p className="profile__album_artist">
                  {album.artists[0]?.name || "Unknown Artist"}{" "}
                </p>
              </div>
            ))
          ) : (
            <p className="profile__album_placeholder">
              No albums to display at the moment. Try searching for some albums!
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;
