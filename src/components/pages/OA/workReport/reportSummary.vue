<!--@description: 汇报汇总
	@author: 赵康
    @update: 赵康(2019-08-21 09:45) -->
<template>
	<div class="">
		<div class="summary_boxTab">
			<ul class="btn_from_tab">
				<li :class="{'back_ground':fromWhere === 0}" @click="changeFrom(0)">数据导出</li>
				<li :class="{'back_ground':fromWhere === 1}" @click="changeFrom(1)">数据导出记录</li>
			</ul>
		</div>
		<div class="summary_content clear" v-show="fromWhere === 0">
			<div class="clear summary_content_heade">
				<span class="fl">*</span>
				<p class="fl">仅支持查询和导出管理范围内的日志内容</p>
			</div>
			<div class="summary_search">
				<el-form class="clear">
					<el-form-item label="汇报类型" class="fl" style="width: 200px;">
						<el-select v-model="search.reportType" placeholder="请选择" style="width: 114px;">
							<el-option key="0" label="全部汇报" value="0"></el-option>
							<el-option key="1" label="日报" value="1"></el-option>
							<el-option key="2" label="周报" value="2"></el-option>
							<el-option key="3" label="月报" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="提交日期" class="fl" style="width: 360px;">
						<el-date-picker
							style="width: 274px;"
							v-model="search.sumitDate"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="yyyy-MM-dd"
							:picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="提交人" class="fl" style="width: 300px;">
						<!--						<el-input v-model="search.summitName" style="width: 220px;"></el-input>-->
						<p class="sender" @click="personDialogVisible = true">
							{{senderLists.length>13?(senderLists.slice(0,13)+'...'):senderLists}}</p>
					</el-form-item>
					<el-form-item class="fl" style="width: 100px;">
						<el-button type="primary" style="background-color: #4278BE;" @click="searchFunc">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="summary_out fr clear" @click="openOutframe">
				<p class="fr">导出</p>
				<img src="./writeReport/images/outIcon.png" alt="" class="fr">
			</div>
			<div class="summary_table">
				<el-table
					ref="multipleTable"
					:data="tableData"
					tooltip-effect="dark"
					style="width: 100%"
					border
					stripe
					:header-cell-style="{
					'text-align':'center',
					 'color': '#303133',
					 'font-size':'16px'
					}"
					:cell-style="{
					'text-align':'center',
					 'color': '#606266',
					 'font-size':'14px'
					}"
					@selection-change="handleSelectionChange">
					<el-table-column
						type="selection"
						width="40">
					</el-table-column>
					<el-table-column
						prop="senderUserName"
						label="提交人"
						style="width: 20%">
					</el-table-column>
					<el-table-column
						prop="senderDepartment"
						label="所属部门"
						style="width: 20%">
					</el-table-column>
					<el-table-column
						prop="sendTime"
						label="提交时间"
						style="width: 20%"
						show-overflow-tooltip>
					</el-table-column>
					<el-table-column
						prop="receiverNames"
						label="汇报接收人"
						style="width: 20%">
					</el-table-column>
					<el-table-column
						prop="reportTypeName"
						label="汇报类型"
						style="width: 20%">
					</el-table-column>
				</el-table>
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-sizes="[5, 10, 15, 20,25,30]"
					:page-size="100"
					layout="total, sizes, prev, pager, next, jumper"
					:total="totalCount">
				</el-pagination>
			</div>
		</div>
		<div class="summary_content" v-show="fromWhere === 1">
			<div class="clear summary_content_heade" style="margin-bottom: 20px">
				<span class="fl">*</span>
				<p class="fl">仅支持查询和导出管理范围内的日志内容</p>
			</div>
			<div class="summary_table">
				<el-table
					:data="outTableData"
					tooltip-effect="dark"
					style="width: 100%"
					border
					stripe
					:header-cell-style="{
					'text-align':'center',
					 'color': '#303133',
					 'font-size':'16px'
					}"
					:cell-style="{
					'text-align':'center',
					 'color': '#606266',
					 'font-size':'14px'
					}"
					@selection-change="handleSelectionChange">
					<el-table-column
						prop="exportFileName"
						label="导出文件名称"
						style="width: 20%">
					</el-table-column>
					<el-table-column
						prop="exportUserName"
						label="导出人员"
						style="width: 20%"
						show-overflow-tooltip>
					</el-table-column>
					<el-table-column
						prop="exportTime"
						label="导出时间"
						style="width: 20%">
					</el-table-column>
					<el-table-column
						prop="fileUrl"
						label="操作"
						style="width: 20%">
						<template slot-scope="scope">
							<el-button
								size="mini"
								@click="handleEdit(scope.row.exportFileName, scope.row.fileUrl)">下载
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					@size-change="outHandleSizeChange"
					@current-change="outHandleCurrentChange"
					:page-sizes="[5, 10, 15, 20,25,30]"
					:page-size="100"
					layout="total, sizes, prev, pager, next, jumper"
					:total="outTotalCount">
				</el-pagination>
			</div>
		</div>
		<PersonDialog
			:treeData="personnelList"
			:defaultProps="{label:'name',children:'children'}"
			:transferTitle="['选择部门人员', '已选择']"
			:dialogVisible="personDialogVisible"
			:managers="managerList"
			@handlePersonClose="handlePersonClose"
			@handlePsrsonSubmit="handlePsrsonSubmit"></PersonDialog>
		<div class="summary_frame" v-if="isSummaryFrame">
			<div style="width: 100%;height: 100%;position: relative;">
				<div class="frame_content_box">
					<div class="frame_content_head clear">
						<p class="fl"></p>
						<p class="fl">导出文件</p>
					</div>
					<div class="frame_content clear">
						<p class="fl">导出文件名称：</p>
						<input class="fl" type="text" v-model="fileName">
					</div>
					<div style="text-align: center;margin: 4px 0;height: 22px;">
						<p v-if="outSuccess">文件导出中...</p>
					</div>
					<div class="summary_close_frame clear">
						<p class="fr" @click="outData">确定</p>
						<p class="fr" @click="handleClose">取消</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import PersonDialog from '../../../commons/persondialog'

	export default {
		name: "reportSummary",
		data() {
			//时间控件的默认事件获取
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
			let data = new Date();
			data.setDate(1);
			data.setHours(0);
			data.setSeconds(0);
			data.setMinutes(0);

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

			let nowMonthTime = formatDateTime(data.getTime());
			let sumitDate = [];
			sumitDate.push(nowMonthTime);
			sumitDate.push(rs);
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
				userDetail: JSON.parse(sessionStorage.getItem("teamEmployeeDetailVO")),
				fromWhere: 0,
				personDialogVisible: false,
				senderLists: "点击选择提交人",
				personnelList: [],
				senderIdList: [],
				search: {
					reportType: "全部汇报",
					sumitDate: sumitDate,
					summitName: "",
					beginTime: nowMonthTime,
					endTime: rs
				},
				tableData: [],
				outTableData: [],
				multipleSelection: [],
				pageNo: 1,
				pageSize: 10,
				totalCount: 0,
				pageNoOut: 1,
				pageSizeOut: 10,
				outTotalCount: 0,
				fileName: "",
				managerList: [],//通讯录用
				isSummaryFrame: false,
				outSuccess: false
			}
		},
		components: {
			PersonDialog
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
					}
				},
				deep: true
			}
		},
		mounted() {
			//获取通讯录人员数据
			this.getPersonnelList();
			//获取表格（提交的汇报）数据
			this.getReportData();
		},
		methods: {
			changeFrom(type) {
				if (type === 0) {
					this.fromWhere = 0;
				} else if (type === 1) {
					this.fromWhere = 1;
					this.getOutList();
				}
			},
			//搜索
			searchFunc() {
				this.getReportData();
			},
			//表格选择
			handleSelectionChange(val) {
				for (let i = 0; i < val.length; i++) {
					if (val[i].reportId)
						this.multipleSelection.push(val[i].reportId);
				}
			},
			//获取表格（提交的汇报）数据
			getReportData() {
				let that = this;
				this.$http({
					method: 'POST',
					// url: '/oaManager/v1/feign/oa/report/pageReportCollect',
					url: '/reportManager/v1/feign/oa/report/pageReportCollect',
					data: {
						companyId: that.userDetail.companyId,
						reportTypeId: (that.search.reportType === "0" || that.search.reportType === "全部汇报") ? null : that.search.reportType,
						senderIdList: that.senderIdList.length == 0 ? null : that.senderIdList,//提交人id
						beginTime: that.search.beginTime,
						endTime: that.search.endTime,
						pageNo: that.pageNo,
						pageSize: that.pageSize,
					},
				}).then(res => {
					if (res.data.code === 200) {
						if (res.data.data.list) {
							that.totalCount = res.data.data.totalCount;
							that.tableData = res.data.data.list;
						}
					}
					if (res.data.code === 1012) {
						that.$message.error(res.data.message);
					}
				}).catch(error => {
					console.log(error.message);
				});
			},
			// 选择部门人员弹框   关闭按钮
			handlePersonClose() {
				this.personDialogVisible = false;
			},
			//选择部门人员弹框   确定按钮
			handlePsrsonSubmit(list) {
				this.managerList = list;
				this.senderLists = "点击选择提交人";
				this.senderIdList = [];
				if (list.length > 0) {
					this.senderLists = "";
					for (let i = 0; i < list.length; i++) {
						this.senderLists += (list[i].name + "、");
						this.senderIdList.push(list[i].id);
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
			//分页器pageSize 改变时会触发，每页条数
			handleSizeChange(val) {
				this.pageSize = val;
				this.getReportData();
			},
			// currentPage 改变时会触发，当前页
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getReportData();
			},
			//导出记录分页器pageSize 改变时会触发，每页条数
			outHandleSizeChange(val) {
				this.pageSizeOut = val;
				this.getOutList();
			},
			//导出记录 currentPage 改变时会触发，当前页
			outHandleCurrentChange(val) {
				this.pageNoOut = val;
				this.getOutList();
			},
			//获取导出记录数据
			getOutList() {
				let that = this;
				this.$http({
					method: 'POST',
					// url: '/oaManager/v1/feign/oa/report/pageReportExport',
					url: '/reportManager/v1/feign/oa/report/pageReportExport',
					data: {
						pageNo: that.pageNoOut,
						pageSize: that.pageSizeOut,
						companyId: that.userDetail.companyId
					},
				}).then(res => {
					if (res.data.code === 200) {
						if (res.data.data.list) {
							that.outTotalCount = res.data.data.totalCount;
							that.outTableData = res.data.data.list;
						}
					}
					if (res.data.code === 1012) {
						that.$message.error(res.data.message);
					}
				}).catch(error => {
					console.log(error.message);
				});
			},
			//导出记录下载
			handleEdit(filaName, fileUrl) {
				// window.open("https://"+fileUrl);
				let link = document.createElement('a');
				link.style.display = 'none';
				link.href = fileUrl;
				link.setAttribute('download', filaName);
				document.body.appendChild(link);
				link.click();
			},
			outData() {
				let that = this;
				if (that.fileName === "") {
					that.$message.warning("请输入导出文件名");
					return;
				}
				that.outSuccess = true;
				this.$http({
					method: 'POST',
					// url: '/oaManager/v1/feign/oa/report/export',
					url: '/reportManager/v1/feign/oa/report/export',
					data: {
						companyId: that.userDetail.companyId,
						departmentId: that.userDetail.departmentId,
						reportIdList: that.multipleSelection.length == 0 ? null : that.multipleSelection,//汇报id集合
						reportTypeId: (that.search.reportType === 0 || that.search.reportType === "全部汇报") ? null : that.search.reportType,//汇报类型id
						senderIdList: that.senderIdList.length == 0 ? null : that.senderIdList,//提交人id
						beginTime: that.search.beginTime,
						endTime: that.search.endTime,
						fileName: that.fileName === "" ? "汇报汇总文件" : that.fileName
					},
				}).then(res => {
					if (res.data.code === 200) {
						that.outSuccess = false;
						that.handleClose();
						that.$message.success("导出文件成功");
						that.changeFrom(1);
					}
				}).catch(error => {
					console.log(error.message);
				});
			},
			openOutframe() {
				this.isSummaryFrame = true;
				let time1 = this.search.beginTime.slice(0, 10).replace('-', '').replace('-', '');
				let time2 = this.search.endTime.slice(0, 10).replace('-', '').replace('-', '');
				if (this.search.reportType === 1)
					this.fileName = time1 + "-" + time2 + "日报汇总（部分）";
				else if (this.search.reportType === 2)
					this.fileName = time1 + "-" + time2 + "周报汇总（部分）";
				else if (this.search.reportType === 1)
					this.fileName = time1 + "-" + time2 + "月报汇总（部分）";
				else
					this.fileName = time1 + "-" + time2 + "汇报汇总（部分）";
			},
			handleClose() {
				this.isSummaryFrame = false;
				this.fileName = "";
			}
		}
	}
</script>

<style scoped>
	.summary_close_btn {
		background-color: #EDEFF2;
		color: #BFC2CC;
		border: 1px solid #BFC2CC;
	}

	.summary_close_frame p:nth-child(1) {
		color: white;
		background-color: #4278BE;
		margin-right: 30px;
	}

	.summary_close_frame p:nth-child(2) {
		color: #4278BE;
		margin-right: 10px;
	}

	.summary_close_frame {
		margin-top: 10px;
	}

	.summary_close_frame p {
		width: 109px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		font-size: 14px;
		border: 1px solid #4278BE;
		border-radius: 3px;
		cursor: pointer;
	}

	.frame_content input {
		width: 290px;
		height: 30px;
		border: 1px solid rgba(191, 194, 204, 1);
		border-radius: 3px;
		color: #BFC2CC;
		padding: 0 10px;
	}

	.frame_content p {

	}

	.frame_content {
		margin-top: 30px;
		margin-left: 30px;
		height: 30px;
		line-height: 30px;
	}

	.frame_content_head p:nth-child(1) {
		width: 10px;
		height: 20px;
		margin-right: 10px;
		background-color: #4278BE;
	}

	.frame_content_head {
		height: 32px;
		width: 94%;
		padding-top: 30px;
		padding-left: 30px;
		color: #303133;
		font-size: 18px;
		border-bottom: 1px solid #BFC2CC;
	}

	.frame_content_box {
		width: 450px;
		height: 225px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
	}

	.summary_frame {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 1;
	}

	.summary_out {
		margin-bottom: 10px;
		cursor: pointer;
	}

	.summary_out > img {
		margin-right: 4px;
	}

	.summary_out > p {
		color: #4278BE;
		font-size: 14px;
	}

	.sender {
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
		width: 227px;
		cursor: pointer;
		position: relative;
	}

	.summary_search {
		margin-top: 30px;
	}

	.summary_content_heade span {
		color: red;
		margin-right: 4px;
	}

	.summary_content_heade {
		color: #606266;
		font-size: 14px;
	}

	.summary_content {
		width: 97%;
		background-color: white;
		padding: 20px;
	}

	.back_ground {
		border-bottom: 5px solid #4278BE;
		color: #4278BE !important;
	}

	.btn_from_tab li {
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
