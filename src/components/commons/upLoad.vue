<!--@description: 图片和附件上传组件
	@author: 赵康
    @update: 赵康(2019-08-8 09:45) -->
<template>
	<div class="file_box clear" :class="{'pictureHei':type===1,'accessoryHei':type===2}">
		<p class="typeName fl">{{type === 1?"图片":"附件"}}</p>
		<div class="pic_box fl clear">
			<div class="showPic_box fl" v-for="(file,index) in imgFilePriewList" v-if="type===1">
				<img class="fl imgStyle" :src="file.absolutePath" alt="" @click="previewImg(file.absolutePath)">
				<p class="del_file" @click="delFile(1,index)">×</p>
			</div>
			<div class="showPic_box fl clear" v-for="(file,index) in filePriewList" v-if="type===2">
				<div class="showFile_box fl">
					<img class="fl fileStyle" src="./images/word.png" alt="" v-if="file.type===0">
					<img class="fl fileStyle" src="./images/excel.png" alt="" v-if="file.type===1">
					<img class="fl fileStyle" src="./images/ppt.png" alt="" v-if="file.type===2">
					<img class="fl fileStyle" src="./images/rar.png" alt="" v-if="file.type===3">
					<img class="fl fileStyle" src="./images/pdf.png" alt="" v-if="file.type===4">
					<img class="fl fileStyle" src="./images/jpeg.png" alt="" v-if="file.type===5">
					<img class="fl fileStyle" src="./images/more.png" alt="" v-if="file.type===6">
					<p class="del_file" @click="delFile(2,index)">×</p>
				</div>
				<div class="fl file_name_box">
					<p>{{file.name?file.name:file.originalFileName}}</p>
					<span>{{file.size?file.size:0}}</span>
				</div>
			</div>
		</div>
		<div class="pic_sel_box clear fl" :class="{'textContent':type===1}">
			<img class="fl" src="./images/upLoad.png" alt="" v-if="type===1">
			<img class="fl" src="./images/accessory.png" alt="" v-if="type===2">
			<p class="type_text fl">上传{{type === 1?"图片":"附件"}}<span
				style="color:#909399;font-size: 12px;margin-left: 6px;">上传{{type === 1?"图片":"附件"}}大小不超过20M</span></p>
			<input type="file" class="inputFile" multiple="multiple"
				   :accept="type===1?'image/gif,image/jpeg,image/jpg,image/png,image/svg':'*'" @change="selectFile">
		</div>
		<PreviewPhoto :photoUrl="previewPhoto" :isShow="isShowPhoto" @editParents="editParents"></PreviewPhoto>
	</div>
</template>

