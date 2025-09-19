import { render, screen, fireEvent } from '@testing-library/react';
import { RoleSwitcher } from './RoleSwitcher';
import { AuthProvider } from '@/lib/auth/context';

// Mock the auth context
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('RoleSwitcher', () => {
  it('renders compact role switcher', () => {
    render(
      <MockAuthProvider>
        <RoleSwitcher compact />
      </MockAuthProvider>
    );
    
    expect(screen.getByText('HOA President/Captain')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(
      <MockAuthProvider>
        <RoleSwitcher compact />
      </MockAuthProvider>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('Board Member')).toBeInTheDocument();
    expect(screen.getByText('Homeowner')).toBeInTheDocument();
  });
});






