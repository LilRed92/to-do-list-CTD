import { useAuth } from '../contexts/AuthContext.jsx';

function Logoff() {
  const { logout } = useAuth();

  const handleLogoff = async () => {
    const result = await logout();
    if (!result.success) {
      console.error(result.error);
    }
  };

  return <button onClick={handleLogoff}>Log Off</button>;
}

export default Logoff;