//gettoken

export const getToken = async (authorizationCode) => {
  try {
    const codeVerifier = localStorage.getItem("code_verifier");
    const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri =
      import.meta.env.MODE === "production"
        ? "https://lupesanchez24.github.io/playlist-frontend/#/callback"
        : "http://localhost:3000/#/callback";

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: client_id,
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    };

    const response = await fetch(
      "https://accounts.spotify.com/api/token",
      payload
    );
    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem("spotify_access_token", data.access_token);
      localStorage.setItem("spotify_refresh_token", data.refresh_token);
      localStorage.setItem(
        "spotify_token_expiration",
        Date.now() / 1000 + 3600
      );

      return data.access_token;
    } else {
      console.error("Failed to get access token: ", data);
      return null;
    }
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return null;
  }
};

//refresh token

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("spotify_refresh_token");
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri =
    import.meta.env.MODE === "production"
      ? "https://lupesanchez24.github.io/playlist-frontend/#/callback"
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
