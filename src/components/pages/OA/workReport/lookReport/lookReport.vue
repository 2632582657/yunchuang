<!--@description: 看汇报
	@author: 赵康
    @update: 赵康(2019-08-8 09:45) -->
<template>
	<div id="scroll">
		<div class="look_reoprt_boxTab">
			<ul class="btn_from_where">
				<li :class="{'back_ground':fromWhere === 0}" @click="changeFrom(0)">全部</li>
				<li :class="{'back_ground':fromWhere === 1}" @click="changeFrom(1)">我发出的</li>
				<li :class="{'back_ground':fromWhere === 2}" @click="changeFrom(2)">发给我的</li>
			</ul>
		</div>
		<div class="look_reoprt_box">
			<div class="filter_lookReport">
				<el-checkbox v-model="isUnRead" v-show="isFromMe">只看未读</el-checkbox>
				<el-select v-model="typeOption" placeholder="请选择" class="type_ptions">
					<el-option key="0" label="全部汇报" value=""></el-option>
					<el-option key="1" label="日报" value="1"></el-option>
					<el-option key="2" label="周报" value="2"></el-option>
					<el-option key="3" label="月报" value="3"></el-option>
				</el-select>
				<el-date-picker
					class="date_picker"
					v-model="timePicker"
					type="datetimerange"
					:picker-options="pickerOptions"
					range-separator="至"
					start-placeholder="开始日期和时间"
					end-placeholder="结束日期和时间"
					align="right"
					value-format="yyyy-MM-dd HH:mm:ss">
				</el-date-picker>
				<p class="sender" @click="personDialogVisible = true" v-show="isFromMe">
					{{senderLists.length>13?(senderLists.slice(0,13)+'...'):senderLists}}
					<img src="./images/per.png" alt=""></p>
			</div>
			<div class="praise_list clear"
				 @click="$router.push({name:'reportMessageDetail',params:{pageSize:commentAndParaseNumber}})"
				 v-if="commentAndParaseHeadUrlList.length>0">
				<p class="fr">></p>
				<p class="fr" style="margin-right: 22px;line-height: 22px;">{{commentAndParaseNumber}}条消息</p>
				<img class="praise__img1" src="./images/icon_head.png" alt=""
					 v-if="(commentAndParaseHeadUrlList[0] && commentAndParaseHeadUrlList[0]!='')?false:true"
					 v-show="commentAndParaseHeadUrlList.length>=1">
				<img class="praise__img1"
					 :src="(commentAndParaseHeadUrlList[0] && commentAndParaseHeadUrlList[0]!='')?commentAndParaseHeadUrlList[0]:''"
					 v-show="commentAndParaseHeadUrlList.length>=1"
					 alt="" v-else>
				<img class="praise__img2" src="./images/icon_head.png" alt=""
					 v-if="(commentAndParaseHeadUrlList[0] && commentAndParaseHeadUrlList[0]!='')?false:true"
					 v-show="commentAndParaseHeadUrlList.length>=2">
				<img class="praise__img2"
					 :src="(commentAndParaseHeadUrlList[1] && commentAndParaseHeadUrlList[1]!='')?commentAndParaseHeadUrlList[1]:''"
					 v-show="commentAndParaseHeadUrlList.length>=2"
					 alt="" v-else>
				<img class="praise__img3" src="./images/icon_head.png" alt=""
					 v-if="(commentAndParaseHeadUrlList[2] && commentAndParaseHeadUrlList[2]!='')?false:true"
					 v-show="commentAndParaseHeadUrlList.length>=3">
				<img class="praise__img3"
					 :src="(commentAndParaseHeadUrlList[2] && commentAndParaseHeadUrlList[2]!='')?commentAndParaseHeadUrlList[2]:''"
					 v-show="commentAndParaseHeadUrlList.length>=3"
					 alt="" v-else>
			</div>
			<div class="detail_lookReport_box">
				<div class="detail_lookReport" v-for="(item,index) in reportList" :key="item.id">
					<div class="detail_header_box clear">
						<img class="fl" :src="item.senderHeadUrl" alt="" v-if="item.senderHeadUrl">
						<img class="fl" src="../writeReport/images/icon_head.png" alt="" v-else>
						<div class="fl">
							<p style="text-align: left;" v-if="item.senderName">{{item.senderName}}</p>
							<p style="text-align: left;" v-else>无名</p>
							<span>{{item.createTime?item.createTime.slice(0,16):''}}</span>
						</div>
						<el-dropdown trigger="click" class="fr" style="cursor: pointer;" v-if="fromWhere === 1">
							<span class="el-dropdown-link" style="font-size: 24px;font-weight: 600;color: #909399;">...</span>
							<el-dropdown-menu slot="dropdown" class="elDropDown">
								<p @click="editReport(item.id)">修改汇报</p>
								<p @click="delReport(index,item.id)">删除汇报</p>
							</el-dropdown-menu>
						</el-dropdown>
						<!--						<p class="fr" style="color: #EDEFF2;font-size: 22px;cursor: pointer;"-->
						<!--						   @click="delReport(index,item.id)" v-if="fromWhere === 1">×</p>-->
					</div>
					<div class="detail_content">
						<div class="detail_work clear" v-if="item.reportTypeId">
							<p class="fl">{{item.reportTypeId === 1?"今日":(item.reportTypeId === 2?"本周":"本月")}}完成工作：</p>
							<div v-if="item.finishWorkList.constructor != Array" class="fr">
								<p class="detail_ellipsis">{{item.finishWorkList}}</p>
								<p class="detail_percent">完成度：</p>
							</div>
							<div v-if="item.finishWorkList.constructor === Array"
								 v-for="(res,indexChildren) in item.finishWorkList"
								 class="fr clear">
								<p class="detail_ellipsis">{{res.serialNumber}}.{{res.content}}</p>
								<span class="full_btn fr" v-show="res.isShowFinishWork?res.isShowFinishWork:false"
									  @click="fullContent(index,indexChildren,'finishWorkList')">查看全文</span>
								<span class="full_btn full_btn_packUp fr"
									  v-show="!res.isShowFinishWork?!res.isShowFinishWork:false"
									  v-if="res.content.length>300"
									  @click="fullContent(index,indexChildren,'finishWorkList','packUp')">收起</span>
								<p class="detail_percent" v-if="res.completeness && res.completeness>0">
									完成度：{{res.completeness}}%</p>
							</div>
						</div>
						<div class="detail_work clear" v-if="item.workSummary && item.reportTypeId>1">
							<p class="fl">{{item.reportTypeId === 2?"本周":"本月"}}工作总结：</p>
							<span class="detail_ellipsis fl">{{item.workSummary}}</span>
							<span class="full_btn fr" v-show="item.isShowWorkSummary?item.isShowWorkSummary:false"
								  @click="fullContent(index,'','workSummary')">查看全文</span>
							<span class="full_btn full_btn_packUp fr"
								  v-show="!item.isShowWorkSummary?!item.isShowWorkSummary:false"
								  v-if="item.workSummary.length>300"
								  @click="fullContent(index,'','workSummary','packUp')">收起</span>
						</div>
						<div class="detail_work clear" v-if="item.workPlanList">
							<p class="fl">{{item.reportTypeId === 1?"明日":(item.reportTypeId === 2?"下周":"下月")}}工作计划：</p>
							<!--							<span class="detail_ellipsis">{{item.workPlanList}}</span>-->
							<div v-if="item.workPlanList.constructor != Array" class="fl clear">
								<p class="detail_ellipsis fr">{{item.workPlanList}}</p>
								<!--								<p class="detail_percent">完成度：</p>-->
							</div>
							<div v-if="item.workPlanList.constructor === Array"
								 v-for="(res,indexChildren) in item.workPlanList"
								 class="fr clear">
								<p class="detail_ellipsis fr">{{res.serialNumber}}.{{res.content}}</p>
								<!--								<p class="detail_percent">完成度：{{res.percent}}%</p>-->
								<span class="full_btn fr" v-show="res.isShowWorkPlan?res.isShowWorkPlan:false"
									  @click="fullContent(index,indexChildren,'workPlanList')">查看全文</span>
								<span class="full_btn full_btn_packUp fr"
									  v-show="!res.isShowWorkPlan?!res.isShowWorkPlan:false"
									  v-if="res.content.length>300"
									  @click="fullContent(index,indexChildren,'workPlanList','packUp')">收起</span>
							</div>
						</div>
						<div class="detail_work clear" v-if="item.coordinationAndAssistance">
							<p class="fl">需协调与帮助：</p>
							<span class="detail_ellipsis fl">{{item.coordinationAndAssistance}}</span>
							<span class="full_btn fr" v-show="item.isShowCoordination?item.isShowCoordination:false"
								  @click="fullContent(index,'','coordinationAndAssistance')">查看全文</span>
							<span class="full_btn full_btn_packUp fr"
								  v-show="!item.isShowCoordination?!item.isShowCoordination:false"
								  v-if="item.coordinationAndAssistance.length>300"
								  @click="fullContent(index,'','coordinationAndAssistance','packUp')">收起</span>
						</div>
						<div class="detail_work clear" v-if="item.remark">
							<p class="fl">备注：</p>
							<span class="detail_ellipsis fl">{{item.remark}}</span>
							<span class="full_btn fr" v-show="item.isShowRemark?item.isShowRemark:false"
								  @click="fullContent(index,'','remark')">查看全文</span>
							<span class="full_btn full_btn_packUp fr"
								  v-show="!item.isShowRemark?!item.isShowRemark:false" v-if="item.remark.length>300"
								  @click="fullContent(index,'','remark','packUp')">收起</span>
						</div>
						<div class="detail_img_box" v-if="item.pictureList">
							<!--							<img src="https://dn-dora-service-logo.qbox.me/service-logo-terror.png" alt=""-->
							<!--								 @click="previewImg()" v-for="item.pictureList">-->
							<img :src="url.absolutePath" alt=""
								 @click="previewImg(url.absolutePath)" v-for="url in item.pictureList">
							<el-tooltip class="item" effect="dark" :content="url.name" placement="top"
										v-for="url in item.viewAttachmentList" :key="url.name">
								<img src="@/components/commons/images/word.png" alt=""
									 @click="downLoadFile(url.url,url.name)"
									 v-if="(url.type || url.type===0)?(url.type===0?true:false):false">
								<img src="@/components/commons/images/excel.png" alt=""
									 @click="downLoadFile(url.url,url.name)"
									 v-if="url.type?(url.type===1?true:false):false">
								<img src="@/components/commons/images/ppt.png" alt=""
									 @click="downLoadFile(url.url,url.name)"
									 v-if="url.type?(url.type===2?true:false):false">
								<img src="@/components/commons/images/rar.png" alt=""
									 @click="downLoadFile(url.url,url.name)"
									 v-if="url.type?(url.type===3?true:false):false">
								<img src="@/components/commons/images/pdf.png" alt=""
									 @click="downLoadFile(url.url,url.name)"
									 v-if="url.type?(url.type===4?true:false):false">
								<img src="@/components/commons/images/jpeg.png" alt=""
									 @click="downLoadFile(url.url,url.name)"
									 v-if="url.type?(url.type===5?true:false):false">
								<img src="@/components/commons/images/more.png" alt=""
									 @click="downLoadFile(url.url,url.name)"
									 v-if="url.type?(url.type===6?true:false):false">
							</el-tooltip>
						</div>
					</div>
					<div class="detail_read clear">
						<img class="fl" src="./images/zan.png" alt="">
						<p class="fl" @click="pariseDetail(0,item.readList,item.unReadList)"
						   style="cursor: pointer;margin-right: 20px">
							{{item.readNumber}}人已读</p>
						<img class="fl" src="./images/zan1.png" alt="">
						<p class="fl" @click="pariseDetail(1,item.reportLaudVOList)" style="cursor: pointer;">
							{{item.laudNumber}}人点赞</p>
					</div>
					<div class="detail_discuss clear">
						<div class="clear" v-for="discuss in item.newCommentList" v-show="item.newCommentListPreview">
							<span class="fl">{{discuss.commentatorName}}：</span>
							<p class="fl">{{discuss.commentContent}}</p>
						</div>
						<div class="clear" v-for="discuss in item.reportCommentVOList"
							 v-show="!item.newCommentListPreview">
							<span class="fl">{{discuss.commentatorName}}：</span>
							<p class="fl">{{discuss.commentContent}}</p>
						</div>
						<p class="commentStyle" @click="item.newCommentListPreview = !item.newCommentListPreview"
						   v-show="item.newCommentListPreview && item.reportCommentVOList?item.reportCommentVOList.length>3:false">
							全部{{item.reportCommentVOList?item.reportCommentVOList.length:0}}条评论</p>
					</div>
					<div class="detail_footer_box">
						<div class="detail_footer clear">
                         <textarea class="fl" @focus="item.inputFocus = true" ref="comment"
								   @blur="item.inputFocus = false" placeholder="请输入评论"
								   :class="{'change_parise':item.inputFocus}"></textarea>
							<img class="detail_footer_parise" src="./images/zan2.png" alt=""
								 v-show="!item.inputFocus && !item.isLaud"
								 @click="sendData(1,item.id,index,item.isLaud)">
							<img class="detail_footer_parise" src="./images/zan1.png" alt=""
								 v-show="!item.inputFocus && item.isLaud"
								 @click="sendData(1,item.id,index,item.isLaud)">
							<div class="fr detail_footer_send" v-show="item.inputFocus"
								 @mousedown="sendData(0,item.id,index,item.senderName,item.finishWorkList,item.createTime)">
								发送
							</div>
						</div>
					</div>
				</div>
				<div style="text-align: center;" v-if="reportList.length<1 || !isLoad">{{noDataContent}}</div>
			</div>
		</div>
		<PersonDialog
			:treeData="personnelList"
			:defaultProps="{label:'name',children:'children'}"
			:transferTitle="['选择部门人员', '已选择']"
			:dialogVisible="personDialogVisible"
			:managers="managerList"
			@handlePersonClose="handlePersonClose"
			@handlePsrsonSubmit="handlePsrsonSubmit"></PersonDialog>
		<PreviewPhoto :photoUrl="previewPhoto" :isShow="isShowPhoto" @editParents="editParents"></PreviewPhoto>
		<PariseDetailPop :isShow="isShowParise" :praiseType="praiseType" @editParents="editParents" :readList="readList"
						 :unReadList="unReadList" :pariseList="pariseList"></PariseDetailPop>
	</div>
