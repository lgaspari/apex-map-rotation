import { sendNotification } from 'lib/notifications';
import { useEffect } from 'react';

type UsePromptNotificationPermissionReturn = void;

export default function usePromptNotificationPermission(): UsePromptNotificationPermissionReturn {
  useEffect(() => {
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      alert(
        "Unfortunately, this browser does not support desktop notifications, meaning you won't be able to receive map notifications from us."
      );
    }
    // Check whether notification permissions have already been granted or denied;
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          sendNotification({ title: 'Desktop notifications enabled' });
        }
      });
    }
  }, []);
}
