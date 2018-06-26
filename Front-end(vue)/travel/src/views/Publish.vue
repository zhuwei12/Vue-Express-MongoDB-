<template>
  <div>
      <!--头部-->
      <div class="fixed">
          <nav-header @ifLogin="getLoginFlag"></nav-header>
      </div>

      <!--主体-->
      <el-row class="main">

          <!--头部-->
          <el-row>
            <el-col :span="20" :offset="4" :xs={span:15,offset:3}>
                <h3>发布我的结伴</h3>
            </el-col>
          </el-row>

          <!--表单-->

        <el-form :model="form" :rules="rules" ref="form" label-width="30%">
          <el-form-item label="标题：" prop="title">
              <el-input v-model="form.title" placeholder="一句话开始一段旅程，长度不超过10个字"></el-input>              
          </el-form-item>
          
          <el-form-item label="目的地：" prop="destination">
             <el-input v-model="form.destination" placeholder="新疆、西藏、青海……"></el-input>
          </el-form-item>
          <el-form-item label="出行时间：" prop="time">
                <el-date-picker
                v-model="form.time"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy 年 MM 月 dd 日"
                :default-time="['08:00:00', '08:00:00']">
                >
                </el-date-picker>
          </el-form-item>
          <el-form-item label="人均费用：" prop="price">
              <el-row>
                <el-col :span="3" :xs="15" >
                  <el-input v-model="form.price" placeholder="大致费用"></el-input> 元
                </el-col>
              </el-row>
          </el-form-item>
          <el-form-item label="描述：" prop="description">
              <el-input v-model="form.description" placeholder="尽可能详细将你的意向说清楚，
包括出行规划和自我评价
" type="textarea" autosize></el-input>
          </el-form-item>
          <el-form-item>
              <span slot="label"><span class="red-word">*</span> 照片</span>
              <span class="grey-word">请附上个人照片与吸引人的景点照片</span><el-upload
                action="/articles/articleImg"
                list-type="picture-card"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                >
                <i class="el-icon-plus"></i>
                </el-upload>
                <p class="red-word" v-show="imageRequiredWord">请上传图片</p>
          </el-form-item>
          <el-form-item>
             <el-button type="warning" @click="submitForm('form')" style="margin-top:1rem">点击发布</el-button>              
          </el-form-item>
        </el-form>
        <el-dialog
        title="提示"
        :visible.sync="sucFlag"
        center
        :modal-append-to-body="false">
        <span>发布成功！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="toIndex">确定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="errFlag"
        center
        :modal-append-to-body="false">
        <span>请检查是否登录,否则无法成功发布！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="errFlag=false,$router.push('/')">确定</el-button>
        </span>
      </el-dialog>
      </el-row>
  </div>
</template>

<style scoped>

.main{
    padding-top: 7rem;
}
.el-input{
    width: 70%;
}
.el-textarea{
    width: 70%;
    vertical-align:top;
}
.input{
    margin: 1rem;
}
.img{
    padding-left: 8px;
}
.right-word{
    text-align: right;
}
.red-flag{
    color: red;
}
.el-date-picker{
    width: 20%;
}
.red-word{
  color: rgb(235, 77, 77);
  font-size: .7rem;
}
.grey-word{
    color: grey;
    font-size: .8rem;
}
</style>

<script>
import NavHeader from '@/components/NavHeader'
import axios from 'axios'
export default {
  data(){
      return{
          form:{
            title:'',
            destination:'',
            description:'',
            sex:'',
            time:[],
            price:'',
            imageUrl: [],
          },
          rules:{
            title: [
                { required: true, message: '请输入标题', trigger: 'blur' },
                { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
            ],
            
            destination:[
                { required: true, message: '请输入目的地', trigger: 'blur' },
                { max: 10, message: '长度不超过 10 个字符', trigger: 'blur' }
            ],
            time: [
                { type: 'array', required: true, message: '请选择出行日期', trigger: 'change' }
            ],
            price:[
                { required: true, message: '请输入大概费用', trigger: 'blur' },
            ],
            description:[
                { required: true, message: '请输入详细描述', trigger: 'blur' },
                { min: 100, message: '不少于100字', trigger: 'blur' }
            ],
          },
        imageRequiredWord:false,
        sucFlag:false,
        errFlag:false,
      }
  },
  components:{
      NavHeader
  },

  methods:{
      /* 图片上传 */
      handleAvatarSuccess(res, file) {
        this.form.imageUrl[this.form.imageUrl.length] = res.msg;
        this.imageRequiredWord=false;
      },
      handleRemove(file, fileList) {
        for(var i=0;i<this.form.imageUrl.length;i++){
            if(file.response.msg==this.form.imageUrl[i])
                this.form.imageUrl.splice(i,1);
        }
        console.log(file.response.msg, fileList);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },


      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.form.imageUrl.length!==0) {
            var postTime=new Date();
            var publishFormatTime;
            var min;
            var sec;
            //格式化发布日期，形如2018.6.5 13：13:13
            if(postTime.getMinutes()>=0 && postTime.getMinutes()<=9)min='0'+postTime.getMinutes();
            else{min=postTime.getMinutes()}
            if(postTime.getSeconds()>=0 && postTime.getSeconds()<=9)sec='0'+postTime.getSeconds();
            else{sec=postTime.getSeconds()}
            publishFormatTime=postTime.getFullYear()+'.'+(postTime.getMonth()+1)+'.'+postTime.getDate()+' '+postTime.getHours()+':'+min+':'+sec
            axios.post("/articles/upload",{
                articleGoTime:this.form.time[0],
                articleGoDay:(this.form.time[1].getTime()-this.form.time[0].getTime())/(1000*60*60*24)+1,
                articleTitle:this.form.title,
                articleDestination:this.form.destination,
                articleAveragePrice:this.form.price,
                articlePublishTime:publishFormatTime,
                articleDescription:this.form.description,
                articleImg:this.form.imageUrl,
            }).then((response)=>{
                let res = response.data;
                if(res.status=="0"){
                    this.sucFlag=true
                }else{
                    this.errFlag=true
                }
            })
            
          }else if(this.form.imageUrl.length==0){
            this.imageRequiredWord=true;
            return false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      toIndex(){
          this.sucFlag=false;
          this.$router.push('/')
      },
      getLoginFlag(ifLogin){
          this.errFlag = !ifLogin;
          
      }
  }
}
</script>
