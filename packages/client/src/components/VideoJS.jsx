/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// eslint-disable-next-line react/prop-types
const VideoJS = ({ options, children }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // make sure Video player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (videoElement) {
        const player = videojs(videoElement, options);
        playerRef.current = player;
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options]);

  return (
    <div data-vjs-player style={{ margin: 'auto' }}>
      <video ref={videoRef} className="video-js vjs-big-play-centered">
        {children}
      </video>
    </div>
  );
};

export default VideoJS;
