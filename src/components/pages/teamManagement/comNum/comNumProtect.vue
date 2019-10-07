<template>
	<div class="comNumProtect-container">
		<el-form :model="ruleForm" :label-position="labelPosition" :rules="rules" ref="ruleForm" label-width="100px"
				 class="demo-ruleForm">
			<el-form-item label="公司logo:" prop="ruleForm" style="height:44px;line-height:44px;">
				<div class="upload-demo" ref="uploadImgBtn" style="height:46px;">
					<img :src="ruleForm.fileList1[0]" id="image-avatar" ref="imageAvatar"
						 style="display:inline-block;width:44px;height:44px;border:1px dashed black;vertical-align:top;">
					<div class=""
						 style="display:inline-block;height:100%;width:85px;display:inline-block;line-height:44px;text-align:center;position:relative;font-size:14px;color:#4278BE;margin-left:10px;">
						上传图片
						<img src="../image/上传图片.png"
							 style="display:inline-block;position:absolute;left:-5px;top:50%;transform:translateY(-50%);">
						<input class="uploadImg el-icon-plus" type="file" accept="image/*" name="file"
							   id="file" @change="uploadAvatar($event)" ref="avatar"
							   style="opacity: 0;width:90%;height:100%;position:absolute;left:0;padding-left:20px;">
					</div>
					<span style="display:inline-block;margin-left:-10px;color:#909399;font-size:12px;">建议上传图片尺寸为88*88，大小不超过1M</span>
				</div>
			</el-form-item>

			<el-form-item label="基础信息:" prop="info" style="position:relative">
				<div style="display:block;margin-top:18px;color:#606266;font-size:14px;">
					<p>公司名称：<span>{{comInfo.name}}</span></p>
					<p>所在行业：<span>{{comInfo.industry}}</span></p>
					<p>人员规模：<span>{{comInfo.count}}</span></p>
					<p>办公地点：<span>{{comInfo.place}}</span></p>
				</div>
				<template>
					<el-button class="modifybtn" type="text" @click="editor;push"
							   style="background:#fff;color:#4278BE;font-size:14px;text-align:right;">
						<img src="" alt="">
						修改
					</el-button>
				</template>
			</el-form-item>

			<el-form-item label="公司介绍:" prop="desc">
				<quill-editor ref="text" v-model="ruleForm.desc" class="myQuillEditor" :options="editorOption"/>
				<!-- <el-button type="primary" @click="submit">提交</el-button> -->
			</el-form-item>

			<el-form-item label="公司照片" prop="fileListCom">
				<div class="upload-demo uploadImgBtn" id="uploadImgBtn" ref="uploadImgBtn">
					<template v-for="(item,index) in ruleForm.fileListCom">
						<div
							style="width:222px;height:138px;display:inline-block;background:skyblue;float:left;vertical-align:top;border:1px solid #eee;position:relative;margin-right:25px;border-radius:3px;margin-bottom:5px;"
							@mouseenter.stop="()=> {cancleFlageCom=true}" @mouseleave="()=> {cancleFlageCom=false}">
								<span class="el-icon-remove-outline canclebtn"
									  style="position:absolute;right:0;top:0;background:gray;color:#fff;border-radius:50%;width:20px;height:20px;"
									  @click="deleltePhotoCom(item,index)" v-show="cancleFlageCom"></span>
							<img :src="ruleForm.fileListCom[index]" alt=""
								 style="display:inline-block;width:100%;height:100%;border-radius:3px;">
						</div>
					</template>
					<div class="el-icon-plus" v-show="upPhotoFlagcom"
						 style="background:#EDEFF2;height:138px;width:222px;line-height:120px;float:left;text-align:center;position:relative;color:#606266;border-radius:3px;">
						上传图片
						<p style="position:absolute;text-align:center;width:100%;margin-top:-100px;color:#aaa;font-size:12px;">
							(建议上传图片在20M以内)</p>
						<input class="uploadImg el-icon-plus" type="file" accept="image/*" name="file" multiple
							   @change="uploadPhotoCom($event)" ref="PhotoCom"
							   style="opacity: 0;position:absolute;left:0;width:100%;height:100%;">
					</div>

				</div>

			</el-form-item>

			<el-form-item label="企业文化" prop="region">
				<div style="margin-top:13px;">
					<el-input
						type="text"
						placeholder="简短说明，最长输入50个字"
						v-model="ruleForm.region"
						maxlength="50"
						show-word-limit
					>
					</el-input>
				</div>
			</el-form-item>

			<el-form-item label="资质荣耀" prop="fileList">
				<div class="upload-demo uploadImgBtn" ref="uploadImgBtn">
					<template v-for="(item,index) in ruleForm.fileList">
						<div
							style="width:222px;height:138px;display:inline-block;float:left;background:skyblue;vertical-align:top;border:1px solid #eee;position:relative;margin-right:25px;border-radius:3px;margin-bottom:5px;"
							@mouseenter.stop="()=> {cancleFlage=true}" @mouseleave="()=> {cancleFlage=false}">
								<span class="el-icon-remove-outline canclebtn"
									  style="position:absolute;right:0;top:0;background:gray;color:#fff;border-radius:50%;width:20px;height:20px;"
									  @click="deleltePhoto(item,index)" v-show="cancleFlage"></span>
							<img :src="ruleForm.fileList[index]" alt=""
								 style="display:inline-block;width:100%;height:100%;border-radius:3px;">
						</div>
					</template>
					<div class="el-icon-plus" v-show="upPhotoFlag"
						 style="background:#EDEFF2;height:138px;width:222px;float:left;line-height:120px;text-align:center;position:relative;color:#606266;border-radius:3px;">
						上传图片
						<p style="position:absolute;text-align:center;width:100%;margin-top:-100px;color:#aaa;font-size:12px;">
							(建议上传图片在20M以内)</p>
						<input class="uploadImg el-icon-plus" type="file" accept="image/*" name="file" multiple
							   @change="uploadPhoto($event)" ref="Photo"
							   style="opacity: 0;position:absolute;left:0;width:100%;height:100%;">
					</div>

				</div>

			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
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
				labelPosition: 'top',
				i1: '',//存储变量i
				i2: '',//存储变量i
				up: false,//决定是否上传
				fileList1: [],//存储上传头像的绝对路径
				upPhotoFlag: true,//添加荣誉图片的开关
				upPhotoFlagcom: true,//添加公司图片的开关
				cancleFlage: true,
				cancleFlageCom: false,//照片取消按钮的开关
				fileListCom: [],//存储公司图片地址
				fileList: [],//存储荣誉图片地址

				editorOption: {},
				comInfo: {
					name: "青岛蓝海汇网络科技有限公司",
					industry: "计算机软件",
					count: "100-499",
					place: "山东省青岛市市北区XX路XXX号XXXX大厦X楼XXXX"
				},
				ruleForm: {
					id:'',
					region: '',//企业文化
					fileList: [],//存储荣誉墙转换的绝对路径
					fileListCom: [],//存储公司照片的绝对路径
					comInfo: {},//存储基本信息
					fileList1: [],//存储上传头像的绝对路径
					desc: '',//公司介绍

				},
				rules: {
					desc: [
						{required: true, message: '请输入公司介绍', trigger: 'blur'}
					]
				}
			};
		},
		created() {
			this.getBackInfo()
		},
		methods: {
			// 删除图片
			deleltePhotoCom(item, i) {
				this.ruleForm.fileListCom.splice(i, 1)
				this.upPhotoFlagcom = true
			},
			deleltePhoto(item, i) {
				this.ruleForm.fileList.splice(i, 1)
				this.upPhotoFlag = true
			},
			// 获取,logo的绝对路径
			getPhotoPathAvatar(dataFile) {
				this.$http({
					url: "http://192.168.10.12:7003/uploadManager/v1/feign/upload/uploadFile",
					method: "POST",
					data: dataFile,
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				})
					.then(res => {
						if (res.data.code == 200 && res.status == 200) {
							// this.fileList1=[]
							// this.fileList1[0]
							this.ruleForm.fileList1 = []
							this.ruleForm.fileList1[0] = 'http://ycbg.oss-cn-qingdao.aliyuncs.com/' + res.data.data[0].relativePath
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
			// 获取图片的绝对路径
			getPhotoPath() {
				let that = this
				let dataFile = new FormData();
				for (let i = 0; i < that.fileList.length; i++) {
					dataFile.append('file', that.fileList[i], that.fileList[i].name);
				}
				this.$http({
					url: "http://192.168.10.12:7003/uploadManager/v1/feign/upload/uploadFile",
					method: "POST",
					data: dataFile,
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				})
					.then(res => {
						console.log(res)
						if (res.data.code == 200 && res.status == 200) {
							for (var i = 0; i < res.data.data.length; i++) {
								this.ruleForm.fileList.push('http://ycbg.oss-cn-qingdao.aliyuncs.com/' + res.data.data[i].relativePath)
							}
							if (this.ruleForm.fileList.length > 8) {
								that.upPhotoFlag = false
								if (this.ruleForm.fileList.length > 9) {
									this.ruleForm.fileList.splice(8, this.ruleForm.fileList.length - 9)
									// console.log(this.fileList)

								}
							}
							console.log(this.ruleForm.fileList)
						} else {
							// alert(res.data.message + "," + res.data.data);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			// 公司的获取绝对路径的方法
			getPhotoPathCom() {
				let that = this
				let dataFile = new FormData();
				for (let i = 0; i < that.fileListCom.length; i++) {
					dataFile.append('file', that.fileListCom[i], that.fileListCom[i].name);
				}
				this.$http({
					url: "http://192.168.10.12:7003/uploadManager/v1/feign/upload/uploadFile",
					method: "POST",
					data: dataFile,
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				})
					.then(res => {
						console.log(res)
						if (res.data.code == 200 && res.status == 200) {
							for (var i = 0; i < res.data.data.length; i++) {
								this.ruleForm.fileListCom.push('http://ycbg.oss-cn-qingdao.aliyuncs.com/' + res.data.data[i].relativePath)
							}
							if (this.ruleForm.fileListCom.length > 8) {
								that.upPhotoFlagcom = false
								if (this.ruleForm.fileListCom.length > 9) {
									this.ruleForm.fileListCom.splice(9, this.ruleForm.fileListCom.length - 9)
									// console.log(this.fileList)
								}
							}
							console.log(this.ruleForm.fileListCom)
						} else {
							// alert(res.data.message + "," + res.data.data);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			uploadPhoto(file) {
				file.preventDefault();
				// this.ruleForm.fileListCom=[]
				this.fileList=[]
				var that = this

				var files = file.target.files || file.dataTransfer.files


				for (var i = 0; i < files.length; i++) {
					if (files[i].size >= 20971520) {   //20M
						this.$message.warning("文件超过20M，无法上传");
						return;
					}
					that.fileList.push(files[i])

					// ======解决同一照片不能重复上传问题
				}
				file.target.value = ''
				that.getPhotoPath()
			},
			// 添加公司图片
			uploadPhotoCom(file) {
				file.preventDefault();
				// this.ruleForm.fileListCom=[]
				this.fileListCom = []
				var that = this
				var files = file.target.files || file.dataTransfer.files
				for (var i = 0; i < files.length; i++) {
					if (files[i].size >= 20971520) {   //20M
						this.$message.warning("文件超过20M，无法上传");
						return;
					}
					that.fileListCom.push(files[i])
					// ======解决同一照片不能重复上传问题
				}
				file.target.value = ''
				that.getPhotoPathCom()
			},
			// 上传logo照片
			uploadAvatar(e) {
				e.preventDefault();
				this.ruleForm.fileList1 = []
				this.fileList1 = []
				let that = this;
				const files = e.target.files;
				if (files.length > 1) {
					that.$message.warning("请上传一张图片");
					return;
				}
				// const files = this.$refs.avatar.files[0]
				let imgsrc = window.URL.createObjectURL(e.target.files[0])
				this.fileList1.push(files[0])
				let img = new Image()
				img.src = imgsrc
				img.onload = function () {
					if ((img.width < 900) && (img.height < 900)) {
						if (that.fileList1[0].size > 1024 * 1024) {
							that.fileList1.splice(1, 0)
							alert('文件太大')
						}
						const dataFile = new FormData();
						dataFile.append('file', that.fileList1[0], that.fileList1[0].name);
						that.getPhotoPathAvatar(dataFile)
					} else {
						e.target.value = null
						alert('fail')
					}
				}
				e.target.value = ''
			},
			getBackInfo() {
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/queryBase',
					params: {
						companyId: '1'

					},
					// headers: {
					//   "Content-Type": "application/json",
					//   "Access_Token":'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY1NjYyMjk1LCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MDg0NjI5NSwidXNlcklkIjoyMDAyNjE2MTgxMTg0MTAxMTJ9.yxKAI6KuAC_A022qv8XawLXxyCk-Qbxna0YM8cE_NoM'
					// }
				}).then(res => {
					// debugger
					console.log(res)
					if (res.data.code === 200 && res.status === 200) {
						if(res.data.data.id){
							this.ruleForm.id = JSON.parse(res.data.data.id)
							this.ruleForm.fileList = JSON.parse(res.data.data.companyRelevance.honourQualification)
							this.ruleForm.desc = JSON.parse(res.data.data.introduction)
							this.ruleForm.region = JSON.parse(res.data.data.culture)
							this.ruleForm.fileListCom = JSON.parse(res.data.data.companyRelevance.picture)
							this.ruleForm.fileList1 = JSON.parse(res.data.data.companyRelevance.honourQualification)
						}

					}
				}).catch(res => {
					console.log(res)
				})
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(!this.ruleForm.id){
						if (valid) {
							this.$http({
								url: "v1/base/feign/company/saveBase",
								method: "POST",
								data: {
									companyId: 1,
									introduction:JSON.stringify(this.ruleForm.desc),
									culture:JSON.stringify(this.ruleForm.region),
									createBy:'2',
									picture:JSON.stringify(this.ruleForm.fileListCom),
									honourQualification:JSON.stringify(this.ruleForm.fileList)
								},
								headers: {
									"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
								}
							}).then(res => {
								console.log(res)
								if (res.data.code == 200 && res.status == 200) {
									this.$router.push({name: 'comNumPreview'})
								} else {
								}
							}).catch(err => {
								console.log(err);
								this.$message('上传不成功')
							});
							//=====发送接口请求
						}
					}else {
						this.$http({
							url: "v1/base/feign/company/updateBase",
							method: "POST",
							data: {
								id: JSON.stringify(this.ruleForm.id),
								introduction:JSON.stringify(this.ruleForm.desc),
								culture:JSON.stringify(this.ruleForm.region),
								updataBy:'2',
								picture:JSON.stringify(this.ruleForm.fileListCom),
								honourQualification:JSON.stringify(this.ruleForm.fileList)
							},
							headers: {
								"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
							}
						}).then(res => {
							console.log(res)
							if (res.data.code == 200 && res.status == 200) {
								this.$router.push({name: 'comNumPreview'})
							} else {
							}
						}).catch(err => {
							console.log(err);
							this.$message('上传不成功')
						});
						//=====发送接口请求
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			editor(index, data) {
				// console.log(index)
				// console.log(data)
			},
			push() {
				// 点击“去修改”按钮跳转“更多设置”页面进行企业基础信息的修改
				this.$router.push()
			},
			submit() {
				console.log(this.$refs.text.value)
			},

		},
		components: {
			quillEditor
		}
		// editorOption里是放图片上传配置参数用的，例如：
// action:  '/api/product/richtext_img_upload.do',  // 必填参数 图片上传地址
// methods: 'post',  // 必填参数 图片上传方式
// token: '',  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
// name: 'upload_file',  // 必填参数 文件的参数名
// size: 500,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
// accept: 'multipart/form-data, image/png, image/gif, image/jpeg, image/bmp, image/x-icon,image/jpg'  // 可选 可上传的图片格式
	}
</script>
<style lang="scss">
	/*这是空白格*/
	.comNumProtect-container {
		background: #fff;
		padding: 0 19px;
		min-width: 800px;
		.el-form-item__label {
			display: block;
			text-align: left !important;
			height: 20px;
			line-height: 20px;
			color: #303133;
			font-weight: bold;
			text-align: center;
			padding-right: 0;
			transform: translateY(50%);
			-ms-transform: translateY(50%);
			-moz-transform: translateY(50%);
			-webkit-transform: translateY(50%);
			-o-transform: translateY(50%);
			border-left: 8px solid #4278BE;


		}

		.upload-demo {
			display: inline-block;
			padding-left: 10px;

			img {
				background: url('../image/Group.png') no-repeat;

			}

		}

		.el-form-item__content {
			overflow: hidden;

		}

		.el-form-item .myQuillEditor {
			margin-top: 30px;
			border-radius: 3px;

			.ql-toolbar.ql-snow {
				border-radius: 3px 3px 0 0;
			}

			.ql-container.ql-snow {
				border-radius: 0 0 3px 3px;

			}
		}

		.uploadImgBtn {
			display: block;
			min-width: 400px;
			height: 138px;
			max-height: 450px;

			position: relative;
			font-size: 0;
			margin-top: 25px;
			cursor: pointer;
			border: none;
			-webkit-background-size: cover;
			background-size: cover;

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

		.el-form-item {
			margin-bottom: 0;
			padding: 10px 0 20px;;
			border-bottom: 1px solid #EDEFF2;
			height: 100%;

			&:first-child {
				overflow: hidden;
				padding: 20px 0;

				.el-form-item__label {
					float: left;
				}
			}

			.ql-toolbar.ql-snow + .ql-container.ql-snow {
				height: 323px;
			}

			.myQuillEditor {
				position: relative;
			}

			.el-input {
				margin-top: 19px;
				width: 740px;

				.el-input__inner {
					width: 100%;
					border-radius: 3px;
				}
			}
		}

		.el-button {
			width: 109px;
			color: #fff;
			font-size: 14px;
			background: #4278BE;
			height: 40px;
			border-radius: 3px;
			margin: 27px 0 50px;
		}

		.modifybtn {
			position: absolute;
			top: 0;
			right: 0;
			margin: 0;

		}

		.space {
			height: 8px;
			background: #eee;

		}

		.avatar-uploader .el-upload {
			border: 1px solid #d9d9d9;
			cursor: pointer;
			position: relative;
			overflow: hidden;
		}

		.avatar-uploader .el-upload:hover {
			border-color: #409EFF;
		}

		.avatar-uploader-icon {
			font-size: 28px;
			color: #8c939d;
			width: 70px;
			height: 70px;
			line-height: 70px;
			text-align: center;
		}

		.avatar {
			width: 70px;
			height: 70px;
			display: block;
		}

		.img-b {

		}

	}


</style>
