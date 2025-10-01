import { useState, useEffect } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import StockChart from '../components/StockChart';

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchStocks();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe('stock-channel');
    channel.bind('stock-event', (data) => {
      fetchStocks();
    });

    return () => {
      pusher.unsubscribe('stock-channel');
    };
  }, []);

  const fetchStocks = async () => {
    const res = await axios.get('/api/stocks');
    setStocks(res.data);
  };

  const addStock = async () => {
    await axios.post('/api/stocks', { symbol: input.toUpperCase() });
    setInput('');
  };

  const removeStock = async (symbol) => {
    await axios.delete('/api/stocks', { data: { symbol } });
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold'>Stock Market App</h1>
      <div className='mt-4 flex gap-2'>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter stock symbol (AAPL, TSLA...)'
          className='border p-2'
        />
        <button onClick={addStock} className='bg-blue-500 text-white px-4 py-2'>
          Add
        </button>
      </div>

      <div className='mt-6'>
        <StockChart stocks={stocks} />
      </div>

      <div className='mt-6'>
        {stocks.map((s) => (
          <div key={s.symbol} className='flex justify-between items-center'>
            <span>{s.symbol}</span>
            <button
              onClick={() => removeStock(s.symbol)}
              className='text-red-500'
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
