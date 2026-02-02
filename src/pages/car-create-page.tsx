import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createCar } from '../api';

const CarCreatePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [car, setCar] = useState<any>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCar(car)
    navigate('/car');
  };

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className='pt-12 pb-6'>
          <h2 className='pb-4'>Car Details</h2>
          <p>Manage your car details</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div>
            <label htmlFor="email">Car Brand</label>
            <input
              type="text"
              id="brand"
              placeholder="Car Brand"
              value={car ? car.brand : ''}
              onChange={(ev) => { setCar({...car, brand: ev.target.value}) }}
            />
          </div>
          <div>
            <button type="submit" >
              Crete car
            </button>
          </div>
        </form>
      </div >
      <div className="login-illustration">
        {/* Placeholder for a premium illustration or background effect */}
        <div className="glow-effect"></div>
      </div>
    </div >
  );
};

export default CarCreatePage;
