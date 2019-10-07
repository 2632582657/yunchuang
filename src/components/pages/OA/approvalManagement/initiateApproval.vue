<!--@description: 发起审批
	@author: 赵康
    @update: 赵康(2019-08-20 09:45) -->
<template>
	<div class="approval_box">
		<div class="approval_modal" v-for="(approval,index) in approvalList">
			<div class="clear approval_modal_head">
				<p class="fl approval_icon"></p>
				<p class="fl approval_name">{{approval.approvalName}}</p>
			</div>
			<div class="clear">
				<p class="clearapproval_modal_content fl" v-for="(child,index_children) in approval.childrenList"
				   @click="getFrame(index,index_children)">
					<img :src="child.src" alt="">
					<span>{{child.name}}</span>
				</p>
			</div>
		</div>
		<div class="right_frame_model clear" v-show="isShow" @click.self="handleClose">
			<div class="right_frame fr">
				<div style="position: relative;height: 100%;width: 100%;">
					<div class="frame_head clear">
						<p class="frame_name fl">{{frameName}}</p>
						<p class="frame_close fr" @click="closeFrame">×</p>
					</div>
					<div class="frame_content">
						<!--请假-->
						<el-form :rules="rules" :model="leaveList" ref="leaveList" v-if="applyType==='0-0'">
							<el-form-item label="请假类型:" prop="leaveType" label-width="124px">
								<el-select placeholder="请选择请假类型" class="input_type" v-model="leaveList.leaveType"
										   @change="reportTypeChange('qingjia')">
									<el-option :label="leave.holidayName" :value="leave.id" :key="leave.id"
											   v-for="leave in approveTypeList"></el-option>
								</el-select>
							</el-form-item>
							<div class="clear">
								<el-form-item label="开始时间:" prop="leaveBeginTime" label-width="124px" class="fl">
									<el-date-picker
										ref="leaveBeginTime"
										v-model="leaveList.leaveBeginTime"
										:type="isDateOrMinute<=1?'date':'datetime'"
										:class="{'input_type':isDateOrMinute!=1,'input_typeAm':isDateOrMinute===1}"
										placeholder="选择日期时间"
										:value-format="isDateOrMinute<2?'yyyy-MM-dd':'yyyy-MM-dd HH:mm'"
										:format="isDateOrMinute<2?'yyyy-MM-dd':'yyyy-MM-dd HH:mm'"
										@change="durationCalculate('qingjia')">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="" prop="leaveBeginPmAm"
											  label-width="4px" class="fl" v-if="isDateOrMinute===1">
									<el-select class="select_type" v-model="leaveList.leaveBeginPmAm"
											   @change="durationCalculate('qingjia','begin')"
											   placeholder="请选择时间区间">
										<el-option label="上午" value="0"></el-option>
										<el-option label="下午" value="1"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="clear">
								<el-form-item label="结束时间:" prop="leaveEndTime" label-width="124px" class="fl">
									<el-date-picker
										ref="leaveEndTime"
										v-model="leaveList.leaveEndTime"
										:type="isDateOrMinute<=1?'date':'datetime'"
										:class="{'input_type':isDateOrMinute!=1,'input_typeAm':isDateOrMinute===1}"
										placeholder="选择日期时间"
										:value-format="isDateOrMinute<2?'yyyy-MM-dd':'yyyy-MM-dd HH:mm'"
										:format="isDateOrMinute<2?'yyyy-MM-dd':'yyyy-MM-dd HH:mm'"
										@change="durationCalculate('qingjia')">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="" prop="leaveEndPmAm"
											  label-width="4px" class="fl" v-if="isDateOrMinute===1">
									<el-select class="select_type" v-model="leaveList.leaveEndPmAm"
											   @change="durationCalculate('qingjia','end')"
											   placeholder="请选择时间区间">
										<el-option label="上午" value="0"></el-option>
										<el-option label="下午" value="1"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<el-form-item :label="leaveTime" prop="leaveDays" label-width="124px">
								<el-input v-model.trim="leaveList.leaveDays" class="input_type"
										  @change="durationCalculate('qingjia','change')"
										  placeholder="请输入请假时长"></el-input>
							</el-form-item>
							<el-form-item label="请假事由:" prop="leaveReason" label-width="124px">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写请假事由"
										  v-model.trim="leaveList.leaveReason"></el-input>
							</el-form-item>
						</el-form>
						<!--出差-->
						<el-form :rules="rules" :model="evection" ref="evection" v-if="applyType==='0-1'">
							<div
								:class="{'detail_css':evection.approveEvectionDetailDTOS.length>1,'detail_css_bottom':(evection.approveEvectionDetailDTOS.length-index>1)}"
								v-for="(item,index) in evection.approveEvectionDetailDTOS">
								<div class="detail_style clear">
									<p class="fl">行程明细({{index+1}})</p>
									<p class="fr delete_detail"
									   @click="evection.approveEvectionDetailDTOS.splice(evection.approveEvectionDetailDTOS.length-1,1)">
										-</p>
								</div>
								<el-form-item label="出差地点:" prop="evectionAddress" :rules="rules.evectionAddress"
											  label-width="124px"
											  :prop="'approveEvectionDetailDTOS.'+ index +'.evectionAddress'">
									<el-input v-model.trim="item.evectionAddress" class="input_type"
											  placeholder="请填写出差地点"></el-input>
								</el-form-item>
								<div class="clear">
									<el-form-item label="开始时间:" prop="evectionBeginTime"
												  label-width="124px" class="fl"
												  :rules="rules.evectionBeginTime"
												  :prop="'approveEvectionDetailDTOS.'+ index +'.evectionBeginTime'">
										<el-date-picker
											v-model="item.evectionBeginTime"
											type="date"
											class="input_typeAm"
											placeholder="选择日期时间"
											value-format="yyyy-MM-dd"
											@change="evectionChange(index)">
										</el-date-picker>
									</el-form-item>
									<el-form-item label="" prop="evectionBeginPmAm"
												  label-width="4px" class="fl"
												  :rules="rules.evectionBeginPmAm"
												  :prop="'approveEvectionDetailDTOS.'+ index +'.evectionBeginPmAm'">
										<el-select class="select_type" v-model="item.evectionBeginPmAm"
												   placeholder="请选择时间区间" @change="evectionChange(index,'begin')">
											<el-option label="上午" value="0"></el-option>
											<el-option label="下午" value="1"></el-option>
										</el-select>
									</el-form-item>
								</div>
								<div class="clear">
									<el-form-item label="结束时间:" prop="evectionEndTime" :rules="rules.evectionEndTime"
												  class="fl"
												  label-width="124px"
												  :prop="'approveEvectionDetailDTOS.'+ index +'.evectionEndTime'">
										<el-date-picker
											v-model="item.evectionEndTime"
											type="date"
											class="input_typeAm"
											placeholder="选择日期时间"
											value-format="yyyy-MM-dd"
											@change="evectionChange(index)">
										</el-date-picker>
									</el-form-item>
									<el-form-item label="" prop="evectionEndPmAm"
												  label-width="4px" class="fl"
												  :rules="rules.evectionEndPmAm"
												  :prop="'approveEvectionDetailDTOS.'+ index +'.evectionEndPmAm'">
										<el-select class="select_type" v-model="item.evectionEndPmAm"
												   placeholder="请选择时间区间" @change="evectionChange(index,'end')">
											<el-option label="上午" value="0"></el-option>
											<el-option label="下午" value="1"></el-option>
										</el-select>
									</el-form-item>
								</div>
							</div>
							<el-form-item label="" class="clear"
										  :class="{'detail_css1':evection.approveEvectionDetailDTOS.length>1}">
								<p class="addNone fl"></p>
								<p class="addEvectionDetail fl" @click="addEvectionDetail('xingcheng')">+增加行程明细</p>
							</el-form-item>
							<el-form-item label="出差天数:" prop="evectionDays" label-width="124px">
								<el-input v-model.trim="evection.evectionDays" class="input_type"
										  placeholder="请输入出差天数" @change="evectionChange(index,'change')"></el-input>
							</el-form-item>
							<el-form-item label="出差事由:" prop="evectionReason" label-width="124px">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写出差事由"
										  v-model.trim="evection.evectionReason"></el-input>
							</el-form-item>
						</el-form>
						<!--外出-->
						<el-form :rules="rules" :model="goOut" ref="goOut" v-if="applyType==='0-2'">
							<div class="clear">
								<el-form-item label="开始时间:" prop="goOutBeginTime" label-width="124px">
									<el-date-picker
										v-model="goOut.goOutBeginTime"
										type="datetime"
										class="input_type"
										placeholder="选择日期时间"
										value-format="yyyy-MM-dd HH:mm:ss"
										format="yyyy-MM-dd HH:mm"
										@change="goOutChange">
									</el-date-picker>
								</el-form-item>
							</div>
							<el-form-item label="结束时间:" prop="goOutEndTime" label-width="124px">
								<el-date-picker
									v-model="goOut.goOutEndTime"
									type="datetime"
									class="input_type"
									placeholder="选择日期时间"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd HH:mm"
									@change="goOutChange">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="外出时长(小时):" prop="goOutHours" label-width="124px">
								<el-input v-model.trim="goOut.goOutHours" class="input_type"
										  placeholder="请输入外出时长" @blur="goOutChange('change')"></el-input>
							</el-form-item>
							<el-form-item label="外出事由:" prop="goOutReason" label-width="124px">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写外出事由"
										  v-model.trim="goOut.goOutReason"></el-input>
							</el-form-item>
						</el-form>
						<!--加班-->
						<el-form :rules="rules" :model="overTime" ref="overTime" v-if="applyType==='0-3'">
							<div class="clear">
								<el-form-item label="开始时间:" prop="overTimeBeginTime" label-width="124px">
									<el-date-picker
										v-model="overTime.overTimeBeginTime"
										type="datetime"
										class="input_type"
										placeholder="选择日期时间"
										value-format="yyyy-MM-dd HH:mm:ss"
										format="yyyy-MM-dd HH:mm"
										@change="durationCalculate('jiaban')">
									</el-date-picker>
								</el-form-item>
							</div>
							<el-form-item label="结束时间:" prop="overTimeEndTime" label-width="124px">
								<el-date-picker
									v-model="overTime.overTimeEndTime"
									type="datetime"
									class="input_type"
									placeholder="选择日期时间"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd HH:mm"
									@change="durationCalculate('jiaban')">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="加班时长(小时):" prop="extraworkHours" label-width="124px">
								<el-input v-model.trim="overTime.extraworkHours" class="input_type"
										  placeholder="请输入加班时长"
										  @change="durationCalculate('jiaban','change')"></el-input>
							</el-form-item>
							<el-form-item label="是否法定节假日:" prop="isStatutoryHoliday" label-width="124px">
								<el-switch v-model="overTime.isStatutoryHoliday" active-color="#13ce66"
										   inactive-color="#EDEFF2"
										   active-value="1" :inactive-value="0">
								</el-switch>
							</el-form-item>
							<el-form-item label="加班原因:" prop="extraworkReason" label-width="124px">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写加班原因"
										  v-model.trim="overTime.extraworkReason"></el-input>
							</el-form-item>
						</el-form>
						<!--补卡-->
						<el-form :rules="rules" :model="cardReissue" ref="cardReissue" v-if="applyType==='0-4'">
							<el-form-item label="补卡日期:" prop="cardReissueDate" label-width="124px">
								<el-date-picker
									v-model="cardReissue.cardReissueDate"
									align="right"
									type="date"
									class="input_type"
									placeholder="选择日期"
									:picker-options="{
									disabledDate(time) {
						                 return time.getTime() > Date.now();
					                 },
									}"
									value-format="yyyy-MM-dd HH:mm:ss">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="补卡时间:" prop="cardReissueTime" label-width="124px">
								<el-time-picker
									class="input_type"
									v-model="cardReissue.cardReissueTime"
									placeholder="补卡时间"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="HH:mm">
								</el-time-picker>
							</el-form-item>
							<el-form-item label="补卡原因:" prop="cardReissueReason" label-width="124px">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写补卡原因"
										  v-model.trim="cardReissue.cardReissueReason"></el-input>
							</el-form-item>
						</el-form>
						<!--报销-->
						<el-form :rules="rules" :model="apply" ref="apply" v-if="applyType==='1-0'">
							<div
								:class="{'detail_css':apply.addApproveReimbursementDetailDTOS.length>1,'detail_css_bottom':(apply.addApproveReimbursementDetailDTOS.length-index>1)}"
								v-for="(item,index) in apply.addApproveReimbursementDetailDTOS">
								<div class="detail_style clear">
									<p class="fl">报销明细({{index+1}})</p>
									<p class="fr delete_detail"
									   @click="apply.addApproveReimbursementDetailDTOS.splice(apply.addApproveReimbursementDetailDTOS.length-1,1)">
										-</p>
								</div>
								<el-form-item label="报销金额:" prop="reimbursementMoney" :rules="rules.reimbursementMoney"
											  label-width="124px"
											  :prop="'addApproveReimbursementDetailDTOS.'+ index +'.reimbursementMoney'">
									<el-input v-model.trim="item.reimbursementMoney" placeholder="请输入报销金额"
											  class="input_type" @change="moneyCalculate('baoxiao')"></el-input>
								</el-form-item>
								<el-form-item label="报销类别:" prop="reimbursementType" :rules="rules.reimbursementType"
											  label-width="124px"
											  :prop="'addApproveReimbursementDetailDTOS.'+ index +'.reimbursementType'">
									<el-select placeholder="请选择报销类别" class="input_type"
											   @change="reportTypeChange('baoxiao',item.reimbursementType,index,'validate')"
											   v-model="item.reimbursementType">
										<el-option :label="apply.dataName" :value="apply.id" :key="apply.id"
												   v-for="apply in applyTypeList"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="费用明细:" prop="reimbursementDetail" label-width="124px"
											  :rules="rules.reimbursementDetail"
											  :prop="'addApproveReimbursementDetailDTOS.'+ index +'.reimbursementDetail'">
									<el-input type="textarea" class="input_type" style="height: 104px"
											  placeholder="请填写费用明细"
											  v-model.trim="item.reimbursementDetail"></el-input>
								</el-form-item>
							</div>
							<el-form-item label=""
										  :class="{'detail_css1':apply.addApproveReimbursementDetailDTOS.length>1}">
								<p class="addNone"></p>
								<p class="addEvectionDetail" @click="addEvectionDetail('baoxiao')">+增加报销明细</p>
							</el-form-item>
							<el-form-item label="总报销金额:" prop="reimbursementCollectMoney" label-width="124px">
								<el-input v-model="'￥'+apply.reimbursementCollectMoney" disabled
										  class="input_type reimbursementCollectMoney"></el-input>
							</el-form-item>
						</el-form>
						<!--付款-->
						<el-form :rules="rules" :model="payment" ref="payment" v-if="applyType==='1-1'">
							<el-form-item label="付款事由:" prop="paymentReason" label-width="124px"
										  :rules="rules.paymentReason">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写预期目标"
										  v-model.trim="payment.paymentReason"></el-input>
							</el-form-item>
							<el-form-item label="付款总额:" prop="paymentCollectMoney" :rules="rules.paymentCollectMoney" label-width="124px">
								<el-input v-model.trim="payment.paymentCollectMoney" class="input_type"
										  placeholder="请填写付款总额" @change="moneyCalculate('fukuan')"></el-input>
							</el-form-item>
							<el-form-item label="支付方式:" prop="paymentType" :rules="rules.paymentType"
										  label-width="124px">
								<el-select placeholder="请选择支付方式" class="input_type"
										   v-model="payment.paymentType" @change="reportTypeChange('fukuan','paymentType')">
									<el-option :label="item.name" :value="item.id"
											   v-for="item in paymentTypeList" :key="item.id"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="支付日期:" prop="paymentTime" label-width="124px" :rules="rules.paymentTime">
								<el-date-picker
									v-model="payment.paymentTime"
									type="date"
									class="input_type"
									placeholder="选择日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="支付对象:" prop="paymentPayObject" :rules="rules.paymentPayObject" label-width="124px">
								<el-input v-model.trim="payment.paymentPayObject" class="input_type"
										  placeholder="请填写支付对象"></el-input>
							</el-form-item>
							<el-form-item label="开户行:" prop="paymentOpenBank" :rules="rules.paymentOpenBank" label-width="124px">
								<el-input v-model.trim="payment.paymentOpenBank" class="input_type"
										  placeholder="请填写开户行"></el-input>
							</el-form-item>
							<el-form-item label="银行账户:" prop="paymentBankAccount" :rules="rules.paymentBankAccount" label-width="124px">
								<el-input v-model.trim="payment.paymentBankAccount" class="input_type" @change="reportTypeChange('fukuan','paymentBankAccount')"
										  placeholder="请填写银行账户"></el-input>
							</el-form-item>
							<el-form-item label="备注:" prop="paymentRemark" label-width="124px"
										  :rules="rules.paymentRemark">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写备注"
										  v-model.trim="payment.paymentRemark"></el-input>
							</el-form-item>
						</el-form>
						<!--采购-->
						<el-form :rules="rules" :model="procurement" ref="procurement" v-if="applyType==='1-2'">
							<el-form-item label="申请事由" prop="procurementApplyForReason" label-width="124px">
								<el-input v-model.trim="procurement.procurementApplyForReason" class="input_type"
										  placeholder="请填写申请事由"></el-input>
							</el-form-item>
							<el-form-item label="采购类型:" prop="procurementType" label-width="124px">
								<el-select placeholder="请选择采购类型" class="input_type"
										   v-model="procurement.procurementType"
										   @change="reportTypeChange('caigou',procurement.procurementType)">
									<el-option :label="procurement.dataName" :value="procurement.id"
											   :key="procurement.id"
											   v-for="procurement in procurementList"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="期望交付日期:" prop="procurementDeliveryTime" label-width="124px"
										  class="procurementClass">
								<el-date-picker
									v-model="procurement.procurementDeliveryTime"
									type="date"
									class="input_type"
									placeholder="选择日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
							<div
								:class="{'detail_css':procurement.addApproveProcurementDetailDTOS.length>1,'detail_css_bottom':(procurement.addApproveProcurementDetailDTOS.length-index>1)}"
								v-for="(item,index) in procurement.addApproveProcurementDetailDTOS">
								<div class="detail_style clear">
									<p class="fl">采购明细({{index+1}})</p>
									<p class="fr delete_detail"
									   @click="procurement.addApproveProcurementDetailDTOS.splice(procurement.addApproveProcurementDetailDTOS.length-1,1)">
										-</p>
								</div>
								<el-form-item label="名称:" prop="procurementDetailName"
											  :rules="rules.procurementDetailName"
											  label-width="124px"
											  :prop="'addApproveProcurementDetailDTOS.'+ index +'.procurementDetailName'">
									<el-input v-model.trim="item.procurementDetailName" placeholder="请输入名称"
											  class="input_type"></el-input>
								</el-form-item>
								<el-form-item label="规格:" prop="procurementDetailSpecification" label-width="124px"
											  :rules="rules.procurementDetailSpecification"
											  :prop="'addApproveProcurementDetailDTOS.'+ index +'.procurementDetailSpecification'">
									<el-input class="input_type" placeholder="请填写规格"
											  v-model.trim="item.procurementDetailSpecification"></el-input>
								</el-form-item>
								<el-form-item label="数量:" prop="procurementDetailNumber" label-width="124px"
											  :rules="rules.procurementDetailNumber"
											  :prop="'addApproveProcurementDetailDTOS.'+ index +'.procurementDetailNumber'">
									<el-input class="input_type" placeholder="请填写数量"
											  v-model.trim="item.procurementDetailNumber"
											  @change="moneyCalculate('caigou')"></el-input>
								</el-form-item>
								<el-form-item label="单位:" prop="procurementDetailUnit" label-width="124px"
											  :rules="rules.procurementDetailUnit"
											  :prop="'addApproveProcurementDetailDTOS.'+ index +'.procurementDetailUnit'">
									<el-input class="input_type" placeholder="请填写单位"
											  v-model.trim="item.procurementDetailUnit"></el-input>
								</el-form-item>
								<el-form-item label="价格:" prop="procurementDetailMoney" label-width="124px"
											  :rules="rules.procurementDetailSpecification"
											  :prop="'addApproveProcurementDetailDTOS.'+ index +'.procurementDetailMoney'">
									<el-input class="input_type" placeholder="请填写价格"
											  v-model.trim="item.procurementDetailMoney"
											  @change="moneyCalculate('caigou')"></el-input>
								</el-form-item>
							</div>
							<el-form-item label=""
										  :class="{'detail_css1':procurement.addApproveProcurementDetailDTOS.length>1}">
								<p class="addNone"></p>
								<p class="addEvectionDetail" @click="addEvectionDetail('caigou')">+增加采购明细</p>
							</el-form-item>
							<el-form-item label="总价格:" prop="procurementCollectMoney" label-width="124px">
								<el-input v-model="'￥'+procurement.procurementCollectMoney" disabled
										  class="input_type procurementCollectMoney"></el-input>
							</el-form-item>
							<el-form-item label="支付方式:" prop="procurementPayWay" label-width="124px">
								<el-input v-model.trim="procurement.procurementPayWay" class="input_type"></el-input>
							</el-form-item>
							<el-form-item label="备注:" prop="procurementRemark" label-width="124px">
								<el-input type="textarea" class="input_type" style="height: 104px"
										  placeholder="请填写备注"
										  v-model.trim="procurement.procurementRemark"></el-input>
							</el-form-item>
						</el-form>
						<!--通用审批-->
						<el-form :rules="rules" :model="common" ref="common" v-if="applyType==='2-0'">
							<el-form-item label="申请名称:" prop="commonName" label-width="124px">
								<el-input v-model.trim="common.commonName" class="input_type"
										  placeholder="请填写申请名称"></el-input>
							</el-form-item>
							<el-form-item label="申请内容:" prop="commonContent" label-width="124px">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写申请内容"
										  v-model.trim="common.commonContent"></el-input>
							</el-form-item>
						</el-form>
						<!--部门协作-->
						<el-form :rules="rules" :model="cooperation" ref="cooperation" v-if="applyType==='2-1'">
							<el-form-item label="协作事由:" prop="cooperationReason" :rules="rules.cooperationReason"
										  label-width="124px">
								<el-input v-model.trim="cooperation.cooperationReason" placeholder="请输入协作事由"
										  class="input_type"></el-input>
							</el-form-item>
							<el-form-item label="预期目标:" prop="cooperationExpectedGoal" label-width="124px"
										  :rules="rules.cooperationExpectedGoal">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写预期目标"
										  v-model.trim="cooperation.cooperationExpectedGoal"></el-input>
							</el-form-item>
							<el-form-item label="发起方:" prop="cooperationInitiator" :rules="rules.cooperationInitiator"
										  label-width="124px" class="procurementClass">
								<el-input v-model.trim="cooperation.cooperationInitiator" placeholder="请填写发起方"
										  class="input_type"></el-input>
							</el-form-item>
							<div
								:class="{'detail_css':cooperation.addApproveCooperationDetailDTOS.length>1,'detail_css_bottom':(cooperation.addApproveCooperationDetailDTOS.length-index>1)}"
								v-for="(item,index) in cooperation.addApproveCooperationDetailDTOS">
								<div class="detail_style clear">
									<p class="fl">协作明细({{index+1}})</p>
									<p class="fr delete_detail"
									   @click="cooperation.addApproveCooperationDetailDTOS.splice(cooperation.addApproveCooperationDetailDTOS.length-1,1)">
										-</p>
								</div>
								<el-form-item label="协作方:" prop="cooperationCollaboration"
											  :rules="rules.cooperationCollaboration"
											  label-width="124px"
											  :prop="'addApproveCooperationDetailDTOS.'+ index +'.cooperationCollaboration'">
									<el-input v-model.trim="item.cooperationCollaboration" placeholder="请填写协作方"
											  class="input_type"></el-input>
								</el-form-item>
								<el-form-item label="协作事项:" prop="cooperationMatter" :rules="rules.cooperationMatter"
											  label-width="124px"
											  :prop="'addApproveCooperationDetailDTOS.'+ index +'.cooperationMatter'">
									<el-input v-model.trim="item.cooperationMatter" placeholder="请填写协作事项"
											  class="input_type"></el-input>
								</el-form-item>
								<el-form-item label="完成日期:" prop="cooperationOverTime" label-width="124px"
											  :rules="rules.cooperationOverTime"
											  :prop="'addApproveCooperationDetailDTOS.'+ index +'.cooperationOverTime'">
									<el-date-picker
										v-model="item.cooperationOverTime"
										type="date"
										class="input_type"
										placeholder="选择日期"
										value-format="yyyy-MM-dd HH:mm:ss"
										format="yyyy-MM-dd">
									</el-date-picker>
								</el-form-item>
							</div>
							<el-form-item label=""
										  :class="{'detail_css1':apply.addApproveReimbursementDetailDTOS.length>1}">
								<p class="addNone"></p>
								<p class="addEvectionDetail" @click="addEvectionDetail('xiezuo')">+增加协作明细</p>
							</el-form-item>
							<el-form-item label="备注:" prop="cooperationRemark" label-width="124px">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写备注"
										  v-model.trim="cooperation.cooperationRemark"></el-input>
							</el-form-item>
						</el-form>
						<!--工作指示-->
						<el-form :rules="rules" :model="workInstruction" ref="workInstruction" v-if="applyType==='2-2'">
							<el-form-item label="工作事由:" prop="workReason" label-width="124px">
								<el-input v-model.trim="workInstruction.workReason" class="input_type"
										  placeholder="请填写工作事由"></el-input>
							</el-form-item>
							<el-form-item label="紧急程度:" prop="workEmergencyDegree" :rules="rules.workEmergencyDegree"
										  label-width="124px">
								<el-select placeholder="请选择紧急程度" class="input_type"
										   v-model="workInstruction.workEmergencyDegree">
									<el-option :label="item.name" :value="item.id"
											   v-for="item in workEmergencyDegreeType" :key="item.id"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="日期:" prop="workTime" label-width="124px" :rules="rules.workTime">
								<el-date-picker
									v-model="workInstruction.workTime"
									type="date"
									class="input_type"
									placeholder="选择日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="具体内容:" prop="workContent" label-width="124px"
										  :rules="rules.workContent">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写预期目标"
										  v-model.trim="workInstruction.workContent"></el-input>
							</el-form-item>
						</el-form>
						<!--立项申请-->
						<el-form :rules="rules" :model="projectBudget" ref="projectBudget" v-if="applyType==='2-3'">
							<el-form-item label="项目名称:" prop="projectName" :rules="rules.projectName"
										  label-width="124px">
								<el-input v-model.trim="projectBudget.projectName" placeholder="请输入项目名称"
										  class="input_type"></el-input>
							</el-form-item>
							<el-form-item label="项目概述:" prop="projectSynopsis" label-width="124px"
										  :rules="rules.projectSynopsis">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写项目概述"
										  v-model.trim="projectBudget.projectSynopsis"></el-input>
							</el-form-item>
							<el-form-item label="预期目标:" prop="projectTarget" label-width="124px"
										  :rules="rules.projectTarget">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写预期目标"
										  v-model.trim="projectBudget.projectTarget"></el-input>
							</el-form-item>
							<el-form-item label="期望启动日期:" prop="projectTime" label-width="124px"
										  :rules="rules.projectTime">
								<el-date-picker
									v-model="projectBudget.projectTime"
									type="date"
									class="input_type"
									placeholder="选择日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="人员需求:" prop="projectNumber" :rules="rules.projectNumber"
										  label-width="124px" class="procurementClass">
								<el-input v-model.trim="projectBudget.projectNumber" placeholder="请填写人员需求"
										  class="input_type"></el-input>
							</el-form-item>
							<div
								:class="{'detail_css':projectBudget.addApproveProjectDetailDTOS.length>1,'detail_css_bottom':(projectBudget.addApproveProjectDetailDTOS.length-index>1)}"
								v-for="(item,index) in projectBudget.addApproveProjectDetailDTOS">
								<div class="detail_style clear">
									<p class="fl">预算明细({{index+1}})</p>
									<p class="fr delete_detail"
									   @click="projectBudget.addApproveProjectDetailDTOS.splice(projectBudget.addApproveProjectDetailDTOS.length-1,1)">
										-</p>
								</div>
								<el-form-item label="预算内容:" prop="projectBudgetContent"
											  :rules="rules.projectBudgetContent"
											  label-width="124px"
											  :prop="'addApproveProjectDetailDTOS.'+ index +'.projectBudgetContent'">
									<el-input v-model.trim="item.projectBudgetContent" placeholder="请填写预算内容"
											  class="input_type"></el-input>
								</el-form-item>
								<el-form-item label="预算金额:" prop="projectBudgetMoney"
											  :rules="rules.projectBudgetMoney"
											  label-width="124px"
											  :prop="'addApproveProjectDetailDTOS.'+ index +'.projectBudgetMoney'">
									<el-input v-model.trim="item.projectBudgetMoney" placeholder="请填写预算金额"
											  class="input_type" @change="moneyCalculate('lixiang')"></el-input>
								</el-form-item>
							</div>
							<el-form-item label=""
										  :class="{'detail_css1':projectBudget.addApproveProjectDetailDTOS.length>1}">
								<p class="addNone"></p>
								<p class="addEvectionDetail" @click="addEvectionDetail('lixiang')">+增加预算明细</p>
							</el-form-item>
							<el-form-item label="总预算金额:" label-width="124px">
								<el-input v-model="'￥'+projectBudget.projectCollectMoney" disabled
										  class="input_type reimbursementCollectMoney"></el-input>
							</el-form-item>
							<el-form-item label="计划进度:" prop="projectDesignSchedule" label-width="124px">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写计划进度"
										  v-model.trim="projectBudget.projectDesignSchedule"></el-input>
							</el-form-item>
							<el-form-item label="备注:" prop="projectRemark" label-width="124px">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写备注"
										  v-model.trim="projectBudget.projectRemark"></el-input>
							</el-form-item>
						</el-form>
						<!--转正-->
						<el-form :rules="rules" :model="positive" ref="positive" v-if="applyType==='3-0'">
							<el-form-item label="申请人:" prop="positivePositiveTime" label-width="124px">
								<el-input v-model.trim="userDetail.employeeName" disabled
										  class="input_type"></el-input>
							</el-form-item>
							<el-form-item label="入职时间:" label-width="124px">
								<el-date-picker
									v-model="positive.positiveEntryTime"
									type="date"
									class="input_type"
									placeholder="选择时间"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="转正日期:" prop="positivePositiveTime" label-width="124px"
										  :rules="rules.positivePositiveTime">
								<el-date-picker
									v-model="positive.positivePositiveTime"
									type="date"
									class="input_type"
									placeholder="选择日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd"
									:picker-options="positivePositiveTime">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="职位:" label-width="124px" prop="positivePositionName"
										  :rules="rules.positivePositionName">
								<el-input v-model.trim="positive.positivePositionName" placeholder="请填写职位"
										  class="input_type"></el-input>
							</el-form-item>
							<el-form-item label="职级:" label-width="124px" prop="positivePositionRank"
										  :rules="rules.positivePositionRank">
								<el-input v-model.trim="positive.positivePositionRank" placeholder="请填写职级"
										  class="input_type"></el-input>
							</el-form-item>
							<el-form-item label="岗位理解:" prop="positivePostComprehend" label-width="124px"
										  :rules="rules.positivePostComprehend">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写岗位理解"
										  v-model.trim="positive.positivePostComprehend"></el-input>
							</el-form-item>
							<el-form-item label="工作总结:" prop="positiveWorkSummary" label-width="124px"
										  :rules="rules.positiveWorkSummary">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写工作总结"
										  v-model.trim="positive.positiveWorkSummary"></el-input>
							</el-form-item>
							<el-form-item label="意见和建议:" prop="positiveCompanyOpinion" label-width="124px"
										  :rules="rules.positiveCompanyOpinion">
								<el-input type="textarea" class="input_type" style="height: 104px"
										  placeholder="请填写意见和建议"
										  v-model.trim="positive.positiveCompanyOpinion"></el-input>
							</el-form-item>
						</el-form>
						<!--招聘-->
						<el-form :rules="rules" :model="recruitment" ref="recruitment" v-if="applyType==='3-1'">
							<el-form-item label="招聘部门:" prop="recruitmentDepartmentId" label-width="124px">
								<p class="sender" @click="departmentVisible = true">
									{{recruitment.recruitmentDepartmentName}}</p>
							</el-form-item>
							<el-form-item label="招聘职位:" label-width="124px" prop="recruitmentPosition"
										  :rules="rules.recruitmentPosition">
								<el-input v-model.trim="recruitment.recruitmentPosition" placeholder="请填写招聘职位"
										  class="input_type"></el-input>
							</el-form-item>
							<el-form-item label="需求人数:" label-width="124px" prop="recruitmentNumber"
										  :rules="rules.recruitmentNumber">
								<el-input v-model.trim="recruitment.recruitmentNumber" placeholder="请填写需求人数"
										  class="input_type" @change="reportTypeChange('zhaopin',recruitment.recruitmentNumber)"></el-input>
							</el-form-item>
							<el-form-item label="职责要求:" prop="recruitmentRequire" label-width="124px"
										  :rules="rules.recruitmentRequire">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写职责要求"
										  v-model.trim="recruitment.recruitmentRequire"></el-input>
							</el-form-item>
							<el-form-item label="期望到岗时间:" prop="recruitmentPositionTime" label-width="124px"
										  :rules="rules.recruitmentPositionTime">
								<el-date-picker
									v-model="recruitment.recruitmentPositionTime"
									type="date"
									class="input_type"
									placeholder="选择日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
						</el-form>
						<!--离职-->
						<el-form :rules="rules" :model="dimission" ref="dimission" v-if="applyType==='3-2'">
							<el-form-item label="离职时间:" prop="dimissionTime" label-width="124px"
										  :rules="rules.dimissionTime">
								<el-date-picker
									v-model="dimission.dimissionTime"
									type="date"
									class="input_type"
									placeholder="选择日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="交接人:" prop="dimissionHandoverId" label-width="124px">
								<p class="sender" @click="selectPerson('dimission')">
									{{dimission.dimissionHandoverName}}
									<img src="./images/per.png" alt=""></p>
							</el-form-item>
							<el-form-item label="离职原因:" prop="dimissionReason" label-width="124px"
										  :rules="rules.dimissionReason">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写离职原因"
										  v-model.trim="dimission.dimissionReason"></el-input>
							</el-form-item>
							<el-form-item label="工作交接:" prop="dimissionHandoverWork" label-width="124px"
										  :rules="rules.dimissionHandoverWork">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写工作交接"
										  v-model.trim="dimission.dimissionHandoverWork"></el-input>
							</el-form-item>
						</el-form>
						<!--用印-->
						<el-form :rules="rules" :model="sealApply" ref="sealApply" v-if="applyType==='4-0'">
							<el-form-item label="用印部门:" prop="sealDepartmentId" :rules="rules.sealDepartmentId" label-width="124px">
								<p class="sender" @click="departmentVisible = true">
									{{sealApply.sealDepartmentName}}</p>
							</el-form-item>
							<el-form-item label="经办人:" label-width="124px">
								<el-input v-model.trim="userDetail.employeeName" disabled
										  class="input_type"></el-input>
							</el-form-item>
							<el-form-item label="日期:" prop="sealTime" label-width="124px"
										  :rules="rules.sealTime">
								<el-date-picker
									v-model="sealApply.sealTime"
									type="date"
									class="input_type"
									placeholder="选择日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="用印文件名称:" label-width="124px" prop="sealFileName"
										  :rules="rules.sealFileName">
								<el-input v-model.trim="sealApply.sealFileName" placeholder="请填写用印文件名称"
										  class="input_type"></el-input>
							</el-form-item>
							<el-form-item label="文件分数:" label-width="124px" prop="sealFileNumber"
										  :rules="rules.sealFileNumber">
								<el-input v-model.trim="sealApply.sealFileNumber" placeholder="请输入文件分数"
										  class="input_type" @change="reportTypeChange('yongyin',sealApply.sealFileNumber,'sealFileNumber')"></el-input>
							</el-form-item>
							<el-form-item label="文件类别:" prop="sealType" :rules="rules.sealType"
										  label-width="124px">
								<el-select placeholder="请选择文件类别" class="input_type"
										   v-model="sealApply.sealType" @change="reportTypeChange('yongyin','sealType')">
									<el-option :label="item.name" :value="item.id"
											   v-for="item in fileTypeList" :key="item.id"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="加盖何种印章:" prop="sealFileType" :rules="rules.sealFileType"
										  label-width="124px">
								<el-select placeholder="请选择印章类型" class="input_type"
										   v-model="sealApply.sealFileType" @change="reportTypeChange('yongyin','sealFileType')">
									<el-option :label="item.name" :value="item.id"
											   v-for="item in sealFileTypeList" :key="item.id"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="备注:" prop="sealRemark" label-width="124px"
										  :rules="rules.sealRemark">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写备注"
										  v-model.trim="sealApply.sealRemark"></el-input>
							</el-form-item>
						</el-form>
						<!--备用金-->
						<el-form :rules="rules" :model="spareCash" ref="spareCash" v-if="applyType==='4-1'">
							<el-form-item label="申请部门:" prop="spareDepartmentId" label-width="124px">
								<p class="sender" @click="departmentVisible = true">
									{{spareCash.spareDepartmentName}}</p>
							</el-form-item>
							<el-form-item label="事由:" label-width="124px" prop="spareReason"
										  :rules="rules.spareReason">
								<el-input v-model.trim="spareCash.spareReason" placeholder="请填写事由"
										  class="input_type"></el-input>
							</el-form-item>
							<el-form-item label="申请金额:" label-width="124px" prop="spareMoney"
										  :rules="rules.spareMoney">
								<el-input v-model.trim="spareCash.spareMoney" placeholder="请填写申请金额"
										  class="input_type" @change="reportTypeChange('beiyongjin',spareCash.spareMoney)"></el-input>
							</el-form-item>
							<el-form-item label="使用日期:" prop="spareUseTime" label-width="124px"
										  :rules="rules.spareUseTime">
								<el-date-picker
									v-model="spareCash.spareUseTime"
									type="date"
									class="input_type"
									placeholder="选择日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="归还日期:" prop="spareReturnTime" label-width="124px"
										  :rules="rules.spareReturnTime">
								<el-date-picker
									v-model="spareCash.spareReturnTime"
									type="date"
									class="input_type"
									placeholder="选择日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd"
									:picker-options="spareReturnTime">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="出纳:" label-width="124px" prop="spareCashier"
										  :rules="rules.spareCashier">
								<el-input v-model.trim="spareCash.spareCashier" placeholder="请填写出纳"
										  class="input_type"></el-input>
							</el-form-item>
							<el-form-item label="备注:" prop="spareRemark" label-width="124px"
										  :rules="rules.spareRemark">
								<el-input type="textarea" class="input_type" style="height: 104px" placeholder="请填写备注"
										  v-model.trim="spareCash.spareRemark"></el-input>
							</el-form-item>
						</el-form>

						<UpLoad :type="1" @editParents="editParents" @afterFileList="afterFileList"
								:priewPhotoList="pictureList"
								v-if="(applyType !='0-3'&& applyType !='1-1'&& applyType !='2-2'&& applyType !='3-0'&& applyType !='3-1'&& applyType !='4-0'&& applyType !='4-1')"
								:isShow="isShow"></UpLoad>
						<UpLoad :type="2" @editParents="editParents" @afterFileList="afterFileList"
								:priewFileList="attachmentList" v-if="applyType ==='1-0'"
								:isShow="isShow"></UpLoad>
						<div style="margin-top: 14px;" class="send_box clear">
							<span class="fl send_name"><span class="mustFill">*</span>审批人:</span>
							<div class="clear fl" style="width: 76%;">
								<div v-for="(item,num) in approveList" class="clear fl approve_contentBox">
									<div class="clear fl" v-for="(res,index) in item">
										<div class="send_smallBox fl clear" v-if="res.employeeName || res.iconUrl">
											<p class="fl" style="border: none;">
												<img src="./images/icon_head.png" alt="" v-if="res.iconUrl===''">
												<img :src="res.iconUrl" alt="" v-else>
												<span class="del_file" @click="delPreson('approve',index,num)">×</span>
											</p>
											<div style="width: 44px;">{{res.employeeName}}</div>
										</div>
										<div class="send_add fl" style="margin-right: 20px;"
											 @click="selectPerson('approve',num,index)" v-else>+
										</div>
									</div>
									<p class="fl" style="line-height: 44px;margin-right: 10px;color:#BFC2CC;"
									   v-show="approveList.length>0">></p>
								</div>
								<div class="send_add fl" @click="selectPerson('approve')">+</div>
							</div>
						</div>
						<div class="send_box clear">
							<span class="fl send_name">抄送人:</span>
							<div class="clear fl" style="width: 76%;">
								<div class="send_smallBox fl clear" v-for="(item,index) in receiverList">
									<p class="fl" style="border: none;">
										<img src="./images/icon_head.png" alt="" v-if="item.iconUrl===''">
										<img :src="item.iconUrl" alt="" v-else>
										<span class="del_file" @click="delPreson('copy',index)">×</span>
									</p>
									<div style="width: 44px;">{{item.employeeName}}</div>
								</div>
								<div class="send_add fl" @click="selectPerson('copy')">+</div>
							</div>
						</div>
					</div>
					<div class="frame_footer clear">
						<p class="frame_footer_btn fr btn-right" @click="submitReport">提交</p>
						<p class="frame_footer_btn fr btn-left" @click="submitReport({isDraft:true,isClick:true})">
							存为草稿</p>
					</div>
				</div>
			</div>
		</div>
		<!--通讯录部门人员弹框-->
		<PersonDialog
			:treeData="personnelList"
			:defaultProps="{label:'name',children:'children'}"
			:transferTitle="['选择部门人员', '已选择']"
			:dialogVisible="personDialogVisible"
			:managers="managerList"
			@handlePersonClose="handlePersonClose"
			@handlePsrsonSubmit="handlePsrsonSubmit"></PersonDialog>
		<Popup :isShow="isShowPop" :contentText="warningText" @cancelFunc="cancelFunc"
			   :confirmFuncname="confirmFuncname" @confirmFunc="funcType"></Popup>
		<!-- 选择部门弹框 (单选)-->
		<department :treeData="departmentList"
					:dialogVisible="departmentVisible"
					@submit="handleDepartment"
					:editMember='selectedDepartment'
					@close="handleDepartmentClose"/>
	</div>
