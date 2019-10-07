<!--@description: 主页=>弹出框设置密码
	@author: 刘钰
    @update: 刘钰(2019-05-10 11:56) -->
<template>
	<div class="setPasswordBox">
		<!-- <el-button type="text" @click="dialogFormVisibles = true">下一步</el-button> -->
		<el-dialog class="setPass" title="设置密码" :visible.sync="dialogFormVisibles" :close-on-click-modal='false' >
			<div slot="title" class="header-title clear" style="border-bottom:1px solid #BFC2CC;height:42px;">
                <div style="width:16px;height:23px;background:#4278BE;float:left;margin-top:4px;margin-left:30px"></div>
                <div style="width:98px;height:31px;font-size:20px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:31px;float:left;margin-left:10px">设置密码</div>
            </div>
			<el-form :model="form">
				<el-form-item label="密码" :label-width="formLabelWidth">
					<el-input 
						type="password" 
						placeholder="请输入密码" 
						v-model.trim="eyetxt"  
						v-if="pwdType" 
						autofocus
						clearable
                        @blur="checkPassword('blur', eyetxt)" 
                        @focus="checkPassword('focus', eyetxt)"
						></el-input>
					<el-input 
						type="text"  
						placeholder="请输入密码" 
						v-model.trim="eyetxt" 
						v-else 
						autofocus
						clearable
                        @blur="checkPassword('blur', eyetxt)" 
                        @focus="checkPassword('focus', eyetxt)"
					></el-input>
					<img :src="seen ? seenImg : unseenImg" @click="changeType()" class="eye_img" />
					<!-- <i class="el-icon-close i" alt="" @click="eyetxt = ''"></i> -->
					<span style="font-size:12px;color:#BFC2CC" v-show="!changeColor">密码必须包含数字、字母，长度不低于6位</span>
				</el-form-item>
				<div class= "password-hint" :class="changeColor ? 'active':''">{{passwordTitle}}</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<button type="button" :class="disabNext ? 'disBtn' : 'editTelephoneBtn'" @click="nextStep"  :disabled="disabNext">下一步</button>
			</div>
		</el-dialog>
	</div>
</template>


<script>
import unseen from "../images/1.png";
import seen from "../images/2.png";
import Bus from '@/modules/bus.js';

export default {
	props:{
		close:Boolean,
		editPassword:Boolean
	},
	data() {
		return {
			ssoManager:'ssoManager',
			dialogFormVisibles: false, //蒙层关闭
			form: {
			},
			formLabelWidth: '40px',
			seen:true,  			//眼睛显示状态
			unseenImg:unseen,	//看不见图片
			seenImg :seen,		//看得见密码图片
			eyetxt:"",          //密码框用户输入内容
			pwdType:true, 		//此时文本框隐藏，显示密码框
			disabNext:true,   	//下一步按钮禁用 
			changeColor:false, 	//密码提示信息颜色
			passwordTitle:"",   //密码提示信息
			// tentative:"",       //密码初步验证
		};
	},
	watch: {
		close:function(val){
			this.dialogFormVisibles = val;
		},
		eyetxt (newval) {
			var reSpace = /\s/g;
            if (reSpace.test(newval)){
                return;
            }
			var reUpper = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
			//  ^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$
            // var reLower = /[a-z]/;
            var reNum = /[0-9]/;
            var count = 0;
            // if (reLower.test(newval)) {
            //     ++count;
            // }
            if (reUpper.test(newval)) {
                ++count;
            }
            if (reNum.test(newval)) {
                ++count;
            }
            if (count < 2) {
                this.passwordTitle = '密码必须包含数字、字母，长度不低于6位'
				this.changeColor = true
				this.disabNext = true
            } else if (newval.length < 6) {
                this.passwordTitle = '密码长度至少6位'
				this.changeColor = true
				this.disabNext = true
            } else if (newval.length > 19) {
                this.passwordTitle = '密码长度最高18位'
				this.changeColor = true
				this.disabNext = true
            } else {
				this.passwordTitle = ''
				this.disabNext = false;
            }
		}
	},
	created() {
		this.dialogFormVisibles = this.close;
	},
	methods:{
  		//密码的显示隐藏
  		changeType:function(){
  			this.seen = !this.seen;//小眼睛的变化
  			this.pwdType=!this.pwdType;//跟着小眼睛变化，密码框隐藏显示文本框，内容就显示了
  		},

		//验证密码
		checkPassword(type, value){
			//失去焦点
            // if(type == "blur"){
			// 	if(this.eyetxt == ""){
			// 		this.passwordTitle = "请输入密码"
			// 		this.changeColor = true;
			// 	}else{
			// 		this.tentative = true;
			// 	}
			// }else{
			// 	this.disabNext = false;
			// }
		},
		//下一步
		nextStep(){
			this.$http({
				method:"post",
				url:this.ssoManager + "/v1/user/userInfo/updatePassword",
				data:{
					phone:JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')).phone,
					password:this.eyetxt
				}
			}).then( res => {
				if(res.data.sysCode == 200 && res.data.code == 200){
					this.passwordTitle = "";
					var that = this;
					this.$message({
							message: '设置成功',
							center: true,
							duration:1000,
							type:"success",
							onClose(){
								that.dialogFormVisibles = false;
							}
					});
					if (!this.editPassword) {
						Bus.$emit("next",true);
					}
				}else if(res.data.code == 501101304){
					this.passwordTitle = res.data.message;
					this.changeColor = true
				}//该用户已设置密码
				else if(res.data.code == 501101302){
					this.$message({
						message:"您已设置密码",
						type:'warning'
					})
				}//密码加密失败
				else if(res.data.code == 501101303){
					this.$message.error(res.data.message)

				}
			})
		}
			// this.dialogFormVisibles = false
  	},

}
</script>
<style lang="scss">
	.setPasswordBox{
		.editTelephoneBtn {
			width:308px;
			height:54px;
			background:#4278BE;
			color:#fff;
			border: 1px solid #4278BE;
			border-radius:3px;
		}
		.disBtn {
			width:308px;
			height:54px;
			border-radius:3px;
			border: 1px solid #EDEFF2;
			background: #EDEFF2;
			color:#909399;
		}
		.disBtn:hover{
			cursor: not-allowed;
			width:308px;
			height:54px;
			border-radius:3px;
			border: 1px solid #EDEFF2;
			background: #EDEFF2;
			color:#909399;
		}
		.setPass{
				.el-dialog {
					width:500px;
					height:310px;
				}
				.el-dialog__header {
					padding: 20px 0 10px;
				}
				.el-dialog__footer{
					text-align: center;
				}
				.el-form {
					padding: 0 64px;
					.el-form-item {
						margin-bottom: 5px;
					}
				}
				.eye_img{
					position:absolute;
					top:11px;
					right:-28px;
					width:21px;
				}
				.el-icon-close.i{
					position:absolute;
					top:12px;
					right:15px;
				}
				.password-hint{
					color:#bbb;
					font-size:12px;
					margin-left:54px;
				}
				.password-hint.active{
					color:rgb(245, 107, 52);
				}
				.el-button {
					width:250px;
					height:54px;
					background:rgba(66,120,190,1);
					border-radius:3px;
				}
			}
	}
	

</style>