import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [cars] = useState<string[]>(['Toyota', 'Honda', 'Ford']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className='pt-12 pb-6'>
          <h2 className='pb-4'>Coches</h2>
          <p>Manage your cars</p>
        </div>

        {cars.length > 0 ? (
          <ul>
            {cars.map((car, index) => (
              <li key={index}>{car}</li>
            ))}
          </ul>
        ) : (
          <p>No cars added yet.</p>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div>

          </div>
          <div>
          </div>

          <div>

            <button type="submit" >
              Crete car
            </button>
          </div>
        </form>
        <div className="pt-12">
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
