import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import CommentsSection from '../components/CommentsSection';

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Wrap fetchJob in useCallback to make it stable
  const fetchJob = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  }, [id]); // Add id as dependency

  useEffect(() => {
    fetchJob();
  }, [fetchJob]); // Now fetchJob is stable

  const handleApply = async () => {
    try {
      await axios.post(`http://localhost:5000/api/jobs/${id}/apply`);
      alert('Application submitted successfully!');
      fetchJob(); // Refresh job data
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message 
        ? error.response.data.message 
        : 'Failed to apply';
      alert(errorMessage);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  const hasApplied = job.applications && job.applications.some(app => app.user && app.user._id === (user && user._id));

  return (
    <div className="job-detail">
      <div className="job-header">
        <h1>{job.title}</h1>
        <h2>{job.company}</h2>
        <div className="job-meta">
          <span>{job.location}</span>
          <span>{job.type}</span>
          <span>
            {job.salary && job.salary.min && job.salary.max 
              ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
              : 'Salary not specified'
            }
          </span>
        </div>
        {user && user.role === 'user' && (
          <button 
            onClick={handleApply} 
            disabled={hasApplied}
            className="btn btn-primary"
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </button>
        )}
      </div>

      <div className="job-content">
        <section className="job-section">
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </section>

        <section className="job-section">
          <h3>Requirements</h3>
          <ul>
            {job.requirements && job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </section>

        <section className="job-section">
          <h3>Benefits</h3>
          <ul>
            {job.benefits && job.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </section>
      </div>

      <CommentsSection jobId={id} />
    </div>
  );
}

export default JobDetail;