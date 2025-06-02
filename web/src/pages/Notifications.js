import React, { useEffect, useState } from 'react';

function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`/api/notification/${userId}`)
      .then(res => res.json())
      .then(setNotifications);
  }, [userId]);

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map(n => (
          <li key={n.id} style={{ fontWeight: n.read ? 'normal' : 'bold' }}>
            {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
