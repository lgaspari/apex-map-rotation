import { MapName } from 'constants/map';
import { getDate, getDiff, getDuration, humanizeDuration } from 'lib/datetime';
import { sendNotification } from 'lib/notifications';
import { useEffect, useState } from 'react';
import type MapType from 'types/map';

interface UseScheduledMapNotificationProps {
  /**
   * Map information used for the notification.
   */
  map: MapType;

  /**
   * Notification threshold (minutes).
   *
   * If `threshold` is equal to `30`, then notifications will be sent 30
   * minutes before `start` time.
   *
   * @default 15 // minutes
   */
  threshold?: number;
}

type UseScheduledMapNotificationReturn = void;

export default function useScheduledMapNotification({
  map: { code, start },
  threshold = 15,
}: UseScheduledMapNotificationProps): UseScheduledMapNotificationReturn {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const notificationDelay = getDiff(
      // now
      getDate(),
      // start minus the notification threshold
      getDate(start).subtract(threshold, 'minutes')
    );

    /**
     * The notification is sent regardless of exceeding the `start` time. In
     * that case, the `notificationDelay` will be a negative value, so it's
     * capped to zero (`0`) to prevent issues when calling the `setTimeout`
     * callback in older browsers.
     *
     * @note The notification will be sent only once.
     */
    const timeout = setTimeout(
      () => {
        if (!sent) {
          const timeRemaining = getDuration(getDiff(getDate(), getDate(start)));

          sendNotification({
            title: `${MapName[code]} coming up in ${humanizeDuration(
              timeRemaining
            )}`,
          });

          setSent(true);
        }
      },
      notificationDelay > 0 ? notificationDelay : 0
    );

    () => clearTimeout(timeout);
  }, [code, sent, threshold, start]);
}
