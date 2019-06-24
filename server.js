const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const PORT = 5000;
const api_routes = require('./routes/api_routes');
const MongoClient = require('mongodb').MongoClient;
const db_url = 'mongodb://localhost:27017';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// setup Express to handle form data and attach it to the req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

MongoClient.connect(db_url,
  { useNewUrlParser: true },
  function (err, client) {
    if (err) throw err;

    console.log("Connected successfully to server");

    const db = client.db('scrapeApp');
    const collection = db.collection('favorites');

    api_routes(app, collection);

    app.listen(PORT, () => console.log('Listening on port %s', PORT));
  });

// Step 2 - calling the function and passing an argument



