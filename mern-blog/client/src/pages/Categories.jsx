import { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Message from '../components/Common/Message';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data.data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
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
    setFormLoading(true);
    setError('');

    try {
      await categoriesAPI.createCategory(formData);
      setSuccess('Category created successfully!');
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchCategories(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setFormLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container">
        <Message type="error">You need to be an admin to access this page.</Message>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Categories</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      {/* Add Category Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add New Category</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                minLength="2"
                maxLength="50"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                maxLength="200"
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={formLoading}
            >
              {formLoading ? <LoadingSpinner size="small" /> : 'Create Category'}
            </button>
          </form>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {categories.length === 0 ? (
            <Message type="info">No categories found.</Message>
          ) : (
            categories.map(category => (
              <div key={category._id} className="card">
                <h3 style={{ marginBottom: '0.5rem' }}>{category.name}</h3>
                {category.description && (
                  <p style={{ color: '#666', marginBottom: '0.5rem' }}>{category.description}</p>
                )}
                <p style={{ color: '#999', fontSize: '0.8rem' }}>
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;