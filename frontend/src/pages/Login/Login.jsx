import { motion } from 'framer-motion';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';

import './Login.scss';
import { useLoginMutation } from '../../redux/features/api/auth';

const Login = () => {
  const [passwordShow, setPasswordShow] = React.useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [signIn, { isLoading, error, data, isSuccess }] = useLoginMutation();

  React.useEffect(() => {
    if (error) toast.error(String(error?.data?.errorMessage || error?.message || 'Login: An error occurred'));
  }, [error]);

  React.useEffect(() => {
    if (isSuccess && data) {
      toast.success("Login Successful!")
      window.location.reload();
      localStorage.setItem('user', JSON.stringify(data));
    }
  }, [isSuccess, data]);

  const handleSumbit = React.useCallback(
    (form) => {
      const { email, password } = form;

      if (email === '') {
        toast.error('Email is required');
      } else if (!email.includes('@')) {
        toast.error('Please enter a valid Email');
      } else if (password === '') {
        toast.error('Password is required');
      } else {
        signIn(form);
      }
    },
    [signIn]
  );

  return (
    <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
      <div className="form-data glass-effect">
        <div className="form-heading">
          <h2>Welcome Back 👋</h2>
          <p>
            Sign in to continue using <strong>RecipeEasy</strong>
          </p>
        </div>

        <div className="profile_div text-center">
          <img src="/Recipeasy-logo.png" alt="Recipeasy logo" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading) handleSumbit(form);
          }}
        >
          <div className="form_input">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={handleChange} placeholder="Enter your email address" />
          </div>

          <div className="form_input">
            <label htmlFor="password">Password</label>
            <div className="two">
              <input
                type={!passwordShow ? 'password' : 'text'}
                onChange={handleChange}
                name="password"
                placeholder="Enter your password"
              />
              <div className="showpass" onClick={() => setPasswordShow(!passwordShow)}>
                {!passwordShow ? 'Show' : 'Hide'}
              </div>
            </div>
          </div>

          <button disabled={isLoading} type="submit" className="btn">
            {!isLoading ? 'Login' : 'Signing in...'}
          </button>
          <p>
            Don't have an account? <NavLink to="/register">Sign Up</NavLink>
          </p>
          <p>
            Forgot Password? <NavLink to="/forgotpassword">Click Here</NavLink>
          </p>
        </form>
      </div>
    </motion.section>
  );
};

export default Login;
