import Header from '/Header';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        marginTop: '4rem',
        borderTop: '1px solid #ddd',
        color: '#666'
      }}>
        <div className="container">
          <p>&copy; 2024 MERN Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;