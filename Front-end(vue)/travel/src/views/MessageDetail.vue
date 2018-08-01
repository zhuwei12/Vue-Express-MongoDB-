<template>
  <div>

      <div class="fixed">
          <nav-header @sendSignal="getSignal"></nav-header>
          <side-bar></side-bar>
      </div>
      
      <div class="main">
          <!--对话头部-->
          <el-row>
            <el-col :sm={span:5,offset:2} :xs={span:20,offset:2}><h2>与 {{name}} 的对话</h2></el-col>
          </el-row>
          <br>
          <!--发送表单-->
          <el-row type="flex" justify="center">
            <el-col :span="15" :xs="20">
                发私信给 {{name}}
            </el-col>
          </el-row><br>
          <el-row type="flex" justify="center">
            <el-col :span="15" :xs="20">
                <el-input v-model="message" type="textarea"></el-input>
            </el-col>
          </el-row><br>
          <el-row type="flex" justify="center">
            <el-col :span="15" :xs="20" class="word-right">
                <el-button type="primary" @click="sendMessage">发送</el-button>
            </el-col>
          </el-row>
          <!--具体对话内容-->
          <el-row type="flex" justify="center" v-for="(eachMessage,key) in messageContent" :key="key">
            <el-col :span="15" :xs="20" class="content">
                <el-row>
                  <el-col :span="12">{{eachMessage.name}}：{{eachMessage.content}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="12"><span class="grey-word little-word">{{eachMessage.sendTime}}</span> </el-col>
                  <!--删除
                  <el-col :span="12" class="word-right">
                      <a class="little-word">删除</a>
                  </el-col>
                  -->
                </el-row>
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
.content{
    border-bottom: 1px solid #000;
}
.grey-word{
    color: grey;
}
.little-word{
    font-size: 12px;
}
</style>

<script>
import NavHeader from '@/components/NavHeader'
import SideBar from '@/components/SideBar'
import axios from 'axios'
export default {
  data(){
      return{
          message:'',
          messageContent:[],
          name:this.$route.query.name,
          errDialog:false,
          signal:false
      }
  },
  mounted(){
      this.getMessage()
  },
  watch: {
    // 如果 `signal` 发生改变，这个函数就会运行
    signal : function () {
      this.getMessage();
      this.name=this.$route.query.name
    }
  },
  components:{
      NavHeader,
      SideBar
  },
  methods:{
      sendMessage(){
            var now = new Date();
            now.setHours(now.getHours()+8);
            axios.post('/users/message',{
                messageContent:this.message,
                toWhom:this.$route.query.name,
                time:now
            }).then((response)=>{
                let res = response.data;
                if(res.status=='0'){
                    this.$message({
                        showClose: true,
                        type: 'success',
                        message: '发送成功！'
                    });
                    this.message='';
                    this.getMessage();
                }else{
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: '啊哦，发送失败了'
                    });
                }
            })
      },
      getMessage(){
          axios.post('/users/getMessage',{
              withWhom:this.$route.query.name,
          }).then((response)=>{
              let res = response.data;
              if(res.status=='0'){
                  this.messageContent = res.msg
              }else if(res.status == '10001'){
                  this.errDialog=true
              }
          })
      },
      getSignal(signal){
          this.signal=signal
      }
  }
}
</script>
