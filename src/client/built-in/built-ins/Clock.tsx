import { useState, useEffect, type HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  showIcon?: boolean;
}

function Clock(props: Props) {
  const { showIcon, ...rest } = props;
  const [date, setDate] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timerID = setInterval(() => setDate(new Date().toLocaleTimeString()), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  const showing = showIcon ? `👉${date}` : date;
  return <span {...rest}>{showing}</span>;
}

Clock.defaultProps = {
  showIcon: false,
};

export default Clock;
