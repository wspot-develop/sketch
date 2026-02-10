import { useState } from "react";

const ParkedWaitingPage = () => {
  const [showClose, setShowClose] = useState(false)
  const isClose = (value: boolean) => {
    setShowClose(value)
  }

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div className='pb-6'>
        <h4 className='pb-4'>Coming to destiny</h4>
      </div>

      <div className='flex flex-col gap-6'>
        <div className='flex gap-2 flex-col justify-center items-center'>
          <img className='object-none' style={{height: '220px', width: '100%'}} src="/map.png"></img>
          
          {!showClose &&
            <p>Coming in 5 minutes</p>
          }
          {showClose &&
            <div>
              <p className="text-green-800 blink">The white Colora with place ES-445533 is front of you. Waiting accept transaction...</p>
            </div>
          }
          {!showClose &&
            <button className='bg-black! text-white! border-2 rounded-lg shadow-2xl no-underline'>
              <div className="flex flex-col justify-center items-center ">
                <p>Cancel operation</p>
              </div>
            </button>
          }
        </div>

        
        {!showClose &&
          <div className='flex bg-cyan-200 p-3 justify-between pt-3'>
            <a href="#" onClick={() => {isClose(true)}}>Close</a>
            <a href={`/page?content=parking-success`}>Success</a>
            <a href="/page?content=parking-cancelled">Cancelled</a>
          </div>          
        }        
        {showClose &&
          <div className='flex flex-col gap-3 bg-cyan-200 p-3 justify-between pt-3'>
            <a href="#" onClick={() => {isClose(false)}}>Not close</a>
            <a href={`/page?content=parking-success`}>Accepted transaction </a>
            <a href="/page?content=parking-cancelled">Not accepted trans.</a>
          </div>          
        } 
      </div>

      <div className='flex justify-start pt-3'>
        <a href="/cars">Cancel</a>
      </div>
    </div >
  );
};

export default ParkedWaitingPage;
