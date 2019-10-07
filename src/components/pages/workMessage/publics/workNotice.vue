<!--@description: 工作通知页面
	@author: 王跃飞
	@update: 王跃飞 （2019-9-17 14:20）-->
<template>
	<div class="workNews-container" ref="mark">
		<img src="../images/gongzuo@2x.png"
			 style="width: 44px;height: 44px;position: absolute;top:-55px;margin-left: -64px;display: inline-block;z-index: 1;">
		<div
			style="position: absolute;top:-48px;margin-left: 95px;color:#303133;font-size: 24px;white-space: nowrap;width:200px;width: 100%;overflow: hidden;-o-text-overflow: ellipsis;text-overflow: ellipsis;">
			：{{companyName}}
		</div>
		<template v-for="(item,index) in invitationList">
			<div class="workNews-item" @click.stop="shenpiInfo(item,index)">
				<div class="workNews-time"><span>{{item.createTime}}</span></div>
				<el-container>
					<el-aside width="44px"><img :src="JSON.parse(item.msgSubContent).logoUrl!==''&&JSON.parse(item.msgSubContent).logoUrl" :style="backImg[0]" class="workNews-class">
					</el-aside>
					<el-main>
						<div class="workNewsShenpi-title">
							{{JSON.parse(item.msgSubContent).typeTitle}}1
						</div>
						<div
							:class="[JSON.parse(item.msgSubContent).approveStatus===0?'workNewsShenpi-content activeNow':'workNewsShenpi-content']">
							<p>{{JSON.parse(item.msgSubContent).title}}</p>
							<template v-for="(itemc,index) in JSON.parse(item.msgSubContent).contentList">
								<p>{{itemc}}</p>
							</template>
							<p v-show="JSON.parse(item.msgSubContent).approveStatus===1||JSON.parse(item.msgSubContent).approveStatus===2"
							   class="waitApproval">待审批</p>
							<p v-show="JSON.parse(item.msgSubContent).approveStatus===3" class="passed">已通过</p>
							<p v-show="JSON.parse(item.msgSubContent).approveStatus===4" class="refused">已拒绝</p>
							<p v-show="JSON.parse(item.msgSubContent).attachmentNumber>0"><img
								src="../images/附件@2x.png">{{JSON.parse(item.msgSubContent).attachmentNumber}}个附件
							</p>
						</div>
					</el-main>
				</el-container>
			</div>
		</template>
		<template v-for="(item,index) in invitationPinglunList">
			<div class="workNews-item" @click.stop="shenpiInfo(item,index)">
				<div class="workNews-time"><span>{{item.createTime}}</span></div>
				<el-container>
					<el-aside width="44px"><img :src="JSON.parse(item.msgSubContent).logoUrl!==''&&JSON.parse(item.msgSubContent).logoUrl" :style="backImg[0]"  class="workNews-class"></el-aside>
					<el-main>
						<div class="workNewsShenpi-title">
							{{item.msgSubTitle}}
						</div>
						<div class="workNewsShenpi-content">
							<p>{{JSON.parse(item.msgSubContent).title}}</p>
							<p>{{JSON.parse(item.msgSubContent).commentContent}}</p>
						</div>
						<p v-show="JSON.parse(item.msgSubContent).contentList.attachmentNumber>0"><img
							src="../images/附件@2x.png">{{JSON.parse(item.msgSubContent).contentList.attachmentNumber}}个附件
						</p>
					</el-main>
				</el-container>
			</div>
		</template>
		<template v-for="(item,index) in dateHuibaoList">
			<div class="workNews-item" @click.stop="huiBaoInfo(item,index)">
				<div class="workNews-time"><span>{{item.createTime}}</span></div>

				<el-container>
					<el-aside width="44px"><img :src="JSON.parse(item.msgSubContent).logoUrl!==''&&JSON.parse(item.msgSubContent).logoUrl" :style="backImg[1]"  class="workNews-class"></el-aside>
					<el-main>
						<div class="workNewsHuibao-title">
							{{JSON.parse(item.msgSubContent).typeTitle}}
						</div>
						<div class="workNewsHuibao-content">
							<p>{{JSON.parse(item.msgSubContent).contentList.title}}</p>
							<template v-for="(itemc,index) in JSON.parse(item.msgSubContent).contentList">
								<p>{{itemc}}</p>
							</template>
							<!--							<p>备注：明天团建</p>-->
							<p v-show="JSON.parse(item.msgSubContent).contentList.attachmentNumber>0"><img
								src="../images/附件@2x.png">{{JSON.parse(item.msgSubContent).contentList.attachmentNumber}}个附件
							</p>
						</div>
					</el-main>
				</el-container>
			</div>
		</template>
		<template v-for="(item,index) in dateHuibaoPinglunList">
			<div class="workNews-item" @click.stop="huiBaoInfo(item,index)">
				<div class="workNews-time"><span>{{item.createTime}}</span></div>
				<el-container>
					<el-aside width="44px"><img :src="JSON.parse(item.msgSubContent).logoUrl!==''&&JSON.parse(item.msgSubContent).logoUrl" :style="backImg[1]"  class="workNews-class"></el-aside>
					<el-main>
						<div class="workNewsHuibao-title">
							{{JSON.parse(item.msgSubContent).typeTitle}}
						</div>
						<div class="workNewsHuibao-content">
							<p>{{JSON.parse(item.msgSubContent).title}}</p>
							<p>{{JSON.parse(item.msgSubContent).commentContent}}</p>
						</div>
					</el-main>
				</el-container>
			</div>
		</template>
		<template v-for="(item,index) in dateHuibaoGiveLikeList">
			<div class="workNews-item" @click.stop="huiBaoInfo(item,index)">
				<div class="workNews-time"><span>{{item.createTime}}</span></div>
				<el-container>
					<el-aside width="44px"><img :src="JSON.parse(item.msgSubContent).logoUrl!==''&&JSON.parse(item.msgSubContent).logoUrl" :style="backImg[1]"  class="workNews-class"></el-aside>
					<el-main>
						<div class="workNewsHuibao-title">
							{{JSON.parse(item.msgSubContent).typeTitle}}
						</div>
						<div class="workNewsHuibao-content">
							<p>{{JSON.parse(item.msgSubContent).title}}</p>
							<p>{{JSON.parse(item.msgSubContent).commentContent}}</p>
						</div>
					</el-main>
				</el-container>
			</div>
		</template>
		<template v-for="(item,index) in version">
			<div class="workNews-item">
				<div class="workNews-time"><span>2019年5月5日 9:5{{index}}</span></div>
				<el-container>
					<el-aside width="44px"><img :src="JSON.parse(item.msgSubContent).logoUrl!==''&&JSON.parse(item.msgSubContent).logoUrl" :style="backImg[3]"  class="workNews-class"></el-aside>
					<el-main>
						<div class="workNewsHuibao-title">
							公告
						</div>
						<div class="workNewsHuibao-content">
							<p>关于修订考勤管理制度(暂行)的通知</p>
							<p>怕搜集怕时间撒旦 SDK撒旦【发扩大开放上课速度快付款电饭锅大幅度发梵蒂冈电饭锅 地方 发 发 的非官方个 发个电饭锅地方 段</p>
							<p><img src="../images/附件@2x.png">2个附件</p>
						</div>
					</el-main>
				</el-container>
			</div>
		</template>
		<div style="text-align: center; margin-top:20px;cursor: default" v-if="isLoad">加载更多</div>
		<div style="text-align: center; margin-top:20px;cursor: default" v-else>没有更多了</div>

		<Sidebar :sidebarShow="sidebarFlag" :reportType="huiBaoType" :reportId="huiBaoId" :newsNotice="newsNoticeFlag"
				 @changeNewsFlag="changeNewsFlag"></Sidebar>
		<ShenPiSidebar :sidebarShow="shenPiSidebarFlage" :awaitApprvolDetial="awaitApprvolDetial"
					   @close="handleCloseSidebar"></ShenPiSidebar>
	</div>
