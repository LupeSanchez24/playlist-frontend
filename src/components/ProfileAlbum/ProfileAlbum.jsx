import "./ProfileAlbum.css";
import image from "../../assets/song-picture.jpg";
import unlike from "../../assets/unlike.svg";
import unbookmark from "../../assets/bookmark.svg";
function ProfileAlbum() {
  return (
    <div className="album__profile">
      <li className="album__card">
        <img
          className="album__bookmark"
          src={unbookmark}
          alt="bookmark image"
        />
        <img className="album__image" src={image} alt="song image" />

        <div className="album__description">
          <h2 className="album__name"> Album Name</h2>
          <img className="album__like-btn" src={unlike} alt="unlike" />
        </div>
      </li>
    </div>
  );
}

export default ProfileAlbum;
