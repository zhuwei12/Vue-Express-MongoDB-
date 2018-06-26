<template>
    <div>

        <h1 class="center">啊哦，这篇文章已经找不到了……</h1>
        <div class="center but">
            <router-link to="/" class="but"><el-button type="primary">返回主页</el-button></router-link> 
            <router-link to="/self" class="but"><el-button type="primary">返回个人中心</el-button></router-link>
        </div>
        
    </div>
</template>

<style scoped>
.center{
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.but{
    height: 0;
}
</style>
