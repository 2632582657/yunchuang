<template>
	<div class="comNumJobList-container">
		<div class="btn-box">
			<el-button type="primary" class="export-btn" @click="hrefTo">新增招聘职位</el-button>
		</div>
		<div class="comNumJobList-table">
			<template>
				<el-table
					:header-cell-style="tableHeaderColor"
					:cell-style="setBorder"
					:data="tableData.slice(0,Math.abs(tableData.length-1))"
					style="width: 100%">
					<el-table-column
						align=center
						prop="jobName"
						label="职位名称">
					</el-table-column>
					<el-table-column
						align=center
						prop="employ"
						label="招聘人数"
					>
					</el-table-column>
					<el-table-column
						align=center
						prop="region"
						label="工作地址"
					>
					</el-table-column>
					<el-table-column
						align=center
						prop="jobPayName"
						label="职位薪资">
					</el-table-column>
					<el-table-column
						align=center
						prop="jobStatus"
						label="职位状态"
					>
						<template slot-scope="scope">
								<span v-if="scope.row.jobStatus!==1">
									在招
								</span>
							<span v-else style="color:#909399;">
									已下线
								</span>
						</template>
					</el-table-column>
					<el-table-column
						align=center
						prop="createTime"
						label="最后操作时间"
					>
					</el-table-column>
					<el-table-column
						align=center
						label="操作"
						width="180"
					>
						<template slot-scope="scope">
							<div style="overflow:hidden;display:inline-block;margin:0 auto;">
								<template v-if="scope.row.jobStatus!==1">
									<el-button type="text" @click="toggolFlag(scope.$index, scope.row)"
											   style="float:left;font-size:14px;color:#2AA1E1;margin-right:20px;">
										操作下线
									</el-button>
								</template>
								<template v-else>
									<el-button type="text" @click="onlinelFlag(scope.$index, scope.row)"
											   style="float:left;font-size:14px;color:#2AA1E1;margin-right:20px;">
										操作上线
									</el-button>
								</template>
								<el-button type="text" @click="edit( scope.$index, scope.row)"
										   style="float:left;font-size:14px;color:#2AA1E1;margin-right:20px;">
									编辑
								</el-button>
								<el-button type="text" @click="open(scope.$index, scope.row)"
										   style="float:left;font-size:14px;color:#FF6565;">
									删除
								</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<template>
			<div class="block report-page">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					@prev-click="preHandle"
					@next-click="nextHandle"
					:current-page="currentPage3"
					:page-sizes="[1, 2, 3, 4]"
					:page-size="pagesize3"
					layout="total, sizes, prev, pager, next, jumper"
					:total="tableData[tableData.length-1]">
				</el-pagination>
			</div>
		</template>
	</div>
