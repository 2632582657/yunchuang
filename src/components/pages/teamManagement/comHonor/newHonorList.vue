<template>
	<div class="newHonorList-container">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="荣誉榜标题" prop="name">
				<el-input v-model="ruleForm.name" maxlength="10" placeholder="最多输入10个字"></el-input>
			</el-form-item>
			<el-form-item label="是否置顶" prop="type">
				<el-checkbox v-model="ruleForm.type" label="设为唯一置顶" name="type"></el-checkbox>
			</el-form-item>
			<el-form-item label="是否显示" prop="resource">
				<el-radio-group v-model="ruleForm.resource">
					<el-radio label="显示">(全员可见)</el-radio>
					<el-radio label="隐藏"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="荣誉榜单" prop="region">
				<div class="honorShowList">
					<template v-for="(item,index) in tableData.slice(0,3)">
						<div class="honorImg">
							<span class="orderNum">{{index+1}}</span>
							<img src="" alt="">
							<div class="honorInfo">
								<span>{{item.name}}</span>
								<span>{{item.position}}</span>
							</div>
							<span class="selfTitle">{{item.input}}</span>
						</div>
					</template>
					<template v-for="(item,index) in tableData.slice(3,tableData.length)">
						<div class="honorImg">
							<span class="orderNum">{{index+4}}</span>
							<div class="honorInfoTwo">
								<span>{{item.name}}</span>
								<span>{{item.position}}</span>
							</div>
							<span class="selfTitle">{{item.input}}</span>
						</div>
					</template>
				</div>
				<div class="choiceShowPerson">
					<h1>选择登榜人员</h1>
					<template>
						<el-table
							:data="tableData"
							style="width:547px"
							:header-cell-style="tableHeaderColor"
							:cell-style="setBorder"
							:row-class-name="rowClass">
							<el-table-column
								label="排行"
								align="center"
							>
								<template slot-scope="scope">
									<div>
										<span>{{scope.$index+1}}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column
								label="人员信息"
								align="center"
							>
								<template slot-scope="scope">
									<div>
										<span v-if="scope.row.name.trim()==''"
											  style="color:#2AA1E1;font-size:14px;cursor:default;"
											  @click.stop="choicePerson">选择人员</span>
										<span v-else>{{scope.row.name}}-{{scope.row.position}}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column
								label="自定义荣誉榜"
								align="center"
							>
								<template slot-scope="scope">
									<div>
										<el-input v-model="scope.row.input" placeholder="最多输入8个字"></el-input>
									</div>
								</template>
							</el-table-column>
							<el-table-column
								align=center
								label="操作"
							>
								<template slot-scope="scope">
									<div style="overflow:hidden;display:inline-block;margin:0 auto;">
										<el-button type="text" @click="open(scope.$index, scope.row)"
												   style="float:left;font-size:14px;color:#FF6565;">
											删除
										</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</template>
					<div style="margin-top: -10px;">
						<div class="honorBtnBox" @click.stop="addHonorList">
							<span class="el-icon-circle-plus-outline"></span>
							<el-button type="text">文字按钮</el-button>
						</div>
					</div>
				</div>
			</el-form-item>
			<el-form-item>
				<div class="newHonorList-btn">
					<el-button @click="priewForm('ruleForm')" :class="{'activehor':priewFlag}">预览</el-button>
					<el-button @click="submitForm('ruleForm')" :class="{'activehor':subFlag}">发布</el-button>
				</div>
			</el-form-item>
		</el-form>
		<persondialog :dialogVisible="dialogFlag" @handlePsrsonSubmit="handlePsrsonSubmit"
					  @handlePersonClose="handlePersonClose"></persondialog>
		<el-dialog width="482px" :visible.sync="priewModuleFlag">
			<div class="priewed-header">
				<img src="" alt="">
				<span class="priewed-title" @click.stop="()=>{priewModuleFlag=false}"><img
					src="../image/comhonor/quxiao.png"></span>
				<div class="left-one">
					<img src="" alt="">
					<span>{{tableData[0].name}}</span>
				</div>
				<div class="middle-one">
					<img src="" alt="">
					<span>{{tableData[1].name}}</span>
				</div>
				<div class="right-one">
					<img src="" alt="">
					<span>{{tableData[2].name}}</span>
				</div>
				<div class="leftInfo-one">
					<span>{{tableData[0].position}}</span>
					<span>{{tableData[0].input}}</span>
				</div>
				<div class="middleInfo-one">
					<span>{{tableData[1].position}}</span>
					<span>{{tableData[1].input}}</span>
				</div>
				<div class="rightInfo-one">
					<span>{{tableData[2].position}}</span>
					<span>{{tableData[2].input}}</span>
				</div>
			</div>
			<div class="priewed-body">
				<template v-for="(item,index) in tableData.slice(3,tableData.length)">
					<div class="honorImg">
						<span>{{index+1}}.</span>
						<img src="" alt="">
						<div class="honorInfo">
							<span>{{item.name}}</span>
							<span>{{item.position}}</span>
						</div>
						<span class="selfTitle">{{item.input}}</span>
					</div>
				</template>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import persondialog from '../../../commons/persondialog'

	export default {
		data() {
			return {
				priewModuleFlag: false,//预览弹窗开关
				dialogFlag: false,//调用选择人员弹窗的开关
				subFlag: false,//按钮样式改变的开关
				priewFlag: false,
				routData: {},//用来接收提交的整体对象
				ruleForm: {
					name: '',//标题
					type: '',//设置唯一指定
					resource: '显示',//是否显示
					region: [],//榜单信息

				},
				rules: {
					name: [
						{required: true, message: '请输入荣誉榜标题', trigger: 'blur'},
						{min: 0, max: 10, message: '长度在 10个字符以内', trigger: 'blur'}
					],
					region: [
						{message: '请选择登榜人员', trigger: 'change'}
					],

					type: [
						{message: '请至少选择一个活动性质', trigger: 'change'}
					],
					resource: [
						{message: '请选择是否显示', trigger: 'change'}
					]
				},
				tableData: [{
					position: '销售经理',
					avatarUrl: '',//存储头像
					name: '王小虎',
					input: '自定义荣誉名称',
				}, {
					position: '销售经理',
					avatarUrl: '',
					name: '王小虎',
					input: '自定义荣誉名称',
				}, {
					position: '销售经理',
					avatarUrl: '',
					name: '王小虎',
					input: '自定义荣誉名称',
				}]
			}
		},
		components: {
			persondialog
		},
		methods: {
			//增加荣誉榜栏
			addHonorList() {
				const children = {position: '销售经理', avatarUrl: '', name: '', input: '自定义荣誉名称'}
				this.tableData.push(children)
			},
			//预防input不能输入的问题
			// change() {
			// 	this.$forceUpdate()
			// },
			//发布
			submitForm(formName) {
				this.subFlag = true
				this.priewFlag = false
				this.$refs[formName].validate((valid) => {
					if (valid) {
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
								//	======把 tabelData 中的信息提交上去
							}
						})
					} else {
						this.$message('error submit!!');
						return false;
					}
				});
			},
			// 预览
			priewForm() {
				this.subFlag = false
				this.priewFlag = true
				this.priewModuleFlag = true
				console.log(this.ruleForm)

			},
			choicePerson() {
				this.dialogFlag = true

			},
			handlePersonClose() {
				this.dialogFlag = false
			},
			handlePsrsonSubmit(node) {
				this.dialogFlag = false
				console.log(node)
				//	=====通过节点获取的信息，用来接收。并添加进入tabeldata信息中、

			},
			//更改表格样式
			tableHeaderColor({row, column, rowIndex, columnIndex}) {
				if (rowIndex === 0) {
					return 'background-color:#F6F6FA;;height:45px;color:#303133;font-size:16px;'
				}
			},
			setBorder({row, column, rowIndex, columnIndex}) {
				if (rowIndex % 2 == 1) {
					return 'background:#F6F6FA;'

				}
			},
			rowClass({row, rowIndex}) {
				if (rowIndex > 0) {
					return 'height:45px'

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
						// const p = this.tableData.length-1
						// if(p==1&&this.currentPage>1){
						// 	this.currentPage=this.currentPage-1
						// }
						// if(p==1&&this.currentPage==1){
						// 	this.$message('没有数据了')
						// }
						this.getDataTable(this.pagesize, this.currentPage)
					}
				})
				// =====重新加载页面就可以，重新渲染
				// this.$router.push({name:'comNumPrductList'})

			},
			//获取列表信息
			getDataTable(pageSize, pageNum) {
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/queryList',
					params: {
						companyId: '20',
						tabulationType: '1',
						pageNum: pageNum || this.currentPage,
						pageSize: pageSize || this.pagesize
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
						this.pagesize = pageSize || this.pagesize;
						this.currentPage = pageNum || this.currentPage;

						sessionStorage.setItem('pagesize', this.pagesize);
						sessionStorage.setItem('currentPage', this.currentPage);

						console.log(this.tableData)
					}

				})
			},
		}
	}
