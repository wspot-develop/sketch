import { Car, CircleParking } from 'lucide-react';


const OptionsPage = () => {
  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className='pb-6'>
          <h2 className='pb-4'>Options</h2>
          <p>What do you want?</p>
        </div>

        <div className='flex flex-col gap-6'>
          <button onClick={() => window.location.href = '/car-start-parking'} className='border-2 rounded-lg shadow-2xl no-underline'>
            <div className="flex flex-col justify-center items-center p-2 ">
              <Car size={120} />
              <p>Start Parking</p>
            </div>
          </button>
          <button onClick={() => window.location.href = '/car-end-parking'} className='border-2 rounded-lg shadow-2xl no-underline'>
            <div className="flex flex-col justify-center items-center p-2 ">
              <CircleParking size={120} />
              <p>End Parking</p>
            </div>
          </button>
        </div>
        
      </div >
        <div className='flex justify-start pt-3'>
          <a href="/cars">Back</a>
        </div>
    </div >
  );
};

export default OptionsPage;
