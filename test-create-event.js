// Native fetch is available in Node 18+
// Node 18+ has built-in fetch. Let's assume it. If not, we use http.

const http = require('http');

const data = JSON.stringify({
    eve_nombre: "Evento de Prueba Automatica",
    eve_costo: 100.50,
    sal_id: 1 // Assuming a sala exists, or null if allowed. Schema said sal_id is Int, allow null? 
    // Model definition in test-db-connection said allowNull: true.
});

// We need to use query parameters for the POST request as per controller logic:
// const { sal_id, eve_nombre, eve_costo } = req.query;
// Wait! The controller uses req.query for POST? That's unusual.
// Controller:
// const createEvento = async (req, res) => {
//   const { sal_id, eve_nombre, eve_costo } = req.query;
// ...
// This confirms it uses req.query.

const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/evento?eve_nombre=${encodeURIComponent("Evento Prueba")}&eve_costo=50&sal_id=1`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': 0 // Body is empty because data is in query
    }
};

const req = http.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();
