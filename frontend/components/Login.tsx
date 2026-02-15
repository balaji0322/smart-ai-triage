import React, { useState } from 'react';
import { Ambulance, Building2, Lock, ArrowRight, Activity, Mail, User as UserIcon } from 'lucide-react';
import { UserRole } from '../types';
import { authAPI } from '../services/apiService';

interface LoginProps {
  onLogin: (role: UserRole, userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'ambulance'>('admin');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        // Register new user
        const role = activeTab === 'admin' ? 'admin' : 'patient';
        const response = await authAPI.register({
          name,
          email,
          password,
          role,
          age: age ? parseInt(age) : undefined,
          gender: gender || undefined,
        });
        
        onLogin(activeTab, response.user);
      } else {
        // Login existing user
        const response = await authAPI.login(email, password);
        
        // Determine role from response
        const userRole = response.user.role === 'admin' ? 'admin' : 'ambulance';
        onLogin(userRole, response.user);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      console.error('Error type:', typeof err);
      console.error('Error details:', err);
      
      // Extract error message properly
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (err instanceof Error) {
        // Standard Error object
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        // String error
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        // Object error - try different properties
        if (err.detail) {
          errorMessage = typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail);
        } else if (err.message) {
          errorMessage = typeof err.message === 'string' ? err.message : JSON.stringify(err.message);
        } else {
          // Last resort - stringify the whole object
          try {
            errorMessage = JSON.stringify(err);
          } catch (e) {
            errorMessage = 'An error occurred. Please try again.';
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden">
        {/* Left Side - Visual */}
        <div className="hidden md:flex flex-col justify-center p-12 w-1/2 bg-blue-600 text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="z-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                     <Activity className="text-blue-600" size={32} />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">SmartTriage AI</h1>
            </div>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Advanced AI-powered patient prioritization and emergency alert system for modern healthcare facilities.
            </p>
            <div className="space-y-4">
                <div className="flex items-center gap-3 bg-blue-500/50 p-3 rounded-lg backdrop-blur-sm">
                    <Building2 size={20} />
                    <span className="font-medium">Hospital Operations</span>
                </div>
                <div className="flex items-center gap-3 bg-blue-500/50 p-3 rounded-lg backdrop-blur-sm">
                    <Ambulance size={20} />
                    <span className="font-medium">Ambulance Coordination</span>
                </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 text-sm">
                {isRegistering ? 'Register your facility or vehicle' : 'Please sign in to your dashboard'}
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-8">
            <button 
                onClick={() => setActiveTab('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Building2 size={16} /> Hospital Admin
            </button>
            <button 
                onClick={() => setActiveTab('ambulance')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'ambulance' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Ambulance size={16} /> Ambulance
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="admin@hospital.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegistering && activeTab === 'ambulance' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Age</label>
                    <input 
                      type="number" 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isRegistering ? 'Create Account' : 'Sign In')} 
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
              <button 
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="ml-2 text-blue-600 font-medium hover:underline"
              >
                {isRegistering ? 'Sign In' : 'Register Now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
