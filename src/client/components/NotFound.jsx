import React from 'react';
import { useLocation } from 'react-router-dom';

function NotFound() {
  const location = useLocation();
  return <h3>No router for {location.pathname}</h3>;
}

export default NotFound;
