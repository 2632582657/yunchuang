<template>
    <div class="reimbursement">
        <div class="reimbursement_content">
            <div class="reimbursement_title">
                <img
                    :src="reimburseTime.userDetail? reimburseTime.userDetail.headUrl :''"
                    alt
                    width="30px"
                    height="30px"
                    style="float:left; border-radius: 50%;border:1px solid black"
                >
                <span style="float:left;margin-left:10px;margin-top:10px">{{reimburseTime.userDetail ? reimburseTime.userDetail.userName : ''}}的报销</span>
                <span style="float:left;margin-left:10px;color:#ccc;margin-top:10px">云创SasS——产品经理</span>
                <span style="float:left;margin-left:30px;margin-top:10px;color:orange;" v-if="reimburseTime.statusName == '等待审批'">{{reimburseTime.statusName}}</span>
                <span style="float:left;margin-left:30px;margin-top:10px;color:green;" v-else-if="reimburseTime.statusName == '审批通过'">{{reimburseTime.statusName}}</span>
                <span style="float:left;margin-left:30px;margin-top:10px;color:red;" v-if="reimburseTime.statusName == '审批拒绝'">{{reimburseTime.statusName}}</span>
            </div>
            <p style="margin-left:42px;margin-top:10px;color:#ccc">
                2019-06-13
                <span>13:23</span>
            </p>

            <!-- 没有明细内容 -->
            <!-- <div class="reimbursement_type">
                <div style="margin-top:15px;overflow: hidden;">
                    <p style="width:120px;text-align:right;float:left;">报销名称:</p>
                    <p style="margin-left:10px;float:left;">
                        打车费
                    </p>
                </div>
                <div style="margin-top:15px;overflow: hidden;">
                    <p style="width:120px;text-align:right;float:left;">报销类别:</p>
                    <p style="margin-left:10px;float:left;">
                        差旅费
                    </p>
                </div>
                <div style="margin-top:15px;overflow:hidden">
                    <p style="width:120px;text-align:right;float:left">报销金额:</p>
                    <p style="margin-left:10px;float:left">
                        35.00
                    </p>
                </div>
                <div style="margin-top:15px;overflow:hidden">
                    <p style="width:120px;text-align:right;float:left">总金额:</p>
                    <p style="margin-left:10px;float:left">
                        35.00
                    </p>
                </div>
                <div style="margin-top:20px;overflow: hidden;">
                    <div style="float:left;height:100%;width:120px;text-align:right;margin-top:15px">审批人:</div>
                    <div style="float:right;width:765px">
                        <div>
                            <div style="width:50px;height:50px;border-radius:50%;border:1px solid black;float:left">
                                <img src="" alt="">
                            </div>
                            <p style="float:left;margin-top:15px;margin-left:10px">——————></p>
                            <div style="width:50px;height:50px;border-radius:50%;border:1px solid black;float:left;margin-left:10px">
                                <img src="" alt="">
                            </div>
                            <p style="float:left;margin-top:15px;margin-left:10px"> ——————></p>
                            <div style="width:50px;height:50px;border-radius:50%;border:1px solid black;float:left;margin-left:10px">
                                <img src="" alt="">
                            </div>
                        </div>
                    </div>
                    <div style="margin-top:68px;margin-left:70px;oveflow:hidden">
                        <div style="float:left;margin-left: 70px">
                            <p>张喜爱<span style="color:green;margin-left:10px">(已同意)</span></p>
                            <p style="margin-top:5px">
                                <span style="color:#ccc">
                                    06-04
                                </span>
                                <span style="color:#ccc;margin-left:10px">
                                    14:43
                                </span>
                            </p>
                        </div>
                        <div style="float:left;margin-left:70px">
                            <p>李军<span style="color:green;margin-left:10px">(已同意)</span></p>
                            <p style="margin-top:5px">
                                <span style="color:#ccc">
                                    06-04
                                </span>
                                <span style="color:#ccc;margin-left:10px">
                                    14:43
                                </span>
                            </p>
                        </div>
                        <div style="float:left;margin-left:70px">
                            <p>赵恒<span style="color:red;margin-left:10px">(已同意)</span></p>
                            <p style="margin-top:5px">
                                <span style="color:#ccc">
                                    06-04
                                </span>
                                <span style="color:#ccc;margin-left:10px">
                                    14:43
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div style="margin-top:20px;overflow: hidden;">
                    <div style="float:left;height:100%;width:120px;text-align:right;margin-top:15px">抄送人:</div>
                    <div style="float:right;width:765px">
                        <div style="width:50px;height:50px;border-radius:50%;border:1px solid black;float:left">
                            <img src="" alt="">
                        </div>
                        <div style="margin-top:65px">
                            <p>张喜爱</p>
                        </div>
                    </div>
                </div>
                <div style="margin-top:15px;overflow:hidden;">
                    <p style="width:120px;text-align:right;float:left">关联报销单:</p>
                    <div style="margin-left:10px;float:left;overflow:hidden;border:1px solid #ccc;padding:10px 20px;width:330px">
                        <img src="../../../../../../assets/logo.png" alt="" width="50px" style="border:1px solid #ccc;float:left">
                        <div style="float:left;">
                            <p>王小明的外出出差</p>
                            <p style="margin-top:15px;color:#ccc">2019-06-03  <span>13:23</span></p>
                        </div>
                        <div style="float:left;margin-left:20px;color:orange">待审批</div>
                    </div>
                </div>
            </div> -->
            <!-- 没有明细内容 -->



            <!-- 有明细内容 -->
            <div v-for="(item,index) in reimburseTime.content">
                <div class="reimbursement_detailed">
                    <p>明细{{index + 1 }}</p>
                </div>
                <div class="reimbursement_type">
                    <div style="margin-top:15px;overflow: hidden;">
                        <p style="width:88px;text-align:right;float:left;">报销名称:</p>
                        <p style="margin-left:10px;float:left;">
                            {{item.name}}
                        </p>
                    </div>
                    <div style="margin-top:15px;overflow: hidden;">
                        <p style="width:88px;text-align:right;float:left;">报销类别:</p>
                        <p style="margin-left:10px;float:left;">
                            {{item.type}}
                        </p>
                    </div>
                    <div style="margin-top:15px;overflow: hidden;">
                        <p style="width:88px;text-align:right;float:left;">报销金额:</p>
                        <p style="margin-left:10px;float:left;">
                            {{item.amount}}元
                        </p>
                    </div>
                </div>
            </div>
            <el-divider></el-divider>
            <div class="reimbursement_type">
               <div style="margin-top:15px;overflow: hidden;">
                    <p style="width:88px;text-align:right;float:left;">总金额:</p>
                    <p style="margin-left:10px;float:left;">
                        {{reimburseTime.total}}元
                    </p>
                </div>
            </div>
            <el-divider></el-divider>
            <div style="margin-top:20px;overflow: hidden;">
                <div style="margin-top:20px;overflow: hidden;">
                    <div style="float:left;height:100%;width:58px;text-align:right;margin-top:15px">审批人:</div>
                    <div style="float:left;width:789px;margin-left:10px">
                        <div v-for="(approver,index) in reimburseTime.approverList" style="overflow:hidden;float:left">
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
                            <p style="float:left;margin-top:15px;margin-left:10px" v-if="index !== reimburseTime.approverList.length -1">——————></p>
                        </div>
                    </div>
                </div>
                <div style="margin-top:20px;overflow: hidden;">
                    <div style="float:left;height:100%;width:58px;text-align:right;margin-top:15px">抄送人:</div>
                    <div v-for="(recipientList,index) in reimburseTime.recipientList" :key="index">
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
            </div>
            <!-- 有明细内容 -->
            <div class="reimbursement_footer">
                <div style="float:right;" @click="handleNext">
                    <i class="el-icon-arrow-down"></i>
                    <template v-if="loadNextUsers.userDetail == undefined">
                        <span>已经是最后一篇了</span>
                    </template>
                    <template v-else>
                        <span>{{loadNextUsers.userDetail ? loadNextUsers.userDetail.userName : ''}}的{{ vacation && vacation.length > 1 ? vacation[vacationIndex + 1].applyId==1?"请假": vacation[vacationIndex + 1].applyId==2?"出差": vacation[vacationIndex + 1].applyId==3?"补卡": vacation[vacationIndex + 1].applyId==4?"加班":"报销" : '' }}</span>
                    </template>
                </div>
                <div style="float:right;margin-right:20px"  @click="handleTop">
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
        <div class="reimbursement_button">
            <el-button plain @click="agree">同意</el-button>
            <el-button plain @click="refuse">拒绝</el-button>
        </div>
        <Mongolia ref="mongolia" :batchArray = batchArray :loadNextUsers = loadNextUsers></Mongolia>
    </div>
