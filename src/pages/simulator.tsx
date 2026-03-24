import { useEffect, useState } from 'react';
import { useWs } from '../ws-provider';
import { useParams } from 'react-router-dom';

const SimulatorPage: React.FC = () => {
  const { booking_id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [message, setMessage] = useState<Record<string, any>>({})
  const [bookingId, setBookingId] = useState(booking_id ?? '')
  const [logs, setLogs] = useState<string[]>([])
  const { send, subscribe } = useWs();

  useEffect(() => {
    const fromUrl = booking_id
    console.log('fromUrl', fromUrl)
    if (fromUrl) {
      send({ type: 'subscribe', channel: fromUrl });
    }
  }, [booking_id, send]);

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
    <div className='container text-sx scroll-auto w-full'>

      <div>
        <div className='flex items-center gap-2'>
          <button onClick={() => onSubscribeHandle(bookingId)}>Subscribe</button>
          <div>
            <input type="text" value={bookingId} onChange={(event) => setBookingId(event.target.value)}></input>
          </div>
        </div>

        <div className='flex flex-col gap-3 justify-between'>
          <div>
            <div className='pt-3'>[accept-match]</div>
            <button onClick={() => onAcceptMatchHandle(bookingId)}>Aceptar: que venga aparcar</button>
          </div>

          <div>          
            <div className='pt-3'>[accept-arrive]</div>
            <button onClick={() => onAcceptArriveHandle(bookingId)}>Aceptar: que ya lo veo</button>
          </div>

          <div>          
            <div className='pt-3'>[cancel-match]</div>
            <button onClick={() => onCancelMatchHandle(bookingId)}>Cancelar: que me canse de esperar</button>
          </div>
        </div>
      </div>

      <div >
        <h3>Logs</h3>
        <textarea
          className='w-full text-xs h-24 font-mono'
          rows={15}
          readOnly
          value={logs.join('\n')}
        />
      </div>

    </div>
  );
};

export default SimulatorPage;
