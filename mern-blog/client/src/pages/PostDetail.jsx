import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Message from '../components/Common/Message';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPost(id);
      setPost(response.data.data);
    } catch (err) {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(post._id);
        navigate('/posts');
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Message type="error">{error}</Message>;
  if (!post) return <Message type="error">Post not found</Message>;

  const canEdit = user && (user._id === post.author._id || user.role === 'admin');

  return (
    <div className="container">
      <article className="card">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/posts" style={{ color: '#007bff', textDecoration: 'none' }}>
            &larr; Back to Posts
          </Link>
        </div>

        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{post.title}</h1>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            <p>
              By <strong>{post.author?.username}</strong> • 
              Published on {formatDate(post.publishedAt || post.createdAt)} • 
              Category: <strong>{post.category?.name}</strong>
            </p>
            {post.viewCount > 0 && (
              <p>Views: {post.viewCount}</p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                Tags: {post.tags.map(tag => (
                  <span key={tag} style={{ 
                    background: '#e9ecef', 
                    padding: '2px 8px', 
                    borderRadius: '3px',
                    marginRight: '0.5rem',
                    fontSize: '0.8rem'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {post.featuredImage && (
          <div style={{ marginBottom: '2rem' }}>
            <img 
              src={post.featuredImage} 
              alt={post.title}
              style={{ 
                width: '100%', 
                maxHeight: '400px', 
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>
        )}

        <div 
          style={{ 
            lineHeight: '1.8',
            fontSize: '1.1rem'
          }}
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
        />

        {canEdit && (
          <footer style={{ 
            marginTop: '3rem', 
            paddingTop: '1rem', 
            borderTop: '1px solid #ddd',
            display: 'flex',
            gap: '1rem'
          }}>
            <Link 
              to={`/edit-post/${post._id}`}
              className="btn btn-primary"
            >
              Edit Post
            </Link>
            <button 
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Delete Post
            </button>
          </footer>
        )}
      </article>
    </div>
  );
};

export default PostDetail;