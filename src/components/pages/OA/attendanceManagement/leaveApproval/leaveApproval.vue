<template>
    <el-card class="box-card leaveApproval">
        <div class="formBox">
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                size="small"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item label="请假类型:" prop="region" required>
                    <el-select v-model="ruleForm.region" placeholder="请选择" @change="vacationTypeName" value="上午">
                        <el-option
                            v-for="item in leaveType"
                            :key="item.id"
                            :label="item.vacationName"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间:" required style="margin-bottom: 0;">
                    <el-form-item prop="startTime">
                        <div class="block">
                            <el-date-picker
                                v-model="ruleForm.startTime"
                                type="date"
                                :picker-options="pickerOptionsStart"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                ref="startTime"
                                @change="dateChangeStartTime"
                                placeholder="选择日期"
                            ></el-date-picker>
                            <el-select
                                v-model="startAm"
                                @change="dateChangeStartTime"
                                value="上午"
                                class="changeSelect"
                            >
                                <el-option
                                    v-for="item in startAmPm"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="结束时间:" required style="margin-bottom: 0;">
                    <el-form-item prop="endTime">
                        <div class="block">
                            <el-date-picker
                                v-model="ruleForm.endTime"
                                type="date"
                                ref="endTime"
                                :picker-options="pickerOptionsEnd"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                @change="dateChangeEndTime"
                                placeholder="选择日期"
                            ></el-date-picker>
                            <el-select
                                v-model="endAm"
                                value="下午"
                                @change="dateChangeEndTime"
                                class="changeSelect"
                            >
                                <el-option
                                    v-for="item in endAmPm"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="请假天数:" prop="days" required>
                    <el-input v-model="ruleForm.days" disabled></el-input>
                </el-form-item>
                <el-form-item label="请假事由:" prop="desc">
                    <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入请假事由" maxlength="500" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="图片:">
                    <!-- 图片上传 -->
                    <uploadImg
                        ref="uploadImg"
                        :uploadImg="this.$http.defaults.baseURL + '/oaManage/v1/oa/uploadImages'"
                        :fileList="{path:'1'}"
                    ></uploadImg>
                </el-form-item>
                <div class="copiedPerson">
                    <!-- //审批人 -->
                    <examineApprove ref="approver" :isSingular="true" :isOne="true" :isApprove="isApprove" :dataList="dataList" labelWidth="100px"></examineApprove>
                </div>
                <div class="copiedPerson">
                    <!-- //抄送人 -->
                    <copiedPerson ref="copiedPerson" labelWidth="100px"></copiedPerson>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script>
