import { useSelector } from 'react-redux';

import Login from '../../pages/Login/Login';
// Show the login screen if the user is not authenticated

export default function Authenticated({ children }) {
  const authState = useSelector((state) => state.auth);

  if (!authState.auth) return <Login />;

  return children;
}
