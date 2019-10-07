<template>
	<div class="reportDetail_box">
		<p class="back_btn" @click="$router.back(-1)">返回</p>
		<div class="reportDetail_smallBox">
			<div class="pariseDetail clear" v-for="item in commentAndParaseList">
				<div class="pariseDetail_head clear">
					<img class="fl" src="./images/icon_head.png" alt=""
						 v-if="!item.operateHeadUrl && commentAndParaseList.length!=0">
					<img class="fl" :src="item.operateHeadUrl" alt="" v-else>
					<div class="fl pariseDetail_head_p">
						<p>{{item.operateName}}</p>
						<p>{{item.operateContent}}</p>
					</div>
					<span class="fr">{{item.operateTime?item.operateTime.slice(0,16):''}}</span>
				</div>
				<div class="fr pariseDetail_content">
					<div class="clear">
						<p class="fl">{{item.reportInfoDTO.nameAndReportType}}</p>
						<span class="fr">{{item.reportInfoDTO.createTime?item.reportInfoDTO.createTime.slice(0,16):''}}</span>
					</div>
					<p style="margin-top: 8px;">
						{{item.reportInfoDTO.finishWorkList[0].reportType}}:{{item.reportInfoDTO.finishWorkList[0].serialNumber}}.{{item.reportInfoDTO.finishWorkList[0].content}}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "reportMessageDetail",
		data() {
			return {
				commentAndParaseList: [],//点赞评论列表
				isLoad: true,
				pageNo: 1,
				pageSize: 5
			}
		},
		mounted() {
			this.getCommentAndParaseList();
			this.$nextTick(() => {
				this.$parent.$parent.$el.addEventListener('scroll', this.commentAndParaseonScroll, true);
			});
		},
		methods: {
			//下拉加载
			//获取滚动条当前的位置
			getScrollTop() {
				let scrollTop = 0;
				if (document.documentElement && document.documentElement.scrollTop) {
					scrollTop = document.documentElement.scrollTop;
				} else if (document.body) {
					// scrollTop = document.body.scrollTop;
					scrollTop = this.$parent.$parent.$el.scrollTop;
				}
				return scrollTop;
			},
			//获取当前可视范围的高度
			getClientHeight() {
				let clientHeight = 0;
				if (document.body.clientHeight && document.documentElement.clientHeight) {
					clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
				} else {
					// clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
					clientHeight = Math.max(this.$parent.$parent.$el.clientHeight, document.documentElement.clientHeight);
				}
				return clientHeight;
			},
			//获取文档完整的高度
			getScrollHeight() {
				// return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
				return Math.max(this.$parent.$parent.$el.scrollHeight, document.documentElement.scrollHeight);
			},
			commentAndParaseonScroll() {
				if ((this.getScrollTop() + this.getClientHeight() + 10 > this.getScrollHeight()) && this.isLoad) {
					this.isLoad = false;
					this.getCommentAndParaseList();
				}
			},
			//获取点赞评论列表
			getCommentAndParaseList() {
				let that = this;
				this.$http({
					method: "POST",
					// url: "/oaManager/v1/feign/oa/report/getCommentAndLaud",
					url: "/reportManager/v1/feign/oa/report/getCommentAndLaud",
					data: {
						pageNo: that.pageNo,
						pageSize: that.pageSize
					}
				})
					.then(res => {
						if (res.data.code === 200) {
							if (res.data.data.list) {
								if (res.data.data.list.length > 0) {
									let list = res.data.data.list;
									for (let i = 0; i < list.length; i++) {
										if (list[i].reportInfoDTO) {
											if (list[i].reportInfoDTO.nameAndReportType) {
												if (list[i].reportInfoDTO.nameAndReportType) {
													let res = list[i].reportInfoDTO.nameAndReportType;
													let item = res.substring(res.length, res.length - 2);
													if (!list[i].reportInfoDTO.finishWorkList || !list[i].reportInfoDTO.finishWorkList.length > 0) {
														list[i].reportInfoDTO.finishWorkList = [{}];
													}
													if (item === "日报")
														list[i].reportInfoDTO.finishWorkList[0]["reportType"] = "今日完成工作";
													if (item === "周报")
														list[i].reportInfoDTO.finishWorkList[0]["reportType"] = "本周完成工作";
													if (item === "月报")
														list[i].reportInfoDTO.finishWorkList[0]["reportType"] = "本月完成工作";
													if (list[i].reportInfoDTO.finishWorkList[0].content) {
														if (list[i].reportInfoDTO.finishWorkList[0].content.length > 20) {
															list[i].reportInfoDTO.finishWorkList[0].content = list[i].reportInfoDTO.finishWorkList[0].content.substring(0, 20) + "...";
														}
													}
												}
											}
										}
									}
									that.commentAndParaseList = that.commentAndParaseList.concat(list);
									that.pageNo += 1;
									that.isLoad = true;//下拉加载锁
								}
							}
						}
					})
					.catch(error => {
						that.$message.error("获取评论点赞列表失败");
					});
			}
		},
		destroyed: function () {
			this.$parent.$parent.$el.removeEventListener('scroll', this.commentAndParaseonScroll,true);   //  离开页面清除（移除）滚轮滚动事件
		}
	}
</script>

<style scoped>
	.pariseDetail_content {
		background: rgba(248, 248, 248, 1);
		box-shadow: 1px 1px 8px 0px rgba(191, 194, 204, 0.3);
		border-radius: 3px;
		border: 1px solid rgba(248, 248, 248, 1);
		padding: 15px;
		width: 722px;
		text-align: left;
		margin-top: 6px;
		font-size: 16px;
		color: #606266;
	}

	.pariseDetail_head_p p:nth-child(2) {
		color: #303133;
		font-size: 14px;
	}

	.pariseDetail_head_p p:nth-child(1) {
		margin-bottom: 4px;
		font-size: 16px;
		color: #606266;
	}

	.pariseDetail_head_p {
		text-align: left;
	}

	.pariseDetail img {
		width: 44px;
		height: 44px;
		margin-right: 4px;
	}

	.pariseDetail {
		display: inline-block;
		width: 810px;
		margin-bottom: 50px;
	}

	.reportDetail_smallBox {
		vertical-align: middle;
		text-align: center;
	}

	.back_btn {
		width: 118px;
		height: 40px;
		text-align: center;
		font-size: 14px;
		color: #4278BE;
		line-height: 40px;
		border: 1px solid #4278BE;
		cursor: pointer;
		border-radius: 3px;
	}

	.reportDetail_box {
		background-color: white;
		padding: 20px;
	}
</style>
