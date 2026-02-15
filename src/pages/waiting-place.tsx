import { useSearchParams } from 'react-router-dom';

const WaitingPlacePage = () => {
  const [searchParams] = useSearchParams();
  const address = searchParams.get('address');
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const availableFrom = searchParams.get('available_from');
  const car_id = searchParams.get('car_id');

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className='pb-6'>
          <h2 className='pb-4'></h2>
          <p>{address}</p>
          <p>{latitude}</p>
          <p>{longitude}</p>
          <p>{availableFrom}</p>
          <p>{car_id}</p>
          <p>Waiting place...</p>
        </div>

      </div >
      <div className='flex justify-start pt-3'>
        <a href="/cars">Cancel</a>
      </div>
    </div >
  );
};

export default WaitingPlacePage;
