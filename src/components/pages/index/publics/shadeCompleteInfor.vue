<!--@description: 主页=>弹出框设置密码
	@author: 刘钰
    @update: 刘钰(2019-05-10 16:56) -->
<template>
	<div class="setUserInfoBox">
		<!-- <el-button type="text" @click="dialogFormVisible = true">完善信息</el-button> -->
		<el-dialog title="完善信息" :visible.sync="dialogFormVisible" :close-on-click-modal="closeModal" class="Infor">
			<div slot="title" class="header-title clear" style="border-bottom:1px solid #BFC2CC;height:42px;">
                <div style="width:16px;height:23px;background:#4278BE;float:left;margin-top:4px;margin-left:30px"></div>
                <div style="width:98px;height:31px;font-size:20px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:31px;float:left;margin-left:10px">完善信息</div>
				<div class="fr" style="margin:10px 40px 0 0;color:#4278BE;cursor: pointer;" @click="dialogFormVisible = false">跳过</div>
            </div>
			<el-form :model="form" :rules="rules" ref="ruleForm" >
				<div style="width:80px;height:80px;margin:0 auto">
					<template v-if="fileList != ''">
						<img :src="fileList" alt="" width="44px" height="44px" style="display:block;margin:0 0 5px 6px">
					</template>
					<template v-else>
						<img src="../images/head.png" alt="" width="44px" style="display:block;margin:0 0 5px 6px">
					</template>
					<el-upload
						class="upload-demo"
						:headers="head"
						:http-request='submitUpload'
						action="http://180.76.51.213:7003"
					>
					<!-- :before-upload="beforeUpload" -->
						<div style="color:#4278BE;">更换头像</div>
					</el-upload>
				</div>
				<el-form-item label="姓名" :label-width="formLabelWidth" prop="name" class="name">
					<el-input 
						type="text"  
						placeholder="请输入真实姓名"
						v-model="form.name"
						></el-input>
					<!-- <p class="inforHint">{{inforTitle}}</p> -->
				</el-form-item>
				<el-form-item label="性别" :label-width="formLabelWidth" prop="radio" style="margin-top:20px">
					<div class="redioBox">
						<el-radio v-model="form.radio" label=1  checked="checked">男</el-radio>
						<el-radio v-model="form.radio" label=0>女</el-radio>
					</div>
				</el-form-item>
				<el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
					<el-date-picker
						v-model="form.age"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="选择生日">
					</el-date-picker>
				</el-form-item>
				<div style="display:none" >{{ exitsVal }}</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<button type="button" @click="nextStep()" :class="reg ? 'completes' : 'complete'" :disabled="reg">完成</button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Bus from '@/modules/bus.js';
	export default {
		name:'shadeCompleteInfor',
		data() {
			const nametxt = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入姓名'))
				} else {
					const reg =  /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,6}$/
					if (value.length > 1 && reg.test(value)) {
					callback()
					} else {
					return callback(new Error('请输入2-6个汉字'))
					}
				}
			}
			return {
				ssoManager:'ssoManager',
				dialogFormVisible: false,//弹出框
				closeModal:false,//点击蒙层不关闭
				form: {
					radio:"",
					name:"", //姓名
					age:'', //生日
				},
				rules:{
					radio:[
						{ required: true, message: '请选择性别', trigger: 'change' }
					],
					name:[
						{ required: true, validator: nametxt, trigger: 'blur' },
					],
					age:[
						{ required: true, message: '请选择年龄', trigger: 'change' },
					]
				},
				ifExist:'',
				head: {
					Platform: 'H5',
					Access_Token: sessionStorage.getItem('token')
				},
				//label框宽度
				formLabelWidth: '55px',
				userId:'',
				fileList: '',
				inforTitle:'',
				reg:false,
			};
		},
		created () {
			this.loadUserData()
		},
		computed:{
			exitsVal:function(){
				this.ifExist=Number(Boolean(this.form.radio))+Number(Boolean(this.form.name))+Number(Boolean(this.form.age));
			}
		},
		watch:{
			ifExist(newVal,oldVal){
				if(Number(newVal) === 3){
					this.reg = false
				}else{
					this.reg = true
				}
			}
		},
		methods:{
			loadUserData () {
				var userData = JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO'))
				this.userId = userData.id
			},
			submitUpload: function(content) {//自定义的上传图片的方法
            	let formData = new FormData;
				formData.append('file', content.file,content.file.name);
				// formData.append("fileType", "1");
				var that = this
				this.$http({
					method: "POST",
					url: "/uploadManager/v1/feign/upload/uploadFile",
					headers: {
						'Content-Type': 'multipart/form-data'
					},
					data: formData
				}).then(function(response) {
						if (response.data.code == 200) {
							that.fileList = response.data.data[0].absolutePath
						}else {
							this.$message({
								type:'error',
								message:'上传图片失败'
							})
						}
					})
					.catch(function(error) {
					})
			},
			nextStep(){
				this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					this.$http({
						method:"post",
						url:this.ssoManager+"/v1/user/userInfo/userInfo",
						// url:"https://result.eolinker.com/7hUBFSf3c24e3ab4d7c9a88a6d8c4566a61bf0d55f38d5a?uri=/v1/user/base/reg/smsCode",
						data:{
							userName:this.form.name,
							sex:this.form.radio,
							birthday:this.form.age,
							userId:this.userId,
							iconUrl:this.fileList
						},
					}).then(res => {
						this.$message({
							message:res.data.message,
							type:'success'
						})
						var teamEmployeeDetailVO = JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO'))
						teamEmployeeDetailVO.iconUrl = this.fileList
						teamEmployeeDetailVO.employeeName = this.form.name
						teamEmployeeDetailVO.employeeGender = parseInt(this.form.radio)
						teamEmployeeDetailVO.employeeBirth = this.form.age
						window.sessionStorage.teamEmployeeDetailVO = JSON.stringify(teamEmployeeDetailVO)
						Bus.$emit('adminDetial',teamEmployeeDetailVO)
						this.dialogFormVisible = false;
					})
				} else {
					return false;
				}
				});
			}
  		},
		mounted() {
			Bus.$on("next", passwordSuccess => {
				this.dialogFormVisible = passwordSuccess;
			})
		},
	};
