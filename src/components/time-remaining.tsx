import { format, getDiffToNow, getDuration } from 'lib/datetime';
import { useEffect, useState } from 'react';

interface TimeRemainingProps {
  to: Milliseconds;
}

export default function TimeRemaining({ to }: TimeRemainingProps) {
  const [timeRemaining, setTimeRemaining] = useState(getDiffToNow(to));

  /**
   * Re-render component every one second after render.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const timeRemaining = getDiffToNow(to);

      // zero is still a valid value
      if (timeRemaining < 0) {
        clearInterval(interval);
      } else {
        setTimeRemaining(timeRemaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [to]);

  return (
    <div role="timer">{format(getDuration(timeRemaining), 'HH:mm:ss')}</div>
  );
}
