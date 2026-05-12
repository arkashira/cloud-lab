import React from 'react';
import { render } from '@testing-library/react';
import Support from './support';

describe('Support component', () => {
  it('renders support section', () => {
    const { getByText } = render(<Support />);
    expect(getByText('Support')).toBeInTheDocument();
  });

  it('renders FAQ component', () => {
    const { getByText } = render(<Support />);
    expect(getByText('FAQ')).toBeInTheDocument();
  });
});