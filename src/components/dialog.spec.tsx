import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dialog, { type DialogProps } from './dialog';

function setup({
  children = <div>Dialog content</div>,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose = () => {},
  opened = true,
  title = 'Dialog title',
}: Partial<DialogProps> = {}) {
  const user = userEvent.setup();

  const utils = render(
    <Dialog onClose={onClose} opened={opened} title={title}>
      {children}
    </Dialog>
  );

  return {
    ...utils,
    user,
  };
}

test('has correct accessibility', async () => {
  setup({ title: 'My dialog' });
  expect(screen.getByRole('dialog', { name: 'My dialog' })).toBeInTheDocument();
});

test('can close dialog', async () => {
  const onClose = jest.fn();

  const { user } = setup({ onClose });

  await user.click(screen.getByRole('button', { name: 'Close' }));
  expect(onClose).toHaveBeenCalled();
});

test('can display title', async () => {
  setup({ title: 'Custom title' });
  expect(screen.getByText('Custom title')).toBeInTheDocument();
});

test('can display content', async () => {
  setup({ children: <div>Custom content</div> });
  expect(screen.getByText('Custom content')).toBeInTheDocument();
});
