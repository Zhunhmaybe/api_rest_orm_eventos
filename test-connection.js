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
  await testConnection("eventos", "postgres", "12345");

  // Test 2: Try with common default passwords
  await testConnection("eventos", "postgres", "postgres");
  await testConnection("eventos", "postgres", "12345");
  await testConnection("eventos", "postgres", "");

  // Test 3: Try with the database name from .env
  await testConnection("eventos", "postgres", "12345"); // From .env
};

runTests();
