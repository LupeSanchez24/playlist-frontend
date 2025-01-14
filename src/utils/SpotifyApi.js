export const SPOTIFY_URL = "https://api.spotify.com/v1";

export const APP_URL = "https://lupesanchez24.github.io/playlist-frontend";

export function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error:${res.status}`);
}

//get token
export const getToken = (authorizationCode) => {
  const codeVerifier = localStorage.getItem("code_verifier");
  console.log(codeVerifier);
  const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri =
    import.meta.env.MODE === "production"
      ? `${APP_URL}/#/callback`
      : "http://localhost:3000/#/callback";

  const body = new URLSearchParams({
    client_id: client_id,
    grant_type: "authorization_code",
    code: authorizationCode,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  })
    .then((response) => {
      //  console.log("Token Request Response:", response);
      return checkResponse(response);
    })
    .then((data) => {
      if (data.access_token) {
        localStorage.setItem("spotify_access_token", data.access_token);
        localStorage.setItem("spotify_refresh_token", data.refresh_token);
        localStorage.setItem(
          "spotify_token_expiration",
          Date.now() / 1000 + 3600
        );
        return data.access_token;
      }
    });
};

//refresh token
/*export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("spotify_refresh_token");
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri =
    import.meta.env.MODE === "production"
      ? `${APP_URL}/#/callback`
      : "http://localhost:3000/#/callback";

  if (!refreshToken) {
    console.error("No refresh token available");
    return null;
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem("spotify_access_token", data.access_token);
      localStorage.setItem(
        "spotify_token_expiration",
        Date.now() + data.expires_in * 1000
      );
      console.log("Access token refreshed:", data.access_token);
      return data.access_token;
    } else {
      console.error("Failed to refresh access token:", data);
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};*/

// profile user data from spotify account
export const getProfile = () => {
  const accessToken = localStorage.getItem("spotify_access_token");
  console.log(accessToken);
  return fetch(`${SPOTIFY_URL}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(checkResponse)
    .then((data) => {
      console.log(data);

      const userNameElem = document.getElementById("userName");
      const userImageElem = document.getElementById("userImage");

      if (userNameElem && userImageElem) {
        userNameElem.textContent = data.display_name;
        userImageElem.src = data.images[0]?.url || "default-image.png";
      }

      return data;
    });
};

//save albums from spotify account

export const getSavedAlbums = (accessToken) => {
  console.log(accessToken);
  return fetch(`${SPOTIFY_URL}/me/albums`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then(checkResponse)
    .then((data) => {
      const albums = data.items
        .filter((item) => item && item.album)
        .map((item) => ({
          id: item.album.id,
          name: item.album.name,
          image: item.album.images[0]?.url,
          artists:
            item.album.artists.length > 0
              ? item.album.artists[0].name
              : "Unknown Artist",
        }));
      console.log(data.items);
      return albums;
    });
};

//search albums
export const searchAlbums = async (searchQuery, accessToken) => {
  return fetch(
    `${SPOTIFY_URL}/search?type=album&q=${encodeURIComponent(searchQuery)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then(checkResponse)
    .then((data) => {
      return data.albums.items;
    });
};
