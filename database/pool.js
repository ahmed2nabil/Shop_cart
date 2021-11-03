const { Pool } = require('pg');
require('dotenv').config();

const db_config = {
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 300,
    idleTimeoutMillis: 200,
    max: 20
}
const pool = new Pool({db_config});

pool.on('connect', client => {
    console.log('database is connected!')
  });

pool.on('remove', client => {
console.log('database connection is removed!')
})
module.exports = pool;