import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Browse from './pages/Browse';
import Post from './pages/Post';
import ItemDetail from './pages/ItemDetail';
import CampusGuide from './pages/CampusGuide';
import Dashboard from './pages/Dashboard';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function parseHash() {
  const hash = window.location.hash.slice(1) || 'home';
  const slashIdx = hash.indexOf('/');
  if (slashIdx !== -1) {
    return { page: hash.slice(0, slashIdx), param: hash.slice(slashIdx + 1) };
  }
  return { page: hash, param: null };
}

export default function App() {
  const [route, setRoute] = useState(parseHash);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (page, param) => {
    window.location.hash = param ? `${page}/${param}` : page;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('home');
  };

  const renderPage = () => {
    const { page, param } = route;
    switch (page) {
      case 'home':
        return (
          <Home
            onItemSelect={(item) => navigate('item', item.id)}
            onSearch={(query) => navigate('browse', encodeURIComponent(query))}
          />
        );
      case 'auth':
        return <Auth onSuccess={() => navigate('browse')} />;
      case 'browse':
        return (
          <Browse
            onItemSelect={(item) => navigate('item', item.id)}
            initialSearch={param ? decodeURIComponent(param) : ''}
          />
        );
      case 'item':
        return (
          <ItemDetail
            itemId={param}
            onBack={() => navigate('browse')}
            onItemSelect={(item) => navigate('item', item.id)}
          />
        );
      case 'post':
        return (
          <ProtectedRoute>
            <Post onSuccess={(item) => navigate('item', item.id)} />
          </ProtectedRoute>
        );
      case 'guide':
        return <CampusGuide />;
      case 'dashboard':
        return (
          <ProtectedRoute>
            <Dashboard onItemSelect={(item) => navigate('item', item.id)} />
          </ProtectedRoute>
        );
      default:
        return <Home onItemSelect={(item) => navigate('item', item.id)} />;
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <a href="#home" className="nav-logo">
            <span className="accent">CampusFind</span> 
            <span className="nav-logo-badge">KNUST</span>
          </a>
          <ul className="nav-menu">
            <li><a href="#home" className={route.page === 'home' ? 'active' : ''}>Home</a></li>
            <li><a href="#browse" className={route.page === 'browse' ? 'active' : ''}>Browse</a></li>
            <li><a href="#guide" className={route.page === 'guide' ? 'active' : ''}>Campus Guide</a></li>
            {user ? (
              <>
                <li><a href="#post" className={route.page === 'post' ? 'active' : ''}>Post Item</a></li>
                <li><a href="#dashboard" className={route.page === 'dashboard' ? 'active' : ''}>My Activity</a></li>
                <li>
                  <button onClick={handleSignOut} className="nav-button">
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li><a href="#auth" className={route.page === 'auth' ? 'active' : ''}>Sign In</a></li>
            )}
          </ul>
        </div>
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>CampusFind</h3>
            <p>The KNUST lost &amp; found platform built to help students recover what matters.</p>
          </div>

          <div className="footer-links">
            <div>
              <h4>Explore</h4>
              <a href="#home">Home</a>
              <a href="#browse">Browse listings</a>
              <a href="#guide">Campus guide</a>
            </div>
            <div>
              <h4>Support</h4>
              <a href="#post">Post an item</a>
              <a href="#auth">Sign in</a>
              <a href="#guide">Safety tips</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 CampusFind</span>
          <span>Made for the KNUST community</span>
        </div>
      </footer>
    </div>
  );
}
