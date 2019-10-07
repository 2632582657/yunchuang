<!--@description: 新建资产
	@author: 刘钰
    @update: 刘钰(2019-06-15 15:11) -->
<template>
    <div class="newAsset">
        <el-form 
            label-width="130px" 
            label-position=right
            size="small"
            >
            <fieldset class="info">
                <h3>基本信息</h3>
                <el-form-item label="资产编号：" required :class="{'is-error':checkNumber}">
                    <el-input 
                        v-model="number"
                        @focus="checkNumber=false"
                    ></el-input>
                </el-form-item>
                <el-form-item label="资产名称："  required :class="{'is-error':checkName}">
                    <el-input v-model="name" maxlength="100" @focus="checkName=false"></el-input>
                </el-form-item>
                <el-form-item label="型号规格：" maxlength="100" required :class="{'is-error':checkSftion}">
                    <el-input v-model="typeSftion" @focus="checkSftion=false"></el-input>
                </el-form-item>
                <el-form-item label="规格单位：" required :class="{'is-error':checkUnit}">
                    <el-select v-model="unit" placeholder="请选择活动区域">
                        <el-option 
                            v-for="unit in unitWay"
                            :key="unit.label"
                            :label="unit.label"
                            :value="unit.value"
                            @change="checkUnit = false"
                        ></el-option>
                    </el-select>
                    <el-input v-if="unit == 10" v-model="elseValue" maxlength="10" class="else"></el-input>
                </el-form-item>
            </fieldset>
            <fieldset class="info">
                <h3>详细信息</h3>
                <el-form-item label="资产属性：">
                    <el-select v-model="property" placeholder="请选择">
                        <el-option
                            v-for="property in propertyWay"
                            :key="property.label"
                            :label="property.label"
                            :value="property.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资产类型：">
                    <el-checkbox-group v-model="type">
                        <el-checkbox  
                            v-for="type in typeWay"
                            :key="type.value"
                            :label="type.value" 
                            :value ="type.value"
                            name="type">{{type.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="标价：">
                    <el-input v-model="price" type='number' :onkeyup="price= price.match(/\d+(\.\d{0,2})?/) ? price.match(/\d+(\.\d{0,2})?/)[0] : ''"></el-input>
                </el-form-item>
                <el-form-item label="是否对外销售：">
                    <el-col :span="3">
                        <el-radio-group v-model="outside">
                            <el-radio :label="1">否</el-radio>
                            <el-radio :label="2">是</el-radio>
                        </el-radio-group>
                    </el-col> 
                    <el-col :span="5" v-show="outside == 2">   
                        <el-input v-model="evaluateOut" placeholder="请填写售价" :onkeyup="evaluateOut= evaluateOut.match(/\d+(\.\d{0,2})?/) ? evaluateOut.match(/\d+(\.\d{0,2})?/)[0] : ''"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="是否对员工销售：" v-show="showInside">
                    <el-col :span="3">
                        <el-radio-group v-model="inside">
                            <el-radio :label="1" >否</el-radio>
                            <el-radio :label="2">是</el-radio>
                        </el-radio-group>
                    </el-col> 
                    <el-col :span="5" v-show="inside == 2">   
                        <el-input v-model="evaluateIn" placeholder="请填写售价" :onkeyup="evaluateIn= evaluateIn.match(/\d+(\.\d{0,2})?/) ? evaluateIn.match(/\d+(\.\d{0,2})?/)[0] : ''"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="有效状态：" required>
                    <el-radio-group v-model="valid">
                        <el-radio :label="1" >有效</el-radio>
                        <el-radio :label="0">无效</el-radio>
                    </el-radio-group>
                </el-form-item>
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
                <el-form-item label="资产照片：" class="assetPic">
                    <!-- <div class="pic">
                        <el-row :gutter="16">
                            <el-col :span="1"></el-col>
                            <el-col :span="8"><el-button type="text">资产配图1</el-button></el-col>
                            <el-col :span="2"><el-button type="text">下载</el-button></el-col>
                            <el-col :span="2"><el-button type="text">删除</el-button></el-col>
                        </el-row>
                    </div>
                    <div class="pic">
                        <el-row :gutter="16">
                            <el-col :span="1"></el-col>
                            <el-col :span="8"><el-button type="text">资产配图2</el-button></el-col>
                            <el-col :span="2"><el-button type="text">下载</el-button></el-col>
                            <el-col :span="2"><el-button type="text">删除</el-button></el-col>
                        </el-row>
                    </div> -->
                    <el-upload
                        :action="this.$http.defaults.baseURL + '/oaManage/v1/oa/asset/images'"
                        list-type="picture"
                        :on-success="handleUploadSuccess"
                        :on-preview="handlePictureCardPreview"
                        :data="getData"
                        :accept="`image/jpeg, image/png, image/jpg`"
                        :on-change='getFile'
                        name='images'
                        :on-remove='daletePic'
                    >
                        <div class="uploadShow clear"><i class="fr icon">附件上传</i></div>
                    </el-upload>

                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt>
                    </el-dialog>
                </el-form-item>
                <div class="establish">
                    <ul class="clear">
                        <li>
                            <span>创建人：</span>
                            <input type="text" :disabled= "isNewAsset"  v-model="founder" placeholder="请输入创建人">
                        </li>
                        <li>
                            <span>所属机构：</span>
                            <input type="text" :disabled = "isNewAsset" v-model="institutions" placeholder="请输入所属机构">
                        </li>
                        <li>
                            <span>创建时间：</span>
                            <input type="text" :disabled = "isNewAsset" v-model="buildTime" placeholder="请输入创建时间">

                        </li>
                    </ul>
                </div>
            </fieldset>
            <div class="butBox">
                <el-button type="primary" @click="submitAsset">提交</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import uploadImg from '@/components/pages/OA/Apublics/uploadImg';
import '@/modules/common';
export default {
    name:'newAsset',
    components:{
        uploadImg
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
            number:"",          //资产编号
            checkNumber:false,  //
            name:"",            //资产名称
            checkName:false,
            typeSftion:"",      //型号规格
            checkSftion:false,
            unit:0,             //规格单位
            checkUnit:false,
            property:0,         //资产属性
            type:[],            //资产类型
            price:"",           //标价
            outside:1,          //对外销售
            inside:1,           //对员工销售
            showInside:false,
            evaluateOut:"",     //对外售价
            evaluateIn:"",      //对内售价
            valid:1,            //是否有效
            remark:"",          //备注
            unitWay:[{          //规格单位选项
                value:0,
                label:'请选择',
            },],
            propertyWay: [{          //规格单位选项
                value:0,
                label:'请选择',
            }],
            typeWay: [],
            founder:"张小凡",
            institutions:"云创办公-信息技术部",
            buildTime:new Date().Format("yyyy-MM-dd hh:mm"),
            isNewAsset:true,
            getData:{},
            dialogImageUrl: '', // 查看图片
            dialogVisible: false,
            imgUrl: '', // 上传图片路径
            imgInfo:[],//图片信息
        }
    },
    watch: {
        number(val){
            var reg = /^\w{0,30}$/;
            if(!reg.test(val)){
                this.$message.error("请输入30个以内数字，字母或下划线")
                return
            }
        },
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
    },
    created() {
        this.getSelect();
    },
    methods: {
        // 获取数据字典
        getSelect () {
            this.$http({
                method: 'get',
                url: '/oaManage/v1/oa/asset/key',
            }).then(res => {
                if(res.data.sysCode == 200 && res.data.code == 200){
                    this.number = res.data.data.assetNo;
                    //获取资产属性
                    var map = res.data.data.assetAttributes;
                    for(var key in map){
                        var temp = {};
                        temp.label = map[key];
                        temp.value = key;
                        this.propertyWay.push(temp);
                    }
                    // 获取资产类型
                    var map1 = res.data.data.assetType;
                    for(var key in map1){
                        var temp1 = {};
                        temp1.label = map1[key];
                        temp1.value = key;
                        this.typeWay.push(temp1);
                    }
                    // 获取规格单位
                    var map2 = res.data.data.assetUnit;
                    for(var key in map2){
                        var temp2 = {};
                        temp2.label = map2[key];
                        temp2.value = key;
                        this.unitWay.push(temp2);
                    }
                }
            })
        },
        //图片上传返回参
        handleUploadSuccess (res,file) {
            this.imgInfo.push(res.data[0]);
            file.id = res.data[0].id;
        },
        //图片删除
        daletePic(file, fileList){
            // console.log(file,fileList)
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        //文件转码
        getFile(file, fileList) {
            this.getBase64(file.raw).then(res => {
                this.getData.images = res;
            });
        },
        getBase64(file) {
            return new Promise(function(resolve, reject) {
                let reader = new FileReader();
                let imgResult = "";
                reader.readAsDataURL(file);
                reader.onload = function() {
                    imgResult = reader.result;
                };
                reader.onerror = function(error) {
                    reject(error);
                };
                reader.onloadend = function() {
                    resolve(imgResult);
                };
            });
        },
        //提交资产
        submitAsset(){
            if(this.number == ""){
                this.$message.error("资产编号不能为空")
                this.checkNumber = true;
                return
            }
            if(this.name == ""){
                this.$message.error("资产名称不能为空")
                this.checkName = true;
                return
            }
            if(this.typeSftion == ""){
                this.$message.error("型号规格不能为空")
                this.checkSftion = true;
                return
            }
            if(this.unit == ""){
                this.$message.error("规格单位不能为空")
                this.checkUnit = true;
                return
            }
            this.$http({
                method:"post",
                url:"/oaManage/v1/oa/asset/",
                data:{
                    assetNo:this.number,
                    assetName:this.name,
                    assetModel:this.typeSftion,
                    assetUnit:this.unit,//数字类型
                    assetAttributes:this.property,//数字类型
                    assetType:this.type.join(),//数组类型
                    assetPrice:parseInt(this.price),
                    isExternalSale:Boolean(this.outside),
                    externalSalePrice:parseInt(this.evaluateOut),
                    isEmployeeSale:Boolean(this.inside),
                    employeeSalePrice:parseInt(this.evaluateIn),
                    assetFileList:this.imgInfo,
                    remark:this.remark,
                    validState:Boolean(this.valid),
                }
            }).then((res) => {
                // console.log(res)
                if(res.data.sysCode == 200 && res.data.code == 200){
                    var that = this;
                    this.$message({
                        message: '新增资产成功！',
                        type: 'success',
                        duration:1000,
                        onClose(){
                            that.$router.push({name:'assetMaintenance'})
                        }
                    });
                }else if(res.data.code == -1){
                     this.$message({
                        message: '资产名称与现存资产重名！',
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
                width:200px;
                margin-left:30px;
            }
           .info{
                h3{
                    line-height:30px;
                    border-bottom:1px solid #bbb;
                    margin-bottom:20px;
                }
                .assetPic{
                    width:440px;
                    .uploadShow{
                        width:300px;
                        border:1px solid #eee;
                        .icon{
                            background:#3399ff;
                            padding:0 5px;
                            color:#fff;
                        }
                    }
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
