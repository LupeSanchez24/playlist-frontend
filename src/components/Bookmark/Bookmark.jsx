import "./Bookmark.css";
import bookmarkPageImage from "../../assets/bookmark-page.jpg";
import image from "../../assets/song-picture.jpg";
import unlike from "../../assets/unlike.svg";
import unbookmark from "../../assets/bookmark.svg";

const bookmark = () => {
  return (
    <div className="bookmark">
      <img
        className="bookmark__image"
        src={bookmarkPageImage}
        alt="Image of the bookmark page"
      />
      <h2 className="bookmark__title">Bookmark Albums</h2>
      <div className="bookmark__card">
        <li className="card">
          <img className="card__image" src={image} alt="song image" />
          <img
            className="card__bookmark"
            src={unbookmark}
            alt="bookmark image"
          />
          <div className="card__description">
            <h2 className="card__name"> Album Name</h2>
            <img className="card__like-btn" src={unlike} alt="" />
          </div>
        </li>
      </div>
    </div>
  );
};

export default bookmark;
