export function isNotificationAPISupported() {
  return 'Notification' in window;
}

export function requestNotificationPermission() {
  return Notification.requestPermission();
}

export function sendNotification({ title }: { title: string }) {
  new Notification(title, {
    body: 'Apex Legends - Map Rotation',
  });
}

export function shouldPromptNotificationPermission() {
  return Notification.permission === 'default';
}
