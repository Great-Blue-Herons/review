const { Pool } = require('pg');


const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'corynickerson',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sdcreviews'
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})



module.exports = pool;