<template>
	<div class="comNumPrductList-container">
		<div class="btn-box">
			<el-button type="primary" class="export-btn" @click="hrefTo">新增产品介绍</el-button>
		</div>
		<div class="comNumPrductList-table">
			<template>
				<el-table
					:header-cell-style="tableHeaderColor"
					:cell-style="setBorder"
					:data="tableData.slice(0,Math.abs(tableData.length-1))"
					style="width: 100%">
					<el-table-column
						align=center
						prop="listName"
						label="产品名称"
					>
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
						prop="createBy"
						label="发布人"
					>
					</el-table-column>
					<el-table-column
						align=center
						prop="createTime"
						label="更新时间"
					>
					</el-table-column>
					<el-table-column
						align=center
						label="操作"
					>
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
					:current-page="currentPage"
					:page-sizes="[1, 2, 3, 4]"
					:page-size="pagesize"
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
				page: {},//方便本地存储
				currentPage: 1,
				pagesize: 2,
				currentToPage: 1,
				// currentPage4: 4,
				// currentPage:1,//要前往的页数
				tableData: []
			}
		},
		created() {
			// this.changeVal()
			if(sessionStorage.getItem('pagesize')){
				this.pagesize=JSON.parse(sessionStorage.getItem('pagesize'))
			}
			if(sessionStorage.getItem('currentPage')){
				this.currentPage=JSON.parse(sessionStorage.getItem('currentPage'))
			}
			this.getDataTable()
			// this.getData()
		},
		methods: {
			//向后翻页
			preHandle(page) {
				console.log(page)
				this.getDataTable(this.pagesize,page)
			},
			nextHandle(page) {
				console.log(page)
				this.getDataTable(this.pagesize,page)
			},
			//获取列表信息
			getDataTable(pageSize,pageNum) {
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/queryList',
					params: {
						companyId:'22',
						tabulationType:'1',
						pageNum:pageNum||this.currentPage,
						pageSize:pageSize||this.pagesize
					},
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				}).then(res => {

					console.log(res)
					if (res.data.code === 200 && res.status === 200) {
						this.tableData = []
						for(var i =0;i<res.data.data.list.length;i++){
							this.tableData[i]={}
							this.tableData[i].id = JSON.parse(res.data.data.list[i].id)
							this.tableData[i].createBy= JSON.parse(res.data.data.list[i].createBy)
							this.tableData[i].createTime= new Date(JSON.parse(res.data.data.list[i].createTime)).Format('yyyy-MM-dd hh:mm')

							this.tableData[i].listName= JSON.parse(res.data.data.list[i].listName)
							this.tableData[i].content= JSON.parse(res.data.data.list[i].content)
							this.tableData[i].companyRelevance = {}
							this.tableData[i].companyRelevance= JSON.parse(res.data.data.list[i].companyRelevance.thumb)
						}

						this.tableData[res.data.data.list.length]= JSON.parse(res.data.data.total)

						this.tableData = JSON.parse(JSON.stringify(this.tableData))
							this.pagesize = pageSize||this.pagesize;
							this.currentPage = pageNum||this.currentPage;

							sessionStorage.setItem('pagesize', this.pagesize);
							sessionStorage.setItem('currentPage', this.currentPage);

						console.log(this.tableData)
					}

				})
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
			// changeVal() {
			// 	this.currentPage = Number(window.sessionStorage.getItem('currentPage')) || 1
			// 	this.pagesize = Number(window.sessionStorage.getItem('pagesize')) || 2
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
			// 删除功能
			//
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
					url: 'v1/base/feign/company/deleteList',
					params: {
						id:data.id
						// companyId:'1'
					},
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				}).then(res => {
					if (res.data.code === 200 && res.data.sysCode === 200) {
						const p = this.tableData.length-1
						if(p==1&&this.currentPage>1){
							this.currentPage=this.currentPage-1
						}
						if(p==1&&this.currentPage==1){
							// this.$message('没有数据了')
						}
						this.getDataTable(this.pagesize,this.currentPage)
					}
				})
				// =====重新加载页面就可以，重新渲染
				// this.$router.push({name:'comNumPrductList'})

			},

			//编辑功能
			edit(index, data) {
				// this.data = this.tableData[index]
				this.$router.push({name: 'comNumEditPrduct', query: {id:index+1,data:JSON.stringify(data)}})
			},
			// 跳转
			hrefTo() {
				this.$router.push({name: 'comNumEditPrduct',query:{length:this.tableData.length-1,total: this.tableData[this.tableData.length - 1]}})
			},
			//pageSize 改变时会触发
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.getDataTable(val,1)

			},
			//currentPage 改变时会触发
			handleCurrentChange(val) {
				this.getDataTable(this.pagesize, val)
				// console.log(`当前页: ${val}`);
			}
		}
	}
</script>
<style lang="scss">
	.comNumPrductList-container {
		font-family: 'Microsoft YaHei UI';
		overflow: hidden;
		background: #fff;
		height: 715px;
		padding: 20px 20px 46px;
		.el-pagination {
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
		.block {
		}
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
		.comNumPrductList-table {
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
			}

		}

	}

	.el-message-box__btns {
		box-sizing: border-box;
		padding: 0;
		text-align: right;
		padding-right: 32px;

		button {
			color: black;
			border: none;
			height: 50px;
			background: #fff;
			border-radius: 3px;
			width: 150px;
			font-size: 14px;
			margin-top: 47px;
			&:first-child {
				border: 1px solid rgba(66, 120, 190, 1);
			}
			&:last-child {
				color: #fff;
				background: rgba(66, 120, 190, 1);
				margin-left: 28px;
			}
		}

	}


</style>
