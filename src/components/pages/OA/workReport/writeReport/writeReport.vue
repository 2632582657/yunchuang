<!--@description: 写汇报
	@author: 赵康
    @update: 赵康(2019-08-8 09:45) -->
<template>
	<div class="write_reoprt_box">
		<div class="">
			<p class="reoprt_type_text">请选择汇报类型：</p>
			<ul class="type_btn">
				<li :class="{'bak_ground':type===1}" @click="reportType(1)">日报</li>
				<li :class="{'bak_ground':type===2}" @click="reportType(2)">周报</li>
				<li :class="{'bak_ground':type===3}" @click="reportType(3)">月报</li>
			</ul>
		</div>
		<p class="before_project" ref="textChange" @click="popOutFunc(0)">{{type === 1?"引用上一篇":(type ===
			2?"引用上一周":"引用上一月")}}工作计划</p>
		<div class="today_work_box">
			<p class="today_work_text"><span class="mustFill">*</span>{{type === 1?"今日":(type === 2?"本周":"本月")}}完成工作</p>
			<div class="detail_box">
				<div class="today_work_detail clear" v-for="(res,index) in nowWorkList">
					<span class="fl">{{index+1}}.</span>
					<el-input
						style="border-right: 1px solid #EDEFF2;"
						class="detail_text fl"
						type="textarea"
						autosize
						placeholder="请输入"
						v-model="res.content">
					</el-input>
					<div class="detail_percent fr">
						<div>
							<span>完成度</span>
							<input type="text" v-model="res.completeness" @input="changeFunc(res.completeness,index)">
							<span>%</span>
						</div>
					</div>
					<p class="delete_box" v-show="nowWorkList.length>1" @click="delWork('today',index)">-</p>
				</div>
			</div>
			<p class="add_work" @click="addWork('today')">+</p>
		</div>
		<div class="remark_box" v-show="type === 1?false:true">
			<p class="today_work_text"><span class="mustFill">*</span>{{type === 2?"本周":"本月"}}工作总结</p>
			<el-input
				class="remark_text"
				type="textarea"
				autosize
				placeholder="请输入"
				v-model="summarize">
			</el-input>
			<!--			<textarea class="remark_text" v-model="summarize" oninput="this.style.height=this.scrollHeight + 'px'"-->
			<!--					  onpropertychange="this.style.height=this.scrollHeight + 'px'"-->
			<!--					  placeholder="请输入"></textarea>-->
		</div>
		<div class="tomorrow_work_box">
			<p class="today_work_text"><span class="mustFill">*</span>{{type === 1?"明日":(type === 2?"下周":"下月")}}工作计划</p>
			<div class="detail_box">
				<div class="tommorrw_work_detail" v-for="(res,index) in afterWorkList">
					<span class="fl">{{index+1}}.</span>
					<el-input
						class="detail_text"
						type="textarea"
						autosize
						placeholder="请输入"
						v-model="res.content">
					</el-input>
					<!--					<textarea class="detail_text" v-model="res.detail"-->
					<!--							  oninput="this.style.height=this.scrollHeight + 'px'"-->
					<!--							  onpropertychange="this.style.height=this.scrollHeight + 'px'"></textarea>-->
					<p class="delete_box" v-show="afterWorkList.length>1" @click="delWork('tomorrow',index)">-</p>
				</div>
			</div>
			<p class="add_work" @click="addWork('tomorrow')">+</p>
		</div>
		<div class="remark_box" v-show="type === 1?false:true">
			<p class="today_work_text">需协调与帮助</p>
			<el-input
				class="remark_text"
				type="textarea"
				autosize
				placeholder="请输入"
				v-model="coordinate">
			</el-input>
			<!--			<textarea class="remark_text" v-model="coordinate" oninput="this.style.height=this.scrollHeight + 'px'"-->
			<!--					  onpropertychange="this.style.height=this.scrollHeight + 'px'"-->
			<!--					  placeholder="请输入"></textarea>-->
		</div>
		<div class="remark_box">
			<p class="today_work_text">备注</p>
			<el-input
				class="remark_text"
				type="textarea"
				autosize
				placeholder="请输入"
				v-model="remark">
			</el-input>
			<!--			<textarea class="remark_text" v-model="remark" oninput="this.style.height=this.scrollHeight + 'px'"-->
			<!--					  onpropertychange="this.style.height=this.scrollHeight + 'px'"-->
			<!--					  placeholder="请输入"></textarea>-->
		</div>
		<UpLoad :type="1" @editParents="editParents" @afterFileList="afterFileList" :priewPhotoList="pictureList"
				:isShow="isShow"></UpLoad>
		<UpLoad :type="2" @editParents="editParents" @afterFileList="afterFileList" :priewFileList="attachmentList"
				:isShow="isShow"></UpLoad>
		<div class="send_box clear">
			<span class="fl"><span class="mustFill">*</span>发给谁</span>
			<div class="send_smallBox fl" v-for="(item,index) in receiverList">
				<p class="fl " style="border: none;">
					<img src="./images/icon_head.png" alt="" v-if="item.receiverHeadUrl===''">
					<img :src="item.receiverHeadUrl" alt="" v-else>
					<span class="del_file" @click="delRecipient(index)">×</span>
				</p>
				<div style="width: 44px;">{{item.receiverName}}</div>
			</div>
			<div class="send_add fl" @click="personDialogVisible = true">+</div>
		</div>
		<div class="footer_box">
			<p class="save_data" @click="popOutFunc(4)">保存草稿</p>
			<p class="submit_data" @click="submitData">提交</p>
		</div>
		<Popup :isShow="isShowPop" :contentText="warningText" @cancelFunc="cancelFunc"
			   :confirmFuncname="confirmFuncname" @confirmFunc="funcType" :isGetDraft="isGetDraft"></Popup>
		<PersonDialog
			:treeData="personnelList"
			:defaultProps="{label:'name',children:'children'}"
			:transferTitle="['选择部门人员', '已选择']"
			:dialogVisible="personDialogVisible"
			:managers="managerList"
			@handlePersonClose="handlePersonClose"
			@handlePsrsonSubmit="handlePsrsonSubmit"></PersonDialog>
		<Sidebar :sidebarShow="sidebar" :reportType="type" @editParents="editParents" :reportId="reportId"
				 @getParentReport="getParentReport"></Sidebar>
	</div>
