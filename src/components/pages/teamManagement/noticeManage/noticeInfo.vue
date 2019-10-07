<template>
	<div class="noticeInfo-container">
		<p class="noticeInfo-title">
			关于修订考勤管理制度（暂行）的通知
		</p>
		<div class="noticeInfo-msg">
			<span class="noticeInfo-time">2019/08/05 12:55:11</span>
			<span class="noticeInfo-clas">公告所属分类名称</span>
			<span class="noticeInfo-status" @click.stop="showStatus">
				<span>12人已读</span>
				<span>20人未读</span>
			</span>
			<div class="noticeInfo-content">
				1、考勤周期：2017年3月工资结算的考勤统计周期为3月1日—3月31日；
				2、考勤数据上报：工作日必须在所属区域公司范围内IP地址登陆或移动签到，直接前往客户处未能在公司范围内签到确认出勤的，请务必提交外出出差流程，签到记录仅以规定范围可识别的数据作为统计依据。
				3、考勤报表查询方式：请大家在系统中进入报表菜单——人事报表——考勤相关——考勤报表，查看自己的考勤记录。
				4、考勤数据异常处理：考勤统计期间如有缺勤：因公外出，必须要走泛微出差/外出流程（出差外出原则上应当提前申请，每次申请不得超过7天，未能提前申请的必须在五天内补交相应的流程，业务人员外出原则上必须关联客户或项目）；因私请假，必须要走泛微请假流程，在流程中进行原因说明，请假的注意事项，请参考请假流程中的说明。迟到按照相应规定执行，其他未能说明原因的考勤异常，将视为缺勤。
				5、考勤统计时效：外出及请假流程的补交最晚截至到4月7日12：00，请上级及时审批，以便我们统计，逾期未及时提交流程并通过审批的将直接视为缺勤结算。
			</div>
		</div>
		<div class="noticeInfo-fieldset">
			<fieldset>
				<legend>附件（4）</legend>
				<template v-for="(item,i) in stausNum ">
					<div class="fileItem">
						<div class="fileImg">
<!--							<img src="" alt="1" v-show="stausNum[i].type.indexOf(.ppt) > -1">//判断文件类型-->
<!--							<img src="" alt="2" v-show="stausNum[i].type.indexOf(.ppt) > -1">-->
<!--							<img src="" alt="3" v-show="stausNum[i].type.indexOf(.ppt) > -1">-->
<!--							<img src="" alt="4" v-show="stausNum[i].type.indexOf(.ppt) > -1">-->
						</div>
						<div class="file-lei">
							<p>文件名称展文件名称文件名称展位展位位.pptx</p>
							<p>12M</p>
						</div>
					</div>
				</template>
			</fieldset>
		</div>
		<p class="noticeInfo-footer">签发部门：发布人所在部门</p>
		<p class="noticeInfo-choiceP">对谁可见：&nbsp;&nbsp;{{rouForm.employeeName}},{{rouForm.iconUrl}}</p>
		<p class="noticeInfo-syncS">是否同步在<span style="color:red">APP</span>主页: <span v-show="rouForm.syncState==0">是</span><span v-show="rouForm.syncState==1">否</span></p>
		<div class="status-module" v-show="statusModuleFlag">
			<div class="status-choice">
				<div>
					<span class="actives">未读(100)</span>
					<span>已读(20)</span>
				</div>
				<span class="el-icon-close close" @click.stop="()=>{statusModuleFlag=false}"></span>

			</div>
			<div class="status-content">
				<template v-for="(item,i) in stausNum">
					<div class="status-info" >
						<img src="" alt="">
