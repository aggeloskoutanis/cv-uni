//Require the modules for the server to function correct
const express = require('express');
const bodyParser = require('body-parser');
const assert = require('assert');
const mongodb = require('mongodb').MongoClient;

//Server port in localhost
const port = 3000;

//Express is initiated
const app = express();

app.use(bodyParser.urlencoded({extended: true})); //Encode special chars
app.use(express.static(__dirname)); //Render the local HTML pages.

//If user inputs http://localhost:3000 redirect him to index.html
app.get('/', function (request, response) {
  var resultsArr = [];
  mongodb.connect('mongodb://localhost:27017/cvDatabase', function (err, client) {
    assert.equal(null, err);
    var db = client.db('cvDatabase');
    var cursor = db.collection('CV').find();
    cursor.forEach(function (doc, err) {
      assert.equal(null, err);
      resultsArr.push(doc);
      console.log(doc);
    }, function() {
      db.close();
      response.render('index', {items: resultsArr});
    });
  });
  //return response.redirect('/index.html');
});

//If user inputs http://localhost:3000/form.html take him there
app.get('/form.html', function (request, response) {
  return response.render('form.html');
});

//When user clicks the submit button fecth the data from
//the form and insert the in the database.
app.post('/submit', function (request, response) {
  mongodb.connect('mongodb://localhost:27017/cvDatabase', function (err, client) {
    assert.equal(null, err);
    var db = client.db('cvDatabase');
    db.collection('CV').insertOne(request.body, function(err, result) {
      assert.equal(null, err);
      console.log('CV inserted to db.');
    });
  });

  //Sends a GET request to the server
  response.redirect('/success');
});

//Gets the GET request and displays the submitResults.html page
//(if success)
app.get('/success', function (request, response) {
  response.sendFile(__dirname + '/submitResults.html');
});

//Start the server and listen for requests
app.listen(port, () => console.log(`App listening on port ${port}!`));
