import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { MapCode, MapImage, MapName } from 'constants/map';
import { getDate } from 'lib/datetime';
import type MapType from 'types/map';
import Map, {
  HAS_ENDED_THRESHOLD,
  IS_ENDING_THRESHOLD,
  type MapProps,
} from './map';

const systemDateTime = '2019-06-30T16:00:00Z';

const mockMap = (props: Partial<MapType> = {}): MapType => {
  return {
    code: MapCode.BrokenMoon,
    end: new Date().toISOString(),
    image: MapImage.broken_moon,
    name: MapName.broken_moon,
    start: new Date().toISOString(),
    ...props,
  };
};

async function setup({
  current,
  isRankedGameMode,
  map = mockMap(),
}: Partial<MapProps>) {
  const screen = await render(
    <Map current={current} isRankedGameMode={isRankedGameMode} map={map} />
  );

  return { screen };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(systemDateTime));
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test('can display current map', async () => {
  const { screen } = await setup({ current: true });

  await expect.element(screen.getByText('Live')).toBeInTheDocument();
  await expect.element(screen.getByText('Upcoming')).not.toBeInTheDocument();
  await expect.element(screen.getByRole('timer')).toHaveTextContent('0s');
});

test('should turn "is ending" state when passing the threshold for the current map', async () => {
  const map = mockMap({
    end: getDate(systemDateTime)
      .add(IS_ENDING_THRESHOLD, 'milliseconds')
      .toISOString(),
  });

  const { screen } = await setup({ current: true, map });

  const mapComponent = screen.getByTestId('map');

  await expect.element(mapComponent).toHaveAttribute('data-is-ending', 'false');
  vi.advanceTimersByTime(1000);
  await expect.element(mapComponent).toHaveAttribute('data-is-ending', 'true');
});

test('should turn "has ended" state when passing the threshold for the current map', async () => {
  const map = mockMap({
    end: getDate(systemDateTime)
      .add(HAS_ENDED_THRESHOLD, 'milliseconds')
      .toISOString(),
  });

  const { screen } = await setup({ current: true, map });

  const mapComponent = screen.getByTestId('map');

  await expect.element(mapComponent).toHaveAttribute('data-has-ended', 'false');
  vi.advanceTimersByTime(1000);
  await expect.element(mapComponent).toHaveAttribute('data-has-ended', 'true');
});

test('can display next map', async () => {
  const { screen } = await setup({ current: false });

  await expect.element(screen.getByText('Upcoming')).toBeInTheDocument();
  await expect.element(screen.getByText('Live')).not.toBeInTheDocument();
  await expect.element(screen.getByRole('timer')).not.toBeInTheDocument();
});

test('can display map for ranked mode', async () => {
  const map = mockMap({
    start: getDate(systemDateTime).add(-1, 'day').toISOString(),
  });

  const { screen } = await setup({ isRankedGameMode: true, map });

  await expect
    .element(screen.getByTestId('map-schedule'))
    .toHaveTextContent('From Sat 29, 16:00 to Sun 30, 16:00');
});

describe('Maps', () => {
  test.each(
    Object.values(MapCode).map((code) => [
      { code, image: MapImage[code], name: MapName[code] },
    ])
  )('can display %s map', async ({ code, image, name }) => {
    const map = mockMap({
      code,
      end: '2019-06-30T16:30:00Z',
      image,
      name,
      start: '2019-06-30T15:30:00Z',
    });

    const { screen } = await setup({ map });

    await expect.element(screen.getByText(name)).toBeInTheDocument();
    await expect
      .element(screen.getByTestId('map-schedule'))
      .toHaveTextContent('From 15:30 to 16:30');
  });
});
