import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    setMessage('');
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/car');
    } catch (error) {
      setMessage(`Login failed. Please check your credentials and try again. ${new Date().toLocaleTimeString()}`);
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className='pt-12 pb-6'>
          <h2 className='pb-4'>Login</h2>
          <p>Please enter your details to sign in</p>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>

            <button type="submit" >
              Sign In
            </button>
            {message && <p className='pt-3 text-red-700'>{message}</p>}
          </div>
        </form>
        <div className="pt-3">
          <p>Don't have an account? <a href="/register">Create account</a></p>
        </div>
      </div >
      <div className="login-illustration">
        {/* Placeholder for a premium illustration or background effect */}
        <div className="glow-effect"></div>
      </div>
    </div >
  );
};

export default LoginPage;
