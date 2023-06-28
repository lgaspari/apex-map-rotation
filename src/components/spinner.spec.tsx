import { render } from '@testing-library/react';
import Spinner, { type SpinnerProps } from './spinner';

function setup({ size }: SpinnerProps = {}) {
  const utils = render(<Spinner size={size} />);

  return {
    ...utils,
    spinner: utils.getByRole('status'),
  };
}

test('can display small spinner', () => {
  const { spinner } = setup({ size: 'small' });
  expect(spinner).toHaveClass('h-6 w-6 border-2');
});

test('can display large spinner', () => {
  const { spinner } = setup({ size: 'large' });
  expect(spinner).toHaveClass('h-12 w-12 border-4');
});

test('should announce status for screen readers', () => {
  const { spinner } = setup();
  expect(spinner).toHaveTextContent('Loading...');
});