</template>
<script>
	import Popup from '../../../../commons/popups'
	import UpLoad from '../../../../commons/upLoad'
	import PersonDialog from '../../../../commons/persondialog'
	import Sidebar from '../sidebar'

	export default {
		name: "writeReport",
		components: {
			Popup,
			UpLoad,
			PersonDialog,
			Sidebar
		},
		data() {
			return {
				// token: "/oaManager",
				token: "/reportManager",
				userDetail:JSON.parse(sessionStorage.getItem("teamEmployeeDetailVO")),
				reportID:this.$route.params.reportID?this.$route.params.reportID:"",
				statusType: 0,//add: 0 edit: 1 del: 2
				type: 1,//日报2，周报2，月报3
				sidebar: false,
				nowWorkList: [
					{
						content: "",
						completeness: 100
					}
				],
				afterWorkList: [
					{
						content: ""
					}
				],
				remark: "",      //备注
				summarize: "",    //工作总结
				coordinate: "",    //协调与帮助
				warningText: "",
				isShowPop: false,
				confirmFuncname: "",
				personDialogVisible: false,   //选择人员弹框的显示
				personnelList: [],   //通讯录人员列表
				pictureList: [], //图片信息集合
				attachmentList: [], //附件信息集合
				receiverList: [],//接收人信息集合
				receiverIdList: [],//接收人id集合
				receiverNameList: [],//接收人name集合
				reportId: 0,//汇报ID
				isGetDraft: 1,   //在选择日报，周报时，保存当前汇报为草稿并获取选中汇报的草稿
				isShow: false,  //该字段是附件上传时控制图片展示用的
				managerList: [],//通讯录列表使用
				temporaryObject: {},//暂时存草稿
			}
		},
		created() {
			if(this.$route.query){
				console.log(this.$route.query)
				this.getParentReport(this.$route.query.id,this.$route.query.msgType)
			}
			if(this.reportID){
				this.getReportDetail(this.reportID);
			}
			//获取草稿
			this.getReportDraft();
		},
		mounted() {
			//获取通讯录人员
			this.getPersonnelList();
		},
		methods: {
			funcType(funcName, isDraft) {
				this.isGetDraft = isDraft;
				this.isShowPop = false;
				if (funcName === '') return;   //表单校验
				if (funcName === 'saveData') this.saveData(isDraft);
				if (funcName === 'quote') this.quote();
				if (funcName === 'clearDataAfter') this.clearDataAfter();
				if (funcName === 'putReportDraft') this.putReportDraft();
			},
			editParents(value, fileType) {
				if (value.constructor === Array) {
					if (fileType === 1)  //图片
						this.pictureList = value;
					else //附件
						this.attachmentList = value;
					return;
				} else {
					//右侧弹框收起，清除当前汇报类型的数据
					this.sidebar = value;
					this.clearData();
					this.getReceiverList();//获取上一条汇报的接收人信息,此时是没有草稿的，如有草稿，以草稿的为准
				}
			},
			reportType(type) {
				//切换周报日报时把引用上一篇工作计划init
				this.$refs.textChange.innerHTML = type === 1 ? "引用上一篇工作计划" : (type === 2 ? "引用上一周工作计划" : "引用上一月工作计划");

				if (this.type != type) {
					if (this.isFill()) {
						//保存草稿后清空，再进入下一类型的汇报
						this.isGetDraft = type;
						this.isShowPop = true;
						this.warningText = "是否保存当前汇报草稿";
						this.confirmFuncname = "saveData";
					} else if(this.receiverList.length>0){ //只有发送人时，不用弹框提示，直接保存发送人，然后进入下一汇报
						this.saveData(type,true);//isNoText=true字段是只有发送人，没有填写任何文本时用来禁止提示信息展示的，只在此处用到
					}else{
						this.type = type;
						this.getReportDraft();
					}
				}
			},
			changeFunc(item, index) {
				// !/^[0-9]+$/.test(item) && !/^[0-9]+\.?[0-9]+?$/.test(item)
				// const reg = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;
				const reg = /^[0-9]*[1-9][0-9]*$/;
				if (!reg.test(item) && item != '') {
					this.$message.warning("请输入100以内的正整数");
					this.$set(this.nowWorkList[index], 'completeness', '');
					return;
				}
				if (item > 100) {
					this.$set(this.nowWorkList[index], 'completeness', 100);
					return;
				}
				if(item===null || item===""){
					const str = this.type === 1?"今日完成工作":(this.type === 2?"本周完成工作":"本月完成工作");
					this.$message.warning("第"+(index+1)+"条"+str+"的完成度不能为空");
				}
			},
			addWork(type) {
				if (type === "today")
					this.nowWorkList.push({
						content: "",
						completeness: 100
					});
				else if (type === "tomorrow")
					this.afterWorkList.push({
						content: "",
					});
			},
			delWork(type, index) {
				if (type === "today")
					this.nowWorkList.splice(index, 1);
				else if (type === "tomorrow")
					this.afterWorkList.splice(index, 1);
			},
			//保存草稿
			saveData(isDraft,isNoText) {
				let that = this;
				for (let i = 0; i < this.attachmentList.length; i++) {
					if (this.attachmentList[i].type || this.attachmentList[i].type >= 0)
						delete this.attachmentList[i].type;
				}
				for (let j = 0; j < that.nowWorkList.length; j++) {
					if (!that.nowWorkList[j].serialNumber)
						that.nowWorkList[j]["serialNumber"] = j + 1;
				}
				for (let x = 0; x < that.afterWorkList.length; x++) {
					if (!that.afterWorkList[x].serialNumber)
						that.afterWorkList[x]["serialNumber"] = x + 1;
				}
				this.$http({
					method: "POST",
					url: that.token + "/v1/feign/oa/report/saveDraft",
					data: {
						reportTypeId: that.type,
						reportTypeName: that.type === 1 ? "日报" : (that.type === 2 ? "周报" : "月报"),
						finishWorkList: that.nowWorkList, //如果是日报则是今日完成工作；
						workPlanList: that.afterWorkList, //如果是日报则是明日工作计划；如
						workSummary: that.summarize,  //如果是周报则是本周工作总结；
						coordinationAndAssistance: that.coordinate,  //协调与帮助
						remark: that.remark, //备注
						pictureList: that.pictureList,
						attachmentList: that.attachmentList,
						receiverList: that.receiverList,
						receiverIdList: that.receiverIdList,
						receiverNameList: that.receiverNameList
					}
				})
					.then(res => {
						if (res.data.code === 200) {
							if(!isNoText){
								that.$message.success("保存草稿成功");
							}
							if (isDraft > 0) {
								that.type = isDraft;
								//获取草稿
								this.getReportDraft();
							}
						}
					})
					.catch(error => {
						that.$message.error("保存草稿失败");
					});
			},
			//提交
			submitData() {
				let that = this;
				if (this.verifyContent()) {
					for (let i = 0; i < this.attachmentList.length; i++) {
						if (this.attachmentList[i].type || this.attachmentList[i].type >= 0)
							delete this.attachmentList[i].type;
					}
					for (let j = 0; j < that.nowWorkList.length; j++) {
						if (!that.nowWorkList[j].serialNumber)
							that.nowWorkList[j]["serialNumber"] = j + 1;
					}
					for (let x = 0; x < that.afterWorkList.length; x++) {
						if (!that.afterWorkList[x].serialNumber)
							that.afterWorkList[x]["serialNumber"] = x + 1;
					}
					let reportData = {
						reportTypeId: that.type,
						reportTypeName: that.type === 1 ? "日报" : (that.type === 2 ? "周报" : "月报"),
						finishWorkList: that.nowWorkList, //如果是日报则是今日完成工作；
						workPlanList: that.afterWorkList, //如果是日报则是明日工作计划；如
						workSummary: that.summarize,  //如果是周报则是本周工作总结；
						coordinationAndAssistance: that.coordinate,  //协调与帮助
						remark: that.remark, //备注
						pictureList: that.pictureList,
						attachmentList: that.attachmentList,
						receiverDTOList: that.receiverList,
						receiverIdList: that.receiverIdList,
						receiverNameList: that.receiverNameList,
						departmentId: that.userDetail.departmentId,
						companyId: that.userDetail.companyId
					}
					if (that.reportId != 0)
						reportData["reportId"] = that.reportId;
					let URL = "";
					if (that.reportId === 0)
						URL = that.token + "/v1/feign/oa/report/" + "writeReport";
					if (that.reportId != 0)
						URL = that.token + "/v1/feign/oa/report/" + "updateReport";
					this.$http({
						method: "POST",
						url: URL,
						data: reportData
					})
						.then(res => {
							if (res.data.code === 200) {
								if (that.reportId >= 0 &&  that.reportId.constructor === Number && res.data.data.constructor === Number) {  //新建或者新建后又接着新建
									that.reportId = res.data.data;
								} else {//编辑
									that.reportId = that.reportId;
								}
								// this.clearData();   右侧弹框消失时再清除数据

								that.$message.success("提交成功");
								this.sidebar = true;
							} else {
								that.$message.error(res.data.message);
							}
						})
						.catch(error => {
							that.$message.error("提交失败");
						});
				}
			},
			//校验
			verify() {
				if (this.nowWorkList[0].content === "") //完成工作
					return 0;
				if (this.type > 1)
					if (this.summarize === "")   //工作总结
						return 2;
				if (this.afterWorkList[0].content === "")   //工作计划
					return 1;
				if (this.receiverList.length < 1)  //接收人
					return 3;
			},
			verifyContent() {
				if (this.verify() === 0) {
					this.isShowPop = true;
					this.warningText = this.type === 1 ? "请填写今日完成工作" : (this.type === 2 ? "请填写本周完成工作" : "请填写本月完成工作");
					this.confirmFuncname = "";
					this.isGetDraft = this.type;
					return false;
				}
				if (this.verify() === 2 && this.type != 1) {
					this.isShowPop = true;
					this.warningText = this.type === 2 ? "请填写本周工作总结" : "请填写本月工作总结";
					this.confirmFuncname = "";
					this.isGetDraft = this.type;
					return false;
				}
				if (this.verify() === 1) {
					this.isShowPop = true;
					this.warningText = this.type === 1 ? "请填写明日工作计划" : (this.type === 2 ? "请填写下一周工作计划" : "请填写下一月工作计划");
					this.confirmFuncname = "";
					this.isGetDraft = this.type;
					return false;
				}
				if (this.verify() === 3) {  //发给谁
					this.isShowPop = true;
					this.warningText = "请选择发送人";
					this.confirmFuncname = "";
					this.isGetDraft = this.type;
					return false;
				}
				for (let i = 0; i < this.nowWorkList.length; i++) {
					let str = this.type === 1 ? "今日完成工作" : (this.type === 2 ? "本周完成工作" : "本月完成工作");
					if (this.nowWorkList[i].content.length > 1000) {
						this.$message.warning(str + "每条最多1000字");
						return false;
					}
					if(this.nowWorkList[i].completeness ===""){
						this.isShowPop = true;
						this.warningText = "第"+(i+1)+"条"+str + "的完成度不能为空";
						this.confirmFuncname = "";
						this.isGetDraft = this.type;
						return false;
					}
				}
				for (let i = 0; i < this.afterWorkList.length; i++) {
					if (this.afterWorkList[i].content.length > 1000) {
						let str = this.type === 1 ? "明日工作计划" : (this.type === 2 ? "下一周工作计划" : "下一月工作计划");
						this.$message.warning(str + "每条最多1000字");
						return false;
					}
				}
				if (this.remark.length > 1000) {
					this.$message.warning("备注最多1000字");
					return false;
				}
				if (this.type > 1) {
					if (this.summarize.length > 1000) {
						let str = this.type === 2 ? "本周工作总结" : "本月工作总结";
						this.$message.warning(str + "最多1000字");
						return false;
					}
				}
				if (this.type > 1) {
					if (this.coordinate.length > 1000) {
						this.$message.warning("协调与帮助最多1000字");
						return false;
					}
				}

				return true;
			},
			//引用
			quote() {
				this.$refs.textChange.innerHTML = "清除引用内容";
				// if (this.type === 1) {
				// 	this.getAfterWork();
				// }
				// if (this.type === 2) {
				// 	alert("引用上一篇周报");
				// }
				// if (this.type === 3) {
				// 	alert("引用上一篇月报");
				// }
				this.getAfterWork();
			},
			//清除引用上一篇的内容
			clearDataAfter() {
				this.nowWorkList = [{
					content: "",
					completeness: 100
				}];
				this.$refs.textChange.innerHTML = this.type === 1 ? "引用上一篇工作计划" : (this.type === 2 ? "引用上一周工作计划" : "引用上一月工作计划");
			},
			popOutFunc(filter) {
				this.isShowPop = true;
				if (this.$refs.textChange.innerHTML == "清除引用内容") {
					this.confirmFuncname = "clearDataAfter";
					this.warningText = "确定清除引用内容吗？";
				} else {
					if (filter === 0) {   //引用覆盖    上一篇汇报的明日计划
						this.confirmFuncname = "quote";
						this.warningText = "引用内容会覆盖当前内容，是否引用？";
					}
					if (filter === 4) { //保存草稿
						this.confirmFuncname = "saveData";
						this.warningText = "保存草稿后，下次可继续编辑";
					}
				}
			},
			// 选择部门人员弹框   关闭按钮
			handlePersonClose() {
				this.personDialogVisible = false;
			},
			//选择部门人员弹框   确定按钮
			handlePsrsonSubmit(target) {
				this.managerList = target;
				this.receiverList = [];
				this.receiverIdList = [];
				this.receiverNameList = [];
				for (let i = 0; i < target.length; i++) {
					this.receiverList.push({
						receiverId: target[i].id,
						receiverName: target[i].name,
						receiverHeadUrl: target[i].iconUrl,
					});
					this.receiverIdList.push(target[i].id);
					this.receiverNameList.push(target[i].name);
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
			//删除接收人
			delRecipient(index) {
				if (this.receiverList.length >= index)
					this.receiverList.splice(index, 1);
				if (this.receiverIdList.length >= index)
					this.receiverIdList.splice(index, 1);
				if (this.receiverNameList.length >= index)
					this.receiverNameList.splice(index, 1);
				if (this.managerList.length >= index)
					this.managerList.splice(index, 1);
			},
			//上传文件，又进行删除操作，修改了文件列表后的赋值
			afterFileList(type, afterFileList) {
				if (type === 1)//图片
					this.pictureList = afterFileList;
				else //附件
					this.attachmentList = afterFileList;
			},
			//获取草稿
			getReportDraft() {
				let that = this;
				this.$http({
					method: 'GET',
					url: that.token + '/v1/feign/oa/report/getDraft',
					params: {
						reportTypeId: that.type
					},
				}).then(res => {
					that.clearData();
					if (res.data.data) {
						let data = res.data.data;
						let dayName = that.getDayName(data.createTime);
						if (dayName >= 0) {
							that.type = data.reportTypeId;
							that.nowWorkList = data.finishWorkList; //如果是日报则是今日完成工作；
							that.afterWorkList = data.workPlanList; //如果是日报则是明日工作计划；如
							that.summarize = data.workSummary;  //如果是周报则是本周工作总结；
							that.coordinate = data.coordinationAndAssistance;  //协调与帮助
							that.remark = data.remark; //备注
							that.pictureList = data.pictureList;
							that.attachmentList = data.attachmentList;
							if (data.receiverList){
								that.receiverList = data.receiverList;
								for(let i=0;i<data.receiverList.length;i++){
									that.managerList.push({
										id: data.receiverList[i].receiverId,
										name: data.receiverList[i].receiverName,
										iconUrl: data.receiverList[i].receiverHeadUrl,
									});
								}
							}
							if (data.receiverIdList)
								that.receiverIdList = data.receiverIdList;
							if (data.receiverNameList)
								that.receiverNameList = data.receiverNameList;
							// if (data.receiverIdList && data.receiverNameList) {
							// 	for (let i = 0; i < data.receiverIdList.length; i++) {
							// 		that.managerList.push({
							// 			id: data.receiverIdList[i] ? (data.receiverIdList[i].id ? data.receiverIdList[i].id : "") : "",
							// 			name: data.receiverNameList[i] ? (data.receiverNameList[i].name ? data.receiverNameList[i].name : "") : ""
							// 		});
							// 	}
							// }
							if(!that.receiverList){
								//获取上一条汇报的接收人信息
								that.getReceiverList();
							}else if(that.receiverList.length===0){
                                //获取上一条汇报的接收人信息
								that.getReceiverList();
							}
						} else {
							that.temporaryObject = data;
							that.isShowPop = true;
							that.confirmFuncname = "putReportDraft";
							that.warningText = that.type===1?"是否引用日报的草稿数据":(that.type===2?"是否引用周报的草稿数据":"是否引用月报的草稿数据");
						}
					}else{
						//草稿为空时，获取上一条汇报的接收人信息
						that.getReceiverList();
					}
				}).catch(error => {
					console.log(error.message);
				});
			},
			//引用草稿的数据的赋值
			putReportDraft() {
				let that = this;
				const data = this.temporaryObject;
				that.type = data.reportTypeId;
				that.nowWorkList = data.finishWorkList; //如果是日报则是今日完成工作；
				that.afterWorkList = data.workPlanList; //如果是日报则是明日工作计划；如
				that.summarize = data.workSummary;  //如果是周报则是本周工作总结；
				that.coordinate = data.coordinationAndAssistance;  //协调与帮助
				that.remark = data.remark; //备注
				that.pictureList = data.pictureList;
				that.attachmentList = data.attachmentList;
				if (data.receiverList)
					that.receiverList = data.receiverList;
				if (data.receiverIdList)
					that.receiverIdList = data.receiverIdList;
				if (data.receiverNameList)
					that.receiverNameList = data.receiverNameList;
				if (data.receiverIdList && data.receiverNameList) {
					for (let i = 0; i < data.receiverIdList.length; i++) {
						that.managerList.push({
							id: data.receiverIdList[i] ? (data.receiverIdList[i].id ? data.receiverIdList[i].id : "") : "",
							name: data.receiverNameList[i] ? (data.receiverNameList[i].name ? data.receiverNameList[i].name : "") : ""
						});
					}
				}
				if(!that.receiverList){
					//获取上一条汇报的接收人信息
					that.getReceiverList();
				}else if(that.receiverList.length===0){
					//获取上一条汇报的接收人信息
					that.getReceiverList();
				}
			},
			delReport(reportId) {
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
						this.sidebar = false;
						this.clearData();
						//获取上一条汇报的接收人信息
						this.getReceiverList();
					}
				}).catch(error => {
					console.log(error.message);
				});
			},
			//获取上一个工作计划
			getAfterWork() {
				let that = this;
				this.$http({
					method: 'GET',
					url: that.token + '/v1/feign/oa/report/getPreviousWorkPlan',
					params: {
						reportTypeId: that.type,   //汇报类型id(1.日报2.周报3.月报)
						companyId:that.userDetail.companyId
					},
				}).then(res => {
					if (res.data.code === 200) {
						if (res.data.data) {
							that.nowWorkList = [];
							that.nowWorkList = res.data.data;
						}
					}
				}).catch(error => {
					console.log(error.message);
				});
			},
			//获取草稿展示前的清空数据
			clearData() {
				this.reportId = 0;
				this.nowWorkList = [{
					content: "",
					completeness: 100
				}];
				this.afterWorkList = [{
					content: ""
				}];
				this.summarize = "";
				this.coordinate = "";
				this.remark = "";
				this.isShow = true;   //设置为true，让upLoad组件清空数据
				this.pictureList = [];
				this.attachmentList = [];
				this.receiverList = [];
				this.receiverIdList = [];
				this.receiverNameList = [];
				this.managerList = [];
			},
			//选择日报周报时，不保存草稿直接进入下一项
			cancelFunc(isDraft, isQuote = true) {
				this.isShowPop = false;
				if (this.type != isDraft) {
					if (isQuote) { //引用上一篇
						this.type = isDraft;
						this.getReportDraft();
					}
				}
			},
			//检测是否有填写内容
			isFill() {
				if (this.nowWorkList[0].content.length > 0
					|| this.afterWorkList[0].content.length > 0
					|| this.summarize != ""
					|| this.coordinate != ""
					|| this.pictureList.length > 0
					|| this.attachmentList.length > 0) {//这里不校验发送人，有发送人的话就直接存为草稿
					return true;
				} else {
					return false;
				}
			},
			//获取汇报详情
			getReportDetail(reportId) {
				let that = this;
				this.$http({
					method: 'GET',
					url: that.token + '/v1/feign/oa/report/getReportDetail',
					params: {
						reportId: reportId   //汇报id
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
						that.pictureList = data.pictureList;
						that.attachmentList = data.attachmentList;
						if (data.reportReceiverVOList)
							that.receiverList = data.reportReceiverVOList;
						if (data.receiverIdList)
							that.receiverIdList = data.receiverIdList;
						if (data.receiverNameList)
							that.receiverNameList = data.receiverNameList;
						this.sidebar = false;
					}
				}).catch(error => {
					console.log(error.message);
				});
			},
			//根据reportId修改/删除/新建
			getParentReport(reportId, type) {
				if (type === "edit") {//编辑
					this.getReportDetail(reportId);
				}
				if (type === "del") {//删除
					this.delReport(reportId);
				}
				if (type === "add") {//新建
					this.clearData();
					//获取上一条汇报的接收人信息
					this.getReceiverList();
					this.sidebar = false;
				}

			},
			getDayName(d) {
				let td = new Date();
				td = new Date(td.getFullYear(), td.getMonth(), td.getDate());
				let od = new Date(d);
				od = new Date(od.getFullYear(), od.getMonth(), od.getDate());
				let xc = (od - td) / 1000 / 60 / 60 / 24;
				if (xc < -2) {
					// return -xc + "天前";
					return xc;
				} else if (xc < -1) {
					// return "前天";
					return xc;
				} else if (xc < 0) {
					// return "昨天";
					return xc;
				} else if (xc == 0) {
					// return "今天";
					return xc;
				} else if (xc < 2) {
					// return "明天";
					return xc;
				} else if (xc < 3) {
					// return "后天";
					return xc;
				} else {
					// return xc + "天后";
					return xc;
				}
			},
			//根据用户id和汇报类型获取上一条汇报的接收人信息
			getReceiverList(){   //用户Id后台自己获取
				let that = this;
				this.$http({
					method: 'GET',
					url: that.token + '/v1/feign/oa/report/getReceiverList',
					params: {
						reportTypeId: that.type,   //汇报类型id(1.日报2.周报3.月报)
						companyId:that.userDetail.companyId
					},
				}).then(res => {
					if (res.data.code === 200) {
						if (res.data.data) {
							let list = res.data.data;
							if(list)
								if(list.length>0){
									that.receiverIdList=[];
									that.receiverNameList=[];
									that.receiverList=[];
									that.managerList = [];
									for(let i=0;i<list.length;i++){
										that.receiverList.push({
											receiverId: list[i].receiverId,
											receiverName: list[i].receiverName,
											receiverHeadUrl: list[i].receiverHeadUrl,
										});
										that.managerList.push({
											id: list[i].receiverId,
											name: list[i].receiverName,
											iconUrl: list[i].receiverHeadUrl,
										});
										that.receiverIdList.push(list[i].receiverId);
										that.receiverNameList.push(list[i].receiverName);
									}
								}
						}
					}
				}).catch(error => {
					console.log(error.message);
				});
			}
		}
	}

