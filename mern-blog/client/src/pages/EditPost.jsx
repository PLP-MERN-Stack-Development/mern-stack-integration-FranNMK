import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Message from '../components/Common/Message';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const EditPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft'
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchCategories();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getPost(id);
      const post = response.data.data;
      
      // Check if user can edit this post
      if (post.author._id !== user._id && user.role !== 'admin') {
        setError('You are not authorized to edit this post');
        return;
      }

      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        category: post.category._id,
        tags: post.tags?.join(', ') || '',
        status: post.status
      });
    } catch (err) {
      setError('Post not found');
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await postsAPI.updatePost(id, postData);
      setSuccess('Post updated successfully!');
      
      setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="container">
        <Message type="error">You need to be logged in to edit posts.</Message>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Edit Post</h1>

        {error && <Message type="error">{error}</Message>}
        {success && <Message type="success">{success}</Message>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
              minLength="5"
              maxLength="200"
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt" className="form-label">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              className="form-control"
              rows="3"
              value={formData.excerpt}
              onChange={handleChange}
              maxLength="300"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">Content</label>
            <textarea
              id="content"
              name="content"
              className="form-control form-textarea"
              rows="15"
              value={formData.content}
              onChange={handleChange}
              required
              minLength="50"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="form-control"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? <LoadingSpinner size="small" /> : 'Update Post'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate(`/posts/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;