import "./ProfileAlbum.css";
import image from "../../assets/song-picture.jpg";
import unlike from "../../assets/unlike.svg";
function ProfileAlbum() {
  return (
    <div className="profile-album">
      <li className="album">
        <h2 className="album__name"> Album Name</h2>
        <img className="album__image" src={image} alt="song image" />
        <img className="album__like-btn" src={unlike} alt="unlike" />
      </li>
    </div>
  );
}

export default ProfileAlbum;
