import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function Profile({ userId, role }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const endpoint = role === 'volunteer' ? '/api/volunteer-profile/' : '/api/business-profile/';
    fetch(endpoint + userId, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then(setProfile)
      .catch(e => {
        if (e.name !== 'AbortError') setError(e.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [userId, role]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found. Complete your profile!</div>;

  return (
    <div>
      <h2>Profile</h2>
      <ul>
        {Object.entries(profile).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {String(value)}</li>
        ))}
      </ul>
      {/* Add form for updating profile here */}
    </div>
  );
}

Profile.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  role: PropTypes.string.isRequired,
};

export default Profile;

