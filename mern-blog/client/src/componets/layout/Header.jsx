import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#007bff'
          }}>
            MERN Blog
          </Link>

          <nav>
            <ul style={{
              display: 'flex',
              listStyle: 'none',
              gap: '1.5rem',
              alignItems: 'center',
              margin: 0
            }}>
              <li><Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Home</Link></li>
              <li><Link to="/posts" style={{ textDecoration: 'none', color: '#333' }}>Posts</Link></li>
              
              {isAuthenticated ? (
                <>
                  <li><Link to="/create-post" style={{ textDecoration: 'none', color: '#333' }}>Create Post</Link></li>
                  {user?.role === 'admin' && (
                    <li><Link to="/categories" style={{ textDecoration: 'none', color: '#333' }}>Categories</Link></li>
                  )}
                  <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>Hello, {user.username}</span>
                    <button 
                      onClick={handleLogout}
                      className="btn btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" style={{ textDecoration: 'none', color: '#333' }}>Login</Link></li>
                  <li><Link to="/register" style={{ textDecoration: 'none', color: '#333' }}>Register</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;