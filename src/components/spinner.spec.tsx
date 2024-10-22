import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import Spinner, { type SpinnerProps } from './spinner';

function setup({ size }: SpinnerProps = {}) {
  const screen = render(<Spinner size={size} />);

  return {
    spinner: screen.getByRole('status'),
  };
}

test('can display small spinner', async () => {
  const { spinner } = setup({ size: 'small' });

  await expect.element(spinner).toHaveClass('h-6 w-6 border-2');
});

test('can display large spinner', async () => {
  const { spinner } = setup({ size: 'large' });

  await expect.element(spinner).toHaveClass('h-12 w-12 border-4');
});

test('should announce status for screen readers', async () => {
  const { spinner } = setup();

  await expect.element(spinner).toHaveTextContent('Loading...');
});
