import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

// -------------------------------------------------

const json = {
  current: {
    start: 1687393800,
    end: 1687399200,
    readableDate_start: '2023-06-22 00:30:00',
    readableDate_end: '2023-06-22 02:00:00',
    map: 'Broken Moon',
    code: 'broken_moon_rotation',
    DurationInSecs: 5400,
    DurationInMinutes: 90,
    asset: 'https://apexlegendsstatus.com/assets/maps/Broken_Moon.png',
    remainingSecs: 2617,
    remainingMins: 44,
    remainingTimer: '00:43:37',
  },
  next: {
    start: 1687399200,
    end: 1687404600,
    readableDate_start: '2023-06-22 02:00:00',
    readableDate_end: '2023-06-22 03:30:00',
    map: "World's Edge",
    code: 'worlds_edge_rotation',
    DurationInSecs: 5400,
    DurationInMinutes: 90,
  },
};

self.addEventListener('sync', function (event) {
  console.log('sync event', event);
  switch (event.tag) {
    case 'syncAttendees': {
      self.registration.showNotification('Test', { body: 'Body' });
      break;
    }

    case 'fetch_map_rotation': {
      setTimeout(() => {
        self.registration.showNotification('Map Rotation', {
          body: `${json.next.map} in ${json.current.remainingTimer}`,
        });
      }, 5000);
      break;
    }
  }
});
