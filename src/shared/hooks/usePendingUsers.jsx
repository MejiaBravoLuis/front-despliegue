import { useState, useEffect, useCallback } from 'react';
import { getPendingUsers, acceptUser } from '../../services'

export const usePendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await getPendingUsers();
      if (!fetchError) {
        setUsers(data);
      } else {
        setError('Error cargando usuarios pendientes');
      }
      setLoading(false);
    };

    fetchPendingUsers();
  }, []);

  const acceptPendingUser = useCallback(
    async (userId) => {
      const { data, error: acceptError } = await acceptUser(userId);
      if (!acceptError) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== userId));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: acceptError };
      }
    },
    []
  );

  return { users, loading, error, acceptPendingUser };
};
