<template>
    <el-card class="box-card leaveApproval">
        <div class="formBox">
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                size="small"
                label-width="130px"
                class="demo-ruleForm"
            >
                <el-form-item label="开始时间:" required style="margin-bottom: 0;">
                    <el-form-item prop="startTime">
                        <div class="block">
                            <el-date-picker
                                v-model="ruleForm.startTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                :default-time="ruleForm.startTime"
                                value-format="yyyy-MM-dd HH:mm"
                                :picker-options="pickerOptionsStart"
                                ref="startTime"
                                @change="dateChangeStartTime"
                                format="yyyy-MM-dd HH:mm"
                            ></el-date-picker>
                        </div>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="结束时间:" required style="margin-bottom: 0;">
                    <el-form-item prop="endTime">
                        <div class="block">
                            <el-date-picker
                                v-model="ruleForm.endTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                value-format="yyyy-MM-dd HH:mm"
                                default-time="18:00:00"
                                :picker-options="pickerOptionsEnd"
                                @change="dateChangeEndTime"
                                ref="endTime"
                                format="yyyy-MM-dd HH:mm"
                            ></el-date-picker>
                        </div>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="是否法定节假日:" prop="holiday">
                    <el-switch
                        v-model="ruleForm.holiday"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="时长:" prop="days" required>
                    <el-input v-model="ruleForm.days" disabled></el-input>
                </el-form-item>
                <el-form-item label="加班原因:" prop="desc">
                    <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入请假事由" maxlength="500" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="图片:">
                    <!-- 图片上传 -->
                    <uploadImg
                        ref="uploadImg"
                        :uploadImg="this.$http.defaults.baseURL + '/oaManage/v1/oa/uploadImages'"
                    ></uploadImg>
                </el-form-item>
                <div class="copiedPerson">
                    <!-- //审批人 -->
                    <examineApprove ref="approver" :isSingular="true" :isOne="true" :isApprove="isApprove" :dataList="dataList" labelWidth="130px"></examineApprove>
                </div>
                <div class="copiedPerson">
                    <!-- //抄送人 -->
                    <copiedPerson ref="copiedPerson" labelWidth="130px"></copiedPerson>
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
import uploadImg from '@/components/pages/OA/Apublics/uploadImg'
import copiedPerson from '@/components/pages/OA/Apublics/copiedPerson'
import examineApprove from '@/components/pages/OA/Apublics/examineApprove'
import '@/modules/common'
export default {
    name: 'overtimeApproval',
    components: {
        Address,
        uploadImg,
        copiedPerson,
        examineApprove
    },
    data() {
        return {
            ruleForm: {
                days: '', // 加班时长
                holiday: true, // 是否法定节假日
                startTime: new Date().Format('yyyy-MM-dd hh:mm'), // 开始时间
                endTime: '', // 结束时间
                desc: '', // 加班原因
            },
            dataList: [],
            isApprove: true,
            rules: {
                days: [
                    {
                        required: true,
                        message: '请填写加班时长',
                        trigger: 'blur'
                    }
                ],
                startTime: [
                    {
                        type: 'string',
                        required: true,
                        message: '请选择开始时间',
                        trigger: 'change'
                    }
                ],
                endTime: [
                    {
                        type: 'string',
                        required: true,
                        message: '请选择结束时间',
                        trigger: 'change'
                    }
                ],
                desc: [
                    {
                        required: true,
                        message: '请填写加班原因',
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
                    let endDateVal = this.ruleForm.endTime
                    if (endDateVal) {
                        return time.getTime() >= new Date(endDateVal).getTime()
                    }
                }
            },
            pickerOptionsEnd: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                }
            }
        }
    },
    created() {
        this.readDraft()
        this.loadApprover()
    },
    methods: {
        submitForm() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.$http({
                        method: 'POST',
                        url: 'oaManage/v1/oa/approval/overtime',
                        data: {
                            applyId: 4,
                            applyName: '加班',
                            startTime: this.ruleForm.startTime,
                            endTime: this.ruleForm.endTime,
                            times: JSON.parse(this.ruleForm.days),
                            holidays: this.ruleForm.holiday ? 1 : 0,
                            content: this.ruleForm.desc,
                            imgUrls: this.$refs.uploadImg.imgUrl,
                            approverList: this.$refs.approver.copyValue,
                            recipientList: this.$refs.copiedPerson.copyValue
                        }
                    }).then(res => {
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
                    })
                } else {
                    return false
                }
            })
        },
        readDraft () {
            this.$http({
                method: 'GET',
                url: 'oaManage/v1/oa/approval/overtime/temp',
                params: {
                    applyId: 1
                }
            }).then(res => {
                // console.log(res.data)
                if (res.data.data != null ) {
                    this.ruleForm.startTime = res.data.data.startTime || ''
                    this.ruleForm.endTime = res.data.data.endTime || ''
                    this.ruleForm.desc = res.data.data.content || ''
                    this.$refs.uploadImg.imgUrl = res.data.data.imgUrls || ''
                    if (res.data.data.imgUrls) {
                        res.data.data.imgUrls.forEach(item => {
                            this.$refs.uploadImg.draftImg.push({url:item})
                        });
                    }
                    this.ruleForm.days = res.data.data.times || ''
                    this.ruleForm.holiday = res.data.data.holidays
                    this.$refs.approver.copyValue = res.data.data.approverList || '' // 审批人
                    this.$refs.copiedPerson.copyValue = res.data.data.recipientList || ''
                }
            })
        },
        difference(beginTime, endTime) {
            var dateBegin = new Date(beginTime)
            var dateEnd = new Date(endTime)
            var dateDiff = dateEnd - dateBegin //时间差的毫秒数
            var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) //计算出相差天数
            var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
            //计算相差秒数
            var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000)
            console.log("相差" + dayDiff + "天" + hours + '小时' + minutes + '分钟' + leave2 + '毫秒') //startAm: '上午', endAm:'下午
                this.ruleForm.days = (24 * dayDiff + hours + minutes / 60).toFixed(1)
        },
        dateChangeStartTime() {
            this.difference(
                this.$refs.startTime.parsedValue,
                this.$refs.endTime.parsedValue
            )
        },
        dateChangeEndTime() {
            this.difference(
                this.$refs.startTime.parsedValue,
                this.$refs.endTime.parsedValue
            )
        },
        loadApprover () {
            this.$http({
                methods: 'GET',
                url: 'oaManage/v1/oa/approvers',
                params: {
                    applyId: '1'
                }
            }).then(res => {
                if (res.data.code === 200  && res.data.sysCode === 200) {
                    if (res.data.data.approvers.length > 0) {
                        this.isApprove = false
                        this.dataList = res.data.data.approvers
                    }
                }
            })
        },
    },
    beforeRouteLeave: function(to, from, next) {
        if (true) {
            this.$confirm('是否保存尚未提交内容?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            })
                .then(() => {
                    this.$http({
                        method: 'POST',
                        url: 'oaManage/v1/oa/approval/overtime/temp',
                        data: {
                            applyId: 4,
                            applyName: '加班',
                            startTime: this.ruleForm.startTime,
                            endTime: this.ruleForm.endTime,
                            times: JSON.parse(this.ruleForm.days),
                            holidays: this.ruleForm.holiday ? 1 : 0,
                            content: this.ruleForm.desc,
                            imgUrls: this.$refs.uploadImg.imgUrl,
                            approverList: this.$refs.approver.copyValue,
                            recipientList: this.$refs.copiedPerson.copyValue
                        }
                    }).then(res => {
                        if (res.data.code === 200 && res.data.sysCode === 200) {
                            // this.$refs.ruleForm.resetFields()
                            // this.$refs.copiedPerson.copyValue = []
                            // this.$refs.uploadImg.clearFile()
                            this.$message({
                            message: '保存草稿成功',
                            type: 'success'
                            });
                            next(true)
                        }
                    })
                })
                .catch(error => {
                    this.$refs.uploadImg.imgUrl = []
                    next(true);
                })
        }
    }
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
.leaveApproval .el-textarea__inner {
    width: 400px;
    height: 200px;
}
.leaveApproval .el-textarea{
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