</template>

<script>
	import PersonDialog from '../../../../commons/persondialog'
	import PreviewPhoto from '../../../../commons/previewPhoto'
	import PariseDetailPop from './pariseDetailPop'

	export default {
		name: "lookReport",
		data() {
			return {
				userDetail: JSON.parse(sessionStorage.getItem("teamEmployeeDetailVO")),
				// token: "/oaManager",
				token: "/reportManager",
				pickerOptions: {
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							let date = new Date();
							let fullYear = date.getFullYear();
							let month = date.getMonth() + 1;
							let ms = month < 10 ? "-" + "0" + month : "-" + month;
							let day = date.getDate();
							let ds = day < 10 ? "-" + "0" + day : "-" + day;
							let rs = fullYear + ms + ds;
							let time = date.getHours();
							if (time < 10) {
								rs += " 0" + time;
							} else {
								rs += " " + time;
							}
							let minutes = date.getMinutes();
							let min = minutes < 10 ? ":0" + minutes : ":" + minutes;
							let seconds = date.getSeconds();
							let sed = seconds < 10 ? ":0" + seconds : ":" + seconds;
							rs += min + sed;

							// const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
							const end = rs;
							let date1 = new Date(new Date(new Date().toLocaleDateString()).getTime());
							const start = date1.getFullYear() + "-" + ((date1.getMonth() + 1) < 10 ? "0" + (date1.getMonth() + 1) : (date1.getMonth() + 1)) + "-" + (date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate()) + " " + (date1.getHours() < 10 ? "0" + date1.getHours() : date1.getHours()) + ":" + (date1.getMinutes() < 10 ? "0" + date1.getMinutes() : date1.getMinutes()) + ":" + (date1.getSeconds() < 10 ? "0" + date1.getSeconds() : date1.getSeconds());
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '本周',
						onClick(picker) {
							let getTime = (n) => {
								let now = new Date();
								let year = now.getFullYear();
								let month = now.getMonth() + 1;
								let day = now.getDay(); //返回星期几的某一天;
								n = day == 0 ? n + 6 : n + (day - 1)
								now.setDate(now.getDate() - n);
								let date = now.getDate();
								let s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
								return s;
							}
							let date = new Date();
							let fullYear = date.getFullYear();
							let month = date.getMonth() + 1;
							let ms = month < 10 ? "-" + "0" + month : "-" + month;
							let day = date.getDate();
							let ds = day < 10 ? "-" + "0" + day : "-" + day;
							let rs = fullYear + ms + ds;
							let time = date.getHours();
							if (time < 10) {
								rs += " 0" + time;
							} else {
								rs += " " + time;
							}
							let minutes = date.getMinutes();
							let min = minutes < 10 ? ":0" + minutes : ":" + minutes;
							let seconds = date.getSeconds();
							let sed = seconds < 10 ? ":0" + seconds : ":" + seconds;
							rs += min + sed;

							// const end = getTime(-6) + " 23:59:59";
							const end = rs;
							const start = getTime(0) + " 00:00:00";
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '本月',
						onClick(picker) {
							let formatDateTime = (inputTime) => {
								let date = new Date(inputTime);
								let y = date.getFullYear();
								let m = date.getMonth() + 1;
								m = m < 10 ? ('0' + m) : m;
								let d = date.getDate();
								d = d < 10 ? ('0' + d) : d;
								let h = date.getHours();
								h = h < 10 ? ('0' + h) : h;
								let minute = date.getMinutes();
								let second = date.getSeconds();
								minute = minute < 10 ? ('0' + minute) : minute;
								second = second < 10 ? ('0' + second) : second;
								return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
							};

							let date = new Date();
							let fullYear = date.getFullYear();
							let month = date.getMonth() + 1;
							let ms = month < 10 ? "-" + "0" + month : "-" + month;
							let day = date.getDate();
							let ds = day < 10 ? "-" + "0" + day : "-" + day;
							let rs = fullYear + ms + ds;
							let time = date.getHours();
							if (time < 10) {
								rs += " 0" + time;
							} else {
								rs += " " + time;
							}
							let minutes = date.getMinutes();
							let min = minutes < 10 ? ":0" + minutes : ":" + minutes;
							let seconds = date.getSeconds();
							let sed = seconds < 10 ? ":0" + seconds : ":" + seconds;
							rs += min + sed;

							let data = new Date();
							data.setDate(1);
							data.setHours(0);
							data.setSeconds(0);
							data.setMinutes(0);

							// const end = getTime(-6) + " 23:59:59";
							const end = rs;
							const start = formatDateTime(data.getTime());

							picker.$emit('pick', [start, end]);
						}
					}]
				},
				fromWhere: 0,
				isUnRead: false,
				typeOption: "",
				timePicker: "",
				startTime: "",
				endTime: "",
				senderLists: "点击选择发送人",
				senderIdList: null,//发送人Id
				personnelList: [],   //通讯录人员列表
				personDialogVisible: false,
				previewPhoto: "",  //点击图片放大
				isShowPhoto: false,  //点击图片查看组件使用
				isShowParise: false,//已读未读和点赞详情弹框
				praiseType: 0, //0 已读未读 1 点赞
				reportList: [],  //汇报列表
				isLoad: true,  //下拉加载锁
				pageNo: 1,
				readList: [],
				unReadList: [],
				pariseList: [],
				reportListBak: [],
				reportListBak2: [],
				managerList: [],//通讯录用
				isFromMe: true,//我发出的时，只看未读和点击选择发送人消失
				viewAttachmentList: [],//列表展示附件用
				commentAndParaseListPageNo: 1,//点赞评论列表用
				commentAndParaseListPageSize: 10,//点赞评论列表用
				commentAndParaseNumber: 0,   //未读消息提示数
				commentAndParaseHeadUrlList: [], //未读消息头像列表
				noDataContent: "无汇报信息",//无数据的提示信息
			}
		},
		components: {
			PersonDialog,
			PreviewPhoto,
			PariseDetailPop
		},
		watch: {
			isUnRead() {
				this.pageNo = 1;
				this.getReportLists("get");
				// if (this.isUnRead) {
				// };
			},
			typeOption() {
				this.pageNo = 1;
				this.getReportLists("get");
			},
			timePicker() {
				this.pageNo = 1;
				if (this.timePicker) {
					this.startTime = this.timePicker[0];
					this.endTime = this.timePicker[1];
				} else {
					this.startTime = "";
					this.endTime = "";
				}
				this.getReportLists("get");
			},
			senderIdList() {
				this.pageNo = 1;
				this.getReportLists("get");
			}
		},
		mounted() {
			//获取通讯录人员
			this.getPersonnelList();
			//省略号处理
			// this.ellipsisFunc();

			//获取汇报列表
			this.getReportLists(0);

			this.$nextTick(() => {
				this.$parent.$parent.$el.addEventListener('scroll', this.lookReportSonscroll, true);
			});

			//获取评论点赞列表
			// this.getCommentAndParaseList();
		},
		methods: {
			changeFrom(type) {
				if (type === 0) {
					this.fromWhere = 0;
					this.isFromMe = true;
				} else if (type === 1) {
					this.fromWhere = 1;
					//当选择我发起的时候，只看未读和点击选择发送人消失
					this.isFromMe = false;
					this.isUnRead = false;
					this.senderLists = "点击选择发送人";
					this.senderIdList = null;//发送人Id
				} else if (type === 2) {
					this.fromWhere = 2;
					this.isFromMe = true;
				}
				this.pageNo = 1;
				this.getReportLists("get");
			},
			// 选择部门人员弹框   关闭按钮
			handlePersonClose() {
				this.personDialogVisible = false;
			},
			//选择部门人员弹框   确定按钮
			handlePsrsonSubmit(list) {
				this.managerList = list;
				this.senderLists = "点击选择发送人";
				if (list.length === 0)
					this.senderIdList = null;
				else
					this.senderIdList = [];
				if (list.length > 0) {
					this.senderLists = "";
					for (let i = 0; i < list.length; i++) {
						this.senderLists += (list[i].name + "、");
						this.senderIdList.push(list[i].id);
					}
					this.senderLists = this.senderLists.substring(0, this.senderLists.lastIndexOf('、'));
				}
			},
			//获取通讯录人员
			getPersonnelList() {
				let that = this;
				this.$http({
					method: 'POST',
					url: '/orgManager/v1/organization/department/queryAddressBook2',
					data: {
						companyId: that.userDetail.companyId
					},
				}).then(res => {
					if (res.data.data)
						this.personnelList = res.data.data.children;
				}).catch(error => {
					console.log(error.message);
				});
			},
			//省略号的处理
			ellipsisFunc() {
				for (let i = 0; i < this.reportList.length; i++) {
					if (this.reportList[i].finishWorkList) {  //今日完成工作
						if (this.reportList[i].finishWorkList.constructor == Array) {
							for (let j = 0; j < this.reportList[i].finishWorkList.length; j++) {
								if (this.reportList[i].finishWorkList[j].content) {
									const content = this.reportList[i].finishWorkList[j].content;
									if (content.indexOf("...") < 0) {
										if (content.length > 300) {
											this.reportList[i].finishWorkList[j].content = content.substr(0, 300) + "...";
											this.reportList[i].finishWorkList[j]["isShowFinishWork"] = true;
										}
									}
								}
							}
						}
					}
					if (this.reportList[i].workSummary) {   //工作总结
						const content = this.reportList[i].workSummary;
						if (content.indexOf("...") < 0) {
							if (content.length > 300) {
								this.reportList[i].workSummary = content.substr(0, 300) + "...";
								this.reportList[i]["isShowWorkSummary"] = true;
							}
						}
					}
					if (this.reportList[i].workPlanList) {   //明日工作计划
						if (this.reportList[i].workPlanList.constructor == Array) {
							for (let j = 0; j < this.reportList[i].workPlanList.length; j++) {
								if (this.reportList[i].workPlanList[j].content) {
									const content = this.reportList[i].workPlanList[j].content;
									if (content.indexOf("...") < 0) {
										if (content.length > 300) {
											this.reportList[i].workPlanList[j].content = content.substr(0, 300) + "...";
											this.reportList[i].workPlanList[j]["isShowWorkPlan"] = true;
										}
									}
								}
							}
						}
					}
					if (this.reportList[i].coordinationAndAssistance) {   //协调与帮助
						const content = this.reportList[i].coordinationAndAssistance;
						if (content.indexOf("...") < 0) {
							if (content.length > 300) {
								this.reportList[i].coordinationAndAssistance = content.substr(0, 300) + "...";
								this.reportList[i]["isShowCoordination"] = true;
							}
						}
					}
					if (this.reportList[i].remark) {   //备注
						const content = this.reportList[i].remark;
						if (content.indexOf("...") < 0) {
							if (content.length > 300) {
								this.reportList[i].remark = content.substr(0, 300) + "...";
								this.reportList[i]["isShowRemark"] = true;
							}
						}
					}
				}
				this.reportListBak2 = JSON.stringify(this.reportList);//做个带有省略号的备份
			},
			//查看全文，收起
			fullContent(index, indexChildren, name, packUp) {
				let list = JSON.parse(this.reportListBak);
				let list2 = JSON.parse(this.reportListBak2);
				if (name === "finishWorkList") {  //今日完成工作
					if (packUp != 'packUp') {  //查看全文
						this.reportList[index].finishWorkList[indexChildren].content = list[index].finishWorkList[indexChildren].content;
						this.reportList[index].finishWorkList[indexChildren].isShowFinishWork = false;
					} else {   //收起
						this.reportList[index].finishWorkList[indexChildren].content = list2[index].finishWorkList[indexChildren].content;
						this.reportList[index].finishWorkList[indexChildren].isShowFinishWork = true;
					}

				}
				if (name === "workSummary") {  //工作总结
					if (packUp != 'packUp') {
						this.reportList[index].workSummary = list[index].workSummary;
						this.reportList[index].isShowWorkSummary = false;
					} else {
						this.reportList[index].workSummary = list2[index].workSummary;
						this.reportList[index].isShowWorkSummary = true;
					}
				}
				if (name === "workPlanList") {  //明日工作计划
					if (packUp != 'packUp') {
						this.reportList[index].workPlanList[indexChildren].content = list[index].workPlanList[indexChildren].content;
						this.reportList[index].workPlanList[indexChildren].isShowWorkPlan = false;
					} else {
						this.reportList[index].workPlanList[indexChildren].content = list2[index].workPlanList[indexChildren].content;
						this.reportList[index].workPlanList[indexChildren].isShowWorkPlan = true;
					}
				}
				if (name === "coordinationAndAssistance") {  //协调与帮助
					if (packUp != 'packUp') {
						this.reportList[index].coordinationAndAssistance = list[index].coordinationAndAssistance;
						this.reportList[index].isShowCoordination = false;
					} else {
						this.reportList[index].coordinationAndAssistance = list2[index].coordinationAndAssistance;
						this.reportList[index].isShowCoordination = true;
					}
				}
				if (name === "remark") {  //备注
					if (packUp != 'packUp') {
						this.reportList[index].remark = list[index].remark;
						this.reportList[index].isShowRemark = false;
					} else {
						this.reportList[index].remark = list2[index].remark;
						this.reportList[index].isShowRemark = true;
					}
				}
			},
			//获取汇报列表
			getReportLists(type) {
				let that = this;
				let filter = {
					senderIdList: that.senderIdList, //发送人id
					beginTime: that.startTime,
					endTime: that.endTime,
					pageNo: that.pageNo,
					pageSize: 5,
					appOrWeb: true,
					companyId: that.userDetail.companyId
				};
				if (this.isUnRead) {   //只看未读
					filter["isRead"] = false;
				}
				if (this.typeOption != "") {  //汇报类型id
					filter["reportTypeId"] = this.typeOption;
				}

				if (this.fromWhere > 0) {
					filter["sendOrReceive"] = this.fromWhere; //我发出的还是发给我的(1我发出的2发给我的)
				}
				if (this.fromWhere === 2) {
					filter["receiverId"] = that.userDetail.employeeId; //接收人id
				}
				this.$http({
					method: "POST",
					url: this.token + "/v1/feign/oa/report/pageReport",
					data: filter
				})
					.then(res => {
						if (res.data.code === 200) {
							if (res.data.data.pageInfo) {
								if (res.data.data.pageInfo.list) {
									let dataList = res.data.data.pageInfo.list;
									for (let i = 0; i < dataList.length; i++) {
										// if (dataList[i].finishWorkList.indexOf("}]") > -1) {
										// 	dataList[i].finishWorkList = JSON.parse(dataList[i].finishWorkList);
										// }
										// if (dataList[i].workPlanList.indexOf("}]") > -1) {
										// 	dataList[i].workPlanList = JSON.parse(dataList[i].workPlanList);
										// }

										if (dataList[i].reportCommentVOList) {
											dataList[i].reportCommentVOList.reverse();//评论列表反转
											dataList[i]["newCommentList"] = dataList[i].reportCommentVOList.slice(0, 3);
											dataList[i]["newCommentListPreview"] = true;
										} else {
											dataList[i].reportCommentVOList = [];
											dataList[i]["newCommentList"] = [];
										}
										//列表附件的展示
										dataList[i]["viewAttachmentList"] = [];
										if (dataList[i].attachmentList)
											if (dataList[i].attachmentList.length > 0) {
												for (let j = 0; j < dataList[i].attachmentList.length; j++) {
													let name = dataList[i].attachmentList[j].originalFileName;
													let fileType = dataList[i].attachmentList[j].originalFileName ? dataList[i].attachmentList[j].originalFileName.substring(dataList[i].attachmentList[j].originalFileName.lastIndexOf('.'), dataList[i].attachmentList[j].originalFileName.length) : 6;
													let url = dataList[i].attachmentList[j].absolutePath ? dataList[i].attachmentList[j].absolutePath : "";
													switch (fileType) {
														case ".doc":
														case ".docx":
															dataList[i].viewAttachmentList.push({
																type: 0,
																name: name,
																url: url
															});
															break;
														case ".xlsx":
														case ".xls":
															dataList[i].viewAttachmentList.push({
																type: 1,
																name: name,
																url: url
															});
															break;
														case ".ppt":
														case ".pptx":
															dataList[i].viewAttachmentList.push({
																type: 2,
																name: name,
																url: url
															});
															break;
														case ".rar":
														case ".zip":
															dataList[i].viewAttachmentList.push({
																type: 3,
																name: name,
																url: url
															});
															break;
														case ".pdf":
															dataList[i].viewAttachmentList.push({
																type: 4,
																name: name,
																url: url
															});
															break;
														case ".jpg":
														case ".jpeg":
														case ".png":
															dataList[i].viewAttachmentList.push({
																type: 5,
																name: name,
																url: url
															});
															break;
														default:
															dataList[i].viewAttachmentList.push({
																type: 6,
																name: name,
																url: url
															});
															break;
													}
												}
											}

										//评论时用inputFocus
										dataList[i]["inputFocus"] = false;
									}

									if (that.reportList.length === 0) {
										that.reportList = dataList;
									} else {
										if (type === "get") {//清空再赋值
											that.reportList = [];
											that.reportList = that.reportList.concat(dataList);
										} else {
											that.reportList = that.reportList.concat(dataList);
										}
									}
									that.isLoad = true;    //下拉加载锁
									that.pageNo += 1;
									that.reportListBak = JSON.stringify(that.reportList); //做个备份
									that.ellipsisFunc();  //省略号处理
								} else if (that.isLoad) {   //非下拉
									that.reportList = [];
									that.noDataContent = "无汇报信息";
								} else if (!that.isLoad) {   //下拉
									that.noDataContent = "无更多数据";
								}
							}
							if (res.data.data.reportMessage) {
								if (res.data.data.reportMessage.headUrlList)
									if (res.data.data.reportMessage.headUrlList.length > 0) {
										that.commentAndParaseHeadUrlList = res.data.data.reportMessage.headUrlList;
										if (res.data.data.reportMessage.number)
											that.commentAndParaseNumber = res.data.data.reportMessage.number;
									}
							}
						} else if (res.data.code === -1)
							that.$message.error("系统错误");
					})
					.catch(error => {
						that.$message.error("获取汇报列表失败");
					});
			},
			//发送评论
			sendData(type, reportId, index, isLaud,) {
				let that = this;
				if (type === 0) {   //type==0 评论    1 点赞
					if (that.$refs.comment[index].value.length > 200) {
						this.$message.warning("评论最多200字");
						return false;
					}
					this.$http({
						method: "POST",
						url: this.token + "/v1/feign/oa/report/comment",
						data: {
							reportId: reportId,
							commentContent: that.$refs.comment[index].value,
							companyId: that.userDetail.companyId
						}
					})
						.then(res => {
							if (res.data.code === 200) {
								that.$message.success("评论成功");
								if (that.reportList[index].reportCommentVOList) {
									if (that.reportList[index].reportCommentVOList.constructor != Array) {
										that.reportList[index].reportCommentVOList = [];
									}
									that.reportList[index].reportCommentVOList.unshift({
										commentatorName: that.userDetail.employeeName,
										commentContent: that.$refs.comment[index].value
									});
								}
								if (that.reportList[index].newCommentList) {
									if (that.reportList[index].newCommentList.constructor != Array) {
										that.reportList[index].newCommentList = [];
									}
									that.reportList[index].newCommentList.unshift({
										commentatorName: that.userDetail.employeeName,
										commentContent: that.$refs.comment[index].value
									});
								}
								if (that.reportList[index].newCommentList.length > 3) {
									that.reportList[index].newCommentList = that.reportList[index].newCommentList.slice(0, 3);
								}
								that.$refs.comment[index].value = "";
							} else {
								that.$message.error("评论异常");
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
							reportId: reportId,
							isLaud: !isLaud,
							companyId: that.userDetail.companyId
						}
					})
						.then(res => {
							if (res.data.code === 200) {
								if (!isLaud) {
									if (!that.reportList[index].reportLaudVOList)
										that.reportList[index].reportLaudVOList = [];
									that.reportList[index].reportLaudVOList.unshift({
										laudName: that.userDetail.employeeName,
										laudHeadUrl: that.userDetail.iconUrl
									});
									that.$message.success("点赞成功");
									that.reportList[index].laudNumber++;
									that.reportList[index].isLaud = true;
								} else {
									if (that.reportList[index].reportLaudVOList) {
										that.reportList[index].reportLaudVOList.shift(0, 1);
										that.$message.success("取消点赞");
										that.reportList[index].laudNumber--;
										that.reportList[index].isLaud = false;
									}
								}

							} else {
								that.$message.error(res.data.message);
							}
						})
						.catch(error => {
							that.$message.error("点赞失败");
						});
				}

			},
			//点赞
			//查看图片
			previewImg(url) {
				this.isShowPhoto = true;
				this.previewPhoto = url;
			},
			//查看点赞，已读未读详情
			pariseDetail(type, list1, list2) {
				this.praiseType = type;
				this.isShowParise = true;
				if (type === 0) {  //已读未读
					if (list1)
						this.readList = list1;
					if (list2)
						this.unReadList = list2;
				} else {  //点赞
					if (list1)
						this.pariseList = list1;
				}
			},
			editParents(value) {
				this.isShowPhoto = value;
				this.isShowParise = false;
			},
			//下拉加载
			//获取滚动条当前的位置
			getScrollTop() {
				let scrollTop = 0;
				if (document.documentElement && document.documentElement.scrollTop) {
					scrollTop = document.documentElement.scrollTop;
				} else if (document.body) {
					// scrollTop = document.body.scrollTop;
					scrollTop = this.$parent.$parent.$el.scrollTop;
				}
				return scrollTop;
			},
			//获取当前可视范围的高度
			getClientHeight() {
				let clientHeight = 0;
				if (document.body.clientHeight && document.documentElement.clientHeight) {
					clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
				} else {
					// clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
					clientHeight = Math.max(this.$parent.$parent.$el.clientHeight, document.documentElement.clientHeight);
				}
				return clientHeight;
			},
			//获取文档完整的高度
			getScrollHeight() {
				// return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
				return Math.max(this.$parent.$parent.$el.scrollHeight, document.documentElement.scrollHeight);
			},
			lookReportSonscroll() {
				if (this.pageNo > 1) {
					if ((this.getScrollTop() + this.getClientHeight() + 10 > this.getScrollHeight()) && this.isLoad) {
						this.isLoad = false;
						this.getReportLists();
					}
				}
			},
			//获取点赞评论列表
			// getCommentAndParaseList() {
			// 	let that = this;
			// 	this.$http({
			// 		method: "POST",
			// 		url: this.token + "/v1/feign/oa/report/getCommentAndLaud",
			// 		data: {
			// 			pageNo: that.commentAndParaseListPageNo,
			// 			pageSize: that.commentAndParaseListPageSize
			// 		}
			// 	})
			// 		.then(res => {
			// 			if (res.data.code === 200) {.viewAttachmentList"
			// 				if (res.data.data.list) {
			// 					that.commentAndParaseList = res.data.data.list;
			// 				}
			// 			}
			// 		})
			// 		.catch(error => {
			// 			that.$message.error("获取评论点赞列表失败");
			// 		});
			// },
			downLoadFile(fileUrl, filaName) {
				let link = document.createElement('a');
				link.style.display = 'none';
				link.href = fileUrl;
				link.setAttribute('download', filaName||'file');
				document.body.appendChild(link);
				link.click();
			},
			//删除汇报
			delReport(index, reportId) {
				let that = this;
				this.$http({
					method: 'POST',
					url: that.token + '/v1/feign/oa/report/deleteReport',
					params: {
						reportId: reportId  //汇报id
					},
				}).then(res => {
					if (res.data.data) {
						that.$message.success("删除成功");
						that.reportList.splice(index, 1);
					}
				}).catch(error => {
					console.log(error.message);
				});
			},
			//修改汇报
			editReport(reportId){
				this.$router.push({name:"writeReport",params:{reportID:reportId}});
			}
		},
		destroyed: function () {
			this.$parent.$parent.$el.removeEventListener('scroll', this.lookReportSonscroll, true);   //  离开页面清除滚动事件
		}
	}
