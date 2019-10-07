<template>
	<div id="job-list-container" class="comNumPreview"
		 style="position:relative;background:#fff;padding-top:122px;overflow-y:scroll;height:700px;z-index:2;min-width:900px;font-family: 'Microsoft YaHei UI';"
		 ref="containerjob">
		<div id="job-list-head" ref="headjob"
			 style="position:absolute;top:0;min-width:800px;width:100%;background:#fff;z-index:99;overflow:hidden;">
			<div class="grid-content bg-purple-light rout" style="text-align:left;padding:0 19px;" id="apply2"
				 ref="applyjob">
				<div @click="()=> {$router.push({name:'comNumPreview'})}">
					基本信息
				</div>
				<div @click="()=> {$router.push({name:'previwInfoTab'})}">
					公司动态
				</div>
				<div @click="()=> {$router.push({name:'prductInfoTab'})}">
					产品展示
				</div>
				<div class="actived" @click="()=> {$router.push({name:'jobInfoTab'})}">
					<!-- <div @click="handlbeData"> -->
					职位招聘
				</div>

			</div>
			<div class="grid-content bg-purple-dark"
				 style="height:84px;margin:0 19px;border-bottom:1px solid #EDEFF2;line-height:84px;box-sizing:border-box;">
				<img src=""
					 style="display:inline-block;width:44px;height:44px;margin-top:20px;vertical-align:top;border-radius:3px;">
				<p style="display:inline-block;font-weight:bold;margin-left:15px;color:#303133;font-size:18px;">
					青岛蓝海汇网络科技有限公司</p>
			</div>
		</div>
		<div class="job-list-info maincontentjob" id="apply1" ref="applyjob1"
			 style="padding:0 19px;height:635px;overflow-y:scroll;">
			<div>
				<template>
					<el-table
						:data="tableData"
						:row-class-name="tableRowClassName"
						style="width: 100%"
						@row-click="handleRows"
						:show-header="false"
					>
						<el-table-column
							prop="jobName"
							label="职位"
						>
						</el-table-column>
						<el-table-column
							prop="region"
							label="地点"
						>

						</el-table-column>
						<el-table-column
							prop="workExperienceName"
							label="工作经验"
						>

						</el-table-column>
						<el-table-column
							prop="educationRequireName"
							label="学历">
						</el-table-column>
						<el-table-column
							prop="jobPayName"
							label="薪资">
						</el-table-column>
						<el-table-column
							prop="day"
							label="日期"
						>
						</el-table-column>
					</el-table>
				</template>
			</div>
		</div>
	</div>
</template>
<script>
	import '@/modules/common'

	export default {
		data() {
			return {
				mainScrolljob: '',
				data: [],//接受公司号预览基本信息，
				ass: '',
				tableData: []
			};
		},
		created() {
			this.getBackInfo()
		},
		methods: {
			scrollTip() {

				if (!this.scroll) {
					this.mainScrolljob = new BScroll('.maincontentjob', {
						scrollY: true,
						click: true,
						probeType: 3,
						preventDefaultException: true,
						disableMouse: false,
						disableTouch: false
					})
				} else {
					this.mainScrolljob.refresh()
				}

			},
			tableRowClassName({row, rowIndex}) {
				//把每一行的索引放进row
				row.index = rowIndex;
			},
			//双击某一行
			handleRows(row) {
				this.$router.push({name: 'jobInfo', query: {i: row.index ,length:this.tableData.length}})
			},
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
					if (res.data.code === 200 && res.status === 200) {
						this.tableData = []
						for (var i = 0; i < res.data.data.length; i++) {
							this.tableData[i] = {}
							this.tableData[i].id = JSON.parse(res.data.data[i].id)
							this.tableData[i].createBy = JSON.parse(res.data.data[i].createBy)
							this.tableData[i].day = res.data.data[i].day.slice(0,-8)
							this.tableData[i].jobName = JSON.parse(res.data.data[i].jobName)
							this.tableData[i].content1 = JSON.parse(res.data.data[i].workSummarize)
							this.tableData[i].content2 = JSON.parse(res.data.data[i].jobRequire)
							this.tableData[i].content3 = JSON.parse(res.data.data[i].socialBenefits)
							this.tableData[i].region = JSON.parse(res.data.data[i].workAddress)
							this.tableData[i].educationRequireName = res.data.data[i].educationRequireName
							this.tableData[i].jobStatus = res.data.data[i].jobStatus
							this.tableData[i].workExperienceName = res.data.data[i].workExperienceName
							this.tableData[i].employ = JSON.parse(res.data.data[i].employ)
							this.tableData[i].jobPayName = res.data.data[i].jobPayName
						}
						this.tableData = JSON.parse(JSON.stringify(this.tableData))
					}
					console.log(this.tableData)

				})
			},
			// 可以通过solt-scope来获取每一个信息。便利的时候也可以获取相应的信息，通过路由传过去

			// 控制路由跳转及其样式

		}
	};
</script>
<style lang="scss">
	.actived {
		color: #4278BE !important;
		font-size: 18px;
		border-bottom: 5px solid #4278BE;
	}

	/*.el-tabs__header  {
      position:fixed;
      top:130px;
      left:50%;
      z-index:100;
      margin-left:20%;
      line-height:76px;
      background:#fff;
    }*/
	.el-tabs__nav-wrap {
		height: 76px;

		.el-tabs__nav-scroll {
			float: right;
		}
	}

	.photo li, .honor li {
		float: left;
		list-style: none;
		margin-left: 20px;
		border: 10px solid #eee;
	}

	.jobinfo-column {
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		padding-top: 20px;
		padding-bottom: 20px;

		p {
			color: black;
			height: 30px;
			line-height: 30px;

			&:nth-child(2) {
				span {
					background: #eee;
					margin-right: 10px;
				}
			}

			&:nth-child(3) {
				font-size: 17px;
				color: blue;
			}
		}
	}

	.el-tab-pane {
		padding: 0 30px 0 20px;
	}

	.rout {
		background: #F8F8F8;
		display: block;
		width: 100%;

		& > div {
			cursor: default;
			display: inline-block;
			height: 33px;
			width: 73px;
			color: #BFC2CC;
			font-size: 18px;
			line-height: 33px;
			margin-right: 54px;
		}
	}

	.grid-content.bg-purple-light:last-child {
		& > div {
			cursor: default;
			display: inline-block;
			height: 67px;
			line-height: 67px;
			padding: 0 10px;
		}
	}

	.comNumPreview::-webkit-scrollbar, .maincontentjob::-webkit-scrollbar {
		display: none;
	}

	.comNumPreview::-webkit-scrollbar, .maincontentjob::-webkit-scrollbar {
		width: 0 !important
	}

	.comNumPreview, .maincontentjob {
		-ms-overflow-style: none;
	}

	.comNumPreview, .maincontentjob {
		overflow: -moz-scrollbars-none;
	}

	.el-table__body-wrapper {
		border-bottom: none;
	}
</style>
