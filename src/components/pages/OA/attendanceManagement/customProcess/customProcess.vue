<!--@description: 自定义审批流
	@author: 刘钰
    @update: 刘钰(2019-06-11 09:56) -->
<template>
    <div class="customProcess">
        <div class="btnBox" v-if="look">
            <button @click="look = false">新增</button>
        </div>
        <div class="tableBox" v-if="look">
            <table border=1>
                <tr>
                    <th width="160">标题</th>
                    <th width="90">审批类型</th>
                    <th width="210">需审批部门及人员</th>
                    <th width="300">自定义审批节点</th>
                    <th width="140">最后更改时间</th>
                    <th width="100">操作</th>
                </tr>
                <tr
                v-if="tableData"             
                v-for="(table,index) in tableData"
                :key="index"
                >
                    <th>{{table.approveName}}</th>
                    <th>{{table.applyName}}</th>
                    <th>{{table.departments}}</th>
                    <th class="node">
                        <template v-for="people in table.approvers">
                            <span>
                                <template v-for="peo in people">
                                    {{peo.userName}}
                                </template>
                            </span>
                        </template>
                    </th>
                    <th>{{table.updateTime}}</th>
                    <th class="operation">
                        <span @click="edit(table.id)">编辑</span>
                        <span @click="deleteProcess(table.id)">删除</span>
                    </th>
                </tr>
                <tr v-else><th colspan = "6">暂无数据</th> </tr>
            </table>
        </div>
        <div class="editCP" v-else>
            <div class="btnBox">
                <button @click="look = true">返回</button>
            </div>
            <div class="formBox">
                <el-form :rules="rules" :model="ruleForm" label-width="150px" size="small" ref="rulesEle">
                    <el-form-item label="标题：" prop="title">
                        <el-input v-model="ruleForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="选择审批类型：" :class="{'is-error':typeNull}" required>
                        <el-select v-model="ruleForm.typeValue" placeholder="请选择" @blur="checkType()">
                            <el-option 
                                v-for="type in approvalType" 
                                :key="type.id"
                                :label="type.applyName"
                                :value="type.id"
                            >
                            </el-option>
                            <div class="el-form-item__error">请选择审批类型</div>
                        </el-select>
                        <div v-show="ruleForm.typeValue == '' && typeNull == true" :class="{color:typeNull}">请输入审批类型</div>                     
                    </el-form-item>
                    <el-form-item label="需审批部门及人员：" required>
                        <div class="department" @click="memberShow = true;oName = 'apply'">
                            <div >
                                <template v-for="mem in ruleForm.approveMember">
                                    {{mem.userName}}
                                </template>
                            </div>
                            <div v-show="ruleForm.approveMember == 0" class="placehold" :class="{border:check}">
                                请选择
                            </div>
                        </div>
                        <div v-show="ruleForm.approveMember == 0 && check ==true" :class="{color:check}">请输入部门及人员</div>
                    </el-form-item>
                    <el-form-item label="自定义审批流：" class="process clear" required>
                        <div class="hasPeople fl clear">
                            <div class="members fl" v-for="(item,index) in ruleForm.process" :key="index">
                                <div v-for="process in item" :key="process.userId" class="fl group" @click="deleteMember('process',process,index)">
                                    <span class="imgdelete" @click="deleteMember('process',process,index)">
                                        <img src="./images/delete.png" alt="">
                                    </span>
                                    <img :src="process.headUrl" alt="">
                                    <span class="name" v-if="process.userName !== ''">{{process.userName}}</span>
                                </div>
                                <!-- <div class="arrow fl" v-show="ruleForm.process.length"><img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560753431348&di=b5e97eabf32ea83158b46bc9e59d88c8&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F17%2F03%2F04%2F87c846403feef48ed062541115c51d0a.jpg%2521%2Ffwfh%2F804x804%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue" alt=""></div> -->
                                <div class="arrow fl" v-show="ruleForm.process.length || ruleForm.process[0].length">--></div>
                            </div>
                        </div>
                        <div class="noPeople fl" @click="memberShow = true;oName = 'process'">
                            <img src="./images/add.png" alt="">
                        </div>
                        <div style="position: relative;left: -40px;top: 34px;" v-show="ruleForm.process == 0 && checkPro ==true" :class="{color:checkPro}">请输入审批流</div>
                    </el-form-item>
                    <div class="save">
                        <el-button type="primary" @click="saveApprove('rulesEle')">保存</el-button>
                    </div>                
                </el-form>
            </div>

            <el-dialog title="选择部门与人员" :visible.sync="memberShow" :close-on-click-modal='false' center>
                <div class="member">
                    <!-- <div class="title">选择部门与人员</div> -->
                    <Address class="address" @takeMember = "getMember(arguments)" @cancel="close()"></Address>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import Address from "../../../../commons/address";
    export default {
        name:'customProcess',
        components:{
            Address
        },
        data() {
            return {
                tableData: [],
                look:true, //查看审批流
                //编辑流程
                ruleForm:{
                    title:"",
                    typeValue:"",               //类型值
                    approveMember:[],           //审批人
                    process:[],                 //审批人流程
                },
                approvalType:[],                //审批类型             
                memberShow:false,               //是否显示通讯录-部门与人员
                oName:"",                       //是否显示通讯录-自定义审批流
                rules: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度在 30 个字符以内', trigger: 'blur' }
                    ],
                },
                check:false,                        //为空验证
                checkPro:false,                     //为空验证
                typeNull:false,                     //类型为空验证
                editProcess:[],                     //获取要编辑的数据
            }
        },
        watch: {
            'ruleForm.typeValue': {
                handler(newName, oldName) {
                    this.typeNull = false
                },
            }
        },
        created(){
            this.getApproval();
            this.getApprovalType();
        },
        methods:{
            //获取审批表格
            getApproval(){
                this.$http({
                    method:"get",
                    url:"/oaManage/v1/oa/back/approval",
                    params:{
                        pageNumber:1,
                        pageSize:10,
                    },
                }).then(res => {
                    // console.log(res.data)
                    if(res.data.code == 200 && res.data.sysCode == 200 ){
                        this.tableData = res.data.data.approvals;
                        this.tableData.map((item) => {
                            item.updateTime = item.updateTime.substring(0,16)
                            item.departments.map((departments,index,arr)=>{
                                item.departments = departments.departmentName + " "
                            })
                            item.users.map((user,index1,arr1) => {
                                if(arr1.length == 1){
                                    item.departments = item.departments + user.userName;
                                }else{
                                    item.departments = item.departments + user.userName + " ";
                                }
                            })
                            item.approvers.map((item2,index2,arr2) => {
                                if(item2){
                                    item2.map((item3,index3,arr3) => {
                                        if(item3 !== null){
                                            item.approveNode += item3.userName + ' '
                                        }
                                    })
                                }
                                
                            })
                            item.approveNode = item.approveNode.slice(9)
                        }) 
                    }
                    
                }).catch( (error) => {
                    console.log(error);
                })
            },
            //进入编辑流程
            edit(id){
                this.$http({
                    method:"get",
                    url:"/oaManage/v1/oa/back/approval/" + id
                    // url:"http://yapi.ycteam.work/mock/11/oaManage/v1/oa/writeReport/report/" + id,
                }).then(res => {
                    this.editProcess = res.data.data.approval;
                    // console.log(res.data.data.approval)
                    this.look = false;
                    //为要编辑的信息进行赋值
                    this.ruleForm.title = this.editProcess.approveName;
                    this.ruleForm.typeValue = this.editProcess.applyId;
                    this.ruleForm.approveMember = this.editProcess.users;
                    this.ruleForm.process = this.editProcess.approvers;
                })
                // //重置边框颜色改变变量
                // this.borderContent = false;
                // this.borderSchedule = false;
                // this.showTime = 'yyyy-MM-dd HH:mm';
                // this.editReportChange.date = false;
            },
            //删除流程
            deleteProcess(id){
                this.$confirm('确定要删除该条审批流吗？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        method:"delete",
                        url:"/oaManage/v1/oa/back/approval/" + id
                    }).then(res => {
                        if(res.data.code == 200 && res.data.sysCode == 200){
                            this.getApproval();
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                                duration:1000,
                            });
                        }else{
                            this.$message.error(res.data.message);
                        }
                    })
                }).catch(() => {
                    this.$message.error(res.data.message);          
                });
            },
            //获取审批类型
            getApprovalType(){
                this.$http({
                    method:"get",
                    url:"/oaManage/v1/oa/back/approval/apply"
                }).then((res) => {
                    this.approvalType = res.data.data.applyList;
                }).catch(error => {
                    console.log(error)
                })
            },
            //验证审批类型
            checkType(type){
                if(!this.ruleForm.typeValue){
                    this.typeNull = true;
                }else{
                    this.typeNull = false;
                }
            },
            //子组件address选择的审批人
            getMember(data){
                if (data[0] == "") {
                    this.$message.error("您未选择内容");
                    return;
                }else{
                    this.memberShow = data[1];
                    let approveMember = this.ruleForm.approveMember;
                    let process = this.ruleForm.process;
                   if(this.oName == "apply"){
                        approveMember = data[0];
                        this.ruleForm.approveMember = this._unique(approveMember);
                    }else if(this.oName == "process"){
                        process.push(data[0]);
                        this.ruleForm.process = process;
                    } 
                }
            },
            close(){
                this.memberShow = false;
                if(this.ruleForm.approveMember.length == 0){
                    this.check = true;
                }
                if(this.ruleForm.process.length == 0){
                    this.checkPro = true;
                }
            },
            deleteMember(name, value,index){
                console.log(name,value,index)
                let arr;
                if (name == "process") {
                    arr = this.ruleForm.process;
                } else if (name == "approve") {
                    arr = this.ruleForm.approveMember;
                }
                if(arr[index].length){
                    for (let i = 0; i < arr[index].length; i++) {
                        if (arr[index][i] == value) {
                            arr[index].splice(i, 1);
                        }
                    }
                }else{
                    arr.pop(arr[index])
                }
                arr = JSON.stringify(arr);
                window.sessionStorage.setItem(name, arr);
            },
            // 数组对象去重
            _unique(arr) {
                var res = [];
                for (var i = 0; i < arr.length; i++) {
                    var flag = true;
                    for (var j = 0; j < res.length; j++) {
                        if (arr[i].userId == res[j].userId) {
                            flag = false;
                        };
                    };
                    if (flag) {
                        res.push(arr[i]);
                    };
                };
                return res;
            },
            //保存审批流程
            saveApprove(formName){
                var approveMember = this.ruleForm.approveMember.map((item,index,arr) =>{
                    return item.userId
                })
                var approveProcess = [];
                for(var i = 0; i < this.ruleForm.process.length; i++){
                    let temp = [];
                    for(var j = 0; j < this.ruleForm.process[i].length; j++){
                        temp.push(this.ruleForm.process[i][j].userId)
                    }
                    approveProcess.push(temp);
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                    } else {
                        if(!this.ruleForm.typeValue){
                            this.typeNull = true;
                        }
                        if(this.ruleForm.approveMember.length == 0){
                            this.check = true;
                        }
                        if(this.ruleForm.process.length == 0){
                            this.checkPro = true;
                        }
                        return false;
                    }
                });
                if( this.ruleForm.title && 
                    this.ruleForm.typeValue && 
                    this.ruleForm.approveMember.length !== 0 && 
                    this.ruleForm.process.length !== 0){
                        //查重
                        this.$http({
                            method:"post",
                            url:"/oaManage/v1/oa/back/approval/checkDuplicate",
                            data:{
                                applyId:this.ruleForm.typeValue,
                                departmentIds:[],
                                userIds:approveMember,
                            }
                        }).then((res) => {
                            console.log(res.data)
                            var that = this;
                            if(res.data.code == 200 && res.data.sysCode == 200){
                                if(res.data.data.departmentIds.length == 0 && res.data.data.userIds.length == 0){
                                    that.$http({
                                        method:"post",
                                        url:"/oaManage/v1/oa/back/approval",
                                        data:{
                                            approveName:that.ruleForm.title,
                                            applyId:that.ruleForm.typeValue,
                                            departmentIds:[],
                                            userIds:approveMember,
                                            approverUserId:approveProcess,
                                        }
                                    }).then((res) => {
                                        if(res.data.code == 200 && res.data.sysCode == 200){
                                            that.$message.success("保存成功")
                                            this.look = true;
                                            this.getApproval();
                                        }
                                    })
                                }else{
                                    this.$confirm('你选择的审批部门及人员已有相关审批流程，是否使用新流程，若使用新流程，则原有流程作废','', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        center: true
                                    }).then(() => {
                                        //确定后保存新流程
                                        that.$http({
                                            method:"post",
                                            url:"/oaManage/v1/oa/back/approval",
                                            data:{
                                                approveName:that.ruleForm.title,
                                                applyId:that.ruleForm.typeValue,
                                                departmentIds:[],
                                                userIds:approveMember,
                                                approverUserId:approveProcess,
                                            }
                                        }).then((res) => {
                                            if(res.data.code == 200 && res.data.sysCode == 200){
                                                that.$message.success("保存成功")
                                                this.look = true;
                                                this.getApproval();
                                            }
                                        })
                                        //清空数据
                                        that.ruleForm.title = "";
                                        that.ruleForm.typeValue = "";
                                        that.ruleForm.approveMember.length = 0 ;
                                        that.ruleForm.process.length = 0;
                                    }).catch(() => {
                                        console.log("取消")
                                    });
                                }
                            }
                        }).catch( error => {
                            console.log(errorr)
                        })
                }
            }
        },
    }
  </script>
