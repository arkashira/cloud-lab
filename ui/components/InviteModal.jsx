import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import api from '../utils/api';

/**
 * InviteModal allows a sandbox owner to invite up to 5 team members via email.
 *
 * Props:
 *  - isOpen (bool): whether the modal is visible
 *  - onClose (func): callback to close the modal
 *  - sandboxId (string): ID of the sandbox to invite to
 *  - onInviteSuccess (func): callback after successful invites
 */
const InviteModal = ({ isOpen, onClose, sandboxId, onInviteSuccess }) => {
  const [emails, setEmails] = useState(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addEmailField = () => {
    if (emails.length < 5) setEmails([...emails, '']);
  };

  const removeEmailField = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const validateEmails = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emails) {
      if (!emailRegex.test(email)) return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmails()) {
      setError('Please enter valid email addresses.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(`/sandboxes/${sandboxId}/invite`, { emails });
      onInviteSuccess && onInviteSuccess(response.data);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send invites.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Members">
      <div style={{ marginBottom: '1rem' }}>
        {emails.map((email, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <Input
              type="email"
              value={email}
              onChange={(e) => handleChange(idx, e.target.value)}
              placeholder="team.member@example.com"
              style={{ flex: 1 }}
            />
            {emails.length > 1 && (
              <Button
                type="button"
                onClick={() => removeEmailField(idx)}
                style={{ marginLeft: '0.5rem' }}
                disabled={loading}
              >
                ✕
              </Button>
            )}
          </div>
        ))}
        {emails.length < 5 && (
          <Button type="button" onClick={addEmailField} disabled={loading}>
            + Add another email
          </Button>
        )}
      </div>
      {error && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="button" onClick={onClose} disabled={loading} style={{ marginRight: '0.5rem' }}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Inviting...' : 'Send Invites'}
        </Button>
      </div>
    </Modal>
  );
};

InviteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sandboxId: PropTypes.string.isRequired,
  onInviteSuccess: PropTypes.func,
};

export default InviteModal;