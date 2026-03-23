import { useEffect, useState } from 'react';
import { useWs } from '../ws-provider';
import { getBookings } from '../api';

interface Booking {
  id: string;
  available_from: string;
  latitude: string;
  longitude: string;
}

const SimulatorPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [message, setMessage] = useState<Record<string, any>>({})
  const [bookingId, setBookingId] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const { send, subscribe } = useWs();

  useEffect(() => {
    const log = (msg: string, ...args: unknown[]) => {
      const line = [msg, ...args.map(a => typeof a === 'string' ? a : JSON.stringify(a))].join(' ');
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`]);
    };

    const unsubscribe = subscribe((raw: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = raw as Record<string, any>
      setMessage(response)
      log('WebSocket received:', response)

      if (response?.data?.action === 'arrived-spot') {
        log('Llego el coche')
      }

      if (response?.data?.action === 'waiting-accept-match') {
        log('Esperando ser aceptado')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [bookingId, send, subscribe])

  useEffect(() => {
    getBookings().then((res) => {
      setBookings(res.data ?? res.bookings ?? []);
    });
  }, []);

  const onSubscribeHandle = (bookingId: string) => {
    send({ type: 'subscribe', channel: bookingId })
  }

  const onAcceptArriveHandle = (bookingId: string) => {
    send({
      type: 'send', channel: bookingId,
      data: {
        action: 'accepted-arrive'
      }
    })    
  }
  const onAcceptMatchHandle = (bookingId: string) => {
        send({
          type: 'send', channel: bookingId,
          data: {
            action: 'accepted-match',
            match_user_id: message?.data?.user_id,
            match_vehicle_id: message?.data?.vehicle_id,
          }
        })    
  }

  const onCancelMatchHandle = (bookingId: string) => {
        send({
          type: 'send', channel: bookingId,
          data: {
            action: 'canceled-match'
          }
        })    
  }
  

  return (
    <div>
      <div>
        <input className='w-full' type="text" value={bookingId} onChange={(event) => setBookingId(event.target.value)}></input>
        <button onClick={() => onSubscribeHandle(bookingId)}>Subscribe</button>
        <button onClick={() => onAcceptMatchHandle(bookingId)}>Aceptar: que venga aparcar</button>
        <button onClick={() => onAcceptArriveHandle(bookingId)}>Aceptar: que ya lo veo</button>
        <button onClick={() => onCancelMatchHandle(bookingId)}>Cancelar: que me canse de esperar</button>
      </div>

      <h3>Bookings</h3>
      <div>
        <select onChange={(event) => setBookingId(event.target.value)}>
          {bookings.map((booking) => (
            <option key={booking.id} value={booking.id}>{booking.latitude}, {booking.longitude} — {booking.available_from}</option>
          ))}
        </select>
      </div>

      <h3>Logs</h3>
      <textarea
        className='w-full font-mono text-sm'
        rows={15}
        readOnly
        value={logs.join('\n')}
      />
    </div>
  );
};

export default SimulatorPage;
