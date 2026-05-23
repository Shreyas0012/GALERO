import './StatusPill.css';

export default function StatusPill({ status }) {
  const getStatusClass = () => {
    switch(status.toLowerCase()) {
      case 'active':
      case 'verified':
      case 'delivered':
      case 'success':
        return 'pill-success';
      case 'sold':
      case 'archived':
      case 'none':
        return 'pill-neutral';
      case 'pending review':
      case 'preparing':
      case 'pending':
        return 'pill-warning';
      case 'rejected':
      case 'failed':
        return 'pill-error';
      default:
        return 'pill-neutral';
    }
  };

  return (
    <span className={`status-pill ${getStatusClass()}`}>
      <span className="pill-dot"></span>
      {status}
    </span>
  );
}
