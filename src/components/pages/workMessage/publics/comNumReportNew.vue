<!--@description: 公司号消息
	@author: 王跃飞
	@update: 王跃飞 (2019-09-05 15:33)-->
<template>
	<div class="comNumReportNew-container" ref="mark">
		<img src="../images/GrouGongsihao.png" style="width: 44px;height: 44px;position: absolute;top:-55px;margin-left: -66px;display: inline-block;z-index: 99;">
		<template>
			<div class="comNumReportNew-item" @click.stop="TurnMessageInfo()">
				<div class="comNumReportNew-time"><span>2019年5月5日 9:55</span></div>
				<el-container>
					<el-aside width="44px"><img class="comNumReportNew-class" src=" ">
					</el-aside>
					<el-main>
						<div class="comNumReportNew-title">
							青岛云创智能集团有限公司
						</div>
						<div class="comNumReportNew-content">
							<div>
								<p>心无旁骛谋发展 脚踏实地干实业—福州市企联企业家走进新中冠</p>
								<p>2019年3月29日上午，福州市企联在位于福州市台江区鳌峰广场的新中冠智能科技股份有限公司组织开展了“心无旁骛谋发展 脚踏实地干
									实业”企业家活动。此次活动旨在认真贯彻落实习近平总书记在参加十三届全国人大会议福建代表团审议时的重要讲话精神及加强两新组
									织党建工作。市企联领导徐诗文、朱琴厦，市两新组织党建促进会常务副会长郭荣贵，市企联专委会主任、专委会企业家等约50人参加…</p>
							</div>
							<div><img src=""></div>
						</div>
					</el-main>
				</el-container>
			</div>
		</template>
		<div class="comNumReportNew-item">
			<div class="comNumReportNew-time"><span>2019年5月5日 9:55</span></div>
			<el-container>
				<el-aside width="44px"><img class="comNumReportNew-class" src=" ">
				</el-aside>
				<el-main>
					<div class="comNumReportNew-title">
						青岛云创智能集团有限公司
					</div>
					<div class="comNumReportNew-content">
						<div>
							<p>心无旁骛谋发展 脚踏实地干实业—福州市企联企业家走进新中冠</p>
							<p>2019年3月29日上午，福州市企联在位于福州市台江区鳌峰广场的新中冠智能科技股份有限公司组织开展了“心无旁骛谋发展 脚踏实地干
								实业”企业家活动。此次活动旨在认真贯彻落实习近平总书记在参加十三届全国人大会议福建代表团审议时的重要讲话精神及加强两新组
								织党建工作。市企联领导徐诗文、朱琴厦，市两新组织党建促进会常务副会长郭荣贵，市企联专委会主任、专委会企业家等约50人参加…</p>
						</div>
						<div><img src=""></div>
					</div>
				</el-main>
			</el-container>
		</div>
		<div class="comNumReportNew-item">
			<div class="comNumReportNew-time"><span>2019年5月5日 9:55</span></div>
			<el-container>
				<el-aside width="44px"><img class="comNumReportNew-class" src=" ">
				</el-aside>
				<el-main>
					<div class="comNumReportNew-title">
						青岛云创智能集团有限公司
					</div>
					<div class="comNumReportNew-content">
						<div>
							<p>心无旁骛谋发展 脚踏实地干实业—福州市企联企业家走进新中冠</p>
							<p>2019年3月29日上午，福州市企联在位于福州市台江区鳌峰广场的新中冠智能科技股份有限公司组织开展了“心无旁骛谋发展 脚踏实地干
								实业”企业家活动。此次活动旨在认真贯彻落实习近平总书记在参加十三届全国人大会议福建代表团审议时的重要讲话精神及加强两新组
								织党建工作。市企联领导徐诗文、朱琴厦，市两新组织党建促进会常务副会长郭荣贵，市企联专委会主任、专委会企业家等约50人参加…</p>
						</div>
						<div><img src=""></div>
					</div>
				</el-main>
			</el-container>
		</div>
		<transition
			@before-enter="beforeEnter"
			@enter="enter"
			@leave="leave">
		<div class="comNewsMessage" v-show="comNewsMessageFlag">
			<h1>
				<span>公司号消息</span>
				<span class="el-icon-close" @click="()=>{comNewsMessageFlag=false}"></span>
			</h1>
			<div class="comNewsMessage-main">
				<p>心无旁骛谋发展 脚踏实地干实业 —福州市企联企业家走进新中冠福州市企联企 业家走进新中冠</p>
				<p>今天9:11</p>
				<p>2019年3月29日上午，福州市企联在位于福州市台江区鳌峰广场的新中冠智能科技股份有 限公司组织开展了“心无旁骛谋发展 脚踏实地干实业”企业家活动。此次活动旨在认真贯彻
					落实习近平总书记在参加十三届全国人大会议福建代表团审议时的重要讲话精神及加强两 新组织党建工作。市企联领导徐诗文、朱琴厦，市两新组织党建促进会常务副会长郭荣
					贵，市企联专委会主任、专委会企业家等约50人参加了活动。公司董事长兼总裁吴根茂热 情接待了各位领导及企业家。2019年3月29日上午，福州市企联在位于福州市台江区鳌峰
					广场的新中冠智能科技股份有限公司组织开展了“心无旁骛谋发展 脚踏实地干实业”企业家 活动。此次活动旨在认真贯彻落实习近平总书记在参加十三届全国人大会议福建代表团审 议时的重要讲话</p>
				<img src="">
				<p>2019年3月29日上午，福州市企联在位于福州市台江区鳌峰广场的新中冠智能科技股份有 限公司组织开展了“心无旁骛谋发展 脚踏实地干实业”企业家活动。此次活动旨在认真贯彻
					落实习近平总书记在参加十三届全国人大会议福建代表团审议时的重要讲话精神及加强两 新组织党建工作。市企联领导徐诗文、朱琴厦，市两新组织党建促进会常务副会长郭荣
					贵，市企联专委会主任、专委会企业家等约50人参加了活动。公司董事长兼总裁吴根茂热 情接待了各位领导及企业家。2019年3月29日上午，福州市企联在位于福州市台江区鳌峰
					广场的新中冠智能科技股份有限公司组织开展了“心无旁骛谋发展 脚踏实地干实业”企业家 活动。此次活动旨在认真贯彻落实习近平总书记在参加十三届全国人大会议福建代表团审 议时的重要讲话</p>
			</div>
		</div>
		</transition>
		<div style="text-align: center; margin-top:20px;cursor: default" v-if="isLoad">加载更多</div>
		<div style="text-align: center; margin-top:20px;cursor: default" v-else>没有更多了</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				comNewsMessageFlag:false,   				//消息详情弹窗
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
			//右侧弹窗动画
			beforeEnter(el) {
				el.style.opacity = 0
				el.style.transform = "translateX(100%)"
			},
			enter(el) {
				el.offsetWidth;
				el.style.opacity = 1
				el.style.transform = "translateX(0)"
				el.style.transition = "all 0.5s linear"
			},
			leave(el) {
				this.comFlag = false
				el.style.transition = "all 0s linear"
			},
			//打开详情弹窗
			TurnMessageInfo() {
				this.comNewsMessageFlag= true
			},
			getJoinComDate(pageNum) {
				this.$http({
					method: 'POST',
					url: this.acceptNoticeUrl + '/v1/message/notification/querySecondCategoryByloginUser',
					data: {
						msgType: JSON.stringify(7),
						pageNum: JSON.stringify(pageNum),
						// pageSize:JSON.stringify(10)
					},
					headers: {
						userId: JSON.parse(this.adminInfo.employeeId),
						// "Access_Token": this.webToken
					}
				}).then(res => {
					if (res.status === 200 && res.data.code === 200) {
						this.totalPage = res.data.data.totalPages
						for(var i=0;i<res.data.data.list.length;i++){
							this.invitationList.push(res.data.data.list[i])

						}
					}
					console.log(this.invitationList)
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
	.comNumReportNew-container {
		background: #fff;
		padding: 50px 41px 50px 78px;
		position: relative;
		.comNewsMessage {
			position: fixed;
			top: 0;
			right: 0;
			background: #fff;
			width: 600px;
			height: 100%;
			h1 {
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				padding: 0 23px 0 20px;
				height: 66px;
				line-height: 66px;
				border-bottom: 1px solid #EDEFF2;
				span:first-child {
					font-size: 20px;
					color: #303133;
				}
				span:last-child {
					font-size: 11px;
					line-height: 66px;
				}
			}
			.comNewsMessage-main {
				padding: 31px 20px 30px;
				p:first-child {
					font-size: 16px;
					font-weight: 700;
					color:#303133;
				}
				p:nth-child(2) {
					margin-top: 20px;
					font-size: 14px;
					color:#909399;
					text-align: left;
				}
				p:nth-child(3) {
					margin-top: 20px;
				}
				img {
					display: inline-block;
					margin-top: 20px;
					width:559px;
					height: 219px;
					background: #2AA1E1;
				}
				p:last-child {
					margin-top: 20px;
				}
			}
		}

		.comNumReportNew-item {
			cursor: default;
			margin-bottom: 45px;
			.comNumReportNew-time {
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

					img {
						background: url("../images/Group17@2x.png") no-repeat top left/100%;
					}

					.comNumReportNew-class {
						width: 44px;
						height: 44px;
						border-radius: 2px;
					}
				}

				.el-main {
					padding: 0 0 0 10px;
					background: #fff;

					.comNumReportNew-title {
						margin-bottom: 6px;
						font-size: 16px;
						color: #303133;
					}

					.comNumReportNew-content {
						display: flex;
						display: -webkit-flex;
						justify-content: space-between;
						flex-wrap: nowrap;
						padding: 30px;
						border: 1px solid #BFC2CC;
						border-radius: 3px;


						& > div:first-child {
							P:first-child {
								margin-bottom: 20px;
								font-size: 18px;
								font-weight: 700;
								color: #303133;
							}

							p:last-child {
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 3;
								-webkit-box-orient: vertical;
								font-size: 16px;
								line-height: 156%;
								color: #303133;
								margin-bottom: 0;
							}
						}

						& > div:last-child {
							border-radius: 3px;

							img {
								display: inline-block;
								margin-left: 20px;
								background: pink;
								width: 208px;
								height: 117px;
								border-radius: 3px;
							}
						}
					}
				}
			}


		}
	}
</style>
