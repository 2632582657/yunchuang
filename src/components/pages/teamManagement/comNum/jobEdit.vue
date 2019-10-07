<template>
	<div class="jobEdit-container">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="职位名称" prop="name">
				<el-input v-model="ruleForm.name"></el-input>
			</el-form-item>
			<el-form-item label="招聘人数" prop="num">
				<el-input v-model.number="ruleForm.num" class="peoplenum" type="number"></el-input>&nbsp;人
			</el-form-item>
			<el-form-item label="要求学历" prop="valuelevel">
				<template>
					<el-select v-model="ruleForm.valuelevel" prop="valuelevel" placeholder="请选择">
						<el-option
							v-for="item in optionslevel"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</template>
			</el-form-item>
			<el-form-item label="工作经验" prop="valueexperience">
				<template>
					<el-select v-model="ruleForm.valueexperience" prop="valueexperience" placeholder="请选择">
						<el-option
							v-for="item in optionsexperience"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</template>
			</el-form-item>
			<el-form-item label="工作地点" prop="region">
				<div @click="showPovince" v-show="showInput" style="cursor:default;">
					<el-input v-model="ruleForm.region" placeholder="请输入内容" ref="areaValue"></el-input>
				</div>
				<template>
					<el-cascader :options="options" ref="myCascader" @change="handleChange" v-show="province">
						<template slot-scope="{ node, data }">
							<span>{{ data.label }}</span>
							<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
						</template>
					</el-cascader>
				</template>
			</el-form-item>
			<el-form-item label="职位薪资" prop="optionsMoney">
				<template>
					<el-select v-model="ruleForm.optionsMoney" prop="optionsMoney" placeholder="请选择">
						<el-option
							v-for="item in optionsMoney"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</template>
			</el-form-item>
			<el-form-item label="工作概述" prop="content1">
				<quill-editor ref="text" v-model="ruleForm.content1" class="myQuillEditor" :options="editorOption1"/>
				<!-- <el-button type="primary" >提交</el-button> -->
			</el-form-item>
			<el-form-item label="任职要求" prop="content2">
				<quill-editor ref="text" v-model="ruleForm.content2" class="myQuillEditor" :options="editorOption2"/>
				<!-- <el-button type="primary" >提交</el-button> -->
			</el-form-item>
			<el-form-item label="待遇福利" prop="content3">
				<quill-editor ref="text" v-model="ruleForm.content3" class="myQuillEditor" :options="editorOption3"/>
				<!-- <el-button type="primary" >提交</el-button> -->
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
				<!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import {quillEditor} from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'

	export default {
		data() {
			return {
				length: '',
				province: false,//工作地点三级联动的开关
				showInput: true,//工作地点输入框的开关
				// value:[],//存储级联选择的最终结果
				routdata: [],//接收职位列表传过来的数据
				length3: '',//新增后是否改变当前页数的判断
				pagesize3: '',
				total3:'',
				currentPage3: '',
				ruleForm: {
					id:'',
					name: '',
					region: '青岛',
					createTime:'',
					valuelevel: '',//存放学历
					valueexperience: '',//工作经验
					optionsMoney: '',//薪资
					content1: '',//工作概述内容
					content2: '',//任职要求内容
					content3: '',//福利待遇内容
					num: ''//存放人数
				},
				rules: {
					name: [
						{required: true, message: '请输入职位名称', trigger: 'blur'},
						{min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
					],
					num: [
						{required: true, message: '人数不能为空'},
						{type: 'number', message: '人数必须为数字值'}
					],
					region: [
						{required: true, message: '请选择工作地点', trigger: 'change'}
					],
					optionsMoney: [
						{required: true, message: '请填写薪资范围', trigger: 'change'}
					],
					resource: [
						{required: true, message: '请选择活动资源', trigger: 'change'}
					],
					valuelevel: [
						{required: true, message: '请填写学历', trigger: 'change'}
					],
					valueexperience: [
						{required: true, message: '请填写工作经验', trigger: 'change'}
					],

					content1: [
						{required: true, message: '请填写任职要求', trigger: 'blur'}
					],
					content2: [
						{required: true, message: '请填写任职要求', trigger: 'blur'}
					],
					content3: [
						{required: true, message: '请填写任职要求', trigger: 'blur'}
					]

				},
				data: {
					job: {
						type: String,
						required: true
					},
					name: {
						type: Number,
						required: true
					},
					address: {
						type: String,
						required: true
					},
					num: {
						type: Number,
						required: true
					},
					down: {
						type: String,
						default: '',
						required: true
					}

				},
				editorOption1: {},
				editorOption2: {},
				editorOption3: {},
				selectedOptions: [],//存放默认值
				// options:options,   //存放城市数据
				options: [{
					value: 'zhinan',
					label: '指南',
					children: [{
						value: 'shejiyuanze',
						label: '设计原则',
						children: [{
							value: 'yizhi',
							label: '一致'
						}, {
							value: 'fankui',
							label: '反馈'
						}, {
							value: 'xiaolv',
							label: '效率'
						}, {
							value: 'kekong',
							label: '可控'
						}]
					}, {
						value: 'daohang',
						label: '导航',
						children: [{
							value: 'cexiangdaohang',
							label: '侧向导航'
						}, {
							value: 'dingbudaohang',
							label: '顶部导航'
						}]
					}]
				}, {
					value: 'zujian',
					label: '组件',
					children: [{
						value: 'basic',
						label: 'Basic',
						children: [{
							value: 'layout',
							label: 'Layout 布局'
						}, {
							value: 'color',
							label: 'Color 色彩'
						}, {
							value: 'typography',
							label: 'Typography 字体'
						}, {
							value: 'icon',
							label: 'Icon 图标'
						}, {
							value: 'button',
							label: 'Button 按钮'
						}]
					}, {
						value: 'form',
						label: 'Form',
						children: [{
							value: 'radio',
							label: 'Radio 单选框'
						}, {
							value: 'checkbox',
							label: 'Checkbox 多选框'
						}, {
							value: 'input',
							label: 'Input 输入框'
						}, {
							value: 'input-number',
							label: 'InputNumber 计数器'
						}, {
							value: 'select',
							label: 'Select 选择器'
						}, {
							value: 'cascader',
							label: 'Cascader 级联选择器'
						}, {
							value: 'switch',
							label: 'Switch 开关'
						}, {
							value: 'slider',
							label: 'Slider 滑块'
						}, {
							value: 'time-picker',
							label: 'TimePicker 时间选择器'
						}, {
							value: 'date-picker',
							label: 'DatePicker 日期选择器'
						}, {
							value: 'datetime-picker',
							label: 'DateTimePicker 日期时间选择器'
						}, {
							value: 'upload',
							label: 'Upload 上传'
						}, {
							value: 'rate',
							label: 'Rate 评分'
						}, {
							value: 'form',
							label: 'Form 表单'
						}]
					}, {
						value: 'data',
						label: 'Data',
						children: [{
							value: 'table',
							label: 'Table 表格'
						}, {
							value: 'tag',
							label: 'Tag 标签'
						}, {
							value: 'progress',
							label: 'Progress 进度条'
						}, {
							value: 'tree',
							label: 'Tree 树形控件'
						}, {
							value: 'pagination',
							label: 'Pagination 分页'
						}, {
							value: 'badge',
							label: 'Badge 标记'
						}]
					}, {
						value: 'notice',
						label: 'Notice',
						children: [{
							value: 'alert',
							label: 'Alert 警告'
						}, {
							value: 'loading',
							label: 'Loading 加载'
						}, {
							value: 'message',
							label: 'Message 消息提示'
						}, {
							value: 'message-box',
							label: 'MessageBox 弹框'
						}, {
							value: 'notification',
							label: 'Notification 通知'
						}]
					}, {
						value: 'navigation',
						label: 'Navigation',
						children: [{
							value: 'menu',
							label: 'NavMenu 导航菜单'
						}, {
							value: 'tabs',
							label: 'Tabs 标签页'
						}, {
							value: 'breadcrumb',
							label: 'Breadcrumb 面包屑'
						}, {
							value: 'dropdown',
							label: 'Dropdown 下拉菜单'
						}, {
							value: 'steps',
							label: 'Steps 步骤条'
						}]
					}, {
						value: 'others',
						label: 'Others',
						children: [{
							value: 'dialog',
							label: 'Dialog 对话框'
						}, {
							value: 'tooltip',
							label: 'Tooltip 文字提示'
						}, {
							value: 'popover',
							label: 'Popover 弹出框'
						}, {
							value: 'card',
							label: 'Card 卡片'
						}, {
							value: 'carousel',
							label: 'Carousel 走马灯'
						}, {
							value: 'collapse',
							label: 'Collapse 折叠面板'
						}]
					}]
				}, {
					value: 'ziyuan',
					label: '资源',
					children: [{
						value: 'axure',
						label: 'Axure Components'
					}, {
						value: 'sketch',
						label: 'Sketch Templates'
					}, {
						value: 'jiaohu',
						label: '组件交互文档'
					}]
				}],
				//工资选择
				optionsMoney: [
					{
						value: '0',
						label: '不限'
					}, {
						value: '1',
						label: '1000~2000'
					}, {
						value: '2',
						label: '2000~3000'
					}, {
						value: '3',
						label: '3000~4000'
					}, {
						value: '4',
						label: '4000~6000'
					}, {
						value: '5',
						label: '6000~8000'
					},
					{
						value: '6',
						label: '8000~10000'
					},
					{
						value: '7',
						label: '10000以上'
					}],
				//学历选择
				optionslevel: [
					{
						value: '0',
						label: '不限'
					}, {
						value: '1',
						label: '初中及以下'
					}, {
						value: '2',
						label: '中专/中技及以下'
					}, {
						value: '3',
						label: '高中'
					}, {
						value: '4',
						label: '大专'
					}, {
						value: '5',
						label: '本科'
					},
					{
						value: '6',
						label: '硕士'
					},
					{
						value: '7',
						label: '博士'
					}],
				//工作经验
				optionsexperience: [{
					value: '0',
					label: '不限'
				}, {
					value: '1',
					label: '在校生'
				}, {
					value: '2',
					label: '应届生'
				}, {
					value: '3',
					label: '1年以内'
				}, {
					value: '4',
					label: '1~3年'
				},
					{
						value: '5',
						label: '3~5年'
					},
					{
						value: '6',
						label: '5~10年'
					},
					{
						value: '7',
						label: '10年以上'
					}]
			}
		},
		created() {
			this.$nextTick(() => {
				this.getData()
			})
			this.length3 = this.$route.query.length
			this.total3 = this.$route.query.total
			this.pagesize3 = JSON.parse(sessionStorage.getItem('pagesize3'))
			this.currentPage3 = JSON.parse(sessionStorage.getItem('currentPage3'))
		},
		methods: {
			// 工作地点控制省市级选择器的出现
			showPovince() {
				this.province = true
				this.showInput = false
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.$route.query.id) {
							this.$http({
								method: 'POST',
								url: 'v1/base/feign/company/updateJob',//添加的接口
								data: {
									companyId: '1',
									data: JSON.stringify(this.ruleForm)
								},
								headers: {
									// "Content-Type": "multipart/form-data",
									"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
								}
							}).then(res => {
								if (res.data.code === 200 && res.status === 200) {
									this.$message({
										type: 'success',
										message: '编辑成功',
									});
									this.$router.push({name: 'comNumJobList'})

								}
							})
						} else {
								this.$http({
								method: 'POST',
								url: 'v1/base/feign/company/saveJob',//新增的接口
								data: {
									companyId: '1',
									createBy: '1',
									jobName: JSON.stringify(this.ruleForm.name),
									employ: JSON.stringify(this.ruleForm.num),
									educationRequire: Number(this.ruleForm.valuelevel),
									workExperience: Number(this.ruleForm.valueexperience),
									workAddress: JSON.stringify(this.ruleForm.region),
									jobPay: Number(this.ruleForm.optionsMoney),
									workSummarize: JSON.stringify(this.ruleForm.content1),
									jobRequire: JSON.stringify(this.ruleForm.content2),
									socialBenefits: JSON.stringify(this.ruleForm.content3),
								},
								headers: {
									// "Content-Type": "multipart/form-data",
									"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
								}
							}).then(res => {
								// console.log(res)
								console.log(this.ruleForm)
								if (res.data.code === 200 && res.status === 200) {
									if(this.length3<this.pagesize3&&this.total3/this.pagesize3!==0){
										this.currentPage3 = Math.ceil(this.total3/this.pagesize3)
									}
									if (this.length3 == this.pagesize3&&this.total3/this.pagesize3!==0) {
										this.currentPage3 = this.total3/this.pagesize3+1

									}
									sessionStorage.setItem('currentPage3', this.currentPage3);

									this.$message({
										type: 'success',
										message: '添加成功',
									});
									this.$router.push({name: 'comNumJobList'})

								}
							})
						}
						// =====成功后向添加的接口传入数据。在让招聘职位列表获取重新渲染
						// 可以借用下方写好的submit函数。实现数据的提交
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			getData() {
				if (this.$route.query.id) {
					console.log(JSON.parse(this.$route.query.data))
					this.data = JSON.parse(this.$route.query.data)
					this.ruleForm.id = this.data.id
					this.ruleForm.name = this.data.jobName
					this.ruleForm.num = this.data.employ
					this.ruleForm.region = this.data.region
					this.ruleForm.createTime = this.data.createTime
					this.ruleForm.valuelevel = this.data.educationRequireName
					this.ruleForm.valueexperience = this.data.workExperienceName
					this.ruleForm.optionsMoney = this.data.jobPayName
					this.ruleForm.content1 = this.data.content1
					this.ruleForm.content2 = this.data.content2
					this.ruleForm.content3 = this.data.content3
				}
			},
			// 省市级联动的处理方法
			handleChange(value) {
				this.length = this.$refs.myCascader.getCheckedNodes()[0].pathLabels.length
				if (this.length > 0) {
					this.ruleForm.region = ''
					this.$refs.myCascader.getCheckedNodes()[0].pathLabels.forEach((item) => {
						this.ruleForm.region += item + ','
					})
					// console.log(this.ruleForm.region.length)
					this.ruleForm.region = this.ruleForm.region.substring(0, this.ruleForm.region.length - 1);
					this.province = false
					this.showInput = true
				}
				// if(value.length>0) {
				// this.ruleForm.region = JSON.parse(JSON.stringify(this.$refs.myCascader.getCheckedNodes()[0].pathLabels))
				console.log(this.ruleForm.region)
				// }
				// console.log(this.$refs.areaValue.value);
				// console.log(this.ruleForm.region);
			},
		},
		components: {
			quillEditor
		}

	}
</script>
<style lang="scss">
	.jobEdit-container {
		background: #fff;
		min-width: 800px;
		padding: 20px 20px 40px 51px;

		.myQuillEditor {
			margin-top: 13px;
			margin-bottom: 10px;
		}

		.el-input__icon {
			height: 36px;
			line-height: 38px
		}

		.el-select > .el-input, .el-cascader .el-input, .el-input {
			width: 300px;
			height: 30px;
		}

		.el-select .el-input .el-select__caret {
			height: 30px;
			line-height: 30px;
		}

		.el-input:nth-child(3) {
			cursor: pointer;
		}

		.el-input__inner {
			border-radius: 3px;
			height: 30px;
		}

		.peoplenum {
			width: 83px;
			margin-right: 13px;
		}

		.money {
			width: 80px;
		}

		.ql-toolbar.ql-snow {
			border-radius: 3px 3px 0 0;
		}

		.ql-container.ql-snow {
			border-radius: 0 0 3px 3px;
		}

		.ql-toolbar.ql-snow + .ql-container.ql-snow {
			height: 323px;
		}

		.el-form-item__label {
			padding-right: 15px;
		}

		.el-form-item {
			margin-bottom: 10px;
		}

		.el-form-item__content {
			.el-button {
				width: 120px;
			}
		}

		.el-form-item:last-child {
			.el-form-item__content {
				margin-left: 0 !important;

				.el-button {
					width: 109px;
					height: 40px;
					margin-top: 27px;
					margin-left: -32px;
					color: #fff;
					background: #4278BE;
					border-radius: 3px;
				}
			}
		}
	}
</style>
