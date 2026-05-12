import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import KBArticleViewer from '../KBArticleViewer';

// Mock global analytics
global.analytics = {
  track: jest.fn(),
};

describe('KBArticleViewer', () => {
  const articleId = 'sample-article';
  const articleContent = '# Sample Article\n\nThis is a test article.';

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(articleContent),
      })
    );
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<KBArticleViewer articleId={articleId} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('fetches and renders markdown content', async () => {
    render(<KBArticleViewer articleId={articleId} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(`/api/kb/${articleId}`, expect.any(Object)));

    // Content should be rendered
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sample Article');
    expect(screen.getByText('This is a test article.')).toBeInTheDocument();

    // View event logged
    expect(global.analytics.track).toHaveBeenCalledWith('KB Article Viewed', { articleId });
  });

  it('logs click event when article is clicked', async () => {
    render(<KBArticleViewer articleId={articleId} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const viewer = screen.getByRole('heading', { level: 1 }).parentElement;
    fireEvent.click(viewer);

    expect(global.analytics.track).toHaveBeenCalledWith('KB Article Clicked', { articleId });
  });

  it('handles fetch error', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    render(<KBArticleViewer articleId={articleId} />);
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  });
});