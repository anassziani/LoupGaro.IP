const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// قائمة اللاعبين والبطاقات التي حصلوا عليها
let players = {};

// قائمة البطاقات المتاحة
const cardNames = [
    "ذئب",
    "قروي",
    "المبصر",
    "الساحرة",
    "الصياد",
    "اللص"
];

// إرسال البطاقة المحددة لكل لاعب
function sendCardToPlayers() {
    Object.values(wss.clients).forEach(client => {
        const randomIndex = Math.floor(Math.random() * cardNames.length);
        const cardName = cardNames[randomIndex];
        players[client] = cardName;
        client.send(cardName);
    });
}

wss.on('connection', function connection(ws) {
    // إرسال البطاقة للاعب الجديد
    const randomIndex = Math.floor(Math.random() * cardNames.length);
    const cardName = cardNames[randomIndex];
    players[ws] = cardName;
    ws.send(cardName);

    // عند توصيل جميع اللاعبين
    if (Object.keys(players).length === 2) {
        sendCardToPlayers();
    }

    // عند استلام رسالة من أي لاعب
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
});
