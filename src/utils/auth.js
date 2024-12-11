const client_id = "";
const client_secret = "";
const baseUrl = "https://accounts.spotify.com";

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error:${res.status}`);
}

const authOptions = () => {
  return fetch(`${baseUrl}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        new Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: JSON.stringify({ grant_type: "client_credentials" }),
  }).then((res) => checkResponse(res));
};

export default { authOptions };
