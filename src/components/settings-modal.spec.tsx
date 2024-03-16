import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapCode, MapName } from 'constants/map';
import { Threshold } from 'constants/threshold';
import type SettingsType from 'types/settings';
import SettingsModal, { type SettingsModalProps } from './settings-modal';

const initialMaps = Object.values(MapCode);
const initialThreshold = Threshold.FIFTEEN_MINUTES;

const mockNotifications = ({
  maps = initialMaps,
  threshold = initialThreshold,
}: Partial<
  SettingsType['notifications']
> = {}): SettingsType['notifications'] => {
  return {
    maps,
    threshold,
  };
};

const mockSettings = ({
  notifications = mockNotifications(),
}: Partial<SettingsType> = {}): SettingsType => {
  return {
    notifications,
  };
};

function setup({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose = () => {},
  opened = true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSettings = () => {},
  settings = mockSettings(),
}: Partial<SettingsModalProps> = {}) {
  const user = userEvent.setup();

  const utils = render(
    <SettingsModal
      onClose={onClose}
      opened={opened}
      setSettings={setSettings}
      settings={settings}
    />
  );

  return {
    ...utils,
    user,
  };
}

function setupNotifications(props: Partial<SettingsModalProps> = {}) {
  const utils = setup(props);

  return {
    ...utils,
    getMapCheckbox: (code: MapCode) =>
      utils.getByRole('checkbox', { name: MapName[code] }),
    thresholdSelect: utils.getByRole('combobox'),
  };
}

test('does not render modal if not opened', async () => {
  setup({ opened: false });
  expect(screen.queryByTestId('settings-modal-overlay')).toHaveClass('hidden');
});

test('can close modal', async () => {
  const onClose = jest.fn();

  const { user } = setup({ onClose });

  await user.click(screen.getByRole('button', { name: 'Discard' }));
  expect(onClose).toHaveBeenCalled();
});

describe('Notifications', () => {
  test('can display notification settings', () => {
    const { getMapCheckbox, thresholdSelect } = setupNotifications();

    expect(screen.getByText('Notifications')).toBeInTheDocument();

    // threshold
    expect(screen.getByText('Threshold:')).toBeInTheDocument();
    expect(thresholdSelect).toHaveValue(String(initialThreshold));

    // maps
    expect(screen.getByText('Maps:')).toBeInTheDocument();
    initialMaps.forEach((code) => {
      expect(getMapCheckbox(code)).toBeChecked();
    });
  });

  test('can update notification threshold preferences', async () => {
    const threshold = Threshold.FIVE_MINUTES;
    const notifications = mockNotifications({ threshold });
    const onClose = jest.fn();
    const selectedThreshold = Threshold.SIXTY_MINUTES;
    const setSettings = jest.fn();

    const { thresholdSelect, user } = setupNotifications({
      onClose,
      setSettings,
      settings: mockSettings({ notifications }),
    });

    // before
    expect(thresholdSelect).toHaveValue(String(threshold));

    // change selection
    await user.selectOptions(
      thresholdSelect,
      screen.getByRole('option', { name: '1 hour' })
    );

    // after
    expect(thresholdSelect).toHaveValue(String(selectedThreshold));

    // confirm changes
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(setSettings).toHaveBeenCalledWith({
      notifications: {
        ...notifications,
        threshold: selectedThreshold,
      },
    });
    expect(onClose).toHaveBeenCalled();
  });

  test('can update maps notification preferences', async () => {
    const maps = [MapCode.BrokenMoon, MapCode.Olympus, MapCode.WorldsEdge];
    const notifications = mockNotifications({ maps });
    const onClose = jest.fn();
    const setSettings = jest.fn();

    const { getMapCheckbox, user } = setupNotifications({
      onClose,
      setSettings,
      settings: mockSettings({ notifications }),
    });

    // before
    maps.forEach((code) => {
      expect(getMapCheckbox(code)).toBeChecked();
    });

    // toggle selection
    await user.click(getMapCheckbox(MapCode.BrokenMoon)); // unselect
    await user.click(getMapCheckbox(MapCode.Olympus)); // unselect
    await user.click(getMapCheckbox(MapCode.KingsCanyon)); // select

    // after
    const selectedMaps = [MapCode.WorldsEdge, MapCode.KingsCanyon];
    selectedMaps.forEach((code) => {
      expect(getMapCheckbox(code)).toBeChecked();
    });

    const unselectedMaps = initialMaps.filter(
      (code) => !selectedMaps.includes(code)
    );
    unselectedMaps.forEach((code) => {
      expect(getMapCheckbox(code)).not.toBeChecked();
    });

    // confirm changes
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(setSettings).toHaveBeenCalledWith({
      notifications: {
        ...notifications,
        maps: selectedMaps,
      },
    });
    expect(onClose).toHaveBeenCalled();
  });
});
