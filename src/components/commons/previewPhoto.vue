<!--@description: 照片查看组件
	@author: 赵康
    @update: 赵康(2019-08-8 09:45) -->
<template>
	<div class="previewPhoto_modal_box" v-if="isShowPop" @click.self="close">
		<img :src="photoUrl" alt="">
<!--		v-clickOutSide="close"-->
	</div>
</template>

<script>
	export default {
		name: "previewPhoto",
		data() {
			return {
				url: "",
				isShowPop:false,
				isTrue:false,
			}
		},
		props: {
			photoUrl: {
				type: String,
				default: "",
				required: true
			},
			isShow:{
				type:Boolean,
				default:false,
				required:true
			},
		},
		watch: {
			isShow(){
				this.isShowPop = this.isShow;
			}
		},
		methods: {
			close() {
				// if(this.isTrue&&this.isShowPop){
				if(this.isShowPop){
					this.$emit("editParents",false);
					this.isShowPop = false;
					// this.isTrue = false;
				}else{
					// this.isTrue = true;
				}
			}
		}
	}
</script>

<style scoped>
	.previewPhoto_modal_box {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0,0,0,0.3);
		z-index: 10;
		cursor: pointer;
	}
	.previewPhoto_modal_box >img{
		width: auto;
		height: auto;
		max-width: 80%;
		max-height: 80%;
		z-index: 10;
	}
</style>
