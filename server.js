//var conString = 'postgres://postgres:admin@localhost:5432/test'
var conString = {
  host: 'localhost',
  port: 5432,
  database: 'test',
  user: 'postgres',
  password: 'admin',
  max: 10,
  idleTimeoutMillis: 30000
};

var pg = require('pg');
var pool = new pg.Pool(conString);
var express = require('express');
var app = express();

app.get('/users', function (req, res, next) {  
  //const user = req.body;

  var user = { name: 'nkm kjahsdf alksjdfh l', age: 30 };

  pool.connect(function (err, client, done) {
    if (err) {
      // pass the error to the express error handler
      return next(err);
    }
    client.query('INSERT INTO users (name, age) VALUES ($2, $1);', [user.name, user.age], function (err, result) {
      done(); //this done callback signals the pg driver that the connection can be closed or returned to the connection pool

      if (err) {
        // pass the error to the express error handler
        return next(err);
      }

      res.send(200);
    });
  });
});

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
})

app.listen(3000);
