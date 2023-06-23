import { format, getDuration, fromMilliseconds, fromUnix } from 'lib/datetime';
import { useEffect, useState } from 'react';

interface TimeRemainingProps {
  to: number;
}

export default function TimeRemaining({ to }: TimeRemainingProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {format(getDuration(fromMilliseconds(now), fromUnix(to)), 'HH:mm:ss')}
    </div>
  );
}
