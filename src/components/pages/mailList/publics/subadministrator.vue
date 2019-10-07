<template>
    <div class="subadministrator">
        <div style="float:right;margin-bottom:20px;">
            <el-button style="background:#4278BE;color:#fff;width:167px;" @click.stop="showAddAdmin = true">新建子管理员</el-button>
        </div>
        <el-table
            class="el-table"
            ref="multipleTable"
            :data="organizational "
            border
            tooltip-effect="dark"
            :row-class-name="tableRowClassName"
            style="width: 100%">
            <el-table-column align="center" label="子管理员姓名" prop="employeeName">
                <!-- <template slot-scope="scope">{{ scope.row.customerName }}</template> -->
            </el-table-column>
            <el-table-column align="center" prop="adminRangeList" label="管理范围" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span  v-if="scope.row.adminRange == 1">
                        全公司
                    </span>
                    <span v-else-if="scope.row.adminRange == 2">
                        所在部门及下级部门
                    </span>
                    <span v-for="item in scope.row.adminRangeList" v-else>
                        {{item.departmentName}}&nbsp;
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="functionPermissionList" label="功能权限" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-for="item in scope.row.functionPermissionList" v-if="item.permissionState">
                        {{item.functionName}} &nbsp;
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-edit" @click="handleEditAdmin(scope.row)"></el-button>
                    <el-button size="mini" icon="el-icon-delete" @click="handleRemoveAdmin(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="el-pagination"
            @size-change="handleSizeChange"
            @current-change="getMyCustomer"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
        ></el-pagination>
        <div class="slide_dialog" ref="slide_dialog" @click.stop="showAddAdmin = true"  v-show="showAddAdmin">
            <h4>新建子管理员</h4>
            <div style="padding:20px 125px 0 68px">
                <el-form
                    :model="admin"
                    :rules="adminRules"
                    ref="addMember"
                    label-width="110px"
                    class="addMembers"
                    >
                    <el-form-item label="选择子管理员:" prop="name">
                        <el-input
                            :value="admin.name"
                            placeholder="必填"
                            @focus="showdePersondialog"
                            readonly>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="管理范围:" style="margin-bottom: 0px">
                        <el-radio-group v-model="admin.range" @change="handleRadioChange">
                            <el-radio :label="1">全公司</el-radio><br>
                            <el-radio :label="2">所在部门及下级部门</el-radio><br>
                            <el-radio :label="0">特定部门</el-radio>
                        </el-radio-group>
                        <el-input
                            v-show="showdepartment"
                            :value="admin.department"
                            placeholder="必填"
                            @focus="showdeDepartment"
                            readonly>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="分配权限:" prop="checkedMenu">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"  style="padding-top:8px">全部权限</el-checkbox>
                        <el-checkbox-group v-model="admin.checkedMenu" @change="handleCheckedCitiesChange">
                            <button style="line-height:5px;color:#909399;padding:15px 0 10px 0;border:none;background:#fff;">基础权限</button>
                            <el-checkbox  v-for="admin in adminList" v-if="admin.functionType == 0" name="checkedMenu" :label="admin.id" :key="admin.id">{{admin.functionName}}</el-checkbox>
                            <button style="line-height:5px;color:#909399;padding:15px 0 10px 0;border:none;background:#fff">应用权限</button>
                            <el-checkbox  v-for="admin in adminList" v-if="admin.functionType == 1" name="checkedMenu" :label="admin.id" :key="admin.id">{{admin.functionName}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </div>
            <div class="slide_footer">
                <el-button class="fr" style="width:80px;height:34px;background:#4278BE;border-radius:3px;color:#fff;padding:0"  @click.stop="handleNewAdmin">完成</el-button>
                <el-button class="fr" style="width:80px;height:34px;border:1px solid #4278BE;border-radius:3px;color:#4278BE;margin-right:24px;margin-left: 0px;padding:0" @click.stop="showAddAdmin = false">取消</el-button>
            </div>
        </div>
        <div class="slide_dialog" ref="slide_dialog" @click.stop="showEditAdmin = true"  v-show="showEditAdmin">
            <h4>编辑子管理员</h4>
            <div style="overflow:auto;position:absolute;top:68px;bottom:50px">
                <div style="padding:20px 125px 20px 68px">
                    <el-form
                        :model="admin"
                        :rules="adminRules"
                        ref="editMember"
                        label-width="110px"
                        class="addMembers"
                        >
                        <el-form-item label="选择子管理员:" prop="name">
                            <el-input
                                :value="admin.name"
                                placeholder="必填"
                                @focus="showdePersondialog"
                                readonly>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="管理范围:" style="margin-bottom: 0px">
                            <el-radio-group v-model="admin.range" @change="handleRadioChange">
                                <el-radio :label="1">全公司</el-radio><br>
                                <el-radio :label="2">所在部门及下级部门</el-radio><br>
                                <el-radio :label="0">特定部门</el-radio>
                            </el-radio-group>
                            <el-input
                                v-show="showdepartment || admin.range == 0"
                                :value="admin.department"
                                placeholder="必填"
                                @focus="showdeDepartment"
                                readonly>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="分配权限:" prop="checkedMenu">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"  style="padding-top:8px">全部权限</el-checkbox>
                            <el-checkbox-group v-model="admin.checkedMenu" @change="handleCheckedCitiesChange">
                                <button style="line-height:5px;color:#909399;padding:15px 0 10px 0;border:none;background:#fff;">基础权限</button>
                                <el-checkbox  v-for="item in EditadminList" v-if="item.functionType == 0" name="checkedMenu"  :label="item.id" :key="item.id">{{item.functionName}}</el-checkbox>
                                <button style="line-height:5px;color:#909399;padding:15px 0 10px 0;border:none;background:#fff">应用权限</button>
                                <el-checkbox  v-for="item in EditadminList" v-if="item.functionType == 1" name="checkedMenu"  :label="item.id" :key="item.id">{{item.functionName}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="slide_footer">
                <el-button class="fr" style="width:80px;height:34px;background:#4278BE;border-radius:3px;color:#fff;padding:0"  @click.stop="handleEditAdminComplete">完成</el-button>
                <el-button class="fr" style="width:80px;height:34px;border:1px solid #4278BE;border-radius:3px;color:#4278BE;margin-right:24px;margin-left: 0px;padding:0" @click.stop="showEditAdmin = false">取消</el-button>
            </div>
        </div>
        <div ref="persondialog">
            <persondialog
                :treeData="data"
                :defaultProps="{label:'name',children:'children'}"
                :transferTitle="['选择部门人员', '已选择']"
                :select="true"
                :dialogVisible="personDialogVisible"
                @handlePersonClose="handlePersonClose"
                @handlePsrsonSubmit="handlePsrsonSubmit">
            </persondialog>
        </div>
        <div ref="TreeTransferDialog">
            <TreeTransferDialog
                :treeData="data1"
                :defaultProps="{label:'departmentName',children:'children'}"
                :transferTitle="['选择部门', '已选择']"
                :IsNum="admin.departmentObj"
                :dialogVisible="departmentVisible"
                @close="handleDepartmentClose"
                @submit="handleDepartment">
            </TreeTransferDialog>
        </div>
    </div>
</template>

<script>
import persondialog from '../../../commons/persondialog'
import TreeTransferDialog from '../../../commons/TreeTransferDialog'
import bus from '../../../../modules/bus'
export default {
    data () {
        return {
            orgManager:'orgManager',
            ssoManager:'ssoManager',
            data: [],
            data1:[],
            // companyObj: JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')),
            companyObj:JSON.parse(window.sessionStorage.getItem('companyObj')),
            organizational:[],
            admin:{
                name:'',
                range:2,
                department:'',
                departmentObj:[],
                checkedMenu:[],
            },
            adminRules:{
                name:[
                    { required: true, message: '请选择子管理员名称', trigger: 'blur' },
                ],
                checkedMenu:[
                    { type: 'array', required: true, message: '请至少选择一个权限', trigger: 'blur' }
                ]
            },
            currentPage: 1,
            totalCount: 100,
            pageSize: 10,
            showAddAdmin:false,
            showEditAdmin:false,
            personDialogVisible:false,
            departmentVisible:false,
            showdepartment:false,
            isIndeterminate:false,
            checkAll:false,
            // checkedMenu:[],
            functionPermissionVOList:[],
            adminRangeAddDTOS:[],
            adminList:[],
            EditadminList:[],
            organization:[]  //添加子管理员
        }
    },
    created () {
        this.getMyCustomer()
        this.handleData()
        this.handleDatas()
        this.getAdminList()
    },
    components:{
        persondialog,
        TreeTransferDialog
    },
    watch:{
        checkedMenu (newval) {
            // if (newval == true) {
            //     this.admin.checkedMenu = this.checkbox
            // }
            // let checkedCount = newval.length
            // this.checkAll = checkedCount === this.EditadminList.length
            // this.isIndeterminate = checkedCount > 0 && checkedCount < this.EditadminList.length
        },
        companyObj () {
            this.getMyCustomer()
            this.handleData()
            this.handleDatas()
            this.getAdminList()
        }
    },
    methods: {
        handleData () {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/department/queryAddressBook2',
                // url: 'http://192.168.50.64:8013/v1/organization/department/queryAddressBook2',
                data: {
                    companyId:this.companyObj.companyId,
                },
            }).then(res => {
                if (res.data.code == 200) {
                    this.data = res.data.data.children ? res.data.data.children : []
                }
            })
        },
        handleDatas () {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/department/query',
                // url: 'http://192.168.50.64:8013/v1/organization/department/query',
                data: {
                    companyId:this.companyObj.companyId
                },
            }).then(res => {
                if (res.data.code === 200 && res.data.sysCode === 200) {
                    if (this.data.length != 0) {
                        this.data1 = []
                        this.data1.push(res.data.data)
                    }else {
                        this.data1.push(res.data.data)
                    }
                }
            })
        },
        tableRowClassName({row, rowIndex}) {
            if(rowIndex%2==1){
                return 'success-row'
            }else{
                return 'warning-row'
            }
        },
        getAdminList() {
            this.$http({
                method: 'GET',
                url: this.ssoManager + '/v1/oa/permission/getList',
                // url: 'http://192.168.50.193:8012/v1/oa/permission/getList',
            }).then(res => {
                if (res.data.code == 200) {
                    this.adminList = res.data.data
                }
            })
        },
        handleCheckAllChange(val) {
            var arr = []
            this.functionPermissionVOList = []
            this.adminList.forEach(item => {
                arr.push(item.id)
                if (val) {
                    this.functionPermissionVOList.push({
                        id:item.id,
                        functionName:item.functionName,
                        permissionState:true
                    })
                }else {
                    this.functionPermissionVOList.push({
                        id:item.id,
                        functionName:item.functionName,
                        permissionState:false
                    })
                }
            })
            this.admin.checkedMenu = val ? arr : []
            this.isIndeterminate = false
        },
        handleCheckedCitiesChange(value) {
            var arr = []
            for(var i = 0; i < value.length; i++) {
                for(var j = 0; j < this.adminList.length; j++) {
                    if (value[i] == this.adminList[j].id) {
                        arr.push({
                            id:this.adminList[j].id,
                            functionName:this.adminList[j].functionName,
                            permissionState:true
                        })
                    }
                }
            }
            this.arrayRepeat(arr,this.adminList).forEach(item => {
                arr.push({
                    id:item.id,
                    functionName:item.functionName,
                    permissionState:false
                })
            })
            this.functionPermissionVOList = arr
            let checkedCount = value.length
            this.admin.checkedMenu = value
            this.checkAll = checkedCount === this.adminList.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.adminList.length
        },
        arrayRepeat (array1, array2) {
            var result = []
            for (var i = 0; i < array2.length; i++) {
            var obj = array2[i]
            var num = obj.id
            var isExist = false
            for (var j = 0; j < array1.length; j++) {
                var aj = array1[j]
                var n = aj.id
                if (n === num) {
                isExist = true
                break
                }
            }
            if (!isExist) {
                result.push(obj)
            }
            }
            return result
        },
        // 新建子管理员确定
        handleNewAdmin() {
            this.$refs.addMember.validate((valid) => {
                if (valid) {
                    this.organization.forEach(item => {
                        item.adminRange = this.admin.range
                        if (item.adminRange != 0) {
                            item.adminRangeAddDTOS = []
                        }else {
                            item.adminRangeAddDTOS = this.adminRangeAddDTOS
                        }
                        item.userFunctionVO.functionPermissionVOList = this.functionPermissionVOList
                    })
                    this.$http({
                        method: 'POST',
                        url: this.orgManager+ '/v1/organization/admin/addSubAdmin',
                        // url: 'http://192.168.50.64:8013/v1/organization/admin/addSubAdmin',
                        data: this.organization
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type:'success',
                                message:'添加子管理员成功'
                            })
                            this.getMyCustomer()
                            this.showAddAdmin = false
                        }else if (res.data.code == 501100019) {
                            this.$message({
                                type:'error',
                                message:res.data.message
                            })
                        }
                    })
                } else {
                    return false;
                }
                });
        },
        // 编辑子管理员
        handleEditAdmin (item) {
            this.$http({
                method:'POST',
                url: this.orgManager + '/v1/organization/admin/queryAdminById',
                data:{
                    companyId:item.companyId,
                    employeeId:item.employeeId
                }
            }).then(res => {
                    if (res.data.code == 200) {
                    this.showEditAdmin = true
                    var str = ''
                    var array1 = []
                    var array3 = []
                    res.data.data.adminRangeList.forEach(item => {
                        str+= item.departmentName + '、'
                        array1.push({
                            departmentId:item.departmentId
                        })
                        array3.push({
                            id:item.departmentId,
                            departmentName:item.departmentName
                        })
                    })
                    var arr = []
                    var array2 = []
                    res.data.data.functionPermissionList.forEach(item => {
                        if (item.permissionState == true) {
                            arr.push(item.id)
                        }
                        array2.push({
                            id:item.id,
                            functionName:item.functionName,
                            permissionState:item.permissionState
                        })
                    })
                    this.adminRangeAddDTOS = array1
                    this.functionPermissionVOList = array2
                    this.organization = [{
                        companyId:this.companyObj.companyId,
                        employeeId:res.data.data.employeeId,
                        adminGrade:2,
                        adminRange:this.admin.range,
                        adminRangeAddDTOS:this.adminRangeAddDTOS,
                        userFunctionVO:{
                            userId:res.data.data.employeeId,
                            companyId:this.companyObj.companyId,
                            functionPermissionVOList:this.functionPermissionVOList
                        }
                    }]
                    this.admin.checkedMenu = arr
                    this.admin.department = str.slice(0,-1)
                    this.admin.name = res.data.data.employeeName
                    this.admin.range = res.data.data.adminRange
                    this.admin.departmentObj = array3
                    this.EditadminList = res.data.data.functionPermissionList
                    let checkedCount = arr.length
                    this.checkAll = checkedCount === this.EditadminList.length
                }
            })
        },
        // 删除子管理员
        handleRemoveAdmin (item) {
            console.log(item)
            this.$confirm('是否删除子管理员?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$http({
                        method:'POST',
                        url: this.orgManager + '/v1/organization/admin/deleteAdmin',
                        // url:'http://192.168.50.64:8013/v1/organization/admin/deleteAdmin',
                        data:
                            [{
                                companyId:item.companyId,
                                employeeId:item.employeeId,
                            }]
                    }).then(res => {
                        if (res.data.code == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        this.getMyCustomer()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getMyCustomer()
        },
        getMyCustomer () {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/admin/querySubAdminListByPage',
                // url: 'http://192.168.50.64:8013/v1/organization/admin/querySubAdminListByPage',
                data: {
                    companyId: this.companyObj.companyId,
                    pageNum: this.currentPage,
                    pageSize:this.pageSize,
                },
            }).then(res => {
                if (res.data.code === 200) {
                    this.organizational  = res.data.data.list
                    this.totalCount = res.data.data.totalCount
                }
            })
        },
        // 管理范围单选框
        handleRadioChange (value) {
            if (value == 0) {
                this.showdepartment = true
            }else {
                this.showdepartment = false
            }
        },
        handleEditAdminComplete () {
            this.organization.forEach(item => {
                item.adminRange = this.admin.range
                if (item.adminRange != 0) {
                    item.adminRangeAddDTOS = []
                }else {
                    item.adminRangeAddDTOS = this.adminRangeAddDTOS
                }
                item.userFunctionVO.functionPermissionVOList = this.functionPermissionVOList
            })
            this.$refs.editMember.validate((valid) => {
                if (valid) {
                    this.$http({
                            method: 'POST',
                            url: this.orgManager + '/v1/organization/admin/editAdminForGradeAndRange',
                            // url: 'http://192.168.50.64:8013/v1/organization/admin/addSubAdmin',
                            data: this.organization[0]
                        }).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type:'success',
                                    message:'编辑子管理员成功'
                                })
                                this.getMyCustomer()
                                this.showEditAdmin = false
                            }else if (res.data.code == 501100019) {
                                this.$message({
                                    type:'error',
                                    message:res.data.message
                                })
                            }
                        })
                } else {
                    return false;
                }
                });
        },
        // 显示选择管理员模态框
        showdePersondialog () {
            this.personDialogVisible = true
        },
        // 取消模态框
        handlePersonClose () {
            this.personDialogVisible = false
        },
         // 选择子管理员确定模态框
        handlePsrsonSubmit(value) {
            var str = ''
            var arr = []
            value.forEach(item => {
                str+=item.name + '、'
                arr.push({
                    companyId:this.companyObj.companyId,
                    employeeId:item.employeeId,
                    adminGrade:2,
                    adminRange:this.admin.range,
                    adminRangeAddDTOS:this.adminRangeAddDTOS,
                    userFunctionVO:{
                        userId:item.employeeId,
                        companyId:this.companyObj.companyId,
                        functionPermissionVOList:this.functionPermissionVOList
                    }
                })
            });
            this.organization = arr
            this.admin.name = str.slice(0,-1)
            this.personDialogVisible = false
        },
        // 选择管理范围模态框
        showdeDepartment () {
            this.departmentVisible = true
        },
        // 选择特定部门
        handleDepartment (value) {
            console.log(value)
            var str = ''
            var arr = []
            value.forEach(item => {
                str+= item.departmentName + '、'
                arr.push({
                    departmentId:item.id
                })
            })
            this.adminRangeAddDTOS = arr
            this.admin.departmentObj = value
            this.admin.department = str.slice(0,-1)
            this.departmentVisible = false
        },
        // 选择特定部门
        handleDepartmentClose () {
            this.departmentVisible = false
        },
        handleHideSlide(e) {
            if ( this.personDialogVisible === true || this.departmentVisible === true) {
            }else{
                if (!this.$refs.slide_dialog.contains(e.target) && !this.$refs.persondialog.contains(e.target) && !this.$refs.TreeTransferDialog.contains(e.target) ) {
                    this.showAddAdmin = false
                    this.showEditAdmin = false
                    this.admin.checkedMenu = []
                    this.admin.name = ''
                    this.$refs.editMember.clearValidate()
                    this.$refs.addMember.clearValidate()
                    this.admin.range = 2
                    this.admin.department = ''
                    this.showdepartment = false
                    this.checkAll = false
    
                }
            }
        },
    },
    mounted() {
        document.addEventListener('click', this.handleHideSlide)
        bus.$on('companyObj',msg => {
            this.companyObj = msg
        })
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleHideSlide)
    },
}
</script>

