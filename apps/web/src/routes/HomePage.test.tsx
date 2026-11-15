import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from './HomePage';

describe('home page', () => {
  it('shows the scaffold welcome message', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /make room for the moments/i })).toBeInTheDocument();
    expect(screen.getByText('Project scaffold ready')).toBeInTheDocument();
  });
});
