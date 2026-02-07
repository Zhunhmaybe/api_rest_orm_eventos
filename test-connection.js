const { Sequelize } = require("sequelize");

// Test with current credentials
const testConnection = async (dbName, user, password) => {
  const sequelize = new Sequelize(dbName, user, password, {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log(`✅ Connection successful with database: ${dbName}, user: ${user}`);
    return true;
  } catch (error) {
    console.log(`❌ Connection failed with database: ${dbName}, user: ${user}`);
    console.log(`   Error: ${error.message}`);
    return false;
  } finally {
    await sequelize.close();
  }
};

const runTests = async () => {
  console.log("Testing database connections...\n");
  
  // Test 1: Current config
  await testConnection("Eventos", "postgres", "123");
  
  // Test 2: Try with common default passwords
  await testConnection("postgres", "postgres", "postgres");
  await testConnection("postgres", "postgres", "123");
  await testConnection("postgres", "postgres", "");
  
  // Test 3: Try with the database name from .env
  await testConnection("api-rest-eventos", "postgres", "123");
  await testConnection("api-rest-eventos", "user", "1234");
};

runTests();
