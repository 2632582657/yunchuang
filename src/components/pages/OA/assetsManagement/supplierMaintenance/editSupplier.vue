<!--@description: 编辑供应商
	@author: 刘钰
    @update: 刘钰(2019-06-15 15:11) -->
<template>
    <div class="newAsset">
        <el-form 
            label-width="130px" 
            label-position='right'
            size="small"
            >
            <fieldset class="info">
                <h3>基本信息</h3>
                <el-form-item label="供货商名称：" required :class="{'is-error':checkName}">
                    <el-input 
                        v-model="assetNo"
                        maxlength="100"
                    ></el-input>
                </el-form-item>
                <el-form-item label="负责人：" >
                    <div class="department" @click="memberShow = true">
                        <div>
                            <template v-for="mem in approveMember">
                                {{mem.userName}}
                            </template>
                        </div>
                        <div v-show="approveMember.length == 0" class="placehold" v-for="(mem,index) in principals" :key = "index">
                            {{mem}}
                        </div>
                        <div v-show="approveMember.length == 0 && principals" class="placehold" >
                            请选择
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="联系方式：">
                    <el-input v-model="phone" type='number' placeholder="" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="地址：">
                    <el-select v-model="province" placeholder="选择省">
                        <el-option 
                            v-for="(unit,index) in provinceWay"
                            :key="index"
                            :label="unit.province"
                            :value="unit.provinceId"
                        ></el-option>
                    </el-select>
                    <el-select v-model="city" placeholder="选择市">
                        <el-option 
                            v-for="(unit,index) in cityWay"
                            :key="index"
                            :label="unit.city"
                            :value="unit.cityId"
                        ></el-option>
                    </el-select>
                    <el-select v-model="region" placeholder="选择区">
                        <el-option 
                            v-for="(unit,index) in regionWay"
                            :key="index"
                            :label="unit.area"
                            :value="unit.areaId"
                        ></el-option>
                    </el-select>
                    <el-input v-model="address" maxlength="100" class="else"></el-input>
                </el-form-item>
                <el-form-item label="开户行：">
                    <el-input v-model="bank" placeholder="" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="收款账户：">
                    <el-input v-model="account" placeholder="" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="收款账号：">
                    <el-input v-model="accountNum" type='number' placeholder="" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="税号：">
                    <el-input v-model="taxNumber" placeholder="" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="有效状态：" required>
                    <el-radio-group v-model="valid">
                        <el-radio :label="1" >有效</el-radio>
                        <el-radio :label="2">无效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </fieldset>
            <fieldset class="info">
                <h3>备注</h3>
                <el-form-item label="备注：">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        style="width:500px"
                        placeholder="请输入内容"
                        v-model="remark"
                        maxlength="500"
                        show-word-limit>
                    </el-input>
                </el-form-item>
                <div class="establish">
                    <ul class="clear">
                        <li>
                            <span>创建人：</span>
                            <input type="text" disabled  v-model="founder" placeholder="请输入创建人">
                        </li>
                        <li>
                            <span>所属机构：</span>
                            <input type="text" disabled v-model="institutions" placeholder="请输入所属机构">
                        </li>
                        <li>
                            <span>创建时间：</span>
                            <input type="text" disabled v-model="buildTime" placeholder="请输入创建时间">

                        </li>
                    </ul>
                </div>
            </fieldset>
            <div class="butBox">
                <el-button type="primary" @click="submitAsset">提交</el-button>
            </div>
            <el-dialog title="选择部门与人员" :visible.sync="memberShow" :close-on-click-modal='false' center>
                <div class="member">
                    <!-- <div class="title">选择部门与人员</div> -->
                    <Address class="address" @takeMember = "getMember(arguments)" @cancel="close()"></Address>
                </div>
            </el-dialog>
        </el-form>
        
    </div>
</template>

