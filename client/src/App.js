// App.jsx - Updated with black outline theme
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        button:hover { opacity: 0.9; }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #0a0a0a !important;
        }
        
        @media (max-width: 768px) {
          body { font-size: 14px; }
        }
        
        @media (max-width: 480px) {
          body { font-size: 13px; }
        }
      `}</style>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: 10,
            border: '2px solid #0a0a0a',
            background: '#fff',
            color: '#0a0a0a',
            fontSize: 13,
            fontWeight: 600,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          },
          duration: 3000,
        }}
      />
      <Dashboard />
    </QueryClientProvider>
  );
}