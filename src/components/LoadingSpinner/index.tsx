import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message }: LoadingSpinnerProps) => (
  <div className="spinner-wrapper">
    <div className="spinner" aria-hidden="true" />
    {message && <p className="spinner-message">{message}</p>}
  </div>
);

export default LoadingSpinner;
