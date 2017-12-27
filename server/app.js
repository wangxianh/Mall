var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var goods=require('./routes/goods');
var ejs=require('ejs');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);  //视图引擎转换为html
//app.set('view engine', 'jade');
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//登录拦截
app.use(function(req,res,next){
	if(req.cookies.userId){
		next();  //不进行拦截
	}else{

		if(req.originalUrl=='/user/login'||
			req.originalUrl=="/user/logout"||
			req.path=="/goods"){
			next();
		}else{
			res.json({
			"status":"1001",  //状态码，没有登录
			"msg":"当前未登录",
			"result":""
			});
		}
	}
	
});

app.use('/', index);
app.use('/user', users);
app.use('/goods',goods);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
