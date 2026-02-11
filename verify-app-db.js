const { sequelize } = require('./models');

async function verifyConnection() {
    try {
        console.log('Testing connection to:', sequelize.config.host);
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');

        // Also try to query generic table to ensure read access
        const [results, metadata] = await sequelize.query("SELECT 1+1 AS result");
        console.log('✅ Query executed successfully:', results);

    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

verifyConnection();
