import { render, screen } from '@testing-library/react';
import App from './App';

test('should render hello world', async () => {
  render(<App />);
  expect(screen.getByText('Hello world!')).toBeInTheDocument();
});