</template>
<script>
	import '@/modules/common'

	export default {
		data() {
			return {
				// formList: [],//临时储存所有列表信息
				jobStatusflag: true,//修改上线状态联动的职位状态
				onlineFlag: true,//修改的状态开关
				next: false,//是修改还是插入的开关
				data: {},//接受编辑的数据
				page: {},//方便本地存储
				currentPage3: 1,
				pagesize3: 2,
				tableData: []
			}
		},
		created() {
			if (sessionStorage.getItem('pagesize3')) {
				this.pagesize3 = JSON.parse(sessionStorage.getItem('pagesize3'))
			}
			if (sessionStorage.getItem('currentPage3')) {
				this.currentPage3 = JSON.parse(sessionStorage.getItem('currentPage3'))
			}
			this.getDataTable()
		},
		methods: {
			//向后翻页
			preHandle(page) {
				console.log(page)
				this.getDataTable(this.pagesize3, page)
			},
			nextHandle(page) {
				console.log(page)
				this.getDataTable(this.pagesize3, page)
			},
			//获取列表信息
			getDataTable(pageSize, pageNum) {
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/queryJob',
					params: {
						companyId: '1',
						pageNum: pageNum || this.currentPage3,
						pageSize: pageSize || this.pagesize3
					},
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				}).then(res => {

					console.log(res)
					if (res.data.code === 200 && res.status === 200) {
						this.tableData = []
						for (var i = 0; i < res.data.data.list.length; i++) {
							this.tableData[i] = {}
							this.tableData[i].id = JSON.parse(res.data.data.list[i].id)
							this.tableData[i].createBy = JSON.parse(res.data.data.list[i].createBy)
							this.tableData[i].createTime = new Date(JSON.parse(res.data.data.list[i].createTime)).Format('yyyy-MM-dd hh:mm')
							this.tableData[i].jobName = JSON.parse(res.data.data.list[i].jobName)
							this.tableData[i].content1 = JSON.parse(res.data.data.list[i].workSummarize)
							this.tableData[i].content2 = JSON.parse(res.data.data.list[i].jobRequire)
							this.tableData[i].content3 = JSON.parse(res.data.data.list[i].socialBenefits)
							this.tableData[i].region = JSON.parse(res.data.data.list[i].workAddress)
							this.tableData[i].jobStatus = JSON.parse(res.data.data.list[i].jobStatus)
							this.tableData[i].educationRequireName = res.data.data.list[i].educationRequireName
							this.tableData[i].workExperienceName = res.data.data.list[i].workExperienceName
							this.tableData[i].employ = JSON.parse(res.data.data.list[i].employ)
							this.tableData[i].jobPayName = res.data.data.list[i].jobPayName

						}

						this.tableData[res.data.data.list.length] = JSON.parse(res.data.data.total)

						this.tableData = JSON.parse(JSON.stringify(this.tableData))
						this.pagesize3 = pageSize || this.pagesize3;
						this.currentPage3 = pageNum || this.currentPage3;

						sessionStorage.setItem('pagesize3', this.pagesize3);
						sessionStorage.setItem('currentPage3', this.currentPage3);

					}

				})
			},
			// 调整职位上线状态
			toggolFlag(i, item) {
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/changeJob',
					params: {
						id: item.id,
						jobStatus: 1
					},
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				}).then(res => {
					if (res.data.code === 200 && res.status === 200) {
						this.getDataTable(this.pagesize3, this.currentPage3)
					}
				})
				this.onlineFlag = false
			},
			onlinelFlag(i, item) {
				// this.jobStatusflag = true
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/changeJob',
					params: {
						id: item.id,
						jobStatus: 0
					},
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				}).then(res => {
					if (res.data.code === 200 && res.status === 200) {
						this.getDataTable(this.pagesize3, this.currentPage3)
					}
				})
				this.onlineFlag = true
			},

			// 选择重新改写还是添加
			// getData() {
			// 	if (this.$route.query.id) {
			// 		this.data = this.$route.query
			// 		this.tableData.some((item, index) => {
			// 			if (item.id == this.data.id) {
			// 				this.next = true
			// 				return this.tableData.splice(index, 1, this.data)
			// 			}
			// 		})
			// 		if (!this.next) {
			// 			this.tableData.push(this.data)
			// 		}
			// 	}
			// },
			// changeVal() {
			// 	this.currentPage3 = Number(window.localStorage.getItem('currentPage3')) || 1
			// 	this.pagesize3 = Number(window.localStorage.getItem('pagesize3')) || 2
			// },
			tableHeaderColor({row, column, rowIndex, columnIndex}) {
				if (rowIndex === 0) {
					return 'background-color: #fff;height:45px;'
				}
			},
			setBorder({row, column, rowIndex, columnIndex}) {
				if (rowIndex % 2 == 0) {
					return 'background:#F6F6FA;'

				}
			},
			//这是删除按钮提示
			open(index, data) {
				this.$confirm('确定删除该制度数据吗？', '', {
					cancelButtonText: '取消',
					confirmButtonText: '确定',
					type: ''
				}).then(() => {
					this.delet(index, data)

					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			// 提示表格删除没了
			open3() {
				this.$message({
					message: '没有可以删除的消息了',
					type: 'warning'
				});
			},
			//删除功能，传参数id和对应页面名
			delet(index, data) {
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/deleteJob',
					params: {
						id: data.id
					},
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				}).then(res => {
					if (res.data.code === 200 && res.status === 200) {
						const p = this.tableData.length - 1
						if (p == 1 && this.currentPage3 > 1) {
							this.currentPage3 = this.currentPage3 - 1
						}
						if (p == 1 && this.currentPage3 == 1) {
							// this.$message('没有数据了')
						}
						this.getDataTable(this.pagesize3, this.currentPage3)
					}
				})
				// =====重新加载页面就可以，重新渲染
				// this.$router.push({name:'comNumPrductList'})

			},

			//编辑功能
			edit(index, data) {

				this.$router.push({name: 'jobEdit', query: {id: index + 1, data: JSON.stringify(data)}})

			},
			// 跳转
			hrefTo() {
				this.$router.push({name: 'jobEdit', query: {length: this.tableData.length - 1,total: this.tableData[this.tableData.length - 1]}})
			},
			//pageSize 改变时会触发
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.getDataTable(val, 1)

			},
			//currentPage3 改变时会触发
			handleCurrentChange(val) {
				this.getDataTable(this.pagesize3, val)
				// console.log(`当前页: ${val}`);
			}
		}
	}
