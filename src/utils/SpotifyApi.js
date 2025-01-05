//token
export const getToken = (authorizationCode) => {
  const codeVerifier = localStorage.getItem("code_verifier");

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: "http://localhost:3000/callback",
      code_verifier: codeVerifier,
    }),
  };

  return fetch("https://accounts.spotify.com/api/token", payload)
    .then((res) => res.json())
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
    })
    .catch((error) => {
      console.error("Error exchanging code for token:", error);
    });
};

//access token
export const getAccessToken = () => {
  const accessToken = localStorage.getItem("spotify_access_token");

  if (accessToken) {
    return accessToken;
  } else {
    console.log("No access token found in localStorage");
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
  const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

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

        const expirationTime = Date.now() / 1000 + 3600;
        localStorage.setItem("spotify_token_expiration", expirationTime);

        // console.log("Refreshed Access Token:", data.access_token);
        return data.access_token;
      } else {
        console.error("Error refreshing access token", data);
      }
    })
    .catch((err) => {
      console.error("Error refreshing token:", err);
    });
};

// profile user data from spotify account
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
      console.log(data);

      const userNameElem = document.getElementById("userName");
      const userImageElem = document.getElementById("userImage");

      if (userNameElem && userImageElem) {
        userNameElem.textContent = data.display_name;
        userImageElem.src = data.images[0]?.url || "default-image.png";
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
      .filter((item) => item && item.album)
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
