//import { useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';


const ParkingMatchPage = () => {
  //const navigate = useNavigate();

  /*
  useEffect(() => {
    setTimeout(() => {
      navigate(`/parking-success`);
    }, 4000);
  }, []);
  */

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className='pb-6'>
          <h2 className='pb-4'>Match</h2>
          <p>Time to park</p>
        </div>

        <div className='flex flex-col gap-6'>
          <img className='object-none' style={{height: '220px', width: '100%'}} src="/map.png"></img>

          <div className='flex gap-2 justify-between'>
            <p>Arriving in 5 minutes</p>
            <button onClick={() => window.location.href = `/op2`} className='bg-black! text-white! border-2 rounded-lg shadow-2xl no-underline'>
              <div className="flex flex-col justify-center items-center ">
                <p>Wait please</p>
              </div>
            </button>
          </div>

          <div className='flex bg-cyan-200 p-3 justify-between pt-3'>
            <a href={`/page?content=parking-success`}>Success</a>
            <a href="/page?content=parking-cancelled">Cancelled</a>
          </div>          

        </div>

      </div >
      <div className='flex justify-start pt-3'>
        <a href="/cars">Cancel</a>
      </div>
    </div >
  );
};

export default ParkingMatchPage;