<style lang="scss" >
    .customProcess{
        .btnBox{
            margin:10px 0 30px 10px;
            button{
                width:150px;
                height:40px;
                border:1px solid #169bd5;
                border-radius:5px;
                background:#169bd5;
                color:#fff;
                cursor: pointer;
            }
        }
        .tableBox{
            table{
                tr{
                    height:40px;
                    background:#fff;
                }
                tr:nth-child(1){
                    background:#d5d5d5;
                }
                .node{
                    span:after{
                        content:"——"
                    }
                    span:last-child:after{
                        content:""
                    }
                }
                .operation{
                    span{
                        cursor: pointer;
                    }
                    span:nth-child(1){
                        color:#0099cc;
                        margin-right:10px;
                    }
                    span:nth-child(2){
                        color:red;
                    }
                }

            }

        }
        .editCP{
            .btnBox{
                margin:10px 0 30px 10px;
                button{
                    width:150px;
                    height:40px;
                    border:1px solid #169bd5;
                    border-radius:5px;
                    background:#169bd5;
                    color:#fff;
                    cursor: pointer;
                }
            }
            .formBox{
                margin:0 auto;
                width:650px;
                .border{
                    border:1px solid red;
                }
                .color{
                    color:#F56C6C;
                    font-size:12px;
                }
                .el-select{
                    width:100%;
                }
                .el-form-item.is-success .el-input__inner{
                    border-color: #DCDFE6;
                }
                .department{
                    width:100%;
                    background:#fff;
                    border:1px solid #DCDFE6;
                    border-radius: 4px;
                    cursor: pointer;
                    .placehold{
                        color: #bbb;
                        padding-left:15px;
                    }
                }
                .process{
                    .noPeople{
                        cursor: pointer;
                        background: #fff;
                        width:35px;
                        padding:2px;
                        img{
                            width:100%;
                        }
                    }
                    .hasPeople{
                        margin-top:-10px;
                        cursor: pointer;
                        .members{
                            margin:10px 0;
                            .group{
                                position:relative;
                                margin-right:20px;
                                text-align: center;
                                .imgdelete{
                                    position:absolute;
                                    right:-8px;
                                    top:-8px;
                                    width:15px;
                                    img{
                                        width:100%;
                                    }
                                }
                                img{
                                    width:35px;
                                }
                            }
                            
                        }
                        .arrow{
                            width:30px;
                            margin-right:10px;
                            img{
                                width:100%;
                            }
                        }
                    }
                }
                .save{
                    margin-top:50px;
                    text-align: center;
                    .el-button{
                        width:110px;
                    }
                }
            }
            .el-dialog{
                width: 760px;
            }
            .member{
                border:1px solid #bbb;
                background:#fff;
                .title{
                    text-align: center;
                    height:40px;
                    line-height:40px;
                    border-bottom: 1px solid #bbb;
                }
                .address{
                    padding:10px 20px;
                }
            }
        }
    }
</style>
