<template>
	<div class="comDynamic-container">
		<div class="btn-box">
			<el-button type="primary" class="export-btn" @click="hrefTo">新增动态</el-button>
		</div>
		<div class="comDynamic-table">
			<template>
				<el-table
					:header-cell-style="tableHeaderColor"
					:cell-style="setBorder"
					:data="tableData.slice(0,Math.abs(tableData.length-1))"
					style="width: 100%">
					<el-table-column
						align=center
						prop="listName"
						label="动态标题">
					</el-table-column>
					<el-table-column
						align=center
						prop="companyRelevance"
						label="缩略图"
					>
						<template slot-scope="scope">
							<div class="demo-image">
								<div class="block">
									<span class="demonstration"></span>
									<el-image
										:src="scope.row.companyRelevance[0]"
										fit="fill"></el-image>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						align=center
						prop="createTime"
						label="更新时间"
					>
					</el-table-column>
					<el-table-column
						align=center
						prop="createBy"
						label="发布人"
					>
					</el-table-column>
					<el-table-column
						align=center
						label="操作"
						width="180">
						<template slot-scope="scope">
							<div style="overflow:hidden;display:inline-block;margin:0 auto;">
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
					:current-page="currentPage1"
					:page-sizes="[1, 2, 3, 4]"

					:page-size="pagesize1"
					layout="total, sizes, prev, pager, next, jumper"
					:total="tableData[tableData.length-1]">
				</el-pagination>
			</div>
		</template>
	</div>
</template>
<script>
	import  '@/modules/common'
	export default {
		data() {
			return {
				fits: ['fill'],
				next: false,//是修改还是插入的开关
				data: {},//接受编辑的数据
				currentPage1: 1,
				pagesize1: 2,
				tableData: []
			}
		},
		created() {
			if (sessionStorage.getItem('pagesize1')) {
				this.pagesize1 = JSON.parse(sessionStorage.getItem('pagesize1'))

			}
			if (sessionStorage.getItem('currentPage1')) {
				this.currentPage1 = JSON.parse(sessionStorage.getItem('currentPage1'))

			}
			this.getDataTable()

		},

		methods: {
			//向后翻页
			preHandle(page) {
				console.log(page)
				this.getDataTable(this.pagesize1, page)

			},
			nextHandle(page) {
				console.log(page)
				this.getDataTable(this.pagesize1, page)

			},
			// changeVal() {
			// 	this.currentPage1 = Number(window.localStorage.getItem('currentPage1')) || 1
			// 	this.pagesize1 = Number(window.localStorage.getItem('pagesize1')) || 2
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
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.getDataTable(val, 1)
			},
			handleCurrentChange(val) {
				this.getDataTable(this.pagesize1, val)
			},
			// 选择重新改写还是添加

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
			delet(index, data) {
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/deleteList',
					params: {
						id:data.id
						// companyId:'1'
					},
				}).then(res => {
					console.log(res)
					if (res.data.code === 200 && res.status === 200) {
						const p = this.tableData.length-1
						if(p==1&&this.currentPage1>1){
							this.currentPage1=this.currentPage1-1
						}
						if(p==1&&this.currentPage1==1){
							// this.$message('没有数据了')
						}
						this.getDataTable(this.pagesize1,this.currentPage1)
					}
				})
				//=====重新加载页面就可以，重新渲染
				// this.$router.push({name:'comNumPrductList'})
				// const p = this.tableData.length / this.pagesize
				// if (this.currentPage > 1) {
				// 	if (p < this.currentPage || p == this.currentPage && p > this.currentPage - 1) {
				//
				// 		sessionStorage.setItem('currentPage', this.currentPage);
				// 		// 请求数据
				// 	}
				// 	if (p < this.currentPage - 1 || p == this.currentPage - 1 && p > this.currentPage - 2) {
				// 		sessionStorage.setItem('currentPage', this.currentPage - 1);
				// 		// 请求数据
				// 	}
				// }
				// if (this.currentPage == 1 && this.tableData.length == 0) {
				// 	this.open3()
				// }

			},
			//获取列表信息
			getDataTable(pageSize, pageNum) {
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/queryList',
					params: {
						companyId: '12',
						tabulationType: '0',
						pageNum: pageNum || this.currentPage1,
						pageSize: pageSize || this.pagesize1
					},
				}).then(res => {

					console.log(res)
					if (res.data.code === 200 && res.status === 200) {
						this.tableData = []
						for (var i = 0; i < res.data.data.list.length; i++) {
							this.tableData[i] = {}
							this.tableData[i].id = JSON.parse(res.data.data.list[i].id)
							this.tableData[i].createBy = JSON.parse(res.data.data.list[i].createBy)
							this.tableData[i].createTime = new Date(JSON.parse(res.data.data.list[i].createTime)).Format('yyyy-MM-dd hh:mm')

							this.tableData[i].listName = JSON.parse(res.data.data.list[i].listName)
							this.tableData[i].content = JSON.parse(res.data.data.list[i].content)
							this.tableData[i].companyRelevance = {}
							this.tableData[i].companyRelevance = JSON.parse(res.data.data.list[i].companyRelevance.thumb)
						}

						this.tableData[res.data.data.list.length] = JSON.parse(res.data.data.total)

						this.tableData = JSON.parse(JSON.stringify(this.tableData))
						this.pagesize1 = pageSize || this.pagesize1;
						this.currentPage1 = pageNum || this.currentPage1;

						sessionStorage.setItem('pagesize1', this.pagesize1);
						sessionStorage.setItem('currentPage1', this.currentPage1);

						console.log(this.tableData)
					}

				})
			},
			//编辑功能
			edit(index, data) {
				this.$router.push({name: 'comDynamicEdit', query: {id:index+1,data:JSON.stringify(data)}})

			},
			// 跳转
			hrefTo() {
				this.$router.push({name: 'comDynamicEdit',query:{length:this.tableData.length-1,total: this.tableData[this.tableData.length - 1]}})
			},
		}
	}
</script>
<style lang="scss">
	.comDynamic-container {
		font-family: 'Microsoft YaHei UI';
		overflow: hidden;
		background: #fff;
		height: 715px;
		padding: 20px 21px 20px 19px;

		.btn-box {
			text-align: right;

			.export-btn {
				width: 168px;
				color: #fff;
				height: 40px;
				border-radius: 3px;
				background: #4278BE;
				margin-right: 0;
			}
		}

		.comDynamic-table {
			margin-top: 22px;

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
			text-align: right;

			.el-pagination {
				margin-top: 16px;
				color: #8D9193;
				height: 24px;
				line-height: 24px;
				padding: 2px;

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

		}

		.demo-image {
			height: 90px;

			.el-image {
				height: 90px;
				line-height: 90px;
				padding-top: 6px;
				img {
					width: 138px;
					height: 78px;
				}
			}
		}

	}

</style>