<!--						<span  ref="names" :class="[item.name.length>4?'sta-name':'status-name']">a打扫房间 </span>-->
					</div>
				</template>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			fontIndex:[],//未读人数的弹窗中名字样式的开关
			type:0,//判断显示什么类型的图标
			statusModuleFlag:false,//未读人数的弹窗开关
			stausNum:[false,false,false,false,false,false,false,false,false],//接收读取人数的状态
			rouForm:{
				noticeTitle:'',//公告标题
				classifyBelongId:[],//分类id
				classifyName:[],//分类名称
				syncState:'',//同步状态
				deleteState:'',//删除状态 0 未删除 1 已删除
				companyId:'',
				companyNoticeId:'',//公告id
				fileName:[],//文件名称
				fileUrl:[],//文件地址
				fileSize:[],//文件大小
				department:'',//签发部门
				employeeName:[],//部门
				iconUrl:'',//人员部门
				readState:'',//头像地址
			},//接收详情页面显示的数据
			readList:{
				readUserList:[],//已读人员列表
				companyNoticeId:[],//公告Id
				userId:[],//人员id
				readState:'',//阅读状态
				iconUrl:[],//头像
				employeeName:[],//姓名
				department:[],//部门
				unReadUserList:[]//未读人员列表
			}
		}
	},
	created() {
		this.getNoticeData()
	},
	methods: {
		//获取列表展示数据
		getNoticeData() {
			this.$http({
				url: "v1/oa/company/getCompanyNoticeById",//====请求后台获取公告详情
				method: "GET",
				data: {
					companyId: 1,
					noticeId:this.$route.query.id,
				},
				headers: {
					"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2MzkxOTk1LCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTU3NDcwMiwidXNlcklkIjoyMDA0ODQ1Njg4NjAxNzIyODh9.bXYjlXIh_nyf1nAglp1pdf4osOSAzQ7Y7bt5l0ix4Og'
				}
			})
				.then(res => {
					// console.log(res)
					if (res.data.code == 200 && res.status == 200) {


						// =====  重新做调用
						// this.ruleForm.fileList1.push(item.relativePath)
						// console.log(res.data.data[0].relativePath)

						// this.ruleForm.fileList = res.data.data[0].relativePath
						// alert("导入成功!");
					} else {
						// alert(res.data.message + "," + res.data.data);
					}
				}).catch(err => {
				console.log(err);
			});

		},
		//接收读取人数状态
		showStatus() {
			this.$http({
				url: "v1/oa/company/statisticsRead",//====请求后台获取读取人数的数据，附带头像，姓名
				method: " GET",
				data: {
					companyNoticeId:'1'
				},
				headers: {
					"Content-Type": "multipart/form-data",
					"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2MzkxOTk1LCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTU3NDcwMiwidXNlcklkIjoyMDA0ODQ1Njg4NjAxNzIyODh9.bXYjlXIh_nyf1nAglp1pdf4osOSAzQ7Y7bt5l0ix4Og'
				}
			})
				.then(res => {
					// console.log(res)
					if (res.data.code == 200 && res.status == 200) {
						this.readList.readUserList = JSON.parse(res.data.data.readUserList)//已读人员列表
						this.readList.companyNoticeId = JSON.parse(res.data.data.companyNoticeId)//公告Id
						this.readList.userId = JSON.parse(res.data.data.userId)//人员Id
						this.readList.readState = JSON.parse(res.data.data.readState)//阅读状态
						this.readList.iconUrl = JSON.parse(res.data.data.iconUrl)//头像
						this.readList.employeeName = JSON.parse(res.data.data.employeeName)//姓名
						this.readList.department = JSON.parse(res.data.data.department)//部门
						this.readList.unReadUserList = JSON.parse(res.data.data.unReadUserList)//未读人员列表
					}
				}).catch(err => {
				// console.log(err);
				this.$message('请求失败')
			});
			this.statusModuleFlag=true
			// this.$nextTick(()=> {
			// 	this.changeClass()
			// })
		},
		//判断文件类型
	}
}
</script>
<style lang="scss">
	.noticeInfo-container {
		font-family: 'MicrosoftYaHei';
		height: 1337px;
		min-width: 850px;
		background-color: #fff;
		padding: 35px 63px 0 63px;

		.noticeInfo-title {
			color: #303133;
			font-size: 21px;
			text-align: center;
		}

		.noticeInfo-msg {
			margin-top: 21px;
			text-align: center;

			.noticeInfo-time {
				font-size: 14px;
				margin-right: 50px;
				color: #909399;
			}

			.noticeInfo-clas {
				margin-right: 53px;
			}

			.noticeInfo-status {
				span {
					font-size: 14px;
					margin-left: 28px;
					color: #2AA1E1;
				}
			}

			.noticeInfo-content {
				margin-top: 49px;
				color: #606266;
				font-size: 14px;
			}
		}

		.noticeInfo-fieldset {
			margin-top: 40px;

			fieldset {
				padding: 34px 34px 0;
				border: 1px solid #EAEAEA;

				legend {
					color: #606266;
					padding: 0 15px;
					-webkit-background-clip: text;
					font-size: 14px;
				}

				.fileItem {
					width: 50%;
					float: left;
					height: 44px;
					margin-bottom: 32px;
					font-size: 0px;

					.fileImg {
						width: 44px;
						height: 44px;
						display: inline-block;
						border: 1px dashed #000;
						-webkit-box-sizing: border-box;
						-moz-box-sizing: border-box;
						box-sizing: border-box;
						vertical-align: top;

						img {
							width: 32px;
							height: 39px;
							background: pink;
							margin: 2px auto;
						}
					}

					.file-lei {
						height: 100%;
						margin-left: 8px;
						display: inline-block;

						p {
							font-size: 14px;
							color: #909399;
							margin-bottom: 5px;
						}
					}

				}

			}
		}

		.noticeInfo-footer {
			margin-top: 38px;
			color: #909399;
			font-size: 14px;
		}
		.noticeInfo-choiceP, .noticeInfo-syncS {
			margin-top: 30px;
		}
		.status-module {
			width: 544px;
			height: 586px;
			background: #F8F8F8;
			position: fixed;
			top:50%;
			left: 50%;
			transform: translate(-50%, -50%);
			-ms-transform: translate(-50%, -50%);
			-moz-transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
			-o-transform: translate(-50%, -50%);
			.status-choice {
				height: 81px;
				border-bottom: 1px solid #BFC2CC;
				padding-left: 7px;
				padding-right: 20px;
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				span {
					color:#BFC2CC;
					display: inline-block;
					text-align: center;
					margin-top: 46px;
					margin-left: 30px;
					font-size: 20px;
					height: 25px;
					width:96px;
				}
				.close {
					margin-top: 0;
					margin-left: 0;
					width:20px;
					font-size: 18px;
					height: 100%;
				}
			}
			.status-content {
				height: 100%;
				width:470px;
				overflow-y:scroll;
				margin:20px 37px;
				padding-left: 21px;
				background-color: #fff;
				-ms-overflow-style: none;
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;
				overflow: -moz-scrollbars-none;
				&::-webkit-scrollbar {
					width: 0 !important;
					display: none;

				}
				.status-info {
					width:44px;
					height: 70px;
					margin-right: 20px;
					margin-top: 21px;
					display: inline-block;
					img {
						width:44px;
						height: 44px;
						border:1px solid black;

					}
					.sta-name {
						font-size: 12px;
						white-space:nowrap;
						display: block;
						line-height: 20px;
						text-align: center;
					}
					span {
						font-size: 14px;
						white-space:nowrap;
						display: block;
						line-height: 20px;
						text-align: center;
					}
				}
			}
			.actives {
				color:#4278BE!important;
			}
		}
	}
</style>
