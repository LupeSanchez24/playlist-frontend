import { useState } from "react";
import "./Main.css";
import CardAlbum from "../CardAlbum/CardAlbum";

function Main() {
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };
  return (
    <main>
      <label className="input" htmlFor="myInput">
        Search :
        <input
          type="text"
          id="myInput"
          className="input__search"
          value={searchInput}
          onChange={handleChange}
          placeholder="Search Artist"
        />
        <button
          className="input__button"
          onClick={() => {
            console.log("Clicked Button");
          }}
        >
          Search
        </button>
      </label>
      <section>
        <CardAlbum />
      </section>
    </main>
  );
}

export default Main;
