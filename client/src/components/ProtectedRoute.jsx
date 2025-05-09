// src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useContext(AuthContext);

  // still checking localStorage? don’t redirect yet.
  if (user === undefined) {
    return null; // or a spinner if you like
  }

  // not logged in
  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  // role mismatch (optional: normalize case)
  const role = user.role?.toLowerCase();
  const allowed = allowedRoles.map(r => r.toLowerCase());
  if (allowedRoles && !allowed.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // ok!
  return <Outlet />;
}
