<template>
  <div>
    <!--导航头部-->
      <div class="fixed">
          <nav-header></nav-header> 
      </div>

    <!--主体-->
      <div class="main">
          <!--标题-->
          <el-row class="title">
              <el-col :span="24" :xs="24" class="word-center"><h1>{{articleDetails.articleTitle}} </h1></el-col>
          </el-row>
          <!--标题下的一些主要旅行信息-->
          <div class="bread">
              <br>
              <el-row>
                <el-col :span="10" class="word-right">出行时间：{{articleDetails.articleGoTime.split('T')[0]}}</el-col>
                <el-col :span="11" :offset="3">出行天数：{{articleDetails.articleGoDay}}</el-col>
              </el-row>
              
              <el-row>
                <el-col :span="10" class="word-right">目的地：{{articleDetails.articleDestination}}</el-col>
                <el-col :span="11" :offset="3">人均费用：{{articleDetails.articleAveragePrice}}</el-col>                
              </el-row>
          </div>
          <br>
          <!--主体内容部分-->
          <div class="content">
              <!--主体头像部分-->
              <el-row class="content-title">
                <el-col :sm={span:1,offset:4} :xs={span:4,offset:1}>
                    <!--<router-link to="/self?id=10000">--> <img class="head-img" :src="'http://collegetravel.cn/'+articleDetails.articleOwnerHeadImg"> <!--</router-link>-->
                </el-col>
                <el-col :span="12" :xs="18">
                    <el-row>
                      <el-col :span="24">{{articleDetails.articleOwnerName}}({{articleDetails.articleOwnerSchool}})</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="3" :xs="8">
                          <a class="grey-word" @click="messageTo=articleDetails.articleOwnerName,sendMessage()">私信Ta</a>
                      </el-col>
                      
                    </el-row>
                </el-col>
              </el-row>
              <br>
              <!--主体描述加图片部分-->
              <el-row>
                <el-row type="flex" justify="center">
                  <el-col :span="16" >{{articleDetails.articleDescription}}</el-col>
                </el-row>
                <br>
                <el-row type="flex" justify="center" v-for="(img,key) in articleDetails.articleImg" :key="key">
                  <el-col :span="16" >
                      <img v-lazy="'http://collegetravel.cn/'+img" class="user-img">               
                  </el-col>
                </el-row>
              </el-row>
          </div>
          <br>
          <el-row class="word-center">
            <el-col>
                <el-button type="warning" @click="collect">收藏这篇文章</el-button>
            </el-col>
          </el-row><br>
          <!--底部留言部分-->
          <div class="remark">
              <!--留言表单-->
             <el-row  type="flex" justify="center">
               <el-col :span="16"><h2>留言</h2></el-col>
             </el-row>
             <br>
             <el-row  type="flex" justify="center">
               <el-col :span="16">
                   <el-input v-model="remark" type="textarea" autosize=""></el-input>
               </el-col>
             </el-row>
             <br>
             <el-row  type="flex" justify="center">
               <el-col :span="16" class="word-right"><el-button type="primary" @click="submit">提交</el-button></el-col>
             </el-row>
             <br>
            <!--用户留言-->
            <div v-for="(comment,key) in articleComments" :key="key">
                <el-row class="user-remark-head">
                    <el-col :sm={span:1,offset:4} :xs={span:4,offset:1}>
                        <img :src="'http://collegetravel.cn/'+comment.commentOwnerHeadImg" class="head-img">
                    </el-col>
                    <el-col :span="15" :xs="18" class="user-comment-head">
                        <br>
                        <el-row>
                            <el-col :span="18">{{comment.commentOwnerName}}({{comment.commentOwnerSchool}})</el-col>
                            <el-col :span="6" class="word-right">
                                <a @click="replyTo=comment.commentOwnerName,reply()">回复</a>
                                <a @click="messageTo=comment.commentOwnerName,sendMessage()">私信</a>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5" :xs="18" class="time">
                                {{comment.commentPublishTime}}
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                   <el-col :span="16">{{comment.commentContent}}</el-col>
                </el-row>
                <br>
            </div>
          </div>
      </div>
      
    <side-bar></side-bar>
  </div>
</template>

<style scoped>
.main{
    padding-top: 7rem;
}
.head-img{
    cursor: pointer;
    width: 51px;
    height: 51px;
    border-radius: 50%
}
.user-img{
    width: 100%;
}
a:hover{
    color:rgb(240, 217, 16);
}
.grey-word{
    color: grey;
}
.user-comment-head{
    position: relative;
    top: -1rem
}
.time{
    font-size: .7rem;
}
</style>

