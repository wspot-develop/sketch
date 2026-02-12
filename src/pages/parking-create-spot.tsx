import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../api';

const ParkingCreateSpotPage = () => {
  const navigate = useNavigate();
  const { car_id } = useParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bookingData = {
      car_id,
      address: formData.get('address'),
      available_from: new Date(formData.get('available_from') as string).toISOString(),
      details: {
        vehicle_id: car_id,
        zone_type: formData.get('details[zone_type]'),
      },
    };
    await createBooking(bookingData);
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
            <label htmlFor="address">Address</label>
            <input name="address"></input>
            <div className='flex gap-3 pt-3'>
              <div>
                <label htmlFor="details[zone_type]">Color Zone</label>
                <select name="details[zone_type]">
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>
            </div>
          </div>
          <div className='flex gap-3'>
            <div className='flex flex-col'>
              <label htmlFor="available_from">Date</label>
              <input
                name="available_from"
                type="datetime-local"
                id="date"
              />
            </div>
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
