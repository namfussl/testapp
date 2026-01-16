import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inviteService } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteToken, setInviteToken] = useState(null);
  const [inviteData, setInviteData] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for invite token in URL
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('invite_token');
    if (token) {
      verifyInviteToken(token);
    }
  }, [location.search]);

  const verifyInviteToken = async (token) => {
    try {
      const response = await inviteService.verifyInvite(token);
      setInviteToken(token);
      setInviteData(response.data);
      setFormData(prev => ({ ...prev, email: response.data.email }));
    } catch (err) {
      setError('Invalid or expired invite token');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.fullName);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        
        {inviteData && (
          <div style={styles.inviteInfo}>
            <p style={styles.inviteText}>
              You've been invited to join as a <strong>{inviteData.role}</strong>
            </p>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="fullName" style={styles.label}>Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              disabled={loading || inviteData}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <a href="/login" style={styles.link}>Sign in</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  inviteInfo: {
    backgroundColor: '#e8f4f8',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #b3e5fc',
  },
  inviteText: {
    margin: 0,
    color: '#01579b',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Register;
