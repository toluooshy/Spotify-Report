import { useEffect, useState } from "react";
import axios from "axios";
import ArtistCard from "./ArtistCard";
import TrackCard from "./TrackCard";
import { useWindowDimensions } from "../src/utils/CustomHooks";

function App() {
  const CLIENT_ID = "d11e1a72eb8341de8b61f322b2d8e1f1";
  const REDIRECT_URI = "https://spotify-report-by-therealsupat.herokuapp.com"; //"http://localhost:3000"; //
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [user, setUser] = useState(null);
  const [artists, setArtists] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [genres, setGenres] = useState([]);
  const [timeRange, setTimeRange] = useState("short_term");

  const dimensions = useWindowDimensions();

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
    window.localStorage.removeItem("token");
  };

  const getSpotifyData = async (term) => {
    document.body.style.zoom = "50%";
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
    logout();
    return requiredObj;
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#191414",
        color: "#ffffff",
        overflowX: "hidden",
        height: `${dimensions.height * 2}px`,
      }}
    >
      <div
        style={{
          maxWidth: "710px",
          height: `${dimensions.height}px`,
          margin: "auto",
          justifyContent: "center",
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
                <br />
                <div
                  style={{
                    padding: ".75%",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      overflowWrap: "break-word",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        padding: ".75%",
                        maxWidth: "390px",
                        margin: "0px 30px 0px 50px",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={
                          user.images[0] || "https://i.imgur.com/L7vnBBF.jpg"
                        }
                        alt={`${user.display_name}'s profile picture.`}
                        style={{
                          width: "84px",
                          height: "84px",
                          borderRadius: "100%",
                          margin: "0px 10px 0px 0px",
                        }}
                      />
                      <i
                        style={{
                          fontSize: `${
                            130 / (user.display_name.length * 0.3)
                          }px`,
                          width: "300px",
                        }}
                      >
                        {user.display_name}
                      </i>
                    </div>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          top: "85px",
                          left: "-50px",
                          rotate: "270deg",
                        }}
                      >
                        <i
                          style={{
                            fontSize: "24px",
                          }}
                        >
                          Vibe:
                        </i>
                      </div>
                      <div
                        style={{
                          width: "128px",
                          height: "128px",
                          borderRadius: "16px",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <div
                          className="stacked-linear"
                          style={{
                            width: "128px",
                            height: "128px",
                            borderRadius: "16px",
                            filter: `saturate(100%) hue-rotate(${
                              (user.display_name.length / 4.2069) * 270
                            }deg)`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div style={{}}>
                    <div
                      style={{
                        justifyContent: "center",
                        width: "100%",
                        justifyContent: "space-between",
                        margin: "auto auto auto 50px",
                      }}
                    >
                      <button
                        style={{
                          height: "20px",
                          margin: "5px",
                          width: "210px",
                          backgroundColor:
                            timeRange === "short_term" ? "#1db954" : "#555",
                          border: "none",
                          color: "#ffffff",
                          borderRadius: "4px",
                          fontSize: "14px",
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
                          height: "20px",
                          margin: "5px",
                          width: "210px",
                          backgroundColor:
                            timeRange === "medium_term" ? "#1db954" : "#555",
                          border: "none",
                          color: "#ffffff",
                          borderRadius: "4px",
                          fontSize: "14px",
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
                          height: "20px",
                          margin: "5px",
                          width: "210px",
                          backgroundColor:
                            timeRange === "long_term" ? "#1db954" : "#555",
                          border: "none",
                          color: "#ffffff",
                          borderRadius: "4px",
                          fontSize: "14px",
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
                    </div>
                    <br />
                    <div
                      style={{
                        width: "fit-content",
                        margin: "0px -10px 0px 40px",
                        padding: "5px",
                      }}
                    >
                      <p
                        className="title"
                        style={{
                          display: "flex",
                          margin: "-20px 10px 5px 10px",
                          fontSize: "48px",
                        }}
                      >
                        Top Genres:
                      </p>
                      <hr
                        style={{
                          margin: "0px 2% 5px 2%",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          padding: "80px 0px 20px 0px",
                          justifyContent: "space-around",
                        }}
                      >
                        {Object.keys(findHighestOccurrences(genres)).map(
                          (genre, index) => (
                            <div
                              key={index}
                              style={{
                                fontSize: "70%",
                                textAlign: "left",
                                position: "relative",
                                textAlign: "center",
                              }}
                            >
                              <div
                                style={{
                                  position: "relative",
                                  padding: "20px",
                                  width: "95px",
                                }}
                              >
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: "0px",
                                    left: "0px",
                                    right: "0px",
                                    margin: "auto",
                                    height: `${
                                      (findHighestOccurrences(genres)[genre] /
                                        Math.max(
                                          ...Object.values(
                                            findHighestOccurrences(genres)
                                          )
                                        )) *
                                      100
                                    }px`,
                                    width: "80%",
                                    backgroundColor: "#1db954",
                                    borderRadius: "2px",
                                  }}
                                />
                              </div>
                              <br />
                              <div style={{ margin: "auto" }}>
                                <p style={{ padding: "0px", margin: "-5px" }}>
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
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <hr
                  style={{
                    margin: "0px 0px 5px 62px",
                  }}
                />
                <br />
                <div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      marginLeft: "50px",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <p
                        style={{
                          position: "absolute",
                          fontSize: "48px",
                          rotate: "270deg",
                          height: "100px",
                          width: "1000px",
                          top: "50px",
                          left: "-500px",
                        }}
                      >
                        Top Artists
                      </p>
                    </div>
                    <hr
                      style={{
                        margin: "0px 2% 5px 2%",
                        filter: "brightness(1000%)",
                        opacity: "70%",
                      }}
                    />
                    {artists.length > 0 ? (
                      <div style={{}}>
                        <div style={{ display: "flex" }}>
                          <div style={{ flex: "4" }}>
                            <ArtistCard artist={artists[0]} index={0} />
                          </div>
                          <div
                            style={{
                              flex: "5",
                            }}
                          >
                            <div style={{ margin: "20px auto" }}>
                              {artists.slice(1, 5).map((artist, index) => (
                                <ArtistCard
                                  key={index + 1}
                                  artist={artist}
                                  index={index + 1}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <br />
                        <div style={{ display: "flex" }}>
                          {artists.slice(6, 11).map((artist, index) => (
                            <ArtistCard
                              key={index + 5}
                              artist={artist}
                              index={index + 5}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ height: "655px" }}>Insufficient Data</div>
                    )}
                  </div>
                  <br />
                  <br />
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      marginLeft: "50px",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <p
                        style={{
                          position: "absolute",
                          fontSize: "48px",
                          rotate: "270deg",
                          height: "100px",
                          width: "1000px",
                          top: "10px",
                          left: "-500px",
                        }}
                      >
                        Top Tracks
                      </p>
                    </div>
                    <hr
                      style={{
                        margin: "0px 2% 5px 2%",
                        filter: "brightness(1000%)",
                        opacity: "70%",
                      }}
                    />{" "}
                    {tracks.length > 0 ? (
                      <div style={{}}>
                        <div style={{ display: "flex" }}>
                          <div style={{ flex: "4" }}>
                            <TrackCard track={tracks[0]} index={0} />
                          </div>
                          <div style={{ flex: "5" }}>
                            {tracks.slice(1, 5).map((track, index) => (
                              <TrackCard
                                key={index + 1}
                                track={track}
                                index={index + 1}
                              />
                            ))}
                          </div>
                        </div>
                        <br />
                        <div style={{ display: "flex" }}>
                          {tracks.slice(6, 11).map((track, index) => (
                            <TrackCard
                              key={index + 5}
                              track={track}
                              index={index + 5}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ height: "620px" }}>Insufficient Data</div>
                    )}
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
    </div>
  );
}

export default App;