<script>
import NavHeader from '@/components/NavHeader'
import SideBar from '@/components/SideBar'
import axios from 'axios'

export default {
  data(){
      return{
          remark:'',
          articleDetails:{articleGoTime:'2018-05-20T'},
          articleComments:[],
          messageTo:'',
          replyTo:''
      }
  },
  mounted(){
      this.getDetails();
      this.getComments();
  },
  components:{
      NavHeader,
      SideBar
  },
  methods:{
      sendMessage(){
          this.$prompt('私信给 '+this.messageTo, '提示', {
          confirmButtonText: '发送', 
          cancelButtonText: '取消',
        }).then(({ value }) => {
            var now = new Date();
            now.setHours(now.getHours()+8);
            axios.post('/users/message',{
                messageContent:value,
                toWhom:this.messageTo,
                time:now
            }).then((response)=>{
                let res = response.data;
                if(res.status=='0'){
                    this.$message({
                        type: 'success',
                        message: '发送成功！'
                    });
                }else if(res.status=='2'){
                    this.$message({
                        type: 'warning',
                        message: '不可以给自己发送私信的哦'
                    });
                }else if(res.status=='10001'){
                        this.$message({ 
                            showClose:true,
                            message:'请先登录哦',
                            type:'error'
                        })
                    }else{
                    this.$message({
                        type: 'error',
                        message: '啊哦，发生了错误'
                    });
                }
            })
        })
      },
      reply(){
         this.remark='回复给 '+this.replyTo+' ：';
      },
      collect(){
          axios.post('/users/collect',{
              articleId:this.$route.query.id,
              articleGoTime:this.articleDetails.articleGoTime,
              articleDestination:this.articleDetails.articleDestination,
              articleDescription:this.articleDetails.articleDescription,
              //articleCommentNumber:this.articleDetails.articleComment.length
          }).then((response)=>{
              let res=response.data;
              if(res.status=='0'){
                this.$message({
                    showClose:true,
                    message:'收藏成功啦',
                    type:'success'
                })
              }else if(res.status=='2'){
                this.$message({
                    showClose:true,
                    message:'已收藏该文章了哦',
                    type:'warning'
                })
              }else if(res.status=='10001'){
                        this.$message({ 
                            showClose:true,
                            message:'请先登录哦',
                            type:'error'
                        })
                }else{
                this.$message({
                    showClose:true,
                    message:'啊哦，发生了错误!',
                    type:'error'
                })
              }
          })
          
      },
      submit(){
          if(this.remark==''){
              this.$message({
                    showClose:true,
                    message:'输入不可以为空!',
                    type:'error'
                })
          }else{
                var date = new Date();
                var min;
                var sec;
                //格式化发布日期，形如2018.6.5 13：13:13
                if(date.getMinutes()>=0 && date.getMinutes()<=9)min='0'+date.getMinutes();
                else{min=date.getMinutes()}
                if(date.getSeconds()>=0 && date.getSeconds()<=9)sec='0'+date.getSeconds();
                else{sec=date.getSeconds()}
                axios.post('/articles/comment',{
                    time:new Date().setHours(new Date().getHours()+8),
                    date:date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate()+' '+date.getHours()+':'+min+':'+sec,
                    remark:this.remark,
                    articleId:this.$route.query.id,
                    commentToWhom:(this.remark.split(':')[0]).split(' ')[0]=='回复给'?(this.remark.split(':')[0]).split(' ')[1].trim():'',
                    articleOwnerId:this.articleDetails.articleOwnerId
                }).then((response)=>{
                    let res = response.data;
                    if(res.status=='2'||res.status=='3'){
                        this.$message({ 
                            showClose:true,
                            message:'success',
                            type:'success'
                        })
                        this.remark=''
                        this.getComments()
                    }else if(res.status=='10001'){
                        this.$message({ 
                            showClose:true,
                            message:'请先登录哦',
                            type:'error'
                        })
                    }else{
                        this.$message({ 
                            showClose:true,
                            message:'啊哦，发生了错误',
                            type:'error'
                        })
                    }

                })
          }
          
      },
      getDetails(){
          axios.post('/articles/details',{
              articleId:this.$route.query.id
          }).then((response)=>{
              var res=response.data;
              if(res.msg!=null)
              this.articleDetails=res.msg
              else{
                  this.$router.push('/error')
              }
          })
      },
      getComments(){
          if(this.articleDetails!=null){
              axios.post('/articles/getComments',{
                articleId:this.$route.query.id
            }).then((response)=>{
                var res=response.data;
                if(res.status=='0')
                this.articleComments=res.msg.reverse()
            })
          }
          
      },

  }
}
</script>
