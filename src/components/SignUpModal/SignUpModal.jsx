import { useState, useEffect } from "react";

import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./SignUpModal.css";

const SignUpModal = ({ closeActiveModal, isOpen }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [avatarUrl, setAvatarUrl] = useState("");
  const [data, setData] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
    avatarUrl: "",
  });

  const validateForm = () => {
    let isValid = true;
    let errors = {
      email: "",
      password: "",
      name: "",
      avatarUrl: "",
    };

    if (!name) {
      errors.name = "Name is required.";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required.";
      isValid = false;
    }

    if (!email) {
      errors.email = "Email is required.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      handleRegistration({ name, email, password });
    }
  };

  useEffect(() => {
    setData({ name: "", email: "", avatar: "", password: "" });
  }, [isOpen]);

  const handleNameChange = (e) => setName(e.target.value);
  //const handleUrlChange = (e) => setAvatarUrl(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEmailchange = (e) => setEmail(e.target.value);

  return (
    <ModalWithForm
      title="Sign Up"
      buttonText="Sign Up"
      isOpen={isOpen}
      onClose={closeActiveModal}
      onSubmit={handleSubmit}
    >
      <label htmlFor="email" className="modal__label ">
        Email *
        <input
          type="email"
          className={`modal__input modal__input_signup ${
            errors.email ? "modal__input_error" : ""
          }`}
          id="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailchange}
        ></input>
        {errors.email && <span className="modal__error ">{errors.email}</span>}
      </label>
      <label htmlFor="password" className="modal__label ">
        Password *
        <input
          type="password"
          className={`modal__input modal__input_signup ${
            errors.password ? "modal__input_error" : ""
          }`}
          id="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        ></input>
        {errors.email && (
          <span className="modal__error ">{errors.password}</span>
        )}
      </label>

      <label htmlFor="name" className="modal__label">
        Name *
        <input
          type="text"
          className={`modal__input modal__input_signup ${
            errors.name ? "modal__input_error" : ""
          }`}
          id="name"
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
        ></input>
        {errors.name && <span className="modal__error ">{errors.name}</span>}
      </label>
    </ModalWithForm>
  );
};

export default SignUpModal;