</template>

<script>
	import PersonDialog from '../../../commons/persondialog'
	import UpLoad from '../../../commons/upLoad'
	import Popup from '../../../commons/popups'
	import department from '../../mailList/publics/department'

	export default {
		name: "initiateApproval",
		components: {
			PersonDialog,
			UpLoad,
			Popup,
			department
		},
		data() {
			return {
				token: "/oaManager",
				userDetail: JSON.parse(sessionStorage.getItem("teamEmployeeDetailVO")),
				isShow: false,//右侧弹框
				isShowPop: false,//信息提示框
				warningText: "",
				confirmFuncname: "",
				approvalList: [
					{
						approvalName: "出勤请假",
						childrenList: [{
							name: "请假",
							src: require("./images/qingjia.png")
						}, {
							name: "出差",
							src: require("./images/chuchai.png")
						}, {
							name: "外出",
							src: require("./images/waichu.png")
						}, {
							name: "加班",
							src: require("./images/jiaban.png")
						}, {
							name: "补卡申请",
							src: require("./images/bukashenqing.png")
						}]
					},
					{
						approvalName: "财务审批",
						childrenList: [{
							name: "报销",
							src: require("./images/baoxiao.png")
						}, {
							name: "付款",
							src: require("./images/fukuan.png")
						}, {
							name: "采购",
							src: require("./images/caigou.png")
						}]
					},
					{
						approvalName: "通用审批",
						childrenList: [{
							name: "通用审批",
							src: require("./images/tongyonogshenpi.png")
						}, {
							name: "部门协作",
							src: require("./images/xiezuoxing.png")
						}, {
							name: "工作指示",
							src: require("./images/gongzuoqingshi.png")
						}, {
							name: "立项申请",
							src: require("./images/lixiangshenqing.png")
						}]
					},
					{
						approvalName: "人事审批",
						childrenList: [{
							name: "转正",
							src: require("./images/zhuanzheng.png")
						}, {
							name: "招聘",
							src: require("./images/zhaopin.png")
						}, {
							name: "离职",
							src: require("./images/lizhi.png")
						}]
					},
					{
						approvalName: "行政审批",
						childrenList: [{
							name: "用印申请",
							src: require("./images/yongyinshenqing.png")
						}, {
							name: "备用金申请",
							src: require("./images/beiyongjinshenqing.png")
						}]
					}
				],
				frameName: "",
				bigModel: 0,
				applyType: "0-0",//0-0是请假
				approveTypeList: [],//审批类型的下拉列表
				applyTypeList: [],//报销类型的下拉列表
				procurementList: [],//采购类型下拉列表
				isDateOrMinute: 0,//0 只能选择日期  1 半天   2 不支持分钟，时长只能是整数  3 支持分钟，时长可以是是小数
				isVerify: false,//表单校验用
				rules: { //表单校验规则
					//请假
					leaveType: [{required: true, message: '请选择请假类型', trigger: 'blur'}],
					leaveBeginTime: [{required: true, message: '请选择开始时间', trigger: 'blur'}],
					leaveEndTime: [{required: true, message: '请选择结束时间', trigger: 'blur'}],
					leaveBeginPmAm: [{required: true, message: '请选择开始时间区间', trigger: 'blur'}],
					leaveEndPmAm: [{required: true, message: '请选择结束时间区间', trigger: 'blur'}],
					leaveDays: [{required: true, message: '请输入请假时长', trigger: 'blur'}],
					leaveReason: [
						{required: true, message: '请填写请假事由', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}
					],
					//出差
					evectionBeginTime: [{required: true, message: '请选择开始时间', trigger: 'blur'}],
					evectionEndTime: [{required: true, message: '请选择结束时间', trigger: 'blur'}],
					evectionBeginPmAm: [{required: true, message: '请选择开始时间区间', trigger: 'blur'}],
					evectionEndPmAm: [{required: true, message: '请选择结束时间区间', trigger: 'blur'}],
					evectionDays: [{required: true, trigger: 'blur', message: '请输入出差天数',}],
					evectionReason: [{required: true, message: '请填写出差事由', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					evectionAddress: [  //出差地点
						{required: true, message: '请填写出差地点', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}
					],
					//外出
					goOutBeginTime: [{required: true, message: '请选择开始时间', trigger: 'blur'}],
					goOutEndTime: [{required: true, message: '请选择结束时间', trigger: 'blur'}],
					goOutHours: [{required: true, message: '请输入外出时长', trigger: 'blur'}],
					goOutReason: [{required: true, message: '请填写外出事由', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//加班
					overTimeBeginTime: [{required: true, message: '请选择开始时间', trigger: 'blur'}],
					overTimeEndTime: [{required: true, message: '请选择结束时间', trigger: 'blur'}],
					extraworkHours: [{required: true, message: '请输入加班时长', trigger: 'blur'}],
					extraworkReason: [{required: true, message: '请填写加班原因', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//补卡
					cardReissueDate: [{required: true, message: '请选择补卡日期', trigger: 'blur'}],
					cardReissueTime: [{required: true, message: '请选择补卡时间', trigger: 'blur'}],
					cardReissueReason: [{required: true, message: '请填写补卡原因', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//报销
					reimbursementMoney: [{required: true, message: '请输入报销金额', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20位', trigger: 'blur'}],
					reimbursementType: [{required: true, message: '请选择报销类别', trigger: 'blur'}],
					reimbursementDetail: [{required: true, message: '请填写费用明细', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//付款
					paymentReason:[{required: true, message: '请填写付款事由', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					paymentCollectMoney:[{required: true, message: '请输入付款总额', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20位', trigger: 'blur'}],
					paymentType:[{required: true, message: '请选择付款方式', trigger: 'blur'}],
					paymentTime:[{required: true, message: '请选择支付日期', trigger: 'blur'}],
					paymentPayObject:[{required: true, message: '请填写支付对象', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					paymentOpenBank:[{required: true, message: '请填写开户行', trigger: 'blur'},
						{min: 1, max: 30, message: '长度不能超过30个字符', trigger: 'blur'}],
					paymentBankAccount:[{required: true, message: '请填写银行账户', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					paymentRemark:[{required: false, message: '请填写备注', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//采购
					procurementApplyForReason: [{required: true, message: '请填写采购事由', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					procurementType: [{required: true, message: '请选择采购类型', trigger: 'blur'}],
					procurementDeliveryTime: [{required: true, message: '请选择期望交付日期', trigger: 'blur'}],
					procurementDetailName: [{required: true, message: '请填写名称', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					procurementDetailSpecification: [{required: true, message: '请填写规格', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					procurementDetailNumber: [{required: true, message: '请填写数量', trigger: 'blur'}],
					procurementDetailUnit: [{required: true, message: '请填写单位', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					procurementDetailMoney: [{required: true, message: '请填写价格', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20位', trigger: 'blur'}],
					procurementCollectMoney: [{required: true, message: '总价格为空', trigger: 'blur'}],
					procurementPayWay: [{required: false, trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					procurementRemark: [{required: false, trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//通用审批
					commonName: [{required: true, message: '请填写申请名称', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					commonContent: [{required: true, message: '请填写申请内容', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//部门协作
					cooperationReason: [{required: true, message: '请填写协作事由', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					cooperationExpectedGoal: [{required: true, trigger: 'blur', message: '请填写预期目标'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					cooperationInitiator: [{required: true, message: '请选择发起方', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					cooperationCollaboration: [{required: true, message: '请选择协作方', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					cooperationMatter: [{required: true, message: '请填写协作事项', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					cooperationOverTime: [{required: true, message: '请选择完成日期', trigger: 'blur'}],
					cooperationRemark: [{required: false, trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//工作指示
					workReason: [{required: true, message: '请填写工作事由', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					workEmergencyDegree: [{required: true, message: '请选择紧急程度', trigger: 'blur'}],
					workTime: [{required: true, message: '请选择完成日期', trigger: 'blur'}],
					workContent: [{required: true, message: '请填写具体内容', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//立项申请
					projectName: [{required: true, message: '请填写项目名称', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					projectSynopsis: [{required: true, message: '请填写项目概述', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					projectTarget: [{required: true, message: '请填写预期目标', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					projectTime: [{required: true, message: '请选择期望启动日期', trigger: 'blur'}],
					projectNumber: [{required: true, message: '请填写人员需求', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					projectBudgetContent: [{required: true, message: '请填写预算内容', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					projectBudgetMoney: [{required: true, message: '请填写预算金额', trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20位', trigger: 'blur'}],
					projectDesignSchedule: [{required: true, message: '请填写计划进度', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					projectRemark: [{required: false, trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//转正
					positivePositiveTime: [{required: true, message: '请选择转正日期', trigger: 'blur'}],
					positivePositionName: [{required: false, trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					positivePositionRank: [{required: false, trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					positivePostComprehend: [{required: false, trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					positiveWorkSummary: [{required: true, message: "请填写工作总结", trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					positiveCompanyOpinion: [{required: false, trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//招聘
					recruitmentDepartmentId: [{required: true, message: '请选择招聘部门', trigger: 'blur'}],
					recruitmentPosition: [{required: true, message: "请填写招聘职位", trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					recruitmentNumber: [{required: true, message: "请填写需求人数", trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20位', trigger: 'blur'}],
					recruitmentRequire: [{required: true, message: "请填写职责需求", trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					recruitmentPositionTime: [{required: true, message: '请选择期望到岗时间', trigger: 'blur'}],
					//离职
					dimissionTime: [{required: true, message: '请选择离职时间', trigger: 'blur'}],
					dimissionHandoverId: [{required: true, message: '请选择交接人', trigger: 'blur'}],
					dimissionReason: [{required: true, message: '请填写离职原因', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					dimissionHandoverWork: [{required: true, message: '请填写工作交接', trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//用印申请
					sealDepartmentId: [{required: true, message: '请选择用印部门', trigger: 'blur'}],
					sealTime:[{required: true, message: '请选择日期', trigger: 'blur'}],
					sealFileName:[{required: true, message: "请填写用印文件名称", trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					sealFileNumber:[{required: true, message: "请输入文件分数", trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20位', trigger: 'blur'}],
					sealType: [{required: true, message: '请选择文件类别', trigger: 'blur'}],
					sealFileType: [{required: true, message: '请选择印章类型', trigger: 'blur'}],
					sealRemark:[{required: false, message: "请填写备注", trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}],
					//备用金
					spareDepartmentId:[{required: true, message: '请选择申请部门', trigger: 'blur'}],
					spareReason:[{required: true, message: "请填写事由", trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur'}],
					spareMoney:[{required: true, message: "请输入申请金额", trigger: 'blur'},
						{min: 1, max: 20, message: '长度不能超过20位', trigger: 'blur'}],
					spareUseTime:[{required: true, message: '请选择使用日期', trigger: 'blur'}],
					spareReturnTime:[{required: true, message: '请选择归还日期', trigger: 'blur'}],
					spareCashier:[{required: true, message: '请填写出纳', trigger: 'blur'}],
					spareRemark:[{required: false, message: "请填写备注", trigger: 'blur'},
						{min: 1, max: 1000, message: '长度不能超过1000个字符', trigger: 'blur'}]
				},
				approveOrCopy: "approve",
				personDialogVisible: false,   //选择人员弹框的显示
				departmentVisible: false,   //选择部门弹框的显示
				managerListApprove: [], //审批通讯录列表使用
				managerListCopy: [],//抄送通讯录列表使用
				managerList: [],//通讯录缓存用
				selectedDepartment: {},//部门选择弹框（单选）缓存用
				personnelList: [],//通讯录人员列表
				departmentList: [],//部门信息列表
				leaveList: {  //请假
					leaveType: "",  //
					holidayUnitCode: "",
					leaveTypeName: "",  //
					leaveBeginTime: "",
					leaveEndTime: "",
					leaveBeginPmAm: "",
					leaveEndPmAm: "",
					leaveDays: "",//请假时长
					leaveReason: "",//请假事由
				},
				leaveTypeId: "",//切换请假类型时，根据此字段进行时间的清空
				leaveTime: "请假时长",//请假时长显示字段
				evection: { //出差
					approveEvectionDetailDTOS: [{
						evectionAddress: "",//出差地点
						evectionBeginTime: "",
						evectionEndTime: "",
						evectionBeginPmAm: "",
						evectionEndPmAm: ""
					}],
					evectionDays: "",//出差天数
					displayEvectionDays: "",//出差天数拼接单位
					evectionReason: ""//出差原因
				},
				goOut: {  //外出
					goOutBeginTime: "",
					goOutEndTime: "",
					goOutHours: "",
					goOutReason: ""
				},
				overTime: {//加班
					overTimeBeginTime: "",
					overTimeEndTime: "",
					extraworkHours: "",
					isStatutoryHoliday: "0",  //0非法定假日 1法定假日
					extraworkReason: ""
				},
				cardReissue: {//补卡
					cardReissueDate: "",   //补卡日期
					cardReissueTime: "",//补卡时间
					cardReissueReason: "",//不卡原因
				},
				apply: {//报销
					addApproveReimbursementDetailDTOS: [{
						reimbursementMoney: "",//金额
						reimbursementType: "",//报销类别id
						reimbursementTypeName: "",//报销类别名称
						reimbursementDetail: "",//费用明细 小数格式
					}],
					reimbursementCollectMoney: 0,//报销总金额 小数格式
					accessorysInfo: [],
				},
				payment:{//付款
					paymentReason:"",//付款事由
					paymentCollectMoney:"",//付款总额,number
					paymentType:"",//付款方式.number
					paymentTypeName:"",//付款方式名称
					paymentTime:"",//支付日期
					paymentPayObject:"",//支付对象
					paymentOpenBank:"",//开户行
					paymentBankAccount:"",//银行账户
					paymentRemark:""//备注
				},
				procurement: {//采购
					procurementApplyForReason: "",//申请事由
					procurementType: "",//采购类型id
					procurementTypeName: "",//采购类型名称
					procurementDeliveryTime: "",//期望交付日期
					addApproveProcurementDetailDTOS: [{ //采购明细
						procurementDetailName: "",//名称
						procurementDetailSpecification: "",//规格
						procurementDetailNumber: "",//数量
						procurementDetailUnit: "",//单位
						procurementDetailMoney: "",//价格
					}],
					procurementCollectMoney: 0,//总价格
					procurementPayWay: "",//支付方式
					procurementRemark: ""//备注
				},
				common: {//通用审批
					commonName: "",//申请名称
					commonContent: ""//申请内容
				},
				cooperation: {//部门协作
					cooperationReason: "",//协作事由
					cooperationExpectedGoal: "",//预期目标
					cooperationInitiator: "",//发起方
					addApproveCooperationDetailDTOS: [{
						cooperationCollaboration: "",//协作方
						cooperationMatter: "",//协作事项
						cooperationOverTime: "",//完成日期
					}],
					cooperationRemark: ""//备注
				},
				workInstruction: {//工作指示
					workReason: "",//工作事由
					workEmergencyDegree: "",//紧急程度id
					workTime: "",//日期
					workContent: ""//内容
				},
				projectBudget: {
					projectName: "",//项目名称
					projectSynopsis: "",//项目概述
					projectTarget: "",//预期目标
					projectTime: "",//期望启动日期
					projectNumber: "",//人员需求
					addApproveProjectDetailDTOS: [{
						projectBudgetContent: "",//预算内容
						projectBudgetMoney: ""//预算金额
					}],
					projectCollectMoney: 0,//总预算金额
					projectDesignSchedule: "",//计划进度
					projectRemark: ""//备注
				},
				dimission: {
					dimissionTime: "",//离职时间
					dimissionHandoverId: "",//交接人Id
					dimissionHandoverName: "点击选择交接人",//交接人姓名
					dimissionReason: "",//离职原因
					dimissionHandoverWork: ""//工作交接
				},
				managerListDimission: [],//审批-交接人
				positive: {//转正
					positiveEntryTime: "",//入职时间
					positivePositiveTime: "",//转正日期
					positivePositionName: "",//职位名称
					positivePositionRank: "",//职级
					positivePostComprehend: "",//岗位理解
					positiveWorkSummary: "",//工作总结
					positiveCompanyOpinion: ""//意见和建议
				},
				recruitment: {//招聘
					recruitmentDepartmentId: "",//招聘部门Id
					recruitmentDepartmentName: "点击选择部门",//招聘部门名称
					recruitmentPosition: "",//招聘职位
					recruitmentNumber: "",//需求人数
					recruitmentRequire: "",//职责需求
					recruitmentPositionTime: ""//期望到岗时间
				},
				sealApply:{//用印申请
					sealDepartmentId:"",//用印部门id
					sealDepartmentName:"点击选择部门",//用印部门名称
					sealTime:"",//日期
					sealFileName:"",//用印文件名称
					sealFileNumber:"",//文件分数
					sealType:"",//文件类别
					sealTypeName:"",//文件类别名称
					sealFileType:"",//加盖何种印章id
					sealFileTypeName:"",//加盖何种印章名称
					sealRemark:""//备注
				},
				spareCash:{//备用金申请
					spareDepartmentId:"",//申请部门id
					spareDepartmentName:"点击选择部门",//申请部门名称
					spareReason:"",//事由
					spareMoney:"",//申请金额
					spareUseTime:"",//使用日期
					spareReturnTime:"",//归还日期
					spareCashier:"",//出纳
					spareRemark:""//备注
				},
				approveName: "", //例：XXX的请假审批
				approveType: 0,  //审批类型id
				approvers: "",//审批人ids
				pictureList: [],//图片
				attachmentList: [],//附件
				isShow: false,  //该字段是附件上传时控制图片展示用的
				approveList: [],//审批人信息集合
				approvers: "",//审批人id
				receiverList: [],//抄送人信息集合
				recipients: [],//抄送人id
				noSwitch: "未获取到相应模块信息",
				isSelect: true,
				isClearData: true,//请假，清空数据后，watch中监听的字段不触发用
				isOneApproval: false,//审批人删除用
				isApprovalNum: 0,//审批人删除用
				isApprovalIndex: 0,//审批人删除用
				//工作指示模块的紧急成都下拉
				workEmergencyDegreeType: [{
					name: "请选择",
					id: 0
				}, {
					name: "紧急",
					id: 1
				}, {
					name: "普通",
					id: 2
				}, {
					name: "暂缓",
					id: 3
				},],
				//转正-转正日期要大于等于入职日期
				positivePositiveTime: {
					disabledDate: time => {
						if (this.positive.positiveEntryTime != '') {
							let entryTime = this.positive.positiveEntryTime;
							return time.getTime() < new Date(entryTime).getTime();
						} else {
							return "";
						}
					}
				},
				//备用金-归还日期应晚于使用日期
				spareReturnTime:{
					disabledDate: time => {
						if (this.spareCash.spareUseTime != '') {
							let endTime = this.spareCash.spareUseTime;
							return time.getTime() < new Date(endTime).getTime();
						} else {
							return "";
						}
					}
				},
				//付款-支付方式
				paymentTypeList:[{
					name:"请选择",
					id:0
				},{
					name:"支票",
					id:1
				},{
					name:"贷记",
					id:2
				},{
					name:"电汇",
					id:3
				},{
					name:"汇票",
					id:4
				},{
					name:"现金",
					id:5
				},{
					name:"银行卡",
					id:6
				},{
					name:"支付宝",
					id:7
				},{
					name:"微信",
					id:8
				},{
					name:"其他",
					id:9
				}],
				//用印-文件类别
				fileTypeList:[{
					name:"请选择",
					id:0
				},{
					name:"公告类",
					id:1
				},{
					name:"规章制度类",
					id:2
				},{
					name:"合同类",
					id:3
				}],
				//用印-印章类型
				sealFileTypeList:[{
					name:"请选择",
					id:0
				},{
					name:"公章",
					id:1
				},{
					name:"合同章",
					id:2
				},{
					name:"法人章",
					id:3
				},{
					name:"其他",
					id:4
				}]
			}
		},
		watch: {
			'leaveList.leaveType': {
				handler(value) {
					if (this.isClearData) {
						if (this.leaveTypeId != value) {
							this.leaveList.holidayUnitCode = "";
							this.leaveList.leaveTypeName = "";
							this.leaveList.leaveBeginTime = "";
							this.leaveList.leaveEndTime = "";
							this.leaveList.leaveBeginPmAm = "";
							this.leaveList.leaveEndPmAm = "";
							this.leaveList.leaveDays = "";
							this.leaveTypeId = value;
						}
						for (let i = 0; i < this.approveTypeList.length; i++) {
							if (value === this.approveTypeList[i].id) {
								this.leaveList.holidayUnitCode = this.approveTypeList[i].holidayUnitCode;
								if (this.approveTypeList[i].holidayUnitCode === "3001") {
									this.leaveTime = "请假时长(天):";
									this.isDateOrMinute = 0; //天
								} else if (this.approveTypeList[i].holidayUnitCode === "3002") {
									this.leaveTime = "请假时长(天):";
									this.isDateOrMinute = 1; //半天
								} else if (this.approveTypeList[i].holidayUnitCode === "3003") {
									this.leaveTime = "请假时长(小时):";
									this.isDateOrMinute = 2; //不支持分钟，时长只能是整数
								} else if (this.approveTypeList[i].holidayUnitCode === "3004") {
									this.leaveTime = "请假时长(小时):";
									this.isDateOrMinute = 3; //支持分钟，时长可以是是小数
								}
								this.leaveList.leaveTypeName = this.approveTypeList[i].holidayName;
							}
						}
					}
				},
				deep: true
			},
			'positive.positiveEntryTime': {
				handler() {
					if (this.positive.positiveEntryTime) {
						let time1 = this.positive.positiveEntryTime;
						let time2 = this.positive.positivePositiveTime;
						if (new Date(time1).getTime() > new Date(time2).getTime()) {
							this.positive.positivePositiveTime = "";
						}
					}
				},
				deep: false
			},
			'spareCash.spareUseTime':{
				handler() {
					if (this.spareCash.spareUseTime) {
						let time1 = this.spareCash.spareUseTime;
						let time2 = this.spareCash.spareReturnTime;
						if (new Date(time1).getTime() > new Date(time2).getTime()) {
							this.spareCash.spareReturnTime = "";
						}
					}
				},
				deep: false
			}
		},
		mounted() {
			//获取通讯录人员数据
			this.getPersonnelList();
		},
		methods: {
			//请假、报销和采购类型change
			reportTypeChange(type,value,index,isValidate){
				switch (type) {
					case 'qingjia':
						this.$refs.leaveList.clearValidate('leaveType');
						break;
					case 'baoxiao':
						if (isValidate === 'validate') {
							this.$refs.apply.clearValidate('addApproveReimbursementDetailDTOS.' + index + '.reimbursementType');
						}
						if (this.applyTypeList){
							for (let j = 0; j < this.applyTypeList.length; j++) {
								if (value === this.applyTypeList[j].id) {
									this.apply.addApproveReimbursementDetailDTOS[index].reimbursementTypeName = this.applyTypeList[j].dataName;
								}
							}
						}
						break;
					case 'fukuan':
						if(value==='paymentType'){
							for(let i=0;i<this.paymentTypeList.length;i++){
								if(this.payment.paymentType === this.paymentTypeList[i].id){
									this.payment.paymentTypeName = this.paymentTypeList[i].name;
								}
							}
							this.$refs.payment.clearValidate('paymentType');
						}else if(value==='paymentBankAccount'){
							// if(this.payment.paymentBankAccount){
							// 	if(!/^-[0-9]*[1-9][0-9]*$/.test(this.payment.paymentBankAccount)){
							// 		this.payment.paymentBankAccount = '';
							// 		this.$message.warning("银行账户请输入数字");
							// 	}else if(this.payment.paymentBankAccount.length!=16){
							// 		this.$message.warning("请输入正确的银行账户");
							// 		return;
							// 	}
							// }
						}
						break;
					case 'caigou':
						for (let i = 0; i < this.procurementList.length; i++) {
							if (value.toString() === this.procurementList[i].dataCode) {
								this.procurement.procurementTypeName = this.procurementList[i].dataName;
							}
						}
						this.$refs.procurement.clearValidate('procurementType');
						break;
					case 'zhaopin'://招聘-需求人数字段的校验
						if(!/^[0-9]*[1-9][0-9]*$/.test(value)){
							this.$message.warning("需求人数请填写正整数");
							this.recruitment.recruitmentNumber = "";
						}
						break;
					case 'yongyin'://用印-印章名称和文件类别名的赋值
						if(index==='sealFileNumber'){//文件分数为正整数
							if(!/^[0-9]*[1-9][0-9]*$/.test(value)){
								this.$message.warning("文件分数请输入正整数");
								this.sealApply.sealFileNumber = "";
							}
						}else if(value==='sealType'){//文件类别名
							for(let i=0;i<this.fileTypeList.length;i++){
								if(this.sealApply.sealType === this.fileTypeList[i].id){
									this.sealApply.sealTypeName = this.fileTypeList[i].name;
								}
							}
							this.$refs.sealApply.clearValidate('sealType');
						}else if(value==='sealFileType'){//印章名
							for(let i=0;i<this.sealFileTypeList.length;i++){
								if(this.sealApply.sealFileType === this.sealFileTypeList[i].id){
									this.sealApply.sealFileTypeName = this.sealFileTypeList[i].name;
								}
							}
							this.$refs.sealApply.clearValidate('sealFileType');
						}
						break;
					case 'beiyongjin':
						if(!/^\d+(\.\d{1,2})?$/.test(value)){
							this.$message.warning("申请金额请输入数字或最多两位小数");
							this.spareCash.spareMoney = "";
						}
						break;
					default:
						break;
				}
			},
			handleClose() {
				this.submitReport({isDraft: true});
			},
			//添加审批人和抄送人
			selectPerson(type, num, index) {
				if (type === 'approve') {//审批
					this.managerList = [];
					if (num >= 0 && index >= 0) {
						this.isOneApproval = true;
						this.isApprovalNum = num;
						this.isApprovalIndex = index;
					}
				} else if (type === 'copy') {//抄送
					if (this.receiverList) {
						//把草稿中的抄送人信息保存下来，在选择抄送人时默认展示使用
						let list = [];
						for (let i = 0; i < this.receiverList.length; i++) {
							list.push({
								employeeName: this.receiverList[i].employeeName,
								employeeId: this.receiverList[i].employeeId,
								department: this.receiverList[i].departmentName,
								iconUrl: this.receiverList[i].iconUrl
							});
						}
						this.managerList = list;
					} else if (this.managerListCopy && this.managerListCopy != []) {
						this.managerList = JSON.parse(JSON.stringify(this.managerListCopy));
					} else {
						this.managerList = [];
					}
				} else if (type === 'dimission') {//离职-交接人
					if (this.managerListDimission) {
						this.managerList = JSON.parse(JSON.stringify(this.managerListDimission));
					}
				}
				this.personDialogVisible = true;
				this.approveOrCopy = type;
			},
			//右上角关闭按钮
			closeFrame() {
				if (this.isCompile()) {
					this.isShowPop = true;
					this.warningText = "是否保存当前审批草稿";
					this.confirmFuncname = "submitReport";
				} else {//没有填数据或者只是选择了审批人和抄送人
					this.submitReport({isDraft: true, isClick: false});
				}
			},
			funcType(funcName) {
				this.isShowPop = false;
				if (funcName === '') return;   //表单校验
				if (funcName === 'submitReport') this.submitReport({isDraft: true});
			},
			cancelFunc() {
				this.isShowPop = false;
				this.isShow = false;
				this.clearData();
				this.clearValidate();
			},
			getFrame(index, index_children) {
				this.isShow = true;
				this.applyType = index + "-" + index_children;
				this.bigModel = index;
				//清空图片和附件列表
				this.pictureList = [];
				this.attachmentList = [];
				if (index === 0) {   //出勤请假
					switch (index_children) {
						case 0:
							this.frameName = "请假";
							this.approveType = 1565750481490059;
							this.isClearData = true;
							//获取请假类型
							this.getApproveType("leave_type", 1565750481490059);
							break;
						case 1:
							this.frameName = "出差";
							this.approveType = 1565750481620095;
							break;
						case 2:
							this.frameName = "外出";
							this.approveType = 1565750481980168;
							break;
						case 3:
							this.frameName = "加班";
							this.approveType = 1565750481460278;
							break;
						case 4:
							this.frameName = "补卡";
							this.approveType = 1565750481760200;
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				} else if (index === 1) {  //财务审批
					switch (index_children) {
						case 0:
							this.frameName = "报销";
							this.approveType = 1565750481670480;
							//获取报销类型
							this.getApproveType("reimbursement_type", 1565750481670480);
							break;
						case 1:
							this.frameName = "付款";
							this.approveType = 1565750481960533;
							break;
						case 2:
							this.frameName = "采购";
							this.approveType = 1565750481590522;
							//获取采购类型
							this.getApproveType("procurement_type", 1565750481590522);
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				} else if (index === 2) {  //通用审批
					switch (index_children) {
						case 0:
							this.frameName = "通用审批";
							this.approveType = 1565750481330619;
							break;
						case 1:
							this.frameName = "部门协作";
							this.approveType = 1565750481530628;
							break;
						case 2:
							this.frameName = "工作指示";
							this.approveType = 1565750481870652;
							break;
						case 3:
							this.frameName = "立项申请";
							this.approveType = 1565750481340734;
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				} else if (index === 3) {  //人事审批
					switch (index_children) {
						case 0:
							this.frameName = "转正";
							this.approveType = 1565750481870350;
							break;
						case 1:
							this.frameName = "招聘";
							this.approveType = 1565750481060454;
							//获取部门信息列表
							this.handleData();
							break;
						case 2:
							this.frameName = "离职";
							this.approveType = 1565750481030441;
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				} else if (index === 4) {  //行政审批
					//获取部门信息列表
					this.handleData();
					switch (index_children) {
						case 0:
							this.frameName = "用印";
							this.approveType = 1565750481790776;
							break;
						case 1:
							this.frameName = "备用金";
							this.approveType = 1565750481410817;
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				}
				if (this.isShow)
				//获取草稿
					this.getDraft();
			},
			//获取请假或报销类型或采购类型列表
			getApproveType(type, id) {
				let that = this;
				let url = "";
				if (type === "leave_type") {//请假
					url = "/oaManager/v1/feign/oa/attendance/holiday/queryHolidays/" + that.userDetail.companyId;
				} else if (type === "reimbursement_type" || type === "procurement_type") {//报销或采购
					url = "/baseManager/v1/base/feign/dataDictionary/getByDateTypeCode";
				}
				this.$http({
					method: "GET",
					url: url,
					params: {
						dataTypeCode: type
					}
				})
					.then(res => {
						if (res.data.code === 200) {
							if (type === "leave_type") {
								that.approveTypeList = res.data.data;
							} else if (type === "reimbursement_type") {
								that.applyTypeList = res.data.data;
							} else if (type === "procurement_type") {
								that.procurementList = res.data.data;
							}
						} else {
							if (type === "leave_type") {
								that.$message.error(res.data.message);
							}
							if (type === "reimbursement_type") {
								that.$message.error("获取报销类别失败");
							}
						}
					})
					.catch(error => {
						if (type === "leave_type")
							that.$message.error("获取请假列表失败");
						if (type === "reimbursement_type")
							that.$message.error("获取报销类别失败");
					});
			},
			//获取通讯录人员
			getPersonnelList() {
				let that = this;
				this.$http({
					method: 'POST',
					url: '/orgManager/v1/organization/department/queryAddressBook2',
					data: {
						companyId: JSON.parse(sessionStorage.getItem("teamEmployeeDetailVO")).companyId
					},
				}).then(res => {
					if (res.data.data)
						that.personnelList = res.data.data.children;
				}).catch(error => {
					console.log(error.message);
				});
			},
			// 选择部门人员弹框   关闭按钮
			handlePersonClose() {
				this.personDialogVisible = false;
			},
			//选择部门人员弹框   确定按钮
			handlePsrsonSubmit(target) {
				if (this.approveOrCopy === "approve") {   //审批人,多节点，所以多次选择时不需要清空上一次的数据
					if (this.approvers != "") {
						this.approvers += "|";
					}
					// this.managerListApprove = target; //this.managerListApprove是用来缓存通讯录人员的
					let list = [];
					if (target.length > 0) {
						if (this.isOneApproval) {//往审批人节点中添加人员时
							if (target.length > 1) {
								this.isOneApproval = false;
								this.$message.warning("只能选择一个部门人员");
								return;
							} else if (target.length = 1) {
								//对approvers的处理
								let lists = JSON.parse(JSON.stringify(this.approvers)).split("|");//转成数组
								let list1 = lists[this.isApprovalNum].split(",");
								for (let i = 0; i < list1.length; i++) {//添加大的人是否已存在
									if (list1[i]) {
										if (list1[i] === target[0].id.toString()) {
											this.$message.warning("同一节点不能添加重复人员");
											this.isOneApproval = false;
											return;
										}
									}
								}
								list1[this.isApprovalIndex] = target[0].id.toString();
								let newStr = list1.join(",");//转回字符串
								newStr = (newStr.substring(newStr.length - 1) == ',') ? newStr.substring(0, newStr.length - 1) : newStr;//去掉最后多余的,
								newStr = (newStr.substring(0, 1) == ',') ? newStr.substring(1) : newStr;//去掉开头的,
								lists[this.isApprovalNum] = newStr;

								this.approvers = lists.join("|");//转回字符串
								this.approvers = (this.approvers.substring(this.approvers.length - 1) == '|') ? this.approvers.substring(0, this.approvers.length - 1) : this.approvers;//去掉最后多余的|
								this.approvers = (this.approvers.substring(0, 1) == '|') ? this.approvers.substring(1) : this.approvers;//去掉开头的|
								//对本地图片处理
								this.$set(this.approveList[this.isApprovalNum], this.isApprovalIndex, {
									departmentId: target[0].departmentId,
									departmentName: target[0].parent,
									employeeJob: target[0].employeeJob,
									employeeId: target[0].id,
									employeeName: target[0].name,
									iconUrl: target[0].iconUrl
								});
								this.isOneApproval = false;
							}
						} else {
							for (let i = 0; i < target.length; i++) {
								list.push({
									employeeId: target[i].id,
									employeeName: target[i].name,
									iconUrl: target[i].iconUrl,
								});
								this.approvers += (target[i].id + ",");
							}
							this.approvers = (this.approvers.substring(this.approvers.length - 1) == ',') ? this.approvers.substring(0, this.approvers.length - 1) : this.approvers;//去掉最后多余的逗号
							this.approveList.push(list);
						}
					}
				} else if (this.approveOrCopy === "copy") {//抄送人
					this.receiverList = [];
					this.recipients = [];
					if (target.length > 0) {
						this.managerListCopy = target;
						for (let i = 0; i < target.length; i++) {
							this.receiverList.push({
								employeeId: target[i].id,
								employeeName: target[i].name,
								iconUrl: target[i].iconUrl,
							});
							this.recipients.push(target[i].id);
						}
					}
				} else if (this.approveOrCopy === "dimission") {//离职-交接人
					this.dimission.dimissionHandoverName = "点击选择交接人";
					this.dimission.dimissionHandoverId = "";
					if (target.length === 0) {
						this.managerListDimission = [];
					}
					if (target.length > 0) {
						if (target.length > 1) {
							this.$message.warning("交接人只能选择一人");
						} else {
							this.dimission.dimissionHandoverId = target[0].id;
							this.dimission.dimissionHandoverName = target[0].name;
							this.managerListDimission = [];
							this.managerListDimission.push({
								employeeId: target[0].id,
								employeeName: target[0].name,
								iconUrl: target[0].iconUrl,
							});
						}
					}
				}
				this.personDialogVisible = false;
			},
			// 选择部门弹框 (单选)  关闭按钮
			handleDepartmentClose() {
				this.departmentVisible = false
			},
			// 选择部门弹框 (单选) 确认按钮
			handleDepartment(value) {
				if(this.applyType==='3-1'){//招聘
					this.recruitment.recruitmentDepartmentName = value.departmentName;
					this.recruitment.recruitmentDepartmentId = value.id;
					this.$refs.recruitment.clearValidate('recruitmentDepartmentId');
				}else if(this.applyType==='4-0'){//用印
					this.sealApply.sealDepartmentId = value.id;
					this.sealApply.sealDepartmentName = value.departmentName;
					this.$refs.sealApply.clearValidate('sealDepartmentId');
				}else if(this.applyType==='4-1'){//备用金
					this.spareCash.spareDepartmentId = value.id;
					this.spareCash.spareDepartmentName = value.departmentName;
					this.$refs.spareCash.clearValidate('spareDepartmentId');
				}
				this.selectedDepartment = {
					departmentId:value.id,
					department:value.departmentName
				}
				this.departmentVisible = false;
			},
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
			//上传文件，又进行删除操作，修改了文件列表后的赋值
			afterFileList(type, afterFileList) {
				if (type === 1)//图片
					this.pictureList = afterFileList;
				else //附件
					this.attachmentList = afterFileList;

			},
			//删除审批人/抄送人
			delPreson(type, index, num) {
				if (type === 'approve') {//审批
					//对approvers的处理
					let list = JSON.parse(JSON.stringify(this.approvers)).split("|");//转成数组
					let list1 = list[num].split(",");
					list1[index] = "";//置空不删除，以防再次添加
					list[num] = list1.join(",");//转回字符串
					this.approvers = list.join("|");//转回字符串
					//对本地展示图片列表的处理
					if (this.approveList.length >= num) {
						if (this.approveList[num] && this.approveList[num].length >= index) {
							this.$set(this.approveList[num], index, {});
						}
					}
				} else if (type === 'copy') {
					if (this.receiverList.length >= index && this.recipients.length >= index) {
						this.recipients.splice(index, 1);
						this.receiverList.splice(index, 1);
					}

				}
			},
			//清理数据
			clearData() {
				this.isVerify = false;
				this.isShow = false;   //设置为true，让upLoad组件清空数据
				this.pictureList = [];  //图片
				this.attachmentList = [];  //附件
				this.approveList = [];//审批人信息集合
				this.approvers = "";
				this.receiverList = [];//抄送人信息集合
				this.recipients = [];
				this.isOneApproval = false;
				this.selectedDepartment = {};//部门信息缓存
				if (this.bigModel === 0) {
					switch (this.applyType) {
						case "0-0"://请假
							this.isClearData = false;
							this.leaveList = {  //请假
								leaveType: "",  //
								holidayUnitCode: "",
								leaveTypeName: "",  //
								leaveBeginTime: "",
								leaveEndTime: "",
								leaveBeginPmAm: "",
								leaveEndPmAm: "",
								leaveDays: "",//请假时长
								leaveReason: "",//请假事由
							};
							break;
						case "0-1"://出差
							this.evection = {
								approveEvectionDetailDTOS: [{
									evectionAddress: "",//出差地点
									evectionBeginTime: "",
									evectionEndTime: "",
									evectionBeginPmAm: "",
									evectionEndPmAm: ""
								}],
								evectionDays: "",//出差天数
								displayEvectionDays: "",
								evectionReason: ""//出差原因
							};
							break;
						case "0-2"://外出
							this.goOut = {  //外出
								goOutBeginTime: "",
								goOutEndTime: "",
								goOutHours: "",
								goOutReason: ""
							}
							break;
						case "0-3"://加班
							this.overTime = {//加班
								overTimeBeginTime: "",
								overTimeEndTime: "",
								extraworkHours: "",
								isStatutoryHoliday: "0",
								extraworkReason: ""
							};
							break;
						case "0-4"://补卡
							this.cardReissue = {//补卡
								cardReissueDate: "",   //补卡日期
								cardReissueTime: "",//补卡时间
								cardReissueReason: "",//不卡原因
							};
							break;
						default:
							this.$message.error("数据清理失败");
							break;
					}
				} else if (this.bigModel === 1) {
					switch (this.applyType) {
						case "1-0"://报销
							this.apply = {
								addApproveReimbursementDetailDTOS: [{
									reimbursementMoney: "",//金额
									reimbursementType: "",//报销类别id
									reimbursementDetail: ""//费用明细 小数格式
								}],
								reimbursementCollectMoney: 0,//报销总金额 小数格式
								accessorysInfo: []
							}
							break;
						case "1-1":
							this.payment = {//付款
								paymentReason:"",//付款事由
									paymentCollectMoney:"",//付款总额,number
									paymentType:"",//付款方式.number
									paymentTime:"",//支付日期
									paymentPayObject:"",//支付对象
									paymentOpenBank:"",//开户行
									paymentBankAccount:"",//银行账户
									paymentRemark:""//备注
							}
							break;
						case "1-2"://采购
							this.procurement = {
								procurementApplyForReason: "",//申请事由
								procurementType: "",//采购类型id
								procurementTypeName: "",//采购类型名称
								procurementDeliveryTime: "",//期望交付日期
								addApproveProcurementDetailDTOS: [{ //采购明细
									procurementDetailName: "",//名称
									procurementDetailSpecification: "",//规格
									procurementDetailNumber: "",//数量
									procurementDetailUnit: "",//单位
									procurementDetailMoney: "",//价格
								}],
								procurementCollectMoney: 0,//总价格
								procurementPayWay: "",//支付方式
								procurementRemark: ""//备注
							}
							break;
						default:
							this.$message.error("数据清理失败");
							break;
					}
				} else if (this.bigModel === 2) {
					switch (this.applyType) {
						case "2-0"://通用审批
							this.common = {
								commonName: "",
								commonContent: ""
							}
							break;
						case "2-1"://部门协作
							this.cooperation = {
								cooperationReason: "",//协作事由
								cooperationExpectedGoal: "",//预期目标
								cooperationInitiator: "",//发起方
								addApproveCooperationDetailDTOS: [{
									cooperationCollaboration: "",//协作方
									cooperationMatter: "",//协作事项
									cooperationOverTime: "",//完成日期
								}],
								cooperationRemark: ""//备注
							}
							break;
						case "2-2":
							this.workInstruction = {
								workReason: "",//工作事由
								workEmergencyDegree: "",//紧急程度id
								workTime: "",//日期
								workContent: ""//内容
							}
							break;
						case '2-3':
							this.projectBudget = {
								projectName: "",//项目名称
								projectSynopsis: "",//项目概述
								projectTarget: "",//预期目标
								projectTime: "",//期望启动日期
								projectNumber: "",//人员需求
								addApproveProjectDetailDTOS: [{
									projectBudgetContent: "",//预算内容
									projectBudgetMoney: ""//预算金额
								}],
								projectCollectMoney: 0,//总预算金额
								projectDesignSchedule: "",//计划进度
								projectRemark: ""//备注
							}
							break;
						default:
							this.$message.error("数据清理失败");
							break;
					}
				} else if (this.bigModel === 3) {
					switch (this.applyType) {
						case "3-0"://转正
							this.positive = {
								positiveEntryTime: "",//入职时间
								positivePositiveTime: "",//转正日期
								positivePositionName: "",//职位名称
								positivePositionRank: "",//职级
								positivePostComprehend: "",//岗位理解
								positiveWorkSummary: "",//工作总结
								positiveCompanyOpinion: ""//意见和建议
							}
							break;
						case "3-1":
							this.recruitment = {//招聘
								recruitmentDepartmentId: "",//招聘部门Id
								recruitmentDepartmentName: "点击选择部门",//招聘部门名称
								recruitmentPosition: "",//招聘职位
								recruitmentNumber: "",//需求人数
								recruitmentRequire: "",//职责需求
								recruitmentPositionTime: ""//期望到岗时间
							}
							break;
						case "3-2"://离职
							this.dimission = {
								dimissionTime: "",//离职时间
								dimissionHandoverId: "",//交接人Id
								dimissionHandoverName: "点击选择交接人",//交接人姓名
								dimissionReason: "",//离职原因
								dimissionHandoverWork: ""//工作交接
							}
							break;
						default:
							this.$message.error("数据清理失败");
							break;
					}
				}else if(this.bigModel===4){
					switch (this.applyType) {
						case "4-0"://用印
							this.sealApply = {//用印申请
								sealDepartmentId:"",//用印部门id
									sealDepartmentName:"点击选择部门",//用印部门名称
									sealTime:"",//日期
									sealFileName:"",//用印文件名称
									sealFileNumber:"",//文件分数
									sealType:"",//文件类别
									sealFileType:"",//加盖何种印章id
									sealFileTypeName:"",//加盖何种印章名称
									sealRemark:""//备注
							}
							break;
						case "4-1"://备用金
							this.spareCash = {
								spareDepartmentId:"",//申请部门id
								spareDepartmentName:"点击选择部门",//申请部门名称
								spareReason:"",//事由
								spareMoney:"",//申请金额
								spareUseTime:"",//使用日期
								spareReturnTime:"",//归还日期
								spareCashier:"",//出纳
								spareRemark:""//备注
							}
							break;
						default:
							this.$message.error("数据清理失败");
							break;
					}
				}
			},
			//提交审批（提交和保存草稿），默认是提交,点击存为草稿按钮时，isClick = true
			submitReport({isDraft = false, isClick = false}) {
				let that = this;
				let reportUrl = "";
				let reportData = {};
				if (that.bigModel === 0) {  //出勤请假
					switch (that.approveType) {
						case 1565750481490059:  //请假
							if (!isDraft) { //提交，须校验
								that.$refs.leaveList.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify && !isDraft) {
									reportUrl = "/v1/feign/oa/approve/saveLeave";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveLeaveDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveLeaveDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							if (!isDraft && that.leaveList.leaveDays <= 0) {
								that.$message.warning("请假时长应大于0");
								return;
							}
							let leaveDays = that.leaveList.leaveDays;
							let leaveDayString = ''
							that.isSelect = false;//防止计算时长时的变更
							//时间格式处理
							let leaveBeginTime = this.leaveList.leaveBeginTime;
							let leaveEndTime = this.leaveList.leaveEndTime;
							if (leaveBeginTime) {
								if (this.isDateOrMinute <= 1) {  //天/半天
									leaveBeginTime += " 00:00:00";
								} else if (this.isDateOrMinute === 2) {//时
									leaveBeginTime += ":00:00";
								} else if (this.isDateOrMinute === 3) {//时分
									leaveBeginTime += ":00";
								}
							}
							if (leaveEndTime) {
								if (this.isDateOrMinute <= 1) {  //天/半天
									leaveEndTime += " 00:00:00";
								} else if (this.isDateOrMinute === 2) {//时
									leaveEndTime += ":00:00";
								} else if (this.isDateOrMinute === 3) {//时分
									leaveEndTime += ":00";
								}
							}

							if ((that.isDateOrMinute === 0 || that.isDateOrMinute === 2) && !isDraft) {
								if (!/^[0-9]*[1-9][0-9]*$/.test(leaveDays)) {
									that.$message.error("请假时长请输入正整数");
									return;
								}
							} else {
								if (!/^\d+(\.\d{1,2})?$/.test(leaveDays) && !isDraft) {
									that.$message.error("请假时长最多两位小数");
									return;
								}
							}

							if (that.isDateOrMinute < 2) {
								leaveDayString = "天";
							} else {
								leaveDayString = "小时";
							}
							reportData = {
								leaveType: that.leaveList.leaveType,  //请假类型id
								holidayUnitCode: that.leaveList.holidayUnitCode,  //请假类型code
								leaveTypeName: that.leaveList.leaveTypeName,  //请假类型name
								beginTime: leaveBeginTime ? leaveBeginTime.slice(0, 19) : "",
								endTime: leaveEndTime ? leaveEndTime.slice(0, 19) : "",
								beginPmAm: that.leaveList.leaveBeginPmAm,//上午
								endPmAm: that.leaveList.leaveEndPmAm,//下午
								displayLeave: leaveDays.constructor === Number ? leaveDays + leaveDayString : Number(leaveDays) + leaveDayString,
								leaveDays: leaveDays.constructor === Number ? leaveDays : Number(leaveDays),
								leaveReason: that.leaveList.leaveReason,//请假事由
							};
							break;
						case 1565750481620095:  //出差
							if (!isDraft) { //提交，须校验
								that.$refs.evection.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveEvection";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveEvectionDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveEvectionDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							let approveEvectionDetailDTOS = [];
							for (let i = 0; i < that.evection.approveEvectionDetailDTOS.length; i++) {
								const beginTime = that.evection.approveEvectionDetailDTOS[i].evectionBeginTime;
								const endTime = that.evection.approveEvectionDetailDTOS[i].evectionEndTime;
								approveEvectionDetailDTOS.push({
									evectionAddress: that.evection.approveEvectionDetailDTOS[i].evectionAddress,//出差地点
									beginTime: beginTime ? (beginTime.length == 19 ? beginTime : (beginTime + " 00:00:00")) : "",
									endTime: endTime ? (endTime.length == 19 ? endTime : (endTime + " 00:00:00")) : "",
									beginPmAm: that.evection.approveEvectionDetailDTOS[i].evectionBeginPmAm,
									endPmAm: that.evection.approveEvectionDetailDTOS[i].evectionEndPmAm
								});
							}
							reportData = {
								approveEvectionDetailDTOS: approveEvectionDetailDTOS,
								evectionDays: that.evection.evectionDays,//出差天数
								displayEvectionDays: that.evection.displayEvectionDays,//出差天数
								evectionReason: that.evection.evectionReason,//出差事由
							};
							break;
						case 1565750481980168:  //外出
							if (!isDraft) { //提交，须校验
								that.$refs.goOut.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveGoOut";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveGoOutDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveGoOutDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							if (that.goOut.goOutHours) {
								if (!/^\d+(\.\d{1,2})?$/.test(that.goOut.goOutHours)) {
									this.$message.error("外出时长最多是两位两位小数");
									return;
								}
							}
							reportData = {
								beginTime: that.goOut.goOutBeginTime,
								endTime: that.goOut.goOutEndTime,
								displayGoOutHours: that.goOut.goOutHours + '小时',
								goOutHours: that.goOut.goOutHours,//外出时长
								goOutReason: that.goOut.goOutReason,//外出事由
							};
							break;
						case 1565750481460278://加班
							if (!isDraft) { //提交，须校验
								that.$refs.overTime.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveExtrawork";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveExtraworkDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveExtraworkDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							reportData = {
								beginTime: that.overTime.overTimeBeginTime,
								endTime: that.overTime.overTimeEndTime,
								extraworkHours: that.overTime.extraworkHours,
								displayExtraworkHours: that.overTime.extraworkHours + '小时',
								isStatutoryHoliday: parseInt(that.overTime.isStatutoryHoliday),
								extraworkReason: that.overTime.extraworkReason,
							};
							break;
						case 1565750481760200://补卡
							if (!isDraft) { //提交，须校验
								that.$refs.cardReissue.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveCardReissue";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveCardReissueDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveCardReissueDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							reportData = that.cardReissue;
							break;
						default:
							that.$message.error(that.noSwitch);
							break;
					}
				} else if (that.bigModel === 1) {//财务审批
					switch (that.approveType) {
						case 1565750481670480://报销
							if (!isDraft) { //提交，须校验
								that.$refs.apply.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveReimbursement";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveReimbursementDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveReimbursementDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							if (that.attachmentList) {
								that.apply.accessorysInfo = that.attachmentList;
							}
							// for(let i=0;i<that.apply.addApproveReimbursementDetailDTOS.length;i++){
							// 	if(that.apply.addApproveReimbursementDetailDTOS[i].reimbursementMoney)
							// 	that.apply.addApproveReimbursementDetailDTOS[i].reimbursementMoney = Number(that.apply.addApproveReimbursementDetailDTOS[i].reimbursementMoney);
							// }
							reportData = that.apply;
							break;
						case 1565750481960533://付款
							if (!isDraft) { //提交，须校验
								that.$refs.payment.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/savePayment";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/savePaymentDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/savePaymentDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							if(!isClick){//点击存为草稿按钮时不把string转换为number
								if(that.payment.paymentCollectMoney)
								that.payment.paymentCollectMoney = Number(that.payment.paymentCollectMoney);
							}
							reportData = that.payment;
							break;
						case 1565750481590522://采购
							if (!isDraft) { //提交，须校验
								that.$refs.procurement.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveProcurement";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveProcurementDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveProcurementDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							if (!/^\d+(\.\d{1,2})?$/.test(that.procurement.procurementCollectMoney)) {
								that.$message.error("总价格最多两位小数");
								return;
							}

							reportData = that.procurement;
							break;
						default:
							that.$message.error(that.noSwitch);
							break;
					}
				} else if (that.bigModel === 2) {
					switch (that.approveType) {
						case 1565750481330619://通用审批
							if (!isDraft) { //提交，须校验
								that.$refs.common.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveCommon";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveCommonDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveCommonDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							reportData = that.common;
							break;
						case 1565750481530628://部门协作
							if (!isDraft) { //提交，须校验
								that.$refs.cooperation.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveCooperation";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveCooperationDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveCooperationDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							reportData = that.cooperation;
							break;
						case 1565750481870652://工作指示
							if (!isDraft) { //提交，须校验
								that.$refs.workInstruction.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveWork";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveWorkDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveWorkDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							reportData = that.workInstruction;
							break;
						case 1565750481340734://立项申请
							if (!isDraft) { //提交，须校验
								that.$refs.projectBudget.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveProject";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveProjectDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveProjectDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							if(!isClick){//点击存为草稿按钮时不把string转换为number
								if(that.projectBudget.addApproveProjectDetailDTOS){
									for(let x= 0;x<that.projectBudget.addApproveProjectDetailDTOS.length;x++){
										if(that.projectBudget.addApproveProjectDetailDTOS[x].projectBudgetMoney){
											that.projectBudget.addApproveProjectDetailDTOS[x].projectBudgetMoney = Number(that.projectBudget.addApproveProjectDetailDTOS[x].projectBudgetMoney);
										}
									}
								}
							}
							reportData = that.projectBudget;
							break;
						default:
							that.$message.error(that.noSwitch);
							break;
					}
				} else if (that.bigModel === 3) {
					switch (that.approveType) {
						case 1565750481870350://转正
							if (!isDraft) { //提交，须校验
								that.$refs.positive.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/savePositive";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/savePositiveDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/savePositiveDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							reportData = that.positive;
							break;
						case 1565750481060454://招聘
							if (!isDraft) { //提交，须校验
								that.$refs.recruitment.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveRecruitment";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveRecruitmentDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveRecruitmentDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							// if(that.recruitment.recruitmentNumber){
							// 	that.recruitment.recruitmentNumber = Number(that.recruitment.recruitmentNumber);
							// }
							reportData = that.recruitment;
							break;
						case 1565750481030441://离职
							if (!isDraft) { //提交，须校验
								that.$refs.dimission.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveDimission";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveDimissionDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveDimissionDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							reportData = that.dimission;
							break;
						default:
							that.$message.error(that.noSwitch);
							break;
					}
				}else if(that.bigModel === 4){
					switch (that.approveType) {
						case 1565750481790776://用印
							if (!isDraft) { //提交，须校验
								that.$refs.sealApply.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveSeal";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveSealDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveSealDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							reportData = that.sealApply;
							break;
						case 1565750481410817://备用金
							if (!isDraft) { //提交，须校验
								that.$refs.spareCash.validate((valid) => {
									if (valid) {
										that.isVerify = true;
									}
								});
								if (that.isVerify) {
									reportUrl = "/v1/feign/oa/approve/saveSpare";
								} else {
									return;
								}
							} else if (isDraft && isClick) {  //草稿，点击存为草稿按钮，进行信息校验
								if (that.isCompile()) {
									reportUrl = "/v1/feign/oa/approve/saveSpareDraft";
								} else {
									that.$message.warning("请填写信息");
									return;
								}
							} else if (!isClick && (that.isCompile() || that.isApprovlAndCopy())) { //草稿，点击遮罩，信息填写了或选审批人和抄送人了
								reportUrl = "/v1/feign/oa/approve/saveSpareDraft";
							} else {
								that.isShow = false;
								that.clearValidate();
								return;
							}
							if(!isClick){//点击存为草稿按钮时不把string转换为number
								if(that.spareCash.spareMoney)
									that.spareCash.spareMoney = Number(that.spareCash.spareMoney);
							}
							reportData = that.spareCash;
							break;
						default:
							that.$message.error(that.noSwitch);
							break;
					}
				}
				//提交时，校验未通过
				if (!isDraft && !that.isVerify)
					return;

				//提交时，审批人为空，表单校验通过了
				if (!isDraft && that.approvers === "" && that.isVerify) {
					that.$message.warning("请选择审批人");
					return;
				}
				//处理审批人字符串
				let str = JSON.parse(JSON.stringify(this.approvers)).split("|");//转成数组
				for (let a = 0; a < str.length; a++) {
					if (str[a] == "") {
						str.splice(a, 1);
					} else {
						let str1 = str[a].split(",");
						for (let b = str1.length - 1; b >= 0; b--) {//添加的人是否已存在
							if (str1[b] == "") {
								str1.splice(b, 1);
							}
						}
						str[a] = str1.join(",");//转成字符串
						str[a] = (str[a].substring(str[a].length - 1) == ',') ? str[a].substring(0, str[a].length - 1) : str[a];//去掉最后多余的,
						str[a] = (str[a].substring(0, 1) == ',') ? str[a].substring(1) : str[a];//去掉开头的,
					}
				}
				str = str.join("|");
				str = (str.substring(str.length - 1) == '|') ? str.substring(0, str.length - 1) : str;//去掉最后多余的|
				str = (str.substring(0, 1) == '|') ? str.substring(1) : str;//去掉开头的|
				that.approvers = str;
				//公共部分
				reportData["approveName"] = that.userDetail.employeeName + "的" + this.frameName;  //审批名称[XXX的请假审批]
				reportData["approveType"] = that.approveType; //审批类型id
				reportData["imagesInfo"] = that.pictureList.length === 0 ? null : that.pictureList;//图片组
				reportData["approvers"] = that.approvers;//审批人ids
				reportData["recipients"] = that.recipients;//抄送人id组
				reportData["companyId"] = that.userDetail.companyId;//部门Id
				reportData["departmentId"] = that.userDetail.departmentId;//部门Id
				reportData["createBy"] = that.userDetail.employeeId;//用户Id
				if (reportUrl != "") {
					this.$http({
						method: "POST",
						url: this.token + reportUrl,
						data: reportData
					})
						.then(res => {
							that.isVerify = false;
							if (res.data.code === 200) {
								if (isDraft) {
									that.$message.success("保存草稿成功");
								} else {
									that.$message.success("您的" + this.frameName + "申请已成功提交");
									let obj = {
										userId: that.userDetail.employeeId,
										approveTypeId: that.approveType,
										approveChildrenId: res.data.data
									}
									that.handleApprvolDetial(obj);
								}
								if (!isClick) {
									that.isShow = false;
									that.clearData();
									that.clearValidate();
								}
							} else {
								if (isDraft) {
									that.$message.error("保存草稿失败");
								} else {
									that.$message.error("您的" + this.frameName + "申请提交失败");
								}

							}
						})
						.catch(error => {
							that.$message.error("保存失败");
						});
				} else {
					that.isShow = false;
					that.clearValidate();
				}
			},
			//获取草稿
			getDraft() {
				let that = this;
				this.$http({
					method: "GET",
					url: this.token + "/v1/feign/oa/approve/queryDraft/" + that.approveType + "/" + that.userDetail.employeeId,
				})
					.then(res => {
						if (res.data.code === 200) {
							let data = res.data.data;
							if (!data) {//草稿中没有数据时，获取上次提交审批时的审批人与抄送人信息
								that.getBeforeUserInfo();
							} else {
								//图片
								if (data.imagesInfo) {
									that.pictureList = data.imagesInfo;
								}
								//审批人
								if (data.nodeApprovesInfoVos && data.approvers) {
									that.approvers = data.approvers;
									const num = data.approvers.split("|").length;//节点数
									that.approveList = [];
									for (let i = 0; i < num; i++) {
										if (data.nodeApprovesInfoVos[i]) {
											if (data.nodeApprovesInfoVos[i].approvesInfo) {
												that.approveList.push(data.nodeApprovesInfoVos[i].approvesInfo);
											}
										}
									}
								}
								//抄送人
								if (data.recipients && data.recipientsInfo) {
									that.receiverList = [];
									that.recipients = data.recipients;
									that.receiverList = data.recipientsInfo;
									//把草稿中的抄送人信息保存下来，在选择抄送人时默认展示使用
									let list = [];
									for (let i = 0; i < that.receiverList.length; i++) {
										list.push({
											employeeName: that.receiverList[i].employeeName,
											employeeId: that.receiverList[i].employeeId,
											department: that.receiverList[i].departmentName
										});
									}
									this.managerListCopy = list;
								}
								//各模块信息
								if (that.bigModel === 0) {
									switch (that.approveType) {
										case 1565750481490059:  //请假
											if (data.holidayUnitCode) {
												if (data.holidayUnitCode === "3001")
													that.isDateOrMinute = 0;
												else if (data.holidayUnitCode === "3002")
													that.isDateOrMinute = 1;
												else if (data.holidayUnitCode === "3003")
													that.isDateOrMinute = 2;
												else (data.holidayUnitCode === "3004")
												that.isDateOrMinute = 3;
											}
											// if (data.leaveDays.indexOf("天") > -1) {
											// 	data.leaveDays = data.leaveDays.slice(0, -1);
											// } else if (data.leaveDays.indexOf("小时") > -1) {
											// 	data.leaveDays = data.leaveDays.slice(0, -2);
											// }

											that.leaveTypeId = data.leaveType;
											that.leaveList.leaveType = data.leaveType;
											that.leaveList.holidayUnitCode = data.holidayUnitCode;
											that.leaveList.leaveTypeName = data.leaveTypeName;
											that.leaveList.leaveBeginTime = data.beginTime;
											that.leaveList.leaveEndTime = data.endTime;
											that.leaveList.leaveBeginPmAm = data.beginPmAm;
											that.leaveList.leaveEndPmAm = data.endPmAm;
											that.leaveList.leaveDays = data.leaveDays;
											that.leaveList.leaveReason = data.leaveReason;
											break;
										case 1565750481620095:  //出差
											let approveEvectionDetailDTOS = [];
											if (data.approveEvectionDetailDTOS) {
												for (let i = 0; i < data.approveEvectionDetailDTOS.length; i++) {
													approveEvectionDetailDTOS.push({
														evectionAddress: data.approveEvectionDetailDTOS[i].evectionAddress,//出差地点
														evectionBeginTime: data.approveEvectionDetailDTOS[i].beginTime,
														evectionEndTime: data.approveEvectionDetailDTOS[i].endTime,
														evectionBeginPmAm: data.approveEvectionDetailDTOS[i].beginPmAm,
														evectionEndPmAm: data.approveEvectionDetailDTOS[i].endPmAm
													});
												}
											}
											that.evection.approveEvectionDetailDTOS = approveEvectionDetailDTOS;
											that.evection.evectionDays = data.evectionDays;
											that.evection.displayEvectionDays = data.displayEvectionDays;
											that.evection.evectionReason = data.evectionReason;
											break;
										case 1565750481980168:  //外出
											that.goOut.goOutBeginTime = data.beginTime;
											that.goOut.goOutEndTime = data.endTime;
											that.goOut.goOutHours = data.goOutHours;
											that.goOut.goOutReason = data.goOutReason;
											break;
										case 1565750481460278:  //加班
											that.overTime.overTimeBeginTime = data.beginTime;
											that.overTime.overTimeEndTime = data.endTime;
											that.overTime.extraworkHours = data.extraworkHours;
											that.overTime.isStatutoryHoliday = data.isStatutoryHoliday ? data.isStatutoryHoliday.toString() : "";
											that.overTime.extraworkReason = data.extraworkReason;
											break;
										case 1565750481760200://补卡
											that.cardReissue.cardReissueDate = data.cardReissueDate;
											that.cardReissue.cardReissueTime = data.cardReissueTime;
											that.cardReissue.cardReissueReason = data.cardReissueReason;
											break;
										default:
											that.$message.error(that.noSwitch);
											break;
									}
								} else if (that.bigModel === 1) {
									switch (that.approveType) {
										case 1565750481670480://报销
											that.apply.addApproveReimbursementDetailDTOS = data.addApproveReimbursementDetailDTOS;
											for(let i=0;i<that.apply.addApproveReimbursementDetailDTOS.length;i++){
												if(that.apply.addApproveReimbursementDetailDTOS[i].reimbursementMoney)
												that.apply.addApproveReimbursementDetailDTOS[i].reimbursementMoney = that.apply.addApproveReimbursementDetailDTOS[i].reimbursementMoney.toString();
											}
											that.apply.reimbursementCollectMoney = data.reimbursementCollectMoney;
											that.apply.accessorysInfo = data.accessorysInfo;
											that.attachmentList = data.accessorysInfo;
											break;
										case 1565750481960533://付款
											that.payment.paymentReason = data.paymentReason;
											that.payment.paymentCollectMoney = data.paymentCollectMoney?data.paymentCollectMoney.toString():"";
											that.payment.paymentType = data.paymentType;
											that.payment.paymentTime = data.paymentTime;
											that.payment.paymentPayObject = data.paymentPayObject;
											that.payment.paymentOpenBank = data.paymentOpenBank;
											that.payment.paymentBankAccount = data.paymentBankAccount;
											that.payment.paymentRemark = data.paymentRemark;
											break;
										case 1565750481590522://采购
											that.procurement.procurementApplyForReason = data.procurementApplyForReason;
											that.procurement.procurementType = data.procurementType;
											that.procurement.procurementTypeName = data.procurementTypeName;
											that.procurement.procurementDeliveryTime = data.procurementDeliveryTime;
											that.procurement.addApproveProcurementDetailDTOS = data.addApproveProcurementDetailDTOS;
											that.procurement.procurementCollectMoney = data.procurementCollectMoney;
											that.procurement.procurementPayWay = data.procurementPayWay;
											that.procurement.procurementRemark = data.procurementRemark;
											break;
										default:
											that.$message.error(that.noSwitch);
											break;
									}
								} else if (that.bigModel === 2) {
									switch (that.approveType) {
										case 1565750481330619://通用审批
											that.common.commonName = data.commonName;
											that.common.commonContent = data.commonContent;
											break;
										case 1565750481530628://部门协作
											that.cooperation.cooperationReason = data.cooperationReason;
											that.cooperation.cooperationExpectedGoal = data.cooperationExpectedGoal;
											that.cooperation.cooperationInitiator = data.cooperationInitiator;
											that.cooperation.cooperationRemark = data.cooperationRemark;
											that.cooperation.addApproveCooperationDetailDTOS = data.addApproveCooperationDetailDTOS;
											break;
										case 1565750481870652://工作指示
											that.workInstruction.workReason = data.workReason;
											that.workInstruction.workEmergencyDegree = data.workEmergencyDegree;
											that.workInstruction.workTime = data.workTime;
											that.workInstruction.workContent = data.workContent;
											break;
										case 1565750481340734://立项申请
											that.projectBudget.projectName = data.projectName;
											that.projectBudget.projectSynopsis = data.projectSynopsis;
											that.projectBudget.projectTarget = data.projectTarget;
											that.projectBudget.projectTime = data.projectTime;
											that.projectBudget.projectNumber = data.projectNumber;
											that.projectBudget.projectCollectMoney = data.projectCollectMoney;
											that.projectBudget.projectDesignSchedule = data.projectDesignSchedule;
											that.projectBudget.projectRemark = data.projectRemark;
											that.projectBudget.addApproveProjectDetailDTOS = data.addApproveProjectDetailDTOS;
											if(that.projectBudget.addApproveProjectDetailDTOS){
												for(let x= 0;x<that.projectBudget.addApproveProjectDetailDTOS.length;x++){
													if(that.projectBudget.addApproveProjectDetailDTOS[x].projectBudgetMoney){
														that.projectBudget.addApproveProjectDetailDTOS[x].projectBudgetMoney = that.projectBudget.addApproveProjectDetailDTOS[x].projectBudgetMoney.toString();
													}
												}
											}
											break;
										default:
											that.$message.error(that.noSwitch);
											break;
									}
								} else if (that.bigModel === 3) {
									switch (that.approveType) {
										case 1565750481870350://转正
											that.positive.positiveEntryTime = data.positiveEntryTime;
											that.positive.positivePositiveTime = data.positivePositiveTime;
											that.positive.positivePositionName = data.positivePositionName;
											that.positive.positivePositionRank = data.positivePositionRank;
											that.positive.positivePostComprehend = data.positivePostComprehend;
											that.positive.positiveWorkSummary = data.positiveWorkSummary;
											that.positive.positiveCompanyOpinion = data.positiveCompanyOpinion;
											if (!that.positive.positiveEntryTime) {
												that.getRntryDate();
											}
											break;
										case 1565750481060454://招聘
											that.recruitment.recruitmentDepartmentId = data.recruitmentDepartmentId;
											that.recruitment.recruitmentDepartmentName = data.recruitmentDepartmentName;
											that.recruitment.recruitmentPosition = data.recruitmentPosition;
											that.recruitment.recruitmentNumber = data.recruitmentNumber?data.recruitmentNumber.toString():"";
											that.recruitment.recruitmentRequire = data.recruitmentRequire;
											that.recruitment.recruitmentPositionTime = data.recruitmentPositionTime;
											that.selectedDepartment = {
												departmentId:data.recruitmentDepartmentId,
												department:data.recruitmentDepartmentName
											}
											break;
										case 1565750481030441://离职
											that.dimission.dimissionTime = data.dimissionTime;
											that.dimission.dimissionHandoverId = data.dimissionHandoverId ? data.dimissionHandoverId : "";
											that.dimission.dimissionHandoverName = data.dimissionHandoverName;
											that.dimission.dimissionReason = data.dimissionReason;
											that.dimission.dimissionHandoverWork = data.dimissionHandoverWork;
											if (data.dimissionHandoverName && data.dimissionHandoverId) {
												that.managerListDimission = [];
												that.managerListDimission.push({
													employeeId: data.dimissionHandoverId,
													employeeName: data.dimissionHandoverName,
													iconUrl: "",
												});
											}
											break;
										default:
											that.$message.error(that.noSwitch);
											break;
									}
								}else if(that.bigModel === 4){
									switch (that.approveType) {
										case 1565750481790776://用印
											that.sealApply.sealDepartmentId = data.sealDepartmentId;
											that.sealApply.sealDepartmentName = data.sealDepartmentName;
											that.sealApply.sealTime = data.sealTime;
											that.sealApply.sealFileName = data.sealFileName;
											that.sealApply.sealFileNumber = data.sealFileNumber;
											that.sealApply.sealType = data.sealType;
											that.sealApply.sealTypeName = data.sealTypeName;
											that.sealApply.sealFileType = data.sealFileType;
											that.sealApply.sealFileTypeName = data.sealFileTypeName;
											that.sealApply.sealRemark = data.sealRemark;
											that.selectedDepartment = {
												departmentId:data.sealDepartmentId,
												department:data.sealDepartmentName
											}
											break;
										case 1565750481410817://备用金
											that.spareCash.spareDepartmentId = data.spareDepartmentId;
											that.spareCash.spareDepartmentName = data.spareDepartmentName;
											that.spareCash.spareReason = data.spareReason;
											that.spareCash.spareMoney = data.spareMoney?data.spareMoney.toString():"";
											that.spareCash.spareUseTime = data.spareUseTime;
											that.spareCash.spareReturnTime = data.spareReturnTime;
											that.spareCash.spareCashier = data.spareCashier;
											that.spareCash.spareRemark = data.spareRemark;
											that.selectedDepartment = {
												departmentId:data.spareDepartmentId,
												department:data.spareDepartmentName
											}
											break;
										default:
											that.$message.error(that.noSwitch);
											break;
									}
								}
								// that.$message.success("已引用草稿");
							}
						} else if (res.data.code === -1) {
							if (res.data.message.indexOf("没有草稿") > -1) {
								that.getBeforeUserInfo();//获取上次提交审批时的审批人与抄送人信息
								if (that.approveType === 1565750481870350) {//转正-获取入职日期
									that.getRntryDate();
								}
							} else {
								that.$message.error(res.data.message);
							}
						} else {
							that.$message.error(res.data.message);
						}
					})
					.catch(error => {
						that.$message.error("获取草稿失败");
					});
			},
			//增加出差或报销或部门协作或立项申请明细
			addEvectionDetail(type) {
				if (type === 'xingcheng')
					this.evection.approveEvectionDetailDTOS.push({
						evectionAddress: "",//出差地点
						evectionBeginTime: "",
						evectionEndTime: "",
						evectionBeginPmAm: "",
						evectionEndPmAm: ""
					});
				else if (type === 'baoxiao')
					this.apply.addApproveReimbursementDetailDTOS.push({
						reimbursementMoney: "",
						reimbursementType: "",
						reimbursementDetail: ""
					});
				else if (type === 'caigou')
					this.procurement.addApproveProcurementDetailDTOS.push({
						procurementDetailName: "",//名称
						procurementDetailSpecification: "",//规格
						procurementDetailNumber: "",//数量
						procurementDetailUnit: "",//单位
						procurementDetailMoney: "",//价格
					});
				else if (type === 'xiezuo')
					this.cooperation.addApproveCooperationDetailDTOS.push({
						cooperationCollaboration: "",//协作方
						cooperationMatter: "",//协作事项
						cooperationOverTime: "",//完成日期
					});
				else if (type === 'lixiang')
					this.projectBudget.addApproveProjectDetailDTOS.push({
						projectBudgetContent: "",//预算内容
						projectBudgetMoney: ""//预算金额
					});
			},
			//校验是否已填写数据
			isCompile() {
				if (this.bigModel === 0) {
					switch (this.applyType) {
						case "0-0"://请假
							if (this.leaveList.leaveType != "" || this.leaveList.leaveBeginTime != "" || this.leaveList.leaveEndTime != "" || this.leaveList.leaveBeginPmAm != ""
								|| this.leaveList.leaveEndPmAm != "" || this.leaveList.leaveDays != "" || this.leaveList.leaveReason != "")
								return true;
							break;
						case "0-1"://出差
							let approveLists = this.evection.approveEvectionDetailDTOS;
							for (let i = 0; i < approveLists.length; i++) {
								if (approveLists[i].evectionAddress != "" || approveLists[i].evectionBeginTime != "" || approveLists[i].evectionEndTime != ""
									|| approveLists[i].evectionBeginPmAm != "" || approveLists[i].evectionEndPmAm != "")
									return true;
							}
							if (this.evection.evectionDays != "" || this.evection.evectionReason != "")
								return true;
							break;
						case "0-2"://外出
							if (this.goOut.goOutBeginTime != "" || this.goOut.goOutEndTime != "" || this.goOut.goOutHours != "" || this.goOut.goOutReason != "")
								return true;
							break;
						case "0-3"://加班
							if (this.overTime.overTimeBeginTime != "" || this.overTime.overTimeEndTime != "" || this.overTime.extraworkHours != ""
								|| this.overTime.isStatutoryHoliday === 1 || this.overTime.isStatutoryHoliday === "1" || this.overTime.extraworkReason != "")
								return true;
							break;
						case "0-4"://补卡
							if (this.cardReissue.cardReissueDate != "" || this.cardReissue.cardReissueTime != "" || this.cardReissue.cardReissueReason != "")
								return true;
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				} else if (this.bigModel === 1) {
					switch (this.applyType) {
						case "1-0"://报销
							let list1 = this.apply.addApproveReimbursementDetailDTOS;
							for (let i = 0; i < list1.length; i++) {
								if (list1[i].reimbursementMoney != 0 || list1[i].reimbursementMoney != "" || list1[i].reimbursementType != "" || list1[i].reimbursementDetail != "")
									return true;
							}
							break;
						case "1-1"://付款
							if(this.payment.paymentReason!="" || this.payment.paymentCollectMoney!="" || this.payment.paymentType!="" || this.payment.paymentTime!="" || this.payment.paymentPayObject!=""
								|| this.payment.paymentOpenBank!="" || this.payment.paymentBankAccount!="" || this.payment.paymentRemark!="")
							return true;
							break;
						case "1-2"://采购
							if (this.procurement.procurementApplyForReason != "" || this.procurement.procurementType != "" || this.procurement.procurementDeliveryTime != "")
								return true;
							let procurementLists = this.procurement.addApproveProcurementDetailDTOS;
							for (let i = 0; i < procurementLists.length; i++) {
								if (procurementLists[i].procurementDetailName != "" || procurementLists[i].procurementDetailSpecification
									|| procurementLists[i].procurementDetailNumber != "" || procurementLists[i].procurementDetailUnit != "" || procurementLists[i].procurementDetailMoney != "")
									return true;
							}
							if (this.procurement.procurementCollectMoney != "" || this.procurement.procurementPayWay != "" || this.procurement.procurementRemark != "")
								return true;
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				} else if (this.bigModel === 2) {
					switch (this.applyType) {
						case "2-0"://报销
							if (this.common.commonName != "" || this.common.commonContent != "")
								return true;
							break;
						case "2-1"://部门协作
							if (this.cooperation.cooperationReason != "" || this.cooperation.cooperationExpectedGoal != "" || this.cooperation.cooperationInitiator != "" || this.cooperation.cooperationRemark != "")
								return true;
							let cooperationLists = this.cooperation.addApproveCooperationDetailDTOS;
							for (let i = 0; i < cooperationLists.length; i++) {
								if (cooperationLists[i].cooperationCollaboration != "" || cooperationLists[i].cooperationMatter != "" || cooperationLists[i].cooperationOverTime != "")
									return true;
							}
							break;
						case "2-2"://部门协作
							if (this.workInstruction.workReason != "" || this.workInstruction.workEmergencyDegree != "" || this.workInstruction.workTime != "" || this.workInstruction.workContent != "")
								return true;
							break;
						case "2-3"://工作指示
							if (this.projectBudget.projectName != "" || this.projectBudget.projectSynopsis != "" || this.projectBudget.projectTarget != "" || this.projectBudget.projectTime != ""
								|| this.projectBudget.projectNumber != "" || this.projectBudget.projectDesignSchedule != "" || this.projectBudget.projectRemark != "")
								return true;
							let projectBudget = this.projectBudget.addApproveProjectDetailDTOS;
							for (let i = 0; i < projectBudget.length; i++) {
								if (projectBudget[i].projectBudgetContent != "" || projectBudget[i].projectBudgetMoney != "")
									return true;
							}
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				} else if (this.bigModel === 3) {
					switch (this.applyType) {
						case "3-0":
							if (this.positive.positiveEntryTime != "" || this.positive.positivePositiveTime != "" || this.positive.positivePositionName != "" || this.positive.positivePositionRank != ""
								|| this.positive.positivePostComprehend != "" || this.positive.positiveWorkSummary != "" || this.positive.positiveCompanyOpinion != "")
								return true;
							break;
						case "3-1":
							if (this.recruitment.recruitmentDepartmentId != "" || this.recruitment.recruitmentPosition != "" || this.recruitment.recruitmentNumber != "" || this.recruitment.recruitmentRequire != ""
								|| this.recruitment.recruitmentPositionTime != "")
								return true;
							break;
						case "3-2"://离职
							if (this.dimission.dimissionTime != "" || this.dimission.dimissionHandoverId != "" || this.dimission.dimissionReason != "" || this.dimission.dimissionHandoverWork != "")
								return true;
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				}else if(this.bigModel === 4){
					switch (this.applyType) {
						case "4-0":
							if(this.sealApply.sealDepartmentId!=""||this.sealApply.sealTime!=""||this.sealApply.sealFileName!=""||this.sealApply.sealFileNumber!=""||
								this.sealApply.sealType!=""||this.sealApply.sealFileType!=""||this.sealApply.sealRemark!="")
							return true;
							break;
						case "4-1":
							if(this.spareCash.spareDepartmentId!=""||this.spareCash.spareReason!=""||this.spareCash.spareMoney!=""||this.spareCash.spareUseTime!=""||
								this.spareCash.spareReturnTime!=""||this.spareCash.spareCashier!=""||this.spareCash.spareRemark!="")
								return true;
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				}
				return false;
			},
			//是否选择审批人和抄送人
			isApprovlAndCopy() {
				if ((this.recipients && this.recipients.length > 0) || (this.approvers && this.approvers != "")) {
					return true;
				}
				//图片
				if (this.pictureList.length > 0) {
					return true;
				}
				//附件
				if (this.applyType === '1-0') {
					if (this.attachmentList.length > 0) {
						return true;
					}
				}
				return false;
			},
			//清除表单校验
			clearValidate() {
				if (this.bigModel === 0) {
					switch (this.applyType) {
						case "0-0"://请假
							this.$refs.leaveList.clearValidate();
							break;
						case "0-1"://出差
							this.$refs.evection.clearValidate();
							break;
						case "0-2"://外出
							this.$refs.goOut.clearValidate();
							break;
						case "0-3"://加班
							this.$refs.overTime.clearValidate();
							break;
						case "0-4"://补卡
							this.$refs.cardReissue.clearValidate();
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				} else if (this.bigModel === 1) {
					switch (this.applyType) {
						case "1-0"://报销
							this.$refs.apply.clearValidate();
							break;
						case "1-1":
							this.$refs.payment.clearValidate();
							break;
						case "1-2"://采购
							this.$refs.procurement.clearValidate();
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				} else if (this.bigModel === 2) {
					switch (this.applyType) {
						case "2-0"://通用审批
							this.$refs.common.clearValidate();
							break;
						case "2-1"://部门协作
							this.$refs.cooperation.clearValidate();
							break;
						case "2-2"://工作指示
							this.$refs.workInstruction.clearValidate();
							break;
						case "2-3"://立项申请
							this.$refs.projectBudget.clearValidate();
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				} else if (this.bigModel === 3) {
					switch (this.applyType) {
						case "3-0":
							this.$refs.positive.clearValidate();
							break;
						case "3-1":
							this.$refs.recruitment.clearValidate();
							break;
						case "3-2":
							this.$refs.dimission.clearValidate();
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				}else if(this.bigModel === 4){
					switch (this.applyType) {
						case "4-0":
							this.$refs.sealApply.clearValidate();
							break;
						case "4-1":
							this.$refs.spareCash.clearValidate();
							break;
						default:
							this.$message.error(this.noSwitch);
							break;
					}
				}
			},
			//各模块时长的计算
			durationCalculate(form, type) {
				if (form === 'qingjia') {
					if (type === 'begin') {
						this.$refs.leaveList.clearValidate('leaveBeginPmAm');
					}
					if (type === 'end') {
						this.$refs.leaveList.clearValidate('leaveEndPmAm');
					}
					if (this.leaveList.leaveType === "") {
						this.$message.warning("请先选择请假类型");
						this.leaveList.leaveBeginTime = "";
						this.leaveList.leaveEndTime = "";
						return;
					}
					if (type != 'change') {
						let date1 = this.leaveList.leaveBeginTime;
						let date2 = this.leaveList.leaveEndTime;
						let time1 = this.leaveList.leaveBeginPmAm;
						let time2 = this.leaveList.leaveEndPmAm;
						this.leaveList.leaveDays = "";
						let time = this.getTimer(this.isDateOrMinute, date1, date2, time1, time2);
						if (time > 0) {
							if (this.isDateOrMinute === 0 || this.isDateOrMinute === 2) {
								time = parseInt(time);
							}
							this.leaveList.leaveDays = time;
							this.$refs.leaveList.clearValidate('leaveDays');
						} else if (time === -1 || time === 0) {
							this.leaveList.leaveEndTime = "";
							this.leaveList.leaveEndPmAm = "";
							this.leaveList.leaveDays = "";
							this.$message.error("请选择正确时间");
						}
					} else {
						if (this.isDateOrMinute === 0 || this.isDateOrMinute === 2) {//整数
							if (!this.isNumber(0, this.leaveList.leaveDays)) {
								this.leaveList.leaveDays = "";
								this.$message.error("请假时长为整数");
								return;
							}
						} else {
							if (!this.isNumber(1, this.leaveList.leaveDays)) {
								this.leaveList.leaveDays = "";
								this.$message.error("请假时长为两位的小数");
								return;
							}
						}
					}
				}
				if (form === 'jiaban') {
					if (type != 'change') {
						let date1 = this.overTime.overTimeBeginTime;
						let date2 = this.overTime.overTimeEndTime;
						this.overTime.extraworkHours = "";

						const time = this.getTimer(3, date1, date2);
						if (time > 0) {
							this.overTime.extraworkHours = time;
						} else if (time === -1 || time === 0) {
							this.overTime.overTimeEndTime = "";
							this.overTime.extraworkHours = "";
							this.$message.error("请选择正确时间");
						}
					} else {
						if (!this.isNumber(1, this.overTime.extraworkHours)) {
							this.overTime.extraworkHours = "";
							this.$message.error("加班时长为数字或最多两位的小数");
							return;
						}
					}
				}
			},
			//出差天数计算
			evectionChange(index, type) {
				if (type === 'begin') {
					this.$refs.evection.clearValidate('approveEvectionDetailDTOS.' + index + '.evectionBeginPmAm');
				}
				if (type === 'end') {
					this.$refs.evection.clearValidate('approveEvectionDetailDTOS.' + index + '.evectionEndPmAm');
				}
				if (type != 'change') {
					this.evection.evectionDays = "";
					for (let i = 0; i < this.evection.approveEvectionDetailDTOS.length; i++) {
						let date1 = this.evection.approveEvectionDetailDTOS[i].evectionBeginTime;
						let date2 = this.evection.approveEvectionDetailDTOS[i].evectionEndTime;
						let time1 = this.evection.approveEvectionDetailDTOS[i].evectionBeginPmAm;
						let time2 = this.evection.approveEvectionDetailDTOS[i].evectionEndPmAm;

						const time = this.getTimer(1, date1, date2, time1, time2);
						if (time > 0) {
							this.evection.evectionDays = Number(this.evection.evectionDays) + time;
						} else if (time === -1 || time === 0) {
							this.evection.approveEvectionDetailDTOS[i].evectionEndTime = "";
							this.evection.approveEvectionDetailDTOS[i].evectionEndPmAm = "";
							this.evection.evectionDays = "";
							this.$message.error("请选择正确时间");
						}
					}
					this.evection.displayEvectionDays = this.evection.evectionDays + "天";
				} else {
					if (!this.isNumber(1, this.evection.evectionDays)) {
						this.evection.evectionDays = "";
						this.$message.error("出差天数为数字或最多两位的小数");
						return;
					}
				}
			},
			//获取上次提交审批时的审批人与抄送人信息
			getBeforeUserInfo() {
				let that = this;
				this.$http({
					method: "GET",
					url: this.token + "/v1/feign/oa/approve/queryLastRedisApprovesAndRecipients/" + that.userDetail.employeeId + "/" + that.userDetail.companyId + "/" + that.approveType,
				})
					.then(res => {
						if (res.data.code === 200) {
							//审批人    nodeApprovesInfoVos   approvesInfo
							if (res.data.data.approvesInfo && res.data.data.approves) {
								that.approvers = res.data.data.approves;
								const num = res.data.data.approves.split("|").length;//节点数
								that.approveList = [];
								for (let i = 1; i < num + 1; i++) {
									if (res.data.data.approvesInfo[i - 1]) {
										if (res.data.data.approvesInfo[i - 1].nodeApprovesInfo) {
											let nodeApprovesInfo = res.data.data.approvesInfo[i - 1].nodeApprovesInfo;
											for (let j = 0; j < nodeApprovesInfo.length; j++) {
												nodeApprovesInfo[j]["iconUrl"] = nodeApprovesInfo[j].auditHeadUrl;
												nodeApprovesInfo[j]["employeeId"] = nodeApprovesInfo[j].auditId;
												nodeApprovesInfo[j]["employeeName"] = nodeApprovesInfo[j].auditName;
											}
										}
										that.approveList.push(res.data.data.approvesInfo[i - 1].nodeApprovesInfo);
									}
								}
							}
							//抄送人
							if (res.data.data.recipients && res.data.data.recipientsInfo) {
								that.receiverList = [];
								that.recipients = res.data.data.recipients;
								that.receiverList = res.data.data.recipientsInfo;
								//把草稿中的抄送人信息保存下来，在选择抄送人时默认展示使用
								let list = [];
								for (let i = 0; i < that.receiverList.length; i++) {
									if (that.receiverList[i]) {
										list.push({
											employeeName: that.receiverList[i].employeeName ? that.receiverList[i].employeeName : "",
											employeeId: that.receiverList[i].employeeId ? that.receiverList[i].employeeId : "",
											department: that.receiverList[i].departmentName ? that.receiverList[i].departmentName : ""
										});
									}
								}
								this.managerListCopy = list;
							}
						} else {
							// that.$message.warning(res.data.message);
						}
					})
					.catch(error => {
						that.$message.error("获取审批人与抄送人信息失败");
					});
			},
			//各模块金额的计算
			moneyCalculate(type) {
				if (type === 'baoxiao') {
					if (this.apply.addApproveReimbursementDetailDTOS.length > 0) {
						let list1 = this.apply.addApproveReimbursementDetailDTOS;
						this.apply.reimbursementCollectMoney = 0;
						for (let i = 0; i < list1.length; i++) {
							let num = JSON.parse(JSON.stringify(list1[i].reimbursementMoney));
							if (num) {
								if (!/^\d+(\.\d{1,2})?$/.test(num)) {
									this.$message.warning("报销金额为数字或最多两位的小数");
									this.apply.addApproveReimbursementDetailDTOS[i].reimbursementMoney = "";
									return;
								}
								this.apply.reimbursementCollectMoney += parseFloat(num);
							}
						}
					}
					this.apply.reimbursementCollectMoney = parseFloat(Math.round(this.apply.reimbursementCollectMoney * 100) / 100);
				}else if (type === 'caigou') {
					if (this.procurement.addApproveProcurementDetailDTOS.length > 0) {
						let list2 = this.procurement.addApproveProcurementDetailDTOS;
						this.procurement.procurementCollectMoney = 0;
						for (let j = 0; j < list2.length; j++) {
							if (!/^[0-9]*[1-9][0-9]*$/.test(list2[j].procurementDetailNumber)) {
								this.$message.warning("采购数量为正整数");
								this.procurement.addApproveProcurementDetailDTOS[j].procurementDetailNumber = "";
								return;
							}
							if (!/^\d+(\.\d{1,2})?$/.test(list2[j].procurementDetailMoney)) {
								this.$message.warning("采购价格为数字或最多两位的小数");
								this.procurement.addApproveProcurementDetailDTOS[j].procurementDetailMoney = "";
								return;
							}
							if (list2[j].procurementDetailNumber && list2[j].procurementDetailMoney) {
								this.procurement.procurementCollectMoney += (list2[j].procurementDetailNumber * list2[j].procurementDetailMoney);

							}
						}
						this.procurement.procurementCollectMoney = parseFloat(Math.round(this.procurement.procurementCollectMoney * 100) / 100);
					}
				}else if (type === 'lixiang') {
					if (this.projectBudget.addApproveProjectDetailDTOS.length > 0) {
						let projectDetailList = this.projectBudget.addApproveProjectDetailDTOS;
						this.projectBudget.projectCollectMoney = 0;
						for (let x = 0; x < projectDetailList.length; x++) {
							if (!/^\d+(\.\d{1,2})?$/.test(projectDetailList[x].projectBudgetMoney)) {
								this.$message.warning("预算金额为为数字或最多两位的小数");
								this.projectBudget.addApproveProjectDetailDTOS[x].projectBudgetMoney = "";
								return;
							}
							if (projectDetailList[x].projectBudgetMoney) {
								this.projectBudget.projectCollectMoney += Number(projectDetailList[x].projectBudgetMoney);
							}
						}
						this.projectBudget.projectCollectMoney = parseFloat(Math.round(this.projectBudget.projectCollectMoney * 100) / 100);
					}
				}else if(type==='fukuan'){
					let num1 = JSON.parse(JSON.stringify(this.payment.paymentCollectMoney));
					if (num1) {
						if (!/^\d+(\.\d{1,2})?$/.test(num1)) {
							this.$message.warning("付款总额为数字或最多两位的小数");
							this.payment.paymentCollectMoney = "";
							return;
						}
					}
				}
			},
			//外出时长计算
			goOutChange(type) {
				if (type != "change") {
					let date1 = this.goOut.goOutBeginTime;
					let date2 = this.goOut.goOutEndTime;
					this.goOut.goOutHours = "";

					//外出必须在一天之内
					if (date1 && date2) {
						if (date1.slice(0, 10) != date2.slice(0, 10)) {
							this.$message.error("外出时间必须在一天之内");
							this.goOut.goOutEndTime = "";
							return;
						}
					}

					const time = this.getTimer(3, date1, date2);
					if (time > 0) {
						this.goOut.goOutHours = time;
					} else if (time === -1 || time === 0) {
						this.goOut.goOutEndTime = "";
						this.goOut.goOutHours = "";
						this.$message.error("请选择正确时间");
					}
				} else {
					if (!this.isNumber(1, this.goOut.goOutHours)) {
						this.goOut.goOutHours = "";
						this.$message.error("外出时长为数字或最多两位的小数");
						return;
					}
				}
			},
			//时间计算
			getTimer(type, date1, date2, time1, time2) { //type 0 天 1 半天 2 小时  3 分钟
				if (date1)
					date1 = date1.toString().length === 10 ? (date1 + " 00:00:00") : (date1.toString().length === 13 ? (date1 + ":00:00") : (date1.toString().length === 16 ? (date1 + ":00") : date1));
				if (date2)
					date2 = date2.toString().length === 10 ? (date2 + " 00:00:00") : (date2.toString().length === 13 ? (date2 + ":00:00") : (date2.toString().length === 16 ? (date2 + ":00") : date2));
				if (date1 && date2 && !time1 && !time2) {//只有开始日期和结束日期(天，小时，分钟)
					// if (type === 2 && isNaN(new Date(date2).getTime())) {
					// 	date2 += ":00:00";
					// }
					// if (type === 2 && isNaN(new Date(date1).getTime())) {
					// 	date1 += ":00:00";
					// }
					let date = new Date(date2).getTime() - new Date(date1).getTime();
					if (date < 0) {
						return -1;
					} else if (type === 0) {//天
						date = parseInt(date / (24 * 3600 * 1000));
						date += 1;
						if (date <= 0) {
							return -1;
						} else {
							return date;
						}
					} else if (type === 1) {//半天
						date = (date / (24 * 3600 * 1000));
						if (date < 0) {
							return -1;
						}
						if (Number.isInteger(date)) {
							return date;
						} else {
							return Math.round(date * 100) / 100;
						}
					} else if (type === 2) {//小时
						if (date <= 0) {
							return -1;
						}
						date = (date / (3600 * 1000));
						if (date === 0) {
							return date + 1;
						}
						return Math.ceil(date);
					} else if (type === 3) {//分钟
						date = (date / (3600 * 1000));
						if (date <= 0) {
							return -1;
						}
						if (Number.isInteger(date)) {
							return date;
						} else {
							return Math.round(date * 100) / 100;
						}
					}
				} else if (date1 && date2 && time1 && time2) { //只能是半天
					if (type === 1) {
						let date = new Date(date2).getTime() - new Date(date1).getTime();
						date = (date / (24 * 3600 * 1000));
						if (date < 0) {
							return -1;
						}
						if (date1 === date2) {//同一天
							if (parseInt(time1) > parseInt(time2)) {
								return -1;
							}
							if (time1 == time2) {
								date += 0.5;
							} else {
								date += 1;
							}
							if (Number.isInteger(date)) {
								return date;
							} else {
								return Math.round(date * 100) / 100;
							}
						} else {//不同天
							if (time1 == time2) {
								date += 0.5;
							} else if (parseInt(time1) < parseInt(time2)) {
								date += 1;
							}
							if (Number.isInteger(date)) {
								return date;
							} else {
								return Math.round(date * 100) / 100;
							}
						}
					}
				}
				return -2;
			},
			//判断一个数是两位的小数还是整数
			isNumber(type, num) {//type   0  整数    1  两位的小数
				let number = Number(num);//转换为数字
				if (!isNaN(number)) {//是一个数
					if (type === 0) {
						if (!Number.isInteger(number)) {//不是整数
							return false;
						}
					} else if (type === 1) {
						number = number.toString();
						if (!/^\d+(\.\d{1,2})?$/.test(number)) {
							return false;
						}
					}
				} else {//不是一个数
					return false;
				}
				return true;
			},
			//提交成功后获取该条审批详情
			handleApprvolDetial(obj) {
				this.$http({
					method: 'GET',
					url: `/oaManager/v1/feign/oa/approve/queryApproveInfo/${obj.userId}/${obj.approveChildrenId}/${obj.approveTypeId}`
				}).then(res => {
					if (res.data.code == 200) {
						const data = res.data.data;
						let approveName = "";
						if (res.data.data.createName) {
							approveName = res.data.data.createName + "的" + this.frameName;
						}
						const dataObj = {
							data: data,
							approveName: approveName,
							approveTypeId: obj.approveTypeId,
							approveChildrenId: obj.approveChildrenId,
							sidebar: true
						}
						this.$router.push({name: "launchApproval", params: {dataObj: dataObj}});
					} else {
						this.$message({
							type: 'error',
							message: res.data.message
						})
					}
				})
			},
			//转正-获取入职时间
			getRntryDate() {
				let that = this;
				this.$http({
					method: 'GET',
					url: `/oaManager/v1/feign/oa/approve/queryEmployeeById/${this.userDetail.employeeId}/${this.userDetail.companyId}`
				}).then(res => {
					if (res.data.code == 200) {
						that.positive.positiveEntryTime = res.data.data.employeeEntryTime ? res.data.data.employeeEntryTime : "";
						that.positive.positivePositionName = res.data.data.positivePositionName ? res.data.data.positivePositionName : "";
					}
				})
			},
			//获取部门信息（部门选择用）
			handleData() {
				let that = this;
				this.$http({
					method: 'POST',
					url: '/orgManager/v1/organization/department/queryAddressBook',
					data: {
						companyId: that.userDetail.companyId
					},
				}).then(res => {
					if (res.data.code === 200) {
						if (res.data.data.children.length != 0) {
							that.departmentList = [];
							that.departmentList.push(res.data.data.children[0]);
						} else {
							that.departmentList = [];
						}
					}
				})
			},
		}
	}
</script>

<style scoped>
	.sender > img {
		position: absolute;
		top: 50%;
		right: 3%;
		transform: translate(-50%, -50%);
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
		width: 290px;
		cursor: pointer;
		position: relative;
	}

	.procurementCollectMoney >>> .el-input__inner {
		border: none;
	}

	.input_type >>> .el-textarea__inner {
		height: 106px;
	}

	.procurementClass {
		padding-bottom: 32px;
		border-bottom: 1px solid #F8F8F8;
	}

	.delete_detail {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background-color: #BFC2CC;
		line-height: 14px;
		text-align: center;
		color: #fff;
		margin-top: 10px;
		cursor: pointer;
	}

	.detail_css1 {
		/*margin-top: -30px;*/
	}

	.detail_css {
		position: relative;
		padding-top: 30px;
	}

	.detail_css_bottom {
		margin-bottom: 50px;
	}

	.detail_style {
		position: absolute;
		left: -70px;
		top: -30px;
		width: 95%;
		height: 36px;
		background-color: #F8F8F8;
		padding-left: 67px;
		padding-right: 28px;
		line-height: 36px;
		color: #909399;
		font-size: 14px;
	}

	.addNone {
		width: 124px;
		height: 30px;
		display: inline-block;
	}

	.addEvectionDetail {
		width: 289px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		border-radius: 3px;
		border: 1px solid #BFC2CC;
		display: inline-block;
		color: #4278BE;
		font-size: 12px;
		cursor: pointer;
	}

	.frame_content >>> .accessoryHei .showPic_box {
		float: unset;
	}

	.frame_content >>> .pictureHei {
		margin-left: 78px;
		line-height: 44px;
		/*height: 60px;*/
		margin-bottom: 0;
	}

	.frame_content >>> .textContent {
		height: auto;
	}

	.frame_content >>> .typeName {
		font-size: 14px !important;
	}

	.frame_content >>> .accessoryHei {
		margin-left: 78px;
		margin-bottom: 0;
		/*height: 70px;*/
	}

	.frame_content >>> .pic_box {
		width: 88%;
	}

	.frame_content >>> .showPic_box img {
		width: 44px;
		height: 44px;
	}

	.btn-left {
		width: 110px;
		color: #4278BE;
	}

	.btn-right {
		margin-right: 15px;
		background-color: #4278BE;
		margin-left: 15px;
		width: 80px;
		color: white;
	}

	.frame_footer_btn {
		text-align: center;
		font-size: 14px;
		height: 34px;
		border: 1px solid rgba(66, 120, 190, 1);;
		border-radius: 3px;
		line-height: 34px;
		cursor: pointer;
	}

	.frame_footer {
		width: 97%;
		position: absolute;
		bottom: 0;
		left: 0;
		padding-bottom: 10px;
		padding-right: 15px;
		padding-top: 10px;
		border-top: 1px solid #EDEFF2;
		background-color: white;
	}

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
		/*height: 44px;*/
		margin-bottom: 38px;
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

	.send_box .send_smallBox {
		padding-right: 20px;
		height: 94px;
		word-break: break-word;
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

	.send_box .approve_contentBox {
		height: 82px;
	}

	.send_box .send_add {
		display: inline-block;
		width: 44px;
		height: 44px;
		margin-bottom: 32px;
		border: 1px solid #BFC2CC;
		border-radius: 2px;
		text-align: center;
		line-height: 44px;
		color: #BFC2CC;
		cursor: pointer;
	}

	.send_name {
		display: inline-block;
		height: 44px;
		line-height: 44px;
		width: 110px;
		text-align: right;
		margin-right: 12px;
		font-size: 14px;
		color: #303133;
	}

	.mustFill {
		color: red;
		margin-right: 4px;
	}

	.frame_content {
		height: 82.5%;
		padding-top: 30px;
		padding-left: 30px;
		overflow-y: auto;
	}

	.frame_close {
		color: #909399;
		font-size: 26px;
		margin-right: 4px;
		cursor: pointer;
	}

	.frame_name {
		color: #303133;
		font-size: 20px;
	}

	.frame_head {
		padding: 22px 27px 18px 40px;
		border-bottom: 1px solid #EDEFF2;
	}

	.right_frame_model {
		position: fixed;
		right: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
	}

	.right_frame {
		width: 600px;
		height: 100%;
		z-index: 1;
		background-color: white;
		/*padding: 22px 20px 0px 40px;*/
	}

	.clearapproval_modal_content span {
		font-size: 16px;
		color: #303133;
	}

	.clearapproval_modal_content img {
		width: 33px;
		height: 33px;
		margin-right: 15px;
	}

	.clearapproval_modal_content {
		width: 209px;
		height: 81px;
		background-color: #F8F8F8;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20px;
		border-radius: 3px;
		cursor: pointer;
	}

	.approval_modal_head .approval_name {
		color: #4278BE;
		font-size: 18px;
	}

	.approval_modal_head .approval_icon {
		height: 20px;
		width: 5px;
		background-color: #4278BE;
		margin-right: 10px;
	}

	.approval_modal,
	.approval_modal_head {
		margin-bottom: 32px;
	}

	.approval_box {
		/*width: 97%;*/
		background-color: white;
		padding: 22px;
	}

	.el-form >>> .el-form-item__label {
		font-size: 14px;
		color: #303133;
	}

	.frame_content .input_type {
		width: 290px;
		height: 30px;
		cursor: pointer;
	}

	.frame_content .input_typeAm {
		width: 176px;
		height: 30px;
	}

	.frame_content .select_type {
		width: 110px;
		height: 30px;
	}
</style>
