<template>
	<div class="modal_box" v-if="isShowPop">
		<div>
			<div class="photo_box"  v-clickOutSide="close">
				<div class="clear " style="margin-top: 20px;border-bottom: 1px solid #BFC2CC;height: auto;">
					<p class="fl" style="width: 8px;height: 24px;background-color: #4278BE;" v-if="praiseType===1"></p>
					<p class="fl headName" :class="{'headName_boeder':reader}" style="" v-if="praiseType===0" @click="reader = true">已读({{readList.length}})</p>
					<p class="fl headName" :class="{'headName_boeder':!reader}" style="" v-if="praiseType===0" @click="reader = false">未读({{unReadList.length}})</p>
					<p class="fl pariseHeadName" style="" v-if="praiseType===1">点赞({{pariseList.length}})</p>
				</div>
				<div class="photo_content_box">
					<div class="photo_content clear">
						<p class="fl" v-for="item in readList" v-if="reader && praiseType===0">
							<img src="./images/icon_head.png" alt="" v-if="item.receiverHeadUrl===''||!item.receiverHeadUrl">
							<img :src="item.receiverHeadUrl" alt="" v-else>
							<span style="width: 44px;">{{item.receiverName}}</span>
						</p>
						<p class="fl" v-for="item in unReadList" v-if="!reader && praiseType===0">
							<img src="./images/icon_head.png" alt="" v-if="item.receiverHeadUrl===''||!item.receiverHeadUrl">
							<img :src="item.receiverHeadUrl" alt="" v-else>
							<span style="width: 44px;">{{item.receiverName}}</span>
						</p>
						<p class="fl" v-for="item in pariseList" v-if="praiseType===1">
							<img src="./images/icon_head.png" alt="" v-if="item.laudHeadUrl===''||!item.laudHeadUrl">
							<img :src="item.laudHeadUrl" alt="" v-else>
							<span style="width: 44px;">{{item.laudName}}</span>
						</p>
<!--						<p v-if="(reader && readList.length===0)">无信息</p>-->
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "pariseDetailPop",
		data() {
			return {
				isShowPop:false,
				isTrue:false,
				reader:true
			}
		},
		props: {
			isShow:{
				type:Boolean,
				default:false,
				required:true
			},
			praiseType:{
				type:Number,
				default:0,
				required:true
			},
			readList:{
				type:Array,
				default:()=>[],
				required:false
			},
			unReadList:{
				type:Array,
				default:()=>[],
				required:false
			},
			pariseList:{
				type:Array,
				default:()=>[],
				required:false
			}
		},
		watch: {
			isShow(){
				this.isShowPop = this.isShow;
			}
		},
		methods: {
			close() {
				if(this.isTrue&&this.isShowPop){
					this.$emit("editParents",false);
					this.isShowPop = false;
					this.isTrue = false;
				}else{
					this.isTrue = true;
				}
			}
		}
	}
</script>

<style scoped>
	.photo_content p img{
		width: 44px;
		height: 44px;
		margin-bottom: 4px;
	}
	.photo_content p span{
		display: block;
		text-align: center;
		color: #303133;
		font-size: 14px;
	}
	.photo_content p{
		margin: 0 13px 40px 13px;
	}
	.photo_content{
		/*padding: 20px;*/
	}
	.photo_box .photo_content_box{
		margin-top: 20px;
		padding:20px;
		background-color: white;
	}
	.photo_box>div .pariseHeadName{
		width: 90px;
		text-align: center;
		font-size: 20px;
	}
	.photo_box .headName_boeder{
		color: #4278BE;
		border-bottom: 1px solid #4278BE;
	}
	.photo_box>div .headName{
		width: 90px;
		text-align: center;
		font-size: 20px;
		/*color: #BFC2CC;*/
	}
	.photo_box>div p{
		height: 40px;
		font-weight: 600;
	}

	.photo_box{
		background-color: #F8F8F8;
		width: 600px;
		height: 600px;
		position: absolute;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		padding: 30px;
	}
	.modal_box > div {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.modal_box {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 1;
		cursor: pointer;
	}
</style>
