//Require the modules for the server to function correct
const express = require('express');
const bodyParser = require('body-parser');
const assert = require('assert');
const mongodb = require('mongodb').MongoClient;
var path = require('path');

//const compiledFunction = pug.compileFile('index.pug');

//Server port in localhost
const port = 3000;

//Express is initiated
let app = express();


app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({extended: true})); //Encode special chars
app.use(express.static(__dirname)); //Render the local HTML pages.

//If user inputs http://localhost:3000 redirect him to index.html


app.get('/', function (request, response) {
  var resultsArr = [];
  mongodb.connect('mongodb+srv://MariosKonidaris:TulSkreyl34kvGUz@cluster0-jwitk.mongodb.net/test?retryWrites=true&w=majority', function (err, client) {
    assert.equal(null, err);
    var db = client.db('cvDatabase');
    var cursor = db.collection('CV').find();
    cursor.forEach(function (doc, err) {
      assert.equal(null, err);
      resultsArr.push(doc);
      //console.log(doc);
    }, function() {
     return response.render('index', {message : resultsArr});
    });
  });
});

//If user inputs http://localhost:3000/form.html take him there
app.get('/form.html', function (request, response) {
  return response.render('form.pug');
});

//When user clicks the submit button fecth the data from
//the form and insert the in the database.
app.post('/submit', function (request, response) {
  mongodb.connect('mongodb+srv://MariosKonidaris:TulSkreyl34kvGUz@cluster0-jwitk.mongodb.net/test?retryWrites=true&w=majority', function (err, client) {
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
  response.render('submitResults.pug');
});

//Start the server and listen for requests
app.listen(port, () => console.log(`App listening on port ${port}!`));
