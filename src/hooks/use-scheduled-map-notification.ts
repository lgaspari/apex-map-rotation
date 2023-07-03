import { MapName } from 'constants/map';
import {
  getDate,
  getDiffToNow,
  getDuration,
  humanizeDuration,
} from 'lib/datetime';
import { sendNotification } from 'lib/notifications';
import { useEffect, useState } from 'react';
import type Map from 'types/map';

interface UseScheduledMapNotificationProps {
  /**
   * Whether the notification schedule is enabled.
   */
  enabled: boolean;

  /**
   * Map information used for the notification.
   */
  map: Map;

  /**
   * Notification threshold (minutes).
   *
   * If `threshold` is equal to `30`, then notifications will be sent 30
   * minutes before `start` time.
   */
  threshold: number;
}

type UseScheduledMapNotificationReturn = void;

export default function useScheduledMapNotification({
  enabled,
  map: { code, start },
  threshold,
}: UseScheduledMapNotificationProps): UseScheduledMapNotificationReturn {
  const [sent, setSent] = useState(false);

  /**
   * Reset `sent` state whenever map `code` or `start` time changes.
   *
   * We don't rely on `end` time as well because there shouldn't be more than
   * one map with the same code and start time.
   */
  useEffect(() => {
    setSent(false);
  }, [code, start]);

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
    let timeout: ReturnType<typeof setTimeout>;

    if (enabled) {
      const notificationDelay = getDiffToNow(
        getDate(start).subtract(threshold, 'minutes')
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
      timeout = setTimeout(
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
    }
  }, [code, enabled, sent, start, threshold]);
}
