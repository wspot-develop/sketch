import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { findAvailableSpots } from '../api';
import { useWs } from '../ws-provider';

interface Spot {
  booking_id: string;
  address: string;
  available_from: string;
  [key: string]: unknown;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const WaitingPlacePage = () => {
  const [searchParams] = useSearchParams();
  const distance = searchParams.get('distance') ? Number(searchParams.get('distance')) : 500;
  const latitude = searchParams.get('latitude') || "";
  const longitude = searchParams.get('longitude') || "";
  const user_id = searchParams.get('user_id') || "";
  const vehicle_id = searchParams.get('vehicle_id') || "";
  const { send } = useWs();
  const [loading, setLoading] = useState(true);
  const [spots, setSpots] = useState<Spot[]>([]);

  useEffect(() => {
    findAvailableSpots(latitude, longitude, distance)
      .then((data) => {
        setSpots(data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [latitude, longitude, distance]);


  const askThisSpot = (spot: any) => {
    send({ type: 'subscribe', channel: spot.id })
    send({
      type: 'send',
      channel: spot.id,
      data: {
        action: "waiting-accept-match",
        user_id,
        vehicle_id
      }
    })
  };
  
  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div>
        <div className='pb-6'>
          <h2 className='pb-4 font-bold text-lg'>Spots disponibles</h2>

          {loading && <p>Buscando lugares cercanos...</p>}

          {!loading && spots.length === 0 && (
            <p>No se encontraron lugares disponibles.</p>
          )}

          {!loading && spots.length > 0 && (
            <ul className='space-y-3'>
              {spots.map((spot, idx) => (
                <button
                  key={idx}
                  className='p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50'
                  onClick={() => {askThisSpot(spot)}}
                >
                  <p className='font-medium'>{spot.address}</p>
                  <p className='text-sm text-gray-600'>
                    Disponible desde: {formatDate(spot.available_from)}
                  </p>
                </button>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className='flex justify-start pt-3'>
        <a href="/cars">Cancel</a>
      </div>
    </div>
  );
};

export default WaitingPlacePage;
