<template>
	<div>
		<!--		v-clickOutSide="handleClose"-->
		<div class="sidebar_box" v-if="SidebarShow">
			<div class="sidebar_box_ne">
				<div class="sidebar_header clear">
					<p class="fl">{{userContent.employeeName}}的日报</p>
					<span class="fr" @click="handleClose">×</span>
				</div>
				<div class="sidebar_content">
					<div class="content_top clear">
						<div class="fl clear">
							<img class="fl" :src="userContent.iconUrl" alt="" v-if="userContent.iconUrl">
							<img class="fl" src="./writeReport/images/icon_head.png" alt="" v-else>
							<div class="fl">
								<p>{{userContent.employeeName}}</p>
								<span>{{createTime?createTime.slice(0,16):""}}</span>
							</div>
						</div>
						<!--<p class="fr">...</p>-->
						<el-menu :default-active="activeIndex" class="el-menu-demo fr" mode="horizontal"
								 @select="handleSelect">
							<el-submenu index="1">
								<template slot="title">更多</template>
								<el-menu-item index="1-1">修改汇报</el-menu-item>
								<el-menu-item index="1-2">写汇报</el-menu-item>
								<el-menu-item index="1-3">删除汇报</el-menu-item>
							</el-submenu>
						</el-menu>
					</div>
					<!--完成工作-->
					<div class="sidebar_nowWorkList_box">
						<p class="sidebar_today_work_text">{{type === 1?"今日":(type === 2?"本周":"本月")}}完成工作</p>
						<div class="sidebar_detail_box">
							<div v-for="item in nowWorkList">
								<p>{{item.serialNumber}}.{{item.content}}</p>
								<p v-if="item.completeness && item.completeness>0">完成度：{{item.completeness}}%</p>
							</div>
						</div>
					</div>
					<!--工作总结-->
					<div class="sidebar_afterWorkList_box" v-show="type > 1">
						<p class="sidebar_after_work_text">{{type === 2?"本周":"本月"}}工作总结</p>
						<div class="sidebar_detail_box">
							<p>{{summarize}}</p>
						</div>
					</div>
					<!--工作计划-->
					<div class="sidebar_afterWorkList_box">
						<p class="sidebar_after_work_text">{{type === 1?"明日":(type === 2?"下周":"下月")}}工作计划</p>
						<div class="sidebar_detail_box">
							<p v-for="item in afterWorkList">{{item.serialNumber}}.{{item.content}}</p>
						</div>
					</div>
					<!--协调域帮助（只有周报月报有）-->
					<div class="sidebar_afterWorkList_box" v-show="type > 1 && coordinate">
						<p class="sidebar_after_work_text">需协调与帮助</p>
						<div class="sidebar_detail_box">
							<p>{{coordinate}}</p>
						</div>
					</div>
					<!--备注（都有）-->
					<div class="sidebar_afterWorkList_box" v-show="type > 0 && remark">
						<p class="sidebar_after_work_text">备注</p>
						<div class="sidebar_detail_box">
							<p>{{remark}}</p>
						</div>
					</div>
				</div>
				<!--图片-->
				<div class="photo_content">
					<img :src="res.absolutePath?res.absolutePath:''" alt="" v-for="res in pictureList"  @click="previewImg(res.absolutePath)">
				</div>
				<!--附件-->
				<div class="file_content">
					<div class="file_content_detail clear" v-for="res in viewAttachmentList" @click="downLoadFile(res.url,res.name)">
						<img class="fl" src="@/components/commons/images/word.png" alt="" v-if="res.type===0">
						<img class="fl" src="@/components/commons/images/excel.png" alt="" v-if="res.type===1">
						<img class="fl" src="@/components/commons/images/ppt.png" alt="" v-if="res.type===2">
						<img class="fl" src="@/components/commons/images/rar.png" alt="" v-if="res.type===3">
						<img class="fl" src="@/components/commons/images/pdf.png" alt="" v-if="res.type===4">
						<img class="fl" src="@/components/commons/images/jpeg.png" alt="" v-if="res.type===5">
						<img class="fl" src="@/components/commons/images/more.png" alt="" v-if="res.type===6">
						<p>
							<span>{{res.name}}</span>
							<span>{{res.size}}</span>
						</p>
					</div>
				</div>
				<!--已读未读-->
				<div class="sidebar_read">
					<p :class="{'sidebar_read_border':readkey}" @click="readkey = true">已读{{readNumber}}</p>
					<p @click="readkey = false" :class="{'sidebar_read_border':!readkey}">未读{{unreadNumber}}</p>
				</div>
				<!--展示图片区域-->
				<div class="sidebar_img clear" v-show="readkey">
					<div class="sidebar_img_box fl" v-for="reader in readList">
						<img src="./writeReport/images/icon_head.png" alt="" v-if="!reader.picture && readList.length!=0">
						<img :src="reader.picture" alt="" v-else>
						<p style="width: 44px;">{{reader.name}}</p>
					</div>
					<p class="fr" v-show="readList.length>8" @click="sharedBoxSmall=true">更多</p>
				</div>
				<div class="sidebar_img clear" v-show="!readkey">
					<div class="sidebar_img_box fl" v-for="reader in unReadList">
						<img src="./writeReport/images/icon_head.png" alt="" v-if="!reader.receiverHeadUrl && unReadList.length!=0">
						<img :src="reader.receiverHeadUrl" alt="" v-else>
						<p style="width: 44px;">{{reader.receiverName}}</p>
					</div>
					<p class="fr" v-show="unReadList.length>8" @click="sharedBoxSmall=true">更多</p>
				</div>
				<!--点赞-->
				<div class="sidebar_praise clear">
					<img src="./writeReport/images/xin.png" class="fl" alt="">
					<div class="fl">
						<span v-for="(praiser,index) in praiseList.slice(0,5)">{{praiser.laudName}}</span>
						<span v-show="praiseList.length>0">{{praiseList.length>5?'等5人':''}}点赞</span>
					</div>
					<span class="fr moreParise" @click="()=>{sharedBoxSmall = true;praiseKey = true;}"
						  v-show="praiseList.length>5">></span>
				</div>
				<!--评论-->
				<div class="sidebar_comment" :class="{'sidebar_comment_change':inputFocus}">
					<p>评论{{commentList.length}}</p>
					<div class="sidebar_comment_box clear" :class="{'sidebar_comment_border':commentList.length>1}"
						 v-for="comment in commentList">
						<img class="fl" src="./writeReport/images/icon_head.png" alt=""
							 v-if="!comment.commentatorHeadUrl">
						<img class="fl" :src="comment.commentatorHeadUrl" alt="" v-else>
						<div class="fl sidebar_comment_content">
							<div class="clear">
								<span class="fl" style="color: #303133;">{{comment.commentatorName}}</span>
								<span class="fr" style="color: #909399;">{{comment.commentTime?comment.commentTime.slice(0,16):""}}</span>
							</div>
							<p>{{comment.commentContent}}</p>
						</div>
					</div>
				</div>
			</div>
			<!--写评论-->
			<div class="sidebar_footer clear">
            <textarea style="border-right: 1px solid #EDEFF2;" class="fl" @focus="inputFocus = true" v-model="comment"
					  @blur="inputFocus = false" placeholder="请填写你的评论" :class="{'change_parise':inputFocus}"></textarea>
				<div class="fr sidebar_footer_parise" v-show="!inputFocus">
					<img src="./writeReport/images/zan2.png" alt="" @click="sendData(1)" v-show="!isLaud">
					<img src="./writeReport/images/zan1.png" alt="" @click="sendData(1)" v-show="isLaud">
				</div>
				<div class="fr sidebar_footer_send" v-show="inputFocus" @mousedown="sendData(0)">发送</div>
			</div>
			<!--已读未读和点赞弹框-->
			<div class="modal_box" v-show="sharedBoxSmall">
				<div class="small_shared_top clear">
					<p class="fl" v-show="!praiseKey" :class="{'sidebar_read_border':readkeyDetail}"
					   @click="readkeyDetail = true">已读{{readList.length}}</p>
					<p class="fl" v-show="!praiseKey" @click="readkeyDetail = false"
					   :class="{'sidebar_read_border':!readkeyDetail}">未读{{unReadList.length}}</p>
					<p class="fl" v-show="praiseKey">点赞</p>
					<span class="fr" @click="closeSmallShared">×</span>
				</div>
				<div class="small_shared_imgBox">
					<div class="small_shared_imgFor clear" v-if="readkeyDetail">
						<div class="small_shared_img_box fl" v-for="reader in readList">
							<img :src="reader.picture" alt="">
							<p>{{reader.name}}</p>
						</div>
					</div>
					<div class="small_shared_imgFor clear" v-if="!readkeyDetail">
						<div class="small_shared_img_box fl" v-for="reader in unReadList">
							<img :src="reader.picture" alt="">
							<p>{{reader.name}}</p>
						</div>
					</div>
					<div class="small_shared_imgFor clear" v-if="praiseKey">
						<div class="small_shared_img_box fl" v-for="reader in praiseList">
							<img :src="reader.picture" alt="">
							<p>{{reader.name}}</p>
						</div>
					</div>
				</div>
			</div>
			<!--小遮罩-->
			<div class="shared_box_small" v-show="sharedBoxSmall"></div>
		</div>
		<!--大遮罩-->
		<div class="shared_box_big" v-if="SidebarShow"  @click="handleClose"></div>
		<PreviewPhoto :photoUrl="previewPhoto" :isShow="isShowPhoto" @editParents="editParents"></PreviewPhoto>
	</div>
