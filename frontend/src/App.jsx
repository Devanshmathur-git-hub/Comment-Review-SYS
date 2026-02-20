
import { useState, useEffect } from 'react';
import ImageGallery from './components/Gallery/ImageGallery';
import ImageDetail from './components/Gallery/ImageDetail';
import { getPosts, loginUser, logoutUser, getCurrentUser } from './services/api';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(getCurrentUser());
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const userData = await loginUser(loginForm.email, loginForm.password);
      setUser(userData);
      setShowLogin(false);
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 onClick={() => setSelectedPost(null)} style={{ cursor: 'pointer' }}>
          Insightful Tech Gallery
        </h1>
        <div className="user-profile">
          {user ? (
            <div className="user-logged-in">
              <span>
                Welcome, <strong>{user.name}</strong>
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button
              className="login-btn"
              onClick={() => setShowLogin(!showLogin)}
            >
              Login
            </button>
          )}
        </div>
      </header>

      {showLogin && !user && (
        <div className="login-overlay">
          <div className="login-modal">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                required
              />
              {loginError && <p className="login-error">{loginError}</p>}
              <div className="login-actions">
                <button type="submit" className="login-submit-btn">
                  Login
                </button>
                <button
                  type="button"
                  className="login-cancel-btn"
                  onClick={() => setShowLogin(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
            <p className="login-hint">
              Try: <code>vikas@insightfultech.com</code> / <code>password123</code>
            </p>
          </div>
        </div>
      )}

      <main className="app-main">
        {isLoading ? (
          <div className="loading-container">
            <p>Loading posts...</p>
          </div>
        ) : selectedPost ? (
          <ImageDetail
            image={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        ) : (
          <div className="gallery-container">
            <div className="gallery-header">
              <h2>Team Showcase</h2>
              <p>Click on a team member to view details and leave a comment.</p>
            </div>
            <ImageGallery images={posts} onSelect={setSelectedPost} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Insightful Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
