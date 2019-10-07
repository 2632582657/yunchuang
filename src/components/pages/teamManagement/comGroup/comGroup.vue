<template>
	<div class="comGroup-container">
		<div class="comGroup-title">
			<el-row>
				<el-col :span="14">
					<div class="grid-content bg-purple">
						<span>内刊名称:</span>
						<el-input v-model="input" placeholder="输入内刊标题关键字"></el-input>
						<template>
							<div class="block">
								<span class="demonstration">上传时间</span>
								<el-date-picker
									v-model="value1"
									type="daterange"
									range-separator="-"
									start-placeholder="开始日期"
									end-placeholder="结束日期">
								</el-date-picker>
							</div>
						</template>
					</div>
				</el-col>
				<el-col :span="10">
					<div class="grid-content bg-purple-light">
						<template>
							<span>上传人</span>
							<el-select v-model="valuePerson" placeholder="请选择">
								<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</template>
						<el-button type="primary">查询</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="comGroup-main">
			<div class="showLevel" @click.stop="()=>{columeFlag=true}"><p>创建内刊</p></div>
			<template v-for="(item,index) in GroupDate1">
				<div class="showLevel floor" @mouseenter="()=>{item.hideLevelFlag=true}"
					 @mouseleave="()=>{item.hideLevelFlag=false}">
					<img :src="item.url">
					<span>刊期第{{item.num}}期</span>
					<span>上传人:{{item.name}}</span>
					<div class="hideLevel" v-show="item.hideLevelFlag">
						<el-button type="primary" @click.stop="handleEditGroup(item,index)">编辑</el-button>
						<el-button type="danger" @click.stop="handleDeletGroup(item,index)">删除</el-button>
						<el-button @click.stop="_loadFile('http://ycbg.oss-cn-qingdao.aliyuncs.com/file/2019-08-28/c7f6bf7d63a54aea9a918988c62f2d1d-丝绸之路：一部全新的世界史.pdf')">预览</el-button>
						<el-button type="primary"><a href="/user/test/xxxx.txt" download="文件名.txt">下载</a></el-button>
					</div>
				</div>
			</template>
			<div class="showLevel floor" @mouseenter="()=>{hideLevelFlag=true}" @mouseleave="()=>{hideLevelFlag=false}">
				<img
					src="http://ycbg.oss-cn-qingdao.aliyuncs.com/file/2019-08-28/2f1ebad2b7f948fd84a377c4dc21ff73-f603918fa0ec08fa3139e00153ee3d6d55fbda5f.jpg">
				<span>云创办公示例</span>
				<div class="hideLevel sample" v-show="hideLevelFlag">
					<el-button>预览</el-button>
					<el-button type="primary">下载</el-button>
				</div>
			</div>
		</div>
		<transition
			@before-enter="beforeEnter"
			@enter="enter"
			@leave="leave">
			<div class="GroupColumn-column" v-show="columeFlag">
				<div class="GroupColumn-column-title">
					创建/编辑内刊
					<span class="GroupColumn-column-close el-icon-close" @click="closeGroupColumn"></span>
				</div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="内刊名称" prop="name">
						<el-input v-model="ruleForm.name" placeholder="必填，分类名称最长5个字"></el-input>
					</el-form-item>
					<el-form-item label="缩略图" prop="fileList">
						<div class="upload-demo uploadImgBtn" id="uploadImgBtn" ref="uploadImgBtn">
							<div style="margin-top:10px;">
								<template v-for="(item,index) in ruleForm.fileList">
									<div
										style="width:189px;height:272px;display:inline-block;background:skyblue;margin-bottom:5px;vertical-align:top;border:1px solid #eee;position:relative;margin-right:25px;border-radius:3px;"
										@mouseenter.stop="()=> {cancleFlage=true}"
										@mouseleave="()=> {cancleFlage=false}">
								<span class="el-icon-remove-outline canclebtn"
									  style="position:absolute;right:0;top:0;background:gray;color:#fff;border-radius:50%;width:20px;height:20px;"
									  @click="deleltePhoto(item,index)" v-show="cancleFlage"></span>
										<img :src="ruleForm.fileList[index]" alt=""
											 style="display:inline-block;width:189px;height:272px;border-radius:3px;">
									</div>
								</template>
								<div class="el-icon-plus" v-show="upPhotoFlag"
									 style="background:#F8F8F8;width:189px;height:272px;line-height:272px;text-align:center;position:relative;font-size:12px;color:#606266;border-radius:3px">
									上传图片

									<input class="uploadImg el-icon-plus" type="file" accept="image/jpg" name="file"
										   multiple
										   @change="uploadPhoto($event)" ref="Photo"
										   style="opacity: 0;position:absolute;left:0;width:100%;height:100%;">
								</div>

							</div>
							<span class="promt-info"
								  style="width:189px;height:272px;text-align:left;color:#909399;font-size:11px;">
								建议上传封面尺寸为：189X272，支持封面格式：jpg,png</span>

						</div>
					</el-form-item>
					<el-form-item label="上传内刊" prop="fileListGroup">
						<el-upload
							class="upload-demo"
							action=""
							:on-change="handleChange"
							:auto-upload="true"
							:http-request="sendRequest"
							:before-upload="beforeUpload"
							:file-list="ruleForm.fileListGroup">
							<el-button size="small" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">支持内刊格式:pdf</div>
						</el-upload>
					</el-form-item>

					<el-form-item class="GroupColumn-column-submit">
						<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
						<!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
					</el-form-item>
				</el-form>

			</div>
		</transition>
		<el-dialog
			:close-on-click-modal="false"
			:visible.sync="dialogVisible"
			:fullscreen="true"
			title="文件预览">
			<div class="agreement_picture">
				<div class="pdf">
					<iframe :src="src" frameborder="0" style="width: 100%; height: 100%"></iframe>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
            <div class="tip-left transfer">
                <el-button type="info" @click="dialogVisible=false">不同意</el-button>
              <el-button type="danger" @click="agreeSignFun">同意</el-button>
            </div>
          </span>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				src: '', //pdf地址,这里我用的是我本地的文件,你也可以使用后台的文件
				dialogVisible: false,
				defaultDate: [{
					url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
					creatTime: '2019-8-28',
					name: '示例',
					num: '1',
					hideLevelFlag: false
				}],//默认展示的内刊示例
				GroupDate1: [
					{
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
						creatTime: '2019-8-28',
						name: '王小明',
						num: '1',
						type: '',//接收文件名下载用
						hideLevelFlag: false
					},
					{
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
						creatTime: '2019-8-28',
						name: '王小明',
						num: '2',
						type: '',//接收文件名下载用
						hideLevelFlag: false
					},
					{
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
						creatTime: '2019-8-27',
						name: '粉底哦',
						num: '3',
						type: '',//接收文件名下载用
						hideLevelFlag: false

					},
					{
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
						creatTime: '2019-8-28',
						name: '里斯',
						num: '4',
						type: '',//接收文件名下载用
						hideLevelFlag: false

					},
					{
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
						creatTime: '2019-8-26',
						name: '额按',
						num: '5',
						type: '',//接收文件名下载用
						hideLevelFlag: false

					},
				],//内刊模拟数据
				pages:[],
				editGroupFlag: false,//是否处于编辑状态的开关
				editForm: '',//接收当前需要编辑的对应信息
				hideLevelFlag: false,//内刊封面操作层开关
				fileList: [],
				fileListGroup: [],
				dataFileGroup: '',
				GroupDate: [],//接收内刊数据
				upPhotoFlag: true,
				cancleFlage: false,//图片取消按钮
				//存储右侧弹窗的信息
				ruleForm: {
					name: '',
					fileList: [],//内刊封面
					fileListGroup: []//文件
				},
				rules: {
					name: [
						{required: true, message: '请输入分类名称', trigger: 'blur'},
						{min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
					],
					fileList: [
						{required: true, message: '请选择封面图片', trigger: 'change'},
					],
					fileListGroup: [
						{required: true, message: '请选择文件', trigger: 'change'},
					]
				},
				columeFlag: false,//右侧边栏开关

				input: '',//内刊名称
				value1: '',//时间选择
				valuePerson: '',//上传人

				options: [{
					value: '选项1',
					label: '黄金糕'
				}, {
					value: '选项2',
					label: '双皮奶'
				}, {
					value: '选项3',
					label: '蚵仔煎'
				}, {
					value: '选项4',
					label: '龙须面'
				}, {
					value: '选项5',
					label: '北京烤鸭'
				}],
			}
		},
		methods: {
			_loadFile(pdfFileUrl) {
				// window.open('/static/pdf/web/viewer.html?file=http://ycbg.oss-cn-qingdao.aliyuncs.com/file/2019-08-28/c7f6bf7d63a54aea9a918988c62f2d1d-丝绸之路：一部全新的世界史.pdf');
				this.src = pdfFileUrl
				this.dialogVisible = true
			},
			agreeSignFun() {
				this.dialogVisible = false

			},
			//右侧弹窗关闭功能
			closeGroupColumn() {
				this.editGroupFlag = false
				this.columeFlag = false
			},
			//编辑功能
			handleEditGroup(item, index) {
				this.editForm = item
				this.editGroupFlag = true
				this.columeFlag = true

			},
			//删除功能
			handleDeletGroup(item, index) {
				this.GroupDate1.splice(index, 1)
				// this.$http({
				// 	// url: "v1/feign/upload/uploadFile",
				// 	method: "POST",
				// 	data: this.dataFileGroup,
				// 	headers: {
				// 		"Content-Type": "multipart/form-data",
				// 		"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
				// 	}
				// })
				// 	.then(res => {
				// 		console.log(res)
				// 		if (res.data.code == 200 && res.status == 200) {
				// 			console.log(this.ruleForm)
				// 		}
				// 		this.getGroupDate()
				// 	})
				// 	.catch(err => {
				// 		console.log(err);
				// 	});

			},
			//获取内刊展示数据
			getGroupDate() {
				this.$http({
					// url: "v1/feign/upload/uploadFile",
					method: "POST",
					data: this.dataFileGroup,
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				})
					.then(res => {
						console.log(res)
						if (res.data.code == 200 && res.status == 200) {
							console.log(this.ruleForm)
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			handleChange() {

			},
			beforeUpload(file) {
				this.ruleForm.fileListGroup = []
				this.fileListGroup = []
				const that = this;
				console.log(file)
				const isIMG =
					file.type === 'application/pdf'
				if (!isIMG) {
					that.$message.warning("仅支持pdf格式");
					return;
				}
				that.fileListGroup.push(file)
				if (that.fileListGroup[0].size > 1024 * 1024) {
					that.fileListGroup.splice(1, 0)
					alert('文件太大')
				}
				this.dataFileGroup = new FormData();
				this.dataFileGroup.append('file', that.fileListGroup[0], that.fileListGroup[0].name);
			},
			sendRequest() {
				this.$http({
					url: "/uploadManager/v1/feign/upload/uploadFile",
					method: "POST",
					data: this.dataFileGroup,
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				})
					.then(res => {
						console.log(res)
						if (res.data.code == 200 && res.status == 200) {
							this.ruleForm.fileListGroup = []
							this.ruleForm.fileListGroup[0] = {}
							this.ruleForm.fileListGroup[0].name = res.data.data[0].newFileName
							this.ruleForm.fileListGroup[0].url = 'http://ycbg.oss-cn-qingdao.aliyuncs.com/' + res.data.data[0].relativePath
							if (this.ruleForm.fileListGroup.length == 1) {
								// this.upPhotoFlag = false
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
			//上传图片
			uploadPhoto(e) {
				e.preventDefault();
				this.ruleForm.fileList = []
				this.fileList = []
				const that = this;
				const files = e.target.files;
				const isIMG =
					files[0].type === 'image/jpg' ||
					files[0].type === 'image/jpeg' ||
					files[0].type === 'image/jpe'
				if (!isIMG) {
					that.$message.warning("图片格式不正确");
					return;
				}
				if (files.length > 1) {
					that.$message.warning("请上传一张图片");
					return;
				}
				that.fileList.push(files[0])
				if (that.fileList[0].size > 1024 * 1024) {
					that.fileList.splice(1, 0)
					alert('图片太大')
				}
				const dataFile = new FormData();
				dataFile.append('file', that.fileList[0], that.fileList[0].name);
				that.getPhotoPath(dataFile)

				e.target.value = ''

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
			// 删除封面图片
			deleltePhoto(item, i) {
				this.ruleForm.fileList.splice(i, 1)
				this.upPhotoFlag = true
			},
			//右侧弹窗动画
			beforeEnter(el) {
				el.style.opacity = 0
				el.style.transform = "translateX(100%)"
			},
			enter(el) {
				el.offsetWidth;
				el.style.opacity = 1
				el.style.transform = "translateX(0)"
				el.style.transition = "all 0.5s linear"
			},
			leave(el) {
				this.comFlag = false
				el.style.transition = "all 0s linear"
			},
			submitForm(formName) {
				this.editGroupFlag = false
				this.columeFlag = false
				if (!this.editFlag) {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							this.$http({
								method: 'POST',
								// url: 'v1/oa/company/saveCompanyNoticeClassify',//查询接口
								data: {
									// classifyName: JSON.stringify(this.ruleForm.name),//远程搜索框存储数据
									companyId: '1'
								},
								headers: {
									"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2MzkxOTk1LCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTU3NDcwMiwidXNlcklkIjoyMDA0ODQ1Njg4NjAxNzIyODh9.bXYjlXIh_nyf1nAglp1pdf4osOSAzQ7Y7bt5l0ix4Og'
								}
							}).then(res => {
								console.log(res)

								if (res.data.code === 200 && res.data.sysCode === 200) {
									this.getGroupDate()
								}
							})
						} else {
							this.$message('error submit!!');
							return false;
						}
					});
					return
				}
			},

		}
	}
</script>
<style lang="scss">
	.comGroup-container {
		background: #fff;
		height: 750px;
		padding: 20px 30px;
		min-width: 920px;

		.comGroup-title {
			.bg-purple {
				.el-input {
					width: 150px;
					font-size: 12px;

					.el-input__inner {
						height: 30px;
					}
				}

				.block {
					display: inline-block;

					.el-range-editor.el-input__inner {
						width: 200px;
						font-size: 12px;
						height: 30px;

						.el-range__icon {
							line-height: 23px;
						}

						.el-range-separator {
							line-height: 20px;
						}

						.el-range-input {
							font-size: 12px;

						}
					}
				}

			}

			.bg-purple-light {
				.el-input--suffix {
					font-size: 12px;

					.el-input__inner {
						height: 30px;
						width: 150px;
					}

					.el-input__icon {
						line-height: 30px !important;
					}
				}

				.el-button--primary {
					width: 150px;
					height: 30px;
					background: #4278BE;
					padding: 0;
					margin-left: 10px;
				}
			}
		}

		.comGroup-main {
			display: flex;
			display: -webkit-flex;
			margin-top: 20px;
			overflow: hidden;
			flex-wrap: wrap;
			-webkit-box-sizing: content-box;
			-moz-box-sizing: content-box;
			box-sizing: content-box;

			.showLevel {
				flex-grow: 0;
				flex-shrink: 0;
				margin-right: 25px;
				margin-bottom: 30px;
				width: 189px;

				img {
					display: inline-block;
					width: 100%;
					height: 272px;
				}

				span {
					display: block;
					padding-left: 20px;
				}

				&:first-child {
					line-height: 272px;
					border: 1px solid black;
					height: 272px;

					p {
						text-align: center;
					}
				}
			}

			.floor {
				position: relative;
			}

			.sample {
				padding-top: 70px !important;
			}

			.hideLevel {
				position: absolute;
				left: 0;
				top: 0;
				width: 189px;
				height: 272px;
				background: pink;
				padding-top: 32px;
				background: rgba(0, 0, 0, .5);
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;

				.el-button {
					display: block;
					margin: 15px auto;
					height: 30px;
					line-height: 5px;

					a {
						text-decoration: none;
						color: #fff;
					}

					span {
						padding-left: 0;
					}
				}
			}
		}

		.GroupColumn-column {
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

			.GroupColumn-column-title {
				height: 37px;
				padding-left: 40px;
				padding-top: 21px;
				font-size: 20px;
				color: #303133;
				overflow: hidden;
				-webkit-background-clip: text;
				border-bottom: 1px solid #EDEFF2;

				.GroupColumn-column-close {
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

			.GroupColumn-column-submit {
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
		.el-dialog {
			.el-dialog__body {
				height: 80%;
				.agreement_picture {
					height: 100%;
					.pdf {
						height: 100%;

					}
				}
			}

		}

	}

</style>
