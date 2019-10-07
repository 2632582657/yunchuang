<!--@description: 资产维护
	@author: 刘钰
    @update: 刘钰(2019-06-14 14:57) -->
<template>
    <div class="assetMaintenance">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-row :gutter="20">
                    <el-col :span="18">
                            <el-input
                                placeholder="按照资产编号检索"
                                style="width:400px"
                                v-model="assetNo"
                            ></el-input>
                            <!-- <el-button icon="el-icon-search" @click="getMySubordinateList(1)"></el-button> -->
                            <el-button @click="toggle">
                                更多筛选
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-button style="margin:0" @click=buildAsset>新建资产</el-button>
                            <el-button :disabled="batchAsset.length == 0? true:false" @click="batchDelete">删除</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!-- 更多筛选 -->
            <div v-show="isShow">
                <el-form :inline="true" :model="filtrate" class="demo-form-inline">
                    <el-form-item label="">
                        <el-select v-model="filtrate.ST" placeholder="排序">
                            <el-option
                                v-for="sort in sortWay"
                                :key="sort.value"
                                :label="sort.label"
                                :value="sort.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资产名称">
                        <el-input v-model="filtrate.name" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="资产属性">
                       <el-select v-model="filtrate.property" placeholder="请选择">
                            <el-option
                                v-for="property in propertyWay"
                                :key="property.label"
                                :label="property.label"
                                :value="property.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资产类型">
                       <el-select v-model="filtrate.type" placeholder="集中批量采购">
                            <el-option
                                v-for="type in typeWay"
                                :key="type.label"
                                :label="type.label"
                                :value="type.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资产状态">
                       <el-select v-model="filtrate.state" placeholder="请选择">
                            <el-option
                                v-for="state in stateWay"
                                :key="state.value"
                                :label="state.label"
                                :value="state.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="更新时间">
                        <el-date-picker
                            v-model="filtrate.updateTime"
                            align="right"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </el-form-item>
                </el-form>
                <el-row style="margin: 20px 0">
                    <el-col :span="24">
                        <div class="grid-content bg-purple-dark">
                            <el-button type="primary" @click="getMySubordinateList()">搜索</el-button>
                            <el-button type="primary" @click="resetAsset" :disabled="reset">重置</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-table
            v-if="myCustomer !==''"
            class="el-table"
            ref="multipleTable"
            :data="myCustomer"
            border
            tooltip-effect="dark"
            style=""
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column align="center" label="资产编号" width="80" prop="assetNo">
                
            </el-table-column>
            <el-table-column align="center" prop="assetName" label="资产名称" width="170"></el-table-column>
            <el-table-column align="center" label="资产属性" width="100">
                <template slot-scope="scope">{{ scope.row.assetAttributes|TProperty}}</template>
            </el-table-column>
            <el-table-column align="center" prop="assetModel" label="规格型号" width="150"></el-table-column>
            <el-table-column align="center" label="资产类型" width="106">
                <template slot-scope="scope">{{ scope.row.assetType|TType}}</template>
            </el-table-column>
            <el-table-column align="center" prop="assetPrice" label="标价" width="66"></el-table-column>
            <el-table-column align="center" prop="updateTime" label="更新时间" width="100"></el-table-column>
            <el-table-column align="center" label="资产状态" width="80">
                <template slot-scope="scope">{{ scope.row.validState|TState}}</template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="220">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="look(scope.row.id)">查看</el-button>
                    <el-button size="mini" type="primary" @click="edit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="primary" @click="deleteAsset(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-else class="dataNull">
            <img src="" alt="">
            <h2>亲，根据您的搜索条件，没有找到相关资产</h2>
            <h5>去试试其他的搜索条件吧，或者直接导入系统默认资产</h5>
            <p><el-button size="small" type="primary">新建资产</el-button></p>
        </div>
        <el-pagination
            v-if="myCustomer.length !==0"
            class="el-pagination"
            @size-change="handleSizeChange"
            @current-change="getMySubordinateList"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
        ></el-pagination>
    </div>
</template>

<script>
export default {
    name:'assetMaintenance',
    data() {
        return {
            assetNo:"",             //资产编号
            filtrate:{              //更多筛选
                sort:"desc",        //排序  默认倒序
                time:"updateTime",  //      默认更新时间
                ST:3,
                name:"",            //资产名称
                property:"",        //资产属性
                type:"",            //资产类型
                state:"",           //资产状态
                updateTime:"",      //更新时间
            },
            sortWay: [
                {
                    value: 1,
                    label: '按创建时间倒序排序'
                },
                {
                    value: 2,
                    label: '按创建时间正序排序'
                },
                {
                    value: 3,
                    label: '按更新时间倒序排序'
                },
                {
                    value: 4,
                    label: '按更新时间正序排序'
                }
            ],
            propertyWay: [{
                value:"",
                label:"请选择"}],
            typeWay: [{
                value: "",
                label: '请选择'
                }],
            stateWay: [{            //资产状态
                    value: "",
                    label: '请选择'
                },{
                    value: 1,
                    label: '有效'
                },{
                    value: 0,
                    label: '无效'
                },
            ],
            myCustomer: [],         //表格数据
            currentPage: 1,         //页数
            pageSize: 10,           //第几页
            totalCount: 10,         //分页总条数
            isShow: false,    
            dialogFormVisible: false,
            pickerOptions: {        //日历
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            )
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            )
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            )
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            },
            batchAsset:[],          //选中数据
            deleteId:[],            //批量删除Id
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
                return arr.join("，")    
            }
        },
    },
    watch: {
        //排序
        SortTime(key){
            switch (key) {
                case 1:
                    this.filtrate.sort = 'desc';
                    this.filtrate.time = 'createTime';
                    this.getMySubordinateList()
                    break;
                case 2:
                    this.filtrate.sort = 'asc';
                    this.filtrate.time = 'createTime';
                    this.getMySubordinateList()
                    break;
                case 3:
                    this.filtrate.sort = 'desc';
                    this.filtrate.time = 'updateTime';
                    this.getMySubordinateList()
                    break;
                case 4:
                    this.filtrate.sort = 'asc';
                    this.filtrate.time = 'updateTime';
                    this.getMySubordinateList()
                    break;

                default:
                    break;
            }
        },
        //资产编号
        assetNo(val){
            var reg = /^\w{0,30}$/;
            if(!reg.test(val)){
                this.$message.error("请输入30个以内数字，字母或下划线")
                return
            }
            this.getMySubordinateList()
        },
        pageSize(val){
            this.getMySubordinateList()
        }
    },
    computed: {
        SortTime:function(){
            return this.filtrate.ST
        },
        reset:function(){
            if( this.assetNo !== "" ||
                this.filtrate.name !== "" ||
                this.filtrate.property !== "" ||
                this.filtrate.type !== ""||
                this.filtrate.state !== ""||
                this.filtrate.updateTime !== ""
            ){
                return false;
            }else{
                return true
            }
        }
    },
    created () {
        this.getMySubordinateList();
        this.getSelect();
    },
    methods: {
        // 获取资产列表
        getMySubordinateList (val) {
            this.$http({
                method:'get',
                url: '/oaManage/v1/oa/asset/page',
                params:{
                    assetNo: this.assetNo,
                    assetName: this.filtrate.name,
                    assetAttributes:this.filtrateproperty,
                    assetType: this.filtrate.type,
                    validState:this.filtrate.state,
                    sortMode:this.filtrate.sort,
                    startUpdateTime:this.filtrate.updateTime[0],
                    endUpdateTime:this.filtrate.updateTime[1],
                    sortField:this.filtrate.time, //排序字段
                    pageNo: val? val:1,
                    pageSize: this.pageSize,
                },
            }).then(res => {
                
                if(res.data.sysCode == 200 && res.data.code == 200){
                    this.myCustomer = res.data.data.pageList;
                    this.totalCount = res.data.data.totalCount

                }
            })
        },
        // 获取数据字典
        getSelect () {
            this.$http({
                method: 'get',
                url: '/oaManage/v1/oa/asset/key',
            }).then(res => {
                if(res.data.sysCode == 200 && res.data.code == 200){
                    // console.log(res)
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
                }
            })
        },
        //重置搜索条件
        resetAsset(){
            this.assetNo = "";
            this.filtrate.sort = "";      //排序      默认
            this.filtrate.name = "";      //资产名称
            this.filtrate.property = "";  //资产属性
            this.filtrate.type = "";      //资产类型
            this.filtrate.state = "";     //资产状态
            this.filtrate.updateTime = "";//更新时间
        },
        handleSelectionChange(item) {       
            this.batchAsset = item;
            this.deleteId = [];
            item.forEach (v => {
                this.deleteId.push(v.id);
            })
        },
        //翻页
        handleSizeChange(val) {
            this.pageSize = val
        },
        //显示更多筛选
        toggle: function() {
            this.isShow = !this.isShow
        },
        //新建资产
        buildAsset(){
            this.$router.replace({
                name:'newAsset',
                path:'/newAsset',
            });
        },
        look(id){
            this.$router.push({
                name: 'showAsset',
                path:'/showAsset',
                query: {id: id}
            })
        },
        //进入编辑流程
        edit(id){
            this.$router.push({
                name: 'editAsset',
                path:'/editAsset',
                query: {id: id}
            })

        },
        //删除流程
        deleteAsset(id){
            var that = this;
            this.$confirm('确定要删除该条审批流吗？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$http({
                    method:"delete",
                    url:"/oaManage/v1/oa/asset/" + id
                }).then(res => {
                    if(res.data.code == 200 && res.data.sysCode == 200){
                        setTimeout(() => {
                            that.getMySubordinateList()
                            that.$message({
                                message: '删除成功',
                                type: 'success',
                                duration:1000,
                            });
                        }, 100);
                    }else{
                        that.$message.error(res.data.message);
                    }
                })
            }).catch(() => {
            });
        },
        //批量删除
        batchDelete(){
            var that = this;
            this.$confirm('确定要删除吗？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { 
                that.$http({
                    method:"DELETE",
                    url:"/oaManage/v1/oa/asset/ids",
                    data:{
                        idList:that.deleteId
                    },
                }).then(res => {
                    if(res.data.code == 200 && res.data.sysCode == 200){
                        setTimeout(() => {
                            that.getMySubordinateList()
                            that.$message({
                                message: '删除成功',
                                type: 'success',
                                duration:1000,
                            });
                        }, 1000);
                    }else{
                        that.$message.error(res.data.message);
                    }
                })
            }).catch(() => {
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .assetMaintenance{
        .el-pagination {
            float: right;
        }
        .createTime .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner{
            width: 234px;
        }  
        .dataNull{
            margin:20px 0;
            border:1px solid #666;
            text-align: center;
            h2,h5,p{
                line-height: 40px;
            }
            
        }
    }

</style>

