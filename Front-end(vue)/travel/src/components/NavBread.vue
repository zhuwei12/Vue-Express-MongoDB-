<template>
  <el-row class="bread" type="flex" justify="center">
    <el-col :span="3" :xs="6">
        <el-autocomplete
      class="inline-input"
      v-model="destination"
      :fetch-suggestions="querySearch"
      placeholder="目的地"
      @select="passDestination"
      @input="checkDes"
    ></el-autocomplete>
    </el-col>
    <el-col :span="3" :xs="8">
        <el-autocomplete
      class="inline-input"
      v-model="goTime"
      :fetch-suggestions="querySearch2"
      placeholder="出发时间"
      @select="passGoTime"
      @input="checkTime"
    ></el-autocomplete>
    </el-col>
    <el-col :span="1" :xs="3" class="center-word">
        <a href="javascript:void(0)" class="word" @click="sex='',destination='',goTime='', initValue()">最新</a>
    </el-col>
    <el-col :span="1" :xs="3" class="center-word">
        <a href="javascript:void(0)" class="word" @click="sex=='F'?sex='M':sex='F',passSex()"><span v-if="sex==''">性别</span><span v-if="sex=='M'">男</span><span v-if="sex=='F'">女</span></a>
    </el-col>
    <el-col :sm={span:3,offset:4} :xs="4">
        <router-link to="/publish"> <el-button type="warning" plain>发布</el-button></router-link>
    </el-col>
  </el-row>
  
</template>

<style scoped>
.bread{
    line-height: 4rem;
    height: 4rem;
    background: #aca98e;
}
.word{
    height: 2rem;
    line-height: 2rem;
}
.center-word{
    text-align: center;
}
</style>

<script>
export default {
  data() {
      return {
        places: [],
        times: [],
        destination: '',
        goTime:'',
        sex:'',
      };
    },
    mounted() {
      this.places = this.loadAll();
      this.times = this.loadAll2();
    },
    methods: {
        //目的地输入框的方法
      querySearch(queryString, cb) {
        var places = this.places;
        var results = queryString ? places.filter(this.createFilter(queryString)) : places;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (place) => {
          return (place.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [
          { "value": "青海" },
          { "value": "新疆" },
          { "value": "西藏" },
          { "value": "大理" },
          { "value": "大连" },
          { "value": "北京" },
          { "value": "沈阳" },
          { "value": "重庆" },
          { "value": "厦门" },
          { "value": "本溪" },
          { "value": "云南" },
          { "value": "泸沽湖" },
          { "value": "内蒙古" },
          { "value": "南京" },
          { "value": "上海" },
          { "value": "广州" },
          { "value": "澳门" },
          { "value": "香港" },
          { "value": "天津" },
          { "value": "湖南" },
          { "value": "长沙" },
          { "value": "宁夏" },
          { "value": "贵州" },
          { "value": "台湾" },
          { "value": "山西" },
          { "value": "黑龙江" },
          { "value": "甘肃" },
          { "value": "湖北" },
          { "value": "陕西" },
          { "value": "海南" },
          { "value": "河北" },
          { "value": "四川" },
          { "value": "吉林" },
          { "value": "长春" },
          { "value": "长白山" },
          { "value": "延吉" },
          { "value": "哈尔滨" },
          { "value": "安徽" },
          { "value": "山东" },
          { "value": "浙江" },
          { "value": "泰山" },
          { "value": "烟台" },
          { "value": "蓬莱" },
          { "value": "江西" },
          { "value": "扬州" },
          { "value": "苏州" },
          { "value": "桂林" },
        ];
      },


      //出行时间输入框的方法
      querySearch2(queryString, cb) {
        var times = this.times;
        var results = queryString ? times.filter(this.createFilter2(queryString)) : times;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter2(queryString) {
        return (time) => {
          return (time.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll2() {
        return [
          { "value": "最近1月" },
          { "value": "1-3月内" },
          { "value": "3月以上" },
        ];
      },
      passSex(){
        this.$emit('emitSex',this.sex)
      },
      passDestination(){
        this.$emit('emitDes',this.destination)
      },
      passGoTime(){
        this.$emit('emitTime',this.goTime)
      },
      initValue(){
        this.$emit('emitAll')
      },
      checkDes(){
        if(this.destination==''){
          this.passDestination();
        }
      },
      checkTime(){
        if(this.goTime==''){
          this.passGoTime();
        }
      }

    }
    
}
</script>
