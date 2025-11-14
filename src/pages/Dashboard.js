import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="container">
        <h1>Dashboard</h1>
        <div className="dashboard-card">
          <h2>Welcome, {user && user.name}!</h2>
          <p>Email: {user && user.email}</p>
          <p>Role: {user && user.role}</p>
          {user && user.company && <p>Company: {user.company}</p>}
        </div>
        
        <div className="dashboard-actions">
          <div className="action-card">
            <h3>Quick Actions</h3>
            <ul>
              <li><a href="/jobs">Browse Jobs</a></li>
              {user && (user.role === 'employer' || user.role === 'admin') && (
                <li><a href="/post-job">Post a Job</a></li>
              )}
              {user && user.role === 'admin' && (
                <li><a href="/admin">Admin Panel</a></li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;