<!--@description: 考勤审批
	@author: 赵康
    @update: 赵康(2019-06-25 11:36) -->
<template>
	<div class="attendanceApprove">
		<div>
			<span class="spanType">
	    	<el-select v-model="sort" placeholder="请选择排序方式" style="width:160px;">
		    	<el-option
					v-for="item in sortLists"
					:key="item.key"
					:label="item.label"
					:value="item.key">
			    </el-option>
		    </el-select>
		</span>
			<span style="position: relative;" class="spanType">
<!--			<el-input type="primary" class="searchType" v-model="search" prefix-icon="el-icon-search" placeholder="请输入内容" @focus="searchFun = !searchFun" @blur=""></el-input>-->
				<!--				<div class="inputOptions" v-show="searchFun">-->
				<!--					<span style="display: block;cursor: pointer;" v-for="user in userLists" @click="userClick(user)">{{user.userName}}</span>-->
				<!--				</div>-->
				<el-autocomplete
					class="inline-input"
					v-model="showSearch"
					:fetch-suggestions="querySearch"
					placeholder="请输入内容"
					@select="handleSelect"
					prefix-icon="el-icon-search"
				></el-autocomplete>
		</span>
			<el-select v-model="reportType" style="width:154px;" placeholder="请选择审批状态">
				<el-option
					v-for="rep in reportLists"
					:key="rep.key"
					:label="rep.label"
					:value="rep.key">
				</el-option>
			</el-select>
			<el-date-picker
				class="dateType"
				v-model="startDate"
				type="date"
				value-format="yyyy-MM-dd"
				placeholder="选择日期">
			</el-date-picker>
			<span>-</span>
			<el-date-picker
				class="dateType"
				v-model="endDate"
				type="date"
				value-format="yyyy-MM-dd"
				placeholder="选择日期">
			</el-date-picker>
			<el-button class="btnType" type="primary" @click="batchFun">{{batch?"取消批量操作":"批量操作"}}</el-button>
		</div>
		<div style="margin-top: 10px;margin-bottom: 20px;">
			<span class="spanType">
	    	<el-select v-model="applyId" placeholder="请选择审批类型" style="width:160px;">
		    	<el-option
					v-for="vacation in vacationLists"
					:key="vacation.key"
					:label="vacation.label"
					:value="vacation.key">
			    </el-option>
		    </el-select>
				<span style="margin-left: 30px;">
					<el-button type="primary" @click="getApproveList(1)">搜索</el-button>
				<el-button @click="reset">重置</el-button>
				</span>
		</span>
		</div>
		<div class="contentBox" v-show="isDataList">
			<span>无数据</span>
		</div>
		<div class="checkBtn" v-show="batch">
			<div class="fl">
				<el-button ref="isTrue" :disabled="isShow" @click="goApprove(true,1)">同意</el-button>
			</div>
			<div class="fl">
				<el-button ref="isFalse" :disabled="isShow" @click="goApprove(true,2)">拒绝</el-button>
			</div>
			<div class="fr" @click="handleCheckAllChange()">
				<el-button>{{checkAll?"取消全选":"全选"}}</el-button>
			</div>
		</div>
		<div v-show="!isDataList" class="contentBox" v-for="(content,index) in contentList">
			<input v-show="batch" class="myCheck" type="checkbox" name="myCheck"
				   @click="checkFun(JSON.stringify(content),index)" v-model="checkBoxModule"
				   :value="JSON.stringify(content)"/>
			<div class="contentHeader">
				<img :src="(content.userDetail && content.userDetail.headUrl)?content.userDetail.headUrl:''" alt>
				<span>{{(content.userDetail && content.userDetail.userName)?content.userDetail.userName:''}}的{{content.applyId==1?"请假":(content.applyId==2?"出差":(content.applyId==3?"补卡":(content.applyId==4?"加班":"报销")))}}</span>
				<!--				<span style="color: #e4e4e4;">{{content.userDetail.userId}}</span>-->
				<span v-show="content.status ==0">
					<span class="yesOrNo" @click="goApprove(false,1,index)">
						<span class="greenCol">同意</span>
					<i class="el-icon-check greenCol"></i>
					</span>
			    	<span class="yesOrNo" @click="goApprove(false,2,index)">
						<span class="redCol">拒绝</span>
					<i class="el-icon-close redCol"></i>
					</span>
					<span class="greenCol" v-show="content.status ==1">已同意</span>
					<span class="redCol" v-show="content.status ==2">已拒绝</span>
					<span class="grayCol" v-show="content.status ==3">已撤销</span>
				</span>
				<span style="float: right;">{{content.createTime}}</span>
			</div>
			<div style="margin-left: 10px;" @click="goDetail(content)">
				<div class="detailHeader"
					 v-show="(content.applyId == 2 || content.applyId == 5 )&& (content.content.detail?(content.content.detail.length>1?true:false):false || content.content?(content.content.length>1?true:false):false )">
					<span style="float: left;">明细1</span>
					<span style="float: right; color: blue; cursor:pointer;">点击查看更多</span>
				</div>
				<div class="contentText">
					<div v-show="content.applyId == 1">
						<p>
							<span class="spanText">请假类型:</span>
							<span>{{content.content?content.content.vacationTypeName:""}}</span>
						</p>
						<p>
							<span class="spanText">请假时间:</span>
							<span>{{content.content?content.content.startDay:''}}</span>
							<span>至</span>
							<span>{{content.content?content.content.endDay:''}}</span>
						</p>
						<p>
							<span class="spanText">请假事由:</span>
							<span>{{content.content?content.content.content:''}}</span>
						</p>
					</div>
					<div v-show="content.applyId == 2">
						<p>
							<span class="spanText">外出出差地点:</span>
							<span>{{content.content?(content.content.detail?content.content.detail[0].address:''):''}}</span>
						</p>
						<p>
							<span class="spanText">外出出差时间:</span>
							<span>{{content.content?(content.content.detail?content.content.detail[0].startDate:''):''}}</span>
							<span>至</span>
							<span>{{content.content?(content.content.detail?content.content.detail[0].endDate:''):''}}</span>
						</p>
						<p>
							<span class="spanText">外出出差事由:</span>
							<span>{{content.content?content.content.reason:''}}</span>
						</p>
					</div>
					<div v-show="content.applyId ==3">
						<p>
							<span class="spanText">补卡日期:</span>
							<span>{{content.content?content.content.time:''}}</span>
						</p>
						<p>
							<span class="spanText">补卡原因:</span>
							<span>{{content.content?content.content.content:''}}</span>
						</p>
					</div>
					<div v-show="content.applyId == 4">
						<p>
							<span class="spanText">加班时间:</span>
							<span>{{content.content?content.content.startTime:''}}</span>
							<span>至</span>
							<span>{{content.content?content.content.endTime:''}}</span>
						</p>
						<p>
							<span class="spanText">时长:</span>
							<span>{{content.content?content.content.times:''}}</span>
						</p>
						<p>
							<span class="spanText">加班原因:</span>
							<span>{{content.content?content.content.content:''}}</span>
						</p>
					</div>
					<div v-show="content.applyId == 5">
						<p>
							<span class="spanText">报销名称:</span>
							<span>{{content.content?(content.content.content?content.content.content[0].name:''):''}}</span>
						</p>
						<p>
							<span class="spanText">报销类别:</span>
							<span>{{content.content?(content.content.content?content.content.content[0].type:''):''}}</span>
						</p>
						<p>
							<span class="spanText">报销金额:</span>
							<span>{{content.content?(content.content.content?content.content.content[0].amount:''):''}}</span>
						</p>
						<p>
							<span class="spanText">总金额:</span>
							<span>{{content.content?content.content.total:''}}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "attendanceApprove",
		data() {
			return {
				sortLists: [{
					key: '0',
					label: '按时间正序排序'
				},
					{
						key: '1',
						label: '按时间倒序排序'
					}
				],
				sort: "", //查询-排序
				showSearch: "", //查询-按员工姓名查询(input中展示的)
				search: "",
				searchList: [],//查询-查询数组
				reportType: "0", //查询-审批类型
				reportLists: [{
					key: '0',
					label: '待审批'
				}, {
					key: '1',
					label: '已审批'
				}],
				startDate: "", //查询-开始时间
				endDate: "", //查询-结束时间
				applyId: "", //查询-审批类型
				vacationLists: [{
					key: '1',
					label: '请假'
				}, {
					key: '2',
					label: '出差'
				}, {
					key: '3',
					label: '补卡'
				}, {
					key: '4',
					label: '加班'
				}, {
					key: '5',
					label: '报销'
				}],
				batch: false,//批量操作
				batchText: "",
				checkAll: false,
				consent: "同意",
				refuse: "拒绝",
				contentList: [{
					applyId: this.applyId,
					applyName: "",
					status: null,
					content: {
						startDay: "",
						endDay: "",
						startAmPm: true,
						content: "",
						endAmPm: true,
						vacationTypeName: "", //请假类型
						times: "" //加班时长
					},
					createTime: "",
					userId: "",
					id: 1561366642230037,
					userDetail: {
						userId: "",
						userName: "",
						headUrl: ""
					}
				}],
				isDataList: true,
				allList: [],
				userLists: [],
				searchFun: false,
				scroll: true, //设置开关来避免重复请求数据
				pageNum: 1,//当前页数
				totalNum: 1000000,//总页数
				isShow: true,
				checkBoxModule: [],
				timer:""
			}
		},
		created() {
			//获取审批列表
			this.getApproveList(1);
			//获取用户列表
			this.getUser();
			//下拉加载
			// this.getSpecialData();
		},
		watch: {
			'checkBoxModule': {
				handler() {
					//let ids = [];
					// for (let i=0;i<this.checkBoxModule.length;i++){
					// 	const id = JSON.parse(this.checkBoxModule[i]).id;
					// 	if( ids.indexOf(id) == -1)
					// 		ids.push(id);
					// 	else this.checkBoxModule.splice(i,1);
					// }
					if (this.contentList.length == this.checkBoxModule.length){
						// this.handleCheckAllChange();
						this.isShow = false;
						this.checkAll = true;
					}

					if (this.checkBoxModule.length < this.contentList.length && this.checkBoxModule.length > 0) {
						this.isShow = false;
						this.checkAll = false;
					}
					if (this.checkBoxModule.length == 0) {
						this.isShow = true;
						this.checkAll = false;
					}
				},
				deep: true
			},
			batch() {
				if (!this.batch) {
					this.isShow = true;
					let checkList = document.getElementsByName("myCheck");
					for (let i = 0; i < checkList.length; i++) {
						checkList[i].checked = false;
					}
				}
			}
		},
		mounted() {
			window.addEventListener('scroll', this.handleScroll, true);
		},
		methods: {
			batchFun() {
				if (!this.isDataList) { //有数据时
					this.batch = !this.batch;
					this.checkAll = false;
				}
			},
			checkFun(content,index) {
				// if(!this.checkBoxModule[index])
				// this.checkBoxModule.push(content);
			},
			//全选
			handleCheckAllChange(val) {
				this.checkAll = !this.checkAll;
				if (this.checkAll)
					this.isShow = false;
				else this.isShow = true;
				let myCheck = document.getElementsByName("myCheck");
				if (this.checkAll) { //全选
					if (myCheck.length > 0) {
						// for (let i = 0; i < myCheck.length; i++) {
						// 	myCheck[i].checked = true;
						// }
						myCheck.forEach(e=>{
							if(e.checked == false)
							e.click();
						})
					}
				} else { //取消全选
					if (myCheck.length > 0) {
						// for (let i = 0; i < myCheck.length; i++) {
						// 	myCheck[i].checked = false;
						// }
						myCheck.forEach(e=>{
							if(e.checked == true)
								e.click();
						})
					}
				}

			},
			//获取审批列表
			getApproveList(pageNum) {
				let that = this;
				this.$http({
					method: "GET",
					url: "/oaManage/v1/oa/approval/list",
					params: {
						pageNum: pageNum ? pageNum : 1,
						pageSize: "50",
						isApprove: that.reportType, //审批状态 0未审批  1已审批
						applyId: that.applyId, //审批类型 1 请假 2 出差 3补卡 4加班 5报销
						start: that.startDate,
						end: that.endDate,
						createBy: that.searchList.join(","), //成员ID
						sort: that.sort //0 正序 1倒序
					}
				}).then(res => {
					if (res.status === 200) {
						if (res.data.data) {
							if (res.data.data.overviewList) {
								if (pageNum == 1) {
									that.contentList = [];
									that.contentList = res.data.data.overviewList;
								} else {
									//浅拷贝
									that.contentList = [
										... that.contentList,
										... res.data.data.overviewList
										];
								}
								if (res.data.data.overviewList.length < 1) {
									this.isDataList = true;
								} else {
									this.isDataList = false;
								}
							} else {
								this.isDataList = true;
							}
							if (res.data.data.allList) {
								that.allList = res.data.data.allList;
							}
						}
					}
				}).catch(error => {
					that.$message.error(error.message);
				});
			},
			getUser() {
				let that = this;
				this.$http({
					method: "get",
					url: "/oaManage/v1/oa/users"
				})
					.then(res => {
						if (res.data.sysCode == 200 && res.data.code == 200) {
							if (res.data.data.userList) {
								//that.userLists = res.data.data.userList;
								that.userLists = [];
								for (let i = 0; i < res.data.data.userList.length; i++) {
									that.userLists.push({
										headUrl: res.data.data.userList[i].headUrl,
										userId: res.data.data.userList[i].userId,
										value: res.data.data.userList[i].userName
									})
								}
							}
						} else {
							this.$message.error(res.data.message);
						}
					})
					.catch(error => {
						console.log(error);
					});
			},
			querySearch(queryString, cb) {
				cb(this.userLists);
			},
			handleSelect(item) {
				if (this.search != "") {
					this.search += "," + item.value;
				} else {
					this.search += item.value;
				}
				this.searchList.push(item.userId);
				this.showSearch = this.search;
			},
			reset() {
				this.sort = "";
				this.showSearch = "";
				this.search = "";
				this.searchList = [];
				this.reportType = "0";
				this.startDate = "";
				this.endDate = "";
				this.applyId = "";
				//获取审批列表
				this.getApproveList(1);
			},
			//下拉加载
			// getSpecialData(pageNum) {
				//加载数据
				// this.getApproveList(pageNum);

			// },
			handleScroll() {
				let that = this;
				//滚动条位置
				let scrollTop = 0;
				if (document.documentElement && document.documentElement.scrollTop) {
					scrollTop = document.documentElement.scrollTop;
				} else if (document.body) {
					scrollTop = document.body.scrollTop;
				}
				//网页(内容)可见区域高
				let clientHeight = 0;
				if (document.body.clientHeight && document.documentElement.clientHeight) {
					clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
				} else {
					clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
				}
				//文档高度
				let scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

				if (scrollTop + clientHeight + 10 > scrollHeight) {
					if (this.pageNum > this.totalNum) return;
					else{
						this.timer = setTimeout(()=>{
							// that.getSpecialData(that.pageNum++)
							this.getApproveList(that.pageNum++);
						},500);
					}
				}
			},
			//审批操作
			goApprove(batch, status, index) {
				let that = this;
				let batchArray = [];

				if (batch) {
					//批量审批
					let checkList = document.getElementsByName("myCheck");
					for (let i = 0; i < checkList.length; i++) {
						if (checkList[i].checked && checkList[i].value) {
							let content = JSON.parse(checkList[i].value)
							batchArray.push({
								id: content.id,
								step: content.step,
								applyId: content.applyId
							});
						}
					}
				} else {
					//单条审批
					let dataOne = this.contentList[index];
					batchArray.push({
						id: dataOne.id,
						step: dataOne.step,
						applyId: dataOne.applyId
					});
				}

				this.$http({
					method: "PUT",
					url: "/oaManage/v1/oa/approval/approve",
					data: {
						batch: batchArray,
						status: status,  //  1-审批通过；2审批拒绝
						refuse: "拒绝理由"
					}
				}).then(res => {
					that.$message.success("审批完成");
				}).catch(error => {
					that.$message.error(error.message);
				});
			},
			goDetail(content) {
				let that = this;
				if (content) {
					let data = {
						id: content.id,
						applyId: content.applyId,
						step: content.step
					}
					this.$router.push({
						name: data.applyId == 1 ? "leave" : (data.applyId == 2 ? "businessTravel" : (data.applyId == 3 ? "patchCard" : (data.applyId == 4 ? "overtime" : "reimbursement"))),
						path: data.applyId == 1 ? "/leave" : (data.applyId == 2 ? "/businessTravel" : (data.applyId == 3 ? "/patchCard" : (data.applyId == 4 ? "/overtime" : "/reimbursement"))),
						query: {id: data.id, step: data.step, allList: that.allList}
					})
				}
			},
		},
		destroyed() {
			window.addEventListener('scroll', this.handleScroll);
			clearTimeout(this.timer);
		}
	}
