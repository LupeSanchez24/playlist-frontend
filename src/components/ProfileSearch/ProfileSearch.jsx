import "./ProfileSearch.css";

function ProfileSearch() {
  return (
    <div className="profile__search_music">
      <label className="input" htmlFor="myInput">
        Search :
        <input
          type="text"
          id="myInput"
          className="input__search"
          //value={searchInput}
          // onChange={handleChange}
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
      <section></section>
    </div>
  );
}

export default ProfileSearch;
