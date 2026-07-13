import React from 'react';
import { AuthProvider } from './store/AuthContext';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
