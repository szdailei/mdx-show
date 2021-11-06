import React, { useState, useEffect } from 'react';
import { Span } from '../styled/index.js';

function Timer(props) {
  const START_TIME = 0;
  const [counter, setCounter] = useState(START_TIME);

  const timer = {
    minutes: parseInt(counter / 60, 10),
    seconds: counter % 60,
  };

  useEffect(() => {
    const timerID = setInterval(() => setCounter(counter + 1), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  return (
    <Span {...props} role="timer">
      ⏱️{timer.minutes.toString().padStart(2, '0')}:{timer.seconds.toString().padStart(2, '0')}
    </Span>
  );
}

export default Timer;
