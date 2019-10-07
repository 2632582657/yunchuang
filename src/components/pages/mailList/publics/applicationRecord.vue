<template>
    <div class="search_team">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="搜索团队" name="first">
            </el-tab-pane>
            <el-tab-pane label="申请记录" name="second">
                <div v-show="showSearchContent" style="margin-top:10px;">
                    <template v-for="item in data">
                        <div class="search_c">
                            <div class="search_f1">
                                <div class="search_l">
                                    <img :src="item.teamLogo" alt="" width="50px" height="50px" style="float:left" v-if="item.teamLogo">
                                    <img src="../images/head.png" alt="" width="50px" style="float:left" v-else>
                                    <div style="float:left;margin-left:20px;">
                                        <div class="clear">
                                            <p style="max-width:175px;font-size:14px" class="fl">{{item.teamInfoName}}</p>
                                            <template v-if="item.teamAuthenticationStatus == 1">
                                                <!-- <div class="certification">
                                                   V 认证企业
                                                </div> -->
                                                <img src="../../index/images/icon_renzheng.png" alt="" width="21px" class="fl" style="margin:2px 0 0 15px;">
                                            </template>
                                        </div>
                                        <p style="font-size:12px;color:#BFC2CC;margin-top:10px">{{item.provinceName}}-{{item.cityName}} &nbsp;&nbsp; {{item.teamIndustryName}}</p>
                                    </div>
                                </div>
                                <div class="search_r">
                                    <!-- 1认证 0未认证   applyResult 0等待  1同意 2拒绝 -->
                                    <template v-if="item.applyResult == 0">
                                        <p style="color:#BFC2CC">等待审批</p>
                                    </template>
                                    <template v-else-if="item.applyResult == 1">
                                        <p style="color:#4FBE96">通过</p>
                                    </template>
                                    <template v-else>
                                        <p style="color:#FF6565">拒绝</p>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="search_loading" v-show="loading">
                    <div style="margin:0 auto;height:40px;width:100px" class="clear">
                        <img src="../images/Gear-1s-200px.svg" alt="" height="24px" style="float:left;vertical-align:middle;margin-top:7px">
                        <p style="float:left;vertical-align:middle;line-height:40px">加载中......</p>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'applicationRecord',
    data () {
        return {
            ssoManager:'ssoManager',
            activeName: 'second',
            searchteam: '',
            tabNum: 0,
            hideSearchContent: false,
            showSearchContent: true,
            data: [],
            loading:false,
            employeeId:JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')).employeeId,
        }
    },
    created() {
        this.handleData()
    },
    methods: {
        tabClick: function (index) {
            this.tabNum = index;
        },
        handleClick(tab, event) {
            if (tab.index == 0) {
                this.$router.push({name:'searchTeam'})
            }
        },
        handleData () {
            this.$http({
                method: 'GET',
                url:this.ssoManager + '/v1/oa/userInfoJoinApply/getUserInfoJoinApplyByEmployee',
                params: {
                    employeeId:this.employeeId
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.data = res.data.data
                }
            })
        }
    },
    mounted () {
    }
}
</script>

<style lang="scss">
.search_team {
    // padding: 0 20px;
    height: 100%;
    box-sizing: border-box;
}
.search_team .el-tabs__header {
    margin: 0;
}
.search_team .el-tabs__item {
    color: #4278BE;
    font-size:18px;
}
.search_team .el-tabs__active-bar {
    height:5px;
    background:rgba(66,120,190,1);
}
.search_team .el-tabs__content{
    height: 100%;
    width: 100%;
    overflow: auto;
    background-color: rgba(255,255,255,1);
}
.search_team .team_ruleForm {
    margin-top: 20px;
}
.search_input .el-input__inner {
    height: 30px;
}
.search_input {
    padding: 20px 20px;
}
.search_team .el-tabs {
    height: 100%;
}
.search_team .tabColor {
    color: #4278BE;
}
.search_team .search_content {
    height: 200px;
    width: 200px;
    margin: 284px auto;
    text-align: center;
}
.search_team .search_c {
    padding: 10px 20px;
}
.search_team  .el-tabs__nav {
    white-space: nowrap;
    position: relative;
    transition: -webkit-transform 0s;
    -webkit-transition: -webkit-transform 0s;
    transition: transform 0s;
    transition: transform 0s, -webkit-transform 0s;
    transition: transform 0s,-webkit-transform 0s;
    float: left;
    z-index: 2;
}
.search_team .search_f1 {
    padding: 33px 20px 33px 30px;
    border: 1px solid #4278BE;
    overflow: hidden;
        .search_l {
            float: left;
            overflow: hidden;
        }
        .search_r {
            float: right;
            // margin-top: 12px;
            align-items:center; display: -webkit-flex;
            p {
                margin-top: 15px;
            }
        }
}
.search_team .certification {
    float:left;
    height:19px;
    width:80px;
    line-height: 19px;
    margin-left:26px;
    background:#FFBD38;
    color:#FFFFFF;
    font-size:10px;
    border-radius:10px;
    text-align:center
}
.search_team .search_loading {
    width: 100%;
    height: 40px;
    margin-top: 20px;
}

</style>
