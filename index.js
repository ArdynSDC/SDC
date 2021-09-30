const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(morgan('dev'));

const productRouter = require('./products/routes');
app.use('/db', productRouter);

app.get('/helloworld', function (req, res) {
  // res.send('Hello World')
  res.sendStatus(200);
})

module.exports = app;