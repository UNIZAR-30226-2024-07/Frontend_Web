import { useState, useEffect } from 'react';
import { returnAllUsers } from '../api/auth';

export function AllUsersComponent ()  {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await returnAllUsers();
        console.log(response);
        setUsers(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>All Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <p>Nickname: {user.name}</p>
              <p>email: {user.password}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

