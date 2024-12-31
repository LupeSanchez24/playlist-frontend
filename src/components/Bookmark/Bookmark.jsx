import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Bookmark.css";
import bookmarkPageImage from "../../assets/bookmark-page.jpg";
import { getSavedAlbums } from "../../utils/SpotifyApi";

const bookmark = ({ accessToken }) => {
  //const [albumIds, setAlbumIds] = useState("");
  const [albumData, setAlbumData] = useState([]);

  //  saved albums from Spotify account
  useEffect(() => {
    const fetchAlbums = async () => {
      if (accessToken) {
        try {
          const albums = await getSavedAlbums(accessToken);
          setAlbumData(albums);
        } catch (error) {
          console.error("Error fetching saved albums:", error);
        }
      }
    };

    fetchAlbums();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      console.log("No access token available");
      return;
    }

    console.log("Access token in Bookmark:", accessToken);
  }, [accessToken]);

  return (
    <div className="bookmark">
      <Link to="/callback">
        <img
          className="bookmark__image"
          src={bookmarkPageImage}
          alt="Image of the bookmark page"
        />
      </Link>
      <h2 className="bookmark__title">Bookmark Albums</h2>
      <div className="bookmark__card">
        {albumData.length > 0 ? (
          albumData.map((album) => (
            <li key={album.id} className="card">
              <img className="card__image" src={album.image} alt={album.name} />
              <div className="card__description">
                <h2 className="card__name">{album.name}</h2>
              </div>
            </li>
          ))
        ) : (
          <p>No albums found.</p>
        )}
      </div>
    </div>
  );
};

export default bookmark;
