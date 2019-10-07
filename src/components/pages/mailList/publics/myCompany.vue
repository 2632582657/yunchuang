<template>
    <div class="company_team">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="团队信息" name="first">
                <div v-show="showCompany">
                    <div class="company_content">
                        <div class="company_header clear">
                            <template v-if="companyObj.logoUrl">
                                <img :src="companyObj.logoUrl" alt="" width="50px" height="50px" class="fl">
                            </template>
                            <template v-else>
                                <img src="../images/head.png" alt="" width="50px" height="50px" class="fl">
                            </template>
                            <div class="fl" style="width:250px;margin-left:15px">
                                <div class="clear">
                                    <p class="fl" style="margin-top:5px;color:#303133">{{companyObj.label}}</p>
                                    <template v-if="companyInfo.teamAuthenticationStatus == 1">
                                        <img class="fl" src="../../index/images/icon_renzheng.png" alt="" width="21px" style="margin:5px 0 0 10px">
                                    </template>
                                </div>
                                <p style="margin-top:8px;font-size:12px;">管理员: <span style="color:#2AA1E1">{{companyInfo.teamUserName}}</span></p>
                            </div>
                        </div>
                        <p style="font-size:12px;color:#909399;margin:50px 0 8px 0">我的企业信息</p>
                        <div class="clear" style="height:43px;line-height:43px;border-bottom:1px solid #EDEFF2">
                            <span class="fl">姓名</span>
                            <span class="fr" style="color:#909399">{{userDetails.employeeName ? userDetails.employeeName : '暂无设置'}}</span>
                        </div>
                        <div class="clear" style="height:43px;line-height:43px;border-bottom:1px solid #EDEFF2">
                            <span class="fl">电话</span>
                            <span class="fr" style="color:#909399">{{userDetails.phone  ? userDetails.phone : '暂无设置'}}</span>
                        </div>
                        <div class="clear" style="height:43px;line-height:43px;border-bottom:1px solid #EDEFF2">
                            <span class="fl">邮箱</span>
                            <span class="fr" style="color:#909399">{{userDetails.employeeEmail  ? userDetails.employeeEmail : '暂无设置'}}</span>
                        </div>
                        <div class="clear" style="height:43px;line-height:43px;border-bottom:1px solid #EDEFF2">
                            <span class="fl">部门</span>
                            <span class="fr" style="color:#909399">{{userDetails.department ? userDetails.department : '暂无设置'}}</span>
                        </div>
                        <div class="clear" style="height:43px;line-height:43px;">
                            <span class="fl">职位</span>
                            <span class="fr" style="color:#909399">{{userDetails.employeeJob ? userDetails.employeeJob  : '暂无设置'}}</span>
                        </div>
                        <div style="margin:190px auto;width:150px;height:50px;">
                            <el-button style="background:#4278BE;color:#fff;width:150px;height:50px;" @click="disbandTeam">退出团队</el-button>
                        </div>
                    </div>
                </div>
                <div v-show="hideCompany">
                    <div class="company_option">
                        <p style="margin:20px 0;color:#909399">请选择退出原因（必选）</p>
                        <el-radio-group v-model="radio">
                            <el-radio label="离职退出" >离职退出</el-radio><el-divider></el-divider>
                            <el-radio label="被拉入陌生组织">被拉入陌生组织</el-radio><el-divider></el-divider>
                            <el-radio label="加错企业">加错企业</el-radio><el-divider></el-divider>
                            <el-radio label="广告骚扰">广告骚扰</el-radio><el-divider></el-divider>
                            <el-radio label="重复加入">重复加入</el-radio><el-divider></el-divider>
                            <el-radio label="其他">其他</el-radio>
                        </el-radio-group>
                        <p style="color:#909399;margin:70px 0 15px 0;">说明（选填）</p>
                        <el-input type="textarea" v-model="desc" placeholder="请填写补充说明…" maxlength="200" show-word-limit></el-input>
                        <div style="margin:81px auto;width:150px;height:50px;">
                            <el-button class="unsubmit" :class="styleSubmit ? '' : 'active'" :disabled="styleSubmit" @click="handleSubmit">提交</el-button>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog
            :visible.sync="dialogVisible"
            width="30%"
            center
            >
            <div slot="title" class="header-title clear" style="border-bottom:1px solid #BFC2CC;height:42px;">
                <div style="width:16px;height:20px;background:#4278BE;float:left;margin-top:4px;margin-left:30px"></div>
                <div style="width:72px;height:31px;font-size:18px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:26px;float:left;margin-left:10px">提交确认</div>
            </div>
            <p>退出团队后，你将脱离脱离组织结构，并退出相关群聊，确定退出吗？</p>
            <span slot="footer" class="dialog-footer fr">
                <el-button @click="dialogVisible = false" style="border:1px solid #4278BE;color:#4278BE;width:109px;height:40px;">取 消</el-button>
                <el-button @click="handleSignUp" style="background:rgba(66,120,190,1);color:#fff;width:109px;height:40px;">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import bus from '../../../../modules/bus'