</template>

<script>
	import '../../../../modules/common'
	import PreviewPhoto from '../../../commons/previewPhoto'

	export default {
		name: "sidebar",
		components:{
			PreviewPhoto
		},
		data() {
			let userContent = JSON.parse(sessionStorage.getItem("teamEmployeeDetailVO"));
			return {
				// token: "/oaManager",
				token: "/reportManager",
				userContent: userContent,
				SidebarShow: false,
				// isFunc: false,   //遮罩的点击事件用
				activeIndex: "1",
				type: 1,
				createTime: new Date().Format("yyyy-MM-dd HH:mm"),
				readkey: true,   //已读未读Tab
				readkeyDetail: true,   //已读未读详情Tab
				praiseKey: false,   //点赞详情
				inputFocus: false,
				comment: "",   //评论内容
				sharedBoxSmall: false,   //已读未读和点赞弹框
				nowWorkList: [],
				afterWorkList: [],
				summarize: "",
				coordinate: "",
				remark: "",
				readList: [],//已读
				unReadList: [],//未读
				readNumber: "",//已读人数
				unreadNumber: "",//未读人数
				praiseList: [],//点赞列表
				commentList: [],//评论列表
				pictureList: [],//图片列表
				attachmentList: [],//附件列表
				receiverList: [],//接收人列表
				laudNumber: 0,
				viewAttachmentList: [],
				isLaud: false, //是否点赞
				previewPhoto: "",  //点击图片放大
				isShowPhoto: false,  //点击图片查看组件使用
			}
		},
		props: {
			sidebarShow: {  //展示隐藏
				type: Boolean,
				default: false,
				required: true
			},
			reportType: {  //汇报类型
				type: Number,
				default: 0,
				required: true
			},
			reportId: {  //汇报id
				type: Number,
				default: ""
			},
			newsNotice: { //是否是消息通知页面传递参数的开关
				type: Boolean,
				default: false,
			}
		},
		watch: {
			reportType() {
				this.type = this.reportType;
			},
			sidebarShow() {
				this.SidebarShow = this.sidebarShow;
				if(this.SidebarShow && this.reportId)
				this.getReportDetail();
			}
		},
		mounted() {
			// this.getReportDetail();
		},
		methods: {
			handleSelect(key, keyPath) {
				if(this.newsNotice) {
					if (key === "1-1") { //修改汇报
						this.$router.push({name:'writeReport',query:{id:this.reportId, msgType:'edit' , newsFlag:this.newsNoticeFlag}});
						this.$emit('changeNewsFlag');
					}
					if (key === "1-2") { //写汇报
						this.$router.push({name:'writeReport',query:{id:0, msgType:'add' , newsFlag:this.newsNoticeFlag}});
						this.$emit('changeNewsFlag');
					}
					if (key === "1-3") { //删除汇报
						if (this.reportId) {
							this.$router.push({name:'writeReport',query:{id:this.reportId, msgType:'del' , newsFlag:this.newsNoticeFlag}});
							this.$emit('changeNewsFlag');
						}
					}
				}else {
					if (key === "1-1") { //修改汇报
						if (this.reportId)
							this.$emit("getParentReport", this.reportId, 'edit');
					}
					if (key === "1-2") { //写汇报
						this.$emit("getParentReport", 0, 'add');
					}
					if (key === "1-3") { //删除汇报
						if (this.reportId)
							this.$emit("getParentReport", this.reportId, 'del');
					}
				}
			},
			handleClose() {
				if(this.newsNotice){
					this.$emit('changeNewsFlag');
				}else{
					// this.isFunc = true;   //拿出来就没有点击两次消失的情况了
					if (this.sharedBoxSmall && this.sidebarShow)
						this.sharedBoxSmall = !this.sharedBoxSmall;
					// if (this.isFunc && this.sidebarShow && !this.sharedBoxSmall) {
					if (this.sidebarShow && !this.sharedBoxSmall) {
						this.SidebarShow = false;
						// this.isFunc = false;
						this.$emit("editParents", false);
					} else {
						// this.isFunc = true;
					}
					this.$emit("getParentReport", 0, 'add');
				}
			},
			//关闭已读未读和点赞弹框
			closeSmallShared() {
				this.readkeyDetail = true;
				this.praiseKey = false;
				this.sharedBoxSmall = false;
			},
			//发送评论
			sendData(type) {
				let that = this;
				if (type === 0) {   //type==0 评论    1 点赞
					if (that.comment === "") {
						this.$message.warning("请输入评论内容");
						return false;
					} else if (that.comment.length > 200) {
						this.$message.warning("评论最多200字");
						return false;
					}
					this.$http({
						method: "POST",
						url: this.token + "/v1/feign/oa/report/comment",
						data: {
							reportId: that.reportId,
							commentContent: that.comment,
							companyId:that.userContent.companyId
							// reportInfoDTO: {
							// 	nameAndReportType: that.userContent.employeeName,
							// 	finishWork: that.nowWorkList.constructor == Array ? JSON.stringify(that.nowWorkList) : that.nowWorkList,
							// 	createTime: that.createTime
							// }
						}
					})
						.then(res => {
							if (res.data.code === 200) {
								that.$message.success("评论成功");
								that.commentList.unshift({
									commentatorHeadUrl: that.userContent.iconUrl,
									commentTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
									commentatorName: that.userContent.employeeName,
									commentContent: that.comment
								});
								that.comment = "";
							}
						})
						.catch(error => {
							that.$message.error("评论失败");
						});
				}
				if (type === 1) {
					this.$http({
						method: "POST",
						url: this.token + "/v1/feign/oa/report/laud",
						data: {
							reportId: that.reportId,
							// reportInfoDTO: {
							// 	nameAndReportType: that.userContent.employeeName,
							// 	finishWork: that.nowWorkList.constructor == Array ? JSON.stringify(that.nowWorkList) : that.nowWorkList,
							// 	createTime: that.createTime
							// },
							isLaud: !that.isLaud,
							companyId:that.userContent.companyId
						}
					})
						.then(res => {
							if (res.data.code === 200) {
								if (!that.isLaud) {
									that.isLaud = true;
									that.$message.success("点赞成功");
									that.laudNumber++;
									that.praiseList.unshift({
										laudName: that.userContent.employeeName,
										commentatorHeadUrl: that.userContent.iconUrl
									});
								} else {
									that.isLaud = false;
									that.$message.success("取消点赞");
									that.laudNumber--;
									for (let i = 0; i < that.praiseList.length; i++) {
										if (that.praiseList[i].laudName === that.userContent.employeeName)
											that.praiseList.splice(i, 1);
									}
								}
							} else {
								that.$message.error(res.data.message);
							}
						})
						.catch(error => {
							// that.$message.error("点赞失败");
						});
				}

			},
			//获取汇报详情
			getReportDetail() {
				let that = this;
				if (that.reportId != 0 || that.reportId != ""){
					//清空点赞和评论列表
					that.praiseList = [];
					that.commentList = [];

					this.$http({
						method: 'GET',
						url: that.token + '/v1/feign/oa/report/getReportDetail',
						params: {
							reportId: that.reportId   //汇报id
						},
					}).then(res => {
						if (res.data.code === 200) {
							let data = res.data.data;
							that.type = data.reportTypeId;
							that.nowWorkList = data.finishWorkList; //如果是日报则是今日完成工作；
							that.afterWorkList = data.workPlanList; //如果是日报则是明日工作计划；如
							that.summarize = data.workSummary;  //如果是周报则是本周工作总结；
							that.coordinate = data.coordinationAndAssistance;  //协调与帮助
							that.remark = data.remark; //备注
							that.pictureList = data.pictureList;  //图片
							that.attachmentList = data.attachmentList; //附件
							that.commentList = data.reportCommentVOList ? data.reportCommentVOList : [];//评论列表
							that.receiverList = data.reportReceiverVOList ? data.reportReceiverVOList : [];//接收人列表
							that.praiseList = data.reportLaudVOList ? data.reportLaudVOList : [];//点赞列表
							that.readList = data.readList ? data.readList : [];//已读列表
							that.unReadList = data.unReadList ? data.unReadList : [];//未读列表
							that.readNumber = data.readNumber;//未读列表
							that.unreadNumber = data.unreadNumber;//未读列表
							that.createTime = data.createTime;
							that.laudNumber = data.laudNumber;//点赞数量
							that.isLaud = data.isLaud ? data.isLaud : false;//是否点赞

							that.viewAttachmentList = [];
							for (let i = 0; i < that.attachmentList.length; i++) {
								let type = that.attachmentList[i].originalFileName ? that.attachmentList[i].originalFileName.substring(that.attachmentList[i].originalFileName.lastIndexOf('.'), that.attachmentList[i].originalFileName.length) : 6;
								let size = that.attachmentList[i].fileSize;
								size = size > 1023 ? (size > 1048575 ? ((size / (1024 * 1024)).toFixed(2) + "MB") : ((size / 1024).toFixed(2) + "KB")) : (size + "B");
								let name = that.attachmentList[i].originalFileName;
								let url = that.attachmentList[i].absolutePath;
								switch (type) {
									case ".doc":
									case ".docx":
										that.viewAttachmentList.unshift({
											type: 0,
											size: size,
											name: name,
											url:url
										});
										break;
									case ".xlsx":
									case ".xls":
										that.viewAttachmentList.unshift({
											type: 1,
											size: size,
											name: name,
											url:url
										});
										break;
									case ".ppt":
									case ".pptx":
										that.viewAttachmentList.unshift({
											type: 2,
											size: size,
											name: name,
											url:url
										});
										break;
									case ".rar":
									case ".zip":
										that.viewAttachmentList.unshift({
											type: 3,
											size: size,
											name: name,
											url:url
										});
										break;
									case ".pdf":
										that.viewAttachmentList.unshift({
											type: 4,
											size: size,
											name: name,
											url:url
										});
										break;
									case ".jpg":
									case ".jpeg":
									case ".png":
										that.viewAttachmentList.unshift({
											type: 5,
											size: size,
											name: name,
											url:url
										});
										break;
									default:
										that.viewAttachmentList.unshift({
											type: 6,
											size: size,
											name: name,
											url:url
										});
										break;
								}
							}
						}
					}).catch(error => {
						console.log(error.message);
					});
				}

			},
			//查看图片
			previewImg(url) {
				this.isShowPhoto = true;
				this.previewPhoto = url;
			},
			editParents(value) {
				this.isShowPhoto = value;
			},
			downLoadFile(fileUrl, filaName) {
				let link = document.createElement('a');
				link.style.display = 'none';
				link.href = fileUrl;
				link.setAttribute('download', filaName||'file');
				document.body.appendChild(link);
				link.click();
			}
		}
	}
