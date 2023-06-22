interface SyncManager {
  getTags(): Promise<string[]>;
  register(tag: string): Promise<void>;
}

declare global {
  interface ServiceWorkerRegistration {
    readonly sync: SyncManager;
  }

  interface SyncEvent extends ExtendableEvent {
    readonly lastChance: boolean;
    readonly tag: string;
  }

  interface ServiceWorkerGlobalScopeEventMap {
    sync: SyncEvent;
  }
}

function registerBackgroundSync() {
  if (!navigator.serviceWorker) {
    return console.error('Service Worker not supported');
  }

  navigator.serviceWorker.ready
    .then((registration) => registration.sync.register('fetch_map_rotation'))
    .then(() => console.log('Registered background sync'))
    .catch((err) => {
      console.log(err);
      console.error('Error registering background sync', err);
    });
}

function requestNotificationPermission() {
  if (!('Notification' in window)) {
    // Check if the browser supports notifications
    alert('This browser does not support desktop notification');
  } else if (Notification.permission === 'granted') {
    return Promise.resolve();
  } else if (Notification.permission !== 'denied') {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        return Promise.resolve();
        // …
      }

      return Promise.reject('Permission was not granted.');
    });
  }
}

// function requestSyncManagerPermission() {
//   if (!('SyncManager' in window)) {
//     // Check if the browser supports notifications
//     alert('This browser does not support background sync');
//   } else if (Notification.permission === 'granted') {
//     return Promise.resolve();
//   } else if (Notification.permission !== 'denied') {
//     // We need to ask the user for permission
//     Notification.requestPermission().then((permission) => {
//       // If the user accepts, let's create a notification
//       if (permission === 'granted') {
//         return Promise.resolve();
//         // …
//       }
//       return Promise.reject('Permission was not granted.');
//     });
//   }
// }

function App() {
  console.log('Environment information:', import.meta.env);

  const handleClick = async () => {
    try {
      await Promise.all([
        requestNotificationPermission(),
        // requestBackgroundSyncPermission(),
      ]);

      registerBackgroundSync();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <h1>Hello world!</h1>
      <button onClick={handleClick}>
        Notify me when there are new attendees
      </button>
    </div>
  );
}

export default App;
