<template>

	<div class="comHonorList-container">
		<div class="btn-box">
			<router-link to="/newHonorList">
				<el-button type="primary" class="addHonor">新建荣誉榜</el-button>
			</router-link>
		</div>
		<div class="comHonorList-table">
			<template>
				<el-table
					:header-cell-style="tableHeaderColor"
					:cell-style="setBorder"
					:data="tableData.slice(0,Math.abs(tableData.length-1))"
					style="width: 100%">
					<el-table-column
						align=center
						prop="listName"
						label="荣誉榜标题"
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
						prop="createTime"
						label="发布时间"
					>
					</el-table-column>
					<el-table-column
						align=center
						prop="num"
						label="上榜人数"
					>
					</el-table-column>
					<el-table-column
						align=center
						label="是否显示"
					>
						<template slot-scope="scope">
							<div style="overflow:hidden;display:inline-block;margin:0 auto;">
								<div>
									<el-button type="text" @click="hideHonorInfo(scope.$index, scope.row)"
											   style="float:left;font-size:14px;color:#2AA1E1;"
											   v-if="scope.showHonorFlag">
										显示
									</el-button>
									<el-button type="text" @click="showHonorInfo(scope.$index, scope.row)"
											   style="float:left;font-size:14px;color:#2AA1E1;" v-else>
										隐藏
									</el-button>

								</div>

							</div>

						</template>
					</el-table-column>
					<el-table-column
						align=center
						label="操作"
					>
						<template slot-scope="scope">
							<div style="overflow:hidden;display:inline-block;margin:0 auto;">
								<el-button type="text" @click="priew( scope.$index, scope.row)"
										   style="float:left;font-size:14px;color:#2AA1E1;margin-right:20px;">
									预览
								</el-button>
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
			<el-dialog title="设置" :visible.sync="dialogVisible" width="379px">
				<el-form ref="form" :model="form" label-width="80px">
					<el-form-item>
						<div>{{text}}</div>
						<el-radio-group v-model="form.showHonorFlag">
							<el-radio label="显示"></el-radio>
							<el-radio label="隐藏"></el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
						<el-button type="primary" @click="saveStaus">保存</el-button>
					</span>
			</el-dialog>
		</template>
		<template>
			<div class="block report-page">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					@prev-click="preHandle"
					@next-click="nextHandle"
					:current-page="currentPageHor"
					:page-sizes="[1, 2, 3, 4]"
					:page-size="pagesizeHor"
					layout="total, sizes, prev, pager, next, jumper"
					:total="tableData[tableData.length-1]">
				</el-pagination>
			</div>
		</template>
		<div>
<!--			<div class="pre-model">-->
<!--				<el-dialog width="482px" :visible.sync="priewModuleFlag">-->
<!--					<div class="priewed-header">-->
<!--					<span class="priewed-title" @click.stop="()=>{priewModuleFlag=false}"><img-->
<!--						src="../image/comhonor/quxiao.png"></span>-->
<!--						<div class="left-one">-->
<!--							<img src="" alt="">-->
<!--							<span>{{tableDataHor[0].name}}</span>-->
<!--						</div>-->
<!--						<div class="middle-one">-->
<!--							<img src="" alt="">-->
<!--							<span>{{tableDataHor[1].name}}</span>-->
<!--						</div>-->
<!--						<div class="right-one">-->
<!--							<img src="" alt="">-->
<!--							<span>{{tableDataHor[2].name}}</span>-->
<!--						</div>-->
<!--						<div class="leftInfo-one">-->
<!--							<span>{{tableDataHor[0].position}}</span>-->
<!--							<span>{{tableDataHor[0].input}}</span>-->
<!--						</div>-->
<!--						<div class="middleInfo-one">-->
<!--							<span>{{tableDataHor[1].position}}</span>-->
<!--							<span>{{tableDataHor[1].input}}</span>-->
<!--						</div>-->
<!--						<div class="rightInfo-one">-->
<!--							<span>{{tableDataHor[2].position}}</span>-->
<!--							<span>{{tableDataHor[2].input}}</span>-->
<!--						</div>-->
<!--					</div>-->
<!--					<div class="priewed-body">-->
<!--						<template v-for="(item,index) in tableDataHor.slice(3,tableDataHor.length)">-->
<!--							<div class="honorImg">-->
<!--								<span>{{index+1}}.</span>-->
<!--								<img src="" alt="">-->
<!--								<div class="honorInfo">-->
<!--									<span>{{item.name}}</span>-->
<!--									<span>{{item.position}}</span>-->
<!--								</div>-->
<!--								<span class="selfTitle">{{item.input}}</span>-->
<!--							</div>-->
<!--						</template>-->
<!--					</div>-->
<!--				</el-dialog>-->
<!--			</div>-->

		</div>
	</div>
