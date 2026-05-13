import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import templates from '../data/templates.json';
import './TemplateCatalog.css';

const COMPONENT_OPTIONS = [
  'All',
  'VPC',
  'EKS',
  'S3',
  'Lambda',
  'RDS',
  'EC2',
  'IAM',
  'CloudFront',
  'Route53',
  'SNS',
  'SQS',
];

export default function TemplateCatalog() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === 'All' || t.components.includes(filter);
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="catalog-page">
      <h1>Template Catalog</h1>

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {COMPONENT_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="cards-grid">
        {filteredTemplates.map((t) => (
          <div key={t.id} className="card">
            <Link to={`/templates/${t.id}`}>
              <img
                src={t.previewImage}
                alt={`${t.name} preview`}
                className="card-image"
              />
              <div className="card-content">
                <h3>{t.name}</h3>
                <p>{t.description}</p>
              </div>
            </Link>
          </div>
        ))}
        {filteredTemplates.length === 0 && (
          <p className="no-results">No templates match your criteria.</p>
        )}
      </div>
    </div>
  );
}