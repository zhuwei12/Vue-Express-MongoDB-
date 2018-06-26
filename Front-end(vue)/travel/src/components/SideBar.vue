<template>
  <div>
      <div class="side">
        <a class="to-top" @click="toHead"><i class="el-icon-arrow-up"></i></a>
        <a class="to-top" @mouseenter="showQrCode=true" @mouseleave="showQrCode=false"><i class="el-icon-edit"></i></a>
      </div>
      <div class="side-img">
          <img v-if="showQrCode" src="../../static/qrcode.jpg" class="qrcode-img">
      </div>
  </div>
</template>

<script>
export default {
  data(){
      return{
        showQrCode:false
      }
  },
  methods:{
      toHead(){
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0
      },
      
  }
}
</script>
