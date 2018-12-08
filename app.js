const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const bluebird = require('bluebird')
const passport = require('passport')

const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api.route')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// TODO: Remove this line in production environment
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(passport.initialize())

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
	next()
})

app.use('/', indexRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// wire up the db
mongoose.Promise = bluebird
mongoose.connect('mongodb://127.0.0.1:27017/rpglb', { useNewUrlParser: true })
	.then(() => { console.log('Successfully connected to MongoDB at mongodb://127.0.0.1:27017/rpglb')})
	.catch(() => { console.log('Error connecting to MongoDB at mongodb://127.0.0.1:27017/rpglb')})

module.exports = app
