<template>
    <div class="newUserPage">
        <div class="newUserPage_c">
            <img src="../images/illustration.png" alt="" width="435px">
            <h4 class="newUserPage_title">开启智慧办公</h4>
            <el-button style="background:rgba(66,120,190,1);color:#fff;width:150px;height:50px;line-height:10px;margin-top:28px" @click="addTeam" v-if="adminInfo.companyName == ''">加入团队</el-button>
        </div>
    </div>
</template>

<script>
import bus from '../../../../modules/bus'
export default {
    name:'newUserPage',
    data() {
        return {
           adminInfo:JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO'))
        }
    },
    created() {

    },
    methods: {
        addTeam () {
            this.$router.push({name:'searchTeam'})
            window.sessionStorage.setItem('currentView', 'mailList')
            bus.$emit('pushRefresh','mailList')
        }
    },
    mounted() {
    },
}
</script>
<style>
.newUserPage {
    position: relative;
    height: 100%;
    width: 100%;
    background: #fff;
    top: -60px;
    left: 0px;
}
.newUserPage_c{
    height: 300px;
    width: 435px;
    padding-top:200px;
    margin: 0px auto;
    text-align: center
}
.newUserPage_title {
    height:31px;
    margin-top: 24px;
    font-size:24px;
    font-family:MicrosoftYaHei;
    color:rgba(48,49,51,1);
    line-height:31px;
}
</style>