</template>
<script>
	import '@/modules/common'

	export default {
		data() {
			return {
				tableDataHor:[],//接收荣誉榜信息
				priewModuleFlag: false,//预览弹窗开关
				text: '文本',//显示弹框中的标题
				dialogVisible: false,//消息弹窗
				form: {
					showHonorFlag: '',
				},
				fits: ['fill'],
				next: false,//是修改还是插入的开关
				data: {},//接受编辑的数据
				page: {},//方便本地存储
				currentPageHor: 1,
				pagesizeHor: 2,
				// currentPageHor4: 4,
				// currentPageHor:1,//要前往的页数
				tableData: [
					{
						id: 1,
						createBy: '1',
						num: 54,
						createTime: 12645464651,
						listName: '6月份荣誉',
						showHonorFlag: false
					},
					{
						id: 2,
						createBy: '1',
						num: 54,
						createTime: 12645464651,
						listName: '6月份荣誉',
						showHonorFlag: false
					},
					{
						id: 3,
						createBy: '1',
						num: 54,
						createTime: 12645464651,
						listName: '6月份荣誉',
						showHonorFlag: false
					},
					{
						id: 4,
						createBy: '1',
						num: 54,
						createTime: 12645464651,
						listName: '6月份荣誉',
						showHonorFlag: false
					},
					{
						id: 5,
						createBy: '1',
						num: 54,
						createTime: 12645464651,
						listName: '6月份荣誉',
						showHonorFlag: false
					},
				]
			}
		},
		created() {
			// this.changeVal()
			if (sessionStorage.getItem('pagesizeHor')) {
				this.pagesizeHor = JSON.parse(sessionStorage.getItem('pagesizeHor'))

			}
			if (sessionStorage.getItem('currentPageHor')) {
				this.currentPageHor = JSON.parse(sessionStorage.getItem('currentPageHor'))

			}
			this.getDataTable()


			// this.getData()
		},
		methods: {
			//向后翻页
			preHandle(page) {
				console.log(page)
				this.getDataTable(this.pagesizeHor, page)

			},
			nextHandle(page) {
				console.log(page)
				this.getDataTable(this.pagesizeHor, page)

			},
			//获取列表信息
			getDataTable(pageSize, pageNum) {
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/queryList',
					params: {
						companyId: '20',
						tabulationType: '1',
						pageNum: pageNum || this.currentPageHor,
						pageSize: pageSize || this.pagesizeHor
					},
				}).then(res => {

					console.log(res)
					if (res.data.code === 200 && res.status === 200) {
						this.tableData = []
						for (var i = 0; i < res.data.data.list.length; i++) {
							this.tableData[i] = {}
							this.tableData[i].id = JSON.parse(res.data.data.list[i].id)
							this.tableData[i].createBy = JSON.parse(res.data.data.list[i].createBy)
							this.tableData[i].num = JSON.parse(res.data.data.list[i].num)//上榜人数
							this.tableData[i].createTime = new Date(JSON.parse(res.data.data.list[i].createTime)).Format('yyyy-MM-dd hh:mm')
							this.tableData[i].listName = JSON.parse(res.data.data.list[i].listName)
							this.tableData[i].content = JSON.parse(res.data.data.list[i].content)
						}

						this.tableData[res.data.data.list.length] = JSON.parse(res.data.data.total)

						this.tableData = JSON.parse(JSON.stringify(this.tableData))
						this.pagesizeHor = pageSize || this.pagesizeHor;
						this.currentPageHor = pageNum || this.currentPageHor;

						sessionStorage.setItem('pagesizeHor', this.pagesizeHor);
						sessionStorage.setItem('currentPageHor', this.currentPageHor);

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

			//切换展示的处理方法
			showHonorInfo(index, item) {
				this.dialogVisible = true
				this.text = item.listName
				// console.log(index)
				// console.log(item)
			},
			hideHonorInfo(index, item) {
				this.dialogVisible = true

				this.text = item.listName
				//
				// console.log(index)
				// console.log(item)
			},
			saveStaus() {
				this.dialogVisible = false

			},
			// changeVal() {
			// 	this.currentPageHor = Number(window.sessionStorage.getItem('currentPageHor')) || 1
			// 	this.pagesizeHor = Number(window.sessionStorage.getItem('pagesizeHor')) || 2
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
				console.log(index)
				console.log(data)
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/deleteList',
					params: {
						id: data.id
						// companyId:'1'
					},
				}).then(res => {
					console.log(res)
					if (res.data.code === 200 && res.data.sysCode === 200) {
						const p = this.tableData.length - 1
						if (p == 1 && this.currentPageHor > 1) {
							this.currentPageHor = this.currentPageHor - 1
						}
						if (p == 1 && this.currentPageHor == 1) {
							this.$message('没有数据了')
						}
						this.getDataTable(this.pagesizeHor, this.currentPageHor)
					}
				})
				// =====重新加载页面就可以，重新渲染
				// this.$router.push({name:'comHonorList'})

			},

			//编辑功能
			edit(index, data) {
				// this.data = this.tableData[index]
				this.$router.push({name: 'newHonorList', query: {id: index, data: JSON.stringify(data)}})
			},
			//预览
			priew() {
				this.priewModuleFlag = true
			},
			// 跳转
			hrefTo() {
				this.$router.push({name: 'comNumEditPrduct'})
			},
			//pageSize 改变时会触发
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.getDataTable(val, 1)

			},
			//currentPageHor 改变时会触发
			handleCurrentChange(val) {
				this.getDataTable(this.pagesizeHor, val)
				// console.log(`当前页: ${val}`);
			}
		}
	}