<style scss="lang">
.subadministrator {
    height: 100%;
    width: 100%;
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    background-color: rgba(255,255,255,1);
}
.subadministrator .el-table .warning-row {
    background: #F6F6FA;
}
.subadministrator  .el-table .success-row {
    background: #fff;
}
.subadministrator  .el-pagination {
    float: right;
    margin-top: 18px;
}
.subadministrator .slide_dialog {
    position:fixed;
    width:600px;
    height:100%;
    background:#FFFFFF;
    box-shadow:0px 2px 22px 0px rgba(58, 65, 74, 0.2);
    right:0;
    top:0;
    z-index: 9
}
.el-container  .el-dialog__close {
    display: none;
}
.subadministrator .slide_dialog h4 {
    padding: 24px 0 17px 40px;
    font-size: 20px;
    border-bottom: 1px solid #EDEFF2;
    color: #303133
}
.subadministrator .addMembers .el-input__inner {
    height: 30px;
    border: 1px solid #BFC2CC;
    margin-top: 5px;
}
.subadministrator .addMembers .el-form-item {
    margin-bottom: 10px;
}
.subadministrator .slide_footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 8px 20px;
    box-sizing: border-box;
    border-top:1px solid #EDEFF2;
}
.subadministrator .upload-demo {
    display: inline-block;
}
.subadministrator .el-input__inner {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.subadministrator .el-upload-list {
    display: none
}
/* .subadministrator  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 330px;
} */
.subadministrator .el-radio-group {
    margin-top: 13px;
}
.subadministrator .el-radio {
    margin-bottom: 10px;
}
.subadministrator .el-table th {
    padding: 8px 0;
}
.subadministrator .el-table td {
    padding: 4px 0;
}
.subadministrator  .el-radio__input.is-checked .el-radio__inner {
    border-color: #4278BE;
    background: #4278BE;
}
.subadministrator .el-radio__input.is-checked+.el-radio__label {
    color: #4278BE;
}
.subadministrator .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #4278BE;
}
.subadministrator .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #4278BE;
    border-color: #4278BE;
}
.subadministrator .el-checkbox {
    display: block;
    line-height: 25px;
}
.subadministrator .el-checkbox-group {
    margin-left: 30px;
}
.subadministrator .el-form-item__content {
    line-height: 0px;
}
</style>
