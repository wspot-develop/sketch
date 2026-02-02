import React, { useEffect, useState } from 'react';
import { getCars } from '../api';

const CarPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    getCars().then(data => {
      setCars(data);
    });
  }, []); 


  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className='pt-12 pb-3'>
          <h2 className='pb-1'>Coches</h2>
        </div>
        {cars.length > 0 ? (
          <div className='py-3 border-t-2'>
            <div className='flex justify-start'>
              <p>List of cars:</p>
            </div>
            <ul className='pl-6 pt-2'>
              {cars.map((car, index) => (
                <li className='pl-4' key={index}>{car.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No cars added yet.</p>
        )}
        <div className='flex justify-end pt-6'>
          <a href="/car-create">Add car</a>
        </div>
      </div>
    </div>      
  );
};

export default CarPage;