</script>

<style lang="scss" scoped>
	.elDropDown>p:hover{
		background-color: #ecf5ff;
		color: #66b1ff;
		cursor: pointer;
	}
	.elDropDown>p{
		line-height: 36px;
		text-align: center;
		padding: 0 20px;
	}
	.full_btn_packUp {
		margin-right: -14px;
	}

	.praise_list .praise__img3 {
		position: absolute;
		top: 5px;
		left: 30px;
	}

	.praise_list .praise__img2 {
		position: absolute;
		top: 5px;
		left: 18px;
	}

	.praise_list .praise__img1 {
		position: absolute;
		top: 5px;
		left: 6px;
	}

	.praise_list img {
		width: 20px;
		height: 20px;
	}

	.praise_list {
		width: 134px;
		height: 20px;
		background-color: #EDEFF2;
		margin: 0 auto;
		border-radius: 3px;
		cursor: pointer;
		line-height: 20px;
		padding: 5px 8px;
		color: #BFC2CC;
		position: relative;
	}

	.detail_content .detail_work .full_btn {
		width: 83px !important;
		cursor: pointer;
		color: #4278BE !important;
		font-size: 12px;
	}

	.look_reoprt_box {
		background-color: white;
		padding: 20px;

		.detail_lookReport_box {
			/*display: table-cell;*/
			vertical-align: middle;
			text-align: center;
			/*margin-top: 25px;*/

			.detail_lookReport {
				display: inline-block;
				width: 868px;
				box-shadow: 1px 1px 8px 0px rgba(191, 194, 204, 0.3);
				border-radius: 3px;
				border: 1px solid rgba(248, 248, 248, 1);
				margin: 15px 0;
				padding: 30px;

				.detail_footer_box {
					margin: 0px 52px 0px 52px;

					.detail_footer {
						width: 100%;
						background-color: white;
						/*padding: 8px 20px;*/
						position: relative;

						textarea {
							height: 34px;
							width: 100%;
							padding: 8px 15px;
							border: 1px solid rgba(191, 194, 204, 1);
							resize: none;
							background-color: #fff;
							font-size: 14px;
							color: #606266;
							border-radius: 3px;
						}

						.detail_footer_parise {
							width: 18px;
							height: 18px;
							position: absolute;
							top: 0%;
							right: 0%;
							transform: translate(-50%, 37%);
							cursor: pointer;
						}

						.change_parise {
							height: 80px !important;
							width: 100% !important;
						}

						.detail_footer_send {
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
						}
					}
				}

				.detail_discuss {
					margin: 0px 52px 16px 52px;
					color: #909399;
					font-size: 14px;
					text-align: left;
					margin-top: 10px;

					div {
						p {
							width: 92%;
							word-break: break-word;
						}
					}

					.commentStyle {
						color: #4278BE;
						font-size: 14px;
						cursor: pointer;
						margin-top: 6px;
					}
				}

				.detail_read {
					border-bottom: 1px solid #EDEFF2;
				}

				.detail_read,
				.detail_parise {
					margin: 0px 52px 0px 52px;
					color: #303133;
					font-size: 14px;
					height: 46px;
					display: flex;
					align-items: center;

					img {
						width: 16px;
						height: 16px;
						margin-right: 6px;
					}
				}

				.detail_content {
					margin: 6px 52px 0px 52px;
					padding-bottom: 18px;
					border-bottom: 1px solid #EDEFF2;

					.detail_work {
						width: 100%;
						font-size: 14px;
						margin-bottom: 4px;

						div {
							p {
								text-align: left;
								width: 100%;
								color: #606266;
								font-weight: 400;
							}
						}

						p {
							width: 13%;
							color: #303133;
							font-weight: 900;
							display: inline-block;
							text-align: right;
							vertical-align: top;
						}

						span, div {
							word-wrap: break-word;
							text-align: left;
							display: inline-block;
							width: 87%;
							color: #606266;
						}
					}

					.detail_img_box {
						text-align: left;
						margin-top: 20px;

						img {
							width: 66px;
							height: 66px;
							margin-right: 10px;
							display: inline-block;
							cursor: pointer;
						}
					}
				}

				.detail_header_box {
					img {
						width: 44px;
						height: 44px;
						margin-right: 8px;
					}

					div {
						p {
							color: #303133;
							font-size: 16px;
						}

						span {
							display: inline-block;
							margin-top: 2px;
							font-size: 14px;
							color: #909399;
						}
					}
				}
			}
		}

		.filter_lookReport {
			margin-bottom: 25px;

			.type_ptions {
				width: 110px;
			}

			.date_picker {
				margin: 0 20px;
				width: 356px;
			}

			.sender {
				display: inline-block;
				border-radius: 4px;
				border: 1px solid #DCDFE6;
				box-sizing: border-box;
				color: #606266;
				font-size: inherit;
				height: 40px;
				line-height: 40px;
				outline: 0;
				padding: 0 15px;
				width: 227px;
				cursor: pointer;
				position: relative;

				img {
					position: absolute;
					top: 50%;
					right: 3%;
					transform: translate(-50%, -50%);
				}
			}
		}
	}

	.look_reoprt_boxTab {
		.back_ground {
			border-bottom: 5px solid #4278BE;
			color: #4278BE !important;
		}

		.btn_from_where li {
			color: #BFC2CC;
			font-size: 18px;
			width: 118px;
			height: 46px;
			display: inline-block;
			text-align: center;
			line-height: 46px;
			cursor: pointer;
		}
	}
</style>
