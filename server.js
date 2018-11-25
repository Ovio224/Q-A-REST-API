'use strict';

const express = require('express');
const app = express();
const jsonParser = require('body-parser').json;
const logger = require('morgan');

const routes = require('./routes');

app.use(jsonParser());
app.use(logger("dev"));
app.use('/questions', routes);



var port = process.env.port || 3000;

app.listen(port, () => {
  console.log('The server is listening on localhost:3000')
});