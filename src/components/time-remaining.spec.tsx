import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import TimeRemaining, { type TimeRemainingProps } from './time-remaining';

const systemDateTime = '2019-06-30T16:00:00Z';

async function setup({
  onTimeRemaining = () => {},
  to = '2019-06-30T16:00:00Z',
}: Partial<TimeRemainingProps> = {}) {
  const renderComponent = (props: Partial<TimeRemainingProps> = {}) => (
    <TimeRemaining onTimeRemaining={onTimeRemaining} to={to} {...props} />
  );

  const screen = await render(renderComponent());

  return {
    rerender: async (props: Partial<TimeRemainingProps> = {}) => {
      await screen.rerender(renderComponent(props));
    },
    timer: screen.getByRole('timer'),
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(systemDateTime));
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test('should display remaining time', async () => {
  const { timer } = await setup({ to: '2019-06-30T16:34:01Z' });

  await expect.element(timer).toHaveTextContent('34m 1s');
});

test('should update remaining time after one second', async () => {
  const { timer } = await setup({ to: '2019-06-30T16:09:59Z' });

  await expect.element(timer).toHaveTextContent('9m 59s');
  vi.advanceTimersByTime(1000);
  await expect.element(timer).toHaveTextContent('9m 58s');
});

test('should update remaining time when `to` prop changes', async () => {
  const { rerender, timer } = await setup();

  await expect.element(timer).toHaveTextContent('0s');
  await rerender({ to: '2019-06-30T18:30:00Z' });
  await expect.element(timer).toHaveTextContent('2h 30m 0s');
});

test('should stop timer if completed', async () => {
  const { timer } = await setup({ to: '2019-06-30T16:00:10Z' });

  await expect.element(timer).toHaveTextContent('10s');
  vi.advanceTimersByTime(10000);
  await expect.element(timer).toHaveTextContent('0s');
  vi.advanceTimersByTime(1000);
  await expect.element(timer).toHaveTextContent('0s');
});

test('should trigger `onTimeRemaining` callback every second', async () => {
  const onTimeRemaining = vi.fn();

  await setup({ onTimeRemaining, to: '2019-06-30T16:00:02Z' });

  vi.advanceTimersByTime(1000);
  await vi.waitFor(() => {
    expect(onTimeRemaining).toHaveBeenCalledWith(1000);
  });
  vi.advanceTimersByTime(1000);
  await vi.waitFor(() => {
    expect(onTimeRemaining).toHaveBeenCalledWith(0);
  });
});

test('should trigger updated `onTimeRemaining` callback', async () => {
  const onTimeRemaining1 = vi.fn();
  const onTimeRemaining2 = vi.fn();

  const { rerender } = await setup({
    onTimeRemaining: onTimeRemaining1,
    to: '2019-06-30T16:00:02Z',
  });

  vi.advanceTimersByTime(1000);
  await vi.waitFor(() => {
    expect(onTimeRemaining1).toHaveBeenCalledWith(1000);
  });

  await rerender({ onTimeRemaining: onTimeRemaining2 });

  vi.advanceTimersByTime(1000);
  await vi.waitFor(() => {
    expect(onTimeRemaining2).toHaveBeenCalledWith(0);
    expect(onTimeRemaining1).toHaveBeenCalledTimes(1);
  });
});

test('should not display negative values if re-rendered past time', async () => {
  const { rerender, timer } = await setup();

  await expect.element(timer).toHaveTextContent('0s');

  vi.advanceTimersByTime(1000);
  await rerender();
  await expect.element(timer).toHaveTextContent('0s');
});
