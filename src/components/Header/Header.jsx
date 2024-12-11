import home from "../../assets/home.svg";
import user from "../../assets/user-image.svg";
import { Link } from "react-router-dom";
import "./Header.css";
function Header() {
  return (
    <header className="header">
      <Link to="/">
        <img className="header__logo" src={home} alt="home logo" />
      </Link>
      <div className="header__button">
        <button type="button" className="header__signup-btn">
          SignUp
        </button>
        <button type="button" className="header__login-btn">
          Log In
        </button>
      </div>

      <div className="header__user-container">
        <Link to="/profile">
          <img src={user} alt="user image" className="header__avatar" />
        </Link>
        <p className="header__username">user name</p>
      </div>
    </header>
  );
}

export default Header;
