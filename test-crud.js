
const http = require('http');

const makeRequest = (path, method = 'GET', body = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data); // In case it's not JSON
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

async function testEndpoints() {
    console.log("--- Testing Salas ---");
    // 1. Create
    console.log("Creating Sala...");
    const newSala = await makeRequest('/sala', 'POST', {
        sal_nombre: "Sala de Pruebas",
        sal_descripcion: "Creada via script",
        sal_estado: true
    });
    console.log("Created:", newSala);

    // 2. List
    console.log("Listing Salas...");
    const salas = await makeRequest('/salas');
    console.log("Salas count:", salas.length);

    console.log("\n--- Testing Participantes ---");
    // 3. Create
    console.log("Creating Participante...");
    const newPart = await makeRequest('/participante', 'POST', {
        par_cedula: "999999",
        par_nombre: "Juan Pruebas",
        par_correo: "juan@test.com"
    });
    console.log("Created:", newPart);

    // 4. List
    console.log("Listing Participantes...");
    const parts = await makeRequest('/participantes');
    console.log("Participantes count:", parts.length);
}

testEndpoints();
