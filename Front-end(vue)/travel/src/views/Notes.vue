<template>
  <div class="container">

      <div class="fixed">
        <nav-header></nav-header>
        <nav-bread></nav-bread>
        <side-bar></side-bar>
      </div>
      
      <div class="main">
          <h1>{{msg}}</h1>
          <h1>hhh</h1>
      </div>
      

  </div>
</template>

<style scoped>
.main{
    padding-top: 10rem;
    height: 100rem;
}
.fixed{
    width: 100%;
    position: fixed;
}
</style>

<script>
import NavHeader from '@/components/NavHeader'
import NavBread from '@/components/NavBread'
import SideBar from '@/components/SideBar'
export default {
  data(){
      return{
          msg:'coming soon',
      }
  },
  mounted(){

  },
  computed:{

  },
  components:{
      NavHeader,
      NavBread,
      SideBar
  },
  methods:{

  }
}
</script>
