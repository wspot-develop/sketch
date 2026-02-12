import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { createBooking } from '../api';

const libraries: ('places')[] = ['places'];

type Booking = {
  address: string;
  latitude: string;
  longitude: string;
  available_from: string;
  details: {
    vehicle_id: string | null;
    vehicle_request_id: string | null;
    zone_type: string | null;
  };
  status: string;
  internal_notes: string;
  user_notes: string;
};

const SearchSpotPage = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking>({
    address: '',
    latitude: '',
    longitude: '',
    available_from: '',
    details: {
      vehicle_id: null,
      vehicle_request_id: null,
      zone_type: null,
    },
    status: 'available',
    internal_notes: '',
    user_notes: '',
  });

  const [search, setSearch] = useState('');
  const [distance, setDistance] = useState('500m');
  const [date, setDate] = useState('');
  const [type, setType] = useState('private');
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 40.4168, lng: -3.7038 });
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(null);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
    libraries,
  });

  const onAutocompleteLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onPlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address ?? place.name ?? '';

      setSearch(address);
      setMapCenter({ lat, lng });
      setMarkerPos({ lat, lng });
      setBooking((prev) => ({
        ...prev,
        address,
        latitude: String(lat),
        longitude: String(lng),
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: Booking = {
      ...booking,
      address: search,
      available_from: date,
      details: {
        ...booking.details,
        zone_type: type,
      },
      internal_notes: `distance:${distance}`,
    };
    await createBooking(payload);
    navigate('/cars');
  };

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div className="h-full overflow-y-auto">
        <h2 className='pb-4'>Seach Spot</h2>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
          <div className='flex flex-col'>
            <div className='flex gap-3'>
              <div>
                <label htmlFor="search">Search</label>
                {isLoaded ? (
                  <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
                    <input
                      type="text"
                      id="search"
                      placeholder="Search address..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    id="search"
                    placeholder="Loading maps..."
                    disabled
                  />
                )}                
              </div>
              <div>
                <label htmlFor="distance">Distance</label>
                <select
                  id="distance"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                >
                  <option value="500m">500m</option>
                  <option value="1km">1km</option>
                  <option value="3km">3km</option>
                </select>
              </div> 
            </div>

          </div>

          {isLoaded && (
            <div className="w-full h-50 rounded overflow-hidden border border-[#ccc]">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={markerPos ? 16 : 12}
              >
                {markerPos && <Marker position={markerPos} />}
              </GoogleMap>
            </div>
          )}

          <div className='flex flex-col'>
            <div className='flex gap-3'>     
              <div>
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>
              <div>
                <label htmlFor="date">Date</label>
                <input
                  type="datetime-local"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
              <div>
                <label htmlFor="date">Save like favorite</label>
                <input
                  type="type"
                  name="favorite"
                />
              </div>
          </div>
          <div className='flex flex-col'>
          </div>
          <div className='flex justify-between items-center'>
            <button type="submit">
              Create Spot
            </button>
          </div>
          <div className='flex justify-start pt-3'>
            <a href="/cars">Back</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchSpotPage;
