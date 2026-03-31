import { useEffect, useState } from 'react';
import { useWs } from '../ws-provider';
import { useParams } from 'react-router-dom';

type Coords = { latitude: number; longitude: number };

const DEFAULT_COORDS: Coords = { latitude: 40.4168, longitude: -3.7038 }; // Madrid centro

const SimulatorPage: React.FC = () => {
  const { booking_id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastMessage, setLastMessage] = useState<Record<string, any>>({})
  const [text, setText] = useState('')
  const [bookingId, setBookingId] = useState(booking_id ?? '')
  const [matchId, setMatchId] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [coords, setCoords] = useState<Coords>(DEFAULT_COORDS)
  const { send, subscribe } = useWs();

  useEffect(() => {
    if (booking_id) {
      send({ type: 'subscribe', channel: booking_id });
    }
  }, [booking_id, send]);

  const log = (msg: string, ...args: unknown[]) => {
    const line = [msg, ...args.map(a => typeof a === 'string' ? a : JSON.stringify(a))].join(' ');
    setLogs(prev => [ `[${new Date().toLocaleTimeString()}] ${line}`, ...prev]);
  };

  subscribe((raw: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = raw as Record<string, any>
    setLastMessage(response)
    log('WS recibido:', response)

    const action = response?.data?.action;

    if (action === 'car-leaving') {
      log('[car-leaving] Usuario A anuncia salida:', response?.data?.coords, response?.data?.dateTime);
    }

    if (action === 'spot-searching') {
      log('[spot-searching] Usuario B busca plaza:', response?.data?.coords);
    }

    if (action === 'match:proposal') {
      const { matchId: mid, distance, peerInfo } = response?.data ?? {};
      setMatchId(mid ?? '');
      log(`[match:proposal] matchId=${mid} distancia=${distance}m peer=`, peerInfo);
    }

    if (action === 'match:accept') {
      log(`[match:accept] matchId=${response?.data?.matchId}`);
    }

    if (action === 'match:reject') {
      log(`[match:reject] matchId=${response?.data?.matchId}`);
    }

    if (action === 'match:confirmed') {
      log(`[match:confirmed] matchId=${response?.data?.matchId}`);
    }

    if (action === 'match:cancelled') {
      log(`[match:cancelled] matchId=${response?.data?.matchId} reason=${response?.data?.reason}`);
    }

    if (action === 'location:update') {
      log('[location:update] Usuario B envía GPS:', response?.data?.coords);
    }

    if (action === 'location:peer') {
      log('[location:peer] Coords del peer:', response?.data?.coords);
    }

    if (action === 'match:arrived') {
      log(`[match:arrived] matchId=${response?.data?.matchId}`);
    }

    if (action === 'match:complete') {
      log('[match:complete] Resumen:', response?.data?.summary);
    }

    if (action === 'message') {
      log('[message]:', response?.data?.message);
    }
  });

  // --- Handlers Cliente -> Servidor ---

  const onSubscribe = () => {
    send({ type: 'subscribe', channel: bookingId });
    log('Suscrito al canal:', bookingId);
  };

  const onCarLeaving = () => {
    send({
      type: 'send', channel: bookingId,
      data: {
        action: 'car-leaving',
        coords: { lat: coords.latitude, lng: coords.longitude },
        dateTime: new Date().toISOString(),
      }
    });
  };

  const onSpotSearching = () => {
    send({
      type: 'send', channel: bookingId,
      data: {
        action: 'spot-searching',
        coords: { lat: coords.latitude, lng: coords.longitude },
      }
    });
  };

  const onMatchAccept = () => {
    send({
      type: 'send', channel: bookingId,
      data: { action: 'match:accept', matchId }
    });
  };

  const onMatchReject = () => {
    send({
      type: 'send', channel: bookingId,
      data: { action: 'match:reject', matchId }
    });
  };

  const onLocationUpdate = () => {
    send({
      type: 'send', channel: bookingId,
      data: {
        action: 'location:update',
        coords: { lat: coords.latitude, lng: coords.longitude },
      }
    });
  };

  const onMatchArrived = () => {
    send({
      type: 'send', channel: bookingId,
      data: { action: 'match:arrived', matchId }
    });
  };

  // --- Handlers Servidor -> Cliente (simular respuestas del servidor) ---

  const onSimulateProposal = () => {
    send({
      type: 'send', channel: bookingId,
      data: {
        action: 'match:proposal',
        matchId: matchId || `match-${Date.now()}`,
        distance: 350,
        peerInfo: { name: 'Test User', car: 'Toyota Corolla Rojo', plate: '1234ABC' },
      }
    });
  };

  const onSimulateConfirmed = () => {
    send({
      type: 'send', channel: bookingId,
      data: { action: 'match:confirmed', matchId }
    });
  };

  const onSimulateCancelled = () => {
    send({
      type: 'send', channel: bookingId,
      data: { action: 'match:cancelled', matchId, reason: 'El otro usuario rechazó' }
    });
  };

  const onSimulateLocationPeer = () => {
    send({
      type: 'send', channel: bookingId,
      data: {
        action: 'location:peer',
        coords: { latitude: coords.latitude + 0.001, longitude: coords.longitude + 0.001 },
      }
    });
  };

  const onSimulateComplete = () => {
    send({
      type: 'send', channel: bookingId,
      data: {
        action: 'match:complete',
        matchId,
        summary: {
          duration: 300,
          distance: 800,
          address: 'Calle Gran Vía, 12, Madrid',
          car: 'Toyota Corolla Rojo - 1234ABC',
        },
      }
    });
  };

  const onMessage = () => {
    send({
      type: 'send', channel: bookingId,
      data: { action: 'message', message: text }
    });
  };

  const sectionStyle = 'border border-gray-300 rounded p-3 flex flex-col gap-2';
  const labelStyle = 'text-xs text-gray-500 font-mono';
  const btnStyle = 'px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50';
  const btnDanger = 'px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700';
  const btnGreen = 'px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700';
  const btnYellow = 'px-3 py-1.5 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700';

  return (
    <div className='container mx-auto p-4 max-w-3xl flex flex-col gap-4 text-sm'>
      <h2 className='text-lg font-bold'>Simulador WS — Matching Protocol</h2>

      {/* Conexión */}
      <div className={sectionStyle}>
        <div className={labelStyle}>Conexión</div>
        <div className='flex items-center gap-2'>
          <input
            className='border px-2 py-1 rounded flex-1 font-mono text-xs'
            placeholder='bookingId'
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
          />
          <button className={btnStyle} onClick={onSubscribe}>Subscribe</button>
        </div>
        <div className='flex items-center gap-2'>
          <input
            className='border px-2 py-1 rounded w-24 font-mono text-xs'
            placeholder='matchId'
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
          />
          <span className={labelStyle}>matchId (auto desde proposal)</span>
        </div>
        <div className='flex items-center gap-2'>
          <input
            className='border px-2 py-1 rounded w-28 font-mono text-xs'
            type='number'
            step='0.0001'
            value={coords.latitude}
            onChange={(e) => setCoords(c => ({ ...c, latitude: +e.target.value }))}
          />
          <input
            className='border px-2 py-1 rounded w-28 font-mono text-xs'
            type='number'
            step='0.0001'
            value={coords.longitude}
            onChange={(e) => setCoords(c => ({ ...c, longitude: +e.target.value }))}
          />
          <span className={labelStyle}>coords (lat, lng)</span>
        </div>
      </div>

      {/* Cliente -> Servidor */}
      <div className={sectionStyle}>
        <div className={labelStyle}>Cliente {"→"} Servidor</div>

        <div className='flex flex-wrap gap-2'>
          <button className={btnStyle} onClick={onCarLeaving}>
            car-leaving (Usuario A)
          </button>
          <button className={btnStyle} onClick={onSpotSearching}>
            spot-searching (Usuario B)
          </button>
        </div>

        <div className='flex flex-wrap gap-2'>
          <button className={btnGreen} onClick={onMatchAccept}>
            match:accept
          </button>
          <button className={btnDanger} onClick={onMatchReject}>
            match:reject
          </button>
        </div>

        <div className='flex flex-wrap gap-2'>
          <button className={btnYellow} onClick={onLocationUpdate}>
            location:update (Usuario B GPS)
          </button>
          <button className={btnGreen} onClick={onMatchArrived}>
            match:arrived (Usuario B llega)
          </button>
        </div>
      </div>

      {/* Simular Servidor -> Cliente */}
      <div className={sectionStyle}>
        <div className={labelStyle}>Simular Servidor {"→"} Cliente</div>

        <div className='flex flex-wrap gap-2'>
          <button className={btnYellow} onClick={onSimulateProposal}>
            match:proposal
          </button>
          <button className={btnGreen} onClick={onSimulateConfirmed}>
            match:confirmed
          </button>
          <button className={btnDanger} onClick={onSimulateCancelled}>
            match:cancelled
          </button>
        </div>

        <div className='flex flex-wrap gap-2'>
          <button className={btnYellow} onClick={onSimulateLocationPeer}>
            location:peer
          </button>
          <button className={btnGreen} onClick={onSimulateComplete}>
            match:complete
          </button>
        </div>
      </div>

      {/* Mensaje libre */}
      <div className={sectionStyle}>
        <div className={labelStyle}>Mensaje libre</div>
        <div className='flex gap-2'>
          <input
            className='border px-2 py-1 rounded flex-1 text-xs'
            placeholder='texto...'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className={btnStyle} onClick={onMessage}>Enviar</button>
        </div>
      </div>

      {/* Último mensaje recibido */}
      <div className={sectionStyle}>
        <div className={labelStyle}>Último mensaje recibido</div>
        <pre className='text-xs font-mono p-2 rounded overflow-auto max-h-24'>
          {JSON.stringify(lastMessage, null, 2)}
        </pre>
      </div>      


      {/* Logs */}
      <div className={sectionStyle}>
        <div className='flex justify-between items-center'>
          <div className={labelStyle}>Logs</div>
          <button className='text-xs text-gray-400 hover:text-gray-600' onClick={() => setLogs([])}>Limpiar</button>
        </div>
        <textarea
          className='w-full text-xs h-48 font-mono bg-gray-50 p-2 rounded'
          rows={15}
          readOnly
          value={logs.join('\n\n')}
        />
      </div>     
      

      {/* Referencia del protocolo */}
      <div className={sectionStyle}>
        <div className={labelStyle}>Fases del match</div>
        <div className='font-mono text-xs text-gray-600'>
          IDLE {"→"} SEARCHING {"→"} PROPOSED {"→"} CONFIRMED {"→"} TRACKING {"→"} COMPLETE
        </div>
        <div className={labelStyle + ' mt-2'}>Flujo típico</div>
        <ol className='text-xs text-gray-600 list-decimal ml-4 space-y-0.5'>
          <li>Subscribe al canal (bookingId)</li>
          <li>Usuario A: car-leaving / Usuario B: spot-searching</li>
          <li>Servidor empareja {"→"} match:proposal a ambos</li>
          <li>Ambos: match:accept (o uno rechaza {"→"} match:cancelled)</li>
          <li>Servidor: match:confirmed {"→"} fase TRACKING</li>
          <li>Usuario B envía location:update cada 5-10s</li>
          <li>Servidor retransmite como location:peer a Usuario A</li>
          <li>Usuario B llega (dist {"<"} 50m) {"→"} match:arrived</li>
          <li>Servidor: match:complete con summary</li>
        </ol>
      </div>




    </div>
  );
};

export default SimulatorPage;
