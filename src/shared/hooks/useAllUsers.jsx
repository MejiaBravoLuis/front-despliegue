import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/api';

const useAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();

      if (data.error) {
        setError(data.e?.message || 'Error al obtener usuarios');
      } else {
        setUsers(data.users);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useAllUsers;
