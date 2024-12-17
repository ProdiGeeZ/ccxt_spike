import ccxt from 'ccxt';

export class CcxtService {
	async fetchTicker(symbol) {
		const exchange = new ccxt.binance();
		return await exchange.fetchTicker(symbol);
	}
}
