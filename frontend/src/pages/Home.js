import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>Probate App</h1>
        <img src="/images/logo.png" alt="Logo" style={styles.logo} />
      </div>

      <div style={styles.mainContent}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Welcome to the Probate Platform</h1>
          <p style={styles.heroSubtitle}>
            Seamlessly manage the end-to-end probate workflow
          </p>

          <div style={styles.buttonContainer}>
            <Link to="/login" style={styles.primaryBtn}>
              Sign In
            </Link>
            <Link to="/register" style={styles.secondaryBtn}>
              Create Account
            </Link>
          </div>
        </div>

        <div style={styles.featuresContainer}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>👥</div>
            <h3>Connect</h3>
            <p>Easily complete the probate questionnaire and upload relevant files</p>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>🔄</div>
            <h3>Collaborate</h3>
            <p>Track projects, tasks, and communication in one plac</p>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>✅</div>
            <h3>Manage</h3>
            <p>Respond to additional requests and approve pre-submissions</p>
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
    backgroundColor: '#000',
    color: 'white',
    padding: '20px 40px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(10, 2, 2, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
  },
  logo: {
    height: '50px',
    width: 'auto',
  },
  navTitle: {
    margin: 0,
    fontSize: '28px',
  },
  mainContent: {
    padding: '60px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '80px',
  },
  heroTitle: {
    fontSize: '48px',
    color: '#333',
    margin: '0 0 20px 0',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#666',
    margin: '0 0 40px 0',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: '#000',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-block',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: '#000',
    padding: '12px 30px',
    borderRadius: '4px',
    border: '2px solid #000',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-block',
  },
  featuresContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  },
  feature: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
};

export default Home;