</script>

<style scoped>
	.file_content_detail img {
		width: 44px;
		height: 44px;
	}

	.file_content_detail p span:nth-child(1) {
		display: block;
		color: #606266;
		font-size: 14px;
	}

	.file_content_detail p span:nth-child(2) {
		display: block;
		color: #909399;
		font-size: 12px;
	}

	.file_content .file_content_detail {
		margin-bottom: 4px;
		cursor: pointer;
	}

	.file_content {
		padding: 20px;
		border-bottom: 1px solid #EDEFF2;
	}

	.photo_content {
		padding: 20px;
		border-bottom: 1px solid #EDEFF2;
	}

	.photo_content img {
		width: 66px;
		height: 66px;
		margin-right: 10px;
		display: inline-block;
		margin-bottom: 10px;
		cursor: pointer;
	}

	.modal_box {
		width: 100%;
		height: 60%;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: white;
		border-radius: 19px 19px 0px 0px;
		z-index: 3;
	}

	.small_shared_top {
		padding: 20px 20px 0 20px;
		border-bottom: 1px solid #EDEFF2;
	}

	.small_shared_top p {
		width: 70px;
		font-size: 14px;
		color: #606266;
		height: 30px;
		vertical-align: top;
		text-align: center;
		display: inline-block;
		cursor: pointer;
	}

	.small_shared_top span {
		cursor: pointer;
		font-size: 16px;
		color: #BFC2CC;
	}

	.small_shared_imgBox {
		padding: 20px;
		overflow-y: auto;
	}

	.small_shared_img_box {
		margin-right: 20px;
	}

	.small_shared_img_box > img {
		width: 44px;
		height: 44px;
	}

	.small_shared_img_box > p {
		width: 44px;
		text-align: center;
		font-size: 14px;
		color: #303133;
		margin-top: 2px;
	}

	.shared_box_small {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
		z-index: 2;
	}

	.shared_box_big {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
	}

	.sidebar_box {
		position: fixed;
		top: 0;
		right: 0;
		width: 600px;
		height: 100%;
		background-color: #fff;
		/*padding: 20px;*/
		z-index: 1;
	}

	.sidebar_box_ne {
		width: 100%;
		height: 100%;
		position: relative;
		overflow-y: auto;
	}

	.sidebar_header {
		height: 30px;
		border-bottom: 1px solid #EDEFF2;
		padding: 20px;
	}

	.sidebar_header > P {
		font-size: 20px;
		color: #303133;
	}

	.sidebar_header > span {
		color: #BFC2CC;
		font-size: 20px;
		cursor: pointer;
	}

	.sidebar_content,
	.sidebar_img,
	.sidebar_praise {
		padding: 20px;
		border-bottom: 1px solid #EDEFF2;
	}

	.sidebar_comment {
		padding: 20px;
		margin-bottom: 80px;
	}

	.sidebar_comment_change {
		margin-bottom: 160px !important;
	}

	.sidebar_comment_box {
		padding: 20px 0;
	}

	.sidebar_comment_border {
		border-top: 1px solid #EDEFF2;
	}

	.content_top > div > img {
		width: 44px;
		height: 44px;
		margin-right: 10px;
	}

	.content_top > div > div {
		font-size: 14px;
	}

	.content_top > div > div > span {
		margin-top: 4px;
		display: block;
		color: #909399;
	}

	.content_top > p {
		line-height: 20px;
		letter-spacing: 4px;
		font-weight: 900;
		cursor: pointer;
	}

	.el-menu-demo {
		border: none !important;
	}

	.el-submenu__title i {
		display: none !important;
	}

	.sidebar_nowWorkList_box,
	.sidebar_afterWorkList_box {
		margin-bottom: 20px;
	}

	.sidebar_nowWorkList_box .sidebar_today_work_text,
	.sidebar_afterWorkList_box .sidebar_after_work_text {
		font-weight: bold;
		font-size: 14px;
	}

	.sidebar_nowWorkList_box .sidebar_detail_box p,
	.sidebar_afterWorkList_box .sidebar_detail_box p {
		margin-top: 4px;
		color: #606266;
	}

	.sidebar_read {
		padding: 20px 20px 0 20px;
		border-bottom: 1px solid #EDEFF2;
	}

	.sidebar_read p {
		width: 70px;
		font-size: 14px;
		color: #606266;
		height: 30px;
		vertical-align: top;
		text-align: center;
		display: inline-block;
		cursor: pointer;
	}

	.sidebar_read_border {
		border-bottom: 1px solid #4278BE;
	}

	.sidebar_img_box {
		margin-right: 20px;
	}

	.sidebar_img_box > img {
		width: 44px;
		height: 44px;
	}

	.sidebar_img > p {
		color: #4278BE;
		font-size: 14px;
		cursor: pointer;
		line-height: 65px;
	}

	.sidebar_img_box > p {
		width: 44px;
		text-align: center;
		font-size: 14px;
		color: #303133;
		margin-top: 2px;
	}

	.sidebar_praise > img {
		margin-right: 10px;
	}

	.sidebar_praise .moreParise {
		cursor: pointer;
	}

	.sidebar_comment_box > img {
		width: 44px;
		height: 44px;
		margin-right: 10px;
	}

	.sidebar_comment_content {
		width: 488px;
		font-size: 14px;
	}

	.sidebar_comment_content > div {
		margin-bottom: 4px;
	}

	.sidebar_comment_content > p {
		color: #606266;
	}

	.sidebar_footer {
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: white;
		-moz-box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.03);
		box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.03);
		padding: 8px 20px;
	}

	.sidebar_footer textarea {
		height: 34px;
		width: 86%;
		padding: 8px 15px;
		border: none;
		resize: none;
		background-color: #F8F8F8;
		font-size: 14px;
		color: #606266;
		border-radius: 3px;
	}

	.sidebar_footer .sidebar_footer_parise {
		width: 14%;
		position: relative;
	}

	.sidebar_footer_parise > img {
		width: 18px;
		height: 18px;
		position: absolute;
		top: 50%;
		left: 37%;
		transform: translate(-50%, 37%);
		cursor: pointer;
	}

	.change_parise {
		height: 80px !important;
		width: 94% !important;
	}

	.sidebar_footer_send {
		width: 55px;
		height: 32px;
		text-align: center;
		line-height: 32px;
		color: white;
		background-color: #4278BE;
		font-size: 16px;
		margin: 10px 0;
		cursor: pointer;
		border-radius: 3px;
		margin-right: 36px;
	}
</style>
