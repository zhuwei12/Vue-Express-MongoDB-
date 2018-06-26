var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var users = require('./routes/users');
var articles = require('./routes/articles');
var MongoStore = require('connect-mongo')(session)


var app = express();

// 使用 session 中间件
app.use(session({
  name: 'identityKey',
  secret :  'secret', // 对session id 相关的cookie 进行签名
  resave : false,
  store: new MongoStore({
      db: 'sessiondb',
      url: 'mongodb://127.0.0.1:27017/sessiondb' 
  }),//将session存储到数据库中，防止服务器挂了之后session信息找不到。默认session是内存存储（服务器端）  */
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie : {
      maxAge : 1000 * 60 * 60 *24  , // 设置 session 的有效时间24h，单位毫秒，到时间之后删除浏览器cookie以及服务器session
  },
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'headImg')));
app.use(express.static(path.join(__dirname, 'articleImg')));

//路由拦截
app.use(function (req,res,next) {
  if(req.session.user){
    next();
  }else{
      //定义可访问的接口
      if(req.originalUrl=='/users/headImg' ||req.originalUrl=='/users/checkUserName' ||req.originalUrl=='/users/checkNickName' || req.originalUrl=='/users/login' || req.originalUrl=='/users/checkLogin' ||req.originalUrl=='/users/logout' || req.originalUrl=='/users/register' || req.originalUrl=='/articles/articleList'|| req.originalUrl=='/articles/details'|| req.originalUrl=='/articles/getComments'){
          next();
      }else{
          res.json({
            status:'10001',
            msg:'当前未登录'
          });
      }
  }
});
//路由拦截要放在这两个路由引用前面才能生效
app.use('/users', users);
app.use('/articles', articles);

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
  res.render('error');
});

module.exports = app;
