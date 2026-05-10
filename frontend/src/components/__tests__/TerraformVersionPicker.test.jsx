import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TerraformVersionPicker from '../TerraformVersionPicker';

describe('TerraformVersionPicker', () => {
  // Hardcoded expected list for assertion
  const versions = [
    '0.12.31',
    '0.13.7',
    '0.14.11',
    '0.15.5',
    '1.0.11',
    '1.1.9',
    '1.2.9',
    '1.3.9',
    '1.4.6',
    '1.5.0',
  ];

  it('renders with the provided selected value', () => {
    const { getByTestId } = render(
      <TerraformVersionPicker value="1.3.9" onChange={() => {}} />
    );
    const select = getByTestId('terraform-version-select');
    expect(select.value).toBe('1.3.9');
  });

  it('calls onChange with the new version when selection changes', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <TerraformVersionPicker value="1.0.11" onChange={handleChange} />
    );
    const select = getByTestId('terraform-version-select');
    
    fireEvent.change(select, { target: { value: '1.4.6' } });
    
    expect(handleChange).toHaveBeenCalledWith('1.4.6');
  });

  it('disables the selector when disabled prop is true', () => {
    const { getByTestId } = render(
      <TerraformVersionPicker value="1.2.9" onChange={() => {}} disabled />
    );
    const select = getByTestId('terraform-version-select');
    expect(select).toBeDisabled();
  });

  it('contains all supported version options', () => {
    const { getByTestId } = render(
      <TerraformVersionPicker value="0.12.31" onChange={() => {}} />
    );
    const select = getByTestId('terraform-version-select');
    const options = Array.from(select.options).map((opt) => opt.value);
    expect(options).toEqual(versions);
  });
});