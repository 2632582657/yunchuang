<template>
    <div class="addTeam">
		<img src="../images/jiarutuandui@2x(1).png" style="width: 44px;height: 44px;position: absolute;top:-72px;margin-left: -5px;z-index: 99;">
        <div class="team_list clear" v-for="item in UserInfoJoinApply">
            <img :src="item.iconUrl " alt="" width="50px;" height="50px" class="fl" v-if="item.iconUrl ">
            <img src="../images/h.png" alt="" width="50px;" class="fl" v-else>
            <div class="team_r">
                <div>{{item.teamUserName}}</div>
                <div style="color:#BFC2CC;font-size:14px;margin-top:10px;border-bottom:1px solid #BFC2CC;width:100%;height:30px">{{item.teamUserTel}}</div>
                <p>申请加入</p>
                <div>{{item.teamInfoName}}</div>
                <p>加入部门</p>
                <div>{{item.departmentName ? item.departmentName : '暂未填写'}}</div>
                <el-divider></el-divider>
                <div class="clear">
                    <div class="fl" v-if="item.approverName">由<span style="color:#4278BE;cursor:pointer" @click="lookEmployeeInfo(item)">{{item.approverName}}</span>邀请加入</div>
                    <div class="submit fr">
                        <template v-if="item.applyResult == 0">
                            <el-button size="mini" type="primary" @click="handleData(item)" class="fr" style="width:86px;height:36px;background:#4278BE;color:#fff;margin-left:15px;margin-top:10px">同意</el-button>
                            <el-button size="mini" @click="handleClose(item)" class="fr" style="border:1px solid #4278BE;color:#4278BE;width:86px;height:36px;margin-top:10px">拒绝</el-button>
                        </template>
                        <template v-else-if="item.applyResult == 1">
                            <div class="fr" style="color:#4FBE96">同意</div>
                        </template>
                        <template v-else>
                            <div class="fr" style="color:#FF6565">拒绝</div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <!-- 编辑查看成员 -->
        <div class="slide_dialog"  ref="slide_dialog" @click.stop="showEditmember = true"  v-show="showEditmember">
            <h4>{{  editMember.showLook ? '编辑成员' : '查看成员'  }}<span class="fr closeDialog" @click.stop="showEditmember = false">×</span></h4>
            <div style="overflow:auto;position:absolute;top:68px;bottom:51px">
                <div style="padding:20px 90px 0px 80px">
                <el-form
                    style="width:430px"
                    :model="editMember"
                    :rules="editMemberRules"
                    ref="editMember"
                    label-width="100px"
                    class="addMembers"
                    >
                    <el-form-item label="成员姓名:" prop="employeeName">
                        <!-- <el-input v-model="editMember.employeeName" placeholder="必填"></el-input> -->
                        <template v-if="editMember.showLook">
                            <el-input v-model="editMember.employeeName" placeholder="必填"></el-input>
                        </template>
                        <template v-else>
                            <el-input v-model="editMember.employeeName" placeholder="必填" readonly></el-input>
                        </template>
                    </el-form-item>
                    <el-form-item label="手机号码:" prop="phone">
                        <el-input v-model="editMember.phone" placeholder="必填" disabled></el-input>
                        <!-- <p style="font-size:10px;color:#909399;line-height:0px;margin-top:8px">已在职的用户，无法修改手机号，请让员工自行在手机上修改</p> -->
                    </el-form-item>
                    <el-form-item label="所属部门:" prop="department">
                        <template v-if="editMember.showLook">
                            <el-input
                                :value="editMember.department"
                                placeholder="必填"
                                @focus="departmentVisible = true"
                                readonly>
                            </el-input>
                        </template>
                        <template v-else>
                            <el-input
                                :value="editMember.department"
                                readonly>
                            </el-input>
                        </template>
                    </el-form-item>
                    <el-form-item label="负责部门:" prop="departments">
                        <template v-if="editMember.showLook">
                            <el-input
                                :value="editMember.responsibleDepartment"
                                placeholder="选填"
                                @focus="dialogVisibles = true"
                                readonly>
                            </el-input>
                        </template>
                        <template v-else>
                            <el-input
                                :value="editMember.responsibleDepartment"
                                readonly>
                            </el-input>
                        </template>
                    </el-form-item>
                    <!-- <el-form-item label="状态:">
                        {{editMember.employeeStatus ? '在职' : '离职'}}
                    </el-form-item> -->
                    <el-form-item label="职位:" prop="position">
                        <!-- <el-input v-model="editMember.employeeJob" placeholder="选填"></el-input> -->
                        <template v-if="editMember.showLook">
                            <!-- <el-input v-model="editMember.employeeName" placeholder="选填"></el-input> -->
                            <el-input v-model="editMember.employeeJob" placeholder="选填"></el-input>
                        </template>
                        <template v-else>
                            <el-input v-model="editMember.employeeJob" placeholder="选填" readonly></el-input>
                            <!-- <el-input v-model="editMember.employeeName" placeholder="选填" readonly></el-input> -->
                        </template>
                    </el-form-item>
                    <el-form-item label="邮箱:" prop="email">
                        <!-- <el-input v-model="editMember.employeeEmail" placeholder="选填"></el-input> -->
                        <template v-if="editMember.showLook">
                            <el-input v-model="editMember.employeeEmail" placeholder="选填"></el-input>
                        </template>
                        <template v-else>
                            <el-input v-model="editMember.employeeEmail" placeholder="选填" readonly></el-input>
                        </template>
                    </el-form-item>
                    <el-form-item label="性别:" prop="gender">
                        <el-radio-group v-model="editMember.employeeGender">
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="工号:" prop="number">
                        <template v-if="editMember.showLook">
                            <el-input v-model="editMember.employeeNo" placeholder="选填"></el-input>
                        </template>
                        <template v-else>
                            <el-input v-model="editMember.employeeNo" placeholder="选填" readonly></el-input>
                        </template>
                    </el-form-item>
                    <el-form-item label="办公地点:" prop="location">
                        <template v-if="editMember.showLook">
                            <el-input v-model="editMember.employeeOfficeLocation" placeholder="选填"></el-input>
                        </template>
                        <template v-else>
                            <el-input v-model="editMember.employeeOfficeLocation" placeholder="选填" readonly></el-input>
                        </template>
                    </el-form-item>
                    <el-form-item label="入职时间:" prop="employeeEntryTime">
                        <!-- <el-input v-model="editMember.employeeEntryTime" placeholder="必填"></el-input> -->
                        <template v-if="editMember.showLook">
                            <el-date-picker
                                v-model="editMember.employeeEntryTime"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                type="date"
                                placeholder="选择入职时间">
                            </el-date-picker>
                        </template>
                        <template v-else>
                            <el-date-picker
                                v-model="editMember.employeeEntryTime"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                type="date"
                                readonly
                                placeholder="选择入职时间">
                            </el-date-picker>
                        </template>
                    </el-form-item>
                    <el-form-item label="描述:" prop="desc" style="padding-top:8px">
                        <template v-if="editMember.showLook">
                            <el-input type="textarea" v-model="editMember.employeeDescribe" placeholder="请填写......" maxlength="200" show-word-limit></el-input>
                        </template>
                        <template v-else>
                            <el-input type="textarea" v-model="editMember.employeeDescribe" placeholder="请填写......" maxlength="200" show-word-limit readonly></el-input>
                        </template>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <p style="padding:0px 89px 20px 182px;font-size:12px;color:#909399;">提示：添加成员后，该成员可以通过手机号+短信验证码方式登录平台并确认加入团队</p>
            </div>
            </div>
            <div class="slide_footer" v-show="editMember.showLook">
                <el-button class="fr" style="width:80px;height:34px;background:#4278BE;border-radius:3px;color:#fff;padding:0" @click="handlePreservationMember">保存</el-button>
            </div>
        </div>
        <div class="addTeamDialog">
            <el-dialog
                :visible.sync="dialogVisible"
                width="30%"
                center
                >
                <div slot="title" class="header-title clear" style="border-bottom:1px solid #BFC2CC;height:42px;">
                    <div style="width:16px;height:23px;background:#4278BE;float:left;margin-top:4px;margin-left:30px"></div>
                    <div style="width:98px;height:31px;font-size:20px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:31px;float:left;margin-left:10px">拒绝理由</div>
                </div>
                <el-input
                    type="textarea"
                    placeholder="请填写拒绝原因"
                    v-model="applyReason"
                    >
                </el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false" style="border:1px solid #4278BE;color:#4278BE;width:150px;height:50px;">取 消</el-button>
                    <el-button @click="handleSubmit" style="background:rgba(66,120,190,1);color:#fff;width:150px;height:50px;">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <!-- 选择部门弹框（多选） -->
        <div ref="TreeTransferDialog">
            <TreeTransferDialog
                :IsNum='isNum'
                :treeData="data"
                :defaultProps="{label:'departmentName',children:'children'}"
                :transferTitle="['选择部门', '已选择']"
                :dialogVisible="dialogVisibles"
                @close="dialogVisibles = false"
                @submit="handleSubmitDepartment">
            </TreeTransferDialog>
        </div>
         <!-- 选择部门弹框 (单选)-->
        <div class="department_dialog" ref="department" >
            <department :treeData="data"
                        :dialogVisible="departmentVisible"
                        @submit="handleDepartment"
                        :editMember='editMember'
                        @close="departmentVisible = false"/>
        </div>
    </div>
