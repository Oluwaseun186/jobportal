import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Job</h1>
          <p>Connect with top companies and discover opportunities that match your skills and aspirations.</p>
          <div className="hero-buttons">
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            {!user && <Link to="/register" className="btn btn-secondary">Get Started</Link>}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>For Job Seekers</h3>
              <p>Browse thousands of job listings from reputable companies and find the perfect match for your skills.</p>
            </div>
            <div className="feature-card">
              <h3>For Employers</h3>
              <p>Post job openings and find qualified candidates quickly and efficiently.</p>
            </div>
            <div className="feature-card">
              <h3>Easy Application</h3>
              <p>Apply to jobs with just a few clicks and track your applications in real-time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;