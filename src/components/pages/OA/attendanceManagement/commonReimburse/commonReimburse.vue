<!--@description: 通用报销
	@author: 刘钰
    @update: 刘钰(2019-06-21 14:41) -->
<template>
    <div class="commonReimburse">
        <div class="detailBox">
            <div class="detail" v-for="detail in details" :key="detail.id">
                <div class="title clear" v-if="details.length !== 1">
                    <span class="left fl">明细{{detail.id + 1}}</span>
                    <span class="right fr" @click="deleteDetail(detail.id)"><i class="el-icon-delete"></i></span>
                </div>
                <div class="formBox">
                    <el-form :label-width="lableWidth" size="small"  ref="rulesEle">
                        <el-form-item label="报销名称：" required :class="{'is-error':detail.checkName}">
                            <el-input v-model="detail.name"></el-input>
                        </el-form-item>
                        <el-form-item label="报销类别：" required :class="{'is-error':detail.checkType}">
                            <el-select v-model="detail.type" placeholder="请选择" @change="detail.change == 2">
                                <el-option 
                                    v-for="type in typeSelect" 
                                    :key="type.value"
                                    :value="type.label"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label='报销金额：' required :class="{'is-error':detail.checkMoney}">
                            <el-input v-model="detail.amount" type='number'></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div 
                    class="increase" 
                    v-if="detail.id + 1 == details.length"
                    @click="adddetail(details.length)"
                    >+增加报销明细
                </div>
            </div>
            <el-form label-width="150px" size="small" class="allMoney">
                <el-form-item label="总金额：" required>
                    <el-input v-model="allMoney"></el-input>
                </el-form-item>
                <el-form-item label="图片：">
                    <uploadImg :uploadImg="this.$http.defaults.baseURL + '/oaManage/v1/oa/uploadImages'" :fileList="{path:'5'}" ref="ImgUrl"></uploadImg>
                </el-form-item>
                <examineApprove
                    :labelWidth="lableWidth"
                    :isOne="true"
                    :isSingular="true"
                    :isApprove="isApprove"
                    :dataList="dataList"
                    @getDataList="getData"
                ></examineApprove>
                <copiedPerson @getCoper = "coper" :labelWidth="lableWidth" ref="copiedPersonData"></copiedPerson>
            </el-form>
            <div class="submit">
                <el-button type="primary" @click="submitReimburse()">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import uploadImg from '../../Apublics/uploadImg';
