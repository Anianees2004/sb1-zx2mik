import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SecurityDashboard from './components/dashboard/SecurityDashboard';
import DocumentList from './components/documents/DocumentList';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      {user ? (
        <div className="container mx-auto px-4 py-8">
          <SecurityDashboard />
          <div className="mt-8">
            <DocumentList />
          </div>
        </div>
      ) : (
        <Hero />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;