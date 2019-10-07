<template>
	<div class="jobInfo-container">
		<header>
			<!-- <el-button type="primary"  style="" @click=back><返回</el-button> -->
			<div class="comDymanicInfo-btn-box">
				<el-button type="text" @click="pre" :class="{spanactive:indexDy===0}"><span
					v-if="indexDy>0">上一篇</span><span v-else>当前是第一篇</span></el-button>
				<el-button type="text" @click="next" :class="{spanactive:indexDy===length-1}"><span
					v-if="indexDy<length-1">下一篇</span><span v-else>当前是最后一篇</span></el-button>
			</div>
		</header>
		<div class="jobInfo-main">
			<template>
				<p style="font-size:30px;margin-top:30px;overflow:hidden;line-height:40px;">
					<span style="float:left;height:100%;color:#303133;">{{jobName[indexDy]}}</span>
					<span style="color:#4278BE;float:right;height:100%;">{{jobPayName[indexDy]}}</span>
				</p>
				<p style="text-align:left;color:#909399;font-size:14px;">更新于 &nbsp; &nbsp;{{day[indexDy]}}</p>

				<p style="text-align:left;color:#606266;font-size:12px;">
					<span>{{region[indexDy]}}.</span>
					<span>{{workExperienceName[indexDy]}}.</span>
					<span>{{educationRequireName[indexDy]}}.</span>
					<span> 招聘{{employ[indexDy]}}人</span>
				</p>
				<p style="text-align:left;font-weight:bold;border-left:8px solid #4278BE;height:20px;line-height:20px;font-size:16px;margin-bottom:20px;padding-left:10px;color:#303133;">
					工作概述</p>
				<p style="color:#303133;font-size:14px;line-height:30px;text-align:left;" v-html="content1[indexDy]">
					{{content1[indexDy]}}
				</p>
				<p style="text-align:left;font-weight:bold;border-left:8px solid #4278BE;height:20px;line-height:20px;font-size:16px;margin:30px 0 20px;padding-left:10px;color:#303133;">
					任职要求</p>
				<div class="job-require" style="color:#303133;font-size:14px;line-height:30px;"
					 v-html="content2[indexDy]">
					{{content2[indexDy]}}
				</div>
				<p style="text-align:left;font-weight:bold;border-left:8px solid #4278BE;height:20px;line-height:20px;font-size:16px;margin:30px 0 20px;padding-left:10px;color:#303133;">
					福利待遇</p>
				<div class="job-treatment" style="color:#303133;font-size:14px;line-height:30px;"
					 v-html="content3[indexDy]">
					{{content3[indexDy]}}
				</div>
			</template>
		</div>
	</div>
</template>
<script>
	import '@/modules/common'

	export default {
		data() {
			return {
				length: '',
				preInfo: [],//接受信息id便于跳转上一页
				nextInfo: [],//接受信息id便于跳转下一页
				indexDy: '',//接收路由传来的索引
				id: [],
				createBy: [],
				day: [],
				jobName: [],
				content1: [],
				content2: [],
				content3: [],
				region: [],
				educationRequireName: [],
				jobStatus: [],
				workExperienceName: [],
				employ: [],
				jobPayName: []
			}
		},
		created() {
			this.getBackInfo()
		},
		methods: {
			// 获取信息
			getBackInfo() {
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/queryJobAll',
					params: {
						companyId: '1',
					},
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				}).then(res => {
					console.log(res)
					var that = this
					if (res.data.code === 200 && res.status === 200) {
						this.indexDy = this.$route.query.i
						this.length = this.$route.query.length
						for (var i = 0; i < res.data.data.length; i++) {
							that.id[i] = JSON.parse(res.data.data[i].id)
							that.createBy[i] = JSON.parse(res.data.data[i].createBy)
							that.day[i] = res.data.data[i].day.slice(0,-3)
							that.jobName[i] = JSON.parse(res.data.data[i].jobName)
							that.content1[i] = JSON.parse(res.data.data[i].workSummarize)
							that.content2[i] = JSON.parse(res.data.data[i].jobRequire)
							that.content3[i] = JSON.parse(res.data.data[i].socialBenefits)
							that.region[i] = JSON.parse(res.data.data[i].workAddress)
							that.educationRequireName[i] = res.data.data[i].educationRequireName
							that.jobStatus[i] = res.data.data[i].jobStatus
							that.workExperienceName[i] = res.data.data[i].workExperienceName
							that.employ[i] = JSON.parse(res.data.data[i].employ)
							that.jobPayName[i] = res.data.data[i].jobPayName
						}
						// debugger

					}

				})
			},
			next() {
				var that = this
				if (that.indexDy < that.length - 1) {
					that.indexDy++
				} else {
					that.$message({
						type: 'success',
						message: '最后一夜'
					})
				}
			},
			pre() {
				var that = this

				if (that.indexDy > 0) {
					that.indexDy--
				} else {
					that.$message({
						type: 'success',
						message: '第一页'
					})
				}
			},
			back() {
				// 因该是返回上一页
				// this.$route.go(-1)
				this.$router.push({name: 'comNumPreview'})
			}
		}
	}
