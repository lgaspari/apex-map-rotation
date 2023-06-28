import { act, render, screen } from '@testing-library/react';
import { MapCode, MapName } from 'constants/map';
import { getDate } from 'lib/datetime';
import type MapType from 'types/map';
import Map, { type MapProps } from './map';

const systemDateTime = '2019-06-30T16:00:00Z';

const mockMap = ({ code }: Pick<MapType, 'code'>): MapType => {
  const start = getDate(systemDateTime).subtract(30, 'minutes');

  return {
    code,
    end: start.add(1, 'hour'),
    start,
  };
};

function setup({
  current,
  map = mockMap({ code: MapCode.BrokenMoon }),
}: Partial<MapProps>) {
  return render(<Map current={current} map={map} />);
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
  expect(screen.getByRole('timer')).toHaveTextContent('00:30:00');
});

test('can display next map', () => {
  setup({ current: false });

  expect(screen.getByText('Next map')).toBeInTheDocument();
  expect(screen.queryByText('Current map')).not.toBeInTheDocument();

  expect(screen.queryByText('Time remaining')).not.toBeInTheDocument();
  expect(screen.queryByRole('timer')).not.toBeInTheDocument();
});

describe('Maps', () => {
  test.each(Object.values(MapCode).map((code) => [MapName[code], code]))(
    'can display %s map',
    (name, code) => {
      const map = mockMap({ code });

      setup({ map });

      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByTestId('map-schedule')).toHaveTextContent(
        'From 15:30 to 16:30'
      );
    }
  );
});