</template>

<script>
import Mongolia from './dialog'
export default {
    name: 'reimbursement',
    data() {
        return {
            reimburseTime: {},
            waitTime: '',
            batchArray: [
                {
                    id: this.$route.query.id,
                    step: this.$route.query.step,
                    applyId: 5
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
        this.loadreimburse()
    },
    watch :{
    　'$route': function (to, from) {
        //执行数据更新查询
            if (to.path == '/reimbursement') {
                this.loadreimburse()
            }else {
            }
    　　}
    },
    methods: {
        loadreimburse () {
            this.$http({
                method: 'GET',
                url: '/oaManage/v1/oa/approval/reimburse/' + this.$route.query.id
            }).then(res => {
                console.log(res.data)
                if (res.data.code === 200 && res.data.sysCode === 200) {
                    this.reimburseTime = res.data.data
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
            var begintime_ms = Date.parse(this.reimburseTime.updateTime)
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
        handleNext () {
            if (this.vacationIndex + 1 === this.vacation.length) {
                this.$message.error('已经是最后一篇了');
            }else {
                this.$router.push({
                name: this.vacation[this.vacationIndex + 1].applyId==1?"leave":(this.vacation[this.vacationIndex + 1].applyId==2?"businessTravel":(this.vacation[this.vacationIndex + 1].applyId==3?"patchCard":(this.vacation[this.vacationIndex + 1].applyId==4?"overtime":"reimbursement"))),
                path:this.vacation[this.vacationIndex + 1].applyId==1?"/leave":(this.vacation[this.vacationIndex + 1].applyId==2?"/businessTravel":(this.vacation[this.vacationIndex + 1].applyId==3?"/patchCard":(this.vacation[this.vacationIndex + 1].applyId==4?"/overtime":"/reimbursement"))),
                query: {id: this.vacation[this.vacationIndex + 1].id,step:this.reimburseTime.step,allList:this.vacation}
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
                query: {id: this.vacation[this.vacationIndex - 1].id,step:this.reimburseTime.step,allList:this.vacation}
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
    },
    components: {
        Mongolia
    }
}
</script>

<style lang="scss">
.reimbursement {
    width: 100%;
    background: #fff;
}
.reimbursement_content {
    width: 900px;
    margin: 0 auto;
    border-bottom: 1px solid #ccc
}
.reimbursement_title {
    padding-top: 20px;
    overflow: hidden;
}
.reimbursement_type {
    margin-top: 20px;
    margin-left: 42px;
}
.reimbursement_footer {
    margin-top: 40px;
    margin-bottom: 20px;
    overflow: hidden;
}
.reimbursement_button {
    width: 900px;
    margin: 0 auto;
    text-align: center;
}
.reimbursement_button .el-button {
    margin: 20px 40px
}
.reimbursement_detailed {
    height: 30px;
    line-height: 30px;
    margin-top: 30px;
    padding-left: 20px;
    background: rgba(2, 0, 0, 0.2);
    color: black;
}
</style>