</template>
<script>
	import Sidebar from '../../OA/workReport/sidebar'
	import ShenPiSidebar from '../../OA/approvalManagement/publics/sliderDialog'
	import bus from '../../../../modules/bus'

	export default {
		data() {
			return {
				version: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
				acceptNoticeUrl: 'messageManager',								// 接收消息的协议和端口号
				orgManager: 'orgManager',
				ssoManager: 'ssoManager',
				adminInfo: JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')),
				invitationList: [],				// 带有审批状态的审批信息
				invitationPinglunList: [],		// 评论的审批信息
				dateHuibaoList: [],				// 日报，周报，月报
				dateHuibaoPinglunList: [],		// 评论的汇报信息
				dateHuibaoGiveLikeList: [],		// 点赞的汇报
				reportList: [],					// 公告信息
				newsNoticeFlag: false,			// 是否是消息通知页面传递参数的开关
				shenPiSidebarFlage: false,		// 右侧审批弹窗展示
				awaitApprvolDetial: {},			// 接收审批每条详情数据
				sidebarFlag: false,				// 右侧汇报弹窗展示
				shenpiOrHuibaoFlag: false,		// 判断是审批还是汇报的开关
				huiBaoType: 1,					// 日报2，周报2，月报3
				huiBaoId: 0,					// 汇报ID
				companyId: '',					// 接收路由传来的id
				companyName: '',					// 接收路由传来的name
				pageNum: 1,						// 获取相应页面的消息
				list: [],						// 接收展示的数据
				isLoad: false,					// 是否还有更多消息可以加载
				backImg: [
					{
						background: "url(" + require("../images/Groupshenpi2.png") + ")",
						backgroundRepeat: "no-repeat",
						backgroundSize: "100%",
					},
					{
						background: "url(" + require("../images/Grouphuibao2.png") + ")",
						backgroundRepeat: "no-repeat",
						backgroundSize: "100%",
					},
					{
						background: "url(" + require("../images/Groupgonggao2.png") + ")",
						backgroundRepeat: "no-repeat",
						backgroundSize: "100%",
					}
				]
			}
		},
		inject: ['reload'],
		components: {
			Sidebar,
			ShenPiSidebar
		},
		methods: {
			// 获取路由传来的参数
			getQueryDate() {
				if (this.$route.query) {
					this.companyId = this.$route.query.i
					this.companyName = this.$route.query.a

				} else {
					this.companyId = []
					this.companyName = []
				}
			},
			//获取数据
			getJoinComDate(pageNum) {
				this.$http({
					method: 'POST',
					url: this.acceptNoticeUrl + '/v1/message/notification/querySecondCategoryByloginUser',
					data: {
						msgType: 6,
						pageNum: pageNum || 1,
						// companyId:this.adminInfo.companyId
						// pageSize:JSON.stringify(10)
					},
					headers: {
						// userId: JSON.parse(this.adminInfo.employeeId),
						userId: this.companyId,
						// "Access_Token": this.webToken
					}
				}).then(res => {
					// console.log(res)
					if (res.status === 200 && res.data.code === 200) {
						var _that = this
						this.list = res.data.data
						console.log(this.list)
						for (var i = 0; i < this.list.list.length; i++) {
							if (this.list.list[i].msgFlag === 900001) {
								_that.invitationList.push(this.list.list[i])
							}
							if (this.list.list[i].msgFlag === 900002) {
								_that.invitationPinglunList.push(this.list.list[i])
							}
							if (this.list.list[i].msgFlag === 900003) {
								_that.dateHuibaoList.push(this.list.list[i])
							}
							if (this.list.list[i].msgFlag === 900004) {
								_that.dateHuibaoPinglunList.push(this.list.list[i])
							}
							if (this.list.list[i].msgFlag === 900005) {
								_that.dateHuibaoGiveLikeList.push(this.list.list[i])
							}
							if (this.list.list[i].msgFlag === 900006) {
								_that.reportList.push(this.list.list[i])
							}
						}
					}
					console.log(this.invitationList)
				})
			},
			//===根据类型判断使用获取汇报还是获取审批详情的开关函数
			// 查看审批详情
			handleApprvolDetial(obj) {
				// console.log(obj)
				this.$http({
					method: 'GET',
					url: `/oaManager/v1/feign/oa/approve/queryApproveInfo/${this.userDetail.id}/${obj.businessId}/${obj.businessType}`
					// url:`http://192.168.10.12:7003/oaManager/v1/feign/oa/approve/queryApproveInfo/1567386034330029/1567758108440032/1565750481760200`
				}).then(res => {
					if (res.data.code == 200) {
						this.awaitApprvolDetial = res.data.data
						this.awaitApprvolDetial.approveName = obj.title
						this.awaitApprvolDetial.approveChildrenId = obj.businessId
						this.awaitApprvolDetial.approveTypeId = obj.businessType
						this.ShenPiSidebar = true
					} else {
						this.$message({
							type: 'error',
							message: res.data.message
						})
					}
				})
			},

			// 查看抄送我的审批详情   ====只有抄送我的需要用下面这个方法，条件需要判断审批类型
			handleCopyApprvolDetial(obj) {
				this.$http({
					method: 'GET',
					url: `/oaManager/v1/feign/oa/approve/queryApproveInfoAndEditReadStatus/${this.adminInfo.id}/${obj.businessType}/${obj.businessId}`
				}).then(res => {
					if (res.data.code == 200) {
						this.awaitApprvolDetial = res.data.data
						this.awaitApprvolDetial.approveName = obj.title
						this.awaitApprvolDetial.approveChildrenId = obj.businessId
						this.awaitApprvolDetial.approveTypeId = obj.businessType
						this.ShenPiSidebar = true
						bus.$emit('approvalStatus', true)
					} else {
						this.$message({
							type: 'error',
							message: res.data.message
						})
					}
				})
			},

			// 审批详情
			shenpiInfo(item, index) {
				this.shenPiSidebarFlage = true
				const itemc = JSON.parse(item.msgSubContent)
				// console.log(itemc.)
				if (itemc.isRecipients === 0) {
					this.handleCopyApprvolDetial(itemc)
				} else if (itemc.isRecipients === 1) {
					this.handleApprvolDetial(itemc)
				}

			},
			// 汇报详情
			huiBaoInfo(item, index) {
				console.log(item)
				this.newsNoticeFlag = true
				this.huiBaoType = JSON.parse(item.msgSubContent).businessType
				this.huiBaoId = item.detailId
				this.sidebarFlag = true
			},
			changeNewsFlag() {
				this.newsNoticeFlag = false
				this.sidebarFlag = false
			},
			handleCloseSidebar() {
				this.shenPiSidebarFlage = false
			},
			//下拉加载
			//获取当前可视范围的高度
			getClientHeight() {
				let clientHeight = 0;
				clientHeight = this.$refs.mark.offsetHeight || this.$refs.mark.clientHeight
				return clientHeight;
			},
			//获取文档完整的高度
			getScrollHeight() {
				return Math.max(this.$parent.$parent.$el.scrollHeight, document.documentElement.scrollHeight);
			},
			lookReportSonscroll(e) {
				let ctx = 0
				if (this.getClientHeight() < this.getScrollHeight() && this.getClientHeight() === this.getScrollHeight()) {
					return
				}
				if (this.getClientHeight() > this.getScrollHeight()) {
					ctx = this.getClientHeight() - this.getScrollHeight()
					if ((e.target.scrollTop + ctx > this.getClientHeight())) {
						if (this.pageNum < this.list.totalPages) {
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
			this.$forceUpdate()
			this.getQueryDate()
			this.getJoinComDate()
		},
		mounted() {
			this.$nextTick(() => {
				if (window.addEventListener) {
					this.$parent.$parent.$el.addEventListener('scroll', this.lookReportSonscroll, true);
				} else if (window.attachEvent) {
					this.$parent.$parent.$el.attachEvent('scroll', this.lookReportSonscroll, true);
				}
			});
		},
		destroyed: function () {
			if (window.removeEventListener) {
				this.$parent.$parent.$el.removeEventListener('scroll', this.lookReportSonscroll, true);   //  离开页面清除滚动事件
			} else if (window.detachEvent) {
				this.$parent.$parent.$el.detachEvent('scroll', this.lookReportSonscroll, true);   //  离开页面清除滚动事件
			}
		}

	}
</script>
<style lang="scss" scoped>
	.workNews-container {
		background: #fff;
		padding: 20px 41px 20px 78px;
		position: relative;

		.workNews-item {
			.activeNow {
				background: #FFFBCE;
			}

			.workNews-time {
				margin-top: 30px;
				padding-bottom: 6px;
				text-align: center;

				span {
					font-size: 12px;
					color: #000;
				}
			}

			.el-container {
				margin-top: 30px;

				.el-aside {
					overflow: hidden;
					background: #fff;

					.workNews-class {
						width: 44px;
						height: 44px;
						border-radius: 2px;
					}
				}

				.el-main {
					padding: 0 0 0 10px;
					background: #fff;

					.workNewsShenpi-title, .workNewsHuibao-title, .workNewsHuibao-title {
						margin-bottom: 6px;
						font-size: 16px;
						color: #303133;
					}

					.workNewsShenpi-content {
						padding: 30px;
						border: 1px solid #BFC2CC;
						border-radius: 3px;

						.waitApproval {
							color: #2AA1E1;
						}

						.refused {
							color: #FF6565;
						}

						.passed {
							color: #4FBE96;
						}

						p {
							margin-bottom: 5px;
						}

						P:first-child {
							font-size: 16px;
							color: #303133;
						}

						p:last-child {
							margin-bottom: 0;
						}
					}

					.workNewsHuibao-content {
						padding: 30px;
						border: 1px solid #BFC2CC;
						border-radius: 3px;

						p {
							margin-bottom: 5px;
						}

						p:first-child {
							font-size: 16px;
						}

						p:last-child {
							margin-bottom: 0;
							font-size: 14px;
							color: #909399;

							img {
								display: inline-block;
								vertical-align: middle;
								margin-right: 3px;
								width: 15px;
								height: 15px;
							}
						}
					}

					.workNewsHuibao-content {
						padding: 30px;
						border: 1px solid #BFC2CC;
						border-radius: 3px;

						p {
							margin-bottom: 5px;
						}

						p:first-child {
							font-size: 16px;
						}

						p:last-child {
							margin-bottom: 0;
							font-size: 14px;
							color: #909399;

							img {
								display: inline-block;
								vertical-align: middle;
								margin-right: 3px;
								width: 15px;
								height: 15px;
							}
						}
					}
				}
			}


		}
	}
</style>
