import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeService } from '../services/api';

const ClientHome = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await homeService.getClientHome();
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching client data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClientData();
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
        <h1 style={styles.navTitle}>Probate App - Client Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.mainContent}>
        <h2 style={styles.heading}>Welcome back, {userData?.full_name || user?.full_name}!</h2>

        <div style={styles.welcomeCard}>
          <h2 style={styles.heading}>Current status of your probate application</h2>
          <p style={styles.subtitle}>Step 1.    - Step 2. </p>
        </div>

        <div style={styles.gridContainer}>
          <div style={styles.card}>
            <h3>Pending client actions</h3>
            <p style={styles.cardContent}>
              You currently have <strong>2</strong> pending actions
            </p>
          </div>
          <div style={styles.card}>
            <h3>Completed client actions</h3>
            <p style={styles.cardContent}>
              You currently have <strong>5</strong> completed actions
            </p>
          </div>

          <div style={styles.card}>
            <h3>Quick Actions</h3>
            <p style={styles.cardContent}>
              Action 1 Action 2 Action 3
            </p>
          </div>

          <div style={styles.card}>
            <h3>Your Client team</h3>
            <p style={styles.cardContent}>
              No recent activity
            </p>
          </div>
        </div>
      </div>
    </div >
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
  navbar: {
    backgroundColor: '#007bff',
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
    borderLeft: '4px solid #007bff',
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
    //gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gridTemplateColumns: '1fr 1fr',
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
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

export default ClientHome;
