import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ActivityTracker from '../../components/ActivityTracker';

// Mock the window event listeners
const mockAddEventListener = jest.spyOn(window, 'addEventListener');
const mockRemoveEventListener = jest.spyOn(window, 'removeEventListener');

describe('ActivityTracker Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should not attach event listeners when isActive is false', () => {
    render(<ActivityTracker isActive={false} />);
    
    // No event listeners should be registered
    expect(mockAddEventListener).not.toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(mockAddEventListener).not.toHaveBeenCalledWith('click', expect.any(Function));
    expect(mockAddEventListener).not.toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  it('should attach event listeners when isActive is true', () => {
    render(<ActivityTracker isActive={true} />);
    
    // Event listeners should be registered
    expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(mockAddEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    expect(mockAddEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(mockAddEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });

  it('should call onKeyPress when key event is fired', () => {
    const onKeyPressMock = jest.fn();
    render(<ActivityTracker isActive={true} onKeyPress={onKeyPressMock} />);
    
    // Trigger a keydown event
    const keydownEvent = new KeyboardEvent('keydown');
    window.dispatchEvent(keydownEvent);
    
    expect(onKeyPressMock).toHaveBeenCalledTimes(1);
  });

  it('should call onMouseClick when click event is fired', () => {
    const onMouseClickMock = jest.fn();
    render(<ActivityTracker isActive={true} onMouseClick={onMouseClickMock} />);
    
    // Trigger a click event
    const clickEvent = new MouseEvent('click');
    window.dispatchEvent(clickEvent);
    
    expect(onMouseClickMock).toHaveBeenCalledTimes(1);
  });

  it('should call onMouseMove when mousemove event is fired and calculate distance correctly', () => {
    const onMouseMoveMock = jest.fn();
    render(<ActivityTracker isActive={true} onMouseMove={onMouseMoveMock} />);
    
    // First mouse move establishes a baseline and doesn't trigger the callback
    fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });
    expect(onMouseMoveMock).not.toHaveBeenCalled();
    
    // Second mouse move should calculate distance and call the callback
    fireEvent.mouseMove(window, { clientX: 103, clientY: 104 });
    
    // Distance should be sqrt(3² + 4²) = 5
    expect(onMouseMoveMock).toHaveBeenCalledWith(5);
  });

  it('should clean up event listeners when component unmounts', () => {
    const { unmount } = render(<ActivityTracker isActive={true} />);
    
    // Unmount component
    unmount();
    
    // Event listeners should be removed
    expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(mockRemoveEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    expect(mockRemoveEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(mockRemoveEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });
  
  it('should not call handlers when not provided', () => {
    // This test ensures the component doesn't crash when handlers are not provided
    render(<ActivityTracker isActive={true} />);
    
    // Trigger a keydown event
    const keydownEvent = new KeyboardEvent('keydown');
    window.dispatchEvent(keydownEvent);
    
    // Trigger a click event
    const clickEvent = new MouseEvent('click');
    window.dispatchEvent(clickEvent);
    
    // Trigger a mousemove event
    fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });
    
    // No errors should occur
  });
}); 