import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "../Header/header";
import Profile from "../Profile/Profile";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import SignUpModal from "../SignupModal/SignUpModal";
import LogInModal from "../LogInModal/LogInModal";
import Bookmark from "../Bookmark/Bookmark";

function App() {
  const [activeModal, setActiveModal] = useState("");

  const closeActiveModal = () => {
    setActiveModal("");
  };
  const handleSignUpClick = () => {
    setActiveModal("signup-modal");
  };

  const handleLogInClick = () => {
    setActiveModal("login-modal");
  };
  useEffect(() => {
    if (!activeModal) return;
    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        closeActiveModal();
      }
    };

    document.addEventListener("keydown", handleEscClose);

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [activeModal]);

  return (
    <div className="page">
      <div className="page__content">
        <Header
          handleSignUpClick={handleSignUpClick}
          handleLogInClick={handleLogInClick}
        />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookmark-page" element={<Bookmark />} />
        </Routes>

        <Footer />
      </div>
      <ModalWithForm />
      {activeModal === "signup-modal" && (
        <SignUpModal
          activeModal={activeModal}
          closeActiveModal={closeActiveModal}
          isOpen={activeModal === "signup-modal"}
        />
      )}
      {activeModal === "login-modal" && (
        <LogInModal
          activeModal={activeModal}
          closeActiveModal={closeActiveModal}
          isOpen={activeModal === "login-modal"}
        />
      )}
    </div>
  );
}

export default App;
