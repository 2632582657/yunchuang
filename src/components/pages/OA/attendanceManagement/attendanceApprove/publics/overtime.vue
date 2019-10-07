<template>
    <div class="overtime">
        <div>
            <div class="overtime_content">
                <div class="overtime_title">
                    <img
                        :src="overTimeList.userDetail ? overTimeList.userDetail.headUrl : ''"
                        alt
                        width="30px"
                        height="30px"
                        style="float:left; border-radius: 50%;border:1px solid black"
                    >
                    <span style="float:left;margin-left:10px;margin-top:10px">{{overTimeList.userDetail ? overTimeList.userDetail.userName : ''}}的加班</span>
                    <span style="float:left;margin-left:10px;color:#ccc;margin-top:10px">云创SaaS—产品经理</span>
                    <span style="float:left;margin-left:30px;margin-top:10px;color:orange;" v-if="overTimeList.statusName == '等待审批'">{{overTimeList.statusName}}</span>
                    <span style="float:left;margin-left:30px;margin-top:10px;color:green;" v-else-if="overTimeList.statusName == '审批通过'">{{overTimeList.statusName}}</span>
                    <span style="float:left;margin-left:30px;margin-top:10px;color:red;" v-if="overTimeList.statusName == '审批拒绝'">{{overTimeList.statusName}}</span>
                </div>
                <p style="margin-left:42px;margin-top:10px;color:#ccc">
                    {{overTimeList.createTime}}
                </p>
                <div class="overtime_type">
                    <div style="margin-top:15px;overflow: hidden;">
                        <p style="width:120px;text-align:right;float:left;">开始时间:</p>
                        <p style="margin-left:10px;float:left;">
                            {{overTimeList.startTime}}
                        </p>
                    </div>
                    <div style="margin-top:15px;overflow: hidden;">
                        <p style="width:120px;text-align:right;float:left;">结束时间:</p>
                        <p style="margin-left:10px;float:left;">
                            {{overTimeList.endTime}}
                        </p>
                    </div>
                    <div style="margin-top:15px;overflow:hidden">
                        <p style="width:120px;text-align:right;float:left">时长:</p>
                        <p style="margin-left:10px;float:left">
                            {{overTimeList.times}}小时
                        </p>
                    </div>
                    <div style="margin-top:15px;overflow:hidden">
                        <p style="width:120px;text-align:right;float:left">是否法定节假日:</p>
                        <p style="margin-left:10px;float:left">
                            {{overTimeList.holidays ? '是' : '否'}}
                        </p>
                    </div>
                    <div style="margin-top:15px;overflow: hidden;">
                        <div style="float:left;height:100%;width:120px;text-align:right">加班事由:</div>
                        <div style="float:right;width:727px">
                            {{overTimeList.content}}
                        </div>
                    </div>
                    <div style="margin-top:20px;overflow: hidden;">
                        <div style="float:left;height:100%;width:120px;text-align:right;margin-top:15px">审批人:</div>
                        <div style="float:right;width:727px;">
                            <div v-for="(approver,index) in overTimeList.approverList" style="overflow:hidden;float:left">
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
                                <p style="float:left;margin-top:15px;margin-left:10px" v-if="index !== overTimeList.approverList.length - 1">——————></p>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top:20px;overflow: hidden;">
                        <div style="float:left;height:100%;width:120px;text-align:right;margin-top:15px">抄送人:</div>
                        <div v-for="(recipientList,index) in overTimeList.recipientList" :key="index">
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
                    <template v-if="overTimeList.refuse != null && overTimeList.refuse != '' && overTimeList.refuse != '拒绝理由'">
                        <div style="margin-top:15px;overflow: hidden;">
                            <div style="float:left;height:100%;width:120px;text-align:right">拒绝理由:</div>
                            <div style="float:right;width:727px">
                                {{overTimeList.refuse}}
                            </div>
                        </div>
                    </template>
                    <template v-else></template>
                </div>
                <div class="overtime_footer">
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
        </div>
        <div class="overtime_button">
            <el-button plain @click="agree">同意</el-button>
            <el-button plain @click="refuse">拒绝</el-button>
        </div>
        <Mongolia ref="mongolia" :batchArray='batchArray' :loadNextUsers = loadNextUsers></Mongolia>
    </div>
