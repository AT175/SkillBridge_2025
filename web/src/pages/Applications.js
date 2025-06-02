import React, { useEffect, useState } from 'react';

function Applications({ userId, role }) {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let endpoint = '';
    if (role === 'volunteer') endpoint = '/api/application/volunteer/' + userId;
    else if (role === 'business') endpoint = '/api/application/opportunity/' + userId; // business would select an opportunityId
    if (!endpoint) return;
    fetch(endpoint)
      .then(res => res.json())
      .then(setApplications)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId, role]);

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Applications</h2>
      <ul>
        {applications.map(a => (
          <li key={a.id}>{JSON.stringify(a)}</li>
        ))}
      </ul>
    </div>
  );
}

export default Applications;

