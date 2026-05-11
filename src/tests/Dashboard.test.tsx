import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Dashboard } from '../pages/Dashboard';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/create-sandbox', (req, res, ctx) => {
    return res(ctx.json({ message: 'Sandbox created successfully!' }));
  })
);

describe('Dashboard', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('renders Create Sandbox button', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText('Create Sandbox')).toBeInTheDocument();
  });

  it('creates sandbox on button click', async () => {
    const { getByText } = render(<Dashboard />);
    const button = getByText('Create Sandbox');
    fireEvent.click(button);
    await waitFor(() => expect(getByText('Sandbox created successfully!')).toBeInTheDocument());
  });

  it('displays error message on sandbox creation failure', async () => {
    const server = setupServer(
      rest.post('/api/create-sandbox', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Error creating sandbox' }));
      })
    );
    const { getByText } = render(<Dashboard />);
    const button = getByText('Create Sandbox');
    fireEvent.click(button);
    await waitFor(() => expect(getByText('Error creating sandbox')).toBeInTheDocument());
  });
});