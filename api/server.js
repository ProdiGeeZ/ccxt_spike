import express from 'express';
import cors from 'cors';
import { CcxtService } from '../src/services/ccxt.js'; 

const app = express();
const port = 3000;

app.use(cors());

const ccxtService = new CcxtService();

app.get('/api/ticker', async (req, res) => {
	try {
		const symbol = req.query.symbol || 'BTC/USDT'; 
		const ticker = await ccxtService.fetchTicker(symbol);

		res.json({
			bid: ticker.bid,
			ask: ticker.ask,
			last: ticker.last,
		});
	} catch (error) {
		console.error('Error fetching ticker:', error);
		res.status(500).json({ error: 'Failed to fetch ticker data' });
	}
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
