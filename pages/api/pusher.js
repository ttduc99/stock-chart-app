import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action, symbol } = req.body;
    await pusher.trigger('stock-channel', 'stock-event', { action, symbol });
    res.json({ status: 'ok' });
  }
}
