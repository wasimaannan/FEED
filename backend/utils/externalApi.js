
let cachedToken = null;

async function getAdminToken() {
  if (cachedToken) return cachedToken;
  const details = {
    'grant_type': 'password',
    'username': '306007',
    'password': '@dp702UK'
  };
  const formBody = Object.keys(details)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
    .join('&');

  const res = await fetch("https://arlapi.ibos.io/api/v1/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "accept": "application/json"
    },
    body: formBody
  });

  if (!res.ok) {
    throw new Error("Failed to authenticate with external API as administrator");
  }

  const json = await res.json();
  cachedToken = json.access_token || json.token || json.Token;
  return cachedToken;
}

module.exports = {
  getAdminToken
};
