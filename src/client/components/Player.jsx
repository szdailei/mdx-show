/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback, useImperativeHandle, useRef } from 'react';
import { keyframes } from '../styled/styled.js';
import { Div, Video } from '../styled/index.js';

const playButton = (
  <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58">
    <circle fill="#666666" cx="29" cy="29" r="29" />
    <polygon fill="#FFFFFF" points="44,29 22,44 22,29.273 22,14" />
    <path
      fill="#FFFFFF"
      d="M22,45c-0.16,0-0.321-0.038-0.467-0.116C21.205,44.711,21,44.371,21,44V14 c0-0.371,0.205-0.711,0.533-0.884c0.328-0.174,0.724-0.15,1.031,0.058l22,15C44.836,28.36,45,28.669,45,29s-0.164,0.64-0.437,0.826 l-22,15C22.394,44.941,22.197,45,22,45z M23,15.893v26.215L42.225,29L23,15.893z"
    />
  </svg>
);

const pauseButton = (
  <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58">
    <circle fill="#666666" cx="29" cy="29" r="29" />
    <rect x="33" y="14" fill="#FFFFFF" width="6" height="30" />
    <path fill="#FFFFFF" d="M40,45h-8V13h8V45z M34,43h4V15h-4V43z" />
    <rect x="19" y="14" fill="#FFFFFF" width="6" height="30" />
    <path fill="#FFFFFF" d="M26,45h-8V13h8V45z M20,43h4V15h-4V43z" />
  </svg>
);

function requestFullscreen({ playerRef, videoRef }) {
  playerRef.current.requestFullscreen();
  videoRef.current.style.width = '100vw';
  videoRef.current.style.height = '100vh';
}

function exitFullscreen({ videoRef }) {
  document.exitFullscreen();
  videoRef.current.style.width = videoRef.current.dataStoredWidth;
  videoRef.current.style.height = videoRef.current.dataStoredHeight;
}

const PlayButton = React.forwardRef(({ videoRef, playerRef }, ref) => {
  const [state, setState] = useState({ paused: true, hover: false });
  const { paused, hover } = state;

  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      if (paused) {
        requestFullscreen({ playerRef, videoRef });
        videoRef.current.play();
      } else {
        exitFullscreen({ videoRef });
        videoRef.current.pause();
      }

      setState({ paused: !paused, hover });
    },
    [hover, paused, playerRef, videoRef]
  );

  useImperativeHandle(ref, () => ({
    onClick: (event) => {
      onClick(event);
    },
  }));

  useEffect(() => {
    videoRef.current.dataStoredWidth = videoRef.current.style.width;
    videoRef.current.dataStoredHeight = videoRef.current.style.height;

    videoRef.current.addEventListener('playing', () => {
      setState({ paused: videoRef.current.paused, hover });
    });

    videoRef.current.addEventListener('pause', () => {
      setState({ paused: videoRef.current.paused, hover });
    });

    setState({ paused: videoRef.current.paused, hover });
  }, [hover, videoRef]);

  const onPointerEnter = useCallback((event) => {
    event.preventDefault();
    setState({ paused, hover: true });
  }, [paused]);

  const onPointerLeave = useCallback((event) => {
    event.preventDefault();
    setState({ paused, hover: false });
  }, [paused]);

  const eventHandlers = {
    onClick,
    onPointerEnter,
    onPointerLeave,
  };

  const breath = keyframes`from { opacity: 1; }
to { opacity: 0; }
`;

  const commonStyle = {
    display: 'block',
    position: 'absolute',
    cursor: 'pointer',
    top: '50%',
    left: '50%',
    lineHeight: 0,
    transform: 'translate(-50%, -50%) scale(1.5)',
  };

  const animationCommonStyle = {
    animationName: `${breath}`,
    animationDuration: '2s',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'forwards',
  };

  const playButtonAnimationStyle = hover
    ? {}
    : {
        ...animationCommonStyle,

        animationIterationCount: 'infinite',
        animationDirection: 'alternate-reverse',
      };

  const pauseButtonAnimationStyle = {
    ...animationCommonStyle,

    animationIterationCount: 1,
    animationDirection: 'alternate',
  };

  const playButtonStyle = {
    ...commonStyle,
    ...playButtonAnimationStyle,
  };

  const pauseButtonStyle = {
    ...commonStyle,
    ...pauseButtonAnimationStyle,
  };

  return paused ? (
    <Div style={playButtonStyle} {...eventHandlers}>
      {playButton}
    </Div>
  ) : (
    <Div style={pauseButtonStyle} {...eventHandlers}>
      {pauseButton}
    </Div>
  );
});

function Player(props) {
  const playerRef = useRef();
  const videoRef = useRef();
  const playButtonRef = useRef();

  const onClick = (event) => {
    playButtonRef.current.onClick(event);
  };

  return (
    <Div style={{ position: 'relative' }} ref={playerRef}>
      <Video {...props} controlsList="nofullscreen" onClick={onClick} ref={videoRef} />
      <PlayButton videoRef={videoRef} playerRef={playerRef} ref={playButtonRef} />
    </Div>
  );
}

export default Player;
