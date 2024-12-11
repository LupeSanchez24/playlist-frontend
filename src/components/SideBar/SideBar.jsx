import user from "../../assets/user-image.svg";
import "./SideBar.css";

function SideBar() {
  return (
    <div className="sidebar">
      <div className="sidebar__user">
        <img src={user} alt="user image" className="sidebar__user_avatar"></img>
        <p className="sidebar__user_username">User name</p>
      </div>

      <div className="sidebar__options">
        <p className="sidebar__options_like">Liked Albums</p>
        <p className="sidebar__options_bookmark">Bookmark</p>
        <p className="sidebar__options_logout">Log out</p>
      </div>
    </div>
  );
}

export default SideBar;
