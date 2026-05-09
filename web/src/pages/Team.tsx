import React from 'react';
import { useParams } from 'react-router-dom';
import TeamDashboard from '../components/TeamDashboard';

/**
 * Page wrapper that extracts the teamId from the URL and renders the
 * TeamDashboard component.
 *
 * Route example: /team/:teamId
 */
const TeamPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();

  if (!teamId) {
    return <div>Team identifier missing from URL.</div>;
  }

  return <TeamDashboard teamId={teamId} />;
};

export default TeamPage;