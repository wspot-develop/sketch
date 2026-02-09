import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ParkingCreateSpotPage = () => {
  const navigate = useNavigate();
  const { car_id } = useParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/cars/${car_id}`);
  };

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div >
        <div className='pb-6'>
          <h2 className='pb-4'>Create Spot</h2>
          <p>Create a new parking spot</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
          <div className='flex flex-col '>
            <label htmlFor="brand">Size car</label>
            <select>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="size">Color Zone</label>
            <select>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
            </select>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
            />
          </div>
          <div className='flex justify-between items-center'>
            <button type="submit" >
              Create Spot
            </button>
          </div>
          <div className='flex justify-start pt-3'>
            <a href={`/cars`}>Back</a>
          </div>
        </form>

      </div >
    </div >
  );
};

export default ParkingCreateSpotPage;