import Address from '../../../../commons/address'
import uploadImg from '@/components/pages/OA/Apublics/uploadImg';
import copiedPerson from '@/components/pages/OA/Apublics/copiedPerson';
import examineApprove from '@/components/pages/OA/Apublics/examineApprove';
import '@/modules/common'
export default {
    name: 'leaveApproval',
    components: {
        Address,
        uploadImg,
        copiedPerson,
        examineApprove
    },
    data() {
        return {
            ruleForm: {
                days: '',   // 请假天数
                region: '', // 请假类型
                startTime: '', // 开始时间
                endTime: '', // 结束时间
                desc: '', // 请假事由
            },
            leaveType: [],
            TypeName:'',
            approvers: '',
            startAmPm: [{
                value: 0,
                label: '上午'
                }, {
                value: 1,
                label: '下午'
            }],
            startAm: 0,
            endAmPm: [{
                value: 0,
                label: '上午'
                }, {
                value: 1,
                label: '下午'
            }],
            dataList: [],
            isApprove: true,
            endAm: 0,
            rules: {
                days: [
                    {
                        required: true,
                        message: '请填写请假天数',
                        trigger: 'blur'
                    }
                ],
                region: [
                    {
                        required: true,
                        message: '请选择请假类型',
                        trigger: 'change'
                    }
                ],
                startTime: [
                    {
                        // type: 'date',
                        required: true,
                        message: '请选择开始时间',
                        trigger: 'change'
                    }
                ],
                endTime: [
                    {
                        // type: 'date',
                        required: true,
                        message: '请选择结束时间',
                        trigger: 'change'
                    }
                ],
                desc: [
                    {
                        required: true,
                        message: '请填写请假事由',
                        trigger: 'blur'
                    },
                    {
                        min: 10,
                        max: 500,
                        message: '长度必须在 10 到 500 个字符',
                        trigger: 'blur'
                    }
                ]
            },
            pickerOptionsStart: {
                disabledDate: time => {
                    let endDateVal = this.ruleForm.endTime;
                    if (endDateVal) {
                        return time.getTime() >= new Date(endDateVal).getTime();
                    }
                }
            },
            pickerOptionsEnd: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            }
        }
    },
    created () {
        this.loadTypes()
        this.readDraft()
        this.loadApprover()
    },
    methods: {
        submitForm () {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.$http({
                        method: 'POST',
                        url: '/oaManage/v1/oa/approval/vacation',
                        data: {
                            vacationTypeId: this.ruleForm.region,
                            vacationTypeName: this.TypeName,
                            startDay: this.ruleForm.startTime,
                            startAmPm:this.startAm || 0,
                            endDay: this.ruleForm.endTime,
                            endAmPm:this.endAm || 0,
                            content: this.ruleForm.desc,
                            imgUrls: this.$refs.uploadImg.imgUrl,
                            days: this.ruleForm.days,
                            approverList: this.$refs.approver.copyValue,  // 审批人
                            recipientList:this.$refs.copiedPerson.copyValue,           // 抄送人id
                            applyId: 1,
                            applyName: '请假'
                        }
                    }).then (res => {
                        // console.log(res.data)
                        if (res.data.code === 200 && res.data.sysCode === 200) {
                            this.$refs.ruleForm.resetFields()
                            this.$refs.copiedPerson.copyValue = []
                            this.$refs.approver.copyValue = []
                            this.$refs.uploadImg.clearFile()
                            this.$message({
                            message: '提交成功',
                            type: 'success'
                            });
                        }
                    }).catch(error => {
                        this.$message.error("保存草稿失败");
                    });
                } else {
                    return false
                }
            })
        },
        loadTypes () {
            this.$http({
                method: 'GET',
                url: '/oaManage/v1/oa/approval/vacation/types',
            }).then(res => {
                if (res.data.code === 200  && res.data.sysCode === 200) {
                    this.leaveType = res.data.data.vacationList
                }
            })
        },
        readDraft () {
            this.$http({
                method: 'GET',
                url: '/oaManage/v1/oa/approval/vacation/temp',
                params: {
                    applyId: 1
                }
            }).then(res => {
                console.log(res.data)
                if (res.data.data != null ) {
                    this.ruleForm.region = res.data.data.vacationTypeId || ''
                    this.TypeName = res.data.data.vacationTypeName || ''
                    this.ruleForm.startTime = res.data.data.startDay || ''
                    this.startAm = res.data.data.startAmPm ? 1 : 0
                    this.ruleForm.endTime = res.data.data.endDay || ''
                    this.endAm = res.data.data.endAmPm ? 1 : 0
                    this.ruleForm.desc = res.data.data.content || ''
                    this.$refs.uploadImg.imgUrl = res.data.data.imgUrls || ''
                    if (res.data.data.imgUrls) {
                        res.data.data.imgUrls.forEach((item,index) => {
                            this.$refs.uploadImg.draftImg.push({name:index,url:item})
                        });
                    }
                    this.ruleForm.days = res.data.data.days || ''
                    this.$refs.approver.copyValue = res.data.data.approverList || '' // 审批人
                    this.$refs.copiedPerson.copyValue = res.data.data.recipientList || ''
                }
            })
        },
        loadApprover () {
            this.$http({
                method: 'GET',
                url: 'oaManage/v1/oa/approvers',
                params: {
                    applyId: '1'
                }
            }).then(res => {
                // console.log(res.data)
                if (res.data.code === 200  && res.data.sysCode === 200) {
                    if (res.data.data.approvers.length > 0) {
                        this.isApprove = false
                        this.dataList = res.data.data.approvers
                    }
                }
            })
        },
        difference (beginTime, endTime) {
            var dateBegin = new Date(beginTime);
            var dateEnd = new Date(endTime);
            var dateDiff = dateEnd - dateBegin//时间差的毫秒数
            var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
            var leave1 = dateDiff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000));//计算出小时数
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000);   //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
            //计算相差秒数
            var leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000);
            if (dayDiff >= 0) {
                if (this.startAm === this.endAm) {
                    this.ruleForm.days = parseInt(dayDiff) + 0.5
                }else {
                    this.ruleForm.days = parseInt(dayDiff) + 1
                }
            }
        },
        dateChangeStartTime () {
            this.difference(this.$refs.startTime.parsedValue,this.$refs.endTime.parsedValue)
        },
        dateChangeEndTime () {
            this.difference(this.$refs.startTime.parsedValue,this.$refs.endTime.parsedValue)
        },
        vacationTypeName(id) {
            this.TypeName = this.leaveType.find((item)=>{
                return item.id === id;
            }).vacationName
        },
    },
    beforeRouteLeave: function(to, from , next){
        if(true){
                this.$confirm('是否保存尚未提交内容?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                    this.$http({
                        method: 'POST',
                        url: '/oaManage/v1/oa/approval/vacation/temp',
                        data: {
                            vacationTypeId: this.ruleForm.region,
                            vacationTypeName: this.TypeName,
                            startDay: this.ruleForm.startTime,
                            startAmPm: this.startAm || 0,
                            endDay: this.ruleForm.endTime,
                            endAmPm: this.endAm || 0,
                            content: this.ruleForm.desc,
                            imgUrls: this.$refs.uploadImg.imgUrl,
                            days: this.ruleForm.days,
                            approverList: this.$refs.approver.copyValue,  // 审批人
                            recipientList:this.$refs.copiedPerson.copyValue,           // 抄送人id
                            applyId: 1,
                            applyName: '请假'
                        }
                    }).then (res => {
                        // console.log(res.data)
                        if (res.data.code === 200 && res.data.sysCode === 200) {
                            // this.$refs.ruleForm.resetFields();
                            // this.$refs.copiedPerson.copyValue = []
                            this.$message({
                            message: '保存草稿成功',
                            type: 'success'
                            });
                            next(true)
                        }
                    })
            }).catch(error => {
                this.$refs.uploadImg.imgUrl = []
                next(true);
            })
        }
    },
}
</script>

