<template>
  <el-row class="header" type="flex" justify="center">
      <el-col :span="2" :xs="4"><router-link to="/"><img src="../../static/logo.png" class="logo"></router-link></el-col>
      <el-col :span="1" :xs="4" class="nav-word"><router-link to="/">主页</router-link></el-col>
      <el-col :span="1" :xs="4" class="nav-word"><router-link to="/notes">游记</router-link></el-col>
       
      <!--未登录时的注册登录显示-->
      <el-col :span="4" :xs="12" :offset="3" v-if="!globalNickName">
        <el-col :span="12" :xs="12" class="nav-word"><a @click="registerFlag=true,resetForm('registerForm')">register</a></el-col>
        <el-col :span="12" :xs="12" class="nav-word"><a @click="loginFlag=true,initForm()">login</a></el-col>
      </el-col>
      <!--登录时的显示消息、姓名、头像-->
      <el-col :span="4" :xs="12" :offset="3" v-if="globalNickName">
        <el-col :span="5" :xs="6" class="nav-word" style="padding-left:6px">
          <el-dropdown trigger="click">
            <span class="el-dropdown-click">
              <span class="message-flag"></span><i class="el-icon-bell"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="showNoMessageFlag">现在没有任何消息哦</el-dropdown-item>
              <div v-for="(judge,key) in judge" :key="key"><router-link :to="{path:'/detail',query:{id:judge.articleId}}"><el-dropdown-item>{{judge.from}} 评论了你的文章 </el-dropdown-item> </router-link></div>
              <div v-for="(reply,index) in reply" :key="index"><router-link :to="{path:'/detail',query:{id:reply.articleId}}"><el-dropdown-item>{{reply.from}} 回复了你  </el-dropdown-item></router-link></div>
              <div v-for="message in message" @click="sendSignal"><router-link :to="{path:'/messageDetail',query:{name:message}}" ><el-dropdown-item>{{message}} 私信了你  </el-dropdown-item></router-link></div>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="8" :xs="12" class="nav-word">{{globalNickName}}
          <el-dropdown trigger="click">
            <span class="el-dropdown-click">
              <img :src="globalHeadImg" class="self-img">
            </span>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/self"><el-dropdown-item>个人中心</el-dropdown-item></router-link>
              <router-link to="/message"><el-dropdown-item>我的私信</el-dropdown-item></router-link>
              <a  @click="logOut()"><el-dropdown-item>退出</el-dropdown-item></a>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-col>

      <!--注册弹框-->
      <el-dialog title="注册" :visible.sync="registerFlag" :modal-append-to-body="false">
        <el-form :model="registerForm" status-icon :rules="rule" ref="registerForm">
          <el-form-item :label-width="formLabelWidth" prop="registerUserName">
            <span slot="label"><span class="red-word">*</span> 用户名</span>
            <el-input v-model="registerForm.registerUserName" auto-complete="off" placeholder="2-18位字母或数字组合"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" prop="pass">
            <span slot="label"><span class="red-word">*</span> 密码</span>
            <el-input v-model="registerForm.pass" auto-complete="off" type="password" placeholder="6-18位字母或数字组合"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" prop="checkPass">
            <span slot="label"><span class="red-word">*</span> 重复密码</span>
            <el-input v-model="registerForm.checkPass" auto-complete="off" type="password" placeholder="6-18位字母或数字组合"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
              <el-radio-group v-model="registerForm.sex">
                <el-radio label="M" border >男</el-radio>
                <el-radio label="F" border >女</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" prop="nickName">
            <span slot="label"><span class="red-word">*</span> 昵称</span>
            <el-input v-model="registerForm.nickName" auto-complete="off" placeholder="给自己起一个炫酷的名字吧！"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" prop="school">
            <span slot="label"><span class="red-word">*</span> 所在学校</span>
            <el-input v-model="registerForm.school" auto-complete="off" placeholder="请填写学校全称"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <span slot="label"><span class="red-word">*</span> 上传头像</span>
            <el-upload
              ref='upload' 
              action="/users/headImg"
              list-type="picture-card"
              :limit="1"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <p class="red-word" v-show="imgRequiredWord">请上传头像</p>
          </el-form-item>
          <el-form-item class="footer word-right">
            <el-button @click="registerFlag = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('registerForm')">注 册</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--登录弹框-->
      <el-dialog title="登录" :visible.sync="loginFlag" :modal-append-to-body="false">
        <el-form :model="loginForm" ref="loginForm">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="loginForm.userName" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="loginForm.password" auto-complete="off" type="password" @keyup.enter.native="login"></el-input>
          </el-form-item>
          <p class="red-word word-center" v-show="loginNullWord">用户名密码不能为空！</p>
          <p class="red-word word-center" v-show="loginWrongWord">用户名密码错误！</p>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="loginFlag = false">取 消</el-button>
          <el-button type="primary" @click="login()">登 录</el-button>
        </div>
      </el-dialog>
      <!--注册成功后的跳转提示-->
      <el-dialog
        title="提示"
        :visible.sync="jumpFlag"
        center
        :modal-append-to-body="false">
        <span>注册成功！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="jumpFlag = false, loginFlag = true,initForm()">立即登录</el-button>
        </span>
      </el-dialog>
      <!--注册失败后的跳转提示-->
      <el-dialog
        title="提示"
        :visible.sync="failureFlag"
        center
        :modal-append-to-body="false">
        <span>注册失败！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="failureFlag = false, registerFlag = true,resetForm('registerForm')">重新注册</el-button>
        </span>
      </el-dialog>
      <!--注册失败后的跳转提示-->
      <el-dialog
        title="提示"
        :visible.sync="errFlag"
        center
        :modal-append-to-body="false">
        <span>获取服务器失败！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="errFlag = false">确定</el-button>
        </span>
      </el-dialog>
  </el-row>
