import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

test('renders app without crashing', () => {
  localStorageMock.getItem.mockReturnValue(null);
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  // App should render without errors
  expect(document.body).toBeTruthy();
});
