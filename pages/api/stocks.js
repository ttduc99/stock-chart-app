import axios from 'axios';

let stocks = []; // tạm lưu trong memory (nếu muốn lưu lâu dài thì dùng MongoDB Atlas)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.json(stocks);
  }

  if (req.method === 'POST') {
    const { symbol } = req.body;
    try {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}`;
      const response = await axios.get(url);

      if (!response.data['Time Series (Daily)']) {
        return res.status(400).json({ error: 'Invalid stock symbol' });
      }

      stocks.push({ symbol, data: response.data['Time Series (Daily)'] });

      // phát realtime event
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pusher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', symbol }),
      });

      res.json(stocks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const { symbol } = req.body;
    stocks = stocks.filter((s) => s.symbol !== symbol);

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pusher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remove', symbol }),
    });

    res.json(stocks);
  }
}
