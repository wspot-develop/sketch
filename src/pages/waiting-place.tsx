
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const WaitingPlacePage = () => {
  const { car_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(`/parking-spots/${car_id}`);
    }, 4000);
  }, [car_id]);

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className='pb-6'>
          <h2 className='pb-4'></h2>
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
