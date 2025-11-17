import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">Job Router</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/jobs" className="nav-link">Jobs</Link>
          
          {user ? (
            <React.Fragment>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {(user.role === 'admin' || user.role === 'employer') && (
                <Link to="/post-job" className="nav-link">Post Job</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
              <span className="nav-link">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="nav-link" style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}>
                Logout
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;