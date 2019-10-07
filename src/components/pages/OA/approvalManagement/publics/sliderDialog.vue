<template>
	<div class="sideDialogs">
		<div class="sidebar_box" v-if="SidebarShow">
			<div class="sidebar_box_ne">
				<div class="sidebar_header clear">
					<p class="fl">{{awaitApprvolDetial.approveName}}</p>
					<span class="fr" @click="handleClose">×</span>
				</div>
				<div class="c_head">
					<div class="clear">
						<img :src="awaitApprvolDetial.createUrl" alt="" height="45px" width="45px" class="fl" v-if="awaitApprvolDetial.createUrl">
						<img src="../images/icon_head.png" alt="" height="45px" width="45px" class="fl" v-else>
						<div class="fl c_head_fl">
							<p style="color:#303133">{{awaitApprvolDetial.createName}}</p>
							<p style="color:#6CC9A8" v-if="awaitApprvolDetial.approveStatus == 3">审批通过</p>
							<p style="color:#FF6565" v-if="awaitApprvolDetial.approveStatus == 4">审批拒绝</p>
							<p style="color:#C7C9CC" v-if="awaitApprvolDetial.approveStatus == 5">已撤销</p>
							<p style="color:#4278BE" v-if="awaitApprvolDetial.awaitArr.length > 1 && awaitApprvolDetial.approveStatus != 3  && awaitApprvolDetial.approveStatus != 5 && awaitApprvolDetial.approveStatus != 4">待{{awaitApprvolDetial.awaitArr[0].auditName}}等{{awaitApprvolDetial.awaitArr.length}}人审批</p>
							<p style="color:#4278BE" v-if="awaitApprvolDetial.awaitArr.length == 1 && awaitApprvolDetial.approveStatus != 3 && awaitApprvolDetial.approveStatus != 5 && awaitApprvolDetial.approveStatus != 4">待{{awaitApprvolDetial.awaitArr[0].auditName}}审批</p>
						</div>
					</div>
				</div>
				<div class="sidebar_content">
					<!-- 报销审批 -->
					<template v-if="awaitApprvolDetial.approveTypeId == 1565750481670480">
						<div class="c_content">
							<template v-for="(item,index) in awaitApprvolDetial.approveReimbursementDetails">
								<h4 v-if="awaitApprvolDetial.approveReimbursementDetails.length > 1">报销明细{{index + 1}}</h4>
								<div class="c_content_fw">
									<div style="margin-top:8px">
										<span>报销金额：</span>
										<span style="color:#606266">{{item.reimbursementMoney}}元</span>
									</div>
									<div>
										<span>报销类别：</span>
										<span style="color:#606266">{{item.reimbursementTypeName}}</span>
									</div>
									<div style="padding-right:25px">
										<p class="fl">费用明细：</p>
										<p style="color:#606266;margin-left:75px;word-break: break-word;">{{item.reimbursementDetail}}</p>
									</div>
								</div>
							</template>
						</div>
						<div class="c_footer">
							<div>
								<span style="color:#303133">总报销金额：</span>
								<span style="color:#606266">{{awaitApprvolDetial.reimbursementCollectMoney}}元</span>
							</div>
							<div class="clear" style="padding-left:27px;margin-top:16px" v-if="awaitApprvolDetial.imagesInfo != null && awaitApprvolDetial.imagesInfo.length > 0">
									<p class="fl">图片：</p>
									<p  class="clear" style="margin-left:30px">
										<template v-for="item in awaitApprvolDetial.imagesInfo">
											<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" width="44px" height="44px" class="fl" style="margin-right:10px">
										</template>
									</p>
								</div>
							<div class="clear" style="padding-left:27px;margin-top:16px"  v-if="awaitApprvolDetial.accessorysInfo != null && awaitApprvolDetial.accessorysInfo.length > 0">
								<div class="fl" style="margin-top:8px;">附件：</div>
								<template v-for="item in awaitApprvolDetial.accessorysInfo">
									<div class="clear" style="margin: 8px 0px 0px 35px;background:#FBFBFB;cursor:pointer;">
										<div @click="downLoadFile(item.absolutePath,item.originalFileName)">
											<img class="fl" src="../../../../commons/images/word.png" alt="" v-if="item.type===0" width="44px" height="44px"  style="margin-top:5px">
											<img class="fl" src="../../../../commons/images/excel.png" alt="" v-if="item.type===1" width="44px" height="44px"  style="margin-top:5px">
											<img class="fl" src="../../../../commons/images/ppt.png" alt="" v-if="item.type===2" width="44px" height="44px"  style="margin-top:5px">
											<img class="fl" src="../../../../commons/images/rar.png" alt="" v-if="item.type===3" width="44px" height="44px"  style="margin-top:5px">
											<img class="fl" src="../../../../commons/images/pdf.png" alt="" v-if="item.type===4" width="44px" height="44px" style="margin-top:5px">
											<img class="fl" src="../../../../commons/images/jpeg.png" alt="" v-if="item.type===5" width="44px" height="44px" style="margin-top:5px">
											<img class="fl" src="../../../../commons/images/more.png" alt="" v-if="item.type===6" width="44px" height="44px" style="margin-top:5px">
											<div class="fl" style="margin:5px 0 0 8px">
												<p style="font-size:14px">{{item.originalFileName}}</p>
												<p style="color:#B4B5B7;font-size:14px;margin-top:5px">{{item.fileSize > 1023 ? (item.fileSize > 1048575 ? ((item.fileSize / (1024 * 1024)).toFixed(2) + "MB") : ((item.fileSize / 1024).toFixed(2) + "KB")) : (item.fileSize + "B")}}</p>
											</div>
										</div>
									</div>
								</template>
							</div>
						</div>
					</template>
					<!-- 报销审批 -->

					<!-- 通用审批 -->
					<div class="c_content" v-if="awaitApprvolDetial.approveTypeId == 1565750481330619">
						<div class="c_content_fw">
							<div style="margin-top:8px">
								<span>申请内容：</span>
								<span style="color:#606266;word-break: break-word;">{{awaitApprvolDetial.commonName}}</span>
							</div>
							<div>
								<p class="fl">审批详情：</p>
								<p style="color:#606266;margin-left:70px;word-break: break-word;" class="clear">
									{{awaitApprvolDetial.commonContent}}
								</p>
							</div>
							<div v-if="awaitApprvolDetial.imagesInfo != null && awaitApprvolDetial.imagesInfo.length > 0">
							<!-- <div> -->
								<p class="fl">图片：</p>
								<p style="color:#606266;margin-left:45px" class="clear">
									<template v-for="item in awaitApprvolDetial.imagesInfo">
										<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" width="44px" height="44px" class="fl" style="margin-right:10px">
									</template>
								</p>
							</div>
						</div>
					</div>
					<!-- 通用审批 -->

					<!-- 采购申请 -->
					<template v-if="awaitApprvolDetial.approveTypeId == 1565750481590522">
						<div class="c_footer">
							<div style="padding: 8px 0;">
								<span style="color:#303133">申请事由：</span>
								<span style="color:#606266">{{awaitApprvolDetial.procurementApplyForReason}}</span>
							</div>
							<div style="padding: 8px 0;">
								<span style="color:#303133">采购类型：</span>
								<span style="color:#606266">{{awaitApprvolDetial.procurementTypeName}}</span>
							</div>
							<div style="padding: 8px 0;">
								<span style="color:#303133">期望交付日期：</span>
								<span style="color:#606266">{{awaitApprvolDetial.procurementDeliveryTime.slice(0,-9)}}</span>
							</div>
						</div>
						<div class="c_content">
							<template v-for="(item,index) in awaitApprvolDetial.approveProcurementDetails">
								<h4 v-if="awaitApprvolDetial.approveProcurementDetails.length > 1">采购明细{{index + 1}}</h4>
								<div class="c_content_fw">
									<div style="margin-top:8px">
										<span>名称：</span>
										<span style="color:#606266">{{item.procurementDetailName}}</span>
									</div>
									<div>
										<span>规格：</span>
										<span style="color:#606266">{{item.procurementDetailSpecification}}</span>
									</div>
									<div>
										<span>数量：</span>
										<span style="color:#606266">{{item.procurementDetailNumber}}</span>
									</div>
									<div>
										<span>单位：</span>
										<span style="color:#606266">{{item.procurementDetailUnit}}</span>
									</div>
									<div>
										<span>价格：</span>
										<span style="color:#606266">{{item.procurementDetailMoney}}元</span>
									</div>
								</div>
							</template>
						</div>
						<div class="c_footer">
							<div style="padding: 8px 0;">
								<span style="color:#303133">总价格：</span>
								<span style="color:#606266">{{awaitApprvolDetial.procurementCollectMoney}}元</span>
							</div>
							<div style="padding: 8px 0;" v-if="awaitApprvolDetial.procurementPayWay">
								<span style="color:#303133">支付方式：</span>
								<span style="color:#606266">{{awaitApprvolDetial.procurementPayWay}}</span>
							</div>
							<div style="padding: 8px 0;" v-if="awaitApprvolDetial.procurementRemark">
								<p class="fl">备注：</p>
								<p  class="clear" style="margin-left:45px;color:#606266;word-break: break-word;">
									{{awaitApprvolDetial.procurementRemark}}
								</p>
							</div>
							<div class="clear" style="padding-top:8px" v-if="awaitApprvolDetial.imagesInfo != null && awaitApprvolDetial.imagesInfo.length > 0">
								<p class="fl">图片：</p>
								<p  class="clear" style="margin-left:30px">
									<template v-for="item in awaitApprvolDetial.imagesInfo">
										<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" width="44px" height="44px" class="fl" style="margin-right:10px">
									</template>
								</p>
							</div>
						</div>
					</template>
					<!-- 采购申请 -->

					<!-- 部门协作 -->
					<template v-if="awaitApprvolDetial.approveTypeId == 1565750481530628">
						<div class="c_footer">
							<div style="padding: 8px 0;">
								<span style="color:#303133">协作事由：</span>
								<span style="color:#606266">{{awaitApprvolDetial.cooperationReason}}</span>
							</div>
							<div style="padding: 8px 0;">
								<p class="fl">预期目标：</p>
								<p  class="clear" style="margin-left:72px;color:#606266;word-break: break-word;">
									{{awaitApprvolDetial.cooperationExpectedGoal}}
								</p>
							</div>
							<div style="padding: 8px 0;">
								<span style="color:#303133">发起方：</span>
								<span style="color:#606266">{{awaitApprvolDetial.cooperationInitiator}}</span>
							</div>
						</div>
						<div class="c_content">
							<template v-for="(item,index) in awaitApprvolDetial.approveCooperationDetails">
								<h4 v-if="awaitApprvolDetial.approveCooperationDetails.length > 1">协作明细{{index + 1}}</h4>
								<div class="c_content_fw">
									<div style="margin-top:8px">
										<span>协作方：</span>
										<span style="color:#606266">{{item.cooperationCollaboration}}</span>
									</div>
									<div>
										<p class="fl">协作事项：</p>
										<p  class="clear" style="margin-left:45px;color:#606266;word-break: break-word;">
											{{item.cooperationMatter}}
										</p>
									</div>
									<div>
										<span>完成日期：</span>
										<span style="color:#606266">{{item.cooperationOverTime.slice(0,-9)}}</span>
									</div>
								</div>
							</template>
						</div>
						<div class="c_footer" v-if="awaitApprvolDetial.cooperationRemark && awaitApprvolDetial.imagesInfo">
							<div style="padding: 8px 0;" v-if="awaitApprvolDetial.cooperationRemark">
								<p class="fl">备注：</p>
								<p  class="clear" style="margin-left:45px;color:#606266;word-break: break-word;">
									{{awaitApprvolDetial.cooperationRemark}}
								</p>
							</div>
							<div class="clear" style="padding-top:8px" v-if="awaitApprvolDetial.imagesInfo != null && awaitApprvolDetial.imagesInfo.length > 0">
								<p class="fl">图片：</p>
								<p  class="clear" style="margin-left:30px">
									<template v-for="item in awaitApprvolDetial.imagesInfo">
										<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" width="44px" height="44px" class="fl" style="margin-right:10px">
									</template>
								</p>
							</div>
						</div>
					</template>
					<!-- 部门协作 -->

					<!-- 工作请示 -->
					<div class="c_content" v-if="awaitApprvolDetial.approveTypeId == 1565750481870652">
						<div class="c_content_fw">
							<div style="padding-right:25px;margin-top:8px" v-if="awaitApprvolDetial.workReason">
								<p class="fl">事由：</p>
								<p style="color:#606266;margin-left:44px;word-break: break-word;">{{awaitApprvolDetial.workReason}}</p>
							</div>
							<div v-if="awaitApprvolDetial.workEmergencyDegree != 0">
								<span>紧急程度：</span>
								<span style="color:#606266">{{awaitApprvolDetial.workEmergencyDegree == 1 ? '紧急' : awaitApprvolDetial.workEmergencyDegree == 2 ? '普通' : '暂缓'}}</span>
							</div>
							<div>
								<span>日期：</span>
								<span style="color:#606266">{{awaitApprvolDetial.workTime.slice(0,-9)}}</span>
							</div>
							<div style="padding-right:25px" v-if="awaitApprvolDetial.workContent">
								<p class="fl">具体内容：</p>
								<p style="color:#606266;margin-left:72px;word-break: break-word;">{{awaitApprvolDetial.workContent}}</p>
							</div>
						</div>
					</div>
					<!-- 工作请示 -->

					<!-- 招聘申请 -->
					<div class="c_content" v-if="awaitApprvolDetial.approveTypeId == 1565750481060454">
						<div class="c_content_fw">
							<div>
								<span>招聘部门：</span>
								<span style="color:#606266">{{awaitApprvolDetial.recruitmentDepartmentName}}</span>
							</div>
							<div>
								<span>招聘职位：</span>
								<span style="color:#606266">{{awaitApprvolDetial.recruitmentPosition}}</span>
							</div>
							<div>
								<span>需求人数：</span>
								<span style="color:#606266">{{awaitApprvolDetial.recruitmentNumber}}人</span>
							</div>
							<div style="padding-right:25px">
								<p class="fl">职责要求：</p>
								<p style="color:#606266;margin-left:72px;word-break: break-word;">{{awaitApprvolDetial.recruitmentRequire}}</p>
							</div>
							<div>
								<span>期望到岗时间：</span>
								<span style="color:#606266">{{awaitApprvolDetial.recruitmentPositionTime.slice(0,-9)}}</span>
							</div>
						</div>
					</div>
					<!-- 招聘申请 -->

					<!-- 用印申请 -->
					<div class="c_content" v-if="awaitApprvolDetial.approveTypeId == 1565750481790776">
						<div class="c_content_fw">
							<div>
								<span>用印部门：</span>
								<span style="color:#606266">{{awaitApprvolDetial.sealDepartmentName}}</span>
							</div>
							<div>
								<span>经办人：</span>
								<span style="color:#606266">{{awaitApprvolDetial.createName}}</span>
							</div>
							<div>
								<span>日期：</span>
								<span style="color:#606266">{{awaitApprvolDetial.sealTime.slice(0,-9)}}</span>
							</div>
							<div>
								<span>用印文件名称：</span>
								<span style="color:#606266">{{awaitApprvolDetial.sealFileName}}</span>
							</div>
							<div>
								<span>文件份数：</span>
								<span style="color:#606266">{{awaitApprvolDetial.sealFileNumber}}份</span>
							</div>
							<div>
								<span>文件类别：</span>
								<span style="color:#606266">{{awaitApprvolDetial.sealTypeName}}</span>
							</div>
							<div>
								<span>加盖何种印章：</span>
								<span style="color:#606266">{{awaitApprvolDetial.sealFileTypeName}}</span>
							</div>
							<div style="padding-right:25px" v-if="awaitApprvolDetial.sealRemark != ''">
								<p class="fl">备注：</p>
								<p style="color:#606266;margin-left:45px;word-break: break-word;">{{awaitApprvolDetial.sealRemark}}</p>
							</div>
						</div>
					</div>
					<!-- 用印申请 -->

					<!-- 备用金申请 -->
					<div class="c_content" v-if="awaitApprvolDetial.approveTypeId == 1565750481410817">
						<div class="c_content_fw">
							<div>
								<span>部门：</span>
								<span style="color:#606266">{{awaitApprvolDetial.spareDepartmentName}}</span>
							</div>
							<div style="padding-right:25px">
								<p class="fl">事由：</p>
								<p style="color:#606266;margin-left:45px;word-break: break-word;">{{awaitApprvolDetial.spareReason}}</p>
							</div>
							<div>
								<span>申请金额：</span>
								<span style="color:#606266">{{awaitApprvolDetial.spareMoney}}元</span>
							</div>
							<div>
								<span>使用日期：</span>
								<span style="color:#606266">{{awaitApprvolDetial.spareUseTime.slice(0,-9)}}</span>
							</div>
							<div>
								<span>归还日期：</span>
								<span style="color:#606266">{{awaitApprvolDetial.spareReturnTime.slice(0,-9)}}</span>
							</div>
							<div>
								<span>出纳：</span>
								<span style="color:#606266">{{awaitApprvolDetial.spareCashier}}</span>
							</div>
							<div style="padding-right:25px">
								<p class="fl">备注：</p>
								<p style="color:#606266;margin-left:45px;word-break: break-word;">{{awaitApprvolDetial.spareRemark}}</p>
							</div>
						</div>
					</div>
					<!-- 备用金申请 -->

					<!-- 立项申请 -->
					<template v-if="awaitApprvolDetial.approveTypeId == 1565750481340734">
						<div class="c_footer">
							<div style="padding: 8px 0;">
								<span style="color:#303133">项目名称：</span>
								<span style="color:#606266">{{awaitApprvolDetial.projectName}}</span>
							</div>
							<div style="padding: 8px 0;">
								<p class="fl">项目概述：</p>
								<p  class="clear" style="margin-left:72px;color:#606266;word-break: break-word;">
									{{awaitApprvolDetial.projectSynopsis}}
								</p>
							</div>
							<div style="padding: 8px 0;">
								<p class="fl">预期目标：</p>
								<p  class="clear" style="margin-left:72px;color:#606266;word-break: break-word;">
									{{awaitApprvolDetial.projectTarget}}
								</p>
							</div>
							<div style="padding: 8px 0;">
								<span style="color:#303133">期望启动时间：</span>
								<span style="color:#606266">{{awaitApprvolDetial.projectTime.slice(0,-9)}}</span>
							</div>
							<div style="padding: 8px 0;">
								<span style="color:#303133">人员需求：</span>
								<span style="color:#606266">{{awaitApprvolDetial.projectNumber}}</span>
							</div>
						</div>
						<div class="c_content">
							<template v-for="(item,index) in awaitApprvolDetial.approveProjectDetails">
								<h4 v-if="awaitApprvolDetial.approveProjectDetails.length > 1">预算明细{{index + 1}}</h4>
								<div class="c_content_fw">
									<div style="margin-top">
										<p class="fl">预算内容：</p>
										<p  class="clear" style="margin-left:45px;color:#606266;word-break: break-word;">
											{{item.projectBudgetContent}}
										</p>
									</div>
									<div>
										<span>预算金额：</span>
										<span style="color:#606266">{{item.projectBudgetMoney}}元</span>
									</div>
								</div>
							</template>
						</div>
						<div class="c_footer">
							<div style="padding: 8px 0;">
								<span style="color:#303133">总预算金额：</span>
								<span style="color:#606266">{{awaitApprvolDetial.projectCollectMoney}}元</span>
							</div>
							<div style="padding: 8px 0;" v-if="awaitApprvolDetial.procurementRemark">
								<p class="fl">计划进度：</p>
								<p  class="clear" style="margin-left:45px;color:#606266;word-break: break-word;">
									{{awaitApprvolDetial.projectDesignSchedule}}
								</p>
							</div>
							<div style="padding: 8px 0;" v-if="awaitApprvolDetial.projectRemark">
								<p class="fl">备注：</p>
								<p  class="clear" style="margin-left:45px;color:#606266;word-break: break-word;">
									{{awaitApprvolDetial.projectRemark}}
								</p>
							</div>
							<div class="clear" style="padding-top:8px" v-if="awaitApprvolDetial.imagesInfo != null && awaitApprvolDetial.imagesInfo.length > 0">
								<p class="fl">图片：</p>
								<p  class="clear" style="margin-left:30px">
									<template v-for="item in awaitApprvolDetial.imagesInfo">
										<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" width="44px" height="44px" class="fl" style="margin-right:10px">
									</template>
								</p>
							</div>
						</div>
					</template>
					<!-- 立项申请 -->

					<!-- 离职审批 -->
					<div class="c_content" v-if="awaitApprvolDetial.approveTypeId == 1565750481030441">
						<div class="c_content_fw">
							<div>
								<span>离职时间：</span>
								<span style="color:#606266">{{awaitApprvolDetial.dimissionTime.slice(0,-9)}}</span>
							</div>
							<div>
								<span>交接人：</span>
								<span style="color:#606266">{{awaitApprvolDetial.handoverName}}</span>
							</div>
							<div style="padding-right:25px">
								<p class="fl">离职原因：</p>
								<p style="color:#606266;margin-left:75px;word-break: break-word;">{{awaitApprvolDetial.dimissionReason}}</p>
							</div>
							<div style="padding-right:25px">
								<p class="fl">交接工作：</p>
								<p style="color:#606266;margin-left:75px;word-break: break-word;">{{awaitApprvolDetial.dimissionHandoverWork}}</p>
							</div>
							<div v-if="awaitApprvolDetial.imagesInfo != null && awaitApprvolDetial.imagesInfo.length > 0">
								<p class="fl">图片：</p>
								<p style="color:#606266;margin-left:45px" class="clear">
									<template v-for="item in awaitApprvolDetial.imagesInfo">
										<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" width="44px" height="44px" class="fl" style="margin-right:10px">
									</template>
								</p>
							</div>
						</div>
					</div>
					<!-- 离职审批 -->

					<!-- 出差审批 -->
					<template v-if="awaitApprvolDetial.approveTypeId == 1565750481620095">
						<div class="c_content">
							<template v-for="(item,index) in awaitApprvolDetial.approveEvectionDetails">
								<h4 v-if="awaitApprvolDetial.approveEvectionDetails.length > 1">行程明细{{index + 1}}</h4>
								<div class="c_content_fw">
									<div style="margin-top:8px">
										<span>出差地点:</span>
										<span style="color:#606266">{{item.evectionAddress}}</span>
									</div>
									<div>
										<span>开始时间:</span>
										<span style="color:#606266">{{item.beginTime.slice(0,-9)}} {{item.beginPmAm == 0 ? '上午' : '下午'}}</span>
									</div>
									<div>
										<span>结束时间:</span>
										<span style="color:#606266">{{item.endTime.slice(0,-9)}} {{item.endPmAm == 0 ? '上午' : '下午'}}</span>
									</div>
								</div>
							</template>
						</div>
						<div class="c_footer">
							<div>
								<span style="color:#303133">出差天数:</span>
								<span style="color:#606266">{{awaitApprvolDetial.evectionDays}}天</span>
							</div>
							<div class="clear"  style="margin-top:16px">
								<p class="fl">出差事由:</p>
								<p  class="clear" style="margin-left:65px;word-break: break-word;">
									{{awaitApprvolDetial.evectionReason}}
								</p>
							</div>
							<div class="clear" style="padding-left:27px;margin-top:16px" v-if="awaitApprvolDetial.imagesInfo != null && awaitApprvolDetial.imagesInfo.length > 0">
								<p class="fl" style="">图片:</p>
								<p  class="clear" style="margin-left:40px">
									<template v-for="item in awaitApprvolDetial.imagesInfo">
										<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" width="44px" height="44px" class="fl" style="margin-right:10px">
									</template>
								</p>
							</div>
						</div>
					</template>
					<!-- 出差审批 -->

					<!-- 请假审批 -->
					<div class="c_content" v-if="awaitApprvolDetial.approveTypeId == 1565750481490059">
						<div class="c_content_fw">
							<div style="margin-top:8px">
								<span>请假类型：</span>
								<span style="color:#606266">{{awaitApprvolDetial.leaveTypeName}}</span>
							</div>
							<div>
								<span>开始时间：</span>
								<span style="color:#606266" v-if="awaitApprvolDetial.holidayUnitCode == 3001 || awaitApprvolDetial.holidayUnitCode == 3002">{{awaitApprvolDetial.beginTime.slice(0,-8)}}</span>
								<span style="color:#606266" v-else-if="awaitApprvolDetial.holidayUnitCode == 3003">{{awaitApprvolDetial.beginTime.slice(0,-6)}}</span>
								<span style="color:#606266" v-else>{{awaitApprvolDetial.beginTime.slice(0,-3)}}</span>
							</div>
							<div>
								<span>结束时间：</span>
								<span style="color:#606266" v-if="awaitApprvolDetial.holidayUnitCode == 3001 || awaitApprvolDetial.holidayUnitCode == 3002">{{awaitApprvolDetial.endTime.slice(0,-8)}}</span>
								<span style="color:#606266" v-else-if="awaitApprvolDetial.holidayUnitCode == 3003">{{awaitApprvolDetial.endTime.slice(0,-6)}}</span>
								<span style="color:#606266" v-else>{{awaitApprvolDetial.endTime.slice(0,-3)}}</span>
							</div>
							<div>
								<span>请假天数：</span>
								<span style="color:#606266" v-if="awaitApprvolDetial.holidayUnitCode == 3001 || awaitApprvolDetial.holidayUnitCode == 3002">{{awaitApprvolDetial.leaveDays}}天</span>
								<span style="color:#606266" v-if="awaitApprvolDetial.holidayUnitCode == 3003 || awaitApprvolDetial.holidayUnitCode == 3004">{{awaitApprvolDetial.leaveDays}}小时</span>
							</div>
							<div style="padding-right:25px">
								<p class="fl">请假事由：</p>
								<p style="color:#606266;margin-left:75px;word-break: break-word;">{{awaitApprvolDetial.leaveReason}}</p>
							</div>
							<div v-if="awaitApprvolDetial.imagesInfo != null && awaitApprvolDetial.imagesInfo.length > 0">
								<p class="fl">图片：</p>
								<p style="color:#606266;margin-left:45px" class="clear">
									<template v-for="item in awaitApprvolDetial.imagesInfo">
										<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" width="44px" height="44px" class="fl" style="margin-right:10px">
									</template>
								</p>
							</div>
						</div>
					</div>
					<!-- 请假审批 -->

					<!-- 付款申请 -->
					<div class="c_content" v-if="awaitApprvolDetial.approveTypeId == 1565750481960533">
						<div class="c_content_fw">
							<div style="margin-top:8px">
								<p class="fl">付款事由：</p>
								<p style="color:#606266;margin-left:75px;word-break: break-word;">{{awaitApprvolDetial.paymentReason}}</p>
							</div>
							<div>
								<span>付款总额：</span>
								<span style="color:#606266">{{awaitApprvolDetial.paymentCollectMoney}}元</span>
							</div>
							<div>
								<span>付款方式：</span>
								<span style="color:#606266">{{awaitApprvolDetial.paymentTypeName}}</span>
							</div>
							<div>
								<span>支付日期：</span>
								<span style="color:#606266">{{awaitApprvolDetial.paymentTime.slice(0,-9)}}</span>
							</div>
							<div style="padding-right:25px">
								<p class="fl">支付对象：</p>
								<p style="color:#606266;margin-left:75px;word-break: break-word;">{{awaitApprvolDetial.paymentPayObject}}</p>
							</div>
							<div>
								<span>开户行：</span>
								<span style="color:#606266">{{awaitApprvolDetial.paymentOpenBank}}</span>
							</div>
							<div>
								<span>银行账户：</span>
								<span style="color:#606266">{{awaitApprvolDetial.paymentBankAccount}}</span>
							</div>
							<div v-if="awaitApprvolDetial.refuseReason != ''">
								<p class="fl">备注：</p>
								<p style="color:#606266;margin-left:42px;word-break: break-word;">{{awaitApprvolDetial.refuseReason}}</p>
							</div>
						</div>
					</div>
					<!-- 付款申请 -->

					<!-- 转正申请 -->
					<div class="c_content" v-if="awaitApprvolDetial.approveTypeId == 1565750481870350">
						<div class="c_content_fw">
							<div style="margin-top:8px">
								<p class="fl">申请人：</p>
								<p style="color:#606266;margin-left:60px;word-break: break-word;">{{awaitApprvolDetial.createName}}</p>
							</div>
							<div>
								<span>试用期：</span>
								<span style="color:#606266">{{awaitApprvolDetial.positiveEntryTime.slice(0,-9)}}</span>
							</div>
							<div>
								<span>转正日期：</span>
								<span style="color:#606266">{{awaitApprvolDetial.positivePositiveTime.slice(0,-9)}}</span>
							</div>
							<div v-if="awaitApprvolDetial.positivePositionName">
								<span>职位：</span>
								<span style="color:#606266">{{awaitApprvolDetial.positivePositionName}}</span>
							</div>
							<div v-if="awaitApprvolDetial.positivePositionRank">
								<span>职级：</span>
								<span style="color:#606266">{{awaitApprvolDetial.positivePositionRank}}</span>
							</div>
							<div style="padding-right:25px" v-if="awaitApprvolDetial.positivePostComprehend">
								<p class="fl">岗位理解：</p>
								<p style="color:#606266;margin-left:70px;word-break: break-word;">{{awaitApprvolDetial.positivePostComprehend}}</p>
							</div>
							<div style="padding-right:25px">
								<p class="fl">工作总结：</p>
								<p style="color:#606266;margin-left:68px;word-break: break-word;">{{awaitApprvolDetial.positiveWorkSummary}}</p>
							</div>
							<div style="padding-right:25px" v-if="awaitApprvolDetial.positiveCompanyOpinion">
								<p class="fl">意见和建议：</p>
								<p style="color:#606266;margin-left:82px;word-break: break-word;">{{awaitApprvolDetial.positiveCompanyOpinion}}</p>
							</div>
						</div>
					</div>
					<!-- 转正申请 -->

					<!-- 加班审批 -->
					<div class="c_content" v-if="awaitApprvolDetial.approveTypeId == 1565750481460278">
						<div class="c_content_fw">
							<div style="margin-top:8px">
								<span>开始时间：</span>
								<span style="color:#606266">{{awaitApprvolDetial.beginTime.slice(0,-3)}}</span>
							</div>
							<div>
								<span>结束时间：</span>
								<span style="color:#606266">{{awaitApprvolDetial.endTime.slice(0,-3)}}</span>
							</div>
							<div>
								<span>时长：</span>
								<span style="color:#606266">{{awaitApprvolDetial.extraworkHours}}小时</span>
							</div>
							<div>
								<span>是否法定节假日：</span>
								<span style="color:#606266">{{awaitApprvolDetial.isStatutoryHoliday == 1 ? '是' : '否'}}</span>
							</div>
							<div style="padding-right:25px">
								<p class="fl">加班原因：</p>
								<p style="color:#606266;margin-left:75px;word-break: break-word;">{{awaitApprvolDetial.extraworkReason}}
								</p>
							</div>
							<div v-if="awaitApprvolDetial.imagesInfo != null && awaitApprvolDetial.imagesInfo.length > 0">
								<p class="fl">图片：</p>
								<p style="color:#606266;margin-left:45px" class="clear">
									<template v-for="item in awaitApprvolDetial.imagesInfo">
										<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" width="44px" height="44px" class="fl" style="margin-right:10px">
									</template>
								</p>
							</div>
						</div>
					</div>
					<!-- 加班审批 -->

					<!-- 补卡审批 -->
					<div class="c_content" v-if="awaitApprvolDetial.approveTypeId == 1565750481760200">
						<div class="c_content_fw">
							<div style="margin-top:8px">
								<span>补卡时间点：</span>
								<span style="color:#606266">{{awaitApprvolDetial.cardReissueDate.slice(0,-8)}}&nbsp; {{awaitApprvolDetial.cardReissueTime.slice(10,19)}}</span>
							</div>
							<div style="padding-right:25px">
								<p class="fl">缺卡原因：</p>
								<p style="color:#606266;margin-left:75px;word-break: break-word;">{{awaitApprvolDetial.cardReissueReason}}
								</p>
							</div>
							<div v-if="awaitApprvolDetial.imagesInfo != null && awaitApprvolDetial.imagesInfo.length > 0">
								<p class="fl">图片：</p>
								<p style="color:#606266;margin-left:45px" class="clear">
									<template v-for="item in awaitApprvolDetial.imagesInfo">
										<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" width="44px" height="44px" class="fl" style="margin-right:10px">
									</template>
								</p>
							</div>
						</div>
					</div>
					<!-- 补卡审批 -->

					<!-- 外出审批 -->
					<div class="c_content" v-if="awaitApprvolDetial.approveTypeId == 1565750481980168">
						<div class="c_content_fw">
							<div style="margin-top:8px">
								<span>开始时间：</span>
								<span style="color:#606266">{{awaitApprvolDetial.beginTime.slice(0,-3)}}</span>
							</div>
							<div>
								<span>结束时间：</span>
								<span style="color:#606266">{{awaitApprvolDetial.endTime.slice(0,-3)}}</span>
							</div>
							<div>
								<span>外出时间：</span>
								<span style="color:#606266">{{awaitApprvolDetial.goOutHours}}小时</span>
							</div>
							<div style="padding-right:25px">
								<p class="fl">外出事由：</p>
								<p style="color:#606266;margin-left:75px;word-break: break-word;">{{awaitApprvolDetial.goOutReason}}
								</p>
							</div>
							<div v-if="awaitApprvolDetial.imagesInfo != null && awaitApprvolDetial.imagesInfo.length > 0">
								<p class="fl">图片：</p>
								<p style="color:#606266;margin-left:45px" class="clear">
									<template v-for="item in awaitApprvolDetial.imagesInfo">
										<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" width="44px" height="44px" class="fl" style="margin-right:10px">
									</template>
								</p>
							</div>
						</div>
					</div>
					<!-- 外出审批 -->

					<!-- 审批节点 -->
					<div class="c_approval" :class="awaitApprvolDetial.queryApproveEmployeeSynopsisVOS.length > 0 ? 'c_approval_border' : ''">
						<template v-for="(first,index) in awaitApprvolDetial.flowAndComment">
							<template v-if="first.approveFlowVos.length > 1">
								<div class="clear c_approval_peo">
									<img :src="first.approveFlowVos[0].auditHeadUrl" alt="" height="44px" width="44px" class="fl" style="border-radius:3px;" v-if="first.approveFlowVos[0].auditHeadUrl">
									<img src="../images/icon_head.png" alt="" height="44px" width="44px" class="fl" style="border-radius:3px;" v-else>
									<div class="fl" style="cursor: pointer;" @click="loadApprovalDetial(first.approveFlowVos)">{{first.approveFlowVos[0].auditName}}等{{first.approveFlowVos.length}}人</div>
									<div class="fl" style="color:#FF6565" v-if="first.approveFlowVos[0].approveStatus == 4 && index != 0">{{first.approveFlowVos[0].approveBehavior}}</div>
									<div class="fl" style="color:#6CC9A8" v-else-if="first.approveFlowVos[0].approveStatus == 3 && index != 0">{{first.approveFlowVos[0].approveBehavior}}</div>
									<div class="fl" style="color:#909399" v-else>{{first.approveFlowVos[0].approveBehavior}}</div>
									<div class="fr" style="color:#909399">{{first.approveFlowVos[0].displayTime}}</div>
								</div>
							</template>
							<template v-else>
								<div class="clear c_approval_peo">
									<img :src="first.approveFlowVos[0].auditHeadUrl" alt="" height="44px" width="44px" class="fl" style="border-radius:3px;" v-if="first.approveFlowVos[0].auditHeadUrl">
									<img src="../images/icon_head.png" alt="" height="44px" width="44px" class="fl" style="border-radius:3px;" v-else>
									<div class="fl">{{first.approveFlowVos[0].auditName}}</div>
									<div class="fl" style="color:#FF6565" v-if="first.approveFlowVos[0].approveStatus == 4 && index != 0">{{first.approveFlowVos[0].approveBehavior}}</div>
									<div class="fl" style="color:#6CC9A8" v-else-if="first.approveFlowVos[0].approveStatus == 3 && index != 0">{{first.approveFlowVos[0].approveBehavior}}</div>
									<div class="fl" style="color:#909399" v-else>{{first.approveFlowVos[0].approveBehavior}}</div>
									<div class="fr" style="color:#909399">{{first.approveFlowVos[0].displayTime}}</div>
								</div>
							</template>

							<template v-for="(item,inde) in first.approveFlowVos" v-if="inde == 0 && item.approveNode != -1">
								<template v-if="item.approveContent == '' && item.imagesInfo.length == 0 && item.accessorysInfo.length == 0">
									<div class="c_approval_node" v-if="index != awaitApprvolDetial.flowAndComment.length - 1 || first.approveCommentVOS != null && first.approveCommentVOS.length > 0">
										<div></div>
										<div></div>
									</div>
								</template>
								<template v-else>
								</template>
							</template>
							<template v-else>
								<template v-if="inde == 0">
									<div class="c_approval_node" v-if="index != awaitApprvolDetial.flowAndComment.length - 1 || first.approveCommentVOS != null && first.approveCommentVOS.length > 0">
										<div></div>
										<div></div>
									</div>
								</template>
							</template>
							
							<template v-for="second in first.approveFlowVos" v-if="second.approveNode != -1">
								<div class="add_approval_node clear" v-if="second.approveContent != ''|| second.accessorysInfo != null &&  second.accessorysInfo.length > 0 || second.imagesInfo != null &&  second.imagesInfo.length > 0 ">
									<div class="approval_people" :class="index != awaitApprvolDetial.flowAndComment.length - 1 || first.approveCommentVOS != null && first.approveCommentVOS.length > 0 ? 'approval_border' : ''"> 
										<div style="color:#606266">{{second.approveContent}}</div>
										<div class="approval_position" v-if="index != awaitApprvolDetial.flowAndComment.length - 1 || first.approveCommentVOS != null && first.approveCommentVOS.length > 0"></div>
										<div class="clear" style="border-bottom:1px solid #EEEEEE;padding:10px 0 10px 0" v-if="second.imagesInfo != null && second.imagesInfo.length > 0">
											<template v-for="item in second.imagesInfo">
												<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" height="44px" width="44px" class="fl" style="margin:8px 8px 0 0px">
											</template>
										</div>
										<div class="clear" style="padding:10px 0px;border-bottom:1px solid #EEEEEE;" v-for="enclosure in second.accessorysInfo" v-if="second.accessorysInfo != null">
											<div @click="downLoadFile(enclosure.absolutePath,enclosure.originalFileName)">
												<img class="fl" src="../../../../commons/images/word.png" alt="" v-if="enclosure.type===0" height="44px" width="44px" style="margin-right:5px">
												<img class="fl" src="../../../../commons/images/excel.png" alt="" v-if="enclosure.type===1" height="44px" width="44px" style="margin-right:5px">
												<img class="fl" src="../../../../commons/images/ppt.png" alt="" v-if="enclosure.type===2" height="44px" width="44px" style="margin-right:5px">
												<img class="fl" src="../../../../commons/images/rar.png" alt="" v-if="enclosure.type===3" height="44px" width="44px" style="margin-right:5px">
												<img class="fl" src="../../../../commons/images/pdf.png" alt="" v-if="enclosure.type===4" height="44px" width="44px" style="margin-right:5px">
												<img class="fl" src="../../../../commons/images/jpeg.png" alt="" v-if="enclosure.type===5" height="44px" width="44px" style="margin-right:5px">
												<img class="fl" src="../../../../commons/images/more.png" alt="" v-if="enclosure.type===6" height="44px" width="44px" style="margin-right:5px">
												<div class="fl">
													<div style="color:#606266;margin-top:2px;word-break: break-word;">{{enclosure.originalFileName}}</div>
													<div style="font-size:12px;color:#909399;margin-top:5px;">{{enclosure.fileSize > 1023 ? (enclosure.fileSize > 1048575 ? ((enclosure.fileSize / (1024 * 1024)).toFixed(2) + "MB") : ((enclosure.fileSize / 1024).toFixed(2) + "KB")) : (enclosure.fileSize + "B")}}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template>
								<template v-for="(third,indexs) in first.approveCommentVOS">
									<div class="add_approval_node clear">
										<div class="approval_people" :class="index != awaitApprvolDetial.flowAndComment.length - 1  || indexs != first.approveCommentVOS.length -1 ? 'approval_border' : ''">
											<div class="clear" style="position: relative;top: -11px;">
												<div class="fl">{{third.commentName}}</div>
												<div class="fl" style="color:#909399;margin-left:10px">发表评论</div>
												<div class="fr">{{third.displayTime}}</div>
											</div>
											<div style="color:#606266;margin-top:10px;word-break: break-word;">{{third.commentContent}}</div>
											<div class="approval_position" v-if="index != awaitApprvolDetial.flowAndComment.length - 1 || indexs != first.approveCommentVOS.length -1"></div>
											<div class="clear" style="border-bottom:1px solid #EEEEEE;padding:0 0 10px 0" v-if="third.imagesInfo.length > 0">
												<template v-for="item in third.imagesInfo">
													<img @click="showPreviewPhoto(item.absolutePath)" :src="item.absolutePath" alt="" height="44px" width="44px" class="fl" style="margin:8px 8px 0 0px">
												</template>
											</div>
											<div class="clear" style="padding:10px 0px;border-bottom:1px solid #EEEEEE;" v-for="enclosure in third.accessorysInfo">
												<div @click="downLoadFile(enclosure.absolutePath,enclosure.originalFileName)">
													<img class="fl" src="../../../../commons/images/word.png" alt="" v-if="enclosure.type===0" height="44px" width="44px" style="margin-right:5px">
													<img class="fl" src="../../../../commons/images/excel.png" alt="" v-if="enclosure.type===1" height="44px" width="44px" style="margin-right:5px">
													<img class="fl" src="../../../../commons/images/ppt.png" alt="" v-if="enclosure.type===2" height="44px" width="44px" style="margin-right:5px">
													<img class="fl" src="../../../../commons/images/rar.png" alt="" v-if="enclosure.type===3" height="44px" width="44px" style="margin-right:5px">
													<img class="fl" src="../../../../commons/images/pdf.png" alt="" v-if="enclosure.type===4" height="44px" width="44px" style="margin-right:5px">
													<img class="fl" src="../../../../commons/images/jpeg.png" alt="" v-if="enclosure.type===5" height="44px" width="44px" style="margin-right:5px">
													<img class="fl" src="../../../../commons/images/more.png" alt="" v-if="enclosure.type===6" height="44px" width="44px" style="margin-right:5px">
													<div class="fl">
														<div style="color:#606266;margin-top:2px;word-break: break-word;">{{enclosure.originalFileName}}</div>
														<div style="font-size:12px;color:#909399;margin-top:5px;">{{enclosure.fileSize > 1023 ? (enclosure.fileSize > 1048575 ? ((enclosure.fileSize / (1024 * 1024)).toFixed(2) + "MB") : ((enclosure.fileSize / 1024).toFixed(2) + "KB")) : (enclosure.fileSize + "B")}}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</template>
							</template>
						</template>
					</div>
					<div class="c_copier"  v-if="awaitApprvolDetial.queryApproveEmployeeSynopsisVOS.length > 0">
						<div class="clear">
							<div class="fl">抄送人</div>
							<div class="fl" style="color:#909399;margin-left:8px">{{awaitApprvolDetial.approveStatus == 3 ? '(已抄送)' : '审批通过后，通知抄送人'}}</div>
						</div>
						<div class="clear">
							<div class="fl" style="margin-right:15px;margin-top:15px"  v-for="item in awaitApprvolDetial.queryApproveEmployeeSynopsisVOS">
								<img :src="item.iconUrl" alt="" height="44px" width="44px" v-if="item.iconUrl" style="border-radius:3px;" >
								<img src="../images/icon_head.png" alt="" height="44px" width="44px" style="border-radius:3px;" v-else>
								<div style="margin-top:5px;text-align:center">{{item.employeeName}}</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 撤销后 -->
				<div class="sidebar_footer" v-if="awaitApprvolDetial.buttons[0] == 7001 && awaitApprvolDetial.buttons.length == 1">
					<div class="fl" style="margin-left:250px;cursor:pointer;" @click="handleCommento(1)">
						<img src="../images/pinglun.png" alt="" width="24px" height="21px">
						<div style="color:#4278BE">评论</div>
					</div>
				</div>
				<!-- 撤销前 -->
				<div class="sidebar_footer" v-else>
					<div class="fl" style="cursor:pointer;" @click="personDialogVisible = true" v-if="awaitApprvolDetial.handover">
						<img src="../images/zhuanjiao.png" alt="" width="24px" height="21px">
						<div style="color:#4278BE">转交</div>
					</div>
					<div class="fl" style="margin-left:65px;cursor:pointer;" @click="handleCommento(1)" v-if="awaitApprvolDetial.comment">
						<img src="../images/pinglun.png" alt="" width="24px" height="21px">
						<div style="color:#4278BE">评论</div>
					</div>
					<div class="fl"  style="margin-left:65px;cursor:pointer;" @click="dialogVisible = true" v-if="awaitApprvolDetial.revoke">
						<img src="../images/chexiao.png" alt="" width="24px" height="21px">
						<div style="color:#4278BE">撤销</div>
					</div>
					<el-button class="fr" style="background:#4278BE;color:#fff" @click="handleCommento(2)" v-if="awaitApprvolDetial.agree">同意</el-button>
					<el-button class="fr" style="margin-right:20px;border:1px solid #4278BE;color:#4278BE" @click="handleCommento(3)" v-if="awaitApprvolDetial.refuse">拒绝</el-button>
				</div>
			</div>
		</div>
		<!--大遮罩-->
		<div class="remokeDialog">
			<el-dialog
				:visible.sync="dialogVisible"  width="30%" style="margin-top: 15vh;">
				<span>确定要撤销该申请吗？</span>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false" style="width:109px;height:40px;border-radius:3px;border:1px solid rgba(66,120,190,1);color:#4278BE">取 消</el-button>
					<el-button type="primary" @click="revokeApproval" style="width:109px;height:40px;background:#4278BE;color:#fff;border-radius:3px;">确 定</el-button>
				</span>
			</el-dialog>
		</div>
		
		<!-- 评论弹框 -->
		<div class="commentoVisible">
			<el-dialog
				:visible.sync="commentoVisible" style="margin-top: 5vh;">
				<div
					slot="title"
					class="header-title clear"
					style="border-bottom:1px solid #BFC2CC;height:42px;"
				>
					<div
						style="width:8px;height:20px;background:#4278BE;float:left;margin-top:4px;margin-left:20px"
					></div>
					<div
						style="height:31px;font-size:18px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:27px;float:left;margin-left:10px"
					>{{commentoVisibleStatus == '1' ? '评论' : commentoVisibleStatus == '2' ? '审批同意意见' :commentoVisibleStatus == '3' ? '审批拒绝意见' : '转交给' + careApproveName}}</div>
				</div>
				<el-input
					type="textarea"
					:placeholder="commentoVisibleStatus == '1' ? '请输入评论' : commentoVisibleStatus == '2' ? '请输入审批同意意见' : commentoVisibleStatus == '3' ? '请输入审批拒绝意见' : '请输入转交备注'"
					v-model="commenContent"
					maxlength="1000"
					show-word-limit
					>
				</el-input>
				<div style="margin-top:20px">
					<upload :type="1" @afterFileList="afterFileList" @editParents="editParents"></upload>
				</div>
				<div>
					<upload :type="2" @afterFileList="afterFileList" @editParents="editParents"></upload>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="handleDialogClose" style="width:109px;height:40px;border-radius:3px;border:1px solid rgba(66,120,190,1);color:#4278BE">取 消</el-button>
					<el-button type="primary" style="width:109px;height:40px;background:#4278BE;color:#fff;border-radius:3px;" @click="handeSubmit">确 定</el-button>
				</span>
			</el-dialog>
		</div>
		<div class="approvalDetial">
            <el-dialog
                :visible.sync="approvalDetial">
                <div
                    slot="title"
                    class="header-title clear"
                    style="border-bottom:1px solid #BFC2CC;height:42px;"
                >
                <div
                        style="width:8px;height:20px;background:#4278BE;float:left;margin-top:4px;margin-left:20px"
                    ></div>
                    <div
                        style="width:98px;height:31px;font-size:18px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:27px;float:left;margin-left:10px"
                    >审批人({{approvalPeopleList.length}})</div>
                </div>
                <div class="clear">
					<template v-for="item in approvalPeopleList">
						<div class="fl" style="margin-right:15px">
							<img :src="item.auditHeadUrl" alt="" height="44px" width="44px" v-if="item.auditHeadUrl">
							<img src="../images/icon_head.png" alt="" height="44px" width="44px" v-else>
							<div style="text-align:center">{{item.auditName}}</div>
						</div>
					</template>
				</div>
            </el-dialog>
        </div>
		<div class="shared_box_big" v-if="SidebarShow"  @click="handleClose"></div>
		<PreviewPhoto :photoUrl="previewPhoto" :isShow="isShowPhoto" @editParents="editParent"></PreviewPhoto>
		<PersonDialog
			ref="PersonDialog"
			:treeData="personnelList"
			:defaultProps="{label:'name',children:'children'}"
			:transferTitle="['选择部门人员', '已选择']"
			:dialogVisible="personDialogVisible"
            :select="true"
			@handlePersonClose="handlePersonClose"
			@handlePsrsonSubmit="handlePsrsonSubmit">
		</PersonDialog>
	</div>
