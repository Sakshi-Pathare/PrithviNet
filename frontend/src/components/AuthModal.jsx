import React, { useState } from 'react';
import { 
  X, LogIn, UserPlus, Mail, Lock, User, MapPin, 
  Sparkles, ShieldCheck, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { loginUser, signupUser } from '../api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, onToast, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('Alandi, Pune');
  const [communityGroupId, setCommunityGroupId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }

        const res = await signupUser({
          name: name.trim(),
          email: email.trim(),
          password,
          neighborhood: neighborhood.trim(),
          community_group_id: Number(communityGroupId)
        });

        onToast?.({
          type: 'success',
          title: 'Account Created! 🎉',
          message: `Welcome to PrithviNet, ${res.user.name}! You earned +100 welcome Green Points.`
        });
        onAuthSuccess?.(res.user);
        onClose();
      } else {
        const res = await loginUser({
          email: email.trim(),
          password
        });

        onToast?.({
          type: 'success',
          title: 'Welcome Back! 👋',
          message: `Signed in as ${res.user.name}.`
        });
        onAuthSuccess?.(res.user);
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await loginUser({
        email: 'ananya@prithvinet.org',
        password: 'password123'
      }).catch(async () => {
        // If not seeded yet, try signup for demo
        return await signupUser({
          name: 'Ananya Sharma',
          email: 'ananya@prithvinet.org',
          password: 'password123',
          neighborhood: 'Alandi, Pune',
          community_group_id: 1
        });
      });

      onToast?.({
        type: 'success',
        title: 'Demo Volunteer Active 🌿',
        message: 'Signed in as Ananya Sharma (MITAOE Green Warriors).'
      });
      onAuthSuccess?.(res.user);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Could not launch demo account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#E2DDD1] shadow-2xl overflow-hidden p-5 sm:p-7">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#8C857B] hover:text-[#2C4A3E] hover:bg-[#F5F2EB] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E8EFEA] to-[#D4E5DC] border border-[#7C9D8E]/40 flex items-center justify-center p-1 shadow-xs">
            <img src="/emblem.png" alt="PrithviNet" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-xl text-[#2C4A3E]">
              Prithvi<span className="text-[#587B6C]">Net</span>
            </h2>
            <p className="text-xs text-[#8C857B] font-medium">
              Pune Verified Environmental Action Network
            </p>
          </div>
        </div>

        {/* Toggle Tabs */}
        <div className="flex rounded-2xl bg-[#F5F2EB] p-1 mb-5 border border-[#E2DDD1]">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-white text-[#2C4A3E] shadow-xs'
                : 'text-[#8C857B] hover:text-[#2C4A3E]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#2C4A3E] shadow-xs'
                : 'text-[#8C857B] hover:text-[#2C4A3E]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Welcome Bonus Notice (on Signup) */}
        {mode === 'signup' && (
          <div className="mb-4 p-3 rounded-xl bg-[#E8EFEA]/80 border border-[#7C9D8E]/30 flex items-center gap-2.5 text-xs text-[#2C4A3E]">
            <Sparkles className="w-4 h-4 text-[#587B6C] shrink-0" />
            <span><strong>+100 Green Points</strong> awarded instantly upon registration!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-[#2C4A3E] uppercase tracking-wide mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rohan Kulkarni"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD1] text-xs text-[#2C4A3E] focus:outline-none focus:border-[#587B6C] focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#2C4A3E] uppercase tracking-wide mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD1] text-xs text-[#2C4A3E] focus:outline-none focus:border-[#587B6C] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#2C4A3E] uppercase tracking-wide mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter your password'}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD1] text-xs text-[#2C4A3E] focus:outline-none focus:border-[#587B6C] focus:bg-white transition-all"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-[#2C4A3E] uppercase tracking-wide mb-1">
                  Pune Locality / Neighborhood
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    placeholder="e.g. Alandi, Kothrud, Baner, Koregaon Park"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD1] text-xs text-[#2C4A3E] focus:outline-none focus:border-[#587B6C] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2C4A3E] uppercase tracking-wide mb-1">
                  Community Group
                </label>
                <select
                  value={communityGroupId}
                  onChange={e => setCommunityGroupId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD1] text-xs text-[#2C4A3E] focus:outline-none focus:border-[#587B6C] focus:bg-white transition-all"
                >
                  <option value={1}>MITAOE Green Warriors (Pune Campus)</option>
                  <option value={2}>Pune Clean Air & River Volunteers (Pune Metro)</option>
                  <option value={3}>Alandi Solar & Rooftop Network (Alandi Sector)</option>
                  <option value={4}>Green Leaf Composting Circle (Kothrud & Baner)</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-[#2C4A3E] to-[#3B6353] hover:from-[#233A31] hover:to-[#2C4A3E] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : mode === 'signup' ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Option */}
        <div className="mt-4 pt-4 border-t border-[#E2DDD1]/80 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="text-xs text-[#587B6C] hover:text-[#2C4A3E] font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <span>Or continue with Demo Pune Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
