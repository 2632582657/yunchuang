<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-row :gutter="20">
                    <el-col :span="19">
                        <div class="grid-content bg-purple">
                            <el-select v-model="sort" filterable placeholder="排序">
                                <el-option
                                    v-for="item in sortTime"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                            <el-input
                                placeholder="搜索客户名称"
                                style="width:150px"
                                v-model="searchCustomer"
                            ></el-input>
                            <el-button icon="el-icon-search" @click="getMySubordinateList(1)"></el-button>
                            <el-button @click="toggle">
                                更多筛选
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="grid-content bg-purple">
                            <el-button style="margin:0" @click="$router.replace('/newCustomerList')">新建客户</el-button>
                            <el-dropdown trigger="click" @command="handleCommand">
                                <el-button>更多</el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="转交">转交</el-dropdown-item>
                                    <el-dropdown-item command="取消关注">取消关注</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!-- 转交人 -->
            <el-dialog title="选择转交人" :visible.sync="dialogFormVisible" center>
                <el-form :model="form">
                    <el-input v-model="form.name" autocomplete="off" placeholder="搜索员工名字"></el-input>
                    <el-tree
                        :data="data"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        ref="tree"
                        highlight-current
                        :props="defaultProps"
                    ></el-tree>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="isTrue">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 更多筛选 -->
            <div v-show="isShow">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            客户经理
                            <el-select v-model="industry" placeholder="请选择">
                                <el-option
                                    v-for="item in industryList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            客户行业
                            <el-select v-model="industry" placeholder="请选择">
                                <el-option
                                    v-for="item in industryList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            客户类型
                            <el-select v-model="customerType" placeholder="请选择">
                                <el-option
                                    v-for="item in customerTypeList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
                <el-row style="margin-top:20px">
                     <el-col :span="6">
                        <div class="grid-content bg-purple">
                            客户状态
                            <el-select v-model="states" placeholder="请选择">
                                <el-option
                                    v-for="item in statesList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            客户来源
                            <el-select v-model="source" placeholder="请选择">
                                <el-option
                                    v-for="item in sourceList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple createTime">
                            创建时间
                            <el-date-picker
                                v-model="createTime"
                                align="right"
                                type="datetimerange"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            ></el-date-picker>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light editTime">
                            更新时间
                            <el-date-picker
                                v-model="updateTime"
                                align="right"
                                type="datetimerange"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            ></el-date-picker>
                        </div>
                    </el-col>
                </el-row>
                <el-row style="margin: 20px 0">
                    <el-col :span="24">
                        <div class="grid-content bg-purple-dark">
                            <el-button type="primary" @click="getMySubordinateList">搜索</el-button>
                            <el-button type="primary" @click="ResetCustomer">重置</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-table
            class="el-table"
            ref="multipleTable"
            :data="myCustomer"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column align="center" label="客户名称" width="120">
                <template slot-scope="scope">{{ scope.row.customerName }}</template>
            </el-table-column>
            <el-table-column align="center" prop="industryName" label="行业" width="100"></el-table-column>
            <el-table-column align="center" prop="managerList[0].customerManagerName" label="所属部门和客户经理" width="170"></el-table-column>
            <el-table-column align="center" prop="customerTypeName" label="类型" width="100"></el-table-column>
            <el-table-column align="center" prop="statesName" label="状态" width="100"></el-table-column>
            <el-table-column align="center" prop="updateTime" label="更新时间" width="170"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-view" @click="$router.push({ name: 'customerInformation', query: { customerId: scope.row.id }})"></el-button>
                    <el-button size="mini" icon="el-icon-edit" type="danger" @click="$router.push({ name: 'editCustomerInformation', query: { customerId: scope.row.id }})"></el-button>
                    <el-button size="mini">跟进客户</el-button>
                    <template v-if="scope.row.isFocus">
                        <el-button size="mini" @click="handleAttentionCustomer(scope.row)">关注</el-button>
                    </template>
                    <template v-else>
                        <el-button size="mini" @click="handleUnSubscribeCustomer(scope.row)">取消关注</el-button>
                    </template>
                </template>
            </el-table-column>
            <div slot="empty">
                <p>
                    <el-button size="small" type="primary"> 添加 </el-button>
                </p>
            </div>
        </el-table>
        <el-pagination
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
    name:'subordinateCustomer',
    data() {
        return {
            totalCount: 50,
            currentPage: 1,
            myCustomer: [],
            customerId: [],
            isShow: false,
            searchCustomer: '',
            pageSize: 10,
            customerType: '',
            industry: '',
            states: '',
            source: '',
            sort: '',
            sortTime: [
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
            customerTypeList:[],
            statesList:[],
            sourceList: [],
            industryList: [],
            dialogFormVisible: false,
            form: {
                name: '',
            },
            data: [
                {
                    id: 1,
                    label: '一级 1',
                    children: [
                        {
                            id: 4,
                            label: '二级 1-1',
                            children: [
                                {
                                    id: 9,
                                    label: '三级 1-1-1'
                                },
                                {
                                    id: 10,
                                    label: '三级 1-1-2'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    label: '一级 2',
                    children: [
                        {
                            id: 5,
                            label: '二级 2-1'
                        },
                        {
                            id: 6,
                            label: '二级 2-2'
                        }
                    ]
                },
                {
                    id: 3,
                    label: '一级 3',
                    children: [
                        {
                            id: 7,
                            label: '二级 3-1'
                        },
                        {
                            id: 8,
                            label: '二级 3-2'
                        }
                    ]
                }
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            pickerOptions: {
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
            createTime: '',
            updateTime: ''
        }
    },
    created () {
        this.getMySubordinateList()
        this.getMyCustomerSelect()
    },
    methods: {
        // 获取我的下属客户列表
        getMySubordinateList (val) {
            this.currentPage = val
            this.$http({
                method:'POST',
                url: 'https://result.eolinker.com/7hUBFSf3c24e3ab4d7c9a88a6d8c4566a61bf0d55f38d5a?uri=/v1/crm/componet/myFollow/list',
                data:{
                    customerName: this.searchCustomer,
                    customerManagerId: '',
                    industryCode: this.industry,
                    customerTypeCode: this.customerType,
                    statesCode: this.states,
                    sourceCode: this.source,
                    createTimeBegin: this.createTime[0],
                    createTimeEnd: this.createTime[1],
                    updateTimeBegin: this.updateTime[0],
                    updateTimeEnd: this.updateTime[1],
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    sort: this.sort,
                },
            }).then(res => {
                console.log(res)
                if (res.status === 200) {
                    this.myCustomer = res.data.data.data
                    this.totalCount =  res.data.data.totalCount
                }
            })
        },
        // 获取下拉列表
        getMyCustomerSelect () {
            this.$http({
                method: 'GET',
                url: 'https://result.eolinker.com/7hUBFSf3c24e3ab4d7c9a88a6d8c4566a61bf0d55f38d5a?uri=/v1/crm/componet/customer/select'
            }).then(res => {
                if (res.status === 200) {
                    this.customerTypeList = res.data.data.customerTypeList
                    this.statesList = res.data.data.statesList
                    this.sourceList = res.data.data.sourceList
                    this.industryList = res.data.data.industryList
                    this.pageSize = res.data.data.pageSize
                }
            })
        },
        ResetCustomer () {
            this.industry = '',
            this.states = '',
            this.source = '',
            this.sort = '',
            this.createTime = '',
            this.updateTime = '',
            this.customerType = ''
        },
        // 关注单个客户
        handleAttentionCustomer (item) {
            this.$http({
                method: 'POST',
                url: 'https://result.eolinker.com/7hUBFSf3c24e3ab4d7c9a88a6d8c4566a61bf0d55f38d5a?uri=/v1/crm/componet/follow',
                data: {
                    customerId: item.id
                }
            }).then(res => {
                console.log(res)
                if (res.status === 200) {
                    this.$message({
                        message: '关注成功',
                        type: 'success'
                    })
                    item.isFocus = false
                }
            })
        },
        handleUnSubscribeCustomer (item) {
            this.$http({
                method: 'POST',
                url: 'https://result.eolinker.com/7hUBFSf3c24e3ab4d7c9a88a6d8c4566a61bf0d55f38d5a?uri=/v1/crm/componet/unfollow',
                data: {
                    customerId: item.id
                }
            }).then(res => {
                console.log(res)
                if (res.status === 200) {
                    this.$message({
                        message: '取消关注',
                        type: 'success'
                    })
                    item.isFocus = true
                }
            })
        },
        handleSelectionChange(item) {
            item.forEach (v => {
                this.customerId.push({customerId:v.id})
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
        },
        // 选中关注客户
        handleCommand(command) {
            if (command === '转交') {
                this.dialogFormVisible = true
            }else if ((command === '取消关注')) {
                this.$http({
                method: 'POST',
                url: 'https://result.eolinker.com/7hUBFSf3c24e3ab4d7c9a88a6d8c4566a61bf0d55f38d5a?uri=/v1/crm/componet/follow',
                data: {
                    customerId: this.customerId
                }
            }).then(res => {
                if (res.status === 200) {
                    this.$message({
                        message: '恭喜你，这是一条成功消息',
                        type: 'success'
                    });
                }
            })
            }
        },
        isTrue() {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
                this.dialogFormVisible = false
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
                this.dialogFormVisible = false
            })
        },
        toggle: function() {
            this.isShow = !this.isShow
        }
    }
}
</script>

<style scoped>
.el-pagination {
    float: right;
}
.createTime .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner{
    width: 220px;
}
</style>
