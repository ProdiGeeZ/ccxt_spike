const updateButton = document.querySelector('#get-ticker-button') as HTMLButtonElement;
const priceField = document.querySelector('#price') as HTMLElement;
const askPriceField = document.querySelector('#ask-price') as HTMLElement;
const volumeField = document.querySelector('#volume') as HTMLElement;

async function fetchTicker() {
	try {
		const response = await fetch('http://localhost:3000/api/ticker?symbol=BTC/USDT');
		const data = await response.json();
		console.log(data);

		priceField.textContent = `$${parseFloat(data.bid).toFixed(2)}`;
		askPriceField.textContent = `$${parseFloat(data.ask).toFixed(2)}`;
		volumeField.textContent = `$${parseFloat(data.last).toFixed(2)}`;
	} catch (error) {
		console.error('Error fetching ticker data:', error);
		priceField.textContent = 'Error fetching price!';
		askPriceField.textContent = 'Error fetching price!';
		volumeField.textContent = 'Error fetching price!';
	}
}

updateButton.addEventListener('click', (e) => {
	e.preventDefault();
	priceField.textContent = 'Fetching...';
	askPriceField.textContent = 'Fetching...';
	volumeField.textContent = 'Fetching...';
	fetchTicker();
});
