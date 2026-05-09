import React, { useEffect, useState } from 'react';
import { getTerraformState, subscribeToTerraformState } from '../services/terraformService';
import './StateViewer.css'; // optional styling file

export default function StateViewer() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial load
    getTerraformState()
      .then(data => {
        setState(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load Terraform state.');
        setLoading(false);
      });

    // Subscribe for real-time updates
    const unsubscribe = subscribeToTerraformState(data => {
      setState(data);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="state-viewer">Loading Terraform state...</div>;
  }

  if (error) {
    return <div className="state-viewer error">{error}</div>;
  }

  const { resources = [], outputs = {}, last_change_by = 'Unknown' } = state || {};

  return (
    <div className="state-viewer">
      <h2>Terraform State</h2>

      <section className="last-changed">
        <strong>Last changed by:</strong> {last_change_by}
      </section>

      <section className="resources">
        <h3>Resources</h3>
        {resources.length === 0 ? (
          <p>No resources found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Type</th>
                <th>Name</th>
                <th>Provider</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((res, idx) => (
                <tr key={idx}>
                  <td>{res.address}</td>
                  <td>{res.type}</td>
                  <td>{res.name}</td>
                  <td>{res.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="outputs">
        <h3>Outputs</h3>
        {Object.keys(outputs).length === 0 ? (
          <p>No outputs defined.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(outputs).map(([key, valObj]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{JSON.stringify(valObj.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}