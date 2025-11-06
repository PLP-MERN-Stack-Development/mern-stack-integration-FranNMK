import { useState, useEffect } from 'react';

const useApi = (apiCall, initialData = null, dependencies = []) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Auto-execute if dependencies change
  useEffect(() => {
    if (dependencies !== false) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute, setData };
};

export default useApi;