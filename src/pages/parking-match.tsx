import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Polyline, Marker } from "@react-google-maps/api";
import { useWs } from '../ws-provider';

type LatLng = { lat: number; lng: number };

// Barcelona area: origin (Sagrada Familia) -> destination (Placa Catalunya)
const ORIGIN: LatLng = { lat: 41.4036, lng: 2.1744 };
const DESTINATION: LatLng = { lat: 41.3874, lng: 2.1686 };

const CAR_ICON_PATH =
  "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z M20.774,10.97c0-3.693,3.184-6.17,6.877-6.17c3.693,0,6.877,2.477,6.877,6.17H20.774z M12.981,14.188l2.728,7.212v4.806l-2.728-0.351V14.188z M12.745,33.042c0-1.55,1.256-2.806,2.806-2.806s2.806,1.256,2.806,2.806s-1.256,2.806-2.806,2.806S12.745,34.592,12.745,33.042z M28.674,33.042c0-1.55,1.256-2.806,2.806-2.806s2.806,1.256,2.806,2.806s-1.256,2.806-2.806,2.806S28.674,34.592,28.674,33.042z";

const UPDATE_INTERVAL_MS = 10_000; // 10 seconds

function interpolatePoints(
  origin: LatLng,
  destination: LatLng,
  totalSteps: number
): LatLng[] {
  const points: LatLng[] = [];
  for (let i = 0; i <= totalSteps; i++) {
    const t = i / totalSteps;
    points.push({
      lat: origin.lat + (destination.lat - origin.lat) * t,
      lng: origin.lng + (destination.lng - origin.lng) * t,
    });
  }
  return points;
}

