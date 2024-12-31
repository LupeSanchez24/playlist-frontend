import "./Profile.css";
import SideBar from "../SideBar/SideBar";
import { useState } from "react";

function Profile() {
  const [searchInput, setSearchInput] = useState("");
  const [albums, setAlbums] = useState([]);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const accessToken = localStorage.getItem("spotify_access_token");

      // Make the API request to search for albums
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=album&q=${encodeURIComponent(
          searchInput
        )}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAlbums(data.albums.items); // Store album search results
      } else {
        console.error("Error fetching album data:", response.status);
      }
    } catch (error) {
      console.error("Error searching albums:", error);
    }
  };
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar />
      </section>
      <div className="profile__search">
        <label className="profile__search_input" htmlFor="myInput">
          Search :
          <input
            type="text"
            id="myInput"
            className="profile__search_album"
            value={searchInput}
            onChange={handleChange}
            placeholder="Search Album"
          />
          <button className="profile__search_button" onClick={handleSearch}>
            Search
          </button>
        </label>

        <section className="profile__album">
          {albums.length > 0 ? (
            albums.map((album) => (
              <div key={album.id} className="profile__album_card">
                <img
                  src={album.images[0]?.url}
                  alt={album.name}
                  className="profile__album_image"
                />
                <p className="profile__album_name">{album.name}</p>
                <p className="profile__album_artist">{album.artists[0].name}</p>
              </div>
            ))
          ) : (
            <p className="Profile__album_placeholder">
              No albums to display at the moment. Try searching for some albums!
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;
