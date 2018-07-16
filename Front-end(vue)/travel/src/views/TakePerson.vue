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
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50" class="loading">
            <img src="../../static/loading-spinning-bubbles.svg" v-show="loading">
        </div>
        <div style="height:100px"></div>
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
.loading{
    margin: 0 auto;
    width: 100px;
    text-align: center;
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
          goTime:'',
          busy:true,
          loading:false,
          page:1,
          pageSize:3
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
      getArticles(flag){
          this.loading = true;//显示loading图标
          axios.post("/articles/articleList",{
              sex:this.sex,
              destination:this.destination,
              goTime:this.goTime,
              page:this.page,
              pageSize:this.pageSize
          }).then((response)=>{
              let res = response.data;
              this.loading = false;//隐藏loading图标
              if(res.status=="0"){
                  if(flag){//如果不是第一次请求数据，加到数组中
                      this.articleList = this.articleList.concat(res.msg);

                      if(res.msg.length==0){//请求数据为空了
                          this.busy = true;//禁用滚动方法
                      }else{
                          this.busy = false;//启用滚动方法
                      }

                  }else{
                      this.articleList = res.msg;//如果是第一次请求数据，赋值到数组中
                      this.busy = false;//启用滚动方法
                  }
                  
              }else{ //请求出错，返回空
                  this.articleList=[];
                  this.errFlag=true;
                  console.log("获取服务器出现问题，请稍后重试")
              }
              
          }).then(()=>{//只显示文章前200个字符
              for(var i=0;i<this.articleList.length;i++){
                 this.articleList[i].articleDescription = this.articleList[i].articleDescription.substr(0,200)+'……'
                 this.articleList[i].articleGoTime = this.articleList[i].articleGoTime.split('T')[0]
              }
          })
          
      },
      getSex(sex){
          this.sex=sex;
          this.page=1;
          this.getArticles();
      },
      getDes(destination){
          this.destination=destination;
          this.page=1;
          this.getArticles();
      },
      getTime(goTime){
          this.goTime=goTime;
          this.page=1;
          this.getArticles();
      },
      getAll(){
          this.sex='';  
          this.destination='';
          this.goTime='';
          this.page=1;
          this.getArticles();
      },
      loadMore(){
          this.busy = true;//禁用滚动方法
          setTimeout(() => {
                  this.page++;
                  this.getArticles(true);
                }, 500);//.5s之后向后台要数据（如果不加settimeout的话请求会成千上万，这样保证滚动一次只一个请求）
      }
  }
}
</script>
