import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/lib/hooks/useAuth';

// Create mock functions
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockPush = jest.fn();

// Mock the next-auth module
jest.mock('next-auth', () => ({
  signIn: jest.fn().mockImplementation((...args) => mockSignIn(...args)),
  signOut: jest.fn().mockImplementation((...args) => mockSignOut(...args)),
}));

// Mock next/navigation useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useSession from next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: jest.fn().mockImplementation((...args) => mockSignIn(...args)),
  signOut: jest.fn().mockImplementation((...args) => mockSignOut(...args)),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('handles successful sign in', async () => {
    // Mock successful sign in
    mockSignIn.mockResolvedValueOnce({ 
      ok: true, 
      error: null 
    });

    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });
    
    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password123',
      redirect: false
    });
    expect(result.current.error).toBe('');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('handles login error correctly', async () => {
    // Mock failed sign in
    mockSignIn.mockResolvedValueOnce({ 
      ok: false, 
      error: 'Invalid credentials' 
    });

    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const success = await result.current.login('test@example.com', 'wrongpassword');
      expect(success).toBe(false);
    });
    
    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'wrongpassword',
      redirect: false
    });
    expect(result.current.error).toBe('Invalid credentials');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handles successful logout', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/' });
  });
}); 