</script>
<style lang="scss">
	.newHonorList-container {
		min-width: 1160px;
		background: #fff;
		padding: 20px 30px;

		.el-dialog {
			padding: 0;

			.el-dialog__header {
				padding: 0;
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

		.el-input {
			width: 300px;
			height: 30px;

			.el-input__inner {
				height: 30px;

			}
		}

		.el-radio__inner {
			-webkit-box-sizing: content-box;
			-moz-box-sizing: content-box;
			box-sizing: content-box;

		}

		.el-checkbox__inner {
			width: 16px;
			height: 16px;
		}

		.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
			background: #fff;

		}

		.el-checkbox__inner:hover, .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
			border-color: #DCDFE6;

		}

		.el-checkbox__inner::after {
			content: "";
			border: none;

			&:focus {
				border-color: #DCDFE6;
			}

		}

		.el-checkbox__input:focus {
			border-color: #DCDFE6;

		}

		.el-checkbox__input.is-focus .el-checkbox__inner {
			border-color: #DCDFE6 !important;

		}

		.el-checkbox__input.is-checked .el-checkbox__inner:after {

			border-radius: 50%;
			border-color: #DCDFE6;
			background-color: #4278BE;
			content: "";
			width: 8px !important;
			height: 8px !important;
			position: absolute;
			left: 50% !important;
			top: 50% !important;
			border-radius: 50%;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
			transform: translate(-50%, -50%);
			-ms-transform: translate(-50%, -50%);
			-moz-transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
			-o-transform: translate(-50%, -50%);

		}

		.el-checkbox__input.is-checked + .el-checkbox__label {
			color: #606266;
		}

		.el-radio__input.is-checked + .el-radio__label {
			color: #909399;
		}

		.el-radio__input.is-checked .el-radio__inner {
			background: #fff;
			border-color: #EDEFF2;
		}

		.el-radio__label {
			color: #606266;
			font-size: 14px;
		}

		.el-radio__inner:after {
			content: '';
			width: 9px !important;
			height: 9px !important;
			background: #4278BE;

		}

		.el-radio__inner:hover {
			border-color: #DCDFE6;


		}

		.activehor {
			background: #4278BE !important;
			color: #fff !important;
			border: none !important;
		}

		.honorShowList {
			padding: 0 20px;
			display: inline-block;
			width: 381px;
			border-radius: 3px;
			border: 1px solid #BFC2CC;
			vertical-align: top;
			overflow: hidden;


			& > div {
				border-bottom: 1px solid #EDEFF2;
			}
		}

		.honorImg {
			height: 77px;
			line-height: 77px;
			overflow: hidden;

			.orderNum {
				display: inline-block;
				width: 21px;
				height: 21px;
				line-height: 21px;
				text-align: center;
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;
				border-radius: 50%;
				border: 1px solid #4278BE;
				color: #4278BE;
				margin-right: 15px;
			}

			img {
				display: inline-block;
				width: 44px;
				height: 44px;
				border-radius: 2px;
				background-color: skyblue;
				vertical-align: middle;

			}

			.honorInfoTwo {
				display: inline-block;

				span {
					height: 100%;

					&:first-child {
						color: #303133;
					}

					&:last-child {
						color: #606266;
					}
				}
			}

			.honorInfo {
				display: inline-block;
				height: 44px;
				line-height: 1;
				vertical-align: middle;

				span {
					display: inline-block;
					height: 50%;
					line-height: 22px;
					width: 100%;
					font-size: 14px;

					&:first-child {
						color: #303133;
					}

					&:last-child {
						color: #606266;
					}
				}
			}

			.selfTitle {
				float: right;
				color: #303133;
			}
		}

		.choiceShowPerson {
			margin-left: 21px;
			display: inline-block;
			overflow: hidden;
			vertical-align: middle;

			h1 {
				text-align: center;
				height: 49px;
				line-height: 48px;
				color: #303133;
				font-size: 16px;
				border: 1px solid #BFC2CC;
				border-bottom: none;
				border-radius: 3px 3px 0 0;
			}

			.el-table {
				display: inline-block;
				border-radius: 0 0 3px 3px;
				border: none;
				border: 1px solid #BFC2CC;
				border-top: none;

				.el-table thead {
					border-top: none;
				}

				input.el-input__inner {
					border: none;
					padding: 0;
					padding-left: 10px;
				}

				tr {
					height: 46px;

					td, th {
						height: 46px;
						min-height: 46px;
						padding: 0;
					}
				}

				.el-table__row:nth-child(2n) {
					input.el-input__inner {
						background: #F6F6FA;
					}
				}
			}

			.honorBtnBox {
				display: inline-block;
				font-size: 0px;

				span {
					color: #4278BE;
					font-size: 16px;
				}

				.el-button {
					margin-left: 5px;
					font-size: 14px;
					padding-top: 0;
					color: #4278BE;
				}
			}
		}

		.newHonorList-btn {
			margin-top: 10px;

			.el-button {
				width: 109px;
				height: 40px;
				font-size: 14px;
				background: #fff;
				border: 1px solid #4278BE;
				color: #4278BE;

			}
		}

		.el-form-item:last-child {
			.el-form-item__content {
				margin-left: 0 !important;

				.newHonorList-btn {
					font-size: 0;

					.el-button:last-child {
						margin-left: 15px;
					}
				}
			}
		}
	}
</style>
