import { userEvent } from 'vitest/browser';
import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
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

async function setup({
  onClose = () => {},
  opened = true,
  setSettings = () => {},
  settings = mockSettings(),
}: Partial<SettingsModalProps> = {}) {
  const screen = await render(
    <SettingsModal
      onClose={onClose}
      opened={opened}
      setSettings={setSettings}
      settings={settings}
    />
  );

  return { screen };
}

async function setupNotifications(props: Partial<SettingsModalProps> = {}) {
  const { screen } = await setup(props);

  return {
    getMapCheckbox: (code: MapCode) =>
      screen.getByRole('checkbox', { name: MapName[code] }),
    screen,
    thresholdSelect: screen.getByRole('combobox'),
  };
}

test('does not render modal if not opened', async () => {
  const { screen } = await setup({ opened: false });

  await expect
    .element(screen.getByTestId('settings-modal-overlay'))
    .toHaveClass('hidden');
});

test('can close modal', async () => {
  const onClose = vi.fn();

  const { screen } = await setup({ onClose });

  await screen.getByRole('button', { name: 'Discard' }).click();
  expect(onClose).toHaveBeenCalled();
});

describe('Notifications', () => {
  test('can display notification settings', async () => {
    const { getMapCheckbox, screen, thresholdSelect } =
      await setupNotifications();

    await expect.element(screen.getByText('Notifications')).toBeInTheDocument();

    // threshold
    await expect.element(screen.getByText('Threshold:')).toBeInTheDocument();
    await expect.element(thresholdSelect).toHaveValue(String(initialThreshold));

    // maps
    await expect.element(screen.getByText('Maps:')).toBeInTheDocument();
    await Promise.all(
      initialMaps.map((code) =>
        expect.element(getMapCheckbox(code)).toBeChecked()
      )
    );
  });

  test('can update notification threshold preferences', async () => {
    const threshold = Threshold.FIVE_MINUTES;
    const notifications = mockNotifications({ threshold });
    const onClose = vi.fn();
    const selectedThreshold = Threshold.SIXTY_MINUTES;
    const setSettings = vi.fn();

    const { thresholdSelect, screen } = await setupNotifications({
      onClose,
      setSettings,
      settings: mockSettings({ notifications }),
    });

    // before
    await expect.element(thresholdSelect).toHaveValue(String(threshold));

    // change selection
    await userEvent.selectOptions(
      thresholdSelect.element(),
      screen.getByRole('option', { name: '1 hour' })
    );

    // after
    await expect
      .element(thresholdSelect)
      .toHaveValue(String(selectedThreshold));

    // confirm changes
    await screen.getByRole('button', { name: 'Save' }).click();
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
    const onClose = vi.fn();
    const setSettings = vi.fn();

    const { getMapCheckbox, screen } = await setupNotifications({
      onClose,
      setSettings,
      settings: mockSettings({ notifications }),
    });

    // before
    await Promise.all(
      maps.map((code) => expect.element(getMapCheckbox(code)).toBeChecked())
    );

    // toggle selection
    await getMapCheckbox(MapCode.BrokenMoon).click(); // unselect
    await getMapCheckbox(MapCode.Olympus).click(); // unselect
    await getMapCheckbox(MapCode.KingsCanyon).click(); // select

    // after
    const selectedMaps = [MapCode.WorldsEdge, MapCode.KingsCanyon];
    await Promise.all(
      selectedMaps.map((code) =>
        expect.element(getMapCheckbox(code)).toBeChecked()
      )
    );

    const unselectedMaps = initialMaps.filter(
      (code) => !selectedMaps.includes(code)
    );
    await Promise.all(
      unselectedMaps.map((code) =>
        expect.element(getMapCheckbox(code)).not.toBeChecked()
      )
    );

    // confirm changes
    await screen.getByRole('button', { name: 'Save' }).click();
    expect(setSettings).toHaveBeenCalledWith({
      notifications: {
        ...notifications,
        maps: selectedMaps,
      },
    });
    expect(onClose).toHaveBeenCalled();
  });
});
