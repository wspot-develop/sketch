import React, { useEffect, useState } from 'react';
import { useWs } from '../ws-provider';
import { getBookings } from '../api';

interface Booking {
  id: string;
  available_from: string;
  latitude: string;
  longitude: string;  
}

const SimulatorPage: React.FC = () => {
  const [bookingId, setBookingId] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const { send } = useWs();

  const setBookingSelected = (id: string) => {
    console.log(id)
    setBookingId(id)
  }

  useEffect(() => {
    getBookings().then((res) => {
      setBookings(res.data ?? res.bookings ?? []);
    });
  }, []);

  const onSubscribeHandle = (bookingId: string) => {
    send({ type: 'subscribe', channel: bookingId })
  }

  return (
    <div>
      <div>
        <input className='w-full' type="text" value={bookingId} onChange={(event) => setBookingId(event.target.value)}></input>
        <button onClick={() => onSubscribeHandle(bookingId)}>Subscribe</button>
      </div>

      <h3>Bookings</h3>
      <div>
        <select onChange={(event) => setBookingSelected(event.target.value)}>
          {bookings.map((booking) => (
            <option key={booking.id} value={booking.id}>{booking.latitude}, {booking.longitude} — {booking.available_from}</option> 
          ))}
        </select>
      </div>
    </div>
  );
};

export default SimulatorPage;
