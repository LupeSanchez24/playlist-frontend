import user from "../../assets/user-image.svg";
import "./SideBar.css";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <div className="sidebar">
      <div className="sidebar__user">
        <img src={user} alt="user image" className="sidebar__user_avatar"></img>
        <p className="sidebar__user_username">User name</p>
      </div>

      <div className="sidebar__options">
        <Link to="/bookmark-page">
          <p className="sidebar__options_like">Bookmark Albums</p>
        </Link>
        <p className="sidebar__options_logout">Log out</p>
      </div>
    </div>
  );
}

export default SideBar;
