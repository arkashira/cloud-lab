import React from 'react';
import { render } from '@testing-library/react';
import FAQ from './FAQ';

describe('FAQ component', () => {
  it('renders FAQ section', () => {
    const { getByText } = render(<FAQ />);
    expect(getByText('FAQ')).toBeInTheDocument();
  });

  it('renders azure service questions', () => {
    const { getByText } = render(<FAQ />);
    azureServices.forEach((service) => {
      expect(getByText(service)).toBeInTheDocument();
    });
  });
});