import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FocusCoach from '../../components/FocusCoach';

describe('FocusCoach Component', () => {
  const mockInsight = {
    analysis: 'Test analysis of your work patterns',
    tips: ['Test tip 1', 'Test tip 2', 'Test tip 3'],
    insight: 'Test key insight about your focus'
  };

  it('should render with default insight when no insight is provided', () => {
    render(<FocusCoach />);
    
    expect(screen.getByText('AI Focus Coach')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to your AI Focus Coach/)).toBeInTheDocument();
  });

  it('should render loading state when isLoading is true', () => {
    render(<FocusCoach isLoading={true} />);
    
    expect(screen.getByText('Analyzing your work patterns...')).toBeInTheDocument();
    expect(screen.getByText('AI Focus Coach')).toBeInTheDocument();
  });

  it('should render provided insights correctly', () => {
    render(<FocusCoach insight={mockInsight} />);
    
    expect(screen.getByText('AI Focus Coach')).toBeInTheDocument();
    expect(screen.getByText('Test analysis of your work patterns')).toBeInTheDocument();
  });

  it('should toggle expanded state when header is clicked', () => {
    render(<FocusCoach insight={mockInsight} />);
    
    // Initially collapsed, tips should not be visible
    expect(screen.queryByText('Personalized Tips')).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(screen.getByText('AI Focus Coach'));
    
    // Now expanded, tips should be visible
    expect(screen.getByText('Personalized Tips')).toBeInTheDocument();
    expect(screen.getByText('Test tip 1')).toBeInTheDocument();
    expect(screen.getByText('Test tip 2')).toBeInTheDocument();
    expect(screen.getByText('Test tip 3')).toBeInTheDocument();
    expect(screen.getByText('Key Insight')).toBeInTheDocument();
    expect(screen.getByText('Test key insight about your focus')).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(screen.getByText('AI Focus Coach'));
    
    // Tips should still be in the DOM but potentially hidden by CSS
    // Testing library doesn't check CSS, so we need to check for the parent container's class
    const container = screen.getByText('Test analysis of your work patterns').closest('div');
    expect(container?.parentElement).toHaveClass('max-h-24');
  });

  it('should not display tips when collapsed', () => {
    const { container } = render(<FocusCoach insight={mockInsight} />);
    
    // Check if the container has the collapsed class
    const expandableSection = container.querySelector('[class*="overflow-hidden"]');
    expect(expandableSection).toHaveClass('max-h-24');
    expect(expandableSection).not.toHaveClass('max-h-96');
  });

  it('should handle empty tips array gracefully', () => {
    const emptyTipsInsight = {
      ...mockInsight,
      tips: []
    };
    
    render(<FocusCoach insight={emptyTipsInsight} />);
    
    // Expand the coach
    fireEvent.click(screen.getByText('AI Focus Coach'));
    
    // Should show the "Personalized Tips" header even with empty tips
    expect(screen.getByText('Personalized Tips')).toBeInTheDocument();
    // But no tip items should be rendered
    expect(screen.queryByText('•')).not.toBeInTheDocument();
  });
}); 