</script>
<style lang="scss">
	.setUserInfoBox{
		.el-dialog__header {
			padding: 20px 0 10px;
		}
		.el-container .upload-demo {
			display: inline-block;
			margin-bottom:10px
		}
		.el-dialog__body {
			padding: 16px 20px;
		}
		.el-container .el-input__inner {
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			// width: 323px;
		}
		.el-form-item__error {
			left: 16px;
		}
		.el-container .el-upload-list {
			display: none
		}
		.el-form {
			padding:0 47px;	
		}
		.name{
			margin-bottom: 0;
		}
		.el-dialog{
			width:500px;
			height:486px;
		}
		.el-dialog__footer{
			text-align: center;
		}
		.redioBox{
			margin-left:20px;
		}
		div[aria-label="完善信息"]{
			.el-icon-close:before{
				display: none;
			}		
		}
		.inforHint{
			font-size:12px;
			color:#FF6565;
			height:20px;
			margin-left: 15px;
			line-height: 20px;
		}
		.el-button {
			
		}
		.completes {
			width:308px;height:54px;background:#BFC2CC;border-radius:3px;
			color:#909399;
			border:1px solid #BFC2CC
		}
		.completes:hover{
			width:308px;height:54px;background:#BFC2CC;border-radius:3px;
			color:#909399;
			cursor: not-allowed;
			border:1px solid #BFC2CC
		}
		.complete {
			width:308px;height:54px;background:rgba(66,120,190,1);border-radius:3px;
			border: 1px solid #4278BE;
			color: #fff;
		}
	}

</style>