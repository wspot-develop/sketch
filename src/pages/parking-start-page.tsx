import { useParams } from 'react-router-dom';

const CarStartParkingPage = () => {
  const { car_id } = useParams();
  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className='pb-6'>
          <h2 className='pb-4'>Parking Spots</h2>
          <p>Choose a parking spot</p>
        </div>

        <div className='flex flex-col gap-6'>

          <button onClick={() => window.location.href = `/parking-spots/${car_id}?place=home`} className='border-2 rounded-lg shadow-2xl no-underline'>
            <div className="flex flex-col justify-center items-center p-2 ">
              <p>Home</p>
            </div>
          </button>

          <button onClick={() => window.location.href = `/parking-spots/${car_id}?place=work`} className='border-2 rounded-lg shadow-2xl no-underline'>
            <div className="flex flex-col justify-center items-center p-2 ">
              <p>Work</p>
            </div>
          </button>

          <button onClick={() => window.location.href = `/page?content=create-spot`} className=' border-2 rounded-lg shadow-2xl no-underline'>
            <div className="flex flex-col p-2 justify-center items-center ">
              <p>Other</p>
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

export default CarStartParkingPage;
