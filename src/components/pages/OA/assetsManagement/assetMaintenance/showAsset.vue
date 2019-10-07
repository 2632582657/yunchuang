<!--@description: 模板，用以复制粘贴
	@author: 刘钰
    @update: 刘钰(2019-05-10 11:41) -->
<template>
    <div class="showAsset">
        <div class="top box">
            <h3>基本信息</h3>
            <p>
                <span>资产编号：</span>
                <span>{{assetDetail.assetNo}}</span>
            </p>
            <p>
                <span>资产名称：</span>
                <span>{{assetDetail.assetName}}</span>
            </p>
            <p>
                <span>规格型号：</span>
                <span>{{assetDetail.assetModel}}</span>
            </p>
            <p>
                <span>规格单位：</span>
                <span>{{assetDetail.assetUnit|TUnit}}</span>
            </p>
        </div>
        <div class="center box">
            <h3>详细信息</h3>
            <p>
                <span>资产属性：</span>
                <span>{{assetDetail.assetAttributes|TProperty}}</span>
            </p>
            <p>
                <span>资产类型：</span>
                <span>{{assetDetail.assetType | TType}}</span>
            </p>
            <p>
                <span>标价：</span>
                <span>{{assetDetail.assetPrice}}</span>
            </p>
            <div class="p">
                <span class="fl">是否对外销售：</span>
                <div class="fl">
                    <el-radio-group v-model="assetDetail.isExternalSale">
                        <el-radio :label="true" v-show="assetDetail.isExternalSale == true">是</el-radio>
                        <el-radio :label="false" v-show="assetDetail.isExternalSale == false">否</el-radio>
                    </el-radio-group>
                </div>
                <span class="fl">{{assetDetail.externalSalePrice}}</span>
            </div>
            <div class="p">
                <span class="fl">是否对员工销售：</span>
                <div class="fl">
                    <el-radio-group v-model="assetDetail.isEmployeeSale">
                        <el-radio :label="true" v-show="assetDetail.isEmployeeSale == true">是</el-radio>
                        <el-radio :label="false" v-show="assetDetail.isEmployeeSale == false">否</el-radio>
                    </el-radio-group>    
                </div>
                <span class="fl">{{assetDetail.employeeSalePrice}}</span>
            </div>
            <p>
                <span>有效状态：</span>
                <el-radio-group v-model="assetDetail.validState">
                    <el-radio :label="true" v-show="assetDetail.validState == true">有效</el-radio>
                    <el-radio :label="false" v-show="assetDetail.validState == false">无效</el-radio>
                </el-radio-group>
            </p>
            <p>
                <span>备注</span>
                <span>{{assetDetail.remark}}</span>
            </p>
            <div class="p">
                <span class= "fl">资产照片</span>
                <div class="fl">
                    <div v-for="pic in assetsPic" :key = "pic.id" >
                        <span type="text" class="title fl">{{pic.originalFileName}}</span>
                        <a :href="`http://` + pic.absolutePath" :download ="pic.originalFileName" target = "_blank">
                            <el-button type="text" class="but">下载</el-button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom box">
            <h3>操作日志</h3>
            <div class="establish">
                <ul class="clear">
                    <li>
                        <span>创建人：</span>
                        <input type="text" disabled  v-model="assetDetail.createBy" >
                    </li>
                    <li>
                        <span>所属机构：</span>
                        <input type="text" disabled v-model="institutions" >
                    </li>
                    <li>
                        <span>创建时间：</span>
                        <input type="text" disabled v-model="assetDetail.createTime">

                    </li>
                </ul>
            </div>
            <el-divider></el-divider>
            <div class="establish">
                <ul class="clear">
                    <li>
                        <span> 修改人：</span>
                        <input type="text" disabled  v-model="assetDetail.updateBy">
                    </li>
                    <li>
                        <span>所属机构：</span>
                        <input type="text" disabled v-model="institutions">
                    </li>
                    <li>
                        <span>修改时间：</span>
                        <input type="text" disabled v-model="assetDetail.updateTime">
                    </li>
                </ul>
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    name:'showAsset',
    data() {
        return {
            // toOutside:"true",        //是否对外销售
            toIndide:1,         //是否对员工销售
            state:1,            //有效状态
            founder:"",
            institutions:"云创办公-信息技术部",
            buildTime:"",
            assetId:"",         //当前数据ID
            assetDetail:"",     //当前资产
            assetsPic:[],       //资产图片
        }
    },
    filters:{
        //规格单位
        TUnit:function(key){
            switch (key) {
                case "1":
                    key = "个";
                    break;
                case "2":
                    key = "台";
                    break;  
                case "3":
                    key = "支";
                    break;  
                case "4":
                    key = "盒";
                    break;  
                case "5":
                    key = "包";
                    break;  
                case "6":
                    key = "张";
                    break;
                case "7":
                    key = "箱";
                    break;  
                case "8":
                    key = "根";
                    break;  
                case "4":
                    key = "盒";
                    break;  
                case "9":
                    key = "提";
                    break; 
                case "10":
                    key = "其他";
                    break; 
                default:""
                    break;
            }
            return key
        },
        //资产状态转换
		TState:function(key){//布尔类型
            switch (+key) {
                case 1:
                    key = "有效";
                    break;
                case 0:
                    key = "无效";
                    break;   
                default:""
                    break;
            }
            return key
        },
        //资产属性转换
		TProperty:function(key){
            switch (key) {
                case "1":
                    key = "低值易耗";
                    break;
                case "2":
                    key = "固定资产";
                    break;  
                case "3":
                    key = "高档奢侈品";
                    break;  
                case "4":
                    key = "酒水饮料";
                    break;  
                case "5":
                    key = "其他";
                    break;  
                default:""
                    break;
            }
            return key
        },
        //资产类型转换
		TType:function(key){
            if(key){
                var arr = key.split(",");
                for(var i in arr){
                    switch (arr[i]) {
                        case "1":
                            arr[i] = "集中批量采购";
                            break;
                        case "2":
                            arr[i] = "通用采购";
                            break;  
                        case "3":
                            arr[i] = "客户关怀";
                            break;  
                        case "4":
                            arr[i] = "员工福利";
                            break;   
                        default:""
                            break;
                    }
                } 
            return arr.join(",")    
            }
        },
    },
    created() {
        this.assetId = this.$route.query.id;
        this.getAsset();
    },
    methods: {
        getAsset(){
            this.$http({
                method:"get",
                url:"/oaManage/v1/oa/asset/" + this.assetId
            }).then(res => {
                    // console.log(res)
                    if(res.data.sysCode == 200 && res.data.code == 200){
                        this.assetDetail = res.data.data;
                        this.assetsPic = this.assetDetail.assetFileList
                    }
            })
        },

    },
}
</script>
<style lang="scss" scoped>
.showAsset{
    .box{
        h3{
            line-height:30px;
            border-bottom:1px solid #bbb;
            margin-bottom:20px;
        }
        p{
            padding-left:30px;
            line-height:60px;
            overflow: hidden;
            span{
                float: left;
            }
            span:nth-child(1){
                display:block;
                padding-right:60px;
                min-width:112px;
            }
        }
        .p{
            padding-left:30px;
            line-height:60px;
            overflow: hidden;
            span:nth-child(1){
                display:block;
                padding-right:60px;
                min-width:112px;
            }
            .title{
                color:#409EFF;
                max-width: 150px;
                min-width:80px;
                margin-right:150px;
                text-decoration: underline;
            }
            .but{
                text-decoration: underline;
            }
        }
        .pic{
            span:nth-child(2){
                
            }
        }
    }
    .bottom{
        .establish{
            margin-left:30px;
            ul{
                li{
                    float:left;
                    margin-right:50px;
                    span:nth-child(1){
                        padding-right:30px;
                    }
                }
            }
            
        }
    }
}

</style>
