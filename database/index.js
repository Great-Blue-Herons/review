const { Pool } = require('pg');


const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'myPassword',
  database: process.env.DB_NAME || 'sdcreviews'
});

pool.on('error', (err, client) => {
  console.log(err);
  process.exit(-1)
})



module.exports = pool;