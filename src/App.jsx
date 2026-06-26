import React, { useState } from 'react';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Post from './pages/Post';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, signOut } = useAuth();

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSignOut = async () => {
    await signOut();
    handleNavigate('home');
  };

  // Simple routing based on URL hash
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'auth':
        return <Auth />;
      case 'browse':
        return <ProtectedRoute><div>Browse Page (Coming Soon)</div></ProtectedRoute>;
      case 'post':
        return <ProtectedRoute><Post /></ProtectedRoute>;
      case 'item':
        return <ProtectedRoute><div>Item Detail Page (Coming Soon)</div></ProtectedRoute>;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <a href="#home" className="nav-logo">
            📍 Lost & Found
          </a>
          <ul className="nav-menu">
            <li><a href="#home" onClick={() => handleNavigate('home')}>Home</a></li>
            <li><a href="#browse" onClick={() => handleNavigate('browse')}>Browse</a></li>
            {user ? (
              <>
                <li><a href="#post" onClick={() => handleNavigate('post')}>Post</a></li>
                <li>
                  <button onClick={handleSignOut} className="nav-button">
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li><a href="#auth" onClick={() => handleNavigate('auth')}>Sign In</a></li>
            )}
          </ul>
        </div>
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>

      <footer className="footer">
        <p>&copy; 2024 Campus Lost & Found. All rights reserved.</p>
      </footer>
    </div>
  );
}
