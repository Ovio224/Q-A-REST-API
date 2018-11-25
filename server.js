'use strict';

const express = require('express');
const app = express();
const jsonParser = require('body-parser').json;
const logger = require('morgan');

const routes = require('./routes');

app.use(jsonParser());
app.use(logger("dev"));

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/qa", {
  useNewUrlParser: true
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error("connection error:" + err);
});

db.once('open', () => {
  console.log("Connection to the db was succesesful");
  // DB communication
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
  if(req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use('/questions', routes);

// catch 404 not found
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});



var port = process.env.port || 3000;

app.listen(port, () => {
  console.log('The server is listening on localhost:3000')
});