</script>
<style lang="scss">
	.comHonorList-container {
		font-family: 'Microsoft YaHei UI';
		overflow: hidden;
		min-width: 1000px;
		background: #fff;
		height: 715px;
		padding: 20px 20px 46px;

		.el-dialog {
			margin-top: 23% !important;
			border-radius: 3px;

			.el-dialog__header {
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;
				padding: 20px 20px 0 30px;
				text-align: left;
				height: 62px;
				border-bottom: 1px solid #BFC2CC;

				.el-dialog__close.el-icon.el-icon-close {
					margin-top: 10px;
					color: #909399;
					font-size: 16px;
				}

				span {
					display: block;
					height: 20px;
					color: #303133;
					font-size: 18px;
					padding-left: 10px;
					margin-top: 10px;
					border-left: 10px solid #4278BE;
				}
			}

			.el-dialog__body {
				padding-bottom: 8px;

				.el-form-item {
					.el-form-item__content {
						line-height: 1;
						margin-left: 10px !important;

						& > div {
							margin: 10px 0;
						}

					}
				}
			}

			.el-dialog__footer {
				padding: 0 30px 30px 0;

				.el-button--primary {
					width: 109px;
					height: 40px;
					background-color: #4278BE;
					border-radius: 3px;
					color: #fff;
				}
			}
		}

		.pre-model {
			.el-dialog {
				padding: 0;

				.el-dialog__header {
					padding: 0;
					height: 0;
					border:none;
					.el-dialog__title {
						border:none;
						height: 0;
					}
				}

				.el-dialog__body {
					padding: 0;

					.priewed-header {
						padding: 0;
						margin: 0;
						float: left;
						width: 482px;
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
							left: 92px;
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
								font-size: 16px;
								font-weight: bold;
								color: #fff;
							}
						}

						.middle-one {
							position: absolute;
							left: 202px;
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
							left: 332px;
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
								font-size: 16px;
								text-align: center;
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
							top: 266px;
							left: 63px;

							span {
								font-size: 10px;

								&:first-child {
									margin-bottom: 5px;
								}
							}
						}

						.middleInfo-one {
							top: 252px;
							left: 182px;

							span:first-child {
								font-size: 14px;
								margin-bottom: 3px;
							}

							span:last-child {
								font-size: 16px;
							}
						}

						.rightInfo-one {
							top: 271px;
							left: 350px;

							span {
								font-size: 10px;

								&:first-child {
									margin-bottom: 5px;
								}
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
		}

		.el-pagination {
			color: #8D9193;
			height: 24px;
			line-height: 24px;
			padding: 2px;

			.btn-prev, .btn-next, .number {
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
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

		.block {
		}

		.btn-box {
			text-align: right;

			.addHonor {
				width: 168px;
				color: #fff;
				height: 40px;
				border-radius: 3px;
				background: #4278BE;
				margin-right: 0;
			}
		}

		.comHonorList-table {
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
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
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
