const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const app = express();

app.use(express.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(morgan('dev'));

const productRouter = require('./products/routes.js');
app.use('/db', productRouter);

const qaRouter = require('./questions-answers/routes.js');
app.use('/qa', qaRouter);

const reviewsRouter = require('./reviews/routes.js');
app.use('/', reviewsRouter);

// this is my loader.io authentication (charles)
app.get('/loaderio-9d1abb859f618dc47e030676fcb4c41f.txt', function (req, res) {
  res.send('loaderio-9d1abb859f618dc47e030676fcb4c41f');
})

  
app.get('/helloworld', function (req, res) {
  res.send('Hello world');
})


module.exports = app;
