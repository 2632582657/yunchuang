<template>
	<div class="addTeamWorkNews">
		<img src="../images/jiarutuandui@2x(1).png"
			 style="width: 44px;height: 44px;position: absolute;top:-75px;margin-left: 143px;">
		<div class="team_list clear" v-for="item in UserInfoJoinApply.list">
			<img :src="item.iconUrl " alt="" width="50px;" height="50px" class="fl" v-if="item.iconUrl ">
			<img src="../images/h.png" alt="" width="50px;" class="fl" v-else>
			<div class="team_r">
				<div>{{item.companyName}}</div>
				<div
					style="color:#BFC2CC;font-size:14px;margin-top:10px;border-bottom:1px solid #BFC2CC;width:100%;height:30px">
					{{item.teamUserTel}}
				</div>
				<p>申请加入</p>
				<div>{{item.teamInfoName}}</div>
				<p>加入部门</p>
				<div>{{item.departmentName ? item.departmentName : '暂未填写'}}</div>
				<el-divider></el-divider>
				<div class="clear">
					<div class="fl" v-if="item.approverName">由<span style="color:#4278BE;cursor:pointer"
																	@click="lookEmployeeInfo(item)">{{item.approverName}}</span>邀请加入
					</div>
					<div class="submit fr">
						<template v-if="item.applyResult == 0">
							<el-button size="mini" type="primary" @click="handleSubmit(item)" class="fr"
									   style="width:86px;height:36px;background:#4278BE;color:#fff;margin-left:15px;margin-top:10px">
								同意
							</el-button>
							<el-button size="mini" @click="handleClose(item)" class="fr"
									   style="border:1px solid #4278BE;color:#4278BE;width:86px;height:36px;margin-top:10px">
								拒绝
							</el-button>
						</template>
						<template v-else-if="item.applyResult == 1">
							<div class="fr" style="color:#4FBE96">同意</div>
						</template>
						<template v-else>
							<div class="fr" style="color:#FF6565">拒绝</div>
						</template>
					</div>
				</div>
			</div>
		</div>
		<el-dialog
			:visible.sync="dialogVisible"
			width="30%"
			center
		>
			<div slot="title" class="header-title clear" style="border-bottom:1px solid #BFC2CC;height:42px;">
				<div style="width:16px;height:23px;background:#4278BE;float:left;margin-top:4px;margin-left:30px"></div>
				<div
					style="width:98px;height:31px;font-size:24px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:31px;float:left;margin-left:10px">
					拒绝理由
				</div>
			</div>
			<el-input
				type="textarea"
				placeholder="请填写拒绝原因"
				v-model="applyReason"
			>
			</el-input>
			<span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false"
						   style="border:1px solid #4278BE;color:#4278BE;width:150px;height:50px;">取 消</el-button>
                <el-button @click="handleSubmit"
						   style="background:rgba(66,120,190,1);color:#fff;width:150px;height:50px;">确 定</el-button>
            </span>
		</el-dialog>
		<div style="text-align: center; margin-top:20px;cursor: default" v-if="isLoad">加载更多</div>
		<div style="text-align: center; margin-top:20px;cursor: default" v-else>没有更多了</div>
	</div>
</template>

<script>
	import bus from '../../../../modules/bus'

	export default {
		data() {
			return {
				acceptNoticeUrl: 'http://192.168.50.64:7008',
				ssoManager:'ssoManager',
				teamEmployeeDetailVO: JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')),
				UserInfoJoinApply: [],
				dialogVisible: false,
				applyReason: '',
				UserInfo: {},
				pageNum: 1,						// 获取相应页面的消息
				isLoad: false,					// 是否还有更多消息可以加载
			}
		},
		created() {
			this.getUserInfoJoinApply()
		},
		methods: {
			getUserInfoJoinApply(pageNum) {
				this.$http({
					method: 'POST',
					url: this.acceptNoticeUrl + '/v1/message/notification/querySecondCategoryByloginUser',
					data: {
						msgType: JSON.stringify(1),
						pageNum: JSON.stringify(pageNum),
						// pageSize:JSON.stringify(10)
					},
					headers: {
						userId: 1567386034330029,

						// userId: JSON.parse(this.teamEmployeeDetailVO.employeeId),
						// "Access_Token": this.webToken
					}
				}).then(res => {
					if (res.data.code == 200) {
						console.log(res)
						this.UserInfoJoinApply = res.data.data
						console.log(this.UserInfoJoinApply)
					}
				})
			},
			handleClose(item) {
				this.dialogVisible = true
				this.UserInfo = item
			},
			handleSubmit(item) {
				this.$http({
					method: 'POST',
					url: this.ssoManager + '/v1/oa/userInfoJoinApply/approvalJoinApply',
					data: {
						applyId: item.id || this.UserInfo.id,
						applyResult: this.dialogVisible ? '2' : '1',
						approver: item.approver || this.UserInfo.approver,
						teamInfoId: item.teamInfoId || this.UserInfo.teamInfoId,
						applyReason: this.applyReason
					}
				}).then(res => {
					// console.log(res.data)
					if (res.data.code == 200) {
						this.$message({
							type: 'success',
							message: '审批成功'
						})
						this.getUserInfoJoinApply()
						this.dialogVisible = false
					}
				})
			},
			lookEmployeeInfo(item) {
				this.$router.push({name: 'frameWork', params: {id: item.teamInfoId, approver: item.approver}})
				var obj = {
					id: this.teamEmployeeDetailVO.employeeId,
					label: item.teamInfoName,
					companyId: item.teamInfoId,
					departmentName: item.departmentName,
				}
				bus.$emit('companyObj', obj)
				window.sessionStorage.setItem('companyObj', JSON.stringify(obj))
				this.$store.commit('showEditmember', true)
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
				if(this.getClientHeight()<this.getScrollHeight()&&this.getClientHeight()===this.getScrollHeight()){
					return
				}
				if(this.getClientHeight()>this.getScrollHeight()){
					ctx = this.getClientHeight() - this.getScrollHeight()
					if ((e.target.scrollTop + ctx > this.getClientHeight())) {
						if (this.pageNum < this.totalPage) {
							this.isLoad = true
							this.pageNum++
							this.getUserInfoJoinApply(this.pageNum)
						} else {
							this.isLoad = false
							return
						}
					}

				}
			},
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
	.addTeamWorkNews {
		position: relative;
		margin-top: 20px;
		padding: 1px 20px 0 20px;
		width: 100%;
		box-sizing: border-box;
		color: #303133;
		background: #fff;

		.team_list {
			height: 307px;
			width: 100%;
			margin-top: 20px;
			padding: 20px 50px 20px 30px;
			box-sizing: border-box;
			border: 1px solid #4278BE;

			.team_r {
				width: 95%;
				margin-left: 70px;

				p {
					color: #909399;
					height: 40px;
					line-height: 40px
				}

				.el-divider--horizontal {
					margin: 10px 0;
					background: #BFC2CC
				}

				// .submit {
				//     margin-top: 10px;
				// }
			}
		}

		.el-dialog {
			width: 500px !important;
			height: 310px !important;
			margin-top: 34vh !important
		}

		.el-dialog__header {
			padding: 20px 0 10px;
		}

		.el-textarea__inner {
			width: 440px;
			height: 101px;
			border-radius: 3px;
		}

		.el-dialog__headerbtn .el-dialog__close {
			display: none
		}
	}
</style>
