import { useLocation } from 'react-router-dom';

function NotFound() {
  const location = useLocation();
  return <h2 style={{ position: 'fixed', top: '50%', left: '50%' }}>No router for {location.pathname}</h2>;
}

export default NotFound;
