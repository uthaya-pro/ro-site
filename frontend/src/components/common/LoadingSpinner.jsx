import './LoadingSpinner.css';

const LoadingSpinner = ({ fullPage = false, text = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className="spinner"></div>
        <p>{text}</p>
      </div>
    );
  }
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--gray-500)', fontSize: 'var(--font-size-sm)' }}>{text}</p>
    </div>
  );
};

export default LoadingSpinner;
