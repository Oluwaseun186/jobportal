import { render, screen } from '@testing-library/react';
import App from './App';

// Mock problematic dependencies
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

// Mock child components
jest.mock('./components/Navbar', () => () => <nav data-testid="navbar">JobPortal</nav>);
jest.mock('./pages/Home', () => () => <div data-testid="home-page">Home Page Content</div>);

test('renders app without crashing', () => {
  render(<App />);
  const navbarElement = screen.getByTestId('navbar');
  expect(navbarElement).toBeInTheDocument();
});

test('renders main content', () => {
  render(<App />);
  const homePageElement = screen.getByTestId('home-page');
  expect(homePageElement).toBeInTheDocument();
});