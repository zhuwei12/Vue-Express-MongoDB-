var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userId":Number,
  "userName":String,
  "userSex":String,
  "userPwd":String,
  "userNickName":String,
  "userSchool":String,
  "userHeadImg":String,
  "publishArticle":[
      {
        "articleId":String,
        "articleGoTime":String,
        "articleDestination":String,
        "articleDescription":String,
        /*自己文章的评论*/
        "comment":[
            {
                "time":Date,
                "from":String,
                "articleId":String,
                "commentContent":String
            }
        ]
      }
  ],
  "collectArticle":[
      {
        "articleId":String,
        "articleGoTime":String,
        "articleDestination":String,
        "articleDescription":String,
        "articleCommentNumber":String
      }
  ],
  /*我的私信*/
  "message":[
      {
        "with":String,//nickName
        "myMessageContent":[  //我发送的多条私信
                {
                    "name":String,
                    "sendTime":Date,//根据时间排列渲染
                    "content":String
                }
            ],    
        "hisMessageContent":[  //对方发送的多条私信
                {
                    "name":String,
                    "sendTime":Date,
                    "content":String
                }
            ]
      }
  ],
  /*文章里给我的回复*/
  "toMeReply":[
      {
        "time":Date,
        "from":String,
        "replyContent":String,
        "articleId":String
      }
  ]
});

module.exports = mongoose.model("User",userSchema);
