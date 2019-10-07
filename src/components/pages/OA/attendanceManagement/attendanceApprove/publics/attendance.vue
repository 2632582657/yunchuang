<template>
    <div class="leave">
        <div class="leave_content">
            <div class="leave_title">
                <img
                    :src="vacationTime.userDetail ? vacationTime.userDetail.headUrl : ''"
                    alt
                    width="30px"
                    height="30px"
                    style="float:left; border-radius: 50%;border:1px solid black"
                >
                <span style="float:left;margin-left:10px;margin-top:10px">{{vacationTime.userDetail ? vacationTime.userDetail.userName : ''}}的请假</span>
                <span style="float:left;margin-left:10px;color:#ccc;margin-top:10px">云创SasS——产品经理</span>
                <span style="float:left;margin-left:30px;margin-top:10px;color:orange;" v-if="vacationTime.statusName == '等待审批'">{{vacationTime.statusName}}</span>
                <span style="float:left;margin-left:30px;margin-top:10px;color:green;" v-else-if="vacationTime.statusName == '审批通过'">{{vacationTime.statusName}}</span>
                <span style="float:left;margin-left:30px;margin-top:10px;color:red;" v-if="vacationTime.statusName == '审批拒绝'">{{vacationTime.statusName}}</span>
            </div>
            <p style="margin-left:42px;margin-top:10px;color:#ccc">
                {{vacationTime.createTime}}
            </p>
            <div class="leave_type">
                <div style="margin-top:15px">
                    <span style="width:60px">请假类型:</span>
                    <span style="margin-left:5px">{{vacationTime.vacationTypeName}}</span>
                </div>
                <div style="margin-top:15px">
                    <span style="width:60px">开始时间:</span>
                    <span style="margin-left:5px">
                       {{vacationTime.startDay}}
                    </span>
                </div>
                <div style="margin-top:15px">
                    <span style="width:60px">结束时间:</span>
                    <span style="margin-left:5px">
                       {{vacationTime.endDay}}
                    </span>
                </div>
                <div style="margin-top:15px;overflow: hidden;">
                    <div style="float:left;height:100%;width:60px;">请假事由:</div>
                    <div style="float:right;width:786px" >
                        {{vacationTime.content}}
                    </div>
                </div>
                <div style="margin-top:15px;overflow: hidden;">
                    <div style="float:left;height:100%;width:60px;text-align:right">图片:</div>
                    <div style="float:right;width:786px" >
                        <div style="float:left;height:100px;width:100px;margin-right:20px;" v-for="img in vacationTime.imgUrls">
                            <img :src="img" alt="" width="100px">
                        </div>
                    </div>
                </div>
                <div style="margin-top:20px;overflow: hidden;">
                    <div style="float:left;height:100%;width:58px;text-align:right;margin-top:15px">审批人:</div>
                    <div style="float:right;width:789px;">
                        <div v-for="(approver,index) in vacationTime.approverList" style="overflow:hidden;float:left">
                            <div v-for="item in approver" style="float:left">
                                <div style="width:50px;height:50px;border-radius:50%;">
                                    <img :src="item.headUrl" alt="" style="width:50px;height:50px;border-radius:50%;border:1px solid black;">
                                </div>
                                <p>{{item.userName}}
                                    <span style="margin-left:10px;color:orange;" v-if="item.status == '等待审批'">({{item.status}})</span>
                                    <span style="margin-left:10px;color:green" v-else-if="item.status == '审批通过'">({{item.status}})</span>
                                    <span style="margin-left:10px;color:red" v-else-if="item.status == '审批拒绝'">({{item.status}})</span>
                                </p>
                                <p style="margin-top:5px">
                                    <template v-if="item.status != null && item.status != ''">
                                        <template v-if="item.updateTime != null && item.updateTime != ''">
                                            <span style="color:#ccc">
                                                {{item.updateTime}}
                                            </span>
                                        </template>
                                        <template v-else>
                                            <span style="color:#ccc">
                                                等待{{waitTime}}
                                            </span>
                                        </template>
                                    </template>
                                </p>
                            </div>
                            <p style="float:left;margin-top:15px;margin-left:10px" v-if="index !== vacationTime.approverList.length -1">——————></p>
                        </div>
                    </div>
                </div>
                <div style="margin-top:20px;overflow: hidden;">
                    <div style="float:left;height:100%;width:58px;text-align:right;margin-top:15px">抄送人:</div>
                    <div v-for="(recipientList,index) in vacationTime.recipientList" :key="index">
                        <div style="float:left;margin-left:10px;">
                            <div style="border:1px solid black;border-radius:50%;">
                                <img :src="recipientList.headUrl" alt="" style="width:50px;height:50px;border-radius:50%;">
                            </div>
                            <div style="margin-top:15px">
                                <p>{{recipientList.userName}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <template v-if="vacationTime.refuse != null && vacationTime.refuse != '' && vacationTime.refuse != '拒绝理由'">
                    <div style="margin-top:15px;overflow: hidden;">
                        <div style="float:left;height:100%;width:60px;">拒绝理由:</div>
                        <div style="float:right;width:786px">
                            {{vacationTime.refuse}}
                        </div>
                    </div>
                </template>
                <template v-else></template>
            </div>
            <div class="leave_footer">
                <div style="float:right;" @click="handleNext">
                    <i class="el-icon-arrow-down"></i>
                    <template v-if="loadNextUsers.userDetail == undefined">
                        <span>已经是最后一篇了</span>
                    </template>
                    <template v-else>
                        <span>{{loadNextUsers.userDetail ? loadNextUsers.userDetail.userName : ''}}的{{ vacation && vacation.length > 1 ? vacation[vacationIndex + 1].applyId==1?"请假": vacation[vacationIndex + 1].applyId==2?"出差": vacation[vacationIndex + 1].applyId==3?"补卡": vacation[vacationIndex + 1].applyId==4?"加班":"报销" : '' }}</span>
                    </template>
                </div>
                <div style="float:right;margin-right:20px" @click="handleTop">
                    <i class="el-icon-arrow-up"></i>
                    <template v-if="loadTopUsers.userDetail == undefined">
                        <span>已经是第一篇</span>
                    </template>
                    <template v-else>
                        <span>{{loadTopUsers.userDetail ? loadTopUsers.userDetail.userName : ''}}的{{ vacation && vacation.length > 1 ? vacation[vacationIndex - 1].applyId==1?"请假": vacation[vacationIndex - 1].applyId==2?"出差": vacation[vacationIndex - 1].applyId==3?"补卡": vacation[vacationIndex - 1].applyId==4?"加班":"报销" : '' }}</span>
                    </template>
                </div>
            </div>
        </div>
        <div class="leave_button">
            <el-button plain @click="agree">同意</el-button>
            <el-button plain @click="refuse">拒绝</el-button>
        </div>
        <Mongolia ref="mongolia" :batchArray = batchArray></Mongolia>
    </div>
</template>

<script>
import Mongolia from './dialog'
export default {
    name: 'leave',
    data() {
        return {
            vacationTime: '',
            waitTime: '',
            batchArray: [
                {
                    id: this.$route.query.id,
                    step: this.$route.query.step,
                    applyId: 1
                }
            ],
            status: '',
            refuses: '',
            vacation: [],
            vacationIndex: '',
            loadNextUsers: {},
            loadTopUsers: {}
        }
    },
    components:{
        Mongolia
    },
    created() {
        this.loadVacation()
    },
    watch :{
    　'$route': function (to, from) {
            this.loadVacation()
    　　}
    },
    methods: {
        loadVacation () {
            this.$http({
                method: 'GET',
                url: '/oaManage/v1/oa/approval/vacation/' + this.$route.query.id
            }).then(res => {
                if (res.data.code === 200 && res.data.sysCode === 200) {
                    this.vacationTime = res.data.data
                    this.vacation = this.$route.query.allList
                    this.vacationIndex = this.vacation.findIndex(item => {
                        return item.id === this.$route.query.id
                    })
                    this.time()
                    this.loadNextUser()  
                    this.loadTopUser()
                    }
            })
        },
        time () {
            var msg = '';
            var current = new Date()
            var begintime_ms = Date.parse(this.vacationTime.updateTime)
            var date3=current.getTime()-begintime_ms  //时间差的毫秒数
            //计算出相差天数
            var days=Math.floor(date3/(24*3600*1000))
            if(days > 0){
                msg += days+"天";
            }
            //计算出小时数
            var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
            var hours=Math.floor(leave1/(3600*1000))
            if(hours > 0){
                msg += hours+"小时";
            }
            //计算相差分钟数
            var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
            var minutes=Math.floor(leave2/(60*1000))
            if(minutes > 0){
                msg += minutes+"分钟";
            }
            //计算相差秒数
            // var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
            // var seconds=Math.round(leave3/1000)
            // if(seconds > 0){
            //     msg += seconds+"秒";
            // }
            this.waitTime = msg
        },
        agree () {
            this.$http({
                method: "PUT",
                url: "/oaManage/v1/oa/approval/approve",
                data: {
                    batch:this.batchArray,
                    status: 1,  //  1-审批通过；2审批拒绝
                    refuse:this.refuses
                }
            }).then(res => {
                if (res.data.code === 200 & res.data.sysCode === 200 ) {
                    if (this.loadNextUsers.userDetail == undefined) {
                        this.$message.success("审批完成，已全部审批完毕");
                    }else {
                        this.$message.success("审批完成，马上进入下一篇");
                        this.handleNext()
                    }
                }
            }).catch(error=>{
                this.$message.error(error.message);
            });
        },
        refuse () {
            this.$refs.mongolia.centerDialogVisible = true
        },
        handleTop () {
            if (this.vacationIndex - 1 === -1) {
                this.$message.error('已经是第一篇了');
            }else {
                this.$router.push({
                // name: this.vacation[this.vacationIndex - 1].applyId==1?"leave":(this.vacation[this.vacationIndex - 1].applyId==2?"businessTravel":(this.vacation[this.vacationIndex - 1].applyId==3?"patchCard":(this.vacation[this.vacationIndex - 1].applyId==4?"overtime":"reimbursement"))),
                path: this.vacation[this.vacationIndex - 1].applyId==1?"/leave":(this.vacation[this.vacationIndex - 1].applyId==2?"/businessTravel":(this.vacation[this.vacationIndex - 1].applyId==3?"/patchCard":(this.vacation[this.vacationIndex - 1].applyId==4?"/overtime":"/reimbursement"))),
                query: {id: this.vacation[this.vacationIndex - 1].id,step:this.vacationTime.step,allList:this.vacation}
                })
            }
        },
        handleNext () {
            if (this.vacationIndex + 1 === this.vacation.length) {
                this.$message.error('已经是最后一篇了');
            }else {
                this.$router.push({
                name: this.vacation[this.vacationIndex + 1].applyId==1?"leave":(this.vacation[this.vacationIndex + 1].applyId==2?"businessTravel":(this.vacation[this.vacationIndex + 1].applyId==3?"patchCard":(this.vacation[this.vacationIndex + 1].applyId==4?"overtime":"reimbursement"))),
                path:this.vacation && this.vacation.length > 1 ? this.vacation[this.vacationIndex + 1].applyId==1?"/leave":(this.vacation[this.vacationIndex + 1].applyId==2?"/businessTravel":(this.vacation[this.vacationIndex + 1].applyId==3?"/patchCard":(this.vacation[this.vacationIndex + 1].applyId==4?"/overtime":"/reimbursement"))) : '',
                query: {id: this.vacation && this.vacation.length > 1 ? this.vacation[this.vacationIndex + 1].id : '',step: this.vacation && this.vacation.length > 1 ? this.vacationTime.step : '',allList:this.vacation}
                })
            }
        },
        loadNextUser () {
            var url = this.vacation && this.vacation[this.vacationIndex + 1] != undefined  ? this.vacation[this.vacationIndex + 1].applyId==1?"/oaManage/v1/oa/approval/vacation/" :(this.vacation[this.vacationIndex + 1].applyId==2?"/oaManage/v1/oa/approval/trip/" :(this.vacation[this.vacationIndex + 1].applyId==3?"/oaManage/v1/oa/approval/fillcard/" :(this.vacation[this.vacationIndex + 1].applyId==4?"/oaManage/v1/oa/approval/overtime/" :"/oaManage/v1/oa/approval/reimburse/"))) :''
            var id = this.vacation && this.vacation[this.vacationIndex + 1] != undefined  ? this.vacation[this.vacationIndex + 1].id : ''
            if (url == '') {
                
                 this.$http({
                    method: 'GET',
                    url: url + id
                }).then(res => {
                    if (res.data.code === 200 && res.data.sysCode === 200) {
                        this.loadNextUsers = res.data.data
                    }
                }).catch(error =>{
                    // console.log(error)
                })
            }else {
               this.loadNextUsers = {}
            }
        },
        loadTopUser () {
            if (this.vacation[this.vacationIndex - 1]  != undefined) {
                this.$http({
                    method: 'GET',
                    url: this.vacation && this.vacation.length > 1 ? this.vacation[this.vacationIndex - 1].applyId==1?"/oaManage/v1/oa/approval/vacation/ " + this.vacation[this.vacationIndex - 1].id :(this.vacation[this.vacationIndex - 1].applyId==2?"/oaManage/v1/oa/approval/trip/" + this.vacation[this.vacationIndex - 1].id:(this.vacation[this.vacationIndex - 1].applyId==3?"/oaManage/v1/oa/approval/fillcard/" + this.vacation[this.vacationIndex - 1].id :(this.vacation[this.vacationIndex - 1].applyId==4?"/oaManage/v1/oa/approval/overtime/" + this.vacation[this.vacationIndex - 1].id :"/oaManage/v1/oa/approval/reimburse/" + this.vacation[this.vacationIndex - 1].id))) : ''
                }).then(res => {
                    if (res.data.code === 200 && res.data.sysCode === 200) {
                        this.loadTopUsers = res.data.data
                    }
                })
            }else {

            }
        }
    }
}
</script>

<style lang="scss">
.leave {
    width: 100%;
    background: #fff;
}
.leave_content {
    width: 900px;
    margin: 0 auto;
    border-bottom: 1px solid #ccc
}
.leave_title {
    padding-top: 20px;
    overflow: hidden;
}
.leave_type {
    margin-top: 20px;
    margin-left: 42px;
}
.leave_footer {
    margin-top: 40px;
    margin-bottom: 20px;
    overflow: hidden;
}
.leave_button {
    width: 900px;
    margin: 0 auto;
    text-align: center;
}
.leave_button .el-button {
    margin: 20px 40px
}
</style>
