import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeService } from '../services/api';

const FeeEarnerHome = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeeEarnerData = async () => {
      try {
        const response = await homeService.getFeeEarnerHome();
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching fee earner data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeEarnerData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div style={styles.container}><p>Loading...</p></div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>Probate App</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.heading}>Welcome, {userData?.full_name || user?.full_name}!</h2>
          <p style={styles.subtitle}>Fee Earner Dashboard</p>
        </div>

        <div style={styles.gridContainer}>
          <div style={styles.card}>
            <h3>Active Engagements</h3>
            <p style={styles.cardContent}>
              You currently have <strong>4</strong> active engagements
            </p>
          </div>

          <div style={styles.card}>
            <h3>Connected Clients</h3>
            <p style={styles.cardContent}>
              You are connected with <strong>0</strong> clients
            </p>
          </div>

          <div style={styles.card}>
            <h3>Pending Requests</h3>
            <p style={styles.cardContent}>
              You have <strong>0</strong> pending collaboration requests
            </p>
          </div>
        </div>

        <div style={styles.actionsSection}>
          <h3>Quick Actions</h3>
          <div style={styles.actionButtons}>
            <button style={styles.actionBtn}>View Opportunities</button>
            <button style={styles.actionBtn}>Manage Projects</button>
            <button style={styles.actionBtn}>View Messages</button>
            <button style={styles.actionBtn}>Update Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
  navbar: {
    backgroundColor: '#6f42c1',
    color: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  navTitle: {
    margin: 0,
    fontSize: '24px',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  mainContent: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  welcomeCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #6f42c1',
  },
  heading: {
    margin: '0 0 10px 0',
    color: '#333',
  },
  subtitle: {
    margin: 0,
    color: '#666',
    fontSize: '14px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  cardContent: {
    margin: '10px 0 0 0',
    color: '#666',
    fontSize: '14px',
  },
  actionsSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  actionBtn: {
    backgroundColor: '#6f42c1',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

export default FeeEarnerHome;