</script>
<style lang="scss">
	.comNumJobList-container {
		font-family: 'Microsoft YaHei UI';
		overflow: hidden;
		background: #fff;
		height: 715px;
		padding: 20px 21px 46px 20px;

		.el-pagination {
			color: #8D9193;
			height: 24px;
			line-height: 24px;
			padding: 2px;
			text-align: right;

			.btn-prev, .btn-next, .number {
				box-sizing: border-box;
				background: #fff;
				color: #8D9193;
				border: 1px solid #C9C9C9;
				height: 20px;
				line-height: 20px;
				padding: 0;
				color: #8D9193;
				margin: 0 5px;
				width: 20px;
				min-width: 20px;
				border-radius: 3px;
			}

			&.is-background .el-pager li:not(.disabled):hover {
				color: #8D9193;
			}

			.el-pagination__total {
				color: #8D9193;

			}

			.el-pager li.active {
				background: #4278BE;
				border: none;
				color: #fff;
				line-height: 22px;

			}

			.el-input .el-input__inner {
				height: 20px;
				line-height: 20px;
				color: #8D9193;
			}

			.el-pagination__jump {
				margin-left: 16px;
				color: #8D9193;
			}

			.el-pager {

			}
		}

		.el-pagination__sizes {
			margin-right: 0;
		}

		.el-pagination button, .el-pagination span:not([class*=suffix]), .el-pager li, .el-select .el-input .el-select__caret {
			height: 20px;
			line-height: 20px;
		}

		.demo-image {
			height: 90px;

			.el-image {
				height: 90px;
				line-height: 90px;
				padding-top: 6px;

				img {
					width: 106px;
					height: 78px;
				}
			}
		}

		.btn-box {
			text-align: right;

			.export-btn {
				width: 167px;
				color: #fff;
				height: 40px;
				border-radius: 3px;
				background: #4278BE;
				margin-right: 0;
			}
		}

		.comNumJobList-table {
			margin-top: 21px;

			.el-table {
				border: 1px solid #D8D8D8;

				tbody {
					overflow-y: scroll;
					max-height: 720px;

				}

				th {
					height: 45px;
					line-height: 45px;
					padding: 0;
					color: #303133;
					font-size: 16px;
				}

				td {
					overflow: hidden;
					height: 90px;
					line-height: 90px;
					padding: 0;
					padding-bottom: 0;
				}

				.el-button {
					margin: 0;
					display: inline-block;
				}

			}
		}

		.report-page {
			width: 100%;
			height: 50%;
			display: block;
			text-align: center;

			.el-pagination {
				margin-top: 16px;
			}

		}

	}

</style>
