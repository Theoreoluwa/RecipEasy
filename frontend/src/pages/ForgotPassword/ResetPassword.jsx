import React, { useState } from 'react';
import '../Login/Login.scss';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Navigate } from 'react-router-dom';

import { useVerifyForgotPasswordQuery, useResetPasswordMutation } from '../../redux/features/api/auth';

const ResetPassword = () => {
  const { id, token } = useParams();

  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordConfirmShow, setPasswordConfirmShow] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');

  const navigate = useNavigate();

  const { isSuccess: isVerifySuccess, status: verifyStatus } = useVerifyForgotPasswordQuery({ id, token });

  const [resetPassword, { isLoading, data, error, isSuccess }] = useResetPasswordMutation();

  React.useEffect(() => {
    if (isSuccess && data) {
      toast.success('Password reset was successful');
      navigate('/login');
    }
  }, [isSuccess, navigate, data]);

  React.useEffect(() => {
    if (error) toast.error(String(error?.data?.errorMessage || error?.message || 'Reset Password: An error occurred'));
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!password || !confirmpassword) {
      toast.error('Please fill in both fields.');
    } else if (password !== confirmpassword) {
      toast.error('Passwords do not match!');
    } else {
      resetPassword({ id, token, form: { password } });
    }
  };

  if (!isVerifySuccess && ['pending', 'uninitialized'].includes(verifyStatus))
    return <h2>Verifying Authentication Credentials</h2>;

  if (!isVerifySuccess && verifyStatus === 'rejected') {
    toast.error('Invalid Authentication Credentials');
    return <Navigate to="/forgotpassword" />;
  }

  return (
    <section>
      <div className="glass-effect form-data">
        <div className="form-heading">
          <h2>Reset Your Password</h2>
          <p>Enter and confirm your new password below.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form_input">
            <div className="two">
              <input
                type={!passwordShow ? 'password' : 'text'}
                name="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="showpass" onClick={() => setPasswordShow(!passwordShow)}>
                {!passwordShow ? 'Show' : 'Hide'}
              </div>
            </div>
          </div>

          <div className="form_input">
            <div className="two">
              <input
                type={!passwordConfirmShow ? 'password' : 'text'}
                name="confirmpassword"
                placeholder="Confirm your new password"
                value={confirmpassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
              />
              <div className="showpass" onClick={() => setPasswordConfirmShow(!passwordConfirmShow)}>
                {!passwordConfirmShow ? 'Show' : 'Hide'}
              </div>
            </div>
          </div>

          <button className="btn" disabled={isLoading} type="submit">
            {isLoading ? 'Resetting...' : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
