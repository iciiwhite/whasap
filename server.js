const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    // Convert QR string to Image Data for the website
    QRCode.toDataURL(qr, (err, url) => {
        io.emit('qr', url);
    });
});

client.on('ready', () => {
    io.emit('ready', 'WhatsApp is ready!');
    console.log('Client is ready!');
});

client.on('message', msg => {
    io.emit('message', { from: msg.from, body: msg.body });
});

io.on('connection', (socket) => {
    socket.on('send-message', (data) => {
        client.sendMessage(data.to, data.message);
    });
});

client.initialize();
server.listen(3000, () => console.log('Server running on port 3000'));