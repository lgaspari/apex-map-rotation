import { act, render, screen } from '@testing-library/react';
import { MapCode, MapName } from 'constants/map';
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
    start: new Date().toISOString(),
    ...props,
  };
};

function setup({
  current,
  isRankedGameMode,
  map = mockMap(),
}: Partial<MapProps>) {
  return render(
    <Map current={current} isRankedGameMode={isRankedGameMode} map={map} />
  );
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(systemDateTime));
});

afterEach(() => {
  act(() => {
    jest.runOnlyPendingTimers();
  });
  jest.useRealTimers();
});

test('can display current map', () => {
  setup({ current: true });

  expect(screen.getByText('Current map')).toBeInTheDocument();
  expect(screen.queryByText('Next map')).not.toBeInTheDocument();

  expect(screen.getByText('Time remaining')).toBeInTheDocument();
  expect(screen.getByRole('timer')).toHaveTextContent('00:00:00');
});

test('should turn "is ending" state when passing the threshold for the current map', () => {
  const map = mockMap({
    end: getDate(systemDateTime)
      .add(IS_ENDING_THRESHOLD, 'milliseconds')
      .toISOString(),
  });

  setup({ current: true, map });

  const mapComponent = screen.getByTestId('map');

  expect(mapComponent).toHaveAttribute('data-is-ending', 'false');
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(mapComponent).toHaveAttribute('data-is-ending', 'true');
});

test('should turn "has ended" state when passing the threshold for the current map', () => {
  const map = mockMap({
    end: getDate(systemDateTime)
      .add(HAS_ENDED_THRESHOLD, 'milliseconds')
      .toISOString(),
  });

  setup({ current: true, map });

  const mapComponent = screen.getByTestId('map');

  expect(mapComponent).toHaveAttribute('data-has-ended', 'false');
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(mapComponent).toHaveAttribute('data-has-ended', 'true');
});

test('can display next map', () => {
  setup({ current: false });

  expect(screen.getByText('Next map')).toBeInTheDocument();
  expect(screen.queryByText('Current map')).not.toBeInTheDocument();

  expect(screen.queryByText('Time remaining')).not.toBeInTheDocument();
  expect(screen.queryByRole('timer')).not.toBeInTheDocument();
});

test('can display map for ranked mode', () => {
  const map = mockMap({
    start: getDate(systemDateTime).add(-1, 'day').toISOString(),
  });

  setup({ isRankedGameMode: true, map });

  expect(screen.getByTestId('map-schedule')).toHaveTextContent(
    'From Sat 29, 16:00 to Sun 30, 16:00'
  );
});

describe('Maps', () => {
  test.each(Object.values(MapCode).map((code) => [MapName[code], code]))(
    'can display %s map',
    (name, code) => {
      const map = mockMap({
        code,
        end: '2019-06-30T16:30:00Z',
        start: '2019-06-30T15:30:00Z',
      });

      setup({ map });

      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByTestId('map-schedule')).toHaveTextContent(
        'From 15:30 to 16:30'
      );
    }
  );
});