</template>

<script>
	import '../../../../../modules/common'
	import PreviewPhoto from '../../../../commons/previewPhoto'
	import upload from '../../../../commons/upLoad'
	import PersonDialog from '../../../../commons/persondialog'
	import bus from '../../../../../modules/bus'

	export default {
		name: "sliderDialog",
		components:{
			PreviewPhoto,
			upload,
			PersonDialog
		},
		data() {
			return {
				userDetail: JSON.parse(sessionStorage.getItem("teamEmployeeDetailVO")),
                isShowPhoto:false,
                SidebarShow:false,
				previewPhoto:'',
				approvalDetial:false,   //审批人详情
				approvalPeopleList:[],
				dialogVisible:false,	//撤销审批
				commentoVisible:false,   //评论弹框
				commenContent:'',       //评论内容
				commentoVisibleStatus:'',   //弹框内容
				pictureList:[],			//图片列表
				attachmentList:[],    // 文件列表
				personnelList: [],     //组织架构列表
				personDialogVisible:false,  //组织架构弹框隐藏显示
				createTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
				careApproveId:'',   	//转交人id
				careApproveName:'',
			}
		},
		props: {
			sidebarShow: {  //展示隐藏
				type: Boolean,
				default: false,
				required: true
			},
			awaitApprvolDetial:{
				type: Object,
				default: {},
				required: true
			}
		},
		created () {
			this.SidebarShow = this.sidebarShow;
			this.getPersonnelList()
		},
		watch: {
            sidebarShow() {
				this.SidebarShow = this.sidebarShow
			},
			awaitApprvolDetial (newval) {
				console.log(newval)
				newval.buttons.forEach(item => {
					if (item == 7001) {
						this.awaitApprvolDetial.comment = 7001
					}else if (item == 7002) {
						this.awaitApprvolDetial.revoke = 7002
					}else if (item == 7003) {
						this.awaitApprvolDetial.agree = 7003
					}
					else if (item == 7004) {
						this.awaitApprvolDetial.refuse = 7004
					}else {
						this.awaitApprvolDetial.handover = 7005
					}
				})
				newval.flowAndComment.forEach(first => {
					if (first.node == newval.approveNode) {
						this.awaitApprvolDetial.awaitFlag  = first.approveFlowVos.some(item => {
							return item.auditId == this.userDetail.id
						});
						this.awaitApprvolDetial.awaitArr = first.approveFlowVos
					}
					if (first.approveCommentVOS){
						first.approveCommentVOS.forEach(second => {
							second.accessorysInfo.forEach(third => {
								third.type = third.originalFileName.substring(third.originalFileName.lastIndexOf('.'))
								switch (third.type) {
									case ".doc":
									case ".docx":
										third.type = 0;
										break;
									case ".xlsx":
									case ".xls":
										third.type = 1;
										break;
									case ".ppt":
									case ".pptx":
										third.type = 2;
										break;
									case ".rar":
									case ".zip":
										third.type = 3;
										break;
									case ".pdf":
										third.type = 4;
										break;
									case ".jpg":
									case ".jpeg":
									case ".png":
										third.type = 5;
										break;
									default:
										third.type = 6;
										break;
								}
							})
						})
					}
					if (first.approveFlowVos){
						first.approveFlowVos.forEach(second => {
							if (second.accessorysInfo != null) {
								second.accessorysInfo.forEach(third => {
								third.type = third.originalFileName.substring(third.originalFileName.lastIndexOf('.'))
								switch (third.type) {
									case ".doc":
									case ".docx":
										third.type = 0;
										break;
									case ".xlsx":
									case ".xls":
										third.type = 1;
										break;
									case ".ppt":
									case ".pptx":
										third.type = 2;
										break;
									case ".rar":
									case ".zip":
										third.type = 3;
										break;
									case ".pdf":
										third.type = 4;
										break;
									case ".jpg":
									case ".jpeg":
									case ".png":
										third.type = 5;
										break;
									default:
										third.type = 6;
										break;
								}
							})
							}
						})
					}
				})
				if (newval.accessorysInfo){
					newval.accessorysInfo.forEach(third => {
						third.type = third.originalFileName.substring(third.originalFileName.lastIndexOf('.'))
						switch (third.type) {
							case ".doc":
							case ".docx":
								third.type = 0;
								break;
							case ".xlsx":
							case ".xls":
								third.type = 1;
								break;
							case ".ppt":
							case ".pptx":
								third.type = 2;
								break;
							case ".rar":
							case ".zip":
								third.type = 3;
								break;
							case ".pdf":
								third.type = 4;
								break;
							case ".jpg":
							case ".jpeg":
							case ".png":
								third.type = 5;
								break;
							default:
								third.type = 6;
								break;
						}
					})
				}
			}
		},
		mounted() {

		},
		methods: {
            handleClose() {
				this.SidebarShow = false;
				this.pictureList = []
				this.attachmentList = []
				this.$emit('close',false)
			},
			// 查看图片
            editParent(value) {
				this.isShowPhoto = value;
			},
			// 上传图片，附件
			afterFileList(type, afterFileList) {
				if (type === 1)//图片
					this.pictureList = afterFileList;
				else //附件
					this.attachmentList = afterFileList;

			},
			// 上传图片，附件
			editParents(value, fileType) {
				if (value.constructor === Array) {
					if (fileType === 1) {//图片
						this.pictureList = value;
					} else {//附件
						this.attachmentList = value;
					}
					return;
				} else {
					// this.clearData();
				}
			},
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
			// 组织架构弹框取消
			handlePersonClose () {
				this.personDialogVisible = false
			},
			//组织架构确定
			handlePsrsonSubmit (arr) {
				if (arr.length > 0) {
					this.careApproveId = arr[0].id
					this.careApproveName = arr[0].name
					this.commentoVisible = true
					this.commentoVisibleStatus = 4
					this.$refs.PersonDialog.visible = false
					this.personDialogVisible = false
				}else {
					this.$message({
						type:'error',
						message:'请选择转交人'
					})
					this.$refs.PersonDialog.visible = true
					this.personDialogVisible = true
				}
			},
			handleCommento (status) {
				this.commentoVisibleStatus = status
				this.commentoVisible = true
			},
			// 审批同意拒绝评论弹框
			handeSubmit () {
				// 1 评论  2 同意  3 拒绝  4转交
				if (this.commentoVisibleStatus == 2 || this.commentoVisibleStatus == 3) {
					this.$http({
						method:'POST',
						url:'oaManager/v1/feign/oa/approve/updateApproveStatus',
						data:{
							approveTypeId:this.awaitApprvolDetial.approveTypeId,
							approveChildrenId:this.awaitApprvolDetial.approveChildrenId,
							approverId:this.userDetail.id,
							approveStatus:this.commentoVisibleStatus == 2 ? '3' : '4',
							approveContent:this.commenContent,
							imagesInfo:this.pictureList,			//图片列表
							accessorysInfo:this.attachmentList 
						}
					}).then(res => {
						if (res.data.code == 200) {
							this.commentoVisible = false
							// this.SidebarShow = false
							// this.$emit('close',false)
							this.$message({
								type:'success',
								message:res.data.message
							})
							bus.$emit('approvalStatus',true)
							this.$emit('close',{approveTypeId:this.awaitApprvolDetial.approveTypeId,approveChildrenId:this.awaitApprvolDetial.approveChildrenId,commentId:this.userDetail.id,approveName:this.awaitApprvolDetial.approveName})
							this.commenContent = ''
							this.pictureList = []
							this.attachmentList = []
						}else {
							this.$message({
								type:'error',
								message:res.data.message
							})
							bus.$emit('approvalStatus',true)
							this.$emit('close',{approveTypeId:this.awaitApprvolDetial.approveTypeId,approveChildrenId:this.awaitApprvolDetial.approveChildrenId,commentId:this.userDetail.id,approveName:this.awaitApprvolDetial.approveName})
						}
					})
				}else if (this.commentoVisibleStatus == 1) {
					this.$http({
						method:'POST',
						url:'/oaManager/v1/feign/oa/approve/saveApproveComment',
						data:{
							approveTypeId:this.awaitApprvolDetial.approveTypeId,
							approveChildrenId:this.awaitApprvolDetial.approveChildrenId,
							commentId:this.userDetail.id,
							commentContent:this.commenContent,
							imagesInfo:this.pictureList,			//图片列表
							accessorysInfo:this.attachmentList
						}
					}).then(res => {
						if (res.data.code == 200) {
							this.commentoVisible = false
							// this.SidebarShow = false
							this.$emit('close',{approveTypeId:this.awaitApprvolDetial.approveTypeId,approveChildrenId:this.awaitApprvolDetial.approveChildrenId,commentId:this.userDetail.id,approveName:this.awaitApprvolDetial.approveName})
							this.$message({
								type:'success',
								message:'评论成功'
							})
							this.commenContent = ''
							this.pictureList = []
							this.attachmentList = []
						}else {
							this.$message({
								type:'error',
								message:res.data.message
							})
						}
					})
				}else if (this.commentoVisibleStatus == 4){
					this.$http({
						method:'POST',
						url:'/oaManager/v1/feign/oa/approve/updateApproveCare',
						data:{
							approveTypeId:this.awaitApprvolDetial.approveTypeId,
							approveChildrenId:this.awaitApprvolDetial.approveChildrenId,
							currentApproveId:this.userDetail.id,
							careApproveId:this.careApproveId,
							approveContent:this.commenContent,
							imagesInfo:this.pictureList,			//图片列表
							accessorysInfo:this.attachmentList
						}
					}).then(res => {
						if (res.data.code == 200) {
							this.commentoVisible = false
							this.SidebarShow = false
							this.$emit('close',false)
							bus.$emit('approvalStatus',true)
							this.$message({
								type:'success',
								message:res.data.message
							})
							this.personDialogVisible = false
							this.commenContent = ''
							this.pictureList = []
							this.attachmentList = []
						}else {
							this.$message({
								type:'error',
								message:res.data.message
							})
							bus.$emit('approvalStatus',true)
							this.$emit('close',{approveTypeId:this.awaitApprvolDetial.approveTypeId,approveChildrenId:this.awaitApprvolDetial.approveChildrenId,commentId:this.userDetail.id,approveName:this.awaitApprvolDetial.approveName})
						}
					})
				}
			},
			// 审批取消拒绝评论弹框
			handleDialogClose () {
				this.commentoVisible = false
				if (this.commentoVisibleStatus === 4) {
					this.personDialogVisible = true
				}
				this.pictureList = []
				this.attachmentList = []
			},
			loadApprovalDetial (list) {
				this.approvalPeopleList = list
				this.approvalDetial = true
			},
			// 撤销审批
			revokeApproval () {
				this.$http({
					method:'GET',
					url:`/oaManager/v1/feign/oa/approve/recallApprove/${this.awaitApprvolDetial.approveTypeId}/${this.awaitApprvolDetial.approveChildrenId}/${this.userDetail.id}`
				}).then(res => {
					this.dialogVisible = false
					// this.SidebarShow = false
					bus.$emit('approvalStatus',true)
					this.$emit('close',{approveTypeId:this.awaitApprvolDetial.approveTypeId,approveChildrenId:this.awaitApprvolDetial.approveChildrenId,commentId:this.userDetail.id,approveName:this.awaitApprvolDetial.approveName})
				})
			},
			// 评论图片展示
			showPreviewPhoto (url) {
				this.previewPhoto = url
				this.isShowPhoto = true
			},
			downLoadFile(fileUrl, filaName) {
				let url = fileUrl
				let link = document.createElement('a')
				link.style.display = 'none'
				link.href = url
				link.setAttribute('download', filaName || 'photo') 
				document.body.appendChild(link)
				link.click()
			}
        }
}
</script>

