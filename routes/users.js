var express = require('express');
var router = express.Router();
const fs = require('fs');
const bodyParser = require("body-parser");
const { json } = require('body-parser');

// let totalScore = 0;
// let bestName = '';
// let bestLname = '';
// let bestScore = 0;
var bestUser = require('../bestUser.json');
console.log(bestUser);

fs.readFile('one.txt', 'utf-8', (err, data) => {
  console.log(data);
});
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');

});

router.get('/cool', function (req, res, next) {
  res.send(bestUser);
});

router.post('/cool', function (req, res, next) {

  console.log(`Name: ${req.body.fname} LastName: ${req.body.lname} Score: ${req.body.score}`);
  // res.send(`<h1>Name: ${req.body.fname} <br> Last Name: ${req.body.lname} </h1>`);

  if (req.body.score > bestUser.totalScore) {
    bestUser = {
      fname: req.body.fname,
      lname: req.body.lname,
      score: req.body.score,
      totalScore: req.body.score
    };
    let data = JSON.stringify(bestUser);
    fs.writeFileSync('bestUser.json', data);
  };

  console.log(bestUser);
  res.send(bestUser);
  res.end("yes");
});

module.exports = router;
