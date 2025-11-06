import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Message from '../components/Common/Message';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts({ limit: 3 });
      setPosts(response.data.data);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>
          Welcome to MERN Blog
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          A modern blog application built with the MERN stack. Share your thoughts, ideas, and stories with the world.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/posts" className="btn btn-primary" style={{ marginRight: '1rem' }}>
            Browse All Posts
          </Link>
          <Link to="/create-post" className="btn btn-secondary">
            Write a Post
          </Link>
        </div>
      </section>

      {error && <Message type="error">{error}</Message>}

      <section>
        <h2 style={{ marginBottom: '1.5rem' }}>Recent Posts</h2>
        {posts.length === 0 ? (
          <Message type="info">No posts yet. Be the first to write one!</Message>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {posts.map((post) => (
              <div key={post._id} className="card">
                <h3 style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    to={`/posts/${post.slug || post._id}`}
                    style={{ textDecoration: 'none', color: '#333' }}
                  >
                    {post.title}
                  </Link>
                </h3>
                <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  By {post.author?.username} • {formatDate(post.createdAt)} • {post.category?.name}
                </p>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  {post.excerpt || post.content.substring(0, 150)}...
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <Link 
                    to={`/posts/${post.slug || post._id}`}
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;