<style lang="scss">
.sideDialogs .shared_box_big {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
        z-index: 1;
		background: rgba(0, 0, 0, 0.3);
	}

.sideDialogs	.sidebar_box {
		position: fixed;
		top: 0;
		right: 0;
		width: 600px;
		height: 100%;
		background-color: #fff;
		/*padding: 20px;*/
		color: #303133;
		z-index: 2;
	}

.sideDialogs	.sidebar_box_ne {
		width: 100%;
		height: 100%;
		position: relative;
	}

.sideDialogs	.sidebar_header {
		height: 66px;
		width: 100%;
		box-sizing: border-box;
		border-bottom: 2px solid #EEEEEE;
		position:absolute;
		top: 0;
		line-height: 66px;
		padding:0 20px;
	}

.sideDialogs	.sidebar_header > P {
		font-size: 20px;
		color: #303133;
	}

.sideDialogs	.sidebar_header > span {
		color: #BFC2CC;
		font-size: 22px;
		cursor: pointer;
	}

.sideDialogs	.sidebar_content {
		position: absolute;
		top: 152px;
		width: 100%;
		bottom: 70px;
		overflow: auto;
	}
.sideDialogs	.sidebar_box .c_head {
		position: absolute;
		padding: 20px;
		/* height: 80px; */
		width: 100%;
		/* box-sizing: border-box; */
		top: 65px;
		border-bottom: 1px solid #F3F3F3;
}

