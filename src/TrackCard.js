"use es6";

import React from "react";

const TrackCard = ({ track = {}, index = {}, ...buttonProps }) => {
  return (
    <div
      style={{
        width: `${index > 0 ? (index > 4 ? "100px" : "100%") : "200px"}`,
        padding: `5px ${index > 4 ? "22px" : "5px"} 5px ${
          index > 4 ? "2px" : "5px"
        } `,
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${index > 0 ? (index > 4 ? "125%" : "85%") : "105%"}`,
          justifyContent: "center",
          display: index !== 0 && "flex",
          margin: `-10px ${index > 4 ? "10px" : "10px"} 0px  ${
            index > 4 ? "10px" : "5px"
          }`,
        }}
      >
        <img
          src={track.album.images[0].url}
          alt={`${track.name} track image.`}
          style={{
            objectFit: "cover",
            width: `${index > 0 ? (index > 4 ? "50px" : "33%") : "125%"}`,
            aspectRatio: "1/1",
            margin: "auto",
            paddingLeft: index === 0 && "5px",
            marginTop: "2px",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            width: "125%",
            margin: "5px",
          }}
        >
          <p
            className="title"
            style={{
              fontSize: `${
                index > 0 ? (index > 4 ? "15px" : "40px") : "100px"
              }`,
              padding: "0px",
              margin: `${index > 4 ? "8px" : "10px"}  0px ${
                index > 4 ? "-7.5px" : "-15px"
              } 0px`,
              color: "#94826d",
            }}
          >{`${index + 1}.`}</p>
          <br />
          <p
            style={{
              margin: "-5px 0px -5px 0px",
              fontSize: `${
                index > 0
                  ? index > 4
                    ? "8px"
                    : "20px"
                  : `${200 / (track.name.length * 0.6)}px`
              }`,
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
                  index > 0 ? (index > 4 ? "7px" : "15px") : "20px"
                }`,
              }}
            >
              Popularity
            </p>
            <p
              style={{
                fontSize: `${
                  index > 0 ? (index > 4 ? "7px" : "15px") : "20px"
                }`,
              }}
            >
              {track.popularity}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#555",
              width: `100%`,
              height: index > 4 ? "2px" : "4px",
              borderRadius: "2px",
            }}
          />
          <div
            style={{
              marginTop: index > 4 ? "-2px" : "-4px",
              backgroundColor: "#1db954",
              width: `${track.popularity}%`,
              height: index > 4 ? "2px" : "4px",
              borderRadius: "2px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
