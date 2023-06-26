export function sendNotification({ title }: { title: string }) {
  new Notification(title, {
    body: 'Apex Legends - Map Rotation',
  });
}
