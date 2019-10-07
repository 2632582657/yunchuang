<!--@description: 待我审批
	@author: 李瑞军
    @update: 李瑞军(2019-08-30 09:45) -->
<template>
	<div id="myApproval">
		<div class="summary_content clear">
			<div class="summary_search">
				<el-form class="clear awaitApproval_form" ref="awaitApprovalForm">
                    <el-form-item label="" class="fl" style="width: 438px;margin-right:15px">
						<el-input 
                        prefix-icon="el-icon-search"
                        placeholder="请输入关键字，包括审批标题、正文内容、审批意见"
                        v-model="search.queryApproval"
						@input="getApprovalData"
                        ></el-input>
					</el-form-item>
					<el-form-item class="fl" style="width: 100px;margin-right:30px;margin-bottom:20px" v-show="!gradeQuery">
						<el-button type="primary" @click="getApprovalData" style="width:110px;height:40px;background:#4278BE;color:#fff">搜索</el-button>
					</el-form-item>
					<el-form-item class="fl" style="width: 100px;">
						<div style="color:#2AA1E1;cursor: pointer" @click="gradeQuery = !gradeQuery">{{gradeQuery ? '关闭高级查询' : '高级查询'}}</div>
					</el-form-item>
					<div v-show="gradeQuery">
						<br>
						<br>
						<br>
					</div>
					<el-form-item label="提交审批时间" class="fl" style="width: 455px;" v-show="gradeQuery">
						<div style="width:340px;display:inline-block">
							<el-date-picker
								v-model="search.sumitDate"
								type="daterange"
								class="daterangeData"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="yyyy-MM-dd"
								:picker-options="pickerOptions">
							</el-date-picker>
						</div>
					</el-form-item>
                    <el-form-item label="完成审批时间" class="fl" style="width: 455px;" v-show="gradeQuery">
						<div style="width:340px;display:inline-block">
							<el-date-picker
								v-model="search.completeDate"
								type="daterange"
								class="daterangeData"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="yyyy-MM-dd"
								:picker-options="pickerOptions">
							</el-date-picker>
						</div>
					</el-form-item>
                    <div v-show="gradeQuery">
						<br>
						<br>
						<br>
					</div>
					<el-form-item label="审批单发起人" class="fl" style="width: 440px;" v-show="gradeQuery">
						<p class="sender" @click="personDialogVisible = true">
							{{senderLists.length>13?(senderLists.slice(0,13)+'...'):senderLists}}</p>
					</el-form-item>
					<div v-show="gradeQuery">
						<br>
						<br>
						<br>
					</div>
					<el-form-item class="fl" style="width: 100px;margin-right:30px;margin-bottom:20px" v-show="gradeQuery">
						<el-button type="primary" @click="getApprovalData" style="width:110px;height:40px;background:#4278BE;color:#fff">搜索</el-button>
					</el-form-item>
					<el-form-item class="fl" style="width: 100px;margin-right:30px;margin-bottom:20px" v-show="gradeQuery">
						<el-button type="primary" style="width:110px;height:40px;background:#fff;color:#4278BE;border:1px solid #4278BE" @click="resetAwaitApprovalForm">重置</el-button>
					</el-form-item>
				</el-form>
				<el-form class="clear" style="margin:15px 0 0px 0">
					<el-form-item label="审批类型" class="fl" style="width: 200px;">
						<el-select v-model="search.arrprvalType" placeholder="全部" style="width: 114px;" @change="getApprovalData">
							<el-option
                                label="全部"
                                value="全部"
                            ></el-option>
							<el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.id">
                            </el-option>
						</el-select>
					</el-form-item>
                    <el-form-item label="审批状态" class="fl" style="width: 200px;">
						<el-select v-model="search.approvalStatu" placeholder="全部" style="width: 114px;" @change="getApprovalData">
							<el-option
                                label="全部"
                                value="全部"
                            ></el-option>
							<el-option
                                v-for="item in approvalStatus"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.id">
                            </el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
			<div class="summary_table">
                <el-table
                    class="el-table"
                    ref="multipleTable"
                    :data="myApprovalData"
					border
					:header-cell-style="{
					'text-align':'left',
					'color': '#303133',
					'font-size':'16px'
					}"
					:cell-style="{
					'text-align':'left',
					'color': '#606266',
					'font-size':'14px'
					}"
                    @row-click="handleApprvolDetial"
                    :row-class-name="tableRowClassName"
                    style="width: 100%">
                    <el-table-column align="center" label="审批标题" prop="approveName">
						<div slot-scope="scope" class="clear">
                            <img :src="scope.row.iconUrl" alt="" style="border-radius:3px;" width="45px" height="45px" class="fl" v-if="scope.row.iconUrl">
							<img src="./images/icon_head.png" alt="" style="border-radius:3px;" width="45px" height="45px" class="fl" v-else>
							<div class="fl" style="margin:10px 0 0 20px">{{scope.row.approveName}}</div>
                        </div>
                    </el-table-column>
                    <el-table-column align="center" prop="adminRangeList" label="审批摘要" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <div v-for="item in scope.row.approveSynopsis">{{item}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="displayTime" label="发起时间" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column align="center" label="状态" prop="displayStatus">
                        <template slot-scope="scope">
                            <div style="color:#6CC9A8" v-if="scope.row.approveStatus == 3">{{scope.row.displayStatus}}</div>
                            <div style="color:#FF6565" v-else-if="scope.row.approveStatus == 4">{{scope.row.displayStatus}}</div>
                            <div style="color:#BFC2CC" v-else-if="scope.row.approveStatus == 5">{{scope.row.displayStatus}}</div>
                            <div style="color:#2AA1E1" v-else>{{scope.row.displayStatus}}</div>
                        </template>
                    </el-table-column>
                </el-table>
				<el-pagination
                    class="fr"
					@size-change="handleSizeChange"
					@current-change="getApprovalData"
                    :current-page.sync="currentPage"
					:page-sizes="[5, 10, 15, 20,25,30]"
					:page-size="100"
					layout="total, sizes, prev, pager, next, jumper"
					:total="totalCount">
				</el-pagination>
			</div>
		</div>
		<PersonDialog
			:treeData="personnelList"
			:defaultProps="{label:'name',children:'children'}"
			:transferTitle="['选择部门人员', '已选择']"
			:dialogVisible="personDialogVisible"
			:managers="managerList"
            :select="true"
			@handlePersonClose="handlePersonClose"
			@handlePsrsonSubmit="handlePsrsonSubmit"></PersonDialog>
        <Sidebar :sidebarShow="sidebar" :awaitApprvolDetial="awaitApprvolDetial" @close="handleCloseSidebar"></Sidebar>
	</div>
</template>

<script>
    import PersonDialog from '../../../commons/persondialog'
    import Sidebar from './publics/sliderDialog'
	export default {
		name: "myApproval",
		data() {
			return {
				pickerOptions: {
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							let date = new Date();
							let fullYear = date.getFullYear();
							let month = date.getMonth() + 1;
							let ms = month < 10 ? "-" + "0" + month : "-" + month;
							let day = date.getDate();
							let ds = day < 10 ? "-" + "0" + day : "-" + day;
							let rs = fullYear + ms + ds;
							let time = date.getHours();
							if (time < 10) {
								rs += " 0" + time;
							} else {
								rs += " " + time;
							}
							let minutes = date.getMinutes();
							let min = minutes < 10 ? ":0" + minutes : ":" + minutes;
							let seconds = date.getSeconds();
							let sed = seconds < 10 ? ":0" + seconds : ":" + seconds;
							rs += min + sed;

							// const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
							const end = rs;
							let date1 = new Date(new Date(new Date().toLocaleDateString()).getTime());
							const start = date1.getFullYear() + "-" + ((date1.getMonth() + 1) < 10 ? "0" + (date1.getMonth() + 1) : (date1.getMonth() + 1)) + "-" + (date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate()) + " " + (date1.getHours() < 10 ? "0" + date1.getHours() : date1.getHours()) + ":" + (date1.getMinutes() < 10 ? "0" + date1.getMinutes() : date1.getMinutes()) + ":" + (date1.getSeconds() < 10 ? "0" + date1.getSeconds() : date1.getSeconds());
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '本周',
						onClick(picker) {
							let getTime = (n) => {
								let now = new Date();
								let year = now.getFullYear();
								let month = now.getMonth() + 1;
								let day = now.getDay(); //返回星期几的某一天;
								n = day == 0 ? n + 6 : n + (day - 1)
								now.setDate(now.getDate() - n);
								let date = now.getDate();
								let s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
								return s;
							}
							let date = new Date();
							let fullYear = date.getFullYear();
							let month = date.getMonth() + 1;
							let ms = month < 10 ? "-" + "0" + month : "-" + month;
							let day = date.getDate();
							let ds = day < 10 ? "-" + "0" + day : "-" + day;
							let rs = fullYear + ms + ds;
							let time = date.getHours();
							if (time < 10) {
								rs += " 0" + time;
							} else {
								rs += " " + time;
							}
							let minutes = date.getMinutes();
							let min = minutes < 10 ? ":0" + minutes : ":" + minutes;
							let seconds = date.getSeconds();
							let sed = seconds < 10 ? ":0" + seconds : ":" + seconds;
							rs += min + sed;

							// const end = getTime(-6) + " 23:59:59";
							const end = rs;
							const start = getTime(0) + " 00:00:00";
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '本月',
						onClick(picker) {
							let formatDateTime = (inputTime) => {
								let date = new Date(inputTime);
								let y = date.getFullYear();
								let m = date.getMonth() + 1;
								m = m < 10 ? ('0' + m) : m;
								let d = date.getDate();
								d = d < 10 ? ('0' + d) : d;
								let h = date.getHours();
								h = h < 10 ? ('0' + h) : h;
								let minute = date.getMinutes();
								let second = date.getSeconds();
								minute = minute < 10 ? ('0' + minute) : minute;
								second = second < 10 ? ('0' + second) : second;
								return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
							};

							let date = new Date();
							let fullYear = date.getFullYear();
							let month = date.getMonth() + 1;
							let ms = month < 10 ? "-" + "0" + month : "-" + month;
							let day = date.getDate();
							let ds = day < 10 ? "-" + "0" + day : "-" + day;
							let rs = fullYear + ms + ds;
							let time = date.getHours();
							if (time < 10) {
								rs += " 0" + time;
							} else {
								rs += " " + time;
							}
							let minutes = date.getMinutes();
							let min = minutes < 10 ? ":0" + minutes : ":" + minutes;
							let seconds = date.getSeconds();
							let sed = seconds < 10 ? ":0" + seconds : ":" + seconds;
							rs += min + sed;

							let data = new Date();
							data.setDate(1);
							data.setHours(0);
							data.setSeconds(0);
							data.setMinutes(0);

							// const end = getTime(-6) + " 23:59:59";
							const end = rs;
							const start = formatDateTime(data.getTime());

							picker.$emit('pick', [start, end]);
						}
					}]
                },
                options:[],
                approvalStatus:[
                    {
                        id:0,
                        typeName:'审批中'
                    },
                    {
                        id:1,
                        typeName:'审批完成 '
                    },
                    {
                        id:2,
                        typeName:'撤销'
                    },
                ],
                gradeQuery:false,     //高级查询
                sidebar:false,         //侧边栏详情展示
				userDetail: JSON.parse(sessionStorage.getItem("teamEmployeeDetailVO")),
				personDialogVisible: false,
				awaitApprvolDetial:{},
				senderLists: "点击选择提交人",
				personnelList: [],
				senderIdList:'',
				search: {
                    arrprvalType: "全部",
                    approvalStatu:'全部',
                    queryApproval:'',
                    sumitDate: '',        //提交审批时间
                    completeDate:'',  //完成审批时间
					summitName: "",
					beginTime: '',
                    endTime: '',
                    approvalBeginTime:'',
                    approvalEndTime:'',
				},
				myApprovalData: [],
                currentPage:1,
				pageSize: 5,
				totalCount: 0,
				managerList: [],//通讯录用
			}
		},
		components: {
            PersonDialog,
            Sidebar
		},
		watch: {
			'search.sumitDate': {
				handler: function () {
					if (this.search.sumitDate) {
						if (this.search.sumitDate[0].length <= 10)
							this.search.beginTime = this.search.sumitDate[0] + " 00:00:00";
						else
							this.search.beginTime = this.search.sumitDate[0];
						if (this.search.sumitDate[1].length <= 10)
							this.search.endTime = this.search.sumitDate[1] + " 23:59:59";
						else
							this.search.endTime = this.search.sumitDate[1];
					}else{
						this.search.beginTime = null;
						this.search.endTime = null;
						this.getApprovalData()
					}
				},
				deep: true
            },
            'search.completeDate': {
				handler: function () {
					if (this.search.completeDate) {
						if (this.search.completeDate[0].length <= 10)
							this.search.approvalBeginTime = this.search.completeDate[0] + " 00:00:00";
						else
							this.search.approvalBeginTime = this.search.completeDate[0];
						if (this.search.completeDate[1].length <= 10)
							this.search.approvalEndTime = this.search.completeDate[1] + " 23:59:59";
						else
							this.search.approvalEndTime = this.search.completeDate[1];
					}else{
						this.search.approvalBeginTime = null;
						this.search.approvalEndTime = null;
						this.getApprovalData()
					}
				},
				deep: true
			}
		},
		created() {
			//获取通讯录人员数据
            this.getPersonnelList()
            this.queryApprovalType()
            this.getApprovalData()
		},
		methods: {
            //表格隔行变色
            tableRowClassName({row, rowIndex}) {
                if(rowIndex%2==1){
                    return 'success-row'
                }else{
                    return 'warning-row'
                }
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getApprovalData()
            },
            queryApprovalType () {
                this.$http({
                    method:'GET',
                    url:'/oaManager/v1/feign/oa/approve/queryAllType',
                }).then(res => {
                    if (res.data.code == 200) {
                        this.options = res.data.data
                    }
                })
			},
			// 关闭侧边栏
			handleCloseSidebar (flag) {
				if (flag != false) {
					this.handleApprvolDetial(flag)
				}else {
					this.sidebar = flag
					this.getApprovalData()
				}
			},
            // 获取审批表格数据
            getApprovalData () {
                this.$http({
                    method:'POST',
                    url:'oaManager/v1/feign/oa/approve/queryIFinishedApprove',
                    data:{
                        submitEndTime:this.search.endTime,
                        accomplishEndTime:this.search.approvalEndTime,
                        accomplishStartTime:this.search.approvalBeginTime,
                        approveStatus:this.search.approvalStatu  == '全部' ? '' : this.search.approvalStatu,
                        page:this.currentPage,
                        pageSize:this.pageSize,
                        auditId:this.userDetail.id,
                        approveTypeIds:this.search.arrprvalType == '全部' ? [] : [this.search.arrprvalType],
                        queryWhere:this.search.queryApproval,
                        submitStartTime:this.search.beginTime,
                        createBy:this.senderIdList
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.totalCount = res.data.data.total
                        this.myApprovalData = res.data.data.list
                    }else if (res.data.code == 10021) {
                        this.myApprovalData = []
                    }
                })
            },
            // 查看审批详情
            handleApprvolDetial (obj) {
				// console.log(obj)
				this.$http({
					method:'GET',
					url:`/oaManager/v1/feign/oa/approve/queryApproveInfo/${this.userDetail.id}/${obj.approveChildrenId}/${obj.approveTypeId}`
				}).then(res => {
					if(res.data.code == 200) {
						this.awaitApprvolDetial = res.data.data
						this.awaitApprvolDetial.approveName = obj.approveName
						this.awaitApprvolDetial.approveChildrenId = obj.approveChildrenId
						this.awaitApprvolDetial.approveTypeId = obj.approveTypeId
						this.sidebar = true
					}else {
						this.$message({
							type:'error',
							message:res.data.message
						})
					}
				})
            },
			// 选择部门人员弹框   关闭按钮
			handlePersonClose() {
				this.personDialogVisible = false;
			},
			//选择部门人员弹框   确定按钮
			handlePsrsonSubmit(list) {
				this.managerList = list;
				this.senderLists = "点击选择提交人";
				this.senderIdList = '';
				if (list.length > 0) {
					this.senderLists = "";
					for (let i = 0; i < list.length; i++) {
						this.senderLists += (list[i].name + "、");
						this.senderIdList = list[i].id;
					}
					this.senderLists = this.senderLists.substring(0, this.senderLists.lastIndexOf('、'));
				}
			},
			//获取通讯录人员
			getPersonnelList() {
				let that = this;
				this.$http({
					method: 'POST',
					url: '/orgManager/v1/organization/department/queryAddressBook2',
					data: {
						companyId: that.userDetail.companyId
					},
				}).then(res => {
					if (res.data.data)
						this.personnelList = res.data.data.children;
				}).catch(error => {
					console.log(error.message);
				});
            },
            // 重置表单
			resetAwaitApprovalForm () {
				this.search.arrprvalType = '全部'
				this.search.queryApproval = ''
				this.search.sumitDate = ''
				this.search.summitName = ''
				this.search.beginTime = ''
				this.search.endTime = ''
				this.senderIdList = ''
				this.managerList = []
                this.senderLists = '点击选择提交人'
                this.search.completeDate = ''
				this.search.approvalStatu = '全部'
				this.getApprovalData()
			}
		}
	}
