import React, { useEffect, useState } from 'react';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(e => setError(e.message));
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(setAnalytics)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const suspendUser = (id) => {
    fetch(`/api/admin/users/${id}/suspend`, { method: 'PATCH' })
      .then(() => setUsers(users => users.map(u => u.id === id ? { ...u, isActive: false } : u)));
  };
  const deleteUser = (id) => {
    fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
      .then(() => setUsers(users => users.filter(u => u.id !== id)));
  };

  if (loading) return <div>Loading admin panel...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Admin Panel</h2>
      <h3>Analytics</h3>
      {analytics && (
        <ul>
          <li>Total Users: {analytics.userCount}</li>
          <li>Active Users: {analytics.activeUsers}</li>
          <li>Suspended Users: {analytics.suspendedUsers}</li>
          <li>Businesses: {analytics.businessCount}</li>
          <li>Volunteers: {analytics.volunteerCount}</li>
          <li>Opportunities: {analytics.opportunityCount}</li>
          <li>Applications: {analytics.applicationCount}</li>
        </ul>
      )}
      <h3>User Management</h3>
      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.isActive ? 'Active' : 'Suspended'}</td>
              <td>
                <button onClick={() => suspendUser(u.id)} disabled={!u.isActive}>Suspend</button>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Moderation & Reports</h3>
      <button onClick={() => window.open('/api/admin/reports/users', '_blank')}>Export Users CSV</button>
      <div>Moderation and report export features coming soon...</div>
    </div>
  );
}

export default AdminPanel;

