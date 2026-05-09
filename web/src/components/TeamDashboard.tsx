import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

/**
 * UI for a single team's dashboard.
 * - Shows team name & description.
 * - Lists current members.
 * - Allows the team lead (or any member) to invite new members by email.
 * - Simple access‑control: only members can view the dashboard.
 */
interface Member {
  id: string;
  email: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: Member[];
}

/**
 * Props
 * @param teamId - UUID of the team to display.
 */
const TeamDashboard: React.FC<{ teamId: string }> = ({ teamId }) => {
  const { user } = useAuth(); // assumed to provide { id, email, name } or null
  const [team, setTeam] = useState<Team | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Load team data from the backend */
  const fetchTeam = async () => {
    try {
      const response = await axios.get<Team>(`/api/teams/${teamId}`);
      setTeam(response.data);
      setError(null);
    } catch (e) {
      setError('Unable to load team information.');
    }
  };

  useEffect(() => {
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  /** Send an invitation email to a new member */
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setLoading(true);
    try {
      await axios.post(`/api/teams/${teamId}/invite`, { email: inviteEmail });
      setInviteEmail('');
      await fetchTeam(); // refresh member list
      setError(null);
    } catch (e) {
      setError('Failed to send invitation.');
    } finally {
      setLoading(false);
    }
  };

  // While loading the team data
  if (!team) {
    return <div>Loading team...</div>;
  }

  // Simple authorization: only members may view the dashboard
  const isMember = user && team.members.some((m) => m.id === user.id);
  if (!isMember) {
    return <div>You do not have permission to view this team.</div>;
  }

  return (
    <div className="team-dashboard" style={{ padding: '1rem' }}>
      <h1>{team.name}</h1>
      <p>{team.description}</p>

      <section style={{ marginTop: '2rem' }}>
        <h2>Members</h2>
        <ul>
          {team.members.map((member) => (
            <li key={member.id}>
              {member.name} ({member.email})
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Invite New Member</h2>
        <form onSubmit={handleInvite} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="email"
            placeholder="email@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
            style={{ flex: 1, padding: '0.5rem' }}
          />
          <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
            {loading ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
      </section>
    </div>
  );
};

export default TeamDashboard;