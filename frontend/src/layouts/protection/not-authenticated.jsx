import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Navigate to the home page if the user is logged in

export default function NotAuthenticated({ children }) {
  const authState = useSelector((state) => state.auth);

  if (authState.auth) return <Navigate to="/" />;

  return children;
}
