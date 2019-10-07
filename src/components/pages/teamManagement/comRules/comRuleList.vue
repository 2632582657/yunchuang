<template>
	<div class="comRuleList-container">
		<header>
			<el-row>
				<el-col :span="8">
					<div class="grid-content bg-purple">
						<span>制度标题:</span>
						<el-autocomplete
							v-model="state"
							:fetch-suggestions="querySearchAsync"
							placeholder="输入文章标题关键字"
							@select="handleSelect"
						></el-autocomplete>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="grid-content bg-purple-light">
						<span>发布时间:</span>
						<template>
							<div class="block">
								<!-- <p>组件值：{{ value }}</p> -->
								<el-date-picker
									v-model="value"
									type="daterange"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									:default-time="['00:00:00', '23:59:59']">
								</el-date-picker>
							</div>
						</template>
						<el-button type="primary">查询</el-button>

					</div>
				</el-col>
				<el-col :span="8">
					<div class="grid-content bg-purple">
						<div class="comRuleList-btn">
							<el-button type="primary" @click="hrefTo">新增制度</el-button>
							<el-button type="text" @click.stop="()=>{moveFlag=true}">批量移动</el-button>
						</div>
					</div>
				</el-col>
			</el-row>
		</header>

		<div class="comRuleList-main">
			<el-container>
				<el-aside width="200px">
					<div class="comRuleList-rule-class">
						<div class="title">
							制度分类
						</div>
						<el-tree
							:data="data"
							accordion
							node-key="id"
							@node-click="handleNodeClick">
							<div class="custom-tree-node" slot-scope="{ node, data }"
								 @mouseenter.stop="() => {data.isShow = true}"
								 @mouseleave.stop="() => {data.isShow = false}">
								<span class="custom-tree-node-span"
									  style="display:block;max-width:185px;float:left;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;position:relative;">{{ data.label }}</span>
								<i class="el-icon-setting" v-show="data.isShow"
								   style="margin-left:10px;height:100%;position:absolute;" @click.stop="modify()"
								   @mouseleave.stop="() => {flag = false}">
									<div class="custom-tree-node-modify " v-show="flag">
										<el-button type="text" icon="el-icon-document-add"
												   @click.stop="addChildClass(data)">新建子分类{{data.id}}
										</el-button>
										<el-button type="text" icon="el-icon-document-add"
												   @click.stop="addSibilingClass(node,data)">新建同级分类
										</el-button>
										<el-button type="text" icon="el-icon-edit" @click.stop="editClass">编辑分类
										</el-button>
										<el-button type="text" icon="el-icon-delete" @click.stop="open(node,data)">
											删除分类
										</el-button>

									</div>
								</i>

							</div>


						</el-tree>

					</div>

				</el-aside>
				<el-main>
					<div class="comRuleList-tabel">
						<template>
							<el-table
								:header-cell-style="tableHeaderColor"
								:cell-style="setBorder"
								:row-class-name="tableRowClassName"
								:data="tableData.slice((currentPage2-1)*pagesize2,currentPage2*pagesize2)"
								style="width: 100%">
								<el-table-column
									align=center
									prop="address"
									label="制度名称">
								</el-table-column>
								<el-table-column
									align=center
									prop="class"
									label="制度类别">
								</el-table-column>
								<el-table-column
									align=center
									prop="date"
									label="发布时间"
								>
								</el-table-column>
								<el-table-column
									align=center
									prop="name"
									label="发布人"
								>
								</el-table-column>
								<el-table-column
									align=center
									prop="yon"
									label="是否作废"
								>
								</el-table-column>
								<el-table-column
									align=center
									prop="down"
									label="操作"
									width="180">
									<template slot-scope="scope">
										<el-button type="text" @click="edit( scope.$index, scope.row)">
											编辑
										</el-button>
										<el-button type="text" @click="open1( scope.$index, scope.row)">删除</el-button>
										<!-- <el-button type="text" @click="open;downLoad( scope.$index, scope.row)">删除</el-button> -->
									</template>
								</el-table-column>
							</el-table>
						</template>
					</div>
					<div class="comRuleList-page">
						<template>
							<div class="block report-page">
								<el-pagination
									background
									@size-change="handleSizeChange"
									@current-change="handleCurrentChange"
									:current-page="currentPage2"
									:page-sizes="[1, 2, 3, 4]"
									:page-size="pagesize2"
									layout="total, sizes, prev, pager, next, jumper"
									:total="tableData.length">
								</el-pagination>
							</div>
						</template>
					</div>
				</el-main>
			</el-container>

		</div>
		<div class="comRuleList-column" v-show="columeFlag">

			<div class="comRuleList-column-title">
				新增/编辑栏目
				<span class="comRuleList-column-close el-icon-close" @click="hideColumu"></span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

				<el-form-item label="上级分类" prop="region">
					<el-select v-model="ruleForm.region" placeholder="请选择活动区域">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分类名称" prop="name">
					<el-input v-model="ruleForm.name"></el-input>
				</el-form-item>
				<el-form-item class="comRuleList-column-submit">
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
					<!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
				</el-form-item>
			</el-form>


		</div>


		<div class="comRuleList-movetabel" v-show="moveFlag">
			<p>
				批量移动
				<span class="el-icon-close" @click.stop="()=>{moveFlag=false}"></span>
			</p>

			<div style="overflow:hidden;">
				<div class="movetabel-content">
					<p>选择制度内容</p>
					<template>
						<el-table
							ref="multipleTable"
							:data="tableData"
							tooltip-effect="dark"
							style="width: 100%"
							border
							@selection-change="handleSelectionChange"
							@select="handleSelectionOne"
							@select-all="handleSelectionAll">
							<el-table-column
								type="selection"
								label="全部"

								width="55">
							</el-table-column>
							<el-table-column
								label="日期"
								width="120">
								<template slot-scope="scope">{{ scope.row.date }}</template>
							</el-table-column>
							<el-table-column
								prop="name"
								label="姓名"
								width="120">
							</el-table-column>
							<el-table-column
								prop="address"
								label="地址"
								show-overflow-tooltip>
							</el-table-column>
						</el-table>
					</template>
					<el-pagination
						small
						layout="prev, pager, next"
						:current-page.sync="currentPage3"
						:page-size="100"
						:total="data.length">
					</el-pagination>
				</div>


				<div class="movetabel-class">
					<p>选择目标分类</p>
					<div>
						<el-tree
							:data="data1"
							:props="defaultProps1"
							node-key="id"
							ref="treeForm"
							check-strictly
							show-checkbox
							@check-change="nodeChange"
							@node-click="handleNodeClick2">

						</el-tree>
					</div>
				</div>
			</div>
			<div class="movetabel-btn-box">
				<el-button type="success" @click.stop="commit">提交</el-button>
				<el-button @click.stop="()=>{moveFlag=false}">取消</el-button>
			</div>
		</div>
	</div>
