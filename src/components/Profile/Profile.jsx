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
      <section className="profile__search">
        <ProfileSearch />
      </section>
      <section className="profile__profileAlbum">
        <ProfileAlbum />
      </section>
    </div>
  );
}

export default Profile;
