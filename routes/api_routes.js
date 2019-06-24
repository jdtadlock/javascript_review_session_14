const cheerio = require('cheerio');
const axios = require('axios');


// https://finance.yahoo.com/most-active

// Step 1 is setting up the function which references future arguments
module.exports = function (app, db) {

  // db.find({}).toArray((err, stocks) => {
  //   console.log(stocks)
  // });


  app.get('/', (req, res) => {
    // Get the html from the Yahoo page
    axios.get('https://finance.yahoo.com/most-active')
      .then(response => {
        // Turn that html into a jQuery like DOM
        // What is res.data? HTML 
        const $ = cheerio.load(response.data);
        let stocks = [];
        // fin-scr-res-table
        // what type of selector is this?
        // Array of all of the table cells that have that aria-label
        $('#fin-scr-res-table table tr').each((index, row) => {
          // if all the table cells are in array, the index is just going to
          // represent those cell's index number
          const name = $(row).find('td[aria-label="Name"]').text();
          const price = $(row).find('td[aria-label="Price (Intraday)"] span').text();
          let stock = {};

          db.find({
            name: name
          }).toArray(function (err, results) {
            if (err) throw err;

            if (results.length) {
              stock.favorited = true;
            }
          });

          if (name && price) {
            stock.name = name;
            stock.price = price;
            stocks.push(stock);
          }
        });

        res.render('index', { stocks: stocks })

        // Search the DOM using jQuery like features to find all the stocks
      }).catch(err => console.log(err));
  });


  app.post('/api/favorites', (req, res) => {
    db.insertOne({
      name: req.body.name,
      price: req.body.price
    }, function (err, result) {
      if (err) return res.send('Error');

      res.send('Stock added successfully!');
    });
  });
}