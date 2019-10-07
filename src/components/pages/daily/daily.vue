<!--@description: 本组件为功能模块案例，用以解释说明功能基本写法
	@author: 刘钰
    @update: 刘钰(2019-04-22 17:00) -->
<template>
    <div id="daily">
        <router-link :to="{name:'login'}">每日</router-link>
        <router-link :to="{name:'dailyWeek'}">每周</router-link>
        <router-link :to="{name:'dailyMonth'}">每月</router-link>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    components: {

    }
}
</script>
<style lang="scss" scoped>
    .router-link-active{
        color:rgb(35, 167, 190);
    }  
</style>