<script>
	import PreviewPhoto from './previewPhoto'

	export default {
		name: "upLoad",
		components: {
			PreviewPhoto
		},
		data() {
			return {
				imgFilePriewList: [],  //展示图片列表
				filePriewList: [],  //展示文件icon列表
				afterImgUploadList: [],//图片上传完返回列表
				afterFileUploadList: [],//图片上传完返回列表
				fileList: [],   //上传文件列表
				fileSizeList: [],
				previewImgList: [],//有草稿时的暂存
				upImgList: [],//有草稿时的暂存
				previewFileList: [],//有草稿时的暂存
				upFleList: [],//有草稿时的暂存
				previewPhoto: "",  //点击图片放大
				isShowPhoto: false,  //点击图片查看组件使用
			};
		},
		props: {
			type: { //图片还是附件
				type: Number,
				default: 1,  //默认图片
				required: true
			},
			priewPhotoList: {
				type: Array,
				default: () => [],
				required: false
			},
			priewFileList: {
				type: Array,
				default: () => [],
				required: false
			},
			isShow: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			priewPhotoList() {
				if (this.isShow) {
					this.imgFilePriewList = JSON.parse(JSON.stringify(this.priewPhotoList));
					this.afterImgUploadList = JSON.parse(JSON.stringify(this.priewPhotoList));
				}
			},
			priewFileList() {
				this.filePriewList = JSON.parse(JSON.stringify(this.priewFileList));
				this.afterFileUploadList = JSON.parse(JSON.stringify(this.priewFileList));
				for (let i = 0; i < this.filePriewList.length; i++) {
					if (!this.filePriewList[i].type) {
						this.filePriewList[i]["type"] = this.filePriewList[i].originalFileName ? this.filePriewList[i].originalFileName.substring(this.filePriewList[i].originalFileName.lastIndexOf('.'), this.filePriewList[i].originalFileName.length) : 6;
						switch (this.filePriewList[i].type) {
							case ".doc":
							case ".docx":
								this.filePriewList[i].type = 0;
								break;
							case ".xlsx":
							case ".xls":
								this.filePriewList[i].type = 1;
								break;
							case ".ppt":
							case ".pptx":
								this.filePriewList[i].type = 2;
								break;
							case ".rar":
							case ".zip":
								this.filePriewList[i].type = 3;
								break;
							case ".pdf":
								this.filePriewList[i].type = 4;
								break;
							case ".jpg":
							case ".jpeg":
							case ".png":
								this.filePriewList[i].type = 5;
								break;
							default:
								this.filePriewList[i].type = 6;
								break;
						}
					}
					if (this.filePriewList[i].fileSize >= 0) {
						let size = this.filePriewList[i].fileSize;
						this.filePriewList[i]["size"] = size > 1023 ? (size > 1048575 ? ((size / (1024 * 1024)).toFixed(2) + "MB") : ((size / 1024).toFixed(2) + "KB")) : (size + "B");
					}
				}
			}
		},
		methods: {
			selectFile(file) {
				file.preventDefault();
				let files = file.target.files || file.dataTransfer.files;
				if (!files.length) return;

				//一次上传超过9个文件
				if (9 - files.length < 0) {
					this.$message.warning("最多上传9个文件，请重新选择");
					return;
				}

				if (this.type === 1){
					//已经有图片，再上传超过9张
					if ((this.imgFilePriewList.length + files.length) > 9) {
						this.$message.warning("最多上传9张图片");
						return;
					}
				}else{
					//已经有附件，再上传超过9个
					if ((this.filePriewList.length + files.length) > 9) {
						this.$message.warning("最多上传9张图片");
						return;
					}
				}

				this.fileList = [];
				//存一下图片，当上传了非图片格式的文件时，把该次上传的图片全部清掉
				this.previewImgList = this.imgFilePriewList;
				this.upImgList = this.afterImgUploadList;
				//附件的这里用不上，在上传时用得上，这里先暂存一下
				this.previewFileList = this.filePriewList;
				this.upFleList = this.afterFileUploadList;

				for (let i = 0; i < files.length; i++) {
					if (files[i].size >= 20971520) {   //20M
						this.$message.warning("文件超过20M，无法上传");
						return;
					}
					let fileType = files[i].name.substring(files[i].name.lastIndexOf("."));   //获取文件后缀
					if (this.type === 1) {   //图片
						let imageType = /^image\//;
						//是否是图片
						if (!imageType.test(files[i].type)) {
							this.$message.warning("请选择图片！");
							//只要有一张不是图片就全部删掉重新选择
							this.fileList = [];
							this.imgFilePriewList = this.previewImgList;
							this.afterImgUploadList = this.upImgList;
							return;
						}
						this.imgPreview(this.type, files[i]);
					} else {   //附件
						this.imgPreview(this.type, files[i], fileType);
					}
					this.fileList.push(files[i]);
				}
				file.target.value = ''; // 清除input数据
				this.upLoad();
			},
			//上传文件
			upLoad() {
				let that = this;
				let formDate = new FormData();
				for (let i = 0; i < that.fileList.length; i++) {
					formDate.append("file", that.fileList[i], that.fileList[i].name);
				}
				this.$http({
					method: "POST",
					url: "/uploadManager/v1/feign/upload/uploadFile",
					headers: {
						'Content-Type': 'multipart/form-data'
					},
					data: formDate
				})
					.then(res => {
						if (res.data.code === 200) {
							if (that.type === 1) {    //图片
								if (res.data.data.constructor === Array) {
									if (that.afterImgUploadList.length === 0) {
										that.afterImgUploadList = res.data.data;
									} else {
										that.afterImgUploadList = that.afterImgUploadList.concat(res.data.data);
									}
									// 不知道咋回事有重复图片,去掉冗余数据
									for (let x = that.afterImgUploadList.length - 1; x >= 0; x--) {
										if (!that.afterImgUploadList[x].hasOwnProperty('newFileName')) {
											that.afterImgUploadList.splice(x, 1);
										}
									}
									this.$emit("editParents", that.afterImgUploadList, this.type);//参数this.type，告诉父级是图片还是附件
								} else {
									this.$message.error("上传图片异常");
									//图片上传异常时，清除该次上传的数据
									that.imgFilePriewList = that.previewImgList;
									that.afterImgUploadList = that.upImgList;
								}
							} else {
								if (res.data.data.constructor === Array) {
									if (that.afterFileUploadList.length === 0) {
										that.afterFileUploadList = res.data.data;
									} else {
										that.afterFileUploadList = that.afterFileUploadList.concat(res.data.data);
									}
									// for (let i = 0; i < that.fileSizeList.length; i++) {
									// 	for (let j = 0; j < that.afterFileUploadList.length; j++) {
									// 		if (that.fileSizeList[i].name = that.afterFileUploadList[j].originalFileName)
									// 			that.afterFileUploadList[j]["fileSize"] = that.fileSizeList[i].size;
									// 	}
									// }
									//去掉冗余数据
									for (let y = that.afterFileUploadList.length - 1; y >= 0; y--) {
										if (that.afterFileUploadList[y].type)
											delete that.afterFileUploadList[y].type
										if (!that.afterFileUploadList[y].hasOwnProperty('newFileName')) {
											that.afterFileUploadList.splice(y, 1);
										}
									}
									this.$emit("editParents", that.afterFileUploadList, this.type);//参数this.type，告诉父级是图片还是附件
								} else {
									this.$message.error("上传附件异常");
									//附件上传异常时，清除该次上传的数据
									that.filePriewList = that.previewFileList;
									that.afterFileUploadList = that.upFleList
								}
							}

						}
					})
					.catch(error => {
						that.$message.error("上传失败");
					});

			},
			//展示图片
			imgPreview(type, file, fileType) {
				let that = this;
				if (type === 1) {  //图片
					// 是否支持FileReader
					if (!file || !window.FileReader) {
						that.$message.warning("不支持FileReader上传");
						return;
					}
					let reader = new FileReader();
					// 将图片将转成 base64 格式,并保存在reader中
					reader.readAsDataURL(file);
					reader.onload = function (e) {
						let base64Url = e.target.result;
						if (that.imgFilePriewList.length >= 9) {
							that.$message.warning("最多上传9张图片");
							return;
						}
						that.imgFilePriewList.push({
							absolutePath: base64Url
						});
					}
				} else { //文件
					let size = file.size > 1023 ? (file.size > 1048575 ? ((file.size / (1024 * 1024)).toFixed(2) + "MB") : ((file.size / 1024).toFixed(2) + "KB")) : (file.size + "B");
					this.fileSizeList.push({
						name: file.name,
						size: size
					});
					switch (fileType) {
						case ".doc":
						case ".docx":
							that.filePriewList.push({
								type: 0,
								name: file.name,
								size: size,
							});
							break;
						case ".xlsx":
						case ".xls":
							that.filePriewList.push({
								type: 1,
								name: file.name,
								size: size
							});
							break;
						case ".ppt":
						case ".pptx":
							that.filePriewList.push({
								type: 2,
								name: file.name,
								size: size
							});
							break;
						case ".rar":
						case ".zip":
							that.filePriewList.push({
								type: 3,
								name: file.name,
								size: size
							});
							break;
						case ".pdf":
							that.filePriewList.push({
								type: 4,
								name: file.name,
								size: size
							});
							break;
						case ".jpg":
						case ".jpeg":
						case ".png":
							that.filePriewList.push({
								type: 5,
								name: file.name,
								size: size
							});
							break;
						default:
							that.filePriewList.push({
								type: 6,
								name: file.name,
								size: size
							});
							break;
					}
				}
			},
			//删除图片或文件
			delFile(type, index) {
				if (type === 1) {  //图片
					this.imgFilePriewList.splice(index, 1);
					this.afterImgUploadList.splice(index, 1);
					this.$emit("afterFileList", type, this.afterImgUploadList);
				} else {
					this.filePriewList.splice(index, 1);
					this.afterFileUploadList.splice(index, 1);
					this.$emit("afterFileList", type, this.afterFileUploadList);
				}
			},
			clearFile() {
				this.imgFilePriewList = [];  //展示图片列表
				this.filePriewList = [];  //展示文件icon列表
				this.afterImgUploadList = [];//图片上传完返回列表
				this.afterFileUploadList = [];//图片上传完返回列表
				this.fileList = [];   //上传文件列表
			},
			//查看图片
			previewImg(url) {
				this.isShowPhoto = true;
				this.previewPhoto = url;
			},
			editParents(value) {
				this.isShowPhoto = value;
			},
		}
	}
