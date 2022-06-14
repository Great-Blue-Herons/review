const { Pool } = require('pg');


const pool = new Pool({
  host: process.env.DB_HOST || '54.166.185.105',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'ubuntu',
  password: process.env.DB_PASSWORD || 'Moo2cow#',
  database: process.env.DB_NAME || 'sdcreviews'
});

pool.on('error', (err, client) => {
  console.log(err);
  process.exit(-1)
})



module.exports = pool;