</script>
<style lang="scss">
	.jobInfo-container {
		background: #fff;
		min-width: 900px;

		padding: 0 20px 62px;

		.el-dialog {
			.el-dialog__header {
				padding: 0;
			}

			.el-dialog__body {
				padding: 0;

				.priewed-header {
					height: 318px;
					overflow: hidden;
					position: relative;
					background: url('../image/comhonor/Group.png') no-repeat center 0%;

					.priewed-title {
						position: absolute;
						right: 20px;
						top: 20px;
					}

					.left-one {
						position: absolute;
						left: 69px;
						top: 140px;

						img {
							display: inline-block;
							width: 56px;
							height: 56px;
							background: url('../image/comhonor/Oval4.png') no-repeat;

						}

						span {
							margin-top: 2px;
							text-align: center;
							display: block;
							font-size: 18px;
							font-weight: bold;
							color: #fff;
						}
					}

					.middle-one {
						position: absolute;
						left: 179px;
						top: 99px;

						img {
							display: inline-block;
							width: 76px;
							height: 76px;
							background: url('../image/comhonor/Oval3.png') no-repeat;
						}

						span {
							margin-top: 3px;
							display: block;
							font-size: 18px;
							font-weight: bold;
							color: #fff;
							text-align: center;
						}
					}

					.right-one {
						position: absolute;
						left: 309px;
						top: 147px;

						img {
							display: inline-block;
							width: 56px;
							height: 56px;
							background: url('../image/comhonor/Oval2.png') no-repeat;

						}

						span {
							margin-top: 2px;
							display: block;
							font-size: 18px;
							font-weight: bold;
							color: #fff;

						}
					}

					.leftInfo-one, .middleInfo-one, .rightInfo-one {
						position: absolute;
						display: inline-block;

						span {
							display: block;
							text-align: center;
							color: #fff;
						}
					}

					.leftInfo-one {
						top: 263px;
						left: 43px;

						span {
							font-size: 10px;
						}
					}

					.middleInfo-one {
						top: 252px;
						left: 161px;

						span:first-child {
							font-size: 14px;
						}

						span:last-child {
							font-size: 16px;
						}
					}

					.rightInfo-one {
						top: 271px;
						left: 303px;

						span {
							font-size: 10px;
						}
					}
				}

				.priewed-body {
					padding: 0 49px;
					overflow-y: scroll;
					max-height: 313px;

					&::-webkit-scrollbar {
						width: 10px;
						height: 14px;
						min-height: 20px;

					}

					&::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
						width: 10px;
						border-radius: 5px;
						height: 14px;

						min-height: 20px;
						background: #EDEFF2;
						scrollbar-arrow-color: red;
					}

					&::-webkit-scrollbar-track {
						border-radius: 0;
						background: rgba(0, 0, 0, 0)
					}
				}
			}

		}

		.spanactive {
			color: #303133 !important;
		}

		.comDymanicInfo-btn-box {
			width: 900px;
			margin: 0 auto;
			text-align: right;

			.el-button {
				color: #4278BE;
				font-size: 14px;
			}

			.el-button + .el-button {
				color: #4278BE;
				margin-left: 39px;
			}
		}

		header {
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			border-bottom: 1px solid #EDEFF2;
			height: 62px;
			line-height: 62px;

			.el-button:first-child {
				span {
					margin-left: 0;
				}
			}
		}

		p {
			margin-top: 20px;
			margin-bottom: 20px;
			text-indent: 30px;
		}

		.jobInfo-main {
			padding: 0 40px;
		}

		p {
			text-indent: 0;
		}

		.job-require, .job-treatment {
			& > p {
				margin: 0;
				text-align: left;
			}
		}
	}
</style>
