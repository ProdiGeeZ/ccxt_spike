const changePriceButton = document.querySelector('#change-ticker');
const assetName = document.querySelector('#pair');

const bidPriceField = document.querySelector('#bid-price');
const bidPriceChangeField = document.querySelector('#bid-price-change');

const askPriceField = document.querySelector('#ask-price');
const askPriceChangeField = document.querySelector('#ask-price-change');

const volumeBaseField = document.querySelector('#volume-base');
const baseVolumeChangeField = document.querySelector('#volume-change');

const quoteVolumeField = document.querySelector('#quote-volume');
const quoteVolumeChangeField = document.querySelector('#quote-volume-change');

const searchInput = document.querySelector('#search');
const tickerArray = [
    'btcusdt', 'ethusdt', 'bnbusdt', 'solusdt', 'xrpusdt',
    'dogeusdt', 'adausdt', 'maticusdt', 'shibusdt', 'ltcusdt'
];

function updateChangeField(element, value) {
    const isPositive = value > 0;
    const isNegative = value < 0;

    const formattedValue = `${isPositive ? '+' : ''}${formatter.format(value)}`;
    element.textContent = formattedValue;

    element.classList.remove('text-green-600', 'text-red-600', 'text-gray-500');
    element.classList.add(isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500');
}


const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

let index = 0;
let socket;
let fallbackTicker = tickerArray[0];


let previousBid = 0;
let previousAsk = 0;

let previousVolBase = 0;
let previousVolQuote = 0;

function connectWebSocket(ticker, isSearch = false) {
    const wsAddress = `wss://stream.binance.com:9443/ws/${ticker}@ticker`;

    if (socket) {
        socket.close();
        console.log(`Closed previous WebSocket for ${ticker}`);
    }

    socket = new WebSocket(wsAddress);
    let validResponseReceived = false;

    socket.addEventListener('open', () => {
        console.log(`Connected to WebSocket for ${ticker}`);
        resetVisualError();
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        console.log(data);

        if (!data.b || !data.a || !data.v || !data.q || !data.s) {
            console.error(`Invalid response for ${ticker}`);
            if (isSearch && !validResponseReceived) handleInvalidInput();
            return;
        }

        assetName.textContent = (ticker.toUpperCase()).replace(/USDT$/, '/USDT');

        validResponseReceived = true;
        console.log(`Valid ticker: ${ticker}`, data);

        const currentBid = parseFloat(data.b);
        const currentAsk = parseFloat(data.a);

        const currentVolBase = parseFloat(data.v);
        const currentVolQuote = parseFloat(data.q);

        bidPriceField.textContent = formatter.format(currentBid);
        updateChangeField(bidPriceChangeField, currentBid - previousBid);
        previousBid = currentBid;

        askPriceField.textContent = formatter.format(currentAsk);
        updateChangeField(askPriceChangeField, currentAsk - previousAsk);
        previousAsk = currentAsk;

        volumeBaseField.textContent = formatter.format(currentVolBase);
        updateChangeField(baseVolumeChangeField, currentVolBase - previousVolBase);
        previousVolBase = currentVolBase;

        quoteVolumeField.textContent = formatter.format(currentVolQuote);
        updateChangeField(quoteVolumeChangeField, currentVolQuote - previousVolQuote);
        previousVolQuote = currentVolQuote;

    });

    socket.addEventListener('error', () => {
        console.error(`WebSocket error for ${ticker}`);
        if (isSearch && !validResponseReceived) handleInvalidInput();
    });

    socket.addEventListener('close', () => {
        if (!validResponseReceived && isSearch) {
            console.warn(`No valid data for ${ticker}. Falling back.`);
            handleInvalidInput();
        }
    });
}

function handleInvalidInput() {
    console.warn('Ticker not found. Falling back to default.');
    searchInput.classList.add('outline', 'outline-2', 'outline-red-600', 'bg-red-100');
    searchInput.placeholder = 'Invalid Ticker!';
    searchInput.value = '';
    connectWebSocket(fallbackTicker);
}

function resetVisualError() {
    searchInput.classList.remove('outline', 'outline-2', 'outline-red-600', 'bg-red-100');
    searchInput.placeholder = 'BTC/USDT';
}

connectWebSocket(fallbackTicker);

searchInput.addEventListener('input', (_) => {
    searchInput.value = searchInput.value.toUpperCase();
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const newTicker = searchInput.value.trim().toLowerCase().replace('/', '');
        console.log(`Searching for: ${newTicker}`);
        if (newTicker) {
            connectWebSocket(newTicker, true);
        }
    }
});

changePriceButton.addEventListener('click', () => {
    index = (index + 1) % tickerArray.length;
    const newTicker = tickerArray[index];
    console.log(`Switching to: ${newTicker}`);
    previousBid = 0;
    previousAsk = 0;
    connectWebSocket(newTicker);
});
