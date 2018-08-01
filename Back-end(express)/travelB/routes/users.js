var express = require('express');
var router = express.Router();
var User = require('../models/user');
//上传图片所需模块
var formidable = require('formidable'); 
var fs = require('fs')
var sd = require('silly-datetime')
var path = require('path')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//上传头像
router.post("/headImg",function(req,res,next){
  var form = new formidable.IncomingForm();
  form.uploadDir = './headImg/temp'; //上传临时文件夹
  form.maxFieldsSize = 2 * 1024 * 1024;//最大上传大小2M
  form.parse(req,(err,fields,files)=>{  
    if(err){
      res.json({
        status:"1",
        msg:'upload err!'
      })
    }
    
    //console.log(files)
//成功后的回调
    //下面是将临时文件重命名并转移到headImg文件夹下

    //使用第三方模块silly-datetime
    var t = sd.format(new Date(),'YYYYMMDDHHmmss');
    //生成随机数
    var ran = parseInt(Math.random() * 8999 +10000);
    //拿到扩展名
    var extname = path.extname(files.file.name);
    fs.renameSync(files.file.path, 'headImg/'+t+ran+extname,(err)=>{
      if(err){
        res.json({
          status:"2",
          msg:'upload(change name) err!'
        })
        throw  Error("改名失败");
      }
    });  //重命名，将原本存进temp的乱码文件重命名转移到headImg文件夹下
    res.json({
        status:"0",
        msg:t+ran+extname  //返回给前端图片名，好让前端提交后端数据时将头像与用户绑定
      })
    
  })

});
//注册
router.post("/register",function(req,res,next){
  User.find({},(err,doc)=>{  //遍历数据库里的所有文档
    var param = new User({
      userHeadImg:req.body.userHeadImg,
      userId:20180000+doc.length,//以文档数组的长度作id，保证唯一性
      userName:req.body.userName,
      userSex:req.body.userSex,
      userPwd:req.body.userPwd,
      userSchool:req.body.userSchool,
      userNickName:req.body.userNickName
  });
  param.save((err)=>{
    if (err) {
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      res.json({
        status:"0",
        msg:'suc'
      })
    }
  })
  })
});
//验证用户名是否存在
router.post("/checkUserName",function(req,res,next){
  User.findOne({userName:req.body.userName},(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      if(doc){
      res.json({
        status:"2",
        msg:'用户名已存在'
        })
      }else{
        res.json({
        status:"0",
        msg:'可以继续'
        })
      }
    }
  })
});
//验证昵称是否存在
router.post("/checkNickName",function(req,res,next){
  User.findOne({userNickName:req.body.nickName},(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      if(doc){
      res.json({
        status:"2",
        msg:'昵称已存在'
        })
      }else{
        res.json({
        status:"0",
        msg:'可以继续'
        })
      }
    }
  })
});
//登录
router.post("/login",function(req,res,next){
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param,(err,doc)=>{
    if(err){
      res.json({
        status:"2",
        msg:err.message
      })
    }else{
      //存在用户信息
      if(doc){
        req.session.user = doc;//一句话即可建立session并将sessionid发送到浏览器端
        res.json({
          status:'0',
          msg:'suc',
          result:{
            nickName:doc.userNickName,
            userHeadImg:doc.userHeadImg
          }           //返回用户的昵称和头像
      });
      }else{ //不存在用户信息
        res.json({
          status:'1',
          msg:'账号密码错误',
          result:''
      });
      }
    }
  })
});
//检查登录状态
router.get("/checkLogin", (req,res,next)=> {
  //console.log(req.session.user)
  if(req.session.user){
      res.json({
        status:'0',
        msg:'',
        result:{
          userNickName:req.session.user.userNickName,
          userHeadImg:req.session.user.userHeadImg
        }
      });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});
//登出接口
router.post("/logout", (req,res,next) => {
  req.session.destroy();
  res.cookie('identityKey','',{
    maxAge:-1
  })
  res.json({
    status:"0",
    msg:'已登出',
  })
});
//收藏文章
router.post("/collect", (req,res,next) => {
  var userId = req.session.user.userId;
  var articleId = req.body.articleId;
  User.findOne({'userId':userId,'collectArticle.articleId':articleId},(err,doc)=>{
    if(err)throw err;
    if(doc){   //如果找到文章返回2，表示数据库中已经有这条数据
      res.json({
        status:'2',
        msg:'文章已收藏'
      })
    }else{   //如果没有这条数据，则插入
      User.update({'userId':userId},{
        $push:{
          'collectArticle':{
            articleId,
            articleGoTime:req.body.articleGoTime,
            articleDestination:req.body.articleDestination,
            articleDescription:req.body.articleDescription,
            articleCommentNumber:'--'
          }
        }
      },(err1,doc1)=>{
        if(err1){
          res.json({
            status:'1',
            msg:err1.message
          })
        }else{
          res.json({
            status:'0',
            msg:'收藏成功'
          })
        }
      })
    }
  })
  
})
//返回自己发布的文章
router.get("/getPublish", (req,res,next) => {
  var userId = req.session.user.userId;
  User.findOne({'userId':userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      res.json({
        status:'0',
        msg:doc.publishArticle
      })
    }
  })
})
//返回自己收藏的文章
router.get("/getCollect", (req,res,next) => {
  var userId = req.session.user.userId;
  User.findOne({'userId':userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      res.json({
        status:'0',
        msg:doc.collectArticle
      })
    }
  })
})
//私信功能
router.post("/message", (req,res,next) => {
  var errFlag = false;
  var userId = req.session.user.userId;
  var userNickName = req.session.user.userNickName;
  var sendTo = req.body.toWhom;
  var messageContent = req.body.messageContent;
  var messageSendTime = req.body.time;
  //自己无法发送私信给自己
  if(req.session.user.userNickName == sendTo){
    res.json({
      status:'2',
      msg:'自己不可以发送自己'
    })
  }else{
    //在我的视角下发送给对方，写入自己的对话表
    User.findOne({'userId':userId,'message.with':sendTo},(err,doc)=>{
      if(doc==null){//如果之前没有和这个用户进行过对话，则插入一条新会话
        User.update({'userId':userId},{
          $push:{
            'message':{
              with:sendTo,
              myMessageContent:{
                name:'我',
                sendTime:messageSendTime,
                content:messageContent
              }
            }
          }
        },(err,doc)=>{
          if(err)errFlag=true
          console.log('suc1')
        })
      }else{//如果已经有了和这个用户的会话，直接插入会话信息
        User.update({'userId':userId,'message.with':sendTo},{
          $push:{
            "message.$.myMessageContent":{
                name:'我',
                sendTime:messageSendTime,
                content:messageContent
            }
          }
        },(err,doc)=>{
          if(err)errFlag=true
          console.log("suc2")
        })
      }
    })
    //对方的视角下接收，写入对方的对话表
    User.findOne({'userNickName':sendTo,'message.with':userNickName},(err,doc)=>{
      if(doc==null){//如果之前没有和这个用户进行过对话，则插入一条新会话
        User.update({'userNickName':sendTo},{
          $push:{
            'message':{
              with:userNickName,
              hisMessageContent:{
                name:userNickName,
                sendTime:messageSendTime,
                content:messageContent
              }
            }
          }
        },(err,doc)=>{
          if(err)errFlag=true
          console.log("suc3")
        })
      }else{//如果已经有了和这个用户的会话，直接插入会话信息
        User.update({'userNickName':sendTo,'message.with':userNickName},{
          $push:{
            "message.$.hisMessageContent":{
                name:userNickName,
                sendTime:messageSendTime,
                content:messageContent
            }
          }
        },(err,doc)=>{
          if(err)errFlag=true
          console.log("suc4")
        })
      }
    })
    if(errFlag){
      res.json({
        status:'1',
        msg:'err'
      })
    }else{
      res.json({
        status:'0',
        msg:'suc'
      })
    }
  }
  
  
})
//获取与xxx的私信内容功能   返回按时间排列顺序的message内容
router.post("/getMessage", (req,res,next) => {
  User.findOne({'userId':req.session.user.userId,'message.with':req.body.withWhom},{'message.$':1},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      var linkArray = doc.message[0].myMessageContent.concat(doc.message[0].hisMessageContent)//把这个数组按sendTime时间进行排序重组返回前端
      var value;
      for(var i=0;i<linkArray.length;i++){
        for(var j=i+1;j<linkArray.length;j++){
            if(linkArray[i].sendTime<linkArray[j].sendTime){
              value=linkArray[j];
              linkArray[j]=linkArray[i];
              linkArray[i]=value;
            }
        }
      }
      res.json({
        status:'0',
        msg:linkArray
      })
    }
  })
})
//获取自己的私信会话列表
router.get("/getMessageDialog", (req,res,next) => {
  var userId = req.session.user.userId;
  User.findOne({'userId':userId},{'message':1},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:'err'
      })
    }else{
      var array=[];
      var linkArray=[];
      var value;
      //返回形如[{who:xxx,toWhom:xxx,message:xxx,time:xxx}]
      for(var i=0;i<doc.message.length;i++){
        linkArray = doc.message[i].myMessageContent.concat(doc.message[i].hisMessageContent)
        for(var k=0;k<linkArray.length;k++){
          for(var j=i+1;j<linkArray.length;j++){
              if(linkArray[k].sendTime<linkArray[j].sendTime){
                value=linkArray[j];
                linkArray[j]=linkArray[k];
                linkArray[k]=value;
              }
          }
        }
        if(linkArray[0].name=='我')
          array[i]={who:'我',toWhom:doc.message[i].with,message:linkArray[0].content,time:linkArray[0].sendTime}
        else
          array[i]={who:doc.message[i].with,toWhom:'我',message:linkArray[0].content,time:linkArray[0].sendTime}

      }
      //全部对话根据最新消息返回
      for(var i=0;i<array.length;i++){
        for(var j=i+1;j<array.length;j++){
          if(array[i].time<array[j].time){
            value=array[j];
            array[j]=array[i];
            array[i]=value;
          }
       }
      }
      res.json({
        status:'0',
        msg:array
      })
    }
   
  })
})
//获取评论人、回复者、私信者，按时间顺序写到头的消息提醒处
router.get("/getTips", (req,res,next) => {
  var userId = req.session.user.userId
  User.findOne({'userId':userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:'err'
      })
    }else{
      var publishReply=[];//[{date:xxx,from:xxx,articleId:xxx,verb:'评论了你的文章'}]
      var messageReply=[];//[{date:xxx,from:xxx,verb:'私信了你'}]
      var articleReply=[];//[{date:xxx,from:xxx,articleId:xxx,verb:'回复了你'}]
      for(var i = 0;i<doc.publishArticle.length;i++){
        for(var j=0;j<doc.publishArticle[i].comment.length;j++){
          if(doc.publishArticle[i].comment.length!=0){
            publishReply[j]={date:doc.publishArticle[i].comment[j].time,from:doc.publishArticle[i].comment[j].from,articleId:doc.publishArticle[i].comment[j].articleId,verb:'评论了你的文章'}
          }
        }
        
      }
      for(var i=0;i<doc.message.length;i++){
        if(doc.message[i].hisMessageContent.length!=0){
          for(var j=0;j<doc.message[i].hisMessageContent.length;j++)
            messageReply[j]={date:doc.message[i].hisMessageContent[j].sendTime,from:doc.message[i].with,verb:'私信了你'}
        }
      }
      for(var i=0;i<doc.toMeReply.length;i++){
        articleReply[i]={date:doc.toMeReply[i].time,from:doc.toMeReply[i].from,articleId:doc.toMeReply[i].articleId,verb:'回复了你'}
      }
      //将这几个数组合并起来并按时间进行排序
      var concatArray = publishReply.concat(messageReply).concat(articleReply)
      var a;//临时交换变量
      for(var i = 0;i<concatArray.length;i++){
        for(var j=i+1;j<concatArray.length;j++){
          if(concatArray[i].date<concatArray[j].date){
            a=concatArray[i];
            concatArray[i]=concatArray[j];
            concatArray[j]=a;
          }
        }
        
      }
      res.json({
        status:'0',
        concatArray
      })
    }
  })
})
module.exports = router;
