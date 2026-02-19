import { useParams } from 'react-router-dom';

const ParkingWaitingMatchPage = () => {
  const { vehicle_id } = useParams();
  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div>
        <div className='pb-6'>
          <h2 className='pb-4'>Match</h2>
          <p>Waiting accept</p>
        </div>

        <div className='flex flex-col gap-6'>
          <div className="flex flex-col justify-center items-center p-2 ">
            <p>waiting...</p>
          </div>
        </div >
      </div>
      <div className='flex bg-cyan-200 p-3 justify-between pt-3'>
        <a href={`/parking-match/${vehicle_id}`}>If accepted</a>
        <a href="/page?content=match-cancelled">If not accepted</a>
      </div>
      <div className='flex justify-start pt-3'>
        <a href="/cars">Cancel</a>
      </div>
    </div >
  );
};

export default ParkingWaitingMatchPage;
