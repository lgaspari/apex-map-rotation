import { format, getDiffToNow, getDuration } from 'lib/datetime';
import { useEffect, useRef, useState } from 'react';

const calculateTimeRemaining = (to: ISOString) => {
  const timeRemaining = getDiffToNow(to);
  return timeRemaining > 0 ? timeRemaining : 0;
};

export interface TimeRemainingProps {
  onTimeRemaining: (timeRemaining: number) => void;
  to: ISOString;
}

export default function TimeRemaining({
  onTimeRemaining,
  to,
}: TimeRemainingProps) {
  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(to)
  );

  const onTimeRemainingRef = useRef(onTimeRemaining);

  /**
   * Update state whenever `to` prop changes.
   */
  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(to));
  }, [to]);

  /**
   * Update callback ref whenever `onTimeRemaining` prop changes.
   */
  useEffect(() => {
    onTimeRemainingRef.current = onTimeRemaining;
  }, [onTimeRemaining]);

  /**
   * Re-render component every one second after render.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const timeRemaining = calculateTimeRemaining(to);

      if (timeRemaining === 0) {
        clearInterval(interval);
      }

      onTimeRemainingRef.current(timeRemaining);
      setTimeRemaining(timeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [to]);

  return (
    <div role="timer">{format(getDuration(timeRemaining), 'HH:mm:ss')}</div>
  );
}
