var express = require("express");
var router = express.Router();

var history = require("../models/history");

router.get("/year/:year", function (req, res, next) {
  console.log("history.js: get /year/:year");
  history
    .find({ year: req.params.year })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;