var express = require("express"),
pg = require("pg"),
cors = require("cors"),
app = express();
  

//Allowed cors in localhost
app.use(cors());

const queryAll = 'SELECT * FROM vocabulary ORDER BY id DESC OFFSET ($1*5)-5 LIMIT 5';

//Documentation for node-postgres: https://node-postgres.com/
const pool = new pg.Pool({
  host: 'localhost',
});

app.get("/api.json", (req, res, next) => {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Can not connect to the DB because of " + err);
    }
    const {page} = req.query;
    let combinedRows = [];

    client.query("SELECT COUNT(id) FROM vocabulary", (err, result) => {
      combinedRows = [
        result.rows[0],
      ]
    });

    client.query(queryAll, [page], (err, result) => {
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }

      res.status(200).send([
        ...combinedRows,
        ...result.rows,
      ]);
    });
  });
});

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post("/add", (req, res, next) => {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Can not connect to the DB because of " + err);
    }
    const {jp, en, page} = req.body;
    let combinedRows;

    client.query('INSERT INTO vocabulary(jp_word, en_word) VALUES($1, $2) RETURNING *', [jp, en],(err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
    });

    client.query("SELECT COUNT(id) FROM vocabulary", (err, result) => {
      combinedRows = [
        result.rows[0],
      ]
    });

    client.query(queryAll, [page], function(err, result) {
      done();
      res.status(200).send([
        ...combinedRows,
        ...result.rows,
      ]);
    });
  });
});

//Server
app.listen(8080, function() {
  console.log("API listening on http://localhost:8080/api.json");
});
