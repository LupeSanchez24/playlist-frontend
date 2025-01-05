import { useState, useEffect, useContext } from "react";
import "./Main.css";
import homepage from "../../assets/homepage.jpg";

function Main() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();

      if (currentHour < 12) {
        return "good morning";
      } else if (currentHour < 18) {
        return "good afternoon";
      } else {
        return "good evening";
      }
    };

    setGreeting(getGreeting());
  }, []);
  return (
    <main>
      <div className="main__title">Hello, {greeting} !</div>
      <img className="main__image" alt="homepage image" src={homepage} />
    </main>
  );
}

export default Main;
