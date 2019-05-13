const dotenv = require("dotenv");
const SpotifyWebApi = require("spotify-web-api-node");

dotenv.config({ silent: true });

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_ID,
  clientSecret: process.env.SPOTIFY_SECRET
});

const getSpotifyCredentials = function() {
  return spotifyApi
    .clientCredentialsGrant()
    .then(
      data => spotifyApi.setAccessToken(data.body["access_token"]),
      err =>
        `Something went wrong when retrieving an access token ${err.message}`
    );
}

const getSpotifyAlbum = async function(album) {
  await getSpotifyCredentials();
  const result = await spotifyApi
    .searchAlbums(album)
    .then(
      data => data.body.albums.items[0],
      err =>
        `Something went wrong when retrieving an access token ${err.message}`
    );

  return result;
}


module.exports = { getSpotifyCredentials, getSpotifyAlbum }
