import { useState, useEffect } from 'react';
import Home from './pages/Home';
import PmVikas from './pages/PmVikas';
import Experience from './pages/Experience';
import Certifications from './pages/Certifications';
import { Lock, LogOut, CheckCircle, Menu, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'sneha@2026') {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
  };

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'projects', label: 'Projects' },
    { key: 'activities', label: 'Activities' },
    { key: 'experience', label: 'Experience' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'pmvikas', label: 'PM-VIKAS' },
  ];

  const handleNavClick = (key) => {
    setActiveTab(key);
    setMobileMenuOpen(false);
    if (key === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (key === 'projects' || key === 'activities') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById(key);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <header className="top-bar">
        <div className="container nav-wrapper">
          {/* Logo */}
          <div className="logo" onClick={() => { handleNavClick('home'); }}>
            <span className="logo-accent">S</span>neha <span className="logo-accent">N</span>ixon
          </div>

          {/* Desktop Nav */}
          <nav className="nav-links desktop-nav">
            {navItems.map(item => (
              <button
                key={item.key}
                className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.key)}
              >
                {item.label}
                {activeTab === item.key && <span className="nav-underline" />}
              </button>
            ))}
          </nav>

          {/* Login + Mobile hamburger */}
          <div className="nav-right">
            {/* Login Section */}
            <div className="login-section">
              {isLoggedIn ? (
                <div className="admin-status">
                  <span className="admin-badge pulse-glow">
                    <CheckCircle size={13} />
                    Admin
                  </span>
                  <button className="logout-btn" onClick={handleLogout} title="Log Out">
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLogin} className={`login-form ${loginError ? 'shake-error' : ''}`}>
                  <div className="input-wrapper">
                    <Lock size={13} className="input-icon" />
                    <input
                      type="password"
                      placeholder="Admin password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-input"
                    />
                  </div>
                  <button type="submit" className="login-btn">Login</button>
                </form>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-nav">
            {navItems.map(item => (
              <button
                key={item.key}
                className={`mobile-nav-item ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="main-content">
        {(activeTab === 'home' || activeTab === 'projects' || activeTab === 'activities') && (
          <Home 
            setActiveTab={setActiveTab} 
            scrollToProjects={activeTab === 'projects'} 
            scrollToActivities={activeTab === 'activities'} 
          />
        )}
        {activeTab === 'experience' && <Experience />}
        {activeTab === 'certifications' && <Certifications />}
        {activeTab === 'pmvikas' && <PmVikas isAdmin={isLoggedIn} />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p>© {new Date().getFullYear()} <strong>Sneha Nixon</strong>. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="https://linkedin.com/in/sneha-nixon1" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="divider">·</span>
            <a href="https://github.com/snehanixon" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="divider">·</span>
            <a href="mailto:snehanixon10@gmail.com">Email</a>
          </div>
        </div>
      </footer>

      <style>{`
        .app-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* ====== NAVBAR ====== */
        .top-bar {
          background: rgba(245, 240, 232, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1.5px solid #E8E0D0;
          position: sticky;
          top: 0;
          z-index: 200;
        }

        .nav-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 800;
          cursor: pointer;
          color: var(--text);
          letter-spacing: -0.01em;
          transition: var(--transition);
        }

        .logo-accent { color: var(--primary); }
        .logo:hover { opacity: 0.8; }

        .desktop-nav {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .nav-item {
          position: relative;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: 'Plus Jakarta Sans', inherit;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: var(--transition);
          letter-spacing: 0.01em;
        }

        .nav-item:hover { color: var(--text); background: rgba(245, 166, 35, 0.07); }

        .nav-item.active {
          color: var(--text);
          background: var(--primary-light);
        }

        .nav-underline {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2.5px;
          background: var(--primary);
          border-radius: 2px;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Login */
        .login-section { display: flex; align-items: center; }

        .login-form { display: flex; align-items: center; gap: 8px; }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 11px;
          color: var(--text-light);
        }

        .login-input {
          background: #fff;
          border: 1.5px solid var(--card-border);
          color: var(--text);
          border-radius: 50px;
          padding: 7px 14px 7px 30px;
          font-size: 0.82rem;
          font-family: inherit;
          width: 155px;
          transition: var(--transition);
        }

        .login-input::placeholder { color: var(--text-light); }

        .login-input:focus {
          outline: none;
          border-color: var(--primary);
          width: 190px;
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .login-btn {
          background: var(--dark);
          border: none;
          color: #fff;
          padding: 7px 16px;
          border-radius: 50px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          letter-spacing: 0.02em;
        }

        .login-btn:hover {
          background: var(--primary);
          box-shadow: 0 4px 14px rgba(245, 166, 35, 0.4);
        }

        .shake-error { animation: shake 0.5s ease-in-out; }
        .shake-error .login-input { border-color: var(--danger); }

        .admin-status { display: flex; align-items: center; gap: 10px; }

        .admin-badge {
          background: rgba(34, 197, 94, 0.1);
          border: 1.5px solid #22c55e;
          color: #16a34a;
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .logout-btn {
          background: transparent;
          border: 1.5px solid var(--card-border);
          color: var(--text-muted);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .logout-btn:hover {
          color: var(--danger);
          border-color: var(--danger);
          background: rgba(239, 68, 68, 0.06);
        }

        /* Mobile */
        .mobile-toggle {
          display: none;
          background: transparent;
          border: 1.5px solid var(--card-border);
          color: var(--text);
          width: 38px;
          height: 38px;
          border-radius: 10px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .mobile-toggle:hover { border-color: var(--primary); color: var(--primary); }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--card-border);
          padding: 12px 24px;
          gap: 4px;
        }

        .mobile-nav-item {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 12px 16px;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          transition: var(--transition);
        }

        .mobile-nav-item:hover, .mobile-nav-item.active {
          color: var(--text);
          background: var(--primary-light);
        }

        /* Main */
        .main-content { flex: 1; }

        /* Footer */
        .footer {
          background: var(--dark);
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 28px 0;
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
        }

        .footer strong { color: rgba(255,255,255,0.8); }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-links { display: flex; gap: 10px; align-items: center; }

        .footer-links a { color: rgba(255,255,255,0.5); transition: var(--transition); }
        .footer-links a:hover { color: var(--primary); }

        .divider { color: rgba(255,255,255,0.15); }

        /* Keyframes */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .desktop-nav { display: none; }
          .mobile-toggle { display: flex; }
          .login-section { display: none; }
        }

        @media (max-width: 480px) {
          .container { padding: 0 16px; }
        }
      `}</style>
    </div>
  );
}

export default App;
