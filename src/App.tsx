/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

/**
 * Main Application Component
 * Handles routing and global layout for the AI Meal Analyzer.
 */
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark text-white font-sans flex flex-col relative overflow-hidden">
        
        {/* Animated Background Gradients for the Glass-morphism effect */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 blur-[150px] rounded-full pointer-events-none" 
          aria-hidden="true" 
        />
        
        {/* Navigation Bar component */}
        <Navbar />
        
        {/* Main content area with responsive constraints */}
        <main className="flex-1 flex flex-col z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            
            {/* Catch-all route to redirect users back to the landing page */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
