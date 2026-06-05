import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Grid, Mail, Lock, User, Loader2, AlertCircle, CheckCircle, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters');
    }

    setLoading(true);

    try {
      await signUp({ 
        email: formData.email, 
        password: formData.password, 
        fullName: `${formData.firstName} ${formData.lastName}`.trim() 
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Left Pane - Brand & Steps */}
      <div className="w-full md:w-1/2 relative bg-[#1a1a1a] flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-transparent to-transparent opacity-50 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
              <Grid size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ThinkVault</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Get Started with Us</h1>
          <p className="text-gray-400 text-sm mb-12">Complete these easy steps to register your account.</p>

          <div className="w-full space-y-4 text-left">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white text-black shadow-xl">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">1</div>
              <span className="text-sm font-bold">Sign up your account</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-500">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-sm font-bold">Set up your workspace</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-500">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-sm font-bold">Set up your profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full md:w-1/2 bg-black flex flex-col items-center justify-center p-8 md:p-12 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Sign Up Account</h2>
            <p className="text-gray-500 text-sm">Enter your personal data to create your account.</p>
          </div>

          {/* Social Logins */}
          <div className="flex gap-4 mb-8">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white text-sm font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white text-sm font-medium">
              <Github size={20} />
              Github
            </button>
          </div>

          <div className="relative flex items-center gap-4 mb-8">
            <div className="flex-1 h-[1px] bg-white/5"></div>
            <span className="text-gray-600 text-xs font-medium uppercase tracking-widest">Or</span>
            <div className="flex-1 h-[1px] bg-white/5"></div>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-white font-bold text-lg">Account Created!</h3>
              <p className="text-gray-500 text-sm mt-2">Redirecting you to login...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="eg. John"
                    className="w-full bg-[#1a1a1a] border border-transparent focus:border-purple-500/30 rounded-xl py-3 px-4 text-white outline-none transition-all placeholder:text-gray-700 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="eg. Francisco"
                    className="w-full bg-[#1a1a1a] border border-transparent focus:border-purple-500/30 rounded-xl py-3 px-4 text-white outline-none transition-all placeholder:text-gray-700 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="eg. johnfrans@gmail.com"
                  className="w-full bg-[#1a1a1a] border border-transparent focus:border-purple-500/30 rounded-xl py-3 px-4 text-white outline-none transition-all placeholder:text-gray-700 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full bg-[#1a1a1a] border border-transparent focus:border-purple-500/30 rounded-xl py-3 px-4 text-white outline-none transition-all placeholder:text-gray-700 text-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
                    <Lock size={16} />
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 font-medium">Must be at least 8 characters.</p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3.5 rounded-xl font-bold hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Sign Up'}
              </button>
            </form>
          )}

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
