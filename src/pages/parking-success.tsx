const ParkingSuccessPage = () => {
  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className='pb-6'>
          <h2 className='pb-4'>Success</h2>
          <p>You are parked</p>
        </div>


      </div >
      <div className='flex justify-start pt-3'>
        <a href="/cars">Back</a>
      </div>
    </div >
  );
};

export default ParkingSuccessPage;
