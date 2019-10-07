<template>
    <div class="supervisor">
        <div v-show="firstShow">
            <el-form ref="form" label-width="100px">
                <el-form-item label="当前主管理员:">
                   {{companyInfo.teamUserName}}
                </el-form-item>
                <el-form-item label="手机号码:" >
                    <el-input v-model="phone" maxlength="11" class="fl" placeholder="请输入手机号" readonly @input="VerificationPhone"></el-input>
                    <input
                        class="btn"
                        :class="reg ? 'btnclor' : ''"
                        type="button"
                        v-model = "messageAuthenticationCode"
                        @click='getCodebtn'
                        :disabled = "disab"/>
                </el-form-item>
                <el-form-item label="验证码:">
                    <el-input v-model="smsCode" @input="VerificationPhone" maxlength="4" placeholder="请输入验证码"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" style="width:150px;height:50px;background:rgba(66,120,190,1);border-radius:3px;color:#fff;margin-top:35px;" @click="onSubmit">下一步</el-button>
        </div>
        <div  v-show="secondShow">
            <el-form label-width="100px">
                    <el-form-item label="新的主管理员:">
                        <el-input v-model="masterAdmin.name" class="fl" placeholder="选择新的主管理员" @focus="personDialogVisible = true" readonly></el-input>
                    </el-form-item>
            </el-form>
            <el-button type="primary" style="width:150px;height:50px;background:rgba(66,120,190,1);border-radius:3px;color:#fff;margin-top:35px;" @click="handleSubmit">下一步</el-button>
        </div>
        <div ref="persondialog">
            <persondialog
                :treeData="data"
                :defaultProps="{label:'name',children:'children'}"
                :transferTitle="['选择部门人员', '已选择']"
                :dialogVisible="personDialogVisible"
                @handlePersonClose="handlePersonClose"
                :select="true"
                @handlePsrsonSubmit="handlePsrsonSubmit">
            </persondialog>
        </div>
    </div>
</template>

