import "./CardAlbum.css";
import image from "../../assets/song-picture.jpg";
import unlike from "../../assets/unlike.svg";
function CardAlbum() {
  return (
    <div className="card-container">
      <li className="card">
        <img className="card__image" src={image} alt="song image" />
        <div className="card__description">
          <h2 className="card__name"> Album Name</h2>
          <img className="card__like-btn" src={unlike} alt="" />
        </div>
      </li>
      <li className="card">
        <img className="card__image" src={image} alt="song image" />
        <div className="card__description">
          <h2 className="card__name"> Album Name</h2>
          <img className="card__like-btn" src={unlike} alt="" />
        </div>
      </li>
      <li className="card">
        <img className="card__image" src={image} alt="song image" />
        <div className="card__description">
          <h2 className="card__name"> Album Name</h2>
          <img className="card__like-btn" src={unlike} alt="" />
        </div>
      </li>
      <li className="card">
        <img className="card__image" src={image} alt="song image" />
        <div className="card__description">
          <h2 className="card__name"> Album Name</h2>
          <img className="card__like-btn" src={unlike} alt="" />
        </div>
      </li>
    </div>
  );
}

export default CardAlbum;
