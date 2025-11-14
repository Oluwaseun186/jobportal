import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    location: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`http://localhost:5000/api/jobs?${params}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post(`http://localhost:5000/api/jobs/${jobId}/apply`);
      alert('Application submitted successfully!');
    } catch (error) {
      // Fixed: Remove optional chaining
      const errorMessage = error.response && error.response.data && error.response.data.message 
        ? error.response.data.message 
        : 'Failed to apply';
      alert(errorMessage);
    }
  };

  return (
    <div className="jobs-container">
      <div className="filters">
        <h2>Find Your Dream Job</h2>
        <div className="filter-grid">
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />
        </div>
      </div>

      <div className="jobs-grid">
        {jobs.map(job => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p className="company">{job.company}</p>
            <p className="location">{job.location}</p>
            <p className="type">{job.type}</p>
            <p className="salary">
              {job.salary && job.salary.min && job.salary.max 
                ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
                : 'Salary not specified'
              }
            </p>
            <p className="description">
              {job.description && job.description.substring(0, 150)}...
            </p>
            <div className="job-actions">
              <Link to={`/jobs/${job._id}`} className="btn btn-primary">
                View Details
              </Link>
              <button 
                onClick={() => handleApply(job._id)}
                className="btn btn-secondary"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;