</template>

<script>
import Mongolia from './dialog'
export default {
    name: 'overtime',
    data() {
        return {
            overTimeList: '',
            waitTime: '',
            batchArray: [
                {
                    id: this.$route.query.id,
                    step: this.$route.query.step,
                    applyId: 4
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
    created() {
        this.loadOverList()
    },
    watch :{
    　'$route': function (to, from) {
        //执行数据更新查询
            if (to.path == '/overtime') {
                this.loadOverList()
            }else {
            }
    　　}
    },
    components:{
        Mongolia
    },
    methods: {
        loadOverList () {
            this.$http({
                method: 'GET',
                url: '/oaManage/v1/oa/approval/overtime/' + this.$route.query.id
            }).then(res => {
                // console.log(res.data)
                if (res.data.code === 200 && res.data.sysCode === 200) {
                    this.overTimeList = res.data.data
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
            var begintime_ms = Date.parse(this.overTimeList.updateTime)
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
                    console.log(this.loadNextUsers.userDetail)
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
        handleNext () {
            if (this.vacationIndex + 1 === this.vacation.length) {
                this.$message.error('已经是最后一篇了');
            }else {
                this.$router.push({
                name: this.vacation[this.vacationIndex + 1].applyId==1?"leave":(this.vacation[this.vacationIndex + 1].applyId==2?"businessTravel":(this.vacation[this.vacationIndex + 1].applyId==3?"patchCard":(this.vacation[this.vacationIndex + 1].applyId==4?"overtime":"reimbursement"))),
                path:this.vacation[this.vacationIndex + 1].applyId==1?"/leave":(this.vacation[this.vacationIndex + 1].applyId==2?"/businessTravel":(this.vacation[this.vacationIndex + 1].applyId==3?"/patchCard":(this.vacation[this.vacationIndex + 1].applyId==4?"/overtime":"/reimbursement"))),
                query: {id: this.vacation[this.vacationIndex + 1].id,step:this.overTimeList.step,allList:this.vacation}
                })
            }
        },
        handleTop () {
            if (this.vacationIndex - 1 === -1) {
                this.$message.error('已经是第一篇了');
            }else {
                this.$router.push({
                name: this.vacation[this.vacationIndex - 1].applyId==1?"leave":(this.vacation[this.vacationIndex - 1].applyId==2?"businessTravel":(this.vacation[this.vacationIndex - 1].applyId==3?"patchCard":(this.vacation[this.vacationIndex - 1].applyId==4?"overtime":"reimbursement"))),
                path:this.vacation[this.vacationIndex - 1].applyId==1?"/leave":(this.vacation[this.vacationIndex - 1].applyId==2?"/businessTravel":(this.vacation[this.vacationIndex - 1].applyId==3?"/patchCard":(this.vacation[this.vacationIndex - 1].applyId==4?"/overtime":"/reimbursement"))),
                query: {id: this.vacation[this.vacationIndex - 1].id,step:this.overTimeList.step,allList:this.vacation}
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
.overtime {
    width: 100%;
    background: #fff;
}
.overtime_content {
    width: 900px;
    margin: 0 auto;
    border-bottom: 1px solid #ccc
}
.overtime_title {
    padding-top: 20px;
    overflow: hidden;
}
.overtime_type {
    margin-top: 20px;
    margin-left: 42px;
}
.overtime_footer {
    margin-top: 40px;
    margin-bottom: 20px;
    overflow: hidden;
}
.overtime_button {
    width: 900px;
    margin: 0 auto;
    text-align: center;
}
.overtime_button .el-button {
    margin: 20px 40px
}
</style>
