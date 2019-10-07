<template>
    <div class="applicationRecord_team">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="搜索团队" name="first">
                <!-- 首次进入页面 -->
                <div class="first_page" v-show="firstShow">
                    <div class="join_department">加入的团队/企业/部门</div>
                    <div style="font-size:12px;color:#606266">高效沟通，智能办公</div>
                    <div style="color:#4278BE;margin-top:30px;cursor: pointer" @click="showTeamContent" class="clear">
                        <img src="../images/searchteam@2x.png" alt="" width="32px" style="float:left">
                        <p style="float:left;margin-left:15px;margin-top:6px">搜索团队名称加入</p>
                    </div>
                    <!-- <div style="color:#4278BE;cursor: pointer" class="clear">
                        <img src="../images/num.png" alt="" width="32px" style="float:left">
                        <p style="float:left;margin-left:15px;margin-top:6px">通过团队号加入</p>
                    </div> -->
                </div>
                <!-- 显示隐藏所有内容 -->
                <div v-show="showAllPage">
                    <div class="applicationRecord_input">
                        <el-input
                            placeholder="请输入团队/企业/部门名称（至少两个字）"
                            v-model="searchteam"
                            @keyup.enter.native="handleSearchTeam">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                    <div v-show="showSearchContent">
                        <template v-for="item in teams">
                            <div class="applicationRecord_c">
                                <div class="applicationRecord_f1">
                                    <div class="applicationRecord_l">
                                        <img :src="item.teamLogo" alt="" width="50px" height="50px" style="float:left" v-if="item.teamLogo">
                                        <img src="../images/head.png" alt="" width="50px" height="50px" style="float:left" v-else>
                                        <div style="float:left;margin-left:20px;">
                                            <div class="clear">
                                                <p style="max-width:175px;font-size:14px" class="fl" v-html="item.teamTitle"></p>
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
                                    <div class="applicationRecord_r">
                                        <el-button @click="handleJoinTeam(item)">申请加入</el-button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <!-- 显示隐藏搜索内容 -->
                <div class="applicationRecord_content" v-show="hideSearchContent">
                    <img src="../images/searchteam.png" alt="" width="120px" style="margin:0 auto">
                    <div style="font-size:16px;color:#303133;margin-top:25px;">
                        <span>搜索团队</span>
                        <span>高效工作</span>
                    </div>
                    <div style="font-size:14px;color:#606266;margin-top:10px;">
                        找到你的团队开心工作吧
                    </div>
                </div>
                <!-- 显示隐藏没有数据的时候 -->
                <div class="applicationRecord_content" v-show="showNotData">
                    <img src="../images/noteam.png" alt="" width="120px" style="margin:0 auto">
                    <div style="font-size:16px;color:#303133;margin-top:25px;">
                        暂时没有找到相关的企业试试其他名称吧
                    </div>
                </div>
                <div class="applicationRecord_content" v-show="showWaiting">
                    <img src="../images/pic-wait.png" alt="" width="120px" style="margin:0 auto">
                    <div style="font-size:16px;color:#303133;margin-top:25px;">
                        您的申请已发送给管理员，请等待审核
                    </div>
                </div>
                <!-- 显示隐藏loading状态 -->
                <div class="applicationRecord_loading" v-show="loading">
                    <div style="margin:0 auto;height:40px;width:100px" class="clear">
                        <img src="../images/Gear-1s-200px.svg" alt="" height="24px" style="float:left;vertical-align:middle;margin-top:7px">
                        <p style="float:left;vertical-align:middle;line-height:40px">加载中......</p>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="申请记录" name="second">
            </el-tab-pane>
        </el-tabs>
        <el-dialog
            :title="teamData.teamName"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <div>
                <p style="margin-top:5px">快来加入我们吧!</p>
                <el-divider></el-divider>
                <div style="padding:40px 90px 20px">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="真实姓名" prop="name">
                            <el-input v-model="ruleForm.name" placeholder="请输入您的真实姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="部门" prop="branch">
                            <el-input v-model="ruleForm.branch" placeholder="请输入您所属的部门"></el-input>
                        </el-form-item>
                        <el-form-item label="职位" prop="position">
                            <el-input v-model="ruleForm.position" placeholder="请输入职位名称"></el-input>
                        </el-form-item>
                        <el-form-item label="申请备注" prop="desc" class="from_desc">
                            <!-- <el-input type="textarea" v-model="ruleForm.desc"></el-input> -->
                        </el-form-item>
                            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="submitForm" style="background:#4278BE;color:#fff;width:308px;height:54px;margin-bottom: 10px">提交申请</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'searchTeam',
    data () {
        return {
            ssoManager:'ssoManager',
            activeName: 'first',
            searchteam: '',
            tabNum: 0,
            teams:[],
            teamData:{},
            hideSearchContent: false,
            showNotData: false,
            centerDialogVisible: false,
            loading: false,
            showAllPage: false,
            showSearchContent: false,
            showWaiting:false,
            firstShow: true,
            employeeId:JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')).employeeId,
            ruleForm: {
                name: '',
                branch: '',
                position: '',
                desc: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
            }
        }
    },
    methods: {
        tabClick: function (index) {
            this.tabNum = index;
        },
        handleClick(tab, event) {
            if (tab.index == 1) {
                this.$router.push({name:'applicationRecord'})
            }
        },
        handleSearchTeam () {
            if (this.searchteam.length >= 2) {
                this.hideSearchContent = false
                this.$http({
                    method:'GET',
                    url: this.ssoManager + '/v1/teamInfo/getTeamInfoListWeb',
                    params:{
                        teamName:this.searchteam
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        if (res.data.data.length > 0) {
                            this.changeColor(res.data.data)
                            this.teams = res.data.data
                            this.showSearchContent = true
                            this.showNotData = false
                        }else {
                            this.showNotData = true
                            this.showSearchContent = false
                        }
                    }
                })
            }else {
                this.showSearchContent = false
                this.hideSearchContent = true
                this.$message.error('至少两个字');
            }
        },
        changeColor (resultsList) {
            resultsList.map((item, index) => {
                // console.log('item', item)
                item.teamTitle = ''
                if (this.searchteam && this.searchteam.length > 0) {
                // 匹配关键字正则
                let replaceReg = new RegExp(this.searchteam, 'g')
                // 高亮替换v-html值
                let replaceString =
                    '<span class="search-text">' + this.searchteam + '</span>'
                    resultsList[index].teamTitle = item.teamName.replace(
                        replaceReg,
                        replaceString
                    )
                }
            })
            this.teams = []
            this.teams = resultsList
        },
        handleJoinTeam (value) {
            this.teamData = value
            this.centerDialogVisible = true
        },
        submitForm() {
            this.$refs.ruleForm.validate((valid) => {
            if (valid) {
                this.$http({
                    method:'POST',
                    url:this.ssoManager + '/v1/oa/userInfoJoinApply/saveUserInfoJoinApply',
                    data:{
                        departmentName: this.ruleForm.branch,
                        desc:this.ruleForm.desc,
                        inviter: '',
                        teamInfoId:this.teamData.teamInfoId,
                        teamUserName: this.ruleForm.name,
                        teamUserPosition: this.ruleForm.position,
                        employeeId: this.employeeId
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.centerDialogVisible = false
                        this.showAllPage = false
                        this.showWaiting = true
                    }else if (res.data.code === 501111111) {
                        this.$message({
                            type:'error',
                            message:res.data.message
                        })
                    }
                })
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        showTeamContent () {
            this.showAllPage = true
            this.firstShow = false
            this.hideSearchContent = true
        }
    }
}
</script>

<style lang="scss">
.applicationRecord_team {
    // padding: 0 20px;
    height: 100%;
    box-sizing: border-box;
}
.applicationRecord_team .el-tabs__header {
    margin: 0;
}
.applicationRecord_team .el-tabs__item {
    color: #4278BE !important;
    font-size:18px;
}
.applicationRecord_team .el-tabs__active-bar {
    height:5px;
    background:rgba(66,120,190,1);
}
.applicationRecord_team .el-tabs__content{
    height: 100%;
    width: 100%;
    overflow: auto;
    background-color: rgba(255,255,255,1);
}
.applicationRecord_team .first_page {
    padding: 20px;
}
.applicationRecord_team .first_page div{
    margin-top: 15px;
}
.applicationRecord_team .join_department {
    width:182px;
    height:23px;
    font-size:14px;
    font-family:MicrosoftYaHeiUI;
    color:rgba(48,49,51,1);
    line-height:18px;
}
.applicationRecord_team  .el-tabs__nav {
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
.applicationRecord_team .team_ruleForm {
    margin-top: 20px;
}
.applicationRecord_input .el-input__inner {
    height: 30px;
    line-height: 28px;
}
.applicationRecord_input .el-input__icon {
    line-height: 30px;
}
.applicationRecord_input {
    padding: 20px 20px;
}
.applicationRecord_team .el-tabs {
    height: 100%;
}
.applicationRecord_team .tabColor {
    color: #4278BE;
}
.applicationRecord_team .applicationRecord_content {
    height: 200px;
    width: 290px;
    margin: 284px auto;
    text-align: center;
}
.applicationRecord_team .applicationRecord_c {
    padding: 10px 20px;
}
.applicationRecord_team .applicationRecord_f1 {
    padding: 33px 20px 33px 30px;
    border: 1px solid #4278BE;
    overflow: hidden;
        .applicationRecord_l {
            float: left;
            overflow: hidden;
        }
        .applicationRecord_r {
            float: right;
            margin-top: 12px;
            .el-button {
                background: #4278BE;
                color: #ffffff;
            }
        }
}
.applicationRecord_team .applicationRecord_loading {
    width: 100%;
    height: 40px;
    margin-top: 20px;
}
.applicationRecord_team .el-dialog__title {
    font-size:24px;
    color:rgba(48,49,51,1);
    line-height:31px;
}
.applicationRecord_team .el-dialog__body {
    padding: 0 !important;
    text-align:center!important;
}
.applicationRecord_team .el-dialog{
    width: 600px !important;
}
.applicationRecord_team .el-divider--horizontal {
    margin: 12px 0;
}
.applicationRecord_team .from_desc {
    margin-bottom: 0
}
.applicationRecord_team .el-textarea__inner {
    width: 386px;
    height:150px;
    margin-left: 33px;
}
.applicationRecord_team .certification {
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
.applicationRecord_team  .search-text {
    color: #2AA1E1
}
</style>
