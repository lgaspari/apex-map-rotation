import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import Dialog, { type DialogProps } from './dialog';

function setup({
  children = <div>Dialog content</div>,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose = () => {},
  opened = true,
  title = 'Dialog title',
}: Partial<DialogProps> = {}) {
  const screen = render(
    <Dialog onClose={onClose} opened={opened} title={title}>
      {children}
    </Dialog>
  );

  return { screen };
}

test('has correct accessibility', async () => {
  const { screen } = setup({ title: 'My dialog' });

  await expect
    .element(screen.getByRole('dialog', { name: 'My dialog' }))
    .toBeInTheDocument();
});

test('can close dialog', async () => {
  const onClose = vi.fn();

  const { screen } = setup({ onClose });

  await screen.getByRole('button', { name: 'Close' }).click();
  expect(onClose).toHaveBeenCalled();
});

test('can display title', async () => {
  const { screen } = setup({ title: 'Custom title' });

  await expect.element(screen.getByText('Custom title')).toBeInTheDocument();
});

test('can display content', async () => {
  const { screen } = setup({ children: <div>Custom content</div> });

  await expect.element(screen.getByText('Custom content')).toBeInTheDocument();
});
