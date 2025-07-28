import React, { useState } from 'react';
import '../Login/Login.scss';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useForgotPasswordMutation } from '../../redux/features/api/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const [forgotPassword, { isLoading, error, isSuccess }] = useForgotPasswordMutation();

  React.useEffect(() => {
    if (error) toast.error(String(error?.data?.errorMessage || error?.message || 'Login: An error occurred'));
  }, [error]);

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("An Email to Reset your password has been sent!")
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
    } else {
      forgotPassword({ email });
    }
  };

  return (
    <section>
      <div className="glass-effect form-data">
        <div className="form-heading">
          <h2>Forgot Password</h2>
          <p>Enter your email to receive reset instructions.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form_input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button disabled={isLoading} className="btn" type="submit">
            {isLoading ? 'Sending Verification Email...' : 'Submit'}
          </button>

          <p>
            Remember your password? <a href="/login">Log In</a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
