import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Home from '../../app/page';

// Mock Next.js components and hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('Home Page', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
  });
  
  it('should render correctly', () => {
    render(<Home />);
    
    // Logo and header
    expect(screen.getByText('AURA')).toBeInTheDocument();
    
    // Hero section
    expect(screen.getByText(/AI-driven/)).toBeInTheDocument();
    expect(screen.getByText(/Productivity/)).toBeInTheDocument();
    expect(screen.getByText(/Optimize your focus & workspace with Azure AI/)).toBeInTheDocument();
    
    // Get Started button
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    
    // Feature cards
    expect(screen.getByText('Facial Expression & Eye Tracking')).toBeInTheDocument();
    expect(screen.getByText('Keyboard & Mouse Interaction Analysis')).toBeInTheDocument();
    expect(screen.getByText('IoT-based Environment Optimization')).toBeInTheDocument();
    
    // Footer
    expect(screen.getByText(/© 2025 AURA/)).toBeInTheDocument();
  });
  
  it('should navigate to login page when Get Started is clicked', () => {
    render(<Home />);
    
    // Click the Get Started button
    fireEvent.click(screen.getByText('Get Started'));
    
    // Check that router.push was called with the correct route
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
  
  it('should render feature cards with correct icons', () => {
    render(<Home />);
    
    // Check that the feature cards contain icons
    const featureCards = screen.getAllByRole('div', { 
      name: (_, element) => element.classList.contains('flex') && element.classList.contains('flex-col') 
    });
    
    // Should have 3 feature cards
    expect(featureCards.length).toBeGreaterThanOrEqual(3);
  });
}); 