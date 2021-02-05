const createError = require('http-errors');
const express = require('express');
const nodemailer = require("nodemailer");
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/', function (req, res, next) {
  const { smtp, message } = req.body
  console.log(smtp, message)

  try {
    nodemailer.createTransport(smtp)
    .sendMail(message, (e, result) => {
      console.log(e)
      if (e) return next(e);
      res.json(result)
    });
  } catch (e) {
    next(e)
  }
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