export default {
    name: 'myCompany',
    data() {
        return {
            ssoManager:'ssoManager',
            orgManager:'orgManager',
            activeName: 'first',
            tabNum: 0,
            radio: '',
            desc:'',
            dialogVisible: false,
            showCompany:true,
            hideCompany: false,
            userDetails:{},
            userInfo:JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')),
            companyObj:JSON.parse(window.sessionStorage.getItem('companyObj')),
            companyInfo:{},
            styleSubmit:true
        }
    },
    created () {
        this.getTeamInfo()
    },
    watch: {
        radio(newval) {
            if (newval != '') {
                this.styleSubmit = false
            }
        },
        companyObj () {
            this.getTeamInfo()
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab)
        },
        disbandTeam () {
            this.$http({
                method:'POST',
                url: this.orgManager + '/v1/organization/admin/queryAdminById',
                // url:'http://192.168.50.64:8013/v1/organization/team/logOutTeam',
                data:{
                    employeeId:this.userInfo.employeeId,
                    companyId:this.companyObj.companyId,
                }
            }).then(res => {
                if (res.data.code == 200) {
                    if (res.data.data != null) {
                        if (res.data.data.adminGrade == 1) {
                            this.$message.error('退出团队失败，请先转移管理员权限');
                        }
                    }else {
                        this.showCompany = false
                        this.hideCompany = true
                    }
                }
            })
        },
        handleSignUp () {
            this.$http({
                method:'POST',
                url: this.orgManager + '/v1/organization/team/logOutTeam',
                // url:'http://192.168.50.64:8013/v1/organization/team/logOutTeam',
                data:{
                    employeeId:this.userInfo.employeeId,
                    companyId:this.companyObj.companyId,
                    outpartyDTO:{
                        employeeName:this.userInfo.employeeName,
                        departmentName:this.companyObj.departmentName,
                        departmentId:this.companyObj.departmentId,
                        companyName:this.companyObj.label,
                        causeOfDropout:this.radio,
                        explain:this.desc,
                        iconUrl:this.companyObj.logoUrl,
                        phone:this.userInfo.phone
                    }
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.$http({
                        method:'POST',
                        url: this.ssoManager + '/v1/user/base/login/changeUserTeam',
                        data:{
                            phoneNumber:this.userInfo.phone,
                            teamUserId:this.userInfo.id,
                            companyId:res.data.data || ''
                        }
                    }).then(res => {
                        if (res.data.code == 200 && res.data.data.length != 0) {
                            window.sessionStorage.functionPermissionList = JSON.stringify(res.data.data.functionPermissionList)
                            window.sessionStorage.teamEmployeeDetailVO = JSON.stringify(res.data.data.teamEmployeeDetailVO)
                            window.sessionStorage.teamAdminRangeVOList = JSON.stringify(res.data.data.teamAdminRangeVOList)
                            window.sessionStorage.userInfoJoinApplyRegVOList = JSON.stringify(res.data.data.userInfoJoinApplyRegVOList)
                            window.sessionStorage.companyObj =  JSON.stringify(res.data.data.teamEmployeeDetailVO)
                        }else {
                            var teamEmployeeDetailVO = JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO'))
                            teamEmployeeDetailVO.companyId = ''
                            teamEmployeeDetailVO.companyName = ''
                            teamEmployeeDetailVO.department = ''
                            teamEmployeeDetailVO.departmentId = ''
                            window.sessionStorage.teamEmployeeDetailVO = JSON.stringify(teamEmployeeDetailVO)
                            window.sessionStorage.companyObj = JSON.stringify(teamEmployeeDetailVO)
                            this.$router.push({name:'searchTeam'})
                        }
                        this.dialogVisible = false
                        window.sessionStorage.setItem('showHeader',true)
                        this.$router.go(0)
                    })
                }
            })
        },
        handleSubmit () {
            this.dialogVisible = true
        },
        getTeamInfo () {
            this.$http({
                method:'GET',
                url: this.ssoManager + '/v1/teamInfo/getTeamInfoSimpleByTeamInfoId',
                params: {
                    teamInfoId:this.companyObj.companyId
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.companyInfo = res.data.data
                }
            })
            this.$http({
                method:'GET',
                url: this.ssoManager + '/v1/teamInfo/getTeamInfoForApp',
                params:{
                    teamInfoId:this.companyObj.companyId
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.companyObj.logoUrl = res.data.data.teamLogo
                }
            })
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/employee/queryByEmployeeId',
                data: {
                    companyId:this.companyObj.companyId,
                    id:this.userInfo.id,
                },
            }).then(res => {
                if (res.data.code == 200 && res.data.data != null) {
                    this.userDetails = res.data.data
                }
            })

        }
    },
    mounted() {
        bus.$on('companyObj',msg => {
            this.companyObj = msg
        })
    },
}
</script>