const ParkingMatchPage = () => {
  const { send } = useWs();
  const [searchParams] = useSearchParams();
  const destination = useMemo<LatLng>(() => {
    const lat = parseFloat(searchParams.get("offer_latitude") ?? "");
    const lng = parseFloat(searchParams.get("offer_longitude") ?? "");
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    return DESTINATION;
  }, [searchParams]);

  const mapCenter = useMemo<LatLng>(
    () => ({
      lat: (ORIGIN.lat + destination.lat) / 2,
      lng: (ORIGIN.lng + destination.lng) / 2,
    }),
    [destination]
  );

  const [showClose, setShowClose] = useState(false);
  const [routePath, setRoutePath] = useState<LatLng[]>([]);
  const [carPosition, setCarPosition] = useState<LatLng>(ORIGIN);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [arrived, setArrived] = useState(false);
  const [eta, setEta] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sampledPointsRef = useRef<LatLng[]>([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "",
  });

  const isClose = (value: boolean) => {
    setShowClose(value);
  };

  // Get route from Directions API or fallback to interpolation
  const buildRoute = useCallback(() => {
    if (!isLoaded) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: ORIGIN,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const leg = result.routes[0]?.legs[0];
          if (leg) {
            // Extract all points from the route steps
            const points: LatLng[] = [];
            for (const step of leg.steps) {
              for (const point of step.path) {
                points.push({ lat: point.lat(), lng: point.lng() });
              }
            }

            // Sample ~30 steps so the trip lasts ~5 minutes of simulated time
            const sampled: LatLng[] = [];
            const desiredSteps = 30;
            for (let i = 0; i <= desiredSteps; i++) {
              const idx = Math.min(
                Math.floor((i / desiredSteps) * (points.length - 1)),
                points.length - 1
              );
              sampled.push(points[idx]);
            }

            setRoutePath(points);
            setCarPosition(sampled[0]);
            setTotalSteps(sampled.length - 1);
            sampledPointsRef.current = sampled;
            setEta(leg.duration?.text ?? "");
          }
        } else {
          // Fallback: linear interpolation
          const fallback = interpolatePoints(ORIGIN, destination, 30);
          setRoutePath(fallback);
          setCarPosition(fallback[0]);
          setTotalSteps(fallback.length - 1);
          sampledPointsRef.current = fallback;
          setEta("~5 min");
        }
      }
    );
  }, [isLoaded, destination]);

  useEffect(() => {
    buildRoute();
    const bookingId = searchParams.get("booking_id")
    send({ type: 'subscribe', channel: bookingId })
  }, [buildRoute]);

  // Animate car every 10 seconds
  useEffect(() => {
    if (totalSteps === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        const steps = sampledPointsRef.current;

        if (next >= steps.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setArrived(true);
          return prev;
        }

        setCarPosition(steps[next]);

        const remaining = steps.length - next;
        const minutesLeft = Math.ceil((remaining * 10) / 60);
        setEta(`~${minutesLeft} min`);

        return next;
      });
    }, UPDATE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalSteps]);

  // Compute traveled path slice index for render
  const traveledEndIndex =
    totalSteps > 0
      ? Math.min(
          Math.floor((currentStep / totalSteps) * routePath.length),
          routePath.length
        )
      : 0;

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
      <div className="h-full overflow-y-auto">
        <div className="pb-2">
          <h4 className="pb-2">Going to destiny</h4>
        </div>

        <div className="flex flex-col gap-3">
          {/* Google Maps with car simulation */}
          <div className="w-full rounded overflow-hidden border border-[#ccc]" style={{ height: "280px" }}>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={mapCenter}
                zoom={14}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                }}
              >
                {/* Full route polyline */}
                {routePath.length > 0 && (
                  <Polyline
                    path={routePath}
                    options={{
                      strokeColor: "#3498db",
                      strokeOpacity: 0.8,
                      strokeWeight: 5,
                    }}
                  />
                )}

                {/* Traveled path overlay */}
                {traveledEndIndex > 0 && (
                  <Polyline
                    path={routePath.slice(0, traveledEndIndex)}
                    options={{
                      strokeColor: "#e74c3c",
                      strokeOpacity: 1,
                      strokeWeight: 5,
                    }}
                  />
                )}

                {/* Car marker */}
                <Marker
                  position={carPosition}
                  icon={{
                    path: CAR_ICON_PATH,
                    fillColor: "#e74c3c",
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: "#c0392b",
                    scale: 0.5,
                    anchor: new google.maps.Point(24, 24),
                  }}
                  title="Your car"
                />

                {/* Destination marker */}
                <Marker
                  position={destination}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: "#27ae60",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#1e8449",
                    scale: 10,
                  }}
                  title="Destination"
                />

                {/* Origin marker */}
                <Marker
                  position={ORIGIN}
                  label={{ text: "A", color: "white", fontWeight: "bold" }}
                  title="Origin"
                />
              </GoogleMap>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <p>Loading map...</p>
              </div>
            )}
          </div>

          {/* Status info */}
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-semibold">
              {arrived ? "Arrived!" : `ETA: ${eta || "calculating..."}`}
            </span>
            <span className="text-xs text-gray-500">
              Step {currentStep}/{totalSteps} (updates every 10s)
            </span>
          </div>

          <div className="flex gap-2 flex-col justify-center items-center">
            {arrived && (
              <div>
                <p className="text-green-800 blink">
                  The blue Porche with plate ES-32232 is in front of you. Waiting
                  accept transaction...
                </p>
              </div>
            )}

            {!arrived && !showClose && <p>Arriving in {eta || "a few minutes"}</p>}

            {showClose && !arrived && (
              <div>
                <p className="text-green-800 blink">
                  The blue Porche with plate ES-32232 is in front of you. Waiting
                  accept transaction...
                </p>
              </div>
            )}

            {!showClose && !arrived && (
              <button className="bg-black! text-white! border-2 rounded-lg shadow-2xl no-underline">
                <div className="flex flex-col justify-center items-center">
                  <p>I am coming, please wait.</p>
                </div>
              </button>
            )}
          </div>

          {!showClose && !arrived && (
            <div className="flex bg-cyan-200 p-3 justify-between pt-3">
              <a href="#" onClick={() => isClose(true)}>
                Close
              </a>
              <a href="/page?content=parking-success">Success</a>
              <a href="/page?content=parking-cancelled">Cancelled</a>
            </div>
          )}

          {(showClose || arrived) && (
            <div className="flex flex-col gap-3 bg-cyan-200 p-3 justify-between pt-3">
              {!arrived && (
                <a href="#" onClick={() => isClose(false)}>
                  Not close
                </a>
              )}
              <a href="/page?content=parking-success">Accepted transaction</a>
              <a href="/page?content=parking-cancelled">Not accepted trans.</a>
            </div>
          )}
        </div>

        <div className="flex justify-start pt-3">
          <a href="/cars">Cancel</a>
        </div>
      </div>
    </div>
  );
};

export default ParkingMatchPage;
