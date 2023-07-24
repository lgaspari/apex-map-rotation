import ApexLogo from 'assets/apex-logo.svg';
import NotificationsPrompt from 'components/notifications-prompt';
import PWAUpdatePrompt from 'components/pwa-update-prompt';
import SettingsModal from 'components/settings-modal';
import { MapCode } from 'constants/map';
import { Threshold } from 'constants/threshold';
import useLocalStorage from 'hooks/use-local-storage';
import { SettingsIcon } from 'icons';
import MapRotationPage from 'pages/map-rotation';
import { useState } from 'react';
import type Settings from 'types/settings';

export default function App() {
  const [openedSettingsModal, setOpenedSettingsModal] = useState(false);

  const [settings, setSettings] = useLocalStorage<Settings>(
    'apex-legends-settings',
    {
      notifications: {
        maps: Object.values(MapCode),
        threshold: Threshold.FIFTEEN_MINUTES,
      },
    }
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky z-10 top-0 left-0 right-0 h-12 p-2 flex justify-between items-center bg-apex drop-shadow-lg">
        <div className="w-16 flex items-center justify-start">
          <img alt="Apex Legends Logo" height={32} src={ApexLogo} width={48} />
        </div>

        <div className="text-white text-lg text-center font-bold uppercase leading-tight sm:leading-normal">
          Map Rotation
        </div>

        <div className="w-16 flex items-center justify-end">
          <button
            className="rounded-sm text-white"
            onClick={() => setOpenedSettingsModal(true)}
            title="Settings"
          >
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/* Pages */}
      <div className="flex-grow flex flex-col">
        <MapRotationPage settings={settings} />
      </div>

      {/* Modals */}
      <SettingsModal
        onClose={() => setOpenedSettingsModal(false)}
        opened={openedSettingsModal}
        setSettings={setSettings}
        settings={settings}
      />

      {/* Prompts */}
      <NotificationsPrompt />
      <PWAUpdatePrompt />
    </div>
  );
}
