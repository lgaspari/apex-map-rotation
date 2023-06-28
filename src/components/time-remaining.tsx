import { format, getDiffToNow, getDuration } from 'lib/datetime';
import { useEffect, useState } from 'react';

interface TimeRemainingProps {
  to: Milliseconds;
}

export default function TimeRemaining({ to }: TimeRemainingProps) {
  const [, setNow] = useState(Date.now());

  /**
   * Re-render component every one second after render.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      // zero is still a valid value
      if (getDiffToNow(to) < 0) {
        clearInterval(interval);
      } else {
        setNow(Date.now());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [to]);

  return (
    <div role="timer">{format(getDuration(getDiffToNow(to)), 'HH:mm:ss')}</div>
  );
}
