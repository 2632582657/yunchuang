<template>
    <div class="teamInvitation">
		<img src="../images/jiarutuandui@2x.png" style="width: 44px;height: 44px;position: absolute;top:-55px;margin-left: -6px;z-index:99;">
        <div class="Invitation_c">
            <div class="Invitation_list" v-for="item in invitationList"  v-if="item.applyType == 1">
                <div class="clear">
                    <p class="fl">{{item.teamInfoName}}</p>
                    <p class="fr" style="color:#909399">{{item.createTime}}</p>
                </div>
                <div class="clear" style="margin-top:18px">
                    <div class="fl" style="color:#606266">邀请您加入团队</div>
                    <div class="fr" style="margin-top:10px" v-if="item.invitationResult == 0">
                        <el-button style="border:1px solid #4278BE;color:#4278BE;width:158px;height:36px;line-height:10px" @click="handleApplyTeam(item.id,2)">我不在这个团队</el-button>
                        <el-button style="background:rgba(66,120,190,1);color:#fff;width:114px;height:36px;line-height:10px" @click="handleApplyTeam(item.id,1)">接受邀请</el-button>
                    </div>
                    <div class="fr" style="margin-top:10px" v-if="item.invitationResult == 1">
                        <div style="color:#4FBE96;margin-top:10px">同意</div>
                    </div>
                    <div class="fr" style="margin-top:10px" v-if="item.invitationResult == 2">
                        <div style="color:#FF6565;margin-top:10px">拒绝</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            orgManager:'orgManager',
            ssoManager:'ssoManager',
            adminInfo:JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')),
            invitationList:[],
        }
    },
    created() {
        this.getUserInfoJoinApplyByEmployee()
    },
    methods: {
        getUserInfoJoinApplyByEmployee () {
            this.$http({
                method:'GET',
                url: this.ssoManager + '/v1/oa/userInfoJoinApply/getUserInfoJoinApplyByEmployee',
                params:{
                    employeeId:this.adminInfo.employeeId
                }
            }).then(res => {
                if (res.data.code == 200) {
                	console.log(res)
                    this.invitationList = res.data.data
                }
            })
        },
        handleApplyTeam (id,flag) {
            this.$http({
                method:'POST',
                url:this.ssoManager + '/v1/oa/userInfoJoinApply/userInfoApprovalJoinApply',
                data:{
                    applyId:id,
                    invitationResult:flag
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type:'success',
                        message:res.data.message
                    })
                    window.sessionStorage.setItem('showHeader',true)
                    this.$router.go(0)
                    this.getUserInfoJoinApplyByEmployee()
                }
            })
        }
    },
    mounted() {
    },
}
</script>
<style>
.teamInvitation {
    position: relative;
    height: 100%;
    width: 100%;
    padding: 1px 20px 0 20px;
    box-sizing: border-box;
    color: #303133;
    background: #fff;
}
.teamInvitation_icon{
    position: absolute;
    height: 44px;
    left: 12px;
    top: -75px;
}
.Invitation_c {
    padding-top: 15px;
}
.Invitation_list {
    height: 117px;
    width: 100%;
    padding: 20px 50px;
    margin-bottom: 25px;
    border: 1px solid #4278BE;
    box-sizing: border-box;
}
</style>
