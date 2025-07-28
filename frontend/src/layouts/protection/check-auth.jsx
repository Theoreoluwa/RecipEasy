import React from 'react';
import toast, { LoaderIcon } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { login, logout } from '../../redux/features/auth-slice';
import { useGetAuthQuery } from '../../redux/features/api/auth';

export default function CheckAuth({ children }) {
  const [loading, setLoading] = React.useState(true);

  const dispatch = useDispatch();

  const { data, status, isLoading, error, isError, isSuccess } = useGetAuthQuery();

  React.useEffect(() => {
    if (isError && error) {
      dispatch(logout());
      toast(String(error?.data?.errorMessage || error?.message || 'Log in for a better experience'));
    }
  }, [error, isError, dispatch]);

  React.useEffect(() => {
    if (isSuccess && data) {
      dispatch(login({ data }));
    }
  }, [data, isSuccess, dispatch]);

  React.useEffect(() => {
    if (status !== 'pending' && !isLoading && status !== 'uninitialized') setLoading(false);
  }, [status, isLoading]);

  // React.useEffect(() => {
  //   try {
  //     const user = localStorage.getItem('user');
  //     if (user) {
  //       const data = JSON.parse(user);
  //       dispatch(login({ data }));
  //     } else {
  //       dispatch(logout());
  //     }
  //   } catch (err) {
  //     toast(err?.data?.errorMessage || err?.message || 'Check Auth: An error occurred');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [dispatch]);

  if (loading)
    return (
      <div style={{ paddingTop: '40vh', display: 'flex', justifyContent: 'center' }}>
        <LoaderIcon />
      </div>
    );

  return children;
}