<script>
import '@/modules/common';
import Address from "../../../../commons/address";
export default {
    name:'editSupplier',
    components:{
        Address
    },
    data(){
        var checkNname = (rule, value, callback) => {
        };
        var checktype = (rule, value, callback) => {
        };
        var checkUnit = (rule, value, callback) => {
        };
        var checkValid = (rule, value, callback) => {
            if (!value) {
            return callback(new Error('年龄不能为空'));
            }
        };
        return{
            assetNo:"",         //供货商名称
            checkName:false,    
            phone:"",           //联系方式
            memberShow:false,
            approveMember:[],   //负责人
            principals:[],
            province:'',
            provinceNext:'',
            provinceWay:[],
            city:"",
            cityNext:"",
            cityWay: [],
            region:"",
            regionNext:"",
            regionWay: [],
            address:"",         //地址
            bank:"",
            account:'',
            accountNum:"",
            taxNumber:"",
            valid:1,            //是否有效
            remark:"",          //备注
            founder:"张小凡",
            institutions:"云创办公-信息技术部",
            buildTime:new Date().Format("yyyy-MM-dd hh:mm"),
            getData:{},
            dialogImageUrl: '', // 查看图片
            dialogVisible: false,
            imgUrl: '', // 上传图片路径
            imgInfo:[],//图片信息
            

        }
    },
    watch: {
        price(val){
            var reg = /\d+(\.\d{0,2})?/;
            if(!reg.test(val)){
                this.$message.error("请输入数字")
                return
            }
        },
        type(val){
            if(val.length == 0){
                this.showInside = false;
            }else{
                if(val.indexOf("4",0) !== -1){
                    this.showInside = true;
                }else{
                    this.showInside =false;
                }
            }
        },
        province(oldval,val){
            this.getCity()
            if(oldval == this.provinceNext){
                this.city = this.cityNext;
            }else{
                this.city = "";
            }
        },
        city(oldval,val){
            this.getregion();
            if(oldval == this.cityNext){
                this.region= this.regionNext;
            }else{
                this.region= "";
            }
        },
        
    },
    computed:{
        approveMembers:function(){
            var approveMember = [];
            if(this.approveMember.length !==0 ){
                approveMember = this.approveMember.map((item,index,arr) =>{
                    return item.userName
                })
            }
            return approveMember.join();
        }
    },
    created() {
        this.getSelect();
        this.assetId = this.$route.query.id;
        this.getAsset();
    },
    methods: {
        //获取当前资产信息
        getAsset(){
            this.$http({
                method:"get",
                url:"/oaManage/v1/oa/supplier/" + this.assetId
            }).then(res => {
                console.log(res)
                if(res.data.sysCode == 200 && res.data.code == 200){
                    var data = res.data.data;
                    this.assetNo = data.supplierName;
                    this.principals = data.principal.split();
                    this.phone  = data.contact;
                    this.province = data.province;
                    this.provinceNext = data.province;
                    this.cityNext = data.city;
                    this.regionNext = data.area;
                    this.address = data.detailAddress;
                    this.bank = data.bank;
                    this.account = data.receiptName;
                    this.accountNum = data.receiptAccount;
                    this.taxNumber = data.taxNumber;
                    if(data.validState == true){
                        this.valid = 1;
                    }else{
                        this.valid = 2;
                    }
                    this.remark = data.remark;
                    this.founder = data.createBy;
                    this.buildTime = data.createTime;
                }
            })
        },
        // 获取省
        getSelect () {
            this.$http({
                method: 'get',
                url: '/oaManage/v1/oa/getAllProvince',
            }).then(res => {
                if(res.data.sysCode == 200 && res.data.code == 200){
                    
                    this.provinceWay = res.data.data;
                }
            })
        },
        getCity(){
            if(this.province){
                this.$http({
                    method: 'get',
                    url: '/oaManage/v1/oa/getCityByProvinceId',
                    params:{provinceId:this.province}
                }).then(res => {
                    if(res.data.sysCode == 200 && res.data.code == 200){
                    this.cityWay = res.data.data;
                    }
                })
            }
        },
        getregion(){
            if(this.city){
                this.$http({
                    method: 'get',
                    url: '/oaManage/v1/oa/getAreaByCityId',
                    params:{cityId:this.city}
                }).then(res => {
                    if(res.data.sysCode == 200 && res.data.code == 200){
                        this.regionWay = res.data.data;
                    }
                })
            }
        },
        //子组件address选择的审批人
        getMember(data){
            this.memberShow = data[1];
            let approveMember = this.approveMember;
            approveMember = data[0];
            this.approveMember = this._unique(approveMember);
        },
        close(){
            this.memberShow = false;
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
        //提交供应商
        submitAsset(){
            if(this.assetNo == ""){
                this.$message.error("供货商名称不能为空")
                this.checkName = true;
                return
            }
            this.$http({
                method:"put",
                url:"/oaManage/v1/oa/supplier/updateSupplier/" + this.assetId,
                data:{
                    supplierName:this.assetNo,
                    contact:this.phone,
                    principal:this.approveMembers,
                    province:this.province,
                    city:this.city,
                    area:this.region,
                    detailAddress:this.address,
                    address:"",
                    bank:this.bank,
                    receiptName:this.account,
                    receiptAccount:this.accountNum,
                    taxNumber:this.taxNumber,
                    remark:this.remark,
                    validState:Boolean(this.valid),
                }
            }).then((res) => {
                if(res.data.sysCode == 200 && res.data.code == 200){
                    var that = this;
                    this.$message({
                        message: '保存成功！',
                        type: 'success',
                        duration:1000,
                        onClose(){
                            that.$router.push({name:'supplierMaintenance'})
                        }
                    });
                }else if(res.data.code == -1){
                     this.$message({
                        message: '供应商名称与现存供应商重名！',
                        type: 'error',
                     })
                }
            }).catch((error) => {
                console.log(error)
            })
        },
    },
}
</script>
<style lang="scss" scoped>
    .newAsset{
        .el-form{
            padding:0 30px;
            min-width:500px;
            max-width:1200px;
            .else{
                width:620px;
                margin-top:20px;
            }
           .info{
                .department{
                    min-width:100px;
                    background:#fff;
                    border:1px solid #DCDFE6;
                    border-radius: 4px;
                    padding:0 10px;
                    cursor: pointer;
                    .placehold{
                        color: #bbb;
                        padding-left:15px;
                    }
                }
                h3{
                    line-height:30px;
                    border-bottom:1px solid #bbb;
                    margin-bottom:20px;
                }
                .establish{
                    ul{
                        li{
                            float:left;
                            margin-right:50px;
                        }
                    }
                }
            } 
            .butBox{
                margin-top:30px;
                text-align: center;
            }
            
        }
        
    }
</style>
