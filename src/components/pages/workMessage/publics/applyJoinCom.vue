<!--@description: 申请加入企业页面
	@author: 王跃飞
	@update: 王跃飞 (2019-09-17 17:46)-->
<template>
	<div class="applyJoinCom-container" ref="mark">
		<img src="../images/shenqingi@2x.png"
			 style="width: 44px;height: 44px;position: absolute;top:-54px;margin-left:-68px;display: inline-block">
		<template v-for="(item, index) in invitationList">
			<div class="applyJoinCom-item" @click.stop="turnjoin(item)">
				<div class="applyJoinCom-time">
					<span>{{item.createTime}}</span>
				</div>
				<div class="applyJoinCom-content">
					<p>{{JSON.parse(item.msgSubContent).content}}</p>
					<p>{{JSON.parse(item.msgSubContent).remark}}</p>
				</div>
			</div>
		</template>
		<div style="text-align: center; margin-top:20px;cursor: default" v-if="isLoad">加载更多</div>
		<div style="text-align: center; margin-top:20px;cursor: default" v-else>没有更多了</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				version:[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,],
				acceptNoticeUrl: 'messageManager',														// 接收消息的协议和端口号
				orgManager: 'orgManager',																// 网关应用
				ssoManager: 'ssoManager',
				adminInfo: JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')),			// 用户相关信息
				invitationList: [],																		// 接收邀请信息
				pageNum: 1,																				// 获取相应页面的消息
				isLoad: false,																			// 是否还有更多消息可以加载
				totalPage:'',																			// 接收信息总页数
			}
		},
		methods: {
			turnjoin(item) {
		console.log(item)
			},
			getJoinComDate(pageNum) {
				this.$http({
					method: 'POST',
					url: this.acceptNoticeUrl + '/v1/message/notification/querySecondCategoryByloginUser',
					data: {
						msgType: JSON.stringify(2),
						pageNum: JSON.stringify(pageNum),
						// pageSize:JSON.stringify(10)
					},
					headers: {
						userId: JSON.parse(this.adminInfo.employeeId),
						// "Access_Token": this.webToken
					}
				}).then(res => {
					console.log(res)
					if (res.status === 200 && res.data.code === 200) {
						this.totalPage = res.data.data.totalPages
						for(var i=0;i<res.data.data.list.length;i++){
							this.invitationList.push(res.data.data.list[i])

						}
					}
				})
			},
			//下拉加载
			//获取当前可视范围的高度
			getClientHeight() {
				let clientHeight = 0
				clientHeight = this.$refs.mark.offsetHeight || this.$refs.mark.clientHeight
				return clientHeight
			},
			//获取文档完整的高度
			getScrollHeight() {
				return Math.max(this.$parent.$parent.$el.scrollHeight, document.documentElement.scrollHeight);
			},
			//获取文档完整的高度
			getScrollHeight() {
				return Math.max(this.$parent.$parent.$el.scrollHeight, document.documentElement.scrollHeight);
			},
			lookReportSonscroll(e) {
				let ctx = 0
				if(this.getClientHeight()<this.getScrollHeight()&&this.getClientHeight()===this.getScrollHeight()){
					return
				}
				if(this.getClientHeight()>this.getScrollHeight()){
					ctx = this.getClientHeight() - this.getScrollHeight()
					if ((e.target.scrollTop + ctx > this.getClientHeight())) {
						if (this.pageNum < this.totalPage) {
							this.isLoad = true
							this.pageNum++
							this.getJoinComDate(this.pageNum)
						} else {
							this.isLoad = false
							return
						}
					}

				}
			},
		},
		created() {
			this.getJoinComDate()
		},
		mounted() {
			this.$nextTick(() => {
				if (window.addEventListener) {
					this.$parent.$parent.$el.addEventListener('scroll', this.lookReportSonscroll, true)
				} else if (window.attachEvent) {
					this.$parent.$parent.$el.attachEvent('scroll', this.lookReportSonscroll, true)
				}
			})
		},
		destroyed: function () {
			if (window.removeEventListener) {
				this.$parent.$parent.$el.removeEventListener('scroll', this.lookReportSonscroll, true)  //  离开页面清除滚动事件
			} else if (window.detachEvent) {
				this.$parent.$parent.$el.detachEvent('scroll', this.lookReportSonscroll, true)  //  离开页面清除滚动事件
			}
		}
	}
</script>
<style lang="scss" scoped>
	.applyJoinCom-container {
		position: relative;
		background-color: #fff;
		padding: 50px 82px;
		height: 800px;

		.applyJoinCom-item {
			margin-bottom: 30px;

			.applyJoinCom-time {
				color: #000;
				font-size: 12px;
				text-align: center;

				span {
					display: inline-block;
					padding: 2px 5px;
					margin: 0 auto 20px;
					text-align: center;
				}
			}

			.applyJoinCom-content {
				padding: 30px 30px 10px;
				border: 1px solid #BFC2CC;
				border-radius: 3px;

				p {
					margin-bottom: 20px;
					color: #606266;
					font-size: 14px;
				}
			}

		}
	}
</style>
