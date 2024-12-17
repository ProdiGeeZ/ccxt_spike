const bidPriceField = document.querySelector('#bid-price');
const askPriceField = document.querySelector('#ask-price');
const lastPriceField = document.querySelector('#last-price');


const socket = new WebSocket('wss://stream.binance.com:9443/ws/enausdt@ticker');

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    
    
    bidPriceField.textContent = formatter.format(data.b); 
    askPriceField.textContent = formatter.format(data.a); 
    lastPriceField.textContent = formatter.format(data.v);
});


socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
    bidPriceField.textContent = 'Error streaming data!';
    askPriceField.textContent = 'Error streaming data!';
    lastPriceField.textContent = 'Error streaming data!';
});