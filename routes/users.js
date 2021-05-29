var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const { json } = require('body-parser');

let totalScore = 0;
let bestName = '';
let bestLname = '';
let bestScore = 0;
var bestUser = {
  fname: bestName,
  lname: bestLname,
  score: bestScore,
  totalScore: 0
};
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

  if (req.body.score > totalScore) {
    bestName = req.body.fname;
    bestLname = req.body.lname;
    bestScore = req.body.score;
    totalScore = req.body.score;
  }
  bestUser = {
    fname: bestName,
    lname: bestLname,
    score: bestScore,
    totalScore: totalScore
  };
  console.log(bestUser);
  res.send(bestUser);
  res.end("yes");
});

module.exports = router;
