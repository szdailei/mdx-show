import { useState, useEffect, type MouseEvent, type KeyboardEvent } from 'react';
import Clock from './Clock.jsx';

function InternalTimer(props) {
  const START_TIME = 0;
  const [counter, setCounter] = useState(START_TIME);

  const timer = {
    minutes: counter / 60,
    seconds: counter % 60,
  };

  useEffect(() => {
    const timerID = setInterval(() => setCounter(counter + 1), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  const minutes = Math.trunc(timer.minutes).toString().padStart(2, '0');
  const seconds = timer.seconds.toString().padStart(2, '0');

  return (
    <span {...props}>
      👉{minutes}:{seconds}
    </span>
  );
}

function Timer() {
  const [isClock, setIsClock] = useState(true);
  const onClick = (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault();
    setIsClock(!isClock);
  };

  const props = {
    onClick,
    onKeyDown: onClick,
    tabIndex: 0,
    style: {
      cursor: 'pointer',
    },
  };

  const showing = isClock ? <Clock showIcon {...props} /> : <InternalTimer {...props} />;
  return showing;
}

export default Timer;
