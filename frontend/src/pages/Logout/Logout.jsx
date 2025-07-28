import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/auth-slice';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/');
  }, [dispatch, navigate]);

  return <></>;
}
