import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import QuotaUI from './QuotaUI';

describe('QuotaUI component', () => {
  it('updates form state on input change', () => {
    render(<QuotaUI />);
    
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Test Quota' } });
    
    expect(nameInput.value).toBe('Test Quota');
  });

  it('disables button during submission', async () => {
    render(<QuotaUI />);
    
    const submitButton = screen.getByRole('button', { name: /update quota/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});