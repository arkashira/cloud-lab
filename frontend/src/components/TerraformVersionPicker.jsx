import React from 'react';
import PropTypes from 'prop-types';

/**
 * TerraformVersionPicker
 *
 * A controlled dropdown component for selecting a Terraform version.
 * Uses a curated list of stable patch releases to ensure infrastructure compatibility.
 *
 * Props:
 *   - value (string): The currently selected version (e.g., "1.3.9").
 *   - onChange (function): Callback fired when the selection changes.
 *   - disabled (boolean): Optional flag to disable the input.
 */
const TerraformVersionPicker = ({ value, onChange, disabled }) => {
  // Best of Candidate 1: Explicit list of realistic, stable patch versions.
  // This avoids generating invalid or irrelevant minor versions.
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

  const handleChange = (e) => {
    const newVersion = e.target.value;
    if (onChange) {
      onChange(newVersion);
    }
  };

  return (
    <div className="terraform-version-picker">
      <label 
        htmlFor="terraform-version-select" 
        style={{ marginRight: '0.5rem' }}
      >
        Terraform Version:
      </label>
      <select
        id="terraform-version-select"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        data-testid="terraform-version-select"
      >
        {versions.map((ver) => (
          <option key={ver} value={ver}>
            {ver}
          </option>
        ))}
      </select>
    </div>
  );
};

TerraformVersionPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

TerraformVersionPicker.defaultProps = {
  disabled: false,
};

export default TerraformVersionPicker;