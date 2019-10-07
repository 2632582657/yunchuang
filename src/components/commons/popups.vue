<!--@description: 弹框组件
	@author: 赵康
    @update: 赵康(2019-08-8 09:45) -->
<template>
	<div class="pop_box" v-show="IsShow">
		<div class="contrnt_box">
			<div class="pop_shard_box clear">
				<p class="content_text">{{contentText}}</p>
				<div class="content_btn_box fr">
					<p class="content_btn_cancel" @click="cancel">取消</p>
					<p class="content_btn_confirm" @click="confirm">确定</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "popups",
		data(){
			return{
				IsShow:false
			}
		},
		props: {
			isShow:{
				type: Boolean,
				default: false,
				required: true
			},
			contentText: {
				type: String,
				default: "",
				required: true
			},
			confirmFuncname:{
				type: String,
				default: "",
				required: true
			},
			isGetDraft:{
				type: Number,
				default: 1,
				required: false
			}
		},
		watch:{
			isShow(){
				this.IsShow = this.isShow;
			}
		},
		methods:{
			cancel(){
				this.IsShow = false;
				this.$emit("cancelFunc",this.isGetDraft,"false");    //这里的false是点击清除引用内容选取消时用的
			},
			confirm(){
				this.IsShow = false;
				this.$emit("confirmFunc",this.confirmFuncname,this.isGetDraft);
			}
		}
	}
</script>

<style scoped>
	.pop_box {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 1;
	}

	.contrnt_box {
		/*position: relative;*/
	}

	.pop_shard_box {
		width: 500px;
		height: 220px;
		background-color: white;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 3px;
	}

	.content_text {
		color: #303133;
		font-size: 14px;
		margin-top: 58px;
		margin-left: 30px;
	}

	.content_btn_box {
		margin-top: 68px;
		margin-right: 32px;
	}

	.content_btn_box p {
		width: 150px;
		height: 50px;
		font-size: 14px;
		border: 1px solid #4278BE;
		display: inline-block;
		border-radius: 3px;
		text-align: center;
		line-height: 50px;
		cursor: pointer;
	}

	.content_btn_cancel {
		margin-right: 26px;
		color: #4278BE;
	}

	.content_btn_confirm {
		color: #fff;
		background-color: #4278BE;
	}
</style>