import examineApprove from '../../Apublics/examineApprove';
import copiedPerson from '../../Apublics/copiedPerson';
export default {
    name:'commonReimburse',
    components:{
        copiedPerson,uploadImg,examineApprove
    },
    data() {
        return {
            details:[{           //明细组
                id:0,
                name:"",
                type:"",
                amount:"",
                checkName:false,
                checkType:false,
                checkMoney:false,
                change:1,
            }], 
            money:0,
            typeSelect:[{
                        label:'差旅费',
                        value:1,
                    },{
                        label:'招待费',
                        value:2,
                    },{
                        label:'餐饮费',
                        value:3,
                    },{
                        label:'办公费',
                        value:4,
                    },{
                        label:'水费',
                        value:5,
                    },{
                        label:'电费',
                        value:6,
                    },{
                        label:'电话费',
                        value:7,
                    },{
                        label:'租赁费',
                        value:8,
                    },{
                        label:'维修费',
                        value:9,
                    },{
                        label:'低值易耗品费',
                        value:10,
                    },{
                        label:'邮寄费',
                        value:11,
                    },{
                        label:'其他',
                        value:12,
                    },],
            copiedPersons:[],
            lableWidth:'150px', 
            isApprove: true,  
            dataList: [],       //审批人列表 
        }
    },
    watch: {
        details:{
            handler(newValue, oldValue) {
                newValue.map((item,index,arr) => {
                    if( item.name){
                        item.checkName = false;
                    };
                    if(item.type){
                        item.checkType = false;
                    };
                    if(item.amount){
                        item.checkMoney = false;
                    };
                })   
            },
            deep:true,
        },
    },
    computed: {
        allMoney(){
           //总金额
                var temp = [];
                this.details.map((item,index,arr) => {
                    temp.push(parseInt(item.amount)) 
                })
                var sum = 0;
                for(var i = 0, len = temp.length; i < len; i++){
                    sum += temp[i];
                }
                if(sum == 0 || Number.isNaN(sum)){
                    sum = "";
                }
                return sum;

        }
    },
    beforeRouteLeave: function (to, from, next) {
        if (true) {
        next(false);
        this.$confirm("是否保存尚未提交内容?", "提示", {
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            type: "warning"
        })
            .then(() => {
            let content = [];
            for(var i in this.details){
                var temp = {};
                temp.amount = this.details[i].amount; 
                temp.name = this.details[i].name;
                temp.type = this.details[i].type;
                content.push(temp)
            }
            let that = this;
            // 保存草稿
            this.$http({
                method: "POST",
                url: "/oaManage/v1/oa/approval/reimburse/temp",
                data: {
                    content:content? content: [],
                    total:that.allMoney,
                    imgUrls: that.$refs.ImgUrl.imgUrl,
                    approverList:that.dataList,
                    recipientList:that.copiedPersons,
                    refuseReason:"",
                }
            })
                .then(res => {
                if (res.status === 200) {
                    next(true);
                }
                })
                .catch(error => {
                that.$message.error("保存草稿失败");
                });
            })
            .catch(error => {
            next(true);
            });
        }
    },
    created() {
        this.getApprover();
        this.readDraft();
    },
    methods: {
        //增加明细
        adddetail(length){
            var newDetail = {           //明细组
                id:length,
                name:"",
                type:'',
                amount:"",
                checkName:false,
                checkType:false,
                checkMoney:false,
                change:1,
            }
            this.details.push(newDetail)
        },
        //删除明细
        deleteDetail(id){
            this.details.splice(id,1)
            for (let i = 0; i < this.details.length; i++) {
                if (this.details[i].id == id) {
                    this.details.splice(i, 1);
                }
            }
        },
        //审批人
        getData(data) {
            console.log(data)
            this.dataList = data;
        },
        //抄送人
        coper(data){
            this.copiedPersons = data;
        },
        //获取审批人
        getApprover(){
            this.$http({
            method: "GET",
            url: "/oaManage/v1/oa/approvers",
            params: {
                applyId: '5',
            }
            }).then(res => {
                if (res.status === 200) {
                    if (res.data.data) {
                        if (res.data.data.approvers) {
                            if (res.data.data.approvers.length > 0) {
                                this.isApprove = false;
                                this.dataList = res.data.data.approvers;
                            } else {
                            }
                        }
                    }
                }
            }).catch((error) => {
                console.log(error)
            });    
        },
        //读取草稿
        readDraft(){
            this.$http({
                method: "GET",
                url: "/oaManage/v1/oa/approval/reimburse/temp",
            }).then(res => {
                // console.log(res)
                if (res.data.code === 200 && res.data.sysCode == 200) {
                    if (res.data.data) {
                        let data = res.data.data;
                        if(data.approverList){
                            this.dataList = data.approverList;
                        }
                        if(data.content){
                            this.details = data.content;
                        }
                        this.money = data.total;
                        this.$refs.ImgUrl.imgUrl = data.imgUrls;
                        this.copiedPersons = data.recipientList;
                    }
                }
            });    
        },
        // //保存草稿
        // saveDraft(){
        //     var that = this;
        //     //details做取舍
        //     if(this.details){
        //         let content = [];
        //         for(var i in this.details){
        //             var temp = {};
        //             temp.amount = this.details[i].amount; 
        //             temp.name = this.details[i].name;
        //             temp.type = this.details[i].type;
        //             content.push(temp)
        //         }
        //     }
        //     //验证details
        //     var detailsNull = false;
        //     for( var i in this.details){
        //         if(this.details[i].name !== "" || 
        //            this.details[i].type !== "" || 
        //            this.details[i].amount !== ""  
        //         ){
        //             detailsNull = true;
        //         }
        //     }
        //     if( this.allMoney || 
        //         detailsNull || 
        //         this.$refs.ImgUrl.imgUrl ||
        //         this.dataList.length !== 0 ||
        //         this.$refs.copiedPersonData.copyValue.length !== 0
        //         ){
        //             this.$confirm("是否保存尚未提交内容?", "提示", {
        //                 cancelButtonText: "取消",
        //                 confirmButtonText: "确定",
        //                 type: "warning"
        //             }).then(() => {
        //                 console.log(this)
                        
        //                 // 保存草稿
        //                 this.$http({
        //                         method: "POST",
        //                         url: "/oaManage/v1/oa/approval/reimburse/temp",
        //                         data: {
        //                             content:content? content: [],
        //                             total:that.allMoney,
        //                             imgUrls: that.$refs.ImgUrl.imgUrl,
        //                             approverList:that.dataList,
        //                             recipientList:that.copiedPersons,
        //                             refuseReason:"",
        //                         }
        //                 }).then(res => {
        //                     console.log(res)
        //                     if(res.data.code == 200 && res.data.sysCode == 200){
        //                         that.$message.success("保存成功");
        //                     }
        //                 }).catch(error => {
        //                     that.$message.error("保存草稿失败");
        //                 });
        //             }).catch(error => {

        //             });    
        //     }
            

        // },
        //保存报销
        submitReimburse(formName){
            let that = this;
            this.details.map((item,index,arr) => {
                if( item.name == ""){
                    item.checkName = true;
                }else{
                    item.checkName = false;
                };
                if(item.type == ""){
                    item.checkType = true;
                }else{
                    item.checkType = false;
                };
                if(item.amount == ""){
                    item.checkMoney = true;
                }else{
                    item.checkMoney = false;
                };
            })
            for(let i in this.details){
                if(this.details[i].name == ""){
                    this.$message.warning("报销名称不能为空")
                    return
                }
                if(this.details[i].type == ""){
                    this.$message.warning("报销类别不能为空")
                    return
                }
                if(this.details[i].amount == ""){
                    this.$message.warning("报销金额不能为空")
                    return
                }
            }
            let content = [];
            for(var i in this.details){
                var temp = {};
                temp.amount = this.details[i].amount; 
                temp.name = this.details[i].name;
                temp.type = this.details[i].type;
                content.push(temp)
            }
            if(this.allMoney == ""){
                this.$message.warning("总金额不能为空")
                return
            }
            if (this.dataList.length < 1) {
                this.$message.warning("至少选择一位审批人");
                return;
            }
            if (this.dataList.length > 0) {
                if (this.dataList[0].length < 1) {
                this.$message.warning("至少选择一位审批人");
                return;
                }
            }
            this.$http({
                method:"post",
                url:"/oaManage/v1/oa/approval/reimburse/",
                data:{
                    content:content,
                    total:this.allMoney,
                    imgUrls: this.$refs.ImgUrl.imgUrl,
                    approverList:this.dataList,
                    recipientList:this.copiedPersons,
                    refuseReason:"",
                }
            }).then((res) => {
                // console.log(res)
                if(res.data.code == 200 && res.data.sysCode == 200){
                    this.$message({
                        message: '提交成功！',
                        type: 'success',
                        duration:1000,
                    })
                    // //清空数据
                    this.details = [{
                        id:0,
                        name:"",
                        type:"",
                        amount:"",
                        checkName:false,
                        checkType:false,
                        checkMoney:false,
                        change:1,
                    }]
                    this.$refs.ImgUrl.clearFile();
                    this.dataList = [];
                    this.$refs.copiedPersonData.copyValue = [];
                }else{
                    this.$message.error("网络错误，请重试")
                }
            })
        },
    },
}
</script>
<style lang="scss" scoped>
    .commonReimburse{
        background:#fff;
        .detailBox{
            padding:40px 0;
            .detail{
                width:550px;
                border:1px solid #bbb;
                margin:0 auto 10px;
                .title{
                    height:40px;
                    line-height:40px;
                    border-bottom:1px solid #bbb;
                    span{
                        margin:0 30px;
                    }
                    .right{
                        color:blue;
                        cursor: pointer;
                    }
                }
                .formBox{
                    .el-form{
                        margin-top:20px;
                        .el-input,.el-select{
                            width:300px;
                        }
                    }
                }
                .increase{
                    border-top:1px solid #bbb;
                    text-align: center;
                    height:50px;
                    line-height:50px;
                    color:dodgerblue;
                    cursor: pointer;
                }
            }
            .allMoney{
                width:550px;
                margin:50px auto 0;
                .el-input,.el-select{
                    width:300px;
                }
            }
            .submit{
                width:140px;
                margin:40px auto 0;
                .el-button{
                    width:100%;
                }
            }
        }
    }
</style>
