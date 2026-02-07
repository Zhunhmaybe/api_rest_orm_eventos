const { Sequelize } = require("sequelize");

const tests = [
    { db: "Eventos", user: "postgres", pass: "123" },
    { db: "postgres", user: "postgres", pass: "postgres" },
    { db: "postgres", user: "postgres", pass: "123" },
    { db: "api-rest-eventos", user: "postgres", pass: "123" },
    { db: "api-rest-eventos", user: "user", pass: "1234" },
];

(async () => {
    for (const { db, user, pass } of tests) {
        const seq = new Sequelize(db, user, pass, {
            host: "localhost",
            dialect: "postgres",
            logging: false,
        });

        try {
            await seq.authenticate();
            console.log(`OK: ${db} / ${user} / ${pass}`);
            await seq.close();
            break;
        } catch (e) {
            console.log(`FAIL: ${db} / ${user}`);
            await seq.close();
        }
    }
})();
