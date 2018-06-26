<template>
  <div class="container">
      <!--头部的两个固定栏-->
      <div class="fixed">
        <nav-header></nav-header>
        <nav-bread @emitSex="getSex" @emitDes="getDes" @emitTime="getTime" @emitAll="getAll"></nav-bread>
      </div>
      <!--中间主体-->
      <div class="main">
          <!--发布内容栏-->
        <div v-for="(article,key) in articleList" :key="key"  class="article-contain" :class="[(article.articleOwnerSex=='M'?'boy-color':'girl-color')/*验证是否过期,(article.articleGoTime>new date()?'disabled':'')*/]"><router-link :to="{path:'/detail',query:{id:article.articleId}}">
            <el-row class="article-title">
                <el-col :span="23" :offset="1">
                    <h3> {{article.articleGoTime}} 去 {{article.articleDestination}} <span class="school-style">({{article.articleOwnerSchool}})</span> </h3>
                </el-col>
            </el-row>
            
            <div class="details">
                <el-row>
                  <el-col :span="22" :offset="1">
                      <h4>{{article.articleDescription}}</h4>
                  </el-col>
                </el-row><br>
                <el-row>
                  <el-col :sm={span:1,offset:18} :xs={span:4,offset:10}>
                      <h5>评论:{{article.articleComment.length}}</h5> 
                  </el-col>
                  <el-col :span="4" :xs="10">
                      <h5 class="grey-color">{{article.articlePublishTime}}</h5>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style="height:12px"></el-col>
                </el-row>
            </div>
        </router-link></div>

        
        <!--根据出行时间是否过期决定显示背景为disabled  这个功能暂时不用，后期有可能加，现在的想法是正常显示，但是进入详情页无法添加评论
        <div class="article-contain disabled"><router-link to="/detail?id=1">
            <el-row class="article-title">
                <el-col :span="23" :offset="1">
                    <h3> 元旦 去 华山 <span class="school-style">(大连海事大学)</span> </h3>
                </el-col>
            </el-row>
            
            <div class="details">
                <el-row>
                  <el-col :span="23" :offset="1">
                      <h4>内容</h4>
                      <h4>contain</h4>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" :offset="20">
                      评论:3
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style="height:12px"></el-col>
                </el-row>
            </div>
        </router-link></div>-->
      
      </div>
      
      <!--侧边辅助栏，这里封装成一个组件-->
      <side-bar></side-bar>      
      <el-dialog
        title="提示"
        :visible.sync="errFlag"
        center
        :modal-append-to-body="false">
        <span>获取服务器失败，请稍后重试！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="errFlag=false">确定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<style scoped>
.main{
    padding-top:10rem;
    z-index: -1;
}
.fixed{
    width: 100%;
    position: fixed;
    z-index:1;
}
.article-contain{
    background: #fff;
    margin: 2rem auto;
    width: 70%;
    border-radius: 10px;
    cursor: pointer;
}
.article-title{
    padding-bottom: 5px;
    border-bottom: 1px solid #000;
}
.details{
    padding-top: 1rem;
}
.school{
    padding-top: 1rem;
}
.school-style{
    font-size:13px;
    color:#999
}
.disabled{
    color:grey;
    border:1px solid
}
.girl-color{
    border: 3px solid rgb(252, 141, 160);
}
.boy-color{
    border: 3px solid rgb(112, 112, 240);
}
.grey-color{
    color: grey;
}
</style>

<script>
import NavHeader from '@/components/NavHeader'
import NavBread from '@/components/NavBread'
import SideBar from '@/components/SideBar'
import axios from 'axios'

export default {
  data(){
      return{
          articleList:[],
          errFlag:false,
          sex:'',
          destination:'',
          goTime:''
      }
  },
  mounted(){
      this.getArticles()
  },
  components:{
      NavHeader,
      NavBread,
      SideBar
  },
  methods:{
      getArticles(){
          //后面要实现排序功能的话需要传参数到后台
          axios.post("/articles/articleList",{
              sex:this.sex,
              destination:this.destination,
              goTime:this.goTime
          }).then((response)=>{
              let res = response.data;
              if(res.status=="0"){
                  this.articleList = res.msg;
              }else{
                  this.errFlag=true;
                  console.log("获取服务器出现问题，请稍后重试")
              }
              
          }).then(()=>{
              for(var i=0;i<this.articleList.length;i++){
                 this.articleList[i].articleDescription = this.articleList[i].articleDescription.substr(0,200)+'……'
                 this.articleList[i].articleGoTime = this.articleList[i].articleGoTime.split('T')[0]
              }
          })
          
      },
      getSex(sex){
          this.sex=sex;
          this.getArticles();
      },
      getDes(destination){
          this.destination=destination;
          this.getArticles();
      },
      getTime(goTime){
          this.goTime=goTime;
          this.getArticles();
      },
      getAll(){
          this.sex='';  
          this.destination='';
          this.goTime='';
          this.getArticles();
      }
  }
}
</script>