</template>

<script>
import bus from '../../../../modules/bus'
import TreeTransferDialog from '../../../commons/TreeTransferDialog'
import department from './department'
export default {
    data () {
        const nametxt = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入成员姓名'))
            } else {
                const reg =  /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,6}$/
                if (value.length > 1 && reg.test(value)) {
                callback()
                } else {
                return callback(new Error('请输入2-6个汉字'))
                }
            }
        }
        return {
            data:[],
            ssoManager:'ssoManager',
			teamEmployeeDetailVO:JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')),
            UserInfoJoinApply:[],
            dialogVisible:false,
            applyReason:'',
            UserInfo:{},
            showEditmember:false,
            editMember:{},
            isNum:[],
            departmentVisible:false,
            editMemberRules: {
                employeeName: [
                    {
                        required: true,
                        validator: nametxt,
                        trigger: 'blur'
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur'
                    },
                    { message: '手机号输入不正确', trigger: 'blur', pattern: /^1[34578]\d{9}$/}
                ],
                department: [
                    {
                        required: true,
                        message: '请选择所属部门',
                        trigger: 'input'
                    },
                ],
                employeeEntryTime: [
                    {
                        required: true,
                        message: '请选择入职时间',
                        trigger: 'change'
                    },
                ],
            },
            dialogVisibles:false
        }
    },
    created () {
        this.getUserInfoJoinApply()
    },
    watch:{
        data (newval) {
            this.data = newval
        }
    },
    components:{
        TreeTransferDialog,department
    },
    methods: {
        handleData (obj) {
            this.UserInfo = obj
            this.$http({
                method: 'POST',
                url:'orgManager/v1/organization/department/queryAddressBook',
                data: {
                    companyId:obj.teamInfoId
                },
            }).then(res => {
                if (res.data.code === 200) {
                    if (res.data.data.children.length != 0) {
                        res.data.data.children[0].first = false
                        this.data = []
                        this.data.push(res.data.data.children[0])
                        this.handleEditPer(obj)
                    }else {
                        this.data = []
                    }
                }
            })
        },
        getUserInfoJoinApply () {
            this.$http({
                method:'GET',
                url:this.ssoManager + '/v1/oa/userInfoJoinApply/getUserInfoJoinApply',
                // params: {
                //     teamInfoId:this.teamInfoId
                // }
            }).then(res => {
                if (res.data.code == 200) {
                    this.UserInfoJoinApply = res.data.data
                }
            })
        },
        handleClose (item) {
            this.dialogVisible = true
            this.UserInfo = item
        },
        handleEditPer (value) {
            this.$http({
                method: 'POST',
                url: 'orgManager/v1/organization/employee/queryByPhone',
                data: {
                    phone:value.teamUserTel
                },
            }).then(res => {
                if (res.data.code == 200 && res.data.data != null) {
                    var editLook =  res.data.data
                    editLook.employeeName = value.teamUserName
                    var string =  ''
                    editLook.responsibleDepartments.forEach(item => {
                        string+=item.departmentName+'、'
                    })
                    this.isNum = editLook.responsibleDepartments
                    editLook.responsibleDepartment = string.slice(0,-1)
                    editLook.showLook = true
                    this.editMember = editLook
                    this.showEditmember = true
                }
            })
        },
        handleSubmitDepartment (newValue) {
            var str = ''
            newValue.forEach(item => str+=item.departmentName + '、')
            var arr = []
            newValue.forEach(item => {
                if (item.id == this.editMember.departmentId) {
                    arr.push({
                        employeeId:this.editMember.id,
                        departmentId:item.id,
                        departmentMainId:0,
                        manager:1
                    })
                }else {
                    arr.push({
                        employeeId:this.editMember.id,
                        departmentId:item.id,
                        departmentMainId:1,
                        manager:1
                    })
                }
            })
            this.editMember.responsibleDepartment = str.slice(0,-1);
            this.isNum = newValue
            this.editMember.responsibleDepartments = arr
        },
        // 选择部门弹框 (单选) 确认按钮
        handleDepartment (value) {
            this.editMember.department = value.departmentName
            this.editMember.departmentId = value.id
            this.departmentVisible = false
        },
        // 保存编辑成员
        handlePreservationMember () {
            var arr = []
            this.editMember.responsibleDepartments.forEach(item => {
                if (item.id == this.editMember.departmentId) {
                    arr.push({
                        employeeId:this.editMember.id,
                        departmentId:item.id || item.departmentId,
                        departmentMainId:0,
                        manager:1
                    })
                }else {
                    arr.push({
                        employeeId:this.editMember.id,
                        departmentId:item.id || item.departmentId,
                        departmentMainId:1,
                        manager:1
                    })
                }
            })
            this.editMember.responsibleDepartments = arr
            this.$refs.editMember.validate((valid) => {
                if (valid) {
                    this.$http({
                        method: 'POST',
                        url:'orgManager/v1/organization/employee/edit',
                        data: {
                            id:this.editMember.id,
                            phone:this.editMember.phone,
                            employeeName:this.editMember.employeeName,
                            employeeJob:this.editMember.employeeJob,
                            employeeNo:this.editMember.employeeNo,
                            employeeGender:this.editMember.employeeGender,
                            employeeBirth:this.editMember.employeeBirth,
                            iconUrl:this.editMember.iconUrl,
                            department:this.editMember.department,
                            departmentId:this.editMember.departmentId,
                            employeeStatus:this.editMember.employeeStatus,
                            employeeEmail:this.editMember.employeeEmail,
                            employeeOfficeLocation:this.editMember.employeeOfficeLocation,
                            employeeEntryTime:this.editMember.employeeEntryTime,
                            employeeDescribe:this.editMember.employeeDescribe,
                            departmentIdList:this.editMember.responsibleDepartments,
                            companyId:this.UserInfo.teamInfoId,
                            },
                    }).then(res => {
                        if (res.data.code == 200  && res.data.sysCode == 200) {
                            this.$message({
                                message: '编辑人员成功',
                                type: 'success'
                            });
                            this.handleSubmit(this.UserInfo)
                            this.showEditmember = false
                            this.$refs.editMember.resetFields();
                        }else {
                            this.$message({
                                message: res.data.message,
                                type: 'error'
                            });
                        }
                    })
                } else {
                    return false;
                }
                });
        },
        handleSubmit (item) {
            this.$http({
                method:'POST',
                url:this.ssoManager + '/v1/oa/userInfoJoinApply/approvalJoinApply',
                data: {
                    applyId: item.id ||  this.UserInfo.id,
                    applyResult: this.dialogVisible ? '2' : '1',
                    approver:item.approver || this.UserInfo.approver,
                    teamInfoId:item.teamInfoId || this.UserInfo.teamInfoId,
                    applyReason:this.applyReason
                }
            }).then(res => {
                // console.log(res.data)
                if (res.data.code == 200) {
                    this.$message({
                        type:'success',
                        message:'审批成功'
                    })
                    this.getUserInfoJoinApply()
                    this.dialogVisible = false
                }
            })
        },
        lookEmployeeInfo(item) {
            this.$router.push({name:'frameWork',params:{id:item.teamInfoId,approver:item.approver}})
            var obj = {
                id: this.teamEmployeeDetailVO.employeeId,
                label: item.teamInfoName,
                companyId:item.teamInfoId,
                departmentName:item.departmentName,
            }
            bus.$emit('companyObj',obj)
            window.sessionStorage.setItem('companyObj',JSON.stringify(obj))
            this.$store.commit('showEditmember',true)
        },
        handleHideSlide(e) {
            if (this.dialogVisibles === true || this.departmentVisible === true) {
            }else{
                if (!this.$refs.slide_dialog.contains(e.target) && !this.$refs.TreeTransferDialog.contains(e.target)  && !this.$refs.department.contains(e.target)) {
                    this.showEditmember = false
                    this.$refs.editMember.clearValidate()
                }
            }
        },
    },
    mounted() {
        document.addEventListener('click', this.handleHideSlide)
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleHideSlide)
    },
}
</script>

<style lang="scss">
.addTeam {
    margin-top: 20px;
    padding: 1px 20px 0 20px;
    width: 100%;
    position: relative;
    box-sizing: border-box;
    color: #303133;
    background: #fff;
    .team_list {
        height: 307px;
        width: 100%;
        margin-top: 20px;
        padding: 20px 50px 20px 30px;
        box-sizing: border-box;
        border: 1px solid #4278BE;
        .team_r {
            width: 95%;
            margin-left: 70px;
            p {
                color:#909399;
                height:40px;
                line-height:40px
            }
            .el-divider--horizontal {
                margin: 10px 0;
                background: #BFC2CC
            }
            // .submit {
            //     margin-top: 10px;
            // }
        }
    }
    .addMembers .el-textarea__inner {
        width: 100%;
    }
    .addTeamDialog .el-dialog {
        width:500px !important;
        height:310px !important;
        margin-top: 34vh !important
    }
    .addTeamDialog .el-dialog__header {
        padding: 20px 0 10px;
    }
    .el-textarea__inner {
        width:440px;
        height:101px;
        border-radius:3px;
    }
    .addTeamDialog .el-dialog__headerbtn .el-dialog__close {
        display: none
    }
}
</style>
