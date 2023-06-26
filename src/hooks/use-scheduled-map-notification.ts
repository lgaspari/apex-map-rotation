import { getDate, getDiff, getDuration, humanizeDuration } from 'lib/datetime';
import { sendNotification } from 'lib/notifications';
import { useEffect } from 'react';

interface UseScheduledMapNotificationProps {
  /**
   * Map name.
   */
  map: string;

  /**
   * Notification threshold in minutes.
   *
   * If `threshold` is equal to `30`, then notifications will be sent 30
   * minutes before the `timestamp`.
   *
   * @default 15 // minutes
   */
  threshold?: number;

  /**
   * Notification timestamp.
   */
  when: DateObject;
}

type UseScheduledMapNotificationReturn = void;

export default function useScheduledMapNotification({
  map,
  threshold = 15,
  when,
}: UseScheduledMapNotificationProps): UseScheduledMapNotificationReturn {
  useEffect(() => {
    const notificationDelay = getDiff(
      // now
      getDate(),
      // timestamp minus the notification threshold
      getDate(when).subtract(threshold, 'minutes'),
      // unit
      'milliseconds'
    );

    /**
     * The notification is sent regardless of exceeding the schedule time. In
     * that case, the `delay` will be negative so it's capped to `0` to prevent
     * issues calling the `setTimeout` callback.
     */
    const timeout = setTimeout(
      () => {
        const timeRemaining = getDuration(
          getDiff(getDate(), getDate(when), 'milliseconds')
        );

        sendNotification({
          title: `${map} coming up in ${humanizeDuration(timeRemaining)}`,
        });
      },
      notificationDelay > 0 ? notificationDelay : 0
    );

    () => clearTimeout(timeout);
  }, [map, threshold, when]);
}