<style lang="scss">
.company_team {
    padding: 0 20px;
    height: 100%;
    box-sizing: border-box;
}
.company_team .el-tabs__header {
    margin: 0;
}
.company_team .el-tabs__item {
    color: #4278BE;
    font-size:18px;
}
.company_team .el-tabs__active-bar {
    height:5px;
    background:rgba(66,120,190,1);
}
.company_team .el-tabs__content{
    height: 100%;
    width: 100%;
    background-color: rgba(255,255,255,1);
}
.company_team .team_ruleForm {
    margin-top: 20px;
}
.company_team  .el-input__inner {
    height: 30px;
}
.company_team .el-tabs {
    height: 100%;
}
.company_team .tabColor {
    color: #4278BE;
}
.company_team .company_header {
    width:1200px;
    height:96px;
    padding: 20px 0 0 0px;
    box-sizing: border-box;
}
.company_team .company_content {
    width:807px;
    padding-left:85px;
    box-sizing: border-box;
    margin:0 auto;
}
.company_team .company_option {
    width: 807px;
    height: 500px;
    margin: 0 auto;
    // background: red;
}
.company_option .el-radio-group {
    width: 100%;
    font-size: 0;
}
.company_option .el-radio__input.is-checked .el-radio__inner {
    border-color: #DCDFE6;
    background: #4278BE;
}
.company_option .el-radio__input.is-checked+.el-radio__label {
    color: #303133;
}
.company_option .el-radio {
    color: #606266;
    cursor: pointer;
    margin-right: 0;
}
.company_option .el-divider--horizontal {
    margin: 14px 0;
}
.company_option .el-textarea__inner {
    height: 196px
}
.company_option .unsubmit {
    background:#EDEFF2;color:#BFC2CC;width:150px;height:50px;
}
.company_option .unsubmit.active {
    background:#4278BE;color:#fff;width:150px;height:50px;
}
.company_team .el-dialog {
    width: 409px !important;
    height: 278px !important;
    margin-top: 34vh !important
}
.company_team  .el-dialog__header {
    padding: 20px 0 10px;
}
.company_team .el-dialog__footer {
    padding: 40px 30px 20px;
}
.company_team .el-dialog--center .el-dialog__body {
    text-align: initial;
    padding: 25px 30px 30px;
}
</style>