</template>
<script>

	export default {
		data() {
			return {
				//存储右侧弹窗的信息
				ruleForm: {
					name: '',
					region: '',
				},
				rules: {
					name: [
						{required: true, message: '请输入活动名称', trigger: 'blur'},
						{min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
					],
					region: [
						{required: true, message: '请选择上级分类', trigger: 'change'}
					]

				},


				msg: ['确定删除该制度数据吗？', '删除后该制度分类下的分类制度及制度数据将全部被删除!'],
				moveFlag: false,
				flag: false,//小菜单
				id: {
					default: 1000,
					type: Number
				},
				id2: {
					default: 1001,
					type: Number
				},
				table1: [],//弹窗中表单的数据
				tableid1: [],//弹窗中树形控件的数据
				// msg:'',//提示左侧边栏删除信息
				// moble:{},//临时接受当前点击节点的信息
				// modifyFlag:false,//编辑小菜单
				columeFlag: false,//右侧边栏开关

				restaurants: [],
				state: '',//远程搜索框存储数控
				timeout: null,//以上三个是头部搜索框需要的
				next: false,//是修改还是插入的开关
				rulesdata: {},//接受编辑的数据
				currentPage2: 1,
				currentPage3: 1,
				pagesize2: 2,
				input: '',
				value: '',
				data1: [{
					id: '1',
					label: '一级 1',
					children: [{
						id: '12',
						label: '二级 1-1',
						children: [{
							id: '121',
							label: '三级 1-1-1'
						}]
					}]
				}, {
					id: '2',
					label: '一级 2',
					children: [{
						id: '21',
						label: '二级 2-1',
						children: [{
							id: '211',
							label: '三级 2-1-1'
						}]
					}, {
						id: '22',
						label: '二级 2-2',
						children: [{
							id: '221',
							label: '三级 2-2-1'
						}]
					}]
				}, {
					id: '4',
					label: '一级 3',
					children: [{
						id: '41',
						label: '二级 3-1',
						children: [{
							id: '411',
							label: '三级 3-1-1'
						}]
					}, {
						id: '42',
						label: '二级 3-2',
						children: [{
							id: '421',
							label: '三级 3-2-1'
						}]
					}]
				}],
				defaultProps1: {
					id: '0',
					children: 'children',
					label: 'label'
				},
				data: [{
					id: '1',
					label: '行政部',
					icon: 'el-icon-setting',
					isShow: false,
					modifyFlag: false,
					children: [{
						id: '11',
						label: '采购管理制度',
						isShow: false,
						icon: 'el-icon-setting',
						modifyFlag: false,

						children: [
							{
								id: '111',
								label: '考勤管理制度',
								isShow: false,
								modifyFlag: false,
								icon: 'el-icon-setting'

							},
							{
								id: '112',
								label: '技术部',
								isShow: false,
								modifyFlag: false,
								icon: 'el-icon-setting'

							}]
					},
						{
							id: '12',
							label: '人事中心',
							isShow: false,
							modifyFlag: false,
							icon: 'el-icon-setting'

						},
						{
							id: '13',
							label: '营销中心',
							isShow: false,
							modifyFlag: false,
							icon: 'el-icon-setting'

						}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label',
					isShow: false,
					modifyFlag: false

				},
				//表单数据
				tableData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '企业会/企业认证',
					down: '',
					yon: '是',
					class: '行政公告'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '企业会/企业认证',
					down: '',
					yon: '否',
					class: '行政公告'

				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '企业会/企业认证',
					down: '',
					yon: '否',
					class: '行政公告'

				}, {
					date: '2016-05-03',
					name: '王小虎',
					address: '企业会/企业认证',
					down: '',
					yon: '是',
					class: '行政公告'

				}]
			};
		},
		inject: ['reload'],
		created() {
			this.changeVal()
			this.getData()
			if (JSON.parse(sessionStorage.getItem('shutu'))) {
				this.data = JSON.parse(sessionStorage.getItem('shutu'))
			}
			// this.data=sessionStorage.getItem('shutu')||this.data
		},
		beforeUpdate() {
			// this.modify()
			// this.$nextTick(()=>{

			//   this.addChildClass()
			// })
			// this.handleNodeClick()

		},
		beforeMount() {
			// this.$nextTick(()=> {
			//   this.addChildClass()
			// this.handleNodeClick()

			// })
		},
		methods: {

			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						alert('submit!');
						// 这里是请求接口发送数据在页面重新请求在获取数据
						// =========这里是两步请求
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// resetForm(formName) {
			//   this.$refs[formName].resetFields();
			// },
			// 弹窗处理
			handleSelectionChange() {

			},
			handleSelectionOne(data, state) {
				// console.log(data)
				// console.log(state)
				this.table1 = this.data
			},
			handleSelectionAll() {

			},

			nodeChange(data, state, a) {
				console.log(data)
				console.log(state)
				console.log(a)
				if (state) {
					this.$refs.treeForm.setCheckedKeys([data.id]);
					this.tableid1 = data.id
				}
			},
			handleNodeClick2(data, checked, node) {
				// console.log(data)
				// console.log(checked)
				// console.log(node)
				//   if(checked === true) {
				//       this.checkedId = data.id;
				//       this.$refs.treeForm.setCheckedKeys([data.id]);
				//   } else {
				//       if (this.checkedId == data.id) {
				//           this.$refs.treeForm.setCheckedKeys([data.id]);
				//       }
				//   }
			},

			//设置鼠标经过时显示
			// showColumuSet(data){
			//   data.isShow = true
			// },
			// hideColumuSet(data) {
			//   data.isShow = false
			show(data) {
				data.isShow = true
				console.log(data.isShow)
			},
			// },
			//树形控件中的属性==控制小菜单的显示开关
			modify(data) {
				// data.modifyFlag = !data.modifyFlag
				this.flag = !this.flag;
				// console.log(1)
				//   this.data.forEach((item,index)=> {
				//   if(item.id !== data.id){
				//       item.modifyFlag=false
				//   }
				//   if(item.children){
				//     item.children.forEach((item,index)=> {
				//         if(item.id !== data.id){
				//       item.modifyFlag=false
				//         }
				//         if(item.children){
				//       item.children.forEach((item,index)=> {
				//         if(item.id !== data.id){
				//       item.modifyFlag=false
				//         }
				//       })
				//     }

				//       })
				//     }

				// })

				// data.modifyFlag = true;
				// data.modifyFlag = !data.modifyFlag;
				// this.$router.push({name:'comRuleList'})

				// this.$nextTick(()=> {
				//     this.$router.push({name:'comRuleList'})

				// })
			},

			//增加子类
			addChildClass(data) {
				// console.log(index)
				// console.log(data)
				this.showColumu()
				// this.columeFlag=true
				// this.id = Date.now().toString(36)
				// console.log(this.id)
				// const newChild = { id: this.id, label: 'testtest', icon:'el-icon-setting',modifyFlag:false,isShow:false , children: [] }
				// if (!data.children) {
				//   this.$set(data, 'children', [])
				// }
				// data.children.push(newChild)
				// // console.log(JSON.parse(JSON.stringify(this.data))[0])
				// data.isShow=false
				// //
				// data.modifyFlag=false
				// sessionStorage.setItem('shutu', JSON.stringify(this.data))
				// this.reload();
				// this.$router.push({name:'comRuleList'})

			},
			//增加同级
			addSibilingClass(node, data) {
				// 弹窗出现。然后添加信息后，向后台请求。重新渲染
				this.id2 = new Date(Date.now())
				const newChild = {
					id2: this.id2 + 2,
					label: 'testtest1',
					icon: 'el-icon-setting',
					modifyFlag: false,
					isShow: false,
					children: []
				}
				const parent = node.parent
				const children = parent.data.children || parent.data;
				console.log(parent)
				console.log(node)

				if (!children) {
					this.$set(parent, 'children', [])
				}
				children.push(newChild);


				sessionStorage.setItem('shutu', JSON.stringify(this.data))

			},
			// 编辑分类
			editClass() {
				//把文本框输入的值改为label
				console.log('editClass')
			},
			// 删除节点
			deleteClass(node, data) {
				const parent = node.parent;
				const children = parent.data.children || parent.data;
				const index = children.findIndex(d => d.id === data.id);
				children.splice(index, 1);

			},
			//控制右侧边弹窗
			showColumu() {
				console.log(111)
				this.columeFlag = true
			},
			hideColumu() {
				this.columeFlag = false

			},
			// 选择重新改写还是添加
			getData() {
				if (this.$route.query.id) {
					this.rulesdata = this.$route.query
					this.tableData.some((item, index) => {
						if (item.id == this.rulesdata.id) {
							this.next = true
							return this.tableData.splice(index, 1, this.rulesdata)
						}
					})
					if (!this.next) {
						this.tableData.push(this.rulesdata)
					}
				}
			},
			// 提示表格删除没了
			open3() {
				this.$message({
					message: '没有可以删除的消息了',
					type: 'warning'
				});
			},
			delet(index, data) {
				console.log(index)
				this.tableData.splice(index, 1)
				//=====重新加载页面就可以，重新渲染
				// this.$router.push({name:'comNumPrductList'})
				const p = this.tableData.length / this.pagesize
				if (this.currentPage > 1) {
					if (p < this.currentPage || p == this.currentPage && p > this.currentPage - 1) {

						sessionStorage.setItem('currentPage', this.currentPage);
						// 请求数据
					}
					if (p < this.currentPage - 1 || p == this.currentPage - 1 && p > this.currentPage - 2) {
						sessionStorage.setItem('currentPage', this.currentPage - 1);
						// 请求数据
					}
				}
				if (this.currentPage == 1 && this.tableData.length == 0) {
					this.open3()
				}

			},
			//获取数据列表
			// getlist() {
			//   this.tableData = this.$route.query
			// },

			//编辑功能
			edit(index, data) {
				this.$router.push({name: 'editRules', query: JSON.parse(JSON.stringify(data))})

			},
			// 跳转
			hrefTo() {
				this.$router.push({name: 'newRules'})
			},
			//表格保存
			changeVal() {
				this.currentPage2 = Number(window.localStorage.getItem('currentPage2')) || 1
				this.pagesize2 = Number(window.localStorage.getItem('pagesize2')) || 2
			},

			// 这是制度页面左侧栏处理方法
			handleNodeClick(data, node, self) {
				// console.log(this.data);
//这里需要重新加载请求数据
				// console.log(node);
				// console.log(self);
				// this.moble = data;
				// this.data.forEach((item,index)=> {
				//   if(item.isShow){
				//       item.isShow=false
				//   }
				//   if(item.children){
				//     item.children.forEach((item,index)=> {
				//         if(item.isShow){
				//         item.isShow=false
				//         }
				//         if(item.children){
				//       item.children.forEach((item,index)=> {
				//         if(item.isShow){
				//         item.isShow=false
				//         }
				//       })
				//     }

				//       })
				//     }

				// })
				this.data.forEach((item, index) => {
					// if(item.id !== data.id){
					//     item.modifyFlag=false
					// }
					// if(item.children){
					//   item.children.forEach((item,index)=> {
					//       if(item.id !== data.id){
					//     item.modifyFlag=false
					//       }
					//       if(item.children){
					//     item.children.forEach((item,index)=> {
					//       if(item.id !== data.id){
					//     item.modifyFlag=false
					//       }
					//     })
					//   }

					//     })
					//   }
					//
					//===============做请求。请求api获取对象的数据在右侧的表格中渲染

				})

				// data.isShow=true
				// console.log(data.modifyFlag)
				// console.log(data)

				// console.log(node);
				// if(node.isCurrent){
				// data.isShow=true

				// }
				//这里看逻辑是否需要都调用
				// this.showColumu()
			},
			changeNode(data) {
				console.log(1)
				console.log(data)
				// console.log(t)
				// console.log(f)
			},
			//表单处理函数
			tableRowClassName({row, rowIndex}) {
				if (rowIndex % 2 == 0) {
					return 'warning-row';
				}
				if (rowIndex > 0) {
					return 'color: red;font-size:14px;'

				}


				return '';
			},
			tableHeaderColor({row, column, rowIndex, columnIndex}) {
				if (rowIndex === 0) {
					return 'color: #303133;font-size:16px;'
				}
			},
			setBorder({row, column, rowIndex, columnIndex}) {
				// return 'border-color:black;'
			},
			// handleCurrentChange1(val) {
			//   console.log(`每页 ${val} 条`);
			// @current-change="handleCurrentChange1"

			// },
// handleSizeChange1() {
//             console.log(`每页 ${val} 条`);
			// @size-change="handleSizeChange1"

// },
			handleNodeClick1() {

			},
			//分页器处理函数
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pagesize2 = val
				localStorage.setItem('pagesize2', this.pagesize2);
			},
			handleCurrentChange(val) {
				this.currentPage2 = val;
				localStorage.setItem('currentPage2', this.currentPage2);
			},
			//这是删除按钮提示
			open1(node, data) {
				console.log(open)
				this.$confirm('确定删除该制度数据吗？', '', {
					cancelButtonText: '取消',
					confirmButtonText: '确定',
					type: ''
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					if (data) {
						this.delet(node, data)
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			open(node, data) {
				// console.log(node)
				// console.log(data)
				let newDatas = []
				const h = this.$createElement;
				for (let i in this.msg) {
					//4.将data数据push进newDatas数组中
					newDatas.push(h('p', null, this.msg[i]));
				}
				// if(data.children){
				//   this.msg=`确定删除该制度数据吗？
				//   删除后该制度分类下的分类制度及制度数据将全部被删除!`
				// }else {
				//   this.msg='确定删除该制度数据吗？'

				// }
				this.$msgbox(
					//将newDatas传进h方法生成的代码格式为：
					// <div>
					//      <p>错误提示一！！！</p>
					//      <p>错误提示二！！！</p>
					//      <p>错误提示三！！！</p>
					// </div>
					{
						message: h('div', null, newDatas),
						showCancelButton: true,
						cancelButtonText: '取消',
						confirmButtonText: '确定',
						type: ''
					}
				).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					if (data) {
						this.deleteClass(node, data)
					}

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			//头部搜索框的处理函数
			loadAll() {
				return [
					{"value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号"},
					{"value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号"},
					{"value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113"},
					{"value": "泷千家(天山西路店)", "address": "天山西路438号"},
					{"value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101"},
					{"value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路"},
					{"value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室"},
					{"value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号"},
					{"value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号"},
					{"value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位"},
					{"value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号"},
					{"value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼"},
					{"value": "阳阳麻辣烫", "address": "天山西路389号"},
					{"value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13"}
				];
			},
			querySearchAsync(queryString, cb) {
				var restaurants = this.restaurants;
				var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					cb(results);
				}, 3000 * Math.random());
			},
			createStateFilter(queryString) {
				return (state) => {
					return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			handleSelect(item) {
				console.log(item);
			},
			// 批量移动弹窗
			commit() {
				// this.table1
				// this.tableid1
				this.moveFlag = false
				// 重新加载页面

			}

		},
		mounted() {
			this.restaurants = this.loadAll();
		}
	}
</script>
<style lang="scss">
	.el-row {
		height: 67px;
		line-height: 67px;

	}

	.grid-content.bg-purple {
		height: 67px;
		line-height: 67px;
	}

	.bg-purple-light.bg-purple-light {
		padding-left: 10px;

	}

	.comRuleList-container {
		min-width: 1087px;
		background: #fff;
		position: relative;
		padding: 36px 13px 31px 2px;
		height: 958px;

		.el-pagination.is-background {
			height: 20px;
			line-height: 20px;
			color: #787D80;

			.el-pagination__total, .el-pagination__jump, .el-pagination__editor.el-input, .el-pagination__editor.el-input .el-input__inner, .el-pagination__sizes, .el-select.el-select--mini, .el-select .el-input, .el-select .el-input .el-input__inner, .el-input__suffix, .el-select__caret.el-input__icon.el-icon-arrow-up {
				height: 20px;
				line-height: 20px;
				color: #787D80;
			}

			.btn-next, .btn-prev {
				height: 20px;
				width: 20px;
				min-width: 20px;
				color: #787D80;

				line-height: 20px;
			}

			.el-select .el-input {
				margin: 0px;
			}

			li:not(.disabled):hover {
				color: #787D80;
			}

			.el-pager {
				height: 20px;
				line-height: 20px;
				color: #787D80;

				li:not(.disabled).active {
					background: #4278BE;
					color: #fff;
					line-height: 20px;

				}

				li {
					margin-right: 5px;
					height: 20px;
					width: 20px;
					color: #787D80;

					min-width: 20px;
					line-height: 19px;
				}
			}

			.el-pagination__sizes {
				margin-left: 1px;
				margin-right: 5px;
				color: #787D80;

			}

			.el-pagination__jump {
				margin-left: 16px;
				color: #787D80;

			}

		}

		.el-main {
			overflow-x: hidden;
		}

		.comRuleList-movetabel {
			position: absolute;

			top: 45%;
			left: 55%;
			transform: translate(-50%, -50%);
			z-index: 9999;
			box-shadow: 0px 0px 1px;
			overflow: hidden;
			width: 960px;
			height: 759px;
			border-radius: 6px;

			background: rgba(255, 255, 255, 1);

			& > p {
				width: 100%;
				height: 72px;
				line-height: 72px;

				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				padding-left: 35px;
				padding-right: 22px;
				background: #F8F8F8;
				font-size: 18px;
				color: #303133;

				span {
					line-height: 72px;
					display: inline-block;
					font-size: 18px;
					color: #303133;
				}

			}

			.movetabel-content {
				position: relative;
				float: left;
				display: inline-block;
				width: 484px;
				height: 550px;
				background: #fff;
				padding-left: 22px;
				padding-right: 16px;
				box-sizing: border-box;

				& > P {
					height: 54px;
					line-height: 54px;
					padding-left: 13px;
				}

				.el-table {
					width: 446px;
					height: 450px;

				}

				.el-pagination {
					position: absolute;
					bottom: 0;
					right: 12px;
					padding-right: 0;
				}
			}

			.movetabel-class {
				float: left;
				width: 470px;
				height: 502px;
				background: #fff;

				& > p {
					height: 54px;
					line-height: 54px;
					text-align: left;
					padding-left: 17px;
				}

				& > div {
					height: 448px;
					border: 1px solid rgba(237, 239, 242, 1);

				}

				.el-tree {
					width: 426px;
				}
			}

			.movetabel-btn-box {
				height: 95px;
				line-height: 95px;
				text-align: center;

				.el-button {
					width: 129px;
					height: 36px;
					font-size: 14px;
					border-radius: 3px;

					&:first-child {
						background: #4278BE;
						color: #fff;

					}

					&:last-child {
						color: #4278BE;
						border-color: #4278BE;

					}

				}
			}

		}

		.comRuleList-column {
			border: 1px solid #eee;
			position: fixed;
			background: #fff;
			z-index: 99;
			top: 0px;
			right: 0px;
			width: 600px;
			height: 100%;

			.el-form-item {
				margin-top: 20px;

				.el-input {
					width: 300px;
				}
			}

			.comRuleList-column-title {
				height: 37px;
				padding-left: 40px;
				padding-top: 21px;
				font-size: 20px;
				color: #303133;
				overflow: hidden;
				-webkit-background-clip: text;
				border-bottom: 1px solid #EDEFF2;

				.comRuleList-column-close {
					display: inline-block;
					width: 18px;
					height: 18px;
					float: right;
					margin-top: 6px;
					margin-right: 27px;
					font-size: 18px;
					color: #909399;

				}
			}

			.comRuleList-column-submit {
				width: 100%;
				position: absolute;
				bottom: 0;
				text-align: right;
				border-top: 1px solid #EDEFF2;

				.el-button {
					margin-top: 12px;
					margin-right: 20px;
					margin-bottom: 17px;
					background: #4278BE;
					border-radius: 3px;
					color: #fff;
					width: 120px;
					height: 40px;
					font-size: 14px;
					line-height: 0;
				}
			}

		}

		.el-main {
			background: #fff;
		}

		header {

			.el-row {
				flex-wrap: nowrap;

				.el-col:first-child {
					text-align: center;

					flex: 3;

				}

				.el-col:nth-child(2) {
					flex: 5.5;
					text-align: left;
					width: 139px;

					.el-button {
						background: #4278BE;
						color: #fff;
						width: 129px;
						height: 36px;
						margin-left: 10px;
					}
				}

				.el-col:last-child {
					flex: 3.5;
					text-align: right;

				}

			}

			.el-input {
				width: 100%;
				margin-right: 3%;
				margin-left: 3%;

				.el-input__inner {
					height: 30px;
				}
			}

			.block {
				display: inline-block;
				width: 52%;
				margin-left: 2%;

				vertical-align: middle;

				.el-date-editor .el-range__icon {
					line-height: 26px;
				}

				.el-input {

				}

				.el-range-editor.el-input__inner {
					width: 100%;
					height: 30px;
				}
			}

			.comRuleList-btn {
				margin-right: 0;

				.el-button {
					text-align: center;
					margin-right: 2%;
					width: 129px;
					height: 36px;
					background: #4278BE;

					span {
					}

				}

				.el-button:last-child {
					background: #fff;
					border: 1px solid #4278BE;
					color: #4278BE;
				}
			}
		}

		.comRuleList-main {
			margin-top: 37px;

			.el-main {
			}

			.el-aside {
				overflow: scroll;
				position: relative;
				width: 323px !important;
				padding-right: 16px;
				background: #fff;

				.custom-tree-node {
					width: 100%;

					&:hover {
						color: #4278BE;

					}

				}

				.custom-tree-node-modify {
					position: absolute;
					top: -8px;
					right: -110px;
					opacity: 1;
					z-index: 999;
					margin-top: 23px;
					width: 200px;
					height: 190px;
					border-radius: 3px;
					box-shadow: 1px 1px 4px 0px rgba(191, 194, 204, 0.7);
					background: none;
					background: rgba(248, 248, 248, 1);

					.el-button--text {
						width: 100%;
						height: 25%;
						margin-right: 0;
						margin-left: 0;
						display: block;
						text-align: left;
						padding-left: 30px;
						border-bottom: 1px solid #EDEFF2;
						color: #303133;
						font-size: 14px;

						.el-icon-document-add:before, .el-icon-edit:before, .el-icon-delete:before {
							color: #4278BE;
						}

						&:last-child {
							border: none;
						}

						&:hover {
							background: #D8D8D8;
							color: #4278BE;
						}
					}

				}

				.comRuleList-rule-class {
					color: #303133;
					width: 323px;
					box-sizing: border-box;

					border-top: 12px solid #F8F8F8;
					border-right: 12px solid #F8F8F8;
					border-bottom: 12px solid #F8F8F8;
					border-left: 12px solid #F8F8F8;
					height: 726px;

					.el-button:last-child {
						.el-message-box__header {
							padding: 0;
						}

						.el-message-box__headerbtn .el-message-box__close {
							display: none;
						}
					}

					.el-tree {
						.el-tree-node {
							color: #303133;
							font-size: 14px;
							height: 100%;
						}
					}

					.title {
						height: 35px;
						line-height: 35px;
						text-align: center;
						border-bottom: 3px solid #F8F8F8;
						font-size: 16px;

					}

					.el-tree {
						font-size: 14px;
					}
				}
			}

			.el-main {
				padding: 0;
				padding-left: 10px;

				.comRuleList-tabel {
					.el-table {
						border: 1px solid rgba(191, 194, 204, 1);

						.warning-row {
							background: #F6F6FA;
						}

						tr {

						}

						td {
							color: #606266;
							font-size: 14px;

						}

						.el-table-column {
						}

						.el-button:first-child {
							color: #2AA1E1;
						}

						.el-button:last-child {
							color: #FF6565;
						}
					}

				}
			}
		}

		.comRuleList-page {
			margin-top: 53px;

			.report-page {
				width: 100%;
				height: 50%;
				display: block;
				text-align: right;

				.el-pagination {
					.btn-prev, .btn-next, .number {
						background: #fff;
						color: #C9C9C9;
						border: 1px solid #C9C9C9;

					}

					&.is-background .el-pager li:not(.disabled):hover {
						color: #8D9193;
					}

					.number {
						color: #8D9193

					}

					&.is-background .el-pager li:not(.disabled).active {
						border: none;
						color: #fff;

					}

				}

			}
		}
	}

	/*删除弹窗样式*/
	.el-message-box {
		width: 500px;
		height: 221px;
		padding-bottom: 0;
		border-radius: 10px;
		box-shadow: 2px 2px 2px 2px;

		.el-message-box__content {
			height: 69px;
			padding-left: 40px;

			.el-message-box__message {
				display: block;
				padding-top: 40px;

			}

		}

		i {
			display: none;
		}

		p {
			display: inline-block;
			text-align: left;

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


	}

</style>
