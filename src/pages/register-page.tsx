import { register } from '../api';
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(email, password);
  };

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className='pt-12 pb-6'>
          <h2 className='pb-4'>Register</h2>
          <p>Please enter your details to create an account</p>
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
              Sign Up
            </button>
          </div>
        </form>
        <div className="pt-12">
          <p>I have account <a href="/login">Sign in</a></p>
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