<script>
import persondialog from '../../../commons/persondialog'
import bus from '../../../../modules/bus'
export default {
    name:'supervisor',
    data () {
        return {
            orgManager:'orgManager',
            ssoManager:'ssoManager',
            data: [],
            // companyObj: JSON.parse(window.sessionStorage.getItem('companyObjDetailVO')),
            companyObj:JSON.parse(window.sessionStorage.getItem('companyObj')),
            phone:JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')).phone,
            smsCode:'',
            disab:false,
            messageAuthenticationCode:"获取验证码",
            Timeout:"",
            personDialogVisible:false,
            countDownTime:60,
            reg:false,
            firstShow:true,
            secondShow:false,
            masterAdmin:'',
            companyInfo:{},
        }
    },
    watch: {
        // companyObj (newval) {
        //     console.log(newval)
        //     this.handleDatas()
        //     this.getTeamInfo()
        // }
    },
    components: {
        persondialog
    },
    created () {
        this.handleDatas()
        this.getTeamInfo()
    },
    methods: {
        handleDatas () {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/department/queryAddressBook2',
                data: {
                    companyId:this.companyObj.companyId
                },
            }).then(res => {
                if (res.data.code == 200) {
                    this.data = res.data.data.children ? res.data.data.children : []
                }
            })
        },
        getTeamInfo () {
            this.$http({
                method: 'GET',
                url: this.ssoManager + '/v1/teamInfo/getTeamInfoSimpleByTeamInfoId',
                params: {
                    teamInfoId:this.companyObj.companyId
                },
            }).then(res => {
                if (res.data.code == 200) {
                    this.companyInfo = res.data.data
                }
            })
        },
        getCodebtn:function () {
            this.$http({
                method:'GET',
                url: this.ssoManager + '/v1/user/base/login/loginSmsCode',
                params:{
                    phoneNumberPrefix: 86,
                    phoneNumber: this.phone,
                }
            }).then(res => {
                this.$message({
                    type:'success',
                    message:res.data.message
                })
                if (res.data.code == 200) {
                    this.disab = true
                    this.reg = true
                    this.Timeout = setTimeout(this.enableCodeBtn,1000);
                }
            })
        },
        enableCodeBtn:function () {
			this.disab = true;
            if(this.countDownTime > 0) {
                this.messageAuthenticationCode =  this.countDownTime + 's';
                this.Timeout = setTimeout(this.enableCodeBtn, 1000);  //1秒后再次调用自己
                this.countDownTime--;
            } else {
                clearTimeout(this.Timeout);
                this.disab=false;
                this.reg = false
                this.messageAuthenticationCode = "获取验证码";
                this.countDownTime = 60;
            }
        },
        onSubmit () {
            this.$http({
                method:'GET',
                url: this.ssoManager + '/v1/user/base/login/smsLogin',
                params: {
                    phoneNumberPrefix:86,
                    phoneNumber:this.phone,
                    smsCode:this.smsCode
                }
            }).then(res => {
                if (res.data.code == 200) {
                    if (res.data.data.validationState) {
                        this.secondShow = true
                        this.firstShow = false
                    }else {
                        this.$message({
                            type:'error',
                            message:'验证码输入错误'
                        })
                    }
                }
            })
        },
        handleSubmit () {
            this.$http({
                method:'POST',
                url: this.orgManager + '/v1/organization/admin/replaceMasterAdmin',
                data: {
                    employeeId:this.masterAdmin.id,
                    companyId:this.companyObj.companyId,

                }
            }).then(res => {
                if (res.data.code == 200) {
                    // this.changeAdminToEmployee()
                    this.$message({
                        type:'success',
                        message:res.data.message
                    })
                    window.sessionStorage.setItem('companyStatus',false)
                    window.sessionStorage.setItem('companyObj',JSON.stringify(this.companyObj))
                    this.$router.push({name:'frameWork'})
                    bus.$emit('pushRefresh',true)
                }
            })
        },
        // changeAdminToEmployee () {
        //     this.$http({
        //         method:'POST',
        //         url:this.ssoManager + '/v1/user/base/login/changeAdminToEmployee',
        //         data: {
        //             teamUserId:this.companyObj.id,
        //             companyId:this.companyObj.companyId,
        //         }
        //     }).then(res => {
        //         if (res.data.code == 200) {
        //             window.sessionStorage.functionPermissionList = JSON.stringify(res.data.data.functionPermissionList)
        //             window.sessionStorage.companyObjDetailVO = JSON.stringify(res.data.data.companyObjDetailVO)
        //             window.sessionStorage.userInfoJoinApplyRegVO = JSON.stringify(res.data.data.userInfoJoinApplyRegVO)
        //             window.sessionStorage.token = res.data.data.token;
        //             window.sessionStorage.setItem('companyStatus',false)
        //             this.$router.push({name:'frameWork'})
        //         }
        //     })
        // },
        VerificationPhone () {
            if (!/^[1-9]\d*$|^$/.test(this.phone)) {
                this.phone = ''
            }
        },
        handlePersonClose () {
            this.personDialogVisible = false
        },
        handlePsrsonSubmit(value) {
            if (value.length != 0) {
                this.masterAdmin = value[0]
                this.personDialogVisible = false
            }
        }
    },
    mounted () {
        bus.$on('companyObj',msg => {
            this.companyObj = msg
        })
    },
}
</script>

<style lang="scss">
.supervisor {
    width:100%;
    height: 100%;
    padding: 10px 0 0 20px;
    background: #fff;
    .el-form {
        width: 560px;
        .el-input {
            height: 30px;
            width: 270px;
        }
        .el-input__inner {
            height: 30px;
            width: 270px;
        }
        .el-form-item {
            margin-bottom: 15px;
        }
    }
    .btn{
        width:109px;
        margin: 5px 0 0 14px;
        height:30px;
        border-radius:3px;
        border:1px solid #BFC2CC;
        background: #FFFFFF;
        color:#606266;
        cursor: pointer;
    }
    .btnclor {
        background: #EDEFF2;
        color:#BFC2CC;
    }
}
</style>