.sideDialogs	.sidebar_box .c_head img {
		border-radius:3px;
		margin-left: 15px;
	}
.sideDialogs	.sidebar_box .c_head .c_head_fl {
		margin-left: 12px;
	}
.sideDialogs	.sidebar_box .c_head .c_head_fl :last-child{
		margin-top: 8px
	}
.sideDialogs	.sidebar_box .c_content {
		padding-right:25px;
		padding-bottom: 8px;
		border-bottom: 1px solid #EEEEEE;
	}
.sideDialogs	.sidebar_box .c_content h4{
		padding-left: 35px;
		height: 40px;
		background: #F3F3F3;
		color: #909399;
		line-height: 40px;
	}
.sideDialogs	.sidebar_box .c_content_fw {
		padding-left: 35px;
	}
.sideDialogs	.sidebar_box .c_content_fw div{
		padding:8px 0;
	}
.sideDialogs	.sidebar_box .c_footer {
		padding: 10px 25px 10px 35px;
		border-bottom: 1px solid #EEEEEE;
	}
.sideDialogs	.sidebar_box .c_approval_border {
		border-bottom: 1px solid #EEEEEE;
	}	
.sideDialogs	.sidebar_box .c_approval {
		padding: 10px 25px 30px 35px;
		.c_approval_peo {
			line-height: 44px;
			margin-top: 5px;
		}
		.c_approval_peo div {
			margin-left: 15px
		}
		.c_approval_node {
			padding: 0 20px
		}
		.c_approval_node :first-child {
			width: 2px;
			height: 20px;
			margin-left: 1px;
			background: #EEEEEE;
		}
		.c_approval_node :last-child {
			width: 4px;
			height: 4px;
			border-radius: 50%;
			background: #4278BE;
		}
		.add_approval_node {
			// height: 100%;
			// width: 100%;
			// margin-bottom: 10px;
		}
		.add_approval_node .vertical_line {
			width: 2px;
			height: 80px;
			margin-left: 21px;
			background: #EEEEEE
		}
		.add_approval_node .approval_people {
			position: relative;
			margin-left: 21px;
			padding-left: 40px;
			// top:-10px;
			padding-bottom: 40px;
			box-sizing: border-box;
			color:#909399;
			// border-left: 2px solid #EEEEEE;
		}
		.approval_border {
			border-left: 2px solid #EEEEEE;
		}
		.approval_position {
			position: absolute;
			bottom: 0;
			left:-3px;
			width:4px;
			height:4px;
			background:rgba(66,120,190,1);
			border-radius: 50%;
		}
	}
