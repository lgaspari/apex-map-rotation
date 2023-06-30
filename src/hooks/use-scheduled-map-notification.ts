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
   * Memoize timestamp to prevent `sent` state reset from occurring more than
   * once.
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
   * Schedule map notification by calculating how many milliseconds are between
   * the current time and the beginning of the next map minus the threshold (in
   * minutes).
   *
   * @note there's another approach that can be explored that checks every
   * second whether the notification should be sent, similar to the time
   * remaining component but it may not meet the expectations as it won't run
   * in a web worker.
   */
  useEffect(() => {
    const notificationDelay = getDiffToNow(
      start.subtract(threshold, 'minutes')
    );

    /**
     * Apparently, `setTimeout()` is not reliable when running in background or
     * inactive tabs.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#timeouts_in_inactive_tabs
     * @see https://stackoverflow.com/questions/6032429/chrome-timeouts-interval-suspended-in-background-tabs
     * @see https://isamatov.com/prevent-timers-stopping-javascript/
     *
     * @todo use Web Workers instead.
     */
    const timeout = setTimeout(
      () => {
        const timeRemaining = getDiffToNow(start);

        /**
         * The notification shall be sent only once per map code and start
         * time and it won't be sent if the map has already started.
         *
         * The latter condition is related to the `setTimeout()`, which is
         * "slowed down" when the tab is inactive or in background.
         */
        if (!sent && timeRemaining >= 0) {
          sendNotification({
            title: `${MapName[code]} coming up in ${humanizeDuration(
              getDuration(timeRemaining)
            )}`,
          });
          setSent(true);
        }
      },
      /**
       * If the current time has exceeded the threshold, then the difference
       * will result in a negative value. To prevent possible issues when
       * calling the `setTimeout()` callback in older browsers, we're capping
       * this value to `0`.
       */
      notificationDelay > 0 ? notificationDelay : 0
    );

    () => clearTimeout(timeout);
  }, [code, sent, threshold, start]);
}
