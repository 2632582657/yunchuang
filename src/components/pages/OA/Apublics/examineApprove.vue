<template>
	<div class="copiedPerson">
		<el-form :label-width="labelWidth">
			<el-form-item label="审批人：" required>
				<div class="chooseMember clear">
					<div v-for="(datas,indexs) in copyValue" :key="indexs">
						<span v-show="indexs>0 && datas.length>0" class="fl" style="margin-right:20px;line-height: 80px;">——></span>
						<div v-for="(item,index) in datas" :key="item.userId" class="fl group">
                            <span class="imgdelete" @click="deleteMember(item,indexs,index)">
                                <img src="./images/delete.png" class="delImg" alt v-show="isApprove">
							</span>
							<img :src="item.headUrl" alt>
							<span class="name" v-if="item.userName !== ''">{{item.userName}}</span>
						</div>
					</div>
					<div v-show="isApprove" class="noPeople fl" @click="check">
						<el-button>选择审批人</el-button>
					</div>
				</div>
			</el-form-item>
			<el-dialog title="选择部门与人员" :visible.sync="memberShow" :close-on-click-modal="false" center>
				<div class="member">
					<Address
						class="address"
						@takeMember="getMember(arguments)"
						@cancel="close()"
				     	:isSingular="isSingular"
					></Address>
				</div>
			</el-dialog>
		</el-form>
	</div>
</template>

<script>
	import Address from "../../../commons/address";

	export default {
		name: "examineApprove",
		components: {
			Address
		},
		props: {
			labelWidth: {
				//label宽度默认150px,可由父组件传值
				default: "80px",
				type: String
			},
			isSingular: {
				//调用address子组件时，控制是否单选
				default: false,
				type: Boolean
			},
			isOne: {
				//父组件传过来的，控制是否单选
				default: false,
				type: Boolean
			},
			isApprove: {
				default: false,
				type: Boolean
			},
			dataList: {
				default: () => [],
				type: Array
			}
		},
		data() {
			return {
				memberShow: false,
				copyValue: [],
			};
		},
		watch: {
			dataList() {
				this.copyValue = this.dataList;
			}
		},
		created() {
			this.copyValue = this.dataList;
		},
		methods: {
			//子组件address选择的审批人
			getMember(data) {
				if (data[0] == "") {
					this.$message.error("您未选择审批人");
					return;
				} else {
					let list = [];
					this.memberShow = data[1];
					list = data[0];
					this.unique(list);
					this.copyValue.push(list);
					// this.copyValue = List;
					// console.log(this.copyValue)
					//箭头处理
					// if (this.copyValue.length > 1) {

					// }
					this.$emit("getDataList",this.copyValue);
					}
			},
			//关闭通讯录
			close() {
				this.memberShow = false;
			},
			//删除人员
			deleteMember(value, indexs, index) {
				if (this.copyValue.length > 0 && this.copyValue[indexs].length > 0) {
					for (let i = 0; i < this.copyValue.length; i++) {
						if(this.copyValue[indexs]){
							for (let j = 0; j < this.copyValue[indexs].length; j++) {
								if (i == indexs && j == index) {
									this.copyValue[indexs].splice(j, 1);
								}
								if(this.copyValue[indexs].length<1){
									this.copyValue.splice(indexs, 1);
									return;
								}
							}
						}
					}
				} else {
					this.copyValue[indexs].splice(0, 1);
				}
			},
			// 数组去重
			unique(arr) {
				var res = [];
				for (var i = 0; i < arr.length; i++) {
					if (arr.indexOf(arr[i]) == i) {
						res.push(arr[i]);
					}
				}
				return res;
			},
			check() {
				//let isTrue = true;
				// if (this.isOne && this.copyValue.length > 0) {
				// 	for (let i = 0; i < this.copyValue.length; i++) {
				// 		if (this.copyValue[i].length > 0) isTrue = false;
				// 	}
				// 	if (!isTrue) {
				// 		this.$message.warning("只能选择一位审批人");
				// 		return;
				// 	} else {
				// 		this.memberShow = true;
				// 	}
				// } else {
				// 	this.memberShow = true;
				// }
				this.memberShow = true;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.copiedPerson {
		width: 552px;
		margin: 30px auto;

		.el-form-item {
			position: relative;
		}

		// .el-form-item::before {
		//   content: "*";
		//   position: absolute;
		//   top: 11px;
		//   left: 0px;
		//   color: red;
		// }
		.chooseMember {
			margin-top: -10px;
			cursor: pointer;

			.group {
				margin: 10px 0;
				position: relative;
				text-align: center;
				margin-right: 20px;

				.imgdelete {
					position: absolute;
					right: -8px;
					top: -8px;
					width: 15px;

					.delImg {
						width: 14px;
						height: 14px;
						cursor: pointer;
					}
				}

				img {
					width: 35px;
					height: 35px;
				}
			}

			.noPeople {
				cursor: pointer;
				background: #fff;
				padding: 2px;
			}
		}
	}
</style>