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
        <div className='pt-12 pb-6'>
          <h2 className='pb-4'>Coches</h2>
          <p>Manage your cars</p>
        </div>
        {cars.length > 0 ? (
          <ul>
            {cars.map((car, index) => (
              <li key={index}>{car.name}</li>
            ))}
          </ul>
        ) : (
          <p>No cars added yet.</p>
        )}
        <a href="/car-create">Add car</a>
      </div>
    </div>      
  );
};

export default CarPage;
