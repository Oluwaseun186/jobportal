import React from 'react';

function AdminPanel() {
  return (
    <div className="admin-container">
      <div className="container">
        <h1>Admin Panel</h1>
        <div className="admin-cards">
          <div className="admin-card">
            <h3>User Management</h3>
            <p>Manage users and permissions</p>
            <button>Manage Users</button>
          </div>
          <div className="admin-card">
            <h3>Job Management</h3>
            <p>Manage all job posts</p>
            <button>Manage Jobs</button>
          </div>
          <div className="admin-card">
            <h3>Site Analytics</h3>
            <p>View site statistics</p>
            <button>View Analytics</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;