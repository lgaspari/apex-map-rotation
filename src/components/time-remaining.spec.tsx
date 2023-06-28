import { act, render } from '@testing-library/react';
import TimeRemaining from './time-remaining';
import { getDate } from 'lib/datetime';

const systemDateTime = '2019-06-30T16:00:00Z';

function setup({ to }: { to: ISOString }) {
  const utils = render(<TimeRemaining to={getDate(to).valueOf()} />);

  return {
    ...utils,
    timer: utils.getByRole('timer'),
  };
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

test('should display remaining time', () => {
  const { timer } = setup({ to: '2019-06-30T16:34:55Z' });

  expect(timer).toHaveTextContent('00:34:55');
});

test('should update remaining time after one second', () => {
  const { timer } = setup({ to: '2019-06-30T16:09:59Z' });

  expect(timer).toHaveTextContent('00:09:59');
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(timer).toHaveTextContent('00:09:58');
});

test('should stop timer if completed', () => {
  const { timer } = setup({ to: '2019-06-30T16:00:10Z' });

  expect(timer).toHaveTextContent('00:00:10');
  act(() => {
    jest.advanceTimersByTime(10000);
  });
  expect(timer).toHaveTextContent('00:00:00');
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(timer).toHaveTextContent('00:00:00');
});
