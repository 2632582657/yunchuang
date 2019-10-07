<!--@description: 登陆=>弹出框提示
	@author: 刘钰
    @update: 刘钰(2019-05-13 9:22) -->
<template>
	<div class="setPassword">
		<!-- <el-button type="text" @click="dialogFormVisible = true">设置密码</el-button> -->
		<el-dialog title="设置密码" :visible.sync="dialogFormVisible" :close-on-click-modal="closeModal" showClose = "false">
			 <span>{{shadeContent}}</span>
			<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="nextStep()">{{shadeTitle}}</el-button>
			</div>
		</el-dialog>
	</div>
</template>


<script>
import unseen from "../images/1.png";
import seen from "../images/2.png";
	export default {
		props:{
			shadeTitle:"", //弹出框底部提示内容
			shadeContent:""//弹出框内容
		},
		data() {
			return {
				dialogFormVisible: false,//默认关闭蒙层
				closeModal:false,//点击蒙层不关闭
				formLabelWidth: '80px',
			};
		},
		methods:{

			//下一步
			nextStep(){
				if(title !== "知道了"){
					this.dialogFormVisible = false;
					this.$router.push({
						path:"/register",
						name:"register",
					})
				}else{
					this.dialogFormVisible = false
				}
				
			}
  		}
	};
</script>
<style lang="scss">
.setPassword{
	.el-dialog{
		width:400px;
	}
	.el-dialog__header{
		text-align: center;
	}
	.el-dialog__footer{
		text-align: center;
	}	
}

</style>