import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      role
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const signupSuccess = queryParams.get('signup') === 'success';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ variables: { username, password } });
      const user = result.data.login;
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'Merchant') navigate('/about');
      else if (user.role === 'Admin') navigate('/');
      else navigate('/food');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      {signupSuccess && <p className="text-success text-center">Signup successful! Please log in.</p>}
      <form onSubmit={handleSubmit} className="form-login">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Login</button>
        {error && <p className="text-danger">Error logging in: {error.message}</p>}
      </form>
      <div className="text-center mt-3">
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;