</script>
<style lang="scss" scoped>
	.attendanceApprove {
		background-color: white;
		padding: 20px 30px;

		.fl {
			float: left;
		}

		.fr {
			float: right;
		}

		.spanType {
			display: inline-block;

			.searchType {
				.el-input__inner {
					padding-left: 27px;
				}
			}

			.inputOptions {
				position: absolute;
				top: 46px;
				left: 0px;
				width: 94%;
				height: 300px;
				padding: 5px;
				border: 1px solid #e4e4e4;
				border-radius: 3px;
				background-color: white;
				z-index: 1;
				overflow: auto;
				animation: animate 1s ease;
			}

			@keyframes animate {
				from {
					height: 0px;
					top: 46px;
				}
				to {
					height: 300px;
					top: 46px;
				}
			}
		}

		.dateType {
			width: 136px;
		}

		.btnType {
			float: right;
		}

		.checkBtn {
			width: 100%;
			height: 50px;
			padding: 0 10px;
			line-height: 50px;
			clear: both;
			border: 1px solid #e4e4e4;
			border-bottom: none;

			button {
				margin-left: 20px;
			}
		}

		.contentBox {
			width: 100%;
			//margin-top: 10px;
			margin-bottom: 10px;
			padding: 10px;
			border: 1px solid #e4e4e4;
			position: relative;
			cursor: pointer;

			.myCheck {
				position: absolute;
				right: 0px;
				top: 0px;
			}

			.contentHeader {
				height: 35px;
				line-height: 35px;
				margin-bottom: 20px;
				clear: both;

				span {
					margin: 0 5px;
				}

				img {
					width: 35px;
					height: 35px;
					border: 1px solid #e4e4e4;
					border-radius: 50%;
					display: inline-block;
					vertical-align: middle;
				}

				.yesOrNo {
					cursor: pointer;
				}
			}

			.detailHeader {
				height: 30px;
				margin: 10px;
				padding: 0 10px;
				background-color: #e4e4e4;
				line-height: 30px;
				clear: both;
			}

			.contentText {
				margin-left: 25px;

				p {
					margin: 8px 0;
				}

				.spanText {
					display: inline-block;
					width: 88px;
					text-align: right;
				}
			}

			.greenCol {
				color: green;
			}

			.redCol {
				color: red;
				margin-left: 0px;
			}

			.grayCol {
				color: gray;
			}
		}
	}
</style>