</script>

<style lang="scss">
	.mustFill {
		color: red;
		font-size: 16px;
		margin-right: 4px;
	}

	.bak_ground {
		background-color: #4278BE;
		color: white !important;
	}

	.write_reoprt_box {
		/*width: 100%;*/
		background-color: white;
		padding: 20px;
	}

	.reoprt_type_text {
		color: #303133;
		font-size: 16px;
		letter-spacing: 1px;
		margin-bottom: 18px;
	}

	.type_btn li {
		display: inline-block;
		width: 118px;
		height: 38px;
		border-radius: 2px;
		text-align: center;
		line-height: 38px;
		border: 1px solid rgba(66, 120, 190, 1);
		margin: 0 8px;
		cursor: pointer;
		color: #4278BE;
	}

	.type_btn li:nth-child(1) {
		margin-left: 0;
	}

	.before_project {
		width: 140px;
		color: #4278BE;
		font-size: 14px;
		cursor: pointer;
		margin-top: 27px;
		margin-bottom: 16px;
	}

	.today_work_box,
	.tomorrow_work_box,
	.remark_box {
		margin-bottom: 20px;
	}

	.today_work_text,
	.tomorrow_work_text {
		color: #303133;
		font-size: 16px;
		margin-bottom: 15px;
	}

	.today_work_detail > span,
	.tommorrw_work_detail > span {
		position: absolute;
		top: 20px;
		z-index: 1;
		left: 8px;
	}

	.today_work_detail {
		background-color: #F8F8F8;
		color: #606266;
		/*padding: 19px;*/
		width: 100%;
		margin-bottom: 15px;
		position: relative;
	}

	.today_work_detail .detail_text {
		overflow: hidden;
		width: 84%;
		font-size: 14px;
		color: #606266;
		line-height: 25px;
		/*padding: 19px;*/
		.el-textarea__inner {
			border: none;
			resize: none;
			background-color: #F8F8F8;
			padding: 20px 20px 20px 30px;
			border-radius: 3px;
		}
	}

	.detail_percent {
		width: 15%;
		color: #303133;
		font-size: 14px;
		text-align: center;
		position: relative;
		align-items: center;
		display: flex;
	}

	.detail_percent > * {
		display: inline-block;
	}

	.detail_percent input {
		height: 18px;
		width: 36px;
		border: none;
		outline: none;
	}

	.detail_percent > div {
		margin-top: 30px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.add_work {
		width: 20px;
		height: 20px;
		color: #fff;
		border-radius: 100%;
		background-color: #4278BE;
		text-align: center;
		line-height: 20px;
		cursor: pointer;
	}

	.tommorrw_work_detail {
		background-color: #F8F8F8;
		color: #606266;
		width: 100%;
		margin-bottom: 15px;
		position: relative;
	}

	.tommorrw_work_detail .detail_text {
		overflow: hidden;
		width: 100%;
		/*padding: 19px;*/
		/*border-right: 1px solid #EDEFF2;*/
		/*border: none;*/
		/*resize: none;*/
		/*background-color: #F8F8F8;*/
		.el-textarea__inner {
			border: none;
			resize: none;
			background-color: #F8F8F8;
			padding: 20px 20px 20px 30px;
			border-radius: 3px;
		}
	}

	.remark_text .el-textarea__inner {
		/*overflow: hidden;*/
		width: 100%;
		padding: 19px;
		border-right: 1px solid #EDEFF2;
		border: none;
		resize: none;
		background-color: #F8F8F8;
		border-radius: 3px;
	}

	.delete_box {
		width: 20px;
		height: 20px;
		color: #fff;
		border-radius: 100%;
		background-color: #BFC2CC;
		text-align: center;
		line-height: 20px;
		cursor: pointer;
		position: absolute;
		top: -10px;
		right: -10px;
	}

	.photo_box > span,
	.accessory_box > span,
	.send_box > span {
		color: #303133;
		font-size: 16px;
		margin-right: 20px;
		display: block;
	}

	.photo_box {
		margin-bottom: 30px;
	}

	.accessory_box,
	.send_box {
		margin-bottom: 50px;
	}

	.photo_box {
		height: 100px;
	}

	.photo_box > div {
		height: 100px;
		display: flex;
		align-items: center;
	}

	.photo_box > div > img,
	.accessory_box > div > img {
		margin-right: 6px;
	}

	.photo_box > div,
	.accessory_box > div {
		color: #4278BE;
		font-size: 14px;
		cursor: pointer;
	}

	.accessory_box {
		display: flex;
		align-items: center;
	}

	.send_box,
	.accessory_box {
		height: 44px;
	}

	.photo_box > span {
		line-height: 100px;
	}

	.send_box > span,
	.accessory_box > span {
		line-height: 44px;
	}

	.accessory_box > img {
		width: 15px;
		height: 15px;
	}

	.send_box > .send_add {
		display: inline-block;
		width: 44px;
		height: 44px;
		border: 1px solid #BFC2CC;
		border-radius: 2px;
		text-align: center;
		line-height: 44px;
		color: #BFC2CC;
		cursor: pointer;
	}

	.send_box .send_smallBox {
		padding-right: 20px;
	}

	.send_box .send_smallBox > div {
		text-align: center;
	}

	.send_box .send_smallBox > p {
		position: relative;
		/*margin-right: 20px;*/
	}

	.send_box .send_smallBox > p > span {
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

	.send_box .send_smallBox > p img {
		width: 44px;
		height: 44px;
	}

	.footer_box {
		text-align: center;
	}

	.footer_box p {
		width: 150px;
		height: 50px;
		border-radius: 3px;
		border: 1px solid rgba(66, 120, 190, 1);
		text-align: center;
		line-height: 50px;
		font-size: 14px;
		display: inline-block;
		cursor: pointer;
	}

	.footer_box > .save_data {
		margin-right: 22px;
		color: #4278BE;
	}

	.footer_box > .submit_data {
		background-color: #4278BE;
		color: #fff;
	}
</style>
