import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import TerraformWizard from '../components/TerraformWizard';
import axios from 'axios';

jest.mock('axios');

describe('TerraformWizard', () => {
  it('renders templates', async () => {
    axios.get.mockResolvedValue({
      data: [
        { name: 'VPC' },
        { name: 'EKS' },
        { name: 'RDS' },
      ],
    });
    const { getByText } = render(<TerraformWizard />);
    await waitFor(() => expect(getByText('VPC')).toBeInTheDocument());
    await waitFor(() => expect(getByText('EKS')).toBeInTheDocument());
    await waitFor(() => expect(getByText('RDS')).toBeInTheDocument());
  });

  it('applies template', async () => {
    axios.post.mockResolvedValue({
      data: { status: 'success' },
    });
    const { getByText } = render(<TerraformWizard />);
    const applyButton = getByText('Apply');
    fireEvent.click(applyButton);
    await waitFor(() => expect(getByText('Apply status: success')).toBeInTheDocument());
  });

  it('destroys resources', async () => {
    axios.post.mockResolvedValue({
      data: { status: 'success' },
    });
    const { getByText } = render(<TerraformWizard />);
    const destroyButton = getByText('Destroy');
    fireEvent.click(destroyButton);
    await waitFor(() => expect(getByText('Apply status: null')).toBeInTheDocument());
  });

  it('downloads logs', async () => {
    axios.get.mockResolvedValue({
      data: 'logs',
    });
    const { getByText } = render(<TerraformWizard />);
    const downloadButton = getByText('Download logs');
    fireEvent.click(downloadButton);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  });
});