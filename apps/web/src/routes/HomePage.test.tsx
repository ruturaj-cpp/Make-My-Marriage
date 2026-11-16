import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

afterEach(cleanup);

describe('home page', () => {
  it('supports the compact navigation and exposes language availability', () => {
    render(<HomePage />);

    const menuButton = screen.getByRole('button', { name: 'Open navigation menu' });
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toHaveClass('is-open');

    fireEvent.click(screen.getByText(/^English/, { selector: 'summary' }));
    expect(screen.getByText('English (selected)')).toBeInTheDocument();
    expect(screen.getByText('Hindi (coming soon)')).toBeInTheDocument();
    expect(screen.getByText('Marathi (coming soon)')).toBeInTheDocument();
  });

  it('renders the wedding planning landing page and filters inspiration', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /your dream wedding/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /how make my marriage works/i }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Mehendi' }));
    expect(screen.getByRole('heading', { name: 'Intricate Bridal Mehendi' })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Sunlit Marigold Courtyard' }),
    ).not.toBeInTheDocument();
    fireEvent.error(screen.getByAltText('Intricate Bridal Mehendi'));
    expect(screen.getByRole('img', { name: 'Intricate Bridal Mehendi' })).toHaveTextContent(
      'Image preview unavailable',
    );
  });

  it('opens invitation and demonstration listing previews', () => {
    render(<HomePage />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Preview style' })[0]!);
    expect(
      screen.getByRole('dialog', { name: /rajasthani heritage invitation preview/i }),
    ).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Caterers' }));
    fireEvent.click(screen.getByRole('button', { name: /explore details/i }));
    expect(
      screen.getByRole('dialog', { name: /caterers sample listing details/i }),
    ).toHaveTextContent('not a real or verified business');
  });
});
