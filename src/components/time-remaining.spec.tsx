import { act, render } from '@testing-library/react';
import TimeRemaining, { type TimeRemainingProps } from './time-remaining';

const systemDateTime = '2019-06-30T16:00:00Z';

function setup({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTimeRemaining = () => {},
  to = '2019-06-30T16:00:00Z',
}: Partial<TimeRemainingProps> = {}) {
  const { rerender, ...utils } = render(
    <TimeRemaining onTimeRemaining={onTimeRemaining} to={to} />
  );

  return {
    ...utils,
    rerender: (props: Partial<TimeRemainingProps> = {}) =>
      rerender(
        <TimeRemaining onTimeRemaining={onTimeRemaining} to={to} {...props} />
      ),
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
  const { timer } = setup({ to: '2019-06-30T16:34:01Z' });

  expect(timer).toHaveTextContent('34m 1s');
});

test('should update remaining time after one second', () => {
  const { timer } = setup({ to: '2019-06-30T16:09:59Z' });

  expect(timer).toHaveTextContent('9m 59s');
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(timer).toHaveTextContent('9m 58s');
});

test('should update remaining time when `to` prop changes', () => {
  const { rerender, timer } = setup();

  expect(timer).toHaveTextContent('0s');
  rerender({ to: '2019-06-30T18:30:00Z' });
  expect(timer).toHaveTextContent('2h 30m 0s');
});

test('should stop timer if completed', () => {
  const { timer } = setup({ to: '2019-06-30T16:00:10Z' });

  expect(timer).toHaveTextContent('10s');
  act(() => {
    jest.advanceTimersByTime(10000);
  });
  expect(timer).toHaveTextContent('0s');
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(timer).toHaveTextContent('0s');
});

test('should trigger `onTimeRemaining` callback every second', () => {
  const onTimeRemaining = jest.fn();

  setup({ onTimeRemaining, to: '2019-06-30T16:00:02Z' });

  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(onTimeRemaining).toHaveBeenCalledWith(1000);

  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(onTimeRemaining).toHaveBeenCalledWith(0);
});

test('should trigger updated `onTimeRemaining` callback', () => {
  const onTimeRemaining1 = jest.fn();
  const onTimeRemaining2 = jest.fn();

  const { rerender } = setup({
    onTimeRemaining: onTimeRemaining1,
    to: '2019-06-30T16:00:02Z',
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(onTimeRemaining1).toHaveBeenCalledWith(1000);

  rerender({ onTimeRemaining: onTimeRemaining2 });
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(onTimeRemaining2).toHaveBeenCalledWith(0);
  expect(onTimeRemaining1).toHaveBeenCalledTimes(1);
});

test('should not display negative values if re-rendered past time', () => {
  const { rerender, timer } = setup();

  expect(timer).toHaveTextContent('0s');
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  rerender();
  expect(timer).toHaveTextContent('0s');
});