.sideDialogs	.sidebar_box .c_copier {
		padding:20px 35px;
	}
.sideDialogs	.sidebar_box .sidebar_footer {
		position:absolute;
		// height: 59px;
		padding: 15px 35px;
		box-sizing: border-box;
		width:100%;
		background: #fff;
		border-top: 1px solid #eeeeee;
		bottom: 0;
	}
.sideDialogs .remokeDialog {
	.el-dialog {
		width: 450px !important;
		height:180px !important
	}
}
.sideDialogs	.approvalDetial {
		.el-dialog {
			width: 544px !important;
			min-height: 586px !important;
		}
		.el-dialog__header {
			padding: 20px 0 10px;
		}
		.el-dialog__body {
			padding: 20px;
		}
		// .el-dialog__footer {
		// 	padding: 60px 20px 20px;
		// }
		.el-dialog__close {
			display: block !important;
			margin-top: 6px;
		}
	}	
.sideDialogs	.commentoVisible {
		.el-dialog {
			width: 544px !important;
			.showPic_box img {
				height: 44px;
				width: 44px
			}
			.pictureHei {
				line-height: 44px;
			}
			.file_box {
				margin-bottom: 10px	;
			}
			.textContent {
				height: 44px;
			}
		}
		.el-textarea__inner {
			height: 248px;
		}
		.el-dialog__header {
			padding: 20px 0 10px;
		}
		.el-dialog__body {
			padding: 20px;
		}
		.el-dialog__footer {
			padding: 60px 20px 20px;
		}
		.el-dialog__close {
			display: none !important;
			margin-top: 6px;
		}
	}
</style>
