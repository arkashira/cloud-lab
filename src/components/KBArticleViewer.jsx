import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * KBArticleViewer
 *
 * Props:
 *  - articleId: string (required) – the identifier of the KB article to load.
 *  - onClose: function (optional) – callback invoked when the viewer is closed.
 *
 * This component fetches the markdown content of a KB article from the
 * `/api/kb/:id` endpoint, renders it using react-markdown, and logs
 * analytics events for viewing and clicking the article.
 */
const KBArticleViewer = ({ articleId, onClose }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load article content on mount or when articleId changes
  useEffect(() => {
    if (!articleId) return;

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`/api/kb/${articleId}`, { signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
        // Log view event
        if (window.analytics && typeof window.analytics.track === 'function') {
          window.analytics.track('KB Article Viewed', { articleId });
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [articleId]);

  const handleClick = () => {
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('KB Article Clicked', { articleId });
    }
  };

  if (loading) return <div className="kb-article-loading">Loading...</div>;
  if (error) return <div className="kb-article-error">Error: {error}</div>;

  return (
    <div className="kb-article-viewer" onClick={handleClick}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      {onClose && (
        <button type="button" className="kb-article-close" onClick={onClose}>
          Close
        </button>
      )}
    </div>
  );
};

export default KBArticleViewer;