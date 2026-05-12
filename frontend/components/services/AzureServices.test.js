import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import AzureServices from './AzureServices';

jest.mock('axios');

describe('AzureServices Component', () => {
  it('should fetch and display Azure services', async () => {
    axios.get.mockResolvedValue({ data: [{ id: '1', name: 'Storage' }, { id: '2', name: 'Compute' }] });

    render(<AzureServices />);

    fireEvent.click(screen.getByText('Fetch Services'));

    expect(await screen.findByText('Storage')).toBeInTheDocument();
    expect(await screen.findByText('Compute')).toBeInTheDocument();
  });

  it('should create an Azure resource', async () => {
    axios.post.mockResolvedValue({});

    render(<AzureServices />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Storage' } });
    fireEvent.click(screen.getByText('Create Resource'));

    expect(axios.post).toHaveBeenCalledWith('/api/azure/resources', { service: 'Storage' });
    expect(await screen.findByText('Resource created successfully!')).toBeInTheDocument();
  });

  it('should delete an Azure resource', async () => {
    axios.delete.mockResolvedValue({});

    render(<AzureServices />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Storage' } });
    fireEvent.click(screen.getByText('Delete Resource'));

    expect(axios.delete).toHaveBeenCalledWith('/api/azure/resources/Storage');
    expect(await screen.findByText('Resource deleted successfully!')).toBeInTheDocument();
  });
});