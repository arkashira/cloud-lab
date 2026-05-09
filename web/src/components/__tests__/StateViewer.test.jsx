import React from 'react';
import { render, screen } from '@testing-library/react';
import StateViewer from '../StateViewer';
import { act } from 'react-dom/test-utils';

jest.mock('../services/terraformService', () => ({
  getTerraformState: jest.fn().mockResolvedValue({
    resources: [
      { address: 'resource1', type: 'type1', name: 'name1', provider: 'provider1' },
      { address: 'resource2', type: 'type2', name: 'name2', provider: 'provider2' }
    ],
    outputs: { output1: { value: 'outputValue1' }, output2: { value: 'outputValue2' } },
    last_change_by: 'user@example.com'
  }),
  subscribeToTerraformState: jest.fn()
}));

describe('StateViewer Component', () => {
  test('renders resources and outputs correctly', async () => {
    await act(async () => {
      render(<StateViewer />);
    });

    expect(screen.getByText(/resource1/i)).toBeInTheDocument();
    expect(screen.getByText(/resource2/i)).toBeInTheDocument();
    expect(screen.getByText(/output1: "outputValue1"/i)).toBeInTheDocument();
    expect(screen.getByText(/output2: "outputValue2"/i)).toBeInTheDocument();
    expect(screen.getByText(/Last changed by: user@example\.com/i)).toBeInTheDocument();
  });
});