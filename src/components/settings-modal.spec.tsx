import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapCode, MapName } from 'constants/map';
import type SettingsType from 'types/settings';
import SettingsModal, { type SettingsModalProps } from './settings-modal';

const _maps = Object.values(MapCode);
const _threshold = 15;

const mockNotifications = ({
  maps = _maps,
  threshold = _threshold,
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
    getMapCheckbox: (code: MapCode) =>
      utils.getByRole('checkbox', { name: MapName[code] }),
    user,
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

test('can display settings', () => {
  const { getMapCheckbox } = setup();

  expect(screen.getByText('Settings')).toBeInTheDocument();
  expect(screen.getByTestId('notification-threshold')).toHaveTextContent(
    `Notify me ${_threshold} minutes before the following maps`
  );

  _maps.forEach((code) => {
    expect(getMapCheckbox(code)).toBeChecked();
  });
});

test('can update maps notification preferences', async () => {
  const maps = [MapCode.BrokenMoon, MapCode.Olympus, MapCode.WorldsEdge];
  const notifications = mockNotifications({ maps });
  const onClose = jest.fn();
  const setSettings = jest.fn();

  const { getMapCheckbox, user } = setup({
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

  const unselectedMaps = _maps.filter((code) => !selectedMaps.includes(code));
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