</script>

<style scoped>
	.textContent{
		height: 100px;
	}
	.showPic_box > .file_name_box > p {
		color: #606266;
		font-size: 14px;
		height: 22px;
		margin-top: -10px;
	}

	.showPic_box > .file_name_box > span {
		color: #909399;
		font-size: 12px;
	}

	.showPic_box > .file_name_box {
		height: 44px;
	}

	.showPic_box .del_file {
		position: absolute;
		right: -10px;
		top: -10px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: #BFC2CC;
		color: white;
		font-size: 14px;
		text-align: center;
		line-height: 20px;
		cursor: pointer;
	}

	.showPic_box {
		position: relative;
		margin-right: 20px;
		margin-bottom: 14px;
	}

	.showPic_box > .showFile_box {
		position: relative;
		margin-right: 8px;
	}

	.showPic_box > .imgStyle {
		width: 100px;
		height: 100px;
		cursor: pointer;
	}

	.showPic_box > .fileStyle {
		width: 44px;
		height: 44px;
	}

	.pic_sel_box > .inputFile {
		position: absolute;
		width: 100%;
		opacity: 0;
		cursor: pointer;
	}

	.pic_sel_box > .type_text {
		color: #4278BE;
		font-size: 14px;
		margin-left: 4px;
	}

	.file_box > .pic_sel_box {
		display: flex;
		align-items: center;
		cursor: pointer;
		position: relative;
	}

	.file_box > .typeName {
		height: 100%;
		color: #303133;
		font-size: 16px;
		margin-right: 20px;
		display: block;
		vertical-align: middle;
	}

	.file_box {
		margin-bottom: 48px;
	}

	.pictureHei {
		/*height: 100px;*/
		line-height: 100px;
	}

	.accessoryHei {
		/*height: 44px;*/
		line-height: 44px;
	}
</style>
