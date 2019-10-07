<!--@description: 出差申请
	@author: 赵康
  @update: 赵康(2019-06-21 11:41) -->
<template>
	<div class="businessApplication">
		<div class="contentBox">
			<div class="detailBox" v-for="(items,index) in statements" :key="items.id">
				<div class="detailHeader" v-show="statements.length>1">
					<span>明细{{items.id}}</span>
					<span
						class="deleteDetail"
						@click="deleteDetail(items.id)"
						v-show="statements.length>1?true:false"
					>
                        <i class="el-icon-delete"></i>
                    </span>
				</div>
				<div class="inputDetail">
					<el-form>
						<el-form-item label="外出出差地点:" label-width="110px" required style="position: relative;">
							<el-input
								ref="warnAddress"
								class="signlocation"
								type="text"
								v-model="items.address"
								maxlength="120"
								placeholder="请输入外出出差地点"
								@focus="borderFunc(`warnAddress`,index)"
							></el-input>
							<span
								ref="warnAddressText"
								class="errorContent"
							>请输入外出出差地点</span>
						</el-form-item>
						<el-form-item label="开始时间:" label-width="110px" required>
							<el-col :span="16" style="position: relative;">
								<el-date-picker v-model="items.startDate" type="datetime"
												value-format="yyyy-MM-dd HH:mm:ss" ref="warnStartDate"
												placeholder="选择开始时间"
												@focus="borderFunc(`warnStartDate`,index)"></el-date-picker>
								<span
									ref="warnStartDateText"
									class="errorContent"
								>请选择开始时间</span>
							</el-col>
						</el-form-item>
						<el-form-item label="结束时间:" label-width="110px" required>
							<el-col :span="16" style="position: relative;">
								<el-date-picker v-model="items.endDate" type="datetime"
												value-format="yyyy-MM-dd HH:mm:ss" ref="warnEndDate"
												placeholder="选择结束时间"
												@focus="borderFunc(`warnEndDate`,index)"></el-date-picker>
								<span
									ref="warnEndDateText"
									class="errorContent"
								>请选择结束时间</span>
							</el-col>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="addDetail" @click="addDetail">
				<span class="addIcon">+</span>
				<span>增加外出出差明细</span>
			</div>
			<div class="contentDetail">
				<el-form>
					<el-form-item label="外出出差事由:" label-width="114px" required style="position: relative">
						<el-input
							type="textarea"
							:class="{'changeColor':borderDetail}"
							placeholder="请输入外出出差事由"
							v-model="detail"
							maxlength="500"
							show-word-limit
							@focus="borderDetail = false"
						></el-input>
						<span
							v-show="borderDetail"
							class="errorContent1"
						>请填写外出出差事由</span>
					</el-form-item>
				</el-form>
			</div>
			<el-form>
				<el-form-item label="图片:" label-width="80px">
					<uploadImg :uploadImg="uploadImg" :fileList="{path:'2'}" ref="ImgUrl"></uploadImg>
				</el-form-item>
				<examineApprove
					:labelWidth="lableWidth"
					:isOne="true"
					:isSingular="true"
					:isApprove="isApprove"
					:dataList="dataList"
					@getDataList="getData"
				></examineApprove>
				<copiedPerson :labelWidth="lableWidth" ref="copiedPersonData"></copiedPerson>
				<el-button type="primary" @click="submitData">提交</el-button>
			</el-form>
		</div>
	</div>
</template>

