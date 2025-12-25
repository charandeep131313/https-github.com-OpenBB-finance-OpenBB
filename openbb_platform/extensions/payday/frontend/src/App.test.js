import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const linkElement = screen.getByText(/Fastest & Fairest e-Transfer Online Payday Loans in Canada/i);
  expect(linkElement).toBeInTheDocument();
});
