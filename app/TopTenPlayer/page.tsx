"use client";
import { useEffect, useState } from "react";
import fetch from "isomorphic-fetch";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import {
  FaChevronLeft,
  FaChevronRight,
  FaForward,
  FaPause,
  FaPlay,
} from "react-icons/fa";
import Image from "next/image";
import { FaBackward } from "react-icons/fa6";

const token =
  "BQC75OAOw-zaj0_dav_raPrPYOOksF3Fw1L6FqS_BQpH_gkMTU7AiryvkmoGUKjRsQIXRWQMYoONyFMk3dl5vwb9yTL7JWH_vzCMfEk4ZTa5JU3EEZQWX9OmHRVeU6OcTwUh9u1TFEtTW4z8zkH6KWGKoVc108axFWBLEtuEaLkrh2iodLFVI3zjxGgx4Wj8uRyf9LLcrYRaMi57OQa6Ng8Bb3_qvz24anQDhdzVhfERFsgbiqSImhfxtiaXJw2idskZRq0zVzPkfy7NIA86tbpz";

async function fetchWebApi(endpoint: string, method: string, body?: any) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

const topTracksIds = [
  "0kbBU3ey5IkKwPvDHXJOry",
  "4E23uX1BDdUTk9x56nEbla",
  "5m5THqRa6jHwKYLMWp2DEW",
  "5XtsfMFmpM401S6dbVaOQw",
  "75zXJyX1NLzmN2WUUjfQsy",
];

async function getRecommendations() {
  return (
    await fetchWebApi(
      `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(",")}`,
      "GET"
    )
  ).tracks;
}

const TopTenPlayer = () => {
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  useEffect(() => {
    const fetchRecommendations = async () => {
      const tracks = await getRecommendations();
      setRecommendedTracks(tracks);
    };

    fetchRecommendations();
  }, []);

  const handleTrackEnded = () => {
    // Play the next track when the current track ends
    setSelectedTrackIndex((prevIndex) =>
      prevIndex < recommendedTracks.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleTrackClick = (index) => {
    setSelectedTrackIndex(index);
  };
  const handlePrevTrack = () => {
    // Play the previous track
    setSelectedTrackIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : recommendedTracks.length - 1
    );
  };

  const handleNextTrack = () => {
    // Play the next track
    setSelectedTrackIndex((prevIndex) =>
      prevIndex < recommendedTracks.length - 1 ? prevIndex + 1 : 0
    );
  };
  const selectedTrack = recommendedTracks[selectedTrackIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-white bg-black p-3">
        Top 10 Song Player
      </h1>
      <div className=" justify-between lg:flex">
        <ul>
          {recommendedTracks.map((track: any, index: number) => (
            <li
              key={index}
              className={`mb-2 cursor-pointer flex items-center ${
                index === selectedTrackIndex ? "font-bold" : ""
              }`}
              onClick={() => handleTrackClick(index)}
            >
              {index === selectedTrackIndex && (
                <FaPlay className="mr-2 text-white" />
              )}
              <p className="text-lg font-medium text-white">{track.name}</p>
              <p className="text-gray-500">
                {track.artists.map((artist: any) => artist.name).join(", ")}
              </p>
            </li>
          ))}
        </ul>
        <div>
          {selectedTrack && (
            <div className="relative">
              <div className="absolute">
                <h1 className="text-[22px] w-[110px] h-[110px] flex justify-center items-center text-white">
                  Music
                </h1>
              </div>
              <div
                className="relative bg-white h-[489px] w-[314px] tracking-[0.1em] uppercase rounded-3xl"
                style={{
                  clipPath:
                    "polygon(34.9% 0, 100% 0, 100% 100%, 0 100%, 0 22.5%, 34.9% 22.5%)",
                }}
              >
                <div className="h-full w-full">
                  <div className="flex">
                    <div className="relative h-[110px] items-end w-full  flex flex-col justify-end">
                      <div className="p-4 absolute top-0 right-0">
                        <Image
                          width={12.18}
                          height={15.5}
                          src={"/Assets/lockicon.svg"}
                          alt={""}
                        />
                      </div>
                      {selectedTrack && (
                        <div className="flex w-[85%] overflow-hidden h-full items-end">
                          <div className="text-[14px] w-full px-8 pb-2 over flex flex-col gap-3">
                            <h2 className="text-end min-w-max overflow-hidden w-full">
                              {selectedTrack.name}
                            </h2>
                            <h2 className="text-end overflow-hidden min-w-max font-semibold italic">
                              {selectedTrack.artists
                                .map((artist) => artist.name)
                                .join(", ")}
                            </h2>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    <div className="relative flex">
                      <p className="text-[14px] absolute  ml-6 mt-2 flex items-start w-1/3">
                        $25.00 US
                      </p>

                      <AudioPlayer
                        autoPlay
                        src={selectedTrack.preview_url}
                        autoPlayAfterSrcChange={true}
                        showJumpControls={false}
                        customAdditionalControls={[]}
                        customIcons={{
                          play: (
                            <FaPlay className="mt-2 mx-auto text-[#990000] z-10 w-5 h-5" />
                          ),
                          pause: (
                            <FaPause className="mt-2 mx-auto text-[#990000] z-10 w-5 h-5" />
                          ),
                        }}
                        customVolumeControls={[]}
                        layout="stacked-reverse"
                        customProgressBarSection={[RHAP_UI.PROGRESS_BAR]}
                        onEnded={handleTrackEnded}
                        style={{
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          margin: "0",
                          padding: "0",
                          paddingLeft: "22px",
                          paddingRight: "22px",
                        }}
                      />
                    </div>
                  </div>
                  <h2 className="text-[13px] text-center mt-1 ">
                    GB63913710211241047
                  </h2>
                  <div className="flex justify-center items-center mt-3">
                    <div className="h-[268px] w-[268px] object-cover rounded-2xl overflow-hidden flex">
                      {selectedTrack.album.images.length > 0 && (
                        <div
                          id="parent"
                          className="w-[300px] h-[300px] relative"
                          onMouseEnter={() => setShowControls(true)}
                          onMouseLeave={() => setShowControls(false)}
                        >
                          <Image
                            width={300}
                            height={300}
                            className={`w-full h-full absolute -z-10 ${
                              !showControls
                                ? ""
                                : " blur transition-all duration-500"
                            }`}
                            src={selectedTrack.album.images[0].url}
                            alt={selectedTrack.name}
                          />
                          <div
                            id="child"
                            className={`flex z-10 h-full justify-between  text-white p-4 text-2xl shadow-black shadow-xl w-full ${
                              showControls ? "" : "hidden"
                            }`}
                          >
                            <button
                              key="prev"
                              onClick={() =>
                                setSelectedTrackIndex((prevIndex) =>
                                  prevIndex > 0
                                    ? prevIndex - 1
                                    : recommendedTracks.length - 1
                                )
                              }
                            >
                              <FaBackward />
                            </button>

                            <button
                              key="next"
                              onClick={() =>
                                setSelectedTrackIndex((prevIndex) =>
                                  prevIndex < recommendedTracks.length - 1
                                    ? prevIndex + 1
                                    : 0
                                )
                              }
                            >
                              <FaForward />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopTenPlayer;
