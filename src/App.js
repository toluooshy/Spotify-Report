import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const CLIENT_ID = "d11e1a72eb8341de8b61f322b2d8e1f1";
  const REDIRECT_URI = "https://spotify-report-by-therealsupat.herokuapp.com";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [user, setUser] = useState(null);
  const [artists, setArtists] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [genres, setGenres] = useState([]);
  const [timeRange, setTimeRange] = useState("short_term");

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const getSpotifyData = async (term) => {
    await axios
      .get("https://api.spotify.com/v1/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setUser(response.data);
      });

    await axios
      .get("https://api.spotify.com/v1/me/top/artists", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          time_range: term,
        },
      })
      .then((response) => {
        console.log(response.data.items);
        setArtists(response.data.items);
        response.data.items.forEach((artist) =>
          setGenres((prevGenres) => [...prevGenres, ...artist.genres])
        );
      });

    await axios
      .get("https://api.spotify.com/v1/me/top/tracks", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          time_range: term,
        },
      })
      .then((response) => {
        setTracks(response.data.items);
      });
  };

  const findHighestOccurrences = (arr = []) => {
    const res = {};
    arr.forEach((element) => {
      if (res[`${element}`] != null) {
        res[`${element}`] += 1;
      } else {
        res[`${element}`] = 1;
      }
    });
    return pickHighest(res, 5);
  };

  const pickHighest = (obj, num = 1) => {
    const requiredObj = {};
    if (num > Object.keys(obj).length) {
      return false;
    }
    Object.keys(obj)
      .sort((a, b) => obj[b] - obj[a])
      .forEach((key, ind) => {
        if (ind < num) {
          requiredObj[key] = obj[key];
        }
      });
    return requiredObj;
  };

  return (
    <div
      style={{
        maxWidth: "1300px",
        backgroundColor: "#ffffff",
        margin: "auto",
        justifyContent: "center",
        overflowX: "hidden",
      }}
    >
      {token ? (
        <div style={{ width: "100%", justifyContent: "center" }}>
          {!!user && !!artists && !!tracks ? (
            <div
              style={{
                width: "100%",
                overflowWrap: "break-word",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  padding: ".75%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    padding: ".75%",
                    display: "flex",
                    maxWidth: "150px",
                    margin: "0px 30px 0px 0px",
                    alignItems: "center",
                    overflowWrap: "break-word",
                  }}
                >
                  <img
                    src={user.images[0] || "https://i.imgur.com/L7vnBBF.jpg"}
                    alt={`${user.display_name}'s profile picture.`}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "100%",
                      margin: "0px 10px 0px 0px",
                    }}
                  />
                  <i
                    style={{
                      fontSize: "100%",
                      width: "90%",
                    }}
                  >
                    {user.display_name}
                  </i>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      margin: "auto -10px auto 0px",
                    }}
                  >
                    <button
                      style={{
                        height: "17px",
                        margin: "2px",
                        width: "65px",
                        backgroundColor:
                          timeRange === "short_term" ? "#ff0201" : "#555",
                        border: "none",
                        color: "#ffffff",
                        borderRadius: "4px",
                        fontSize: "8px",
                      }}
                      onMouseEnter={({ currentTarget }) => {
                        currentTarget.style.opacity = "50%";
                      }}
                      onMouseOut={({ currentTarget }) => {
                        currentTarget.style.opacity = "100%";
                      }}
                      onClick={() => {
                        setTimeRange("short_term");
                        getSpotifyData("short_term");
                      }}
                    >
                      Past Month
                    </button>
                    <button
                      style={{
                        height: "17px",
                        margin: "2px",
                        width: "65px",
                        backgroundColor:
                          timeRange === "medium_term" ? "#ff0201" : "#555",
                        border: "none",
                        color: "#ffffff",
                        borderRadius: "4px",
                        fontSize: "8px",
                      }}
                      onMouseEnter={({ currentTarget }) => {
                        currentTarget.style.opacity = "50%";
                      }}
                      onMouseOut={({ currentTarget }) => {
                        currentTarget.style.opacity = "100%";
                      }}
                      onClick={() => {
                        setTimeRange("medium_term");
                        getSpotifyData("medium_term");
                      }}
                    >
                      Past Year
                    </button>
                    <button
                      style={{
                        height: "17px",
                        margin: "2px",
                        width: "65px",
                        backgroundColor:
                          timeRange === "long_term" ? "#ff0201" : "#555",
                        border: "none",
                        color: "#ffffff",
                        borderRadius: "4px",
                        fontSize: "8px",
                      }}
                      onMouseEnter={({ currentTarget }) => {
                        currentTarget.style.opacity = "50%";
                      }}
                      onMouseOut={({ currentTarget }) => {
                        currentTarget.style.opacity = "100%";
                      }}
                      onClick={() => {
                        setTimeRange("long_term");
                        getSpotifyData("long_term");
                      }}
                    >
                      All Time
                    </button>
                    <button
                      style={{
                        height: "17px",
                        margin: "2px",
                        width: "65px",
                        backgroundColor: "#000",
                        border: "none",
                        color: "#ffffff",
                        borderRadius: "4px",
                        fontSize: "9px",
                      }}
                      onMouseEnter={({ currentTarget }) => {
                        currentTarget.style.opacity = "50%";
                      }}
                      onMouseOut={({ currentTarget }) => {
                        currentTarget.style.opacity = "100%";
                      }}
                      onClick={logout}
                    >
                      Sign Out
                    </button>
                  </div>
                  <div
                    style={{
                      width: "fit-content",
                      margin: "0px -10px 0px 15px",
                      padding: "5px",
                      border: "solid 2px #ddd",
                    }}
                  >
                    <p
                      className="title"
                      style={{
                        display: "flex",
                        margin: "0px",
                        fontSize: "120%",
                      }}
                    >
                      Top Genres:
                    </p>
                    <div
                      style={{
                        display: "flex",
                        padding: "0px",
                        margin: "0px 0px 5px 0px",
                        color: "#555",
                      }}
                    >
                      {Object.keys(findHighestOccurrences(genres)).map(
                        (genre, index) => (
                          <div
                            key={index}
                            style={{
                              padding: "10px 10px 0px 0px",
                              fontSize: "75%",
                              textAlign: "left",
                            }}
                          >
                            <b style={{ width: "120px" }}>
                              {index + 1}.{" "}
                              {genre === "r&b"
                                ? "R&B"
                                : genre
                                    .split(" ")
                                    .map((word) => {
                                      return (
                                        word[0].toUpperCase() +
                                        word.substring(1)
                                      );
                                    })
                                    .join(" ")}
                            </b>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: "50%",
                  }}
                >
                  <p
                    className="title"
                    style={{
                      textAlign: "left",
                      margin: "5px 2% 0px 2%",
                      opacity: "70%",
                    }}
                  >
                    Top Artists
                  </p>
                  <hr
                    style={{
                      margin: "0px 2% 5px 2%",
                      filter: "brightness(0%)",
                      opacity: "70%",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {artists.map((artist, index) => (
                      <div
                        key={index}
                        style={{
                          width: `${
                            index > 5
                              ? index > 9
                                ? "18.5%"
                                : "23.5%"
                              : "31.5%"
                          }`,
                          padding: ".75%",
                        }}
                      >
                        <div style={{ position: "relative", width: "100%" }}>
                          <img
                            src={artist.images[0].url}
                            alt={`${artist.name} artist image.`}
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              aspectRatio: "1/1",
                              borderRadius: "4px",
                            }}
                          />
                          <p
                            className="title"
                            style={{
                              fontSize: `${
                                index > 5
                                  ? index > 9
                                    ? "65%"
                                    : "100%"
                                  : "150%"
                              }`,
                              padding: "0px",
                              margin: "5% 0%",
                              color: "#94826d",
                            }}
                          >{`${index + 1}.`}</p>
                          <p
                            style={{
                              fontSize: `${
                                index > 5 ? (index > 9 ? "8px" : "10px") : "65%"
                              }`,
                              padding: "0px",
                              margin: "7.5% 0%",
                            }}
                          >
                            {artist.name}
                          </p>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p
                              style={{
                                fontSize: `${
                                  index > 5
                                    ? index > 9
                                      ? "5px"
                                      : "7px"
                                    : "55%"
                                }`,
                              }}
                            >
                              Popularity
                            </p>
                            <p
                              style={{
                                fontSize: `${
                                  index > 5
                                    ? index > 9
                                      ? "5px"
                                      : "7px"
                                    : "55%"
                                }`,
                              }}
                            >
                              {artist.popularity}
                            </p>
                          </div>

                          <div
                            style={{
                              backgroundColor: "#cccccc",
                              width: `100%`,
                              height: "2px",
                            }}
                          />
                          <div
                            style={{
                              marginTop: "-2px",
                              backgroundColor: "#ff0201",
                              width: `${artist.popularity}%`,
                              height: "2px",
                            }}
                          />

                          {/* <p
                            style={{
                              fontSize: `${
                                index > 5 ? (index > 9 ? "5px" : "7px") : "55%"
                              }`,
                              padding: "0px",
                              margin: "10% 0% 5% 0%",
                              color: "#333",
                            }}
                          >
                            Artist Genres:
                          </p>
                          {artist.genres
                            .slice(0, 3)
                            .map((artistGenre, genreIndex) => (
                              <p
                                key={genreIndex}
                                style={{
                                  fontSize: `${
                                    index > 5
                                      ? index > 9
                                        ? "5px"
                                        : "7px"
                                      : "55%"
                                  }`,
                                  color: "#333",
                                  margin: "5% 0px",
                                }}
                              >
                                -{" "}
                                {artistGenre === "r&b"
                                  ? "R&B"
                                  : artistGenre
                                      .split(" ")
                                      .map((word) => {
                                        return (
                                          word[0].toUpperCase() +
                                          word.substring(1)
                                        );
                                      })
                                      .join(" ")}
                              </p>
                            ))} */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>{" "}
                <div
                  style={{
                    width: "50%",
                  }}
                >
                  <p
                    className="title"
                    style={{
                      textAlign: "left",
                      margin: "5px 2% 0px 2%",
                      opacity: "70%",
                    }}
                  >
                    Top Tracks
                  </p>
                  <hr
                    style={{
                      margin: "0px 2% 5px 2%",
                      filter: "brightness(0%)",
                      opacity: "70%",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {tracks.map((track, index) => (
                      <div
                        key={index}
                        style={{
                          width: `${
                            index > 5
                              ? index > 9
                                ? "18.5%"
                                : "23.5%"
                              : "31.5%"
                          }`,
                          padding: ".75%",
                        }}
                      >
                        <div style={{ position: "relative", width: "100%" }}>
                          <img
                            src={track.album.images[0].url}
                            alt={`${track.name} track image.`}
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              aspectRatio: "1/1",
                              borderRadius: "4px",
                            }}
                          />
                          <p
                            className="title"
                            style={{
                              fontSize: `${
                                index > 5
                                  ? index > 9
                                    ? "65%"
                                    : "100%"
                                  : "150%"
                              }`,
                              padding: "0px",
                              margin: "5% 0%",
                              color: "#94826d",
                            }}
                          >{`${index + 1}.`}</p>
                          <p
                            style={{
                              fontSize: `${
                                index > 5 ? (index > 9 ? "8px" : "10px") : "65%"
                              }`,
                              padding: "0px",
                              margin: "7.5% 0%",
                            }}
                          >
                            {track.name}
                          </p>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p
                              style={{
                                fontSize: `${
                                  index > 5
                                    ? index > 9
                                      ? "5px"
                                      : "7px"
                                    : "55%"
                                }`,
                              }}
                            >
                              Popularity
                            </p>
                            <p
                              style={{
                                fontSize: `${
                                  index > 5
                                    ? index > 9
                                      ? "5px"
                                      : "7px"
                                    : "55%"
                                }`,
                              }}
                            >
                              {track.popularity}
                            </p>
                          </div>

                          <div
                            style={{
                              backgroundColor: "#cccccc",
                              width: `100%`,
                              height: "2px",
                            }}
                          />
                          <div
                            style={{
                              marginTop: "-2px",
                              backgroundColor: "#ff0201",
                              width: `${track.popularity}%`,
                              height: "2px",
                            }}
                          />

                          {/* <p
                            style={{
                              fontSize: `${
                                index > 5 ? (index > 9 ? "5px" : "7px") : "55%"
                              }`,
                              padding: "0px",
                              margin: "10% 0% 5% 0%",
                              color: "#333",
                            }}
                          >
                            Artist(s):
                          </p>
                          {track.album.artists
                            .slice(0, 3)
                            .map((trackArtist, trackIndex) => (
                              <p
                                key={trackIndex}
                                style={{
                                  fontSize: `${
                                    index > 5
                                      ? index > 9
                                        ? "5px"
                                        : "7px"
                                      : "55%"
                                  }`,
                                  color: "#333",
                                  margin: "5% 0px",
                                }}
                              >
                                - {trackArtist.name}
                              </p>
                            ))} */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "fixed",
                width: "100%",
                height: "100%",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <div>
                <button
                  style={{
                    margin: "25% auto auto auto",
                    padding: "10px",
                    width: "200px",
                    backgroundColor: "#555",
                    border: "none",
                    color: "#ffffff",
                    borderRadius: "4px",
                    fontSize: "20px",
                  }}
                  onMouseEnter={({ currentTarget }) => {
                    currentTarget.style.opacity = "50%";
                  }}
                  onMouseOut={({ currentTarget }) => {
                    currentTarget.style.opacity = "100%";
                  }}
                  onClick={() => {
                    getSpotifyData("short_term");
                  }}
                >
                  Get Data! 🚀
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              margin: "25% auto auto auto",
              width: "200px",
              padding: "10px",
              backgroundColor: "#555",
              border: "none",
              color: "#ffffff",
              borderRadius: "4px",
            }}
            onMouseEnter={({ currentTarget }) => {
              currentTarget.style.opacity = "50%";
            }}
            onMouseOut={({ currentTarget }) => {
              currentTarget.style.opacity = "100%";
            }}
          >
            <a
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-top-read&response_type=${RESPONSE_TYPE}`}
              style={{
                position: "relative",
                fontSize: "20px",
                margin: "100px 0px",
                textDecoration: "none",
                color: "#ffffff",
              }}
            >
              Connect Spotify ✳️
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