<script>
	import "@/modules/common";
	import copiedPerson from "../../Apublics/copiedPerson";
	import uploadImg from "../../Apublics/uploadImg";
	import examineApprove from "../../Apublics/examineApprove";

	export default {
		name: "businessApplication",
		data() {
			return {
				statements: [
					{
						id: 1,
						address: "",
						startDate: new Date().Format("yyyy-MM-dd hh:mm:ss"),
						endDate: new Date().Format("yyyy-MM-dd hh:mm:ss")
					}
				],
				detail: "",
				borderDetail: false,
				lableWidth: "80px",
				uploadImg: this.$http.defaults.baseURL + '/oaManage/v1/oa/uploadImages',
				isApprove: true,
				dataList: []
			};
		},
		components: {
			copiedPerson,
			uploadImg,
			examineApprove
		},
		beforeRouteLeave: function (to, from, next) {
			let that = this;
			if (true) {
				next(false);
				this.$confirm("是否保存尚未提交内容?", "提示", {
					cancelButtonText: "取消",
					confirmButtonText: "确定",
					type: "warning"
				})
					.then(() => {
						// 保存草稿
						//处理id
						for (let i = 0; i < that.statements.length; i++) {
							delete that.statements[i].id;
						}
						this.$http({
							method: "POST",
							url: "/oaManage/v1/oa/approval/trip/temp",
							data: {
								tripDetail: that.statements,
								tripReason: that.detail,//出差事由
								imgUrls: that.$refs.ImgUrl.imgUrl,
								approverList: that.dataList,
								recipientList: that.$refs.copiedPersonData.copyValue,
								refuseReason: ""//拒绝原因
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
			let that = this;
			//获取自定义审批人
			this.$http({
				method: "GET",
				url: "/oaManage/v1/oa/approvers",
				data: {
					applyId: "2"
				}
			}).then(res => {
				if (res.status === 200) {
					if (res.data.data) {
						if (res.data.data.approverList) {
							if (res.data.data.approverList.length > 0) {
								that.isApprove = false;
								that.dataList = res.data.data.approverList;
							}
						}
					}
				}
			});
			that.getDraft();
		},
		methods: {
			addDetail() {
				const item = {
					id: this.statements.length + 1,
					address: "",
					startDate: new Date().Format("yyyy-MM-dd hh:mm:ss"),
					endDate: new Date().Format("yyyy-MM-dd hh:mm:ss"),
				};
				this.statements.push(item);
			},
			deleteDetail(id) {
				for (let i = 0; i < this.statements.length; i++) {
					if (this.statements[i].id == id)
						this.statements.splice(i, 1);
					if (this.statements[i])
						this.statements[i].id = i + 1;
					//只要一执行删除明细操作，就把所有的提醒信息删掉
					this.$refs.warnAddress[i].$el.classList.remove("changeColor");
					this.$refs.warnStartDate[i].$el.classList.remove("changeColor");
					this.$refs.warnEndDate[i].$el.classList.remove("changeColor");
					this.$refs.warnAddressText[i].style.display = "none";
					this.$refs.warnStartDateText[i].style.display = "none";
					this.$refs.warnEndDateText[i].style.display = "none";
				}
			},
			submitData() {
				for (let i = 0; i < this.statements.length; i++) {
					if (!this.statements[i].address) {
						if (this.$refs.warnAddress[i])
							this.$refs.warnAddress[i].$el.classList.add("changeColor");
						if(this.$refs.warnAddressText[i])
							this.$refs.warnAddressText[i].style.display = "block";
						return;
					}
					if (!this.statements[i].startDate) {
						if (this.$refs.warnStartDate[i]) {
							this.$refs.warnStartDate[i].$el.classList.add("changeColor");
						}
						if(this.$refs.warnStartDateText[i])
							this.$refs.warnStartDateText[i].style.display = "block";
						return;
					}
					if (!this.statements[i].endDate) {
						if (this.$refs.warnEndDate[i]) {
							this.$refs.warnEndDate[i].$el.classList.add("changeColor");
						}
						if(this.$refs.warnEndDateText[i])
							this.$refs.warnEndDateText[i].style.display = "block";
						return;
					}
					//处理statements的id
					delete this.statements[i].id;
				}
				if (!this.detail) {
					this.borderDetail = true;
					return;
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

				let that = this;
				this.$http({
					method: "POST",
					url: "/oaManage/v1/oa/approval/trip/",
					data: {
						tripDetail: that.statements,
						tripReason: that.detail,//出差事由
						imgUrls: that.$refs.ImgUrl.imgUrl,
						approverList: that.dataList,
						recipientList: that.$refs.copiedPersonData.copyValue,
						refuseReason: ""//拒绝原因
					}
				})
					.then(res => {
						if (res.status === 200) {
							that.$message.success("提交成功");
						}
					})
					.catch(error => {
						that.$message.error("提交失败");
					});
			},
			getData(data) {
				this.dataList = data;
			},
			getDraft() {
				let that = this;
				this.$http({
					method: "GET",
					url: "/oaManage/v1/oa/approval/trip/temp",
					params: {
						applyId: "2"
					}
				})
					.then(res => {
						if (res.status === 200) {
							if (res.data.data) {
								let data = res.data.data;
								if (data.tripDetail)
									that.statements = data.tripDetail;
								if (data.tripReason)
									that.detail = data.tripReason;
								that.$refs.ImgUrl.imgUrl = data.imgUrls || ''
								if (data.imgUrls) {
									data.imgUrls.forEach(item => {
										this.$refs.ImgUrl.draftImg.push({url: item})
									});
								}
								;
								if (data.approverList)
									that.dataList = data.approverList;
								if (data.recipientList)
									that.$refs.copiedPersonData.copyValue = data.recipientList;
							}
						}
					})
					.catch(error => {
						that.$message.error("获取草稿失败");
					});
			},
			borderFunc(type, index) {
				if (type == "warnAddress")
					this.$refs.warnAddress[index].$el.classList.remove("changeColor");
				this.$refs.warnAddressText[index].style.display = "none";
				if (type == "warnStartDate")
					this.$refs.warnStartDate[index].$el.classList.remove("changeColor");
				this.$refs.warnStartDateText[index].style.display = "none";
				if (type == "warnEndDate")
					this.$refs.warnEndDate[index].$el.classList.remove("changeColor");
				this.$refs.warnEndDateText[index].style.display = "none";
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "../../../../../stylesheets/main.scss";

	.businessApplication {
		background-color: white;

		.contentBox {
			width: 500px;
			height: 100%;
			margin: 0 auto;
			padding: 20px 0;

			.errorContent {
				position: absolute;
				bottom: -30px;
				left: 0px;
				color: red;
				display: none;
			}
			.errorContent1 {
				position: absolute;
				bottom: -30px;
				left: 0px;
				color: red;
			}
			.block{
				display: block !important;
			}
			.changeColor {
				border: 1px solid red;
				@include rounded(4px);
			}

			.detailBox {
				width: 480px;
				border: 1px solid #e4e4e4;
				//padding: 20px;
				margin-top: 10px;

				.detailHeader {
					height: 20px;
					border-bottom: 1px solid #e4e4e4;
					margin-bottom: 20px;
					padding: 12px;
					clear: both;

					.deleteDetail {
						color: blue;
						float: right;
						cursor: pointer;
					}
				}

				.inputDetail {
					width: 440px;
					padding: 20px;
				}

				.el-form-item {
					position: relative;

					.el-form-item__label {
						width: 110px;
						float: right;
					}

					.el-date-editor.el-input {
						//width: 164px;
					}

					.dateSel {
						width: 30px;
					}

					.timeSel {
						position: absolute;
						left: 166px;
						top: 0;
						//width: 80px;
					}
				}

				// .el-form-item::before {
				//   content: "*";
				//   position: absolute;
				//   top: 11px;
				//   left: 5px;
				//   color: red;
				// }
				/*.el-form-item__content:before {*/
				/*	content: "*";*/
				/*	position: absolute;*/
				/*	top: 11px;*/
				/*	left: 5px;*/
				/*	color: red;*/
				/*}*/
			}

			.addDetail {
				width: 440px;
				color: #0099cc;
				border: 1px solid #e4e4e4;
				border-top: none;
				padding: 10px 20px;
				margin-bottom: 30px;
				text-align: center;
				cursor: pointer;

				.addIcon {
					font-size: 24px;
				}
			}

			.contentDetail {
				.el-form-item {
					position: relative;
				}

				.el-form-item {
					.el-textarea {
						width: 360px;
					}
				}

				/*.el-form-item::before {*/
				/*	content: "*";*/
				/*	position: absolute;*/
				/*	top: 11px;*/
				/*	left: 5px;*/
				/*	color: red;*/
				/*}*/
			}
		}

		.el-button {
			display: block;
			margin: 0 auto;
		}
	}
</style>