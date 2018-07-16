var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Article = require('../models/article');
var User = require('../models/user')
//上传图片所需模块
var formidable = require('formidable'); 
var fs = require('fs')
var sd = require('silly-datetime')
var path = require('path')

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/travel');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});
//上传文章数据到article表以及user表
router.post("/upload", function (req,res,next) {
  var userId = req.session.user.userId;
  var goTime = req.body.articleGoTime;
  //测试前端传来的时间，会比后端间隔8个小时，原因在于后端使用的是格林尼治时间console.log(goTime)
  var destination = req.body.articleDestination;
  var description = req.body.articleDescription;
  //使用第三方模块silly-datetime
  var t = sd.format(new Date(),'YYYYMMDDHHmmss');
  //生成随机数
  var ran = parseInt(Math.random() * 8999 +10000);
  var id=t+ran;
  var param=new Article({
    articleId:id,
    articleOwnerId:userId,
    articleOwnerHeadImg:req.session.user.userHeadImg,
    articleOwnerName:req.session.user.userNickName,
    articleOwnerSchool:req.session.user.userSchool,
    articleTitle:req.body.articleTitle,
    articleDestination:destination,
    articleAveragePrice:req.body.articleAveragePrice,
    articleOwnerSex:req.session.user.userSex,
    articleDescription:description,
    articleGoTime:goTime,
    articleGoDay:req.body.articleGoDay,
    articlePublishTime:req.body.articlePublishTime,
    articleImg:req.body.articleImg
  })
  param.save((err1)=>{
    if (err1) {
      res.json({
        status:"1",
        msg:err1.message
      })
    }else{
      res.json({
        status:"0",
        msg:'suc'
      })
    }
  })
//把发布的文章数据加到user表里
  User.update({"userId":userId},{
    $push:{
      publishArticle:{
        articleId:id,
        articleGoTime:goTime,
        articleDescription:description,
        articleDestination:destination
      }
    }
},(err2,doc2)=>{
    if(err2)throw err2;
  })

})
//上传文章图片
router.post("/articleImg",function(req,res,next){
  var form = new formidable.IncomingForm();
  form.uploadDir = './articleImg/temp'; //上传临时文件夹
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
    fs.renameSync(files.file.path, 'articleImg/'+t+ran+extname,(err)=>{
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
//获取文章列表
router.post("/articleList",function(req,res,next){
  var page = req.body.page;
  var pageSize = req.body.pageSize;
  var skip = (page-1)*pageSize;
  var destination = req.body.destination;
  var goTime = req.body.goTime;
  var searchTime;//查询条件变量
  var sex = req.body.sex;
  var date = new Date();

  //查询条件
  if(goTime=="最近1月")searchTime={$gte:date.setMonth(date.getMonth()),$lte:date.setMonth(date.getMonth()+1)}
  if(goTime=="1-3月内")searchTime={$gte:date.setMonth(date.getMonth()+1),$lte:date.setMonth(date.getMonth()+2)}
  if(goTime=="3月以上")searchTime={$gte:date.setMonth(date.getMonth()+3)}

  var param={
    'articleDestination':destination,
    'articleGoTime':searchTime,
    'articleOwnerSex':sex
  };

  if(destination=='')delete param.articleDestination
  if(goTime=='')delete param.articleGoTime
  if(sex=='')delete param.articleOwnerSex

  

  Article.find(param).skip(skip).limit(pageSize).sort({'_id':-1}).exec((err,doc)=>{
    if(err){
      res.json({
          status:"1",
          msg:err.message
        })
    }else{
      res.json({
          status:"0",
          msg:doc
        })
    }
  })

})
//获取文章详情信息
router.post("/details",function(req,res,next){
  var articleId = req.body.articleId;
  Article.findOne({'articleId':articleId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }
    res.json({
      status:'0',
      msg:doc
    })
  })
})
//发布评论
router.post("/comment",function(req,res,next){
  var articleId = req.body.articleId,
      commentToWhom = req.body.commentToWhom,
      commentContent = req.body.remark,
      userNickName = req.session.user.userNickName;
  Article.update({'articleId':articleId},{
    $push:{
      'articleComment':{
        commentOwnerHeadImg:req.session.user.userHeadImg,
        commentContent,
        commentOwnerName:userNickName,
        commentOwnerSchool:req.session.user.userSchool,
        commentToWhom,
        commentPublishTime:req.body.date,
      }
    }
  }).then(()=>{
    if(commentToWhom==''){  //回复文章作者，写入作者表的文章评论项
      User.update({'userId':req.body.articleOwnerId,'publishArticle.articleId':articleId},{
        $push:{
          'publishArticle.$.comment':{
            from:userNickName,    
            articleId,
            commentContent
          }
        }
      },(err1,doc1)=>{
        if(err1){
          res.json({
            status:'1',
            msg:err1.message
          })
        }
        res.json({
          status:'2',
          msg:'成功写入作者评论表'
        })
      })
      
    }else{  //回复回复者，写入回复者表的toMeReply项
      User.update({'userNickName':commentToWhom},{
        $push:{
          toMeReply:{
            from:userNickName,
            replyContent: commentContent,
            articleId
          }
        }
      },(err2,doc2)=>{
        if(err2){
          res.json({
            status:'1',
            msg:err2.message
          })
        }
        res.json({
          status:'3',
          msg:'成功写入回复者回复表'
        })
      })
    }
 
  }).catch((err)=>{
    res.json({
      status:'1',
      msg:err.message
    })
  })
})
//删除自己发布的文章
router.post("/deletePublish",function(req,res,next){
  var userId = req.session.user.userId;
  var articleId = req.body.articleId;
  User.update({'userId':userId},{
    $pull:{
      'publishArticle':{
        'articleId':articleId
      }
    }
  }).then(()=>{
      Article.remove({'articleId':articleId},(err,doc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message
        })
      }
      res.json({
        status:'0',
        msg:'删除成功！'
      })
    })
  }).catch((err1)=>{
    res.json({
          status:'2',
          msg:err1.message
        })
  })
  
})
//删除收藏的文章
router.post("/deleteCollect",function(req,res,next){
  var userId = req.session.user.userId;
  var articleId = req.body.articleId;
  User.update({'userId':userId},{
    $pull:{
      'collectArticle':{
        'articleId':articleId
      }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }
    res.json({
      status:'0',
      msg:'删除成功！'
    })
  })
})
//返回评论列表
router.post("/getComments",function(req,res,next){
  var articleId = req.body.articleId;
  Article.findOne({'articleId':articleId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }
    res.json({
      status:'0',
      msg:doc.articleComment
    })
  })
})
module.exports = router;