<style lang="scss">
.leaveApproval .formBox {
    width: 584px;
    height: 100%;
    margin: 0 auto;
}
.leaveApproval .process {
    .noPeople {
        cursor: pointer;
        background: #fff;
        width: 35px;
        padding: 2px;
        img {
            width: 100%;
        }
    }
    .hasPeople {
        margin-top: -10px;
        cursor: pointer;
        .members {
            margin: 10px 0;
            .group {
                position: relative;
                margin-right: 20px;
                text-align: center;
                .imgdelete {
                    position: absolute;
                    right: -8px;
                    top: -8px;
                    width: 15px;
                    img {
                        width: 100%;
                    }
                }
                img {
                    width: 35px;
                }
            }
        }
        .arrow {
            width: 30px;
            margin-right: 10px;
            img {
                width: 100%;
            }
        }
    }
}
.leaveApproval .formBox .el-dialog {
    width: 760px;
}
.leaveApproval .member {
    border: 1px solid #bbb;
    background: #fff;
    .title {
        text-align: center;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #bbb;
    }
    .address {
        padding: 10px 20px;
    }
}
.leaveApproval .el-input {
    width: 220px;
}
.leaveApproval .el-textarea{
    width: 400px;
    height: 200px;
}
.leaveApproval .el-textarea__inner {
    width: 400px;
    height: 200px;
}
.copiedPerson .copiedPerson {
    margin: 0;
}
.changeSelect .el-input {
    width: 86px;
}
</style>
