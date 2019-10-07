import Vue from 'vue'
import Router from 'vue-router'
//注册
Vue.use(Router)
let router = new Router({
	routes: [
		{ //默认显示页面
			path: '/',
			redirect: '/home',
			component: resolve => require(["@/components/pages/index/index"], resolve),
			meta: {label: 'OA办公', icon: 'el-icon-s-tools'},
			children: [

				//OA-汇报管理
				{
					path: '/workReport',
					name: 'workReport',
					component: {
						render: c => c('router-view') // 这个路由是一个直接渲染了 router-view 标签的组件
					},
					meta: {label: '汇报'},
					children: [// 看汇报
						{
							path: '/lookReport',
							name: 'lookReport',
							meta: {label: '看汇报'},
							component: resolve => require(["@/components/pages/OA/workReport/lookReport/lookReport"], resolve),
						},
						{// 写汇报
							path: '/writeReport',
							name: 'writeReport',
							meta: {label: '写汇报'},
							component: resolve => require(["@/components/pages/OA/workReport/writeReport/writeReport"], resolve),
						},
						{// 汇报汇总
							path: '/reportSummary',
							name: 'reportSummary',
							meta: {label: '汇报汇总'},
							component: resolve => require(["@/components/pages/OA/workReport/reportSummary"], resolve),
						}, {// 汇报详情
							path: '/reportMessageDetail',
							name: 'reportMessageDetail',
							meta: {label: '消息详情'},
							component: resolve => require(["@/components/pages/OA/workReport/lookReport/reportMessageDetail"], resolve),
						}
					]
				},


				//OA-考勤审批管理
				{
					path: 'approvalModel',
					name: 'approvalModel',
					component: {
						render: c => c('router-view') // 这个路由是一个直接渲染了 router-view 标签的组件
					},
					meta: {label: '审批'},
					children: [// 发起审批
						{
							path: '/initiateApproval',
							name: 'initiateApproval',
							meta: {label: '发起审批'},
							component: resolve => require(["@/components/pages/OA/approvalManagement/initiateApproval"], resolve),
						},
						// 待我审批
						{
							path: '/awaitApproval',
							name: 'awaitApproval',
							meta: {label: '待我审批'},
							component: resolve => require(["@/components/pages/OA/approvalManagement/awaitApproval"], resolve),
						},
						// 我已审批
						{
							path: '/myApproval',
							name: 'myApproval',
							meta: {label: '我已审批'},
							component: resolve => require(["@/components/pages/OA/approvalManagement/myApproval"], resolve),
						},
						// 发起审批
						{
							path: '/launchApproval',
							name: 'launchApproval',
							meta: {label: '我发起的'},
							component: resolve => require(["@/components/pages/OA/approvalManagement/launchApproval"], resolve),
						},
						// 抄送我的
						{
							path: '/copyApproval',
							name: 'copyApproval',
							meta: {label: '抄送我的'},
							component: resolve => require(["@/components/pages/OA/approvalManagement/copyApproval"], resolve),
						},// 审批汇总
						{
							path: '/approvalSummary',
							name: 'approvalSummary',
							meta: {label: '审批汇总'},
							component: resolve => require(["@/components/pages/OA/approvalManagement/approvalSummary"], resolve),
						},
					]
				},
				// ===================================
				{
					path:'/schedule',
					name:'schedule',
					meta: {label: '日程'},
					component:resolve=>require(["@/components/pages/OA/schedule/schedule"],resolve)
				},
				// ==========================================
				// 帮助页面
				{
					path: '/help',
					name: 'help',
					component: resolve => require(["@/components/pages/help/help"], resolve),
					meta: {label: '帮助', icon: 'el-iconbangzhu1'},
				},

				// 消息页面
				{
					path: '/applyJoinCom',
					name: 'applyJoinCom',
					component: resolve => require(["@/components/pages/workMessage/publics/applyJoinCom"], resolve),
					meta: {label: '申请加入企业提醒', icon: 'el-iconbangzhu1'},
				},
				{
					path: '/workNotice',
					name: 'workNotice',
					component: resolve => require(["@/components/pages/workMessage/publics/workNotice"], resolve),
					meta: {label: '工作通知', icon: 'el-iconbangzhu1'},
				},
				{
					path: '/addTeamWorkNews',
					name: 'addTeamWorkNews',
					component: resolve => require(["@/components/pages/workMessage/publics/addTeamWorkNews"], resolve),
					meta: {label: '加入团队申请', icon: 'el-iconceshishenqing'},
				},
				{
					path: '/refuseInvita',
					name: 'refuseInvita',
					component: resolve => require(["@/components/pages/workMessage/publics/refuseInvita"], resolve),
					meta: {label: '邀请拒绝提醒', icon: 'el-icon-bell'},
				},
				{
					path: '/agreeInvita',
					name: 'agreeInvita',
					component: resolve => require(["@/components/pages/workMessage/publics/agreeInvita"], resolve),
					meta: {label: '邀请同意提醒', icon: 'el-icon-bell'},
				},
				{
					path: '/comNumReportNew',
					name: 'comNumReportNew',
					component: resolve => require(["@/components/pages/workMessage/publics/comNumReportNew"], resolve),
					meta: {label: '公司号消息', icon: 'el-icon-bell'},
				},
				{
					path: '/teamInvitation',
					name: 'teamInvitation',
					meta: {label: '邀请加入团队通知', icon: 'el-icon-bell'},
					component: resolve => require(["@/components/pages/workMessage/publics/teamInvitation"], resolve),
				},


				{
					path: '/addTeam',
					name: 'addTeam',
					component: resolve => require(["@/components/pages/mailList/publics/addTeam"], resolve),
					meta: {label: '加入团队申请', icon: 'el-iconceshishenqing'},
				},
				// 通讯录
				{
					path: '/mailList',
					name: 'mailList',
					component: resolve => require(["@/components/pages/mailList/mailList"], resolve),
					meta: {label: '通讯录', icon: 'el-icontuandui'},
					children: [
						{
							path: '/createTeam',
							name: 'createTeam',
							component: resolve => require(["@/components/pages/mailList/publics/createTeam"], resolve),
							meta: {label: '创建团队'},
						},
						{
							path: '/myTeam',
							name: 'myTeam',
							component: {
								render: c => c('router-view') // 这个路由是一个直接渲染了 router-view 标签的组件
							},
							meta: {label: '我的团队'},
							children: [
								{
									path: '/Company',
									name: 'Company',
									// component: resolve => require(["@/components/pages/mailList/publics/myCompany"], resolve),
									component: {
										render: c => c('router-view') // 这个路由是一个直接渲染了 router-view 标签的组件
									},
									meta: {label: 'TeamName'},
									children: [
										{
											path: '/myCompany',
											name: 'myCompany',
											component: resolve => require(["@/components/pages/mailList/publics/myCompany"], resolve),
											meta: {label: '团队信息'},
										},
										{
											path: '/frameWork',
											name: 'frameWork',
											component: resolve => require(["@/components/pages/mailList/publics/frameWork"], resolve),
											meta: {label: '组织架构'},
										},
										{
											path: '/moreSetting',
											name: 'moreSetting',
											component: resolve => require(["@/components/pages/mailList/publics/moreSetting"], resolve),
											meta: {label: '更多设置'},
										},
										{
											path: '/supervisor',
											name: 'supervisor',
											component: resolve => require(["@/components/pages/mailList/publics/supervisor"], resolve),
											meta: {label: '更换主管理员'},
										},
										{
											path: '/subadministrator',
											name: 'subadministrator',
											component: resolve => require(["@/components/pages/mailList/publics/subadministrator"], resolve),
											meta: {label: '设置子管理员'},
										},
									]
								}
							]
						},
						{
							path: '/joinTeam',
							name: 'joinTeam',
							component: {
								render: c => c('router-view') // 这个路由是一个直接渲染了 router-view 标签的组件
							},
							meta: {label: '加入团队'},
							children: [
								{
									path: '/searchTeam',
									name: 'searchTeam',
									component: resolve => require(["@/components/pages/mailList/publics/searchTeam"], resolve),
									meta: {label: '搜索团队'},
								},
								{
									path: '/applicationRecord',
									name: 'applicationRecord',
									component: resolve => require(["@/components/pages/mailList/publics/applicationRecord"], resolve),
									meta: {label: '申请记录'},
								},
							]
						}
					],
				},


				// 我的工作台
				{
					path: '/workBench',
					name: 'workBench',
					component: resolve => require(["@/components/pages/workBench/workBench"], resolve),
					meta: {label: '我的工作台', icon: 'el-icon-folder'},
				},

				{
					path: '/newUserPage',
					name: 'newUserPage',
					component: resolve => require(["@/components/pages/workMessage/publics/newUserPage"], resolve),
					// meta: { label: '我的工作台', icon: 'el-icon-folder' },
				},

			]
		},

		{//登录注册首页
			path: '/homePage',
			name: 'homePage',
			component: resolve => require(["@/components/pages/register/homePage"], resolve),
			meta: {
				requireAuth: true,  // 添加该字段，表示进入这个路由是不需要登录的
			},
		},
		{//注册
			path: '/register',
			name: 'register',
			component: resolve => require(["@/components/pages/register/register"], resolve),
			meta: {
				id: true,
				requireAuth: true,  // 添加该字段，表示进入这个路由是不需要登录的
			},

		},


		{//登录
			path: '/login',
			name: 'login',
			component: resolve => require(["@/components/pages/login/login"], resolve),
			meta: {
				requireAuth: true,  // 添加该字段，表示进入这个路由是不需要登录的
			},
		},
		{//忘记密码
			path: '/forgetPassword',
			name: 'forgetPassword',
			component: resolve => require(["@/components/pages/login/forgetPassword"], resolve),
			meta: {
				requireAuth: true,  // 添加该字段，表示进入这个路由是不需要登录的
			},
		},

		{//流程中心
			path: '/daily',
			name: 'daily',
			redirect: '/daily/dailyDay',
			component: resolve => require(["@/components/pages/Daily/Daily"], resolve),
			children: [
				{
					path: 'dailyDay',
					name: 'dailyDay',
					component: resolve => require(["@/components/pages/Daily/DailyDay"], resolve),
				},
				{
					path: 'dailyWeek',
					name: 'dailyWeek',
					component: resolve => require(["@/components/pages/Daily/DailyWeek"], resolve),
				},
				{
					path: 'dailyMonth',
					name: 'dailyMonth',
					component: resolve => require(["@/components/pages/Daily/DailyMonth"], resolve),
				}
			]
		},


		{//错误页面
			path: '/notFound',
			name: 'notFound',
			component: resolve => require(["@/components/commons/NotFound"], resolve)
		},
		{//错误页面
			path: '*',
			redirect: "/notFound",
			component: resolve => require(["@/components/commons/NotFound"], resolve)
		},
	]
})

router.beforeEach((to, from, next) => {
	if (!to.meta.requireAuth) {  // 判断该路由是否需要登录权限
		if (sessionStorage.getItem('token') && sessionStorage.getItem('teamEmployeeDetailVO')) {  // 通过vuex state获取当前的token是否存在
			next();
		} else {
			next({
				path: '/homePage',
				query: {
					redirect: to.fullPath
				}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
	} else {
		next();
	}
})
export default router;
