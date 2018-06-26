var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
  "articleId":String,
  "articleOwnerHeadImg":String,
  "articleTitle":String,
  "articleGoTime":Date,
  "articleGoDay":String,
  "articlePublishTime":String,
  "articleDestination":String,
  "articleAveragePrice":String,
  "articleOwnerId":String,
  "articleOwnerName":String,
  "articleOwnerSchool":String,
  "articleOwnerSex":String,
  "articleDescription":String,
  "articleImg":Array,
  "articleComment":[
      {
        "commentOwnerHeadImg":String,
        "commentContent":String,
        "commentOwnerName":String,
        "commentOwnerSchool":String,
        "commentToWhom":String,
        "commentPublishTime":String,
      }
  ],

});

module.exports = mongoose.model("Article",articleSchema);
