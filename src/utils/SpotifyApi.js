const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/callback";

//authorization code
export const authOptions = (code) => {
  const body = new URLSearchParams();
  body.append("code", code);
  body.append("redirect_uri", redirect_uri);
  body.append("grant_type", "authorization_code");

  return fetch(`https://accounts.spotify.com/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(client_id + ":" + client_secret),
    },
    body: body.toString(),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.access_token) {
        localStorage.setItem("spotify_access_token", data.access_token);
        localStorage.setItem("spotify_refresh_token", data.refresh_token);
        console.log("Access Token:", data.access_token);
        return data.access_token;
      } else {
        console.error("Error getting access token", data);
      }
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};

//access token
export const getAccessToken = () => {
  const accessToken = localStorage.getItem("spotify_access_token");

  if (accessToken) {
    return accessToken;
  }

  return null;
};

//refresh token
export const refreshAccessToken = () => {
  const refreshToken = localStorage.getItem("spotify_refresh_token");

  if (!refreshToken) {
    console.error("No refresh token available");
    return;
  }

  const body = new URLSearchParams();
  body.append("grant_type", "refresh_token");
  body.append("refresh_token", refreshToken);

  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(client_id + ":" + client_secret),
    },
    body: body.toString(),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.access_token) {
        // Save the new access token and refresh token
        localStorage.setItem("spotify_access_token", data.access_token);
        localStorage.setItem("spotify_refresh_token", data.refresh_token);

        // Save expiration time (typically 3600 seconds or 1 hour from now)
        const expirationTime = Date.now() / 1000 + 3600; // Current time in seconds + 1 hour
        localStorage.setItem("spotify_token_expiration", expirationTime);

        console.log("Refreshed Access Token:", data.access_token);
        return data.access_token;
      } else {
        console.error("Error refreshing access token", data);
      }
    })
    .catch((err) => {
      console.error("Error refreshing token:", err);
    });
};

export const isAccessTokenExpired = () => {
  const expirationTime = localStorage.getItem("spotify_token_expiration");
  const currentTime = Date.now() / 1000;

  return expirationTime && currentTime > expirationTime;
};

//spotify profile user data
export const getProfile = () => {
  const accessToken = localStorage.getItem("spotify_access_token");
  console.log(accessToken);
  fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data); // This is where you get the user data from the API

      const userNameElem = document.getElementById("userName");
      const userImageElem = document.getElementById("userImage");

      if (userNameElem && userImageElem) {
        userNameElem.textContent = data.display_name;
        userImageElem.src = data.images[0]?.url || "default-image.png"; // Fallback image
      }
    })
    .catch((err) => console.error("Error fetching user data:", err));
};

//save albums from spotify account
export const getSavedAlbums = async (accessToken) => {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/albums", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching saved albums");
    }

    const data = await response.json();
    const albums = data.items
      .filter((item) => item && item.album) // Ensure item and item.album are not null or undefined
      .map((item) => ({
        id: item.album.id,
        name: item.album.name,
        image: item.album.images[0]?.url,
      }));
    console.log(data.items);
    return albums;
  } catch (error) {
    console.error("Error fetching saved albums:", error);
    return [];
  }
};
