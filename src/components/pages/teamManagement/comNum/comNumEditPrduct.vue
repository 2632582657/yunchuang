<template>
	<div class="comNumEditPrduct-container">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="产品名称" prop="name">
				<el-input v-model="ruleForm.name" placeholder="请输入内容"></el-input>
			</el-form-item>
			<el-form-item label="缩略图" prop="fileList">
				<div class="upload-demo uploadImgBtn" id="uploadImgBtn" ref="uploadImgBtn">

					<div style="margin-top:10px;">
						<template v-for="(item,index) in ruleForm.fileList">
							<div
								style="width:208px;height:117px;display:inline-block;background:skyblue;margin-bottom:5px;vertical-align:top;border:1px solid #eee;position:relative;margin-right:25px;border-radius:3px;"
								@mouseenter.stop="()=> {cancleFlage=true}" @mouseleave="()=> {cancleFlage=false}">
								<span class="el-icon-remove-outline canclebtn"
									  style="position:absolute;right:0;top:0;background:gray;color:#fff;border-radius:50%;width:20px;height:20px;"
									  @click="deleltePhoto(item,index)" v-show="cancleFlage"></span>
								<img :src="ruleForm.fileList[index]" alt=""
									 style="display:inline-block;width:208px;height:117px;border-radius:3px;">
							</div>
						</template>
						<div class="el-icon-plus" v-show="upPhotoFlag"
							 style="background:#F8F8F8;width:208px;height:117px;line-height:117px;text-align:center;position:relative;font-size:12px;color:#606266;border-radius:3px">
							上传图片
							<span class="promt-info"
								  style="position:absolute;right:-5px;width:180px;text-align:left;color:#909399;font-size:11px;">
								(建议上传图片大小为196*146)</span>
							<input class="uploadImg el-icon-plus" type="file" accept="image/*" name="file" multiple
								   @change="uploadPhoto($event)" ref="Photo"
								   style="opacity: 0;position:absolute;left:0;width:100%;height:100%;">
						</div>

					</div>

				</div>
			</el-form-item>
			<el-form-item label="产品介绍" prop="content">
				<quill-editor ref="text" v-model="ruleForm.content" class="myQuillEditor" :options="editorOption"/>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
				<!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	// import fileTab from '../commo/file'
	import {quillEditor} from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'

	export default {
		data() {
			return {
				upPhotoFlag: true,//添加图片的开关
				cancleFlage: false,//照片取消按钮的开关
				fileList: [],//存储请求接口之前的文件对象
				editorOption: {},
				data: {},//接受数据
				length: '',//新增后是否改变当前页数的判断
				pagesize: '',
				total:'',
				currentPage: '',
				ruleForm: {
					id: '',//
					name: '',//产品名称
					content: '',
					createBy: '',//创建人
					fileList: []//存储转换的绝对路径
				},
				rules: {
					name: [
						{required: true, message: '请输入活动名称', trigger: 'blur'},
						{min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
					],
					fileList: [
						{type: 'array', required: true, message: '请至少选择一张照片', trigger: 'change'}
					],
					content: [
						{required: true, message: '请填写产品介绍', trigger: 'blur'}
					]
				}
			}
		},
		created() {
			this.$nextTick(() => {
				this.getData()
			})
			this.length = this.$route.query.length
			this.total = this.$route.query.total
			this.pagesize = JSON.parse(sessionStorage.getItem('pagesize'))
			this.currentPage = JSON.parse(sessionStorage.getItem('currentPage'))

		},
		methods: {
			uploadPhoto(e) {
				e.preventDefault();
				this.ruleForm.fileList = []
				this.fileList = []
				const that = this;
				const files = e.target.files;
				if (files.length > 1) {
					that.$message.warning("请上传一张图片");
					return;
				}
				// const files = this.$refs.avatar.files[0]
				const imgsrc = window.URL.createObjectURL(e.target.files[0])
				this.fileList.push(files[0])
				const img = new Image()
				img.src = imgsrc
				img.onload = function () {
					if ((img.width < 900) && (img.height < 900)) {
						if (that.fileList[0].size > 1024 * 1024) {
							that.fileList.splice(1, 0)
							alert('文件太大')
						}
						const dataFile = new FormData();
						dataFile.append('file', that.fileList[0], that.fileList[0].name);
						that.getPhotoPath(dataFile)
					} else {
						e.target.value = null
						alert('fail')
					}
				}
				e.target.value = ''

			},
			// 兼容处理
			createObjectURL(object) {
				if (window.URL.createObjectURL(object)) {
					return window.URL.createObjectURL(object)
				}
				if (window.webkitURL.createObjectURL(object)) {
					return window.webkitURL.createObjectURL(object)
				}
				if (URL.createObjectURL(object)) {
					return URL.createObjectURL(object)
				}

			},
			// 删除图片
			deleltePhoto(item, i) {
				this.ruleForm.fileList.splice(i, 1)
				this.upPhotoFlag = true
			},

			// 获取图片的绝对路径
			getPhotoPath(dataFile) {
				this.$http({
					url: "/uploadManager/v1/feign/upload/uploadFile",
					method: "POST",
					data: dataFile,
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				})
					.then(res => {
						if (res.data.code == 200 && res.status == 200) {
							this.ruleForm.fileList = []
							this.ruleForm.fileList[0] = 'http://ycbg.oss-cn-qingdao.aliyuncs.com/' + res.data.data[0].relativePath
							if (this.ruleForm.fileList.length == 1) {
								this.upPhotoFlag = false
							}
							console.log(this.ruleForm)
							// =====  重新做调用
						} else {
							// alert(res.data.message + "," + res.data.data);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},

			// 表单操作
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.$route.query.id) {
							this.$http({
								method: 'POST',
								url: 'v1/base/feign/company/updateList',//添加的接口
								data: {
									id: JSON.stringify(this.ruleForm.id),
									content: JSON.stringify(this.ruleForm.content),
									thumb: JSON.stringify(this.ruleForm.fileList),
									listName: JSON.stringify(this.ruleForm.name),
									updateBy: '01',
									tabulationType: '1'
								},
								headers: {
									// "Content-Type": "multipart/form-data",
									"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
								}
							}).then(res => {
								console.log(res)

								//这里进行判断必须的属性是否有如果没有不能跳转
								if (res.data.code === 200 && res.status === 200) {
									this.$message({
										type: 'success',
										message: '编辑成功',
									});
									this.$router.push({name: 'comNumPrductList'})

								}
							})
						} else {
							this.$http({
								method: 'POST',
								url: 'v1/base/feign/company/saveList',//添加的接口
								data: {
									companyId: '22',
									content: JSON.stringify(this.ruleForm.content),
									thumb: JSON.stringify(this.ruleForm.fileList),
									listName: JSON.stringify(this.ruleForm.name),
									createBy: '1',
									tabulationType: '1'
								},
								headers: {
									"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
								}
							}).then(res => {
								console.log(res)
								if (res.data.code === 200 && res.data.sysCode === 200) {
									if(this.length3<this.pagesize3&&this.total3/this.pagesize3!==0){
										this.currentPage3 = Math.ceil(this.total3/this.pagesize3)
									}
									if (this.length == this.pagesize&&this.total/this.pagesize!==0) {
										this.currentPage = this.total/this.pagesize+1

									}
									sessionStorage.setItem('currentPage', this.currentPage);
									this.$message({
										type: 'success',
										message: '添加成功',
									});
									this.$router.push({name: 'comNumPrductList'})


								}
							})
						}

						// 成功之后需要发送请求把数据发到接口上。
						// 并且在列表页面请求获取渲染
					} else {
						this.$message('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 获取数据
			getData() {
				if (this.$route.query.id) {
					this.data = JSON.parse(this.$route.query.data)
					this.ruleForm.fileList = this.data.companyRelevance
					if (this.ruleForm.fileList.length == 1) {
						this.upPhotoFlag = false
					}
					this.ruleForm.id = this.data.id

					this.ruleForm.name = this.data.listName
					this.ruleForm.content = this.data.content
					this.ruleForm.createBy = this.data.createBy
				}

				// ======ruleForm{fileList content name}需要和  this.data接受的数据联动起来
			},
		},
		components: {
			quillEditor
		}
	}
</script>
<style lang="scss">
	.comNumEditPrduct-container {
		min-width: 800px;
		font-family: 'Microsoft YaHei UI';
		background: #fff;
		padding: 20px 20px 2px 20px;

		.el-input {
			width: 300px;

			.el-input__inner {
				border-radius: 3px;
			}
		}

		input {
			height: 30px;
		}

		.myQuillEditor {
			margin-top: 10px;
			border-radius: 3px;

			.ql-toolbar.ql-snow {
				border-radius: 3px 3px 0 0;
			}

			.ql-container.ql-snow {
				border-radius: 0 0 3px 3px;

			}
		}

		.ql-toolbar.ql-snow + .ql-container.ql-snow {
			height: 339px;
		}

		.el-form-item__label {
			padding-right: 15px;
			color: #303133;
			font-size: 14px;
		}

		.el-form-item__content {
			text-indent: 0;

		}

		.el-form-item:last-child {
			.el-form-item__content {
				margin-left: 0 !important;

				.el-button {
					width: 109px;
					height: 40px;
					margin-top: 25px;
					color: #fff;
					background: #4278BE;
					border-radius: 3px;
				}
			}
		}
	}

	.uploadImgBtn {
		display: inline-block;
		min-width: 400px;

		font-size: 0;
		cursor: pointer;

		-webkit-background-size: cover;
		background-size: cover;

		.promt-info {
			transform: translateX(100%);
			-ms-transform: translateX(100%);
			-moz-transform: translateX(100%);
			-webkit-transform: translateX(100%);
			-o-transform: translateX(100%);
		}

		.canclebtn {
			transform: translate(50%, -50%);
			-ms-transform: translate(50%, -50%);
			-moz-transform: translate(50%, -50%);
			-webkit-transform: translate(50%, -50%);
			-o-transform: translate(50%, -50%);
		}
	}

	.uploadImgBtn .uploadImg {

		backgroud: pink;
		width: 100px;
		height: 100px;
		line-height: 100px;
		opacity: 1;
		cursor: pointer;
	}

	.pic {
		width: 100px;
		height: 100px;
	}

	.pic img {
		width: 100%;
		height: 100%;
	}

</style>
