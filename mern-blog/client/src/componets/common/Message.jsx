const Message = ({ type, children, onClose }) => {
  const styles = {
    success: {
      backgroundColor: '#d4edda',
      borderColor: '#c3e6cb',
      color: '#155724'
    },
    error: {
      backgroundColor: '#f8d7da',
      borderColor: '#f5c6cb',
      color: '#721c24'
    },
    warning: {
      backgroundColor: '#fff3cd',
      borderColor: '#ffeaa7',
      color: '#856404'
    },
    info: {
      backgroundColor: '#d1ecf1',
      borderColor: '#bee5eb',
      color: '#0c5460'
    }
  };

  return (
    <div style={{
      padding: '12px 20px',
      marginBottom: '1rem',
      border: '1px solid transparent',
      borderRadius: '5px',
      ...styles[type]
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{children}</span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'inherit'
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;