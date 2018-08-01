<template>
  <div>
      <div class="fixed">
        <nav-header></nav-header>
        <side-bar></side-bar>
      </div>
      <!--主体-->
      <div class="main">
          <!--头像名字一栏 点击头像可上传新头像（加个蒙版，鼠标移上去之后显示‘点击上传头像’）-->
        <el-row type="flex" justify="center">
          <el-col :span="14" :xs="19" class="head-part">
              <el-col :span="3" :xs="8"><img :src="globalHeadImg" class="head-img"></el-col>
              <el-col :span="15"><h2 class="word-vertical-center">{{globalNickName}}</h2></el-col>
          </el-col>
        </el-row><br>
        <!--主体内容区域-->
        <el-row type="flex" justify="center">
          <el-col :span="14" :xs="19" class="self-content">
             <!--内容头部两个单页面入口-->
              <div class="self-head">
                <el-row>
                    <el-col :span="3" :xs="7" class="self-title word-center"><a :class="{'active':publishFlag}" @click="getPublishArticles(),publishFlag=true,collectFlag=false">我的发布</a></el-col>
                    <el-col :span="3" :xs="7" class="self-title"><a :class="{'active':collectFlag}" @click="getCollectArticles(),collectFlag=true,publishFlag=false">我的收藏</a></el-col>
                </el-row>
              </div>
              <br>
            <!--文章详情-->
              <div class="self-publish-article" v-for="(article,key) in displayArticles" :key="key">
                <router-link :to="{path:'/detail',query:{id:article.articleId}}">
                <div class="article">
                    <el-row type="flex" justify="center">
                    <el-col :span="22" >
                        <h2>{{article.articleGoTime.split('T')[0]}} 去 {{article.articleDestination}}</h2> 
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="22" >
                        {{article.articleDescription}}
                    </el-col>
                </el-row>
                </div>
                </router-link>
                <br>
                <el-row type="flex" justify="center">
                    <el-col :span="4" :offset="15" class="word-right">
                        <h5>评论：{{article.comment?article.comment.length:article.articleCommentNumber}}</h5>
                    </el-col>
                    <el-col :span="3" class="word-right">
                        <a @click="confirmAndDelete(),articleId=article.articleId"><h5>删除</h5> </a>
                    </el-col>
                </el-row><br>
              </div>
          </el-col>
        </el-row>

        
      </div>
      <el-dialog
        title="提示"
        :visible.sync="errDialog"
        center
        :modal-append-to-body="false">
        <span>请先登录！</span>
        <span slot="footer" class="dialog-footer">
          <router-link to='/'><el-button type="primary" @click="errDialog=false">确定</el-button></router-link>
        </span>
      </el-dialog>

  </div>
</template>

<style scoped>
.main{
    padding-top: 7rem;
}
.head-part{
    height: 8rem;
    background: #fff;
    padding-top: 1.5rem;
    padding-left: 1.5rem;
}
.head-img{
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
}
.self-content{
    background: #fff;
}
.self-title{
    margin: 1rem;
    padding-right: 1rem;
    padding-bottom: 5px;
    border-right: 2px solid black;
}
.article{
    cursor: pointer;
}
.word-vertical-center{
    position: relative;
    top: 1.5rem
}
</style>

<script>
import NavHeader from '@/components/NavHeader'
import SideBar from '@/components/SideBar'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  data(){
      return{
          displayArticles:[],
          publishFlag:true,
          collectFlag:false,
          articleId:'',
          errDialog:false
      }
  },
  mounted(){
      this.getPublishArticles();
  },
  components:{
      NavHeader,
      SideBar
  },
  computed:{
      ...mapState(['globalNickName','globalHeadImg']),
  },
  methods:{
      confirmAndDelete(){
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            if(this.publishFlag==true){
              axios.post('/articles/deletePublish',{
                    articleId:this.articleId
                }).then((response)=>{
                    let res = response.data;
                    if(res.status=='0'){
                        this.$message({
                            showClose: true,
                            type: 'success',
                            message: '删除成功!'
                            });
                        this.getPublishArticles();
                    }else{
                        this.$message({
                            showClose: true,
                            type: 'error',
                            message: '啊哦，哪里出错了!'
                        });
                    }
                })
            }else{
                axios.post('/articles/deleteCollect',{
                    articleId:this.articleId
                }).then((response)=>{
                    let res = response.data;
                    if(res.status=='0'){
                        this.$message({
                            showClose: true,
                            type: 'success',
                            message: '删除成功!'
                            });
                        this.getCollectArticles();
                    }else{
                        this.$message({
                            showClose: true,
                            type: 'error',
                            message: '啊哦，哪里出错了!'
                        });
                    }
                })
            }
          
        })
      },
      getPublishArticles(){
          axios.get('/users/getPublish').then((response)=>{
              let res = response.data;
              if(res.status=='0'){
                  this.displayArticles = res.msg.reverse();
              }else if(res.status=='10001'){
                  this.errDialog=true
              }
          })
      },
      getCollectArticles(){
          axios.get('/users/getCollect').then((response)=>{
              let res = response.data;
              if(res.status=='0'){
                  this.displayArticles = res.msg.reverse();
              }
          })
      }
  }
}
</script>
