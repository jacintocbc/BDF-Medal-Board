const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const app = express();
const port = 3000;
const wss = new WebSocket.Server({ port: 8080 });

// Serve static files from the 'public' folder
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to receive data from the desktop app
app.post('/update', (req, res) => {
    const data = req.body;
    console.log('Received new data');

    // Broadcast the data to all connected WebSocket clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });

    res.status(200).send('Data received');
});

app.listen(port, () => {
    console.log(`HTTP server is running on http://localhost:${port}`);
});

wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
