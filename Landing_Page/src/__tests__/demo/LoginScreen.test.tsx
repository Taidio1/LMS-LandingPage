import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginScreen } from '../../components/demo/screens/LoginScreen';
import '@testing-library/jest-dom';

describe('LoginScreen', () => {
  it('calls onLogin with "admin" when Admin button is clicked', () => {
    const onLogin = vi.fn();
    render(<LoginScreen onLogin={onLogin} lang="en" />);

    // Check English translation for button
    const adminBtn = screen.getByText(/Zaloguj jako Admin/i);
    fireEvent.click(adminBtn);

    expect(onLogin).toHaveBeenCalledWith('admin');
  });

  it('calls onLogin with "learner" when Trainee button is clicked', () => {
    const onLogin = vi.fn();
    render(<LoginScreen onLogin={onLogin} lang="en" />);

    // Check English translation for button
    const traineeBtn = screen.getByText(/Zaloguj jako Stażysta/i);
    fireEvent.click(traineeBtn);

    expect(onLogin).toHaveBeenCalledWith('learner');
  });

  it('renders the back button with correct href and translation', () => {
    render(<LoginScreen onLogin={() => {}} homeHref="/test-home" lang="pl" />);

    const backBtn = screen.getByText(/Wróć do strony/i);
    expect(backBtn).toHaveAttribute('href', '/test-home');
  });

  it('renders the informational text from translations', () => {
    render(<LoginScreen onLogin={() => {}} lang="en" />);
    
    expect(screen.queryByText(/welcome to OnboardingTODO demo/i)).not.toBeInTheDocument();
    expect(screen.getByText(/seampleas demo experience/i)).toBeInTheDocument();
  });
});
