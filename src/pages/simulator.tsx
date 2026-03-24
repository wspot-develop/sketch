import { useEffect, useMemo, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useWs } from '../ws-provider';
import { getBookings } from '../api';

interface Booking {
  id: string;
  available_from: string;
  latitude: string;
  longitude: string;
}

const mapContainerStyle = { width: '100%', height: '400px' };

const SimulatorPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [message, setMessage] = useState<Record<string, any>>({})
  const [bookingId, setBookingId] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const { send, subscribe } = useWs();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
  });

  const center = useMemo(() => {
    if (bookings.length === 0) return { lat: -33.45, lng: -70.65 };
    const lats = bookings.map(b => parseFloat(b.latitude));
    const lngs = bookings.map(b => parseFloat(b.longitude));
    return {
      lat: lats.reduce((a, b) => a + b, 0) / lats.length,
      lng: lngs.reduce((a, b) => a + b, 0) / lngs.length,
    };
  }, [bookings]);

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
        log('[arrived-spot]: Llego el coche')
      }

      if (response?.data?.action === 'waiting-accept-match') {
        log('[waiting-accept-match]: Esperando ser aceptado')
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
    <div className='bg-white p-6 scroll-auto w-full'>

      <div className='pt-12'>
        <div className='flex'>
          <button onClick={() => onSubscribeHandle(bookingId)}>Subscribe</button>
          <input className='w-full' type="text" value={bookingId} onChange={(event) => setBookingId(event.target.value)}></input>
        </div>

        <div className='flex gap-3 justify-between'>
          <div>
            <div className='pt-6'>[accept-match]</div>
            <button onClick={() => onAcceptMatchHandle(bookingId)}>Aceptar: que venga aparcar</button>
          </div>

          <div>          
            <div className='pt-6'>[accept-arrive]</div>
            <button onClick={() => onAcceptArriveHandle(bookingId)}>Aceptar: que ya lo veo</button>
          </div>

          <div>          
            <div className='pt-6'>[cancel-match]</div>
            <button onClick={() => onCancelMatchHandle(bookingId)}>Cancelar: que me canse de esperar</button>
          </div>
        </div>
      </div>

      <div className='pt-6 gap-3 flex w-full justify-between'>
        <div className='flex-1'>
          <h3>Mapa</h3>
          {isLoaded ? (
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={14}>
              {bookings.map((booking) => (
                <Marker
                  key={booking.id}
                  position={{ lat: parseFloat(booking.latitude), lng: parseFloat(booking.longitude) }}
                  title={`${booking.available_from}`}
                  onClick={() => setBookingId(booking.id)}
                />
              ))}
            </GoogleMap>
          ) : (
            <p>Cargando mapa…</p>
          )}
        </div>
        <div className='flex-1'>
          <h3>Logs</h3>
          <textarea
            className='w-full font-mono text-sm'
            rows={15}
            readOnly
            value={logs.join('\n')}
          />
        </div>
      </div>

    </div>
  );
};

export default SimulatorPage;
