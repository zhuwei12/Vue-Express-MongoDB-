// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

import './assets/css/base.css'


Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VueLazyLoad,{
  loading:require('../static/loading-spin.svg')
})
Vue.use(infiniteScroll)

const store = new Vuex.Store({
  state: {
    globalNickName:'',
    globalHeadImg:''
  },
  mutations: {
    updateUserNickName(state, nickName) {
      state.globalNickName = nickName;
    },
    updateUserHeadImg(state,headImg){
      state.globalHeadImg = headImg
    }
  }
    
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,        //引用vuex全局变量
  router,
  components: { App },
  template: '<App/>'
})
