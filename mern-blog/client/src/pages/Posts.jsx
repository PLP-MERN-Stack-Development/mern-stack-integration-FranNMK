import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Message from '../components/Common/Message';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [filters]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts(filters);
      setPosts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data.data);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>All Posts</h1>
        <Link to="/create-post" className="btn btn-primary">
          Create New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search posts..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setFilters({ search: '', category: '', page: 1, limit: 10 })}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && <Message type="error">{error}</Message>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {posts.length === 0 ? (
            <Message type="info">No posts found matching your criteria.</Message>
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
                    {post.status === 'draft' && (
                      <span style={{ 
                        marginLeft: '0.5rem', 
                        fontSize: '0.8rem', 
                        background: '#ffc107', 
                        color: '#000',
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}>
                        Draft
                      </span>
                    )}
                  </h3>
                  <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    By {post.author?.username} • {formatDate(post.createdAt)} • {post.category?.name}
                    {post.viewCount > 0 && ` • ${post.viewCount} views`}
                  </p>
                  <p style={{ color: '#555', lineHeight: '1.6' }}>
                    {post.excerpt || post.content.substring(0, 200)}...
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

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary"
                disabled={filters.page === 1}
                onClick={() => handlePageChange(filters.page - 1)}
              >
                Previous
              </button>
              
              {[...Array(pagination.pages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`btn ${filters.page === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                className="btn btn-secondary"
                disabled={filters.page === pagination.pages}
                onClick={() => handlePageChange(filters.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Posts;