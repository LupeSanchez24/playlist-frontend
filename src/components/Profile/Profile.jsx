import "./Profile.css";
import ProfileAlbum from "../ProfileAlbum/ProfileAlbum";
import SideBar from "../SideBar/SideBar";
import ProfileSearch from "../ProfileSearch/ProfileSearch";

function Profile() {
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar />
      </section>
      <section className="profile__main">
        <ProfileSearch />
        <ProfileAlbum />
      </section>
    </div>
  );
}

export default Profile;