</template>

<style scoped>
.el-input{
  width: 60%;
}
.header{
  background: #fff;
}
.logo{
  width:60px ;
  height: 70px;
}
.nav-word{
  text-align: center;
  height: 80px;
  line-height: 80px;
}
.self-img{
  position: absolute;
  top: -20px;
  width: 30px;
  height: 30px;
  border-radius: 50%
}
.el-icon-bell{
  position: absolute;
  top: -10px;
}
.message-flag{
  position: absolute;
  top: -13px;
  background: red;
  border-radius: 100%;
  width: 8px;
  height: 8px;
}
.el-dropdown-click{
  cursor: pointer;
}
.red-word{
  color: rgb(235, 77, 77);
  font-size: .7rem;
}
</style>



<script>
  import axios from 'axios'      
  import { mapState } from 'vuex'

  export default {
    data() {
      var validateUser = (rule, value, callback) => {
        axios.post('/users/checkUserName',{ //验证用户名是否存在
          userName:this.registerForm.registerUserName
        }).then((response)=>{
          let res=response.data;
          let reg= /^[0-9a-zA-Z]*$/g;//验证是否只有字母和数字的正则
          if (value === '') {
            callback(new Error('请输入用户名'));
          }else if(value.length>18 || value.length<2){
            callback(new Error('长度在2-18位'));
          } else if(!reg.test(value)){
            callback(new Error('请只包含字母数字'));
          } else if(res.status=='2'){
            callback(new Error('用户名已存在'));
          } else {
            callback();
          }
        })
        
      };
       var validatePass = (rule, value, callback) => {
         var reg= /^[0-9a-zA-Z]*$/g;
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(value.length>18 || value.length<6){
          callback(new Error('长度在6-18位'));
        }else if(!reg.test(value)){
          callback(new Error('请只包含字母数字'));
        } else {
          if (this.registerForm.checkPass !== '') {
            this.$refs.registerForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validateSchool = (rule, value, callback) => {
        var reg=/^([\u4e00-\u9fa5]){4,20}$/;
        if (value === '') {
          callback(new Error('请输入您的学校'));
        }else if(!reg.test(value)){
          callback(new Error('请输入学校中文全称'));
        } else {
          callback();
        }
      };
      var validateNick = (rule, value, callback) => {
        axios.post('/users/checkNickName',{ //验证昵称是否唯一
          nickName:this.registerForm.nickName
        }).then((response)=>{
          let res=response.data;
          let reg=/^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
          if (value === '') {
            callback(new Error('请输入您的昵称'));
          }else if(!reg.test(value)){
            callback(new Error('只能输入中文、数字或字母'));
          }else if(value.length>13){
            callback(new Error('长度需少于13位'));
          }else if(res.status=="2"){
            callback(new Error('昵称已存在'));
          }else {                                
            callback();
          }
        })
        
      };
      
      return {

        registerForm:{
          registerUserName:'',
          pass:'',
          checkPass:'',
          school:'',
          imageUrl:'',
          nickName:'',
          sex:''
        },
        loginForm:{
          userName:'',
          password:'',
        },
        headImgUrl:'',
        registerFlag: false,
        loginFlag:false,
        jumpFlag:false,
        failureFlag:false,
        formLabelWidth: '40%',
        imgRequiredWord:false,
        loginNullWord:false,
        loginWrongWord:false,
        showNoMessageFlag:false,
        errFlag:false,
        ifLogin:false,
        signal:false,
        //消息显示变量
        reply:[],
        judge:[],
        message:[],

        rule:{
          registerUserName:[
            { validator: validateUser, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          school:[
            { validator: validateSchool, trigger: 'blur' }
          ],
          nickName:[
            {validator: validateNick, trigger: 'blur'}
          ],
          sex:[
            { required: true, message: '请选择性别', trigger: 'change' }
          ]
        }
      };
    },
    computed:{
          ...mapState(['globalNickName','globalHeadImg'])
    },
    /*初步的想法，监测这几个数组的变化，一旦有变就调用方法显示未读消息，但是用户不可能一直呆在这个网页中不走，所以最好的办法是把这些数据都保存在后台，每次与后台数据相比较。
    watch:{
      judge:()=>{

      },
      message:()=>{

      },
      reply:()=>{

      }
    },*/
    mounted(){
          this.getTip();
          this.checkLogin();//每次刷新检验登录状态（即根据sessionid去服务器找有没有对应的session）
        },
    methods: {
      /* 图片上传 */
      handleAvatarSuccess(res, file) {
        this.registerForm.imageUrl = res.msg;
        this.imgRequiredWord=false;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      /* 注册，提交表单信息到后端 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.registerForm.imageUrl ) {
           axios.post("/users/register",{
              userHeadImg:this.registerForm.imageUrl,
              userName:this.registerForm.registerUserName,
              userPwd:this.registerForm.pass,
              userSex:this.registerForm.sex,
              userSchool:this.registerForm.school,
              userNickName:this.registerForm.nickName
            }).then((response)=>{
              let res=response.data;
              if(res.status=="0"){
                 this.registerFlag=false;
                 this.jumpFlag=true;
              }else{
                this.failureFlag=true;
              }
            })
          }else if(!this.registerForm.imageUrl){
            this.imgRequiredWord=true;
            return false;
          }else{
            console.log('not valid');
            return false;
          }
        });
      },
      /* 登录 */
      login(){
        if(!this.loginForm.userName||!this.loginForm.password){
          this.loginNullWord=true;
          return false;
        }
        axios.post("users/login",{
          userName:this.loginForm.userName.trim(),
          userPwd:this.loginForm.password
        }).then((response)=>{
          let res = response.data;
          if(res.status=="0"){
            this.$store.commit("updateUserNickName",res.result.nickName);
            this.$store.commit("updateUserHeadImg","http://120.79.159.66:3000/"+res.result.userHeadImg);
            this.loginFlag=false;
            this.getTip();
          }
          if(res.status=="1"){
            this.loginWrongWord=true;
          }else{
            this.errFlag=true
          }
        })

      },
      /* 登出 */
      logOut(){
        axios.post("/users/logout").then((response)=>{
                    let res = response.data;
                    if(res.status=="0"){
                        this.$store.commit("updateUserNickName","");
                        this.$store.commit("updateUserHeadImg","");
                        this.$router.push({path:'/'})
                    }
                })
      },
      /* 每次刷新检验登录状态并返回昵称与头像 */
      checkLogin(){
        //这里做了一个优化，不是每次到新页面都要从服务器发送请求，当没有昵称和头像（即用户重新刷新页面的时候）才需要checklogin并返回用户信息，当用户已经在页面中的时候不需要checklogin，因为全局变量已经在了
        if(!this.globalNickName || !this.globalHeadImg){ 
          axios.get("/users/checkLogin").then((response)=>{
                      var res = response.data;
                      if(res.status=="0"){
                          this.ifLogin=true
                          this.$emit('ifLogin',this.ifLogin)
                        //将返回值赋给全局变量
                          this.$store.commit("updateUserNickName",res.result.userNickName);
                          this.$store.commit("updateUserHeadImg","http://120.79.159.66:3000/"+res.result.userHeadImg);
                        }else if(res.status=='1'){
                          this.ifLogin=false
                          this.$emit('ifLogin',this.ifLogin)
                        }
                  });
            }
      },
      /* 重复点击注册或登录清空表单信息 */
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.imgRequiredWord=false;
        this.$refs.upload.clearFiles(); 
        this.imageUrl='';
      },
      initForm(){
        this.loginForm.userName='';
        this.loginForm.password='';
        this.loginNullWord=false;
        this.loginWrongWord=false;
      },
      //得到消息提醒
      getTip(){
        this.showNoMessageFlag=false
        axios.get('/users/getTips').then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            this.judge=res.publishReply.reverse();
            this.reply=res.articleReply.reverse();
            this.message=res.messageReply.reverse()
          } 
        }).then(()=>{
          if(this.judge.length==0&&this.message.length==0&&this.reply.length==0){
            this.showNoMessageFlag=true
          }
        })
        
          
      },
      sendSignal(){
        this.signal=!this.signal;
        this.$emit('sendSignal',this.signal)
      }
    }
  }
</script>