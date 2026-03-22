import React, { useEffect, useState } from 'react';
import { useWs } from '../ws-provider';
import { getBookings } from '../api';

interface Booking {
  id: string;
  available_from: string;
}

const SimulatorPage: React.FC = () => {
  const [bookingId, setBookingId] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const { send } = useWs();

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
        <input type="text" onChange={(event) => setBookingId(event.target.value)}></input>
        <button onClick={() => onSubscribeHandle(bookingId)}>Subscribe</button>
      </div>

      <h3>Bookings</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            <strong>{booking.id}</strong> — {booking.available_from}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimulatorPage;
