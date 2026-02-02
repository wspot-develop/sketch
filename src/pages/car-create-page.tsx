import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createCar } from '../api';

type Car = {
  brand: string;
  size: string;
  model: string;
  color: string;
  plate: string;
}

const CarCreatePage = () => {
  const [car, setCar] = useState<Car>({
    brand: '',
    size: '',
    model: '',
    color: '',
    plate: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCar(car)
    navigate('/cars');
  };

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className=' pb-6'>
          <h2 className='pb-4'>Car Details</h2>
          <p>Manage your car details</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
          <div className='flex flex-col '>
            <label htmlFor="brand">Car Brand</label>
            <input
              type="text"
              id="brand"
              placeholder="Car Brand"
              value={car.brand}
              onChange={(ev) => { setCar({ ...car, brand: ev.target.value }) }}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="size">Car Size</label>
            <input
              type="text"
              id="size"
              placeholder="Car Size"
              value={car.size}
              onChange={(ev) => { setCar({ ...car, size: ev.target.value }) }}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="model">Car Model</label>
            <input
              type="text"
              id="model"
              placeholder="Car Model"
              value={car.model}
              onChange={(ev) => { setCar({ ...car, model: ev.target.value }) }}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="color">Car Color</label>
            <input
              type="text"
              id="color"
              placeholder="Car Color"
              value={car.color}
              onChange={(ev) => { setCar({ ...car, color: ev.target.value }) }}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="plate">Car Plate</label>
            <input
              type="text"
              id="plate"
              placeholder="Car Plate"
              value={car.plate}
              onChange={(ev) => { setCar({ ...car, plate: ev.target.value }) }}
            />
          </div>
          <div className='flex justify-between items-center'>
            <a href="/cars">Back</a>
            <button type="submit" >
              Add car
            </button>
          </div>
        </form>
      </div >
    </div >
  );
};

export default CarCreatePage;