</script>
<style lang="scss">
    #myApproval .el-table .warning-row {
        background: #F6F6FA;
    }
    #myApproval  .el-table .success-row {
        background: #fff;
    }
	#myApproval .sender {
		display: inline-block;
		border-radius: 4px;
		border: 1px solid #DCDFE6;
		box-sizing: border-box;
		color: #606266;
		font-size: inherit;
		height: 40px;
		line-height: 40px;
		outline: 0;
		padding: 0 15px;
		width: 344px;
		cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
		position: relative;
	}
	#myApproval .daterangeData {
		width: 340px;
	}
    #myApproval .awaitApproval_form {
		border-bottom: 1px solid #E6E8ED;
		.el-form-item {
			margin-bottom: 0px;
		}
	}
	#myApproval .summary_content_heade span {
		color: red;
		margin-right: 4px;
	}

	#myApproval .summary_content_heade {
		color: #606266;
		font-size: 14px;
	}
    #myApproval .el-table__row:hover{
        cursor: pointer;
    }
	#myApproval .summary_content {
		width: 97%;
		background-color: white;
		padding:20px;
	}

	#myApproval .back_ground {
		border-bottom: 5px solid #4278BE;
		color: #4278BE !important;
	}

	#myApproval .btn_from_tab li {
		color: #BFC2CC;
		font-size: 18px;
		width: 118px;
		height: 46px;
		display: inline-block;
		text-align: center;
		line-height: 46px;
		cursor: pointer;
	}
</style>
