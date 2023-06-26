import { format, getDiff, getDuration } from 'lib/datetime';
import { useEffect, useState } from 'react';

interface TimeRemainingProps {
  to: DateObject;
}

export default function TimeRemaining({ to }: TimeRemainingProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = Date.now();

      // zero is still a valid value
      if (getDiff(timestamp, to) < 0) {
        clearInterval(interval);
      } else {
        setNow(timestamp);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>{format(getDuration(getDiff(now, to)), 'HH:mm:ss')}</div>;
}
