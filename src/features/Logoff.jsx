import { useAuth } from '../contexts/AuthContext.jsx';

function Logoff() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return null;

  const handleLogoff = async () => {
    const result = await logout();
    if (!result.success) {
      console.error(result.error);
    }
  };

  return <button onClick={handleLogoff}>Log Off</button>;
}

export default Logoff;