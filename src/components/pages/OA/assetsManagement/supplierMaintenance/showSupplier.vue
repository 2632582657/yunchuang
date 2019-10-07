<!--@description: 模板，用以复制粘贴
	@author: 刘钰
    @update: 刘钰(2019-05-10 11:41) -->
<template>
    <div class="showAsset">
        <div class="top box">
            <h3>基本信息</h3>
            <p>
                <span>供货商名称：</span>
                <span>{{assetDetail.supplierName}}</span>
            </p>
            <p>
                <span>负责人：</span>
                <span>{{assetDetail.principal}}</span>
            </p>
            <p>
                <span>联系方式：</span>
                <span>{{assetDetail.contact}}</span>
            </p>
            <p>
                <span>地址：</span>
                <span v-cloak>{{province}} {{city}} {{region}}{{assetDetail.detailAddress}}</span>
            </p>
            <p>
                <span>开户行：</span>
                <span>{{assetDetail.bank}}</span>
            </p>
            <p>
                <span>收款账户：</span>
                <span>{{assetDetail.receiptName}}</span>
            </p>
            <p>
                <span>收款账号：</span>
                <span>{{assetDetail.receiptAccount}}</span>
            </p>
            <p>
                <span>税号：</span>
                <span>{{assetDetail.taxNumber}}</span>
            </p>
            <p>
                <span>有效状态：</span>
                <el-radio-group v-model="assetDetail.validState">
                    <el-radio :label="true" v-show="assetDetail.validState == true">有效</el-radio>
                    <el-radio :label="false" v-show="assetDetail.validState == false">无效</el-radio>
                </el-radio-group>
            </p>
        </div>
        <div class="center box">
            <h3>备注</h3>
            <p>
                <span>备注</span>
                <span>{{assetDetail.remark}}</span>
            </p>
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
    name:'showSupplier',
    data() {
        return {
            state:1,            //有效状态
            founder:"",
            institutions:"云创办公-信息技术部",
            buildTime:"",
            assetId:"",         //当前数据ID
            assetDetail:"",     //当前资产
            provinceWay:[],
            cityWay:[],
            regionWay:[],
        }
    },
    filters:{
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
        Taddress:function(key){
        }
    },
    watch: {

    },
    computed: {
        province(){
            if(this.provinceWay){
                for(var i in this.provinceWay){
                    if(this.provinceWay[i].provinceId == this.assetDetail.province){
                        return this.provinceWay[i].province
                    }
                }
            }
        },
        city(){
            if(this.cityWay){
                for(var i in this.cityWay){
                    if(this.cityWay[i].cityId == this.assetDetail.city){
                        return this.cityWay[i].city
                    }
                }
            }
        },
        region(){
            if(this.regionWay){
                for(var i in this.regionWay){
                    if(this.regionWay[i].areaId == this.assetDetail.area){
                        return this.regionWay[i].area
                    }
                }
            }
        }
    },
    created() {
        this.assetId = this.$route.query.id;
        this.getAsset();
    },
    methods: {
        // 获取省
        getSelect () {
            this.$http({
                method: 'get',
                url: '/oaManage/v1/oa/getAllProvince',
            }).then(res => {
                if(res.data.sysCode == 200 && res.data.code == 200){
                    this.provinceWay = res.data.data;
                    this.getCity();
                }
            })
        },
        getCity(){
            if(this.assetDetail.province){
                this.$http({
                    method: 'get',
                    url: '/oaManage/v1/oa/getCityByProvinceId',
                    params:{provinceId:this.assetDetail.province}
                }).then(res => {
                    if(res.data.sysCode == 200 && res.data.code == 200){
                    this.cityWay = res.data.data;
                    this.getregion();
                    }
                })
            }
        },
        getregion(){
            if(this.assetDetail.city){
                this.$http({
                    method: 'get',
                    url: '/oaManage/v1/oa/getAreaByCityId',
                    params:{cityId:this.assetDetail.city}
                }).then(res => {
                    if(res.data.sysCode == 200 && res.data.code == 200){
                        this.regionWay = res.data.data;
                    }
                })
            }
        },
        //获取数据
        getAsset(){
            this.$http({
                method:"get",
                url:"/oaManage/v1/oa/supplier/" + this.assetId
            }).then(res => {
                console.log(res)
                if(res.data.sysCode == 200 && res.data.code == 200){
                    this.assetDetail = res.data.data;
                    this.getSelect();
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
