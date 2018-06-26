<template>
  <div>

      <div class="fixed">
          <nav-header></nav-header>
          <side-bar></side-bar>
      </div>
      
      <div class="main">
          <!--私信头部-->
          <el-row>
            <el-col :sm={span:3,offset:2} :xs={span:4,offset:2}><h2>私信</h2></el-col>
          </el-row>
          <br>
          <!--不同私信对话的最新一条（首条）内容-->
          <el-row type="flex" justify="center" v-for="(dialog,key) in dialogArray" :key="key">
            <el-col :span="15" :xs="20" class="content"><router-link :to="{path:'/messageDetail',query:{name:dialog.toWhom=='我'?dialog.who:dialog.toWhom}}">
                <el-row>
                  <el-col :span="12">{{dialog.who}} 发送给 {{dialog.toWhom}}：{{dialog.message}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="12"><span class="grey-word little-word">{{dialog.time}}</span> </el-col>
                  <el-col :span="12" class="word-right">
                      <p class="little-word">查看对话</p>
                  </el-col>
                </el-row>
                </router-link>
            </el-col>
          </el-row><br>

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
.grey-word{
    color: grey;
}
.little-word{
    font-size: 12px;
}
.content{
    border-bottom: 1px solid #000;
}
</style>

<script>
import NavHeader from '@/components/NavHeader'
import SideBar from '@/components/SideBar'
import axios from 'axios'
export default {
  data(){
      return{
        dialogArray:[],
        errDialog:false
      }
  },
  mounted(){
      this.getMessageDialog()
  },
  components:{
      NavHeader,
      SideBar
  },
  methods:{
      getMessageDialog(){
          axios.get('/users/getMessageDialog').then((response)=>{
              let res = response.data;
              if(res.status == '0'){
                  this.dialogArray = res.msg
              }else if(res.status == '10001'){
                  this.errDialog=true
              }
          })
      }
  }
}
</script>
