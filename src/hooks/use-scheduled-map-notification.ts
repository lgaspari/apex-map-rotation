import { MapName } from 'constants/map';
import { getDiffToNow, getDuration, humanizeDuration } from 'lib/datetime';
import { sendNotification } from 'lib/notifications';
import { useEffect, useMemo, useState } from 'react';
import type MapType from 'types/map';

/**
 * Using a constant until we've setup user preferences.
 *
 * @todo replace with user preferences.
 */
const NOTIFICATION_THRESHOLD = 15;

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
  threshold = NOTIFICATION_THRESHOLD,
}: UseScheduledMapNotificationProps): UseScheduledMapNotificationReturn {
  const [sent, setSent] = useState(false);

  /**
   * Memoize timestamp to prevent `sent` state reset from happening more than once.
   *
   * @todo revisit, it might be better to memoize map rotation data altogether.
   */
  const startTimestamp = useMemo(() => start.valueOf(), [start]);

  /**
   * Reset `sent` state whenever map information changes.
   */
  useEffect(() => {
    setSent(false);
  }, [code, startTimestamp]);

  /**
   * Schedule map notification.
   */
  useEffect(() => {
    const notificationDelay = getDiffToNow(
      start.subtract(threshold, 'minutes')
    );

    /**
     * The notification is sent regardless of exceeding the `start` time. In
     * that case, the `notificationDelay` will be a negative value, so it's
     * capped to zero (`0`) to prevent issues when calling the `setTimeout`
     * callback in older browsers.
     *
     * @note The notification will be sent only once per map and start time.
     */
    const timeout = setTimeout(
      () => {
        if (!sent) {
          sendNotification({
            title: `${MapName[code]} coming up in ${humanizeDuration(
              getDuration(getDiffToNow(start))
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
