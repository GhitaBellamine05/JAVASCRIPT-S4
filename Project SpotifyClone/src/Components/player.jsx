import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/ContextPlayer";
import { PlaylistContext } from "../context/ContextPlaylist";
import { assets } from "../assets/assets";

const Player = () => {
    const {
        audioRef,
        seekBg,
        seekBar,
        track,
        playStatus,
        time,
        play,
        pause,
        seekSong,
        volume,
        isMuted,
        toggleMute,
        handleVolumeChange,
        previous,
        next,
        isLooping,
        toggleLoop,
        isShuffled,
        toggleShuffle
    } = useContext(PlayerContext);

    const { playlists, addSongToPlaylist } = useContext(PlaylistContext);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onended = () => {
                pause();
            };
        }
    }, [audioRef.current]);

    const handleAddToPlaylist = () => {
        if (!selectedPlaylist || !track.id) return;
        
        const song = {
            id: track.id,
            name: track.name,
            desc: track.desc,
            image: track.image,
            preview: track.preview
        };
        addSongToPlaylist(selectedPlaylist, song);
    };

    return (
        <div className="h-[10vh] bg-black flex justify-between items-center text-white px-4">
            <div className="hidden md:flex items-center gap-4">
                <img
                    className="w-12 h-12 rounded"
                    src={track.image}
                    alt={track.name}
                />
                <div>
                    <p>{track.name}</p>
                    <p className="text-xs text-gray-500">{track.desc}</p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-1 flex-1">
                <div className="flex gap-4">
                    <img
                        onClick={toggleShuffle}
                        className={`w-4 cursor-pointer ${isShuffled ? 'text-green-500' : ''}`}
                        src={assets.shuffle_icon}
                        alt="shuffle"
                        style={{ filter: isShuffled ? 'invert(0.5) sepia(1) saturate(5) hue-rotate(80deg)' : 'none' }}
                    />
                    <img
                        onClick={previous}
                        className="w-4 cursor-pointer"
                        src={assets.prev_icon}
                        alt="previous"
                    />
                    {playStatus ? (
                        <img
                            onClick={pause}
                            className="w-4 cursor-pointer"
                            src={assets.pause_icon}
                            alt="pause"
                        />
                    ) : (
                        <img
                            onClick={play}
                            className="w-4 cursor-pointer"
                            src={assets.play_icon}
                            alt="play"
                        />
                    )}
                    <img
                        onClick={next}
                        className="w-4 cursor-pointer"
                        src={assets.next_icon}
                        alt="next"
                    />
                    <img
                        onClick={toggleLoop}
                        className={`w-4 cursor-pointer ${isLooping ? 'text-green-500' : ''}`}
                        src={assets.loop_icon}
                        alt="loop"
                        style={{ filter: isLooping ? 'invert(0.5) sepia(1) saturate(5) hue-rotate(80deg)' : 'none' }}
                    />
                </div>

                <div className="flex items-center gap-2 w-full max-w-[500px]">
                    <p className="text-xs text-gray-500">
                        {time.currentTime.minute.toString().padStart(2, '0')}:
                        {time.currentTime.second.toString().padStart(2, '0')}
                    </p>
                    <div
                        ref={seekBg}
                        onClick={seekSong}
                        className="h-1 rounded-full w-full bg-gray-600 cursor-pointer"
                    >
                        <div
                            ref={seekBar}
                            className="h-1 rounded-full bg-green-500"
                            style={{ width: "0%" }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500">0:30</p>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
                {playlists.length > 0 && track.id && (
                    <div className="flex lg:flex items-center gap-2">
                        <select
                            value={selectedPlaylist || ""}
                            onChange={(e) => setSelectedPlaylist(parseInt(e.target.value))}
                            className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm"
                        >
                            <option value="">Add to playlist</option>
                            {playlists.map(playlist => (
                                <option key={playlist.id} value={playlist.id}>
                                    {playlist.name}
                                </option>
                            ))}
                        </select>
                        {selectedPlaylist && (
                            <button
                                onClick={handleAddToPlaylist}
                                className="px-3 py-1 bg-green-500 text-black rounded-full text-sm"
                            >
                                Add
                            </button>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    {isMuted ? (
                        <img
                            onClick={toggleMute}
                            className="w-4 cursor-pointer"
                            src={assets.mute_icon}
                            alt="mute"
                        />
                    ) : (
                        <img
                            onClick={toggleMute}
                            className="w-4 cursor-pointer"
                            src={assets.volume_icon}
                            alt="volume"
                        />
                    )}
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 accent-green-500"
                    />
                </div>
            </div>

            <audio ref={audioRef} />
        </div>
    );
};

export default Player;