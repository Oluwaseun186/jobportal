import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function PostJob() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    category: '',
    description: '',
    requirements: '',
    benefits: '',
    salaryMin: '',
    salaryMax: ''
  });
  const [requirements, setRequirements] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addRequirement = () => {
    if (formData.requirements.trim()) {
      setRequirements([...requirements, formData.requirements.trim()]);
      setFormData({ ...formData, requirements: '' });
    }
  };

  const removeRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addBenefit = () => {
    if (formData.benefits.trim()) {
      setBenefits([...benefits, formData.benefits.trim()]);
      setFormData({ ...formData, benefits: '' });
    }
  };

  const removeBenefit = (index) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        company: user.company || formData.company,
        requirements: requirements,
        benefits: benefits,
        salary: {
          min: parseInt(formData.salaryMin) || 0,
          max: parseInt(formData.salaryMax) || 0,
        },
      };

      await axios.post('http://localhost:5000/api/jobs', jobData);
      setMessage('Job posted successfully!');
      setError('');
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message 
        ? error.response.data.message 
        : 'Failed to post job';
      setError(errorMessage);
      setMessage('');
    }
  };

  return (
    <div className="post-job-container">
      <div className="container">
        <h1>Post a New Job</h1>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                name="company"
                value={user.company || formData.company}
                onChange={handleChange}
                required
                disabled={user.company}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Job Type *</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Minimum Salary ($)</label>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Maximum Salary ($)</label>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Requirements</label>
            <div className="array-input">
              <input
                type="text"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Add a requirement"
              />
              <button type="button" onClick={addRequirement}>Add</button>
            </div>
            <div className="array-items">
              {requirements.map((req, index) => (
                <div key={index} className="array-item">
                  {req}
                  <button type="button" onClick={() => removeRequirement(index)}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Benefits</label>
            <div className="array-input">
              <input
                type="text"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="Add a benefit"
              />
              <button type="button" onClick={addBenefit}>Add</button>
            </div>
            <div className="array-items">
              {benefits.map((benefit, index) => (
                <div key={index} className="array-item">
                  {benefit}
                  <button type="button" onClick={() => removeBenefit(index)}>×</button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Post Job</button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;