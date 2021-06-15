'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';


// PostgreSQL
const Pool = require('pg').Pool
const config = {
  user: 'example',
  host: 'db',
  database: 'mydb',
  password: 'example',
  port: 5432,
  connectionTimeoutMillis: 10000
}

 const seedDb = () => {
  let pool = new Pool(config)
  pool.query("CREATE TABLE IF NOT EXISTS students(id SERIAL PRIMARY KEY, firstname TEXT, lastname TEXT, age INT NOT NULL, address VARCHAR(255), email VARCHAR(50));",
    (err, res )=> {
      if(!err) {
        pool.query("INSERT INTO students(firstname, lastname, age, address, email)VALUES('John', 'Smith', 20, '123 Place St', 'smith@email.com')"),
        (err, res) => {
          pool.end();
        }
      } else {
        pool.end();
      }
    }
  );
}

// Put something into the db
seedDb();

// App
const app = express();
app.get('/api/a', (req, res) => {
  
  let pool = new Pool(config)
  pool.query('SELECT * FROM students FETCH FIRST ROW ONLY',
  (err, qRes) =>
  {
    if(!err){
      res.json(qRes.rows[0]);
      pool.end();
    }
    else {
      res.json({error: true})
    }
  })
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

