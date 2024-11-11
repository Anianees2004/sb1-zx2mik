import React from 'react';
import { Shield, Lock, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Hero() {
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const { user } = useAuth();

  return (
    <div id="top" className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Protect Your Digital Identity</span>
            <span className="block text-blue-200">With Confidence</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Secure your online presence with advanced identity verification and fraud protection. 
            Stay safe in the digital world with DigiShield's cutting-edge security solutions.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            {!user && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="rounded-lg px-6 py-3 bg-white text-blue-900 font-semibold hover:bg-blue-50 transition-colors"
              >
                Get Started
              </button>
            )}
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-lg px-6 py-3 bg-transparent border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>

        <div id="features" className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <Shield className="h-12 w-12 mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">Identity Protection</h3>
            <p className="text-blue-100">Advanced encryption and security measures to keep your digital identity safe.</p>
          </div>
          <div id="security" className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <Lock className="h-12 w-12 mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
            <p className="text-blue-100">Multi-factor authentication and biometric verification for enhanced security.</p>
          </div>
          <div id="about" className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <UserCheck className="h-12 w-12 mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
            <p className="text-blue-100">24/7 fraud detection and instant alerts for suspicious activities.</p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
}