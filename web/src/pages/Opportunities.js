import React from 'react';
import React, { useEffect, useState } from 'react';

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/opportunity')
      .then(res => res.json())
      .then(setOpportunities)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading opportunities...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Opportunities</h2>
      <ul>
        {opportunities.map(o => (
          <li key={o.id}>{o.roleTitle} - {o.description}</li>
        ))}
      </ul>
      {/* Add form for posting new opportunity (for businesses) here */}
    </div>
  );
}

export default Opportunities;

