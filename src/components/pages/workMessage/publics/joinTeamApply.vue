<!--@description: 申请加入企业页面
	@author: 王跃飞
	@update: 王跃飞 (2019-09-04 10:30)
-->
<template>
	<div class="joinTeamApply-container">
		<template>
			<div class="joinTeamApply-item">
				<el-container>
					<el-aside width="80px"><img src=""></el-aside>
					<el-main>
						<div class="joinTeamApply-man">
							周杰论
						</div>
						<div class="joinTeamApply-content">
							<p>申请加入</p>
							<p>青岛云创智能集团有限公司</p>
							<p>加入部门</p>
							<p>加入部门</p>
						</div>
						<div class="joinTeamApply-decision">由<span>张佳</span>邀请加入</div>
						<div class="joinTeamApply-btn">
							<template>
								<el-button>拒绝</el-button>
								<el-button>同意</el-button>
							</template>
							<span class="agree-btn">已通过</span>
							<span class="refuse-btn">已拒绝</span>
						</div>
					</el-main>
				</el-container>
			</div>
		</template>
	</div>
</template>
<script></script>
<style lang="scss" scoped>
	.joinTeamApply-container {
		padding: 20px;
		background: #fff;
		height: 800px;

		.joinTeamApply-item {
			padding: 20px 0;
			border: 1px solid #4278BE;

			.el-aside {
				background: #fff;
				text-align: right;

				img {
					display: inline-block;
					width: 50px;
					height: 50px;
				}
			}
			.el-main {
				padding: 0 50px 20px 20px;
				background: #fff;
				font-size: 16px;
				.joinTeamApply-man {
					padding-bottom: 14px;
					border-bottom: 1px solid #BFC2CC;
					color: #303133;
				}
				.joinTeamApply-content {
					padding: 9px 0;
					margin-bottom: 9px;
					border-bottom: 1px solid #BFC2CC;
					p {
						margin-bottom: 10px;
					 	&:nth-child(2n) {
							color:#303133;
						}
						&:nth-child(2n+1) {
							color:#909399;
						}
						&:last-child {
							margin-bottom: 0;

						}
					}
				}
				.joinTeamApply-decision {
					margin-bottom: 30px;
					span {
						color:#4278BE;
					}
				}
				.joinTeamApply-btn {
					text-align: right;
					.el-button {
						padding: 0;
						width: 86px;
						height: 36px;
						line-height: 36px;
						font-size: 14px;
						&:first-child {
							color:#4278BE;
							border-color: #4278BE;
						}
						&+.el-button {
							color:#fff;
							background: #4278BE;
						}
					}
					.agree-btn {
						font-size: 14px;
						color:#4FBE96;
					}
					.refuse-btn {
						font-size: 14px;
						color:#FF6565;
					}
				}
			}
		}
	}
</style>
