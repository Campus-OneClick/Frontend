import { render, screen } from '@testing-library/react';
import App from './App';
<<<<<<< HEAD
import "./App.css";
=======

>>>>>>> a1cdfe68d701592594529459ad17efb71bcb4da1
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
