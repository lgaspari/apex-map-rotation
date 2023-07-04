import { format, getDiffToNow, getDuration } from 'lib/datetime';
import { useEffect, useState } from 'react';

const calculateTimeRemaining = (to: ISOString) => {
  const timeRemaining = getDiffToNow(to);
  return timeRemaining > 0 ? timeRemaining : 0;
};

export interface TimeRemainingProps {
  to: ISOString;
}

export default function TimeRemaining({ to }: TimeRemainingProps) {
  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(to)
  );

  /**
   * Re-render component every one second after render.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const timeRemaining = calculateTimeRemaining(to);

      if (timeRemaining === 0) {
        clearInterval(interval);
      }

      setTimeRemaining(timeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [to]);

  return (
    <div role="timer">{format(getDuration(timeRemaining), 'HH:mm:ss')}</div>
  );
}
