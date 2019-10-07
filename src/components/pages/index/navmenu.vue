<template>
	<div class="home">
		<div class="nav-left">
			<div
				:class="{active:active[key]}"
				v-for="(item,key) in tab"
				@click.stop="toggleTabs(key)"
				:key="key"
				class="nav-box">
				<p class="nav-icons" v-if="key === 0">
					<i :class="item.icons" alt class="img1"></i>
					<template v-if="msgCount === 0">
						<el-badge :value="msgCount" class="item" hidden>
						</el-badge>
					</template>
					<template v-else>
						<el-badge :value="msgCount" class="item">
						</el-badge>
					</template>
					<i class="img2"></i>
				</p>
				<p class="nav-icons" v-else>
					<i :class="item.icons" alt class="img1"></i>
					<i class="img2"></i>
				</p>
				<em>{{item.content}}</em>
			</div>
			<div class="app_more" v-show="dialog" ref="appMore" @click="dialog = true">
				<div>
					<div class="tab-content">
						<ul>
							<li class="tab_list" v-for="(item, index) in comDataOa" :key="index">
								<p class="tab_application">{{item.label}}</p>
								<div class="tab-item" @click.stop="transfFunc(item)">
									<div class="tab_module" ref="module" v-for="(itemc, indexc) in item.children"
										 :key="indexc"
										 @click="turnMore(itemc);">
										<div class="img-box">
											<img :src="itemc.url">
										</div>
										<span>{{itemc.label}}</span>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="it_store" :class="{active:exchange[3]}" @click.stop="changeStyle(3);toggleComFlag()">
				<p class="nav-icons">
					<!-- <img src="../../../assets/logo.png" alt class="img1"> -->
					<i class="el-iconguanli-fill img1"></i>
					<i class="img2"></i>
				</p>
				<em>团队管理</em>
			</div>
			<div class="app_more com_manage" id="com_manage" v-show="comFlag=dialog?!dialog:comFlag" ref="funcMore"
				 @click="comFlag = true">
				<div>
					<!-- 推荐这种写法-->
					<div class="tab-content">
						<ul>

							<li class="tab_list" v-for="(item, index) in comData" :key="index">
								<p class="tab_application">{{item.label}}</p>
								<div class="tab-item" @click.stop="transfComDate(item)">
									<div class="tab_module" ref="module" v-for="(itemc, indexc) in item.children"
										 :key="indexc"
										 @click="turnComData(itemc);">
										<div class="img-box">
											<img :src="itemc.url">
										</div>
										<span>{{itemc.label}}</span>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="email_store" :class="{active:exchange[4]}" @click="changeStyle(4)">
				<p class="nav-icons">
					<!-- <img src="../../../assets/logo.png" alt class="img1"> -->
					<i class="el-iconyouxiang img1"></i>
					<i class="img2"></i>
				</p>
				<em>邮箱</em>
			</div>
			<div class="app_store" :class="{active:exchange[1]}" @click="changeStyle(1)">
				<p class="nav-icons">
					<!-- <img src="../../../assets/logo.png" alt class="img1"> -->
					<i class="el-iconshoppingbag img1"></i>
					<i class="img2"></i>
				</p>
				<em>应用商店</em>
			</div>
			<div class="yc_help" :class="{active:exchange[2]}" @click="changeStyle(2)">
				<p class="nav-icons">
					<i class="el-iconbangzhu1 img1"></i>
					<i class="img2"></i>
				</p>
				<em>帮助</em>
			</div>
		</div>
		<div class="right-con" ref="rightCon">
			<keep-alive include="dialogue">
				<dialogue :is="currentView" v-if="!showFlag"></dialogue>
				<companyManagement v-else ref="com" :node="nodeList"></companyManagement>
			</keep-alive>
		</div>
	</div>
</template>
<script>
	import bus from '../../../modules/bus'
	import dialogue from './publics/dialogue'
	import homepage from './publics/homePage'
	import ycmessage from './publics/ycMessage'
	import OAPage from './publics/OAPage'
	import comPage from './publics/company'
	// import management from './publics/management'
	import mailList from './publics/mailList'
	import workBench from '../workBench/workBench'
	import companyManagement from '../teamManagement/companyManagement'
import schedule from '../OA/schedule/schedule.vue'

	export default {
		name: 'navmenu',
		components: {
			dialogue,
			homepage,
			ycmessage,
			// management,
			mailList,
			workBench,
			companyManagement,
			OAPage,
			comPage,
			schedule
		},

		data() {
			return {
				msgCount:0,  //消息总的未读消息数
				nodeList: {},
				moreList: {},
				// message: 3,
				tabc: '',//存储上一次的侧边栏记录
				comFlag: false,//企业管理的弹框开关
				dialog: false,
				showFlag: false, //企业管理侧边栏数图显示开关
				currentView: window.sessionStorage.getItem('currentView') || 'dialogue',
				exchange: [false, false, false, false, false],
				active: [false, false, false, false, false], //统一管理状态;
				tab: [
					{
						content: '消息', //tab-span
						func: 'dialogue',
						icons: 'el-icon-message-solid'
					},
					// {
					// 	content: '聊天',
					// 	func: 'ycmessage',
					// 	icons: 'el-icon-chat-line-round'
					// },
					// {
					// 	content: '主页',
					// 	func: 'homepage',
					// 	icons: 'el-icon-s-home'
					// },
					{
						content: '我的工作台',
						func: 'workBench',
						icons: 'el-icon-folder'
					},
					// {
					// 	content: 'OA系统',
					// 	func: 'oasystem',
					// 	icons: 'el-icon-s-tools'
					// },
					{
						content: '通讯录',
						func: 'mailList',
						icons: 'el-iconaddressbook'
					},
					{
						content: '',
						func: '',
						icons: 'el-icon-more'
					},
				],
				tabTitle: ['xx系统1', 'xx系统2', 'xx系统3'],
				comDataOa: [
					{
						id: 1,
						label: 'OA',
						icon: 'el-icon-success',
						func: 'OAPage',
						children: [
							{
								id: 11,
								label: '考勤',
								icon: 'el-icon-success',
								url: require('../../../../static/three/kaoqin.svg'),
								isshow: 'false',
							},
							{
								id: 12,
								label: '审批',
								path: 'approvalModel',
								url: require('../../../../static/three/shenpi.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
								children: [
									{
										id: 121,
										label: '发起审批',
										path: 'initiateApproval',
										icon:'el-icon-success',
										is_show: 'false',
									},
									{
										id: 122,
										label: '待我审批',
										path: 'awaitApproval',
										icon:'el-icon-success',
										is_show: 'false',
									},
									{
										id: 123,
										label: '我已审批',
										path: 'myApproval',
										icon:'el-icon-success',
										is_show: 'false',
									},
									{
										id: 124,
										label: '我发起的',
										path: 'launchApproval',
										icon:'el-icon-success',
										is_show: 'false',
									},
									{
										id: 125,
										label: '抄送我的',
										path: 'copyApproval',
										icon:'el-icon-success',
										is_show: 'false',
									}
								]

							},
							{
								id: 13,
								label: '汇报',
								path: 'workReport',
								url: require('../../../../static/three/huibao.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
								children: [
									{
										id: 131,
										label: '写汇报',
										path: 'writeReport',
										url: '../../../assets/logo.png',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 132,
										label: '看汇报',
										path: 'lookReport',
										url: '../../../assets/logo.png',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									// {
									// 	id: 132,
									// 	label: '汇报汇总',
									// 	path: 'reportSummary',
									// 	url: '../../../assets/logo.png',
									// 	icon: 'el-icon-success',
									// 	isshow: 'false',
									// },
								]
							},
							// =================================
							{
								id: 14,
								label: '日程',
								url: require('../../../../static/three/richeng.svg'),
								path:'schedule',
								icon: 'el-icon-success',
								isshow: 'false',
							},
							// =================================
							{
								id: 15,
								label: '文档',
								url: require('../../../../static/three/wendang.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
							},
							{
								id: 16,
								label: '假期',
								url: require('../../../../static/three/jiaqi.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
							},
							{
								id: 22,
								label: '企业公告',
								url: require('../../../../static/three/gonggao.svg'),
								// path: 'dataExports',
								icon: 'el-icon-success',
								isshow: 'false',
							},
						]
					},
					{
						id: 2,
						label: '公司',
						func: 'comPage',
						// icon:'el-icon-success',
						children: [
							{
								id: 21,
								label: '公司号',
								url: require('../../../../static/three/company.svg'),
								// path: 'reportSummary',
								icon: 'el-icon-success',
								isshow: 'false'
							},

							{
								id: 23,
								url: require('../../../../static/three/icon_cultrue.svg'),
								label: '企业文化',
								// path: 'comNumManage',
								// icon: 'el-icon-success',
								// isshow : 'false',

							},
							{
								id: 24,
								label: '企业制度',
								url: require('../../../../static/three/icon_zhidu.svg'),
								icon: 'el-icon-success',
							},
							{
								id: 25,
								url: require('../../../../static/three/icon_neikan.svg'),
								label: '企业内刊',
							},
							{
								id: 26,
								url: require('../../../../static/three/icon_rongyubang.svg'),
								label: '荣誉榜',
							}

						]

					},
					{
						id: 3,
						label: 'CRM',
						func: 'crmPage',
						// icon:'el-icon-success',
						children: [
							{
								id: 31,
								label: '活动',
								url: require('../../../../static/three/huodong.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
							},
							{
								id: 32,
								label: '线索',
								url: require('../../../../static/three/xiannsuo.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
							},
						]
					},
					{
						id: 4,
						label: 'HRM',
						func: 'hrmPage',
						// icon:'el-icon-success',
						children: [
							{
								id: 41,
								label: '员工信息',
								url: require('../../../../static/three/xinxi.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
							},
							{
								id: 42,
								label: '绩效',
								url: require('../../../../static/three/jixiao.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
							},
							{
								id: 43,
								label: '招聘',
								url: require('../../../../static/three/icon_zhaopin.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
							},
							{
								id: 44,
								label: '培训',
								url: require('../../../../static/three/peixun.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
							}
						]

					},
					{
						id: 5,
						label: 'PM',
						func: 'pmPage',
						// icon:'el-icon-success',
						children: [
							{
								id: 51,
								label: '立项',
								url: require('../../../../static/three/lixiang.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
							},
							{
								id: 52,
								label: '转办',
								url: require('../../../../static/three/zhuanban.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
							},
						]

					},
					{
						id: 6,
						label: '财务',
						func: 'fiananciPage',
						// icon:'el-icon-success',
						children: [
							{
								id: 61,
								label: '预算',
								url: require('../../../../static/three/yusuan.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
							},
							{
								id: 62,
								label: '结算',
								url: require('../../../../static/three/jiesuan.svg'),
								icon: 'el-icon-success',
								isshow: 'false',
							},
						]

					}

				],
				comData: [
					{
						id: 1,
						label: 'OA',
						// icon:'el-icon-success',
						children: [
							{
								id: 11,
								label: '考勤设置',
								// path: 'setting',
								url:require('../teamManagement/image/popupWindow/kaoqinshezhi.svg'),
								isshow: 'false',
								children: [
									{
										id: 111,
										label: '打卡规则管理',
										// path: 'rules',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 112,
										label: '请假类型管理',
										// path: 'manage',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 113,
										label: '员工假期',
										// path: 'holiday',
										icon: 'el-icon-success',
										isshow: 'false',
									}
								]
							},
							{
								id: 12,
								label: '考勤统计',
								url:require('../teamManagement/image/popupWindow/kaoqintongji.svg'),
								// path: 'attendSub',
								isshow: 'false',
							},
							{
								id: 13,
								label: '审批汇总',
								url:require('../teamManagement/image/popupWindow/shenpihuizong.svg'),
								path: 'approvalSummary',
								isshow: 'false',
							},
							{
								id: 14,
								label: '汇报汇总',
								path: 'reportSummary',
								url:require('../teamManagement/image/popupWindow/huibaohuizong.svg'),
								isshow : 'false'
							},
							{
								id: 15,
								label: '文档管理',
								url:require('../teamManagement/image/popupWindow/wendangguanli.svg'),

								isshow : 'false',
							},
							{
								id: 16,
								label: '假期管理',
								url:require('../teamManagement/image/popupWindow/jiaqiguanli.svg'),
								isshow : 'false',
							},
							{
								id: 29,
								// path:'noticeManagement',
								label: '公告管理',
								url:require('../teamManagement/image/popupWindow/gonggaoguanli.svg'),
								isshow: 'false',
								children: [
									{
										id: 291,
										// path: 'sendNotice',
										label: '发公告',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 292,
										// path: 'noticeInfo',
										label: '公告詳情',
										icon: 'el-icon-success',
										isshow: 'false',
									},
								]
							},
						]


					},
					{
						id: 2,
						label: '公司管理',
						// icon:'el-icon-success',
						children: [
							{
								id: 23,
								label: '公司号管理',
								// path: 'comNumManage',
								url:require('../teamManagement/image/popupWindow/companyguanli.svg'),

								// icon: 'el-icon-success',
								// isshow : 'false',
								children: [
									{
										id: 231,
										label: '公司号预览',
										// path: 'comNumPreview',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 232,
										label: '公司号-信息维护',
										// path: 'comNumProtect',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 233,
										label: '公司号-产品列表',
										// path: 'comNumProduct',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 234,
										label: '公司号-招聘职位列表',
										// path: 'comNumJobList',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 235,
										label: '新增/编辑招聘职位',
										// path: 'jobEdit',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 236,
										label: '公司号-动态列表',
										// path: 'comDynamic',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 237,
										label: '新增/编辑动态',
										// path: 'comDynamicEdit',
										icon: 'el-icon-success',
										isshow: 'false',
									},
								]
							},
							{
								id: 24,
								label: '公司文化管理',
								url:require('../teamManagement/image/popupWindow/cultrueguanli.svg'),
								children: [
									{
										id: 241,
										label: '文化首页',
										// path: 'cultrueIndex',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 242,
										label: '文化列表',
										// path: 'comCultrueList',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 243,
										label: '新增/编辑文章',
										// path: 'articleEdit',
										icon: 'el-icon-success',
										isshow: 'false',
									}
								]
							},
							{
								id: 25,
								label: '公司制度管理',
								url:require('../teamManagement/image/popupWindow/zhiduguanli.svg'),
								children: [
									{
										id: 261,
										label: '制度列表',
										// path: 'comRuleList',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 262,
										label: '新增制度',
										// path: 'newRules',
										icon: 'el-icon-success',
										isshow: 'false',
									},
									{
										id: 263,
										label: '编辑制度',
										// path: 'editRules',
										icon: 'el-icon-success',
										isshow: 'false',
									}

								]
							},
							{
								id: 31,
								label: '公司内刊管理',
								url:require('../teamManagement/image/popupWindow/neikanguanli.svg'),

								// path: 'comGroup',
								isshow : 'false'
							},
						]

					}
				],
				cur: 0, //默认选中第一个tab
				curOa: 0,//组织框架三个点
				adminInfo: JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO'))
			}
		},
		created() {
			// this.tab[this.tab.length - 1].func = window.sessionStorage.getItem('itemfunc') || ''
			this.editStatus()
			this.showFlag = window.sessionStorage.getItem('showF')||false

		},
		methods: {
			//向更多功能侧边栏传数据
			turnMore(item) {
				if(item.path) {
					this.moreList.cId = item.id
					this.moreList.path = item.path
					if (item.children) {
						this.moreList.children = {}
						this.moreList.children.id = item.children[0].id
						this.moreList.children.path = item.children[0].path
						this.$router.push({name:this.moreList.children.path})
						return
					}
					this.$router.push({name:this.moreList.path})
					this.moreList.children = ''
				}else {
					this.moreList = {}
					this.$message.warning('待开放,敬请期待')
				}
				// this.$router.push({name: item.func});
			},
			//团队管理侧边栏传数据
			turnComData(item) {
				if(item.path) {
					this.nodeList = {}
					this.nodeList.cId = item.id
					this.nodeList.path = item.path
					if (item.children) {
						this.nodeList.children = {}
						this.nodeList.children.id = item.children[0].id
						this.nodeList.children.path = item.children[0].path
						return
					}
					this.nodeList.children = ''
				}else {
					this.nodeList = {}
					this.$message.warning('待开放,敬请期待')

				}
			},

			//更多功能联动显示侧边栏的开关
			transfFunc(item) {
				if(!this.moreList.cId) {
					return
				}
				this.moreList.pId = item.id
				this.tab[this.tab.length - 1].func = "'" + item.func + "'"
				this.currentView = item.func
				this.dialog = false
				//如果页面跳转有问题接吧注释打开====在create初始化中也打开对应的注释
				// window.sessionStorage.setItem('itemfunc', item.func)
				window.sessionStorage.setItem('currentView', item.func)
				window.sessionStorage.setItem('moreList', JSON.stringify(this.moreList))
			},
			//团队管理弹窗联动显示侧边栏的开关
			transfComDate(item) {
				if(!this.nodeList.cId) {
					window.sessionStorage.setItem('currentView',this.tabc)
					return
				}
				this.nodeList.pIdOne = 0
				this.nodeList.pIdTwo = item.id
				this.comFlag = false
				this.showFlag = true
				this.$nextTick(()=> {
					this.$refs.com.initData(this.nodeList)
				})
				this.$store.commit('moreListCom', JSON.stringify(this.nodeList))
				window.sessionStorage.setItem('moreListCom', JSON.stringify(this.nodeList))
				window.sessionStorage.setItem('showF', this.showFlag)

				//
				// this.$nextTick(()=> {
				// 	this.$refs.com.initData(this.nodeList)
				//
				// })
			},
			editStatus() {
				bus.$on('navmenuStatus', (status) => {
					this.toggleTabs(status)
					this.transfFunc()
					// this.comFlag = false//企业管理的弹框开关

				})
			},
			toggleTabs(tabContent) {
				this.comFlag = false

				this.showFlag = false
				window.sessionStorage.removeItem('showF')
				this.$store.commit("moreListCom",'')
				window.sessionStorage.removeItem('moreListCom')
				for (var i = 0; i < this.active.length; i++) {
					this.active[i] = false
					this.exchange = [false, false]
					this.active[tabContent] = true
					this.currentView = this.tab[tabContent].func
				}
				this.$refs.rightCon.style.display = 'block'
				if (tabContent === 0) {
					window.sessionStorage.setItem('currentView', 'dialogue')
					this.tabc = this.tab[tabContent].func

					// window.sessionStorage.setItem('currentView', 'comFlag')
					this.$router.push({name: 'newUserPage'});
				}
				// if (tabContent === 1) {
				// 	window.sessionStorage.setItem('currentView', 'ycmessage')
				// 	this.tabc = this.tab[tabContent].func

				// }
				// if (tabContent === 2) {
				// 	window.sessionStorage.setItem('currentView', 'homepage')
				// 	this.tabc = this.tab[tabContent].func

				// 	this.$router.push({name: 'home'});
				// }
				if (tabContent === 1) {
					this.$message({
						type:'warning',
						message:'待开放，敬请期待'
					})
					// window.sessionStorage.setItem('currentView', 'workBench')
					this.tabc = this.tab[tabContent].func

					// this.$refs.rightCon.style.display = 'none'
					// this.$router.push({name: 'workBench', params: {id: tabContent}});
				}
				// if (tabContent === 4) {
				// 	window.sessionStorage.setItem('currentView', 'oasystem')
				// 	this.tabc = this.tab[tabContent].func
				// }
				if (tabContent === 2) {
					window.sessionStorage.setItem('currentView', 'mailList')
					this.tabc = this.tab[tabContent].func
					if (this.adminInfo.companyName != '') {
						this.$router.push({name: 'frameWork'})
						this.$store.commit('currentKey', 'frameWork')
					}
				}
				if (tabContent === 3) {
					this.dialog = !this.dialog
					this.currentView = this.tabc || 'dialogue'
					window.sessionStorage.setItem('currentView',this.currentView)
					return
				}
				this.dialog = false
			},
			toggleComFlag(e) {
				this.dialog = false
				this.comFlag = !this.comFlag

			},
			changeStyle(key) {
				for (var i = 0; i < this.exchange.length; i++) {
					this.active = [false, false, false, false, false]
					this.exchange[i] = false
					this.exchange[key] = true
				}
				if (key === 2) {
					this.$message({
						type:'warning',
						message:'待开放，敬请期待'
					})
					// this.$refs.rightCon.style.display = 'none'
					// this.$router.push({name: 'help', params: {id: key}});
				}
				if (key === 3) {
					// this.$refs.rightCon.style.display = 'none'
					// const path = this.$route.name
					// this.$router.push({name:comanage,params:{name:'/comMange'}});
				}
			},
			hideTitle(e) {
				if (!this.$refs.rightCon.contains(e.target)) {
					this.$refs.rightCon.style.display = 'none'
				}
			},
			hideMoreApp(e) {
				if (!this.$refs.appMore.contains(e.target)) {
					this.dialog = false
				}
				if (!this.$refs.funcMore.contains(e.target)) {
					this.comFlag = false
				}
			}

		},
		mounted() {
			// this.console()
			window.onresize = () => {
				return (() => {
					if (document.body.clientWidth < 940) {
						this.$refs.rightCon.style.display = 'none'
						document.addEventListener('click', this.hideTitle)
					} else {
						this.$refs.rightCon.style.display = 'block'
						if (this.$route.params.id == 2 || this.$route.params.id == 3) {
							this.$refs.rightCon.style.display = 'none'
						}
						document.removeEventListener('click', this.hideTitle)
					}
				})();
			};
			document.addEventListener('click', this.hideMoreApp)
			bus.$on('msgCount', msg=>{
				this.msgCount = msg
			})

			bus.$on('pushRefresh', msg => {
				this.currentView = 'mailList'
				window.sessionStorage.setItem('currentView', 'mailList')
			})
		},
		beforeDestroy() {
			document.removeEventListener('click', this.hideTitle)
			document.removeEventListener('click', this.hideMoreApp)
		}
	}
</script>
<style lang="scss">
	.home {
		position: relative;
		display: flex;
		background-color: #485365;
		height: 100%;
		color: #ffffff;
		// display: flex;
		// overflow: hidden;
	}

	.nav-left {
		// position: relative;
		float: left;
		width: 81px;
		height: 100%;

		.nav-icons {
			text-align: center;

			.img1 {
				display: inline-block;
				font-size: 20px;
			}

			.el-icon-more {
				margin-top: 10px;
			}
		}

		em {
			text-align: center;
			font-style: normal;
			display: block;
		}
	}

	.nav-left > .nav-box {
		height: 67px;
		box-sizing: border-box;
		padding-top: 10px;
	}

	.nav-left > div.active {
		background-color: #626F82;

		.img2 {
			position: absolute;
			left: 0;
			top: 0;
			display: inline-block;
			height: 67px;
			width: 5px;
			// background: url('../../../assets/logo.png')no-repeat;
			background-color: #999DA6;
			transition: all 0.3s linear;
			// background-size: 100%;
			// background-position: 50% 50%;
		}
	}

	.nav-box {
		position: relative;
	}

	.nav-box .el-badge {
		position: absolute;
		top: 4px;
		right: 15px;
	}

	.right-con {
		background-color: #ffffff;
		color: black;
		float: right;
		width: 360px;
		flex: 1;
		height: 100%;
		// @media screen and (max-width: 940px) {
		//     display: none
		// }
	}

	.nav-box:hover, .app-bar-link:hover, .app_store:hover, .yc_help:hover, .email_store:hover, .it_store:hover {
		cursor: pointer;
		background-color: #626F82;
	}

	.app-bar-link {
		position: relative;
		height: 67px;
		width: 81px;
		line-height: 35px;
		text-align: center;
	}

	.home .app_more {
		font-family: 'Microsoft YaHei UI';
		position: fixed;
		overflow-x: hidden;
		overflow-y: scroll;
		left: 83px;
		top: 232px;
		background-color: #F8F8F8;
		max-height: 487px;
		width: 678px;
		border-radius: 4px;
		z-index: 999;
		box-shadow:1px 1px 4px 0px rgba(191,194,204,0.7);
		&::-webkit-scrollbar {
			width: 10px;
			height: 1px;
		}

		&::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
			width: 10px;
			border-radius: 5px;
			height: 14px;
			min-height: 20px;
			background: #EDEFF2;
		}

		&::-webkit-scrollbar-track {
			border-radius: 0;
			background: rgba(0, 0, 0, 0)
		}

	}

	// 企业管理
	.home .com_manage {
		overflow: scroll;
		top: 380px;
	}

	.home .app_search {
		position: relative;
		padding: 0 20px;
	}

	.home .app_search input {
		height: 38px;
		width: 100%;
		padding-left: 20px;
		border-radius: 4px 4px 0 0;
		border: none;
		border-bottom: 2px blue solid;
	}

	.home .app_search .el-icon-search {
		position: absolute;
		font-size: 18px;
		right: 30px;
		top: 10px;
		color: black;
	}

	.home .tab-tilte {
		width: 100%;
		padding: 0 20px;
		margin-top: 15px;
		overflow: hidden;
		border-bottom: 1px solid #CCC;
		color: black;
	}

	.home .tab-tilte li {
		float: left;
		width: 18%;
		margin-right: 20px;
		text-align: center;
		cursor: pointer;
	}

	.home .tab_application {
		display: block;
		margin: 14px 0 10px 18px;
		width: 100px;
		height: 13px;
		line-height: 13px;
		border-radius: 2px;
		border-left: 5px solid #4278BE;
		padding-left: 10px;
		color: #303133;
		font-size: 16px;
		text-align: left;
	}

	.home .tab_module {
		// position: relative;
		// height: 40px;
		overflow: hidden;
		width: 111px;
		height: 111px;
		padding-top: 25px;
		cursor: pointer;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		color: black;
		border: 1px solid #EDEFF2;
		border-left: none;
		text-align: center;
		// display: flex;
		// flex-direction: column;
		// justify-content: space-around;
		span {
			color: #303133;
			font-size: 16px;
		}
	}

	// .home .tab_module:hover {
	//     background-color: cadetblue
	// }
	.img-box {
		width: 100%;
		height: 33px;
		margin-bottom: 10px;
	}

	.home .tab_module img {
		display: inline-block;
		width: 30px;
		height: 33px;
	}

	// .home .tab_module span {
	//     float: left;
	// }
	.home .tab_module .el-icon-more {
		position: relative;
		// margin-top: 11px;
		line-height: 40px;
		float: right;
		margin-right: 10px;
		cursor: default;
	}

	/* 点击对应的标题添加对应的背景颜色 */
	.home .tab-tilte .active {
		// background-color: #09f;
		color: blue;
		border-bottom: 3px blue solid;
	}

	.home .tab-content {

	}

	.home .tab-content .tab_list {
		padding-top: 10px;
	}

	.home .tab-content .tab_list .tab-item {
		display: flex;
		display: -webkit-flex;
		flex-wrap: wrap;
	}

	//  阻止  卸载 定位
	.home .tab_position {
		position: absolute;
		width: 200px;
		height: 110px;
		top: 158px;
		right: -141px;
		border-radius: 4px;
		background-color: #cccccc;
		z-index: 999;
	}

	.home .tab_position li {
		overflow: hidden;
	}

	// .home .more_pplication {
	//     padding: 0 20px;
	//     margin-top: 15px;
	//     overflow: hidden;
	//     color: black;
	// }
	// .home .more_pplication  img {
	//     float: left;
	// }
	// .home .more_pplication  span {
	//     float: left;
	//     margin-left: 10px;
	// }
	.home .app_store {
		position: absolute;
		height: 67px;
		width: 81px;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		padding-top: 10px;
		bottom: 87px;

		.nav-icons {
			text-align: center;

			.img1 {
				display: inline-block;
				width: 24px;
				height: 24px;
			}
		}

		em {
			text-align: center;
			font-style: normal;
			display: block;
		}
	}

	.home .it_store {
		position: absolute;
		height: 67px;
		width: 81px;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		padding-top: 10px;
		bottom: 221px;

		.nav-icons {
			text-align: center;

			.img1 {
				display: inline-block;
				width: 24px;
				height: 24px;
			}
		}

		em {
			text-align: center;
			font-style: normal;
			display: block;
		}
	}

	.home .email_store {
		position: absolute;
		height: 67px;
		width: 81px;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		padding-top: 10px;
		bottom: 154px;

		.nav-icons {
			text-align: center;

			.img1 {
				display: inline-block;
				width: 24px;
				height: 24px;
			}
		}

		em {
			text-align: center;
			font-style: normal;
			display: block;
		}
	}

	.home .yc_help {
		position: absolute;
		height: 67px;
		width: 81px;
		text-align: center;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		padding-top: 10px;
		bottom: 20px;

		.nav-icons {
			text-align: center;

			.img1 {
				display: inline-block;
				width: 24px;
				height: 24px;
			}
		}

		em {
			text-align: center;
			font-style: normal;
			display: block;
		}
	}

	.home .app-bar-link > .active {
		background-color: #626F82;

		.img2 {
			position: absolute;
			left: 0;
			top: 0;
			display: inline-block;
			height: 67px;
			width: 5px;
			// background: url('../../../assets/logo.png')no-repeat;
			background-color: #999DA6;
			transition: all 0.3s linear;
			// background-size: 100%;
			// background-position: 50% 50%;
		}
	}

	.home .app_store > div.active {
		background-color: #626F82;

		.img2 {
			position: absolute;
			left: 0;
			top: 0;
			display: inline-block;
			height: 67px;
			width: 5px;
			// background: url('../../../assets/logo.png')no-repeat;
			background-color: #999DA6;
			transition: all 0.3s linear;
			// background-size: 100%;
			// background-position: 50% 50%;
		}
	}

	.home .it_store > div.active {
		background-color: #626F82;

		.img2 {
			position: absolute;
			left: 0;
			top: 0;
			display: inline-block;
			height: 67px;
			width: 5px;
			// background: url('../../../assets/logo.png')no-repeat;
			background-color: #999DA6;
			transition: all 0.3s linear;
			// background-size: 100%;
			// background-position: 50% 50%;
		}
	}

	.home .email_store > div.active {
		background-color: #626F82;

		.img2 {
			position: absolute;
			left: 0;
			top: 0;
			display: inline-block;
			height: 67px;
			width: 5px;
			// background: url('../../../assets/logo.png')no-repeat;
			background-color: #999DA6;
			transition: all 0.3s linear;
			// background-size: 100%;
			// background-position: 50% 50%;
		}
	}

	.home .yc_help > div.active {
		background-color: #626F82;

		.img2 {
			position: absolute;
			left: 0;
			top: 0;
			display: inline-block;
			height: 67px;
			width: 5px;
			// background: url('../../../assets/logo.png')no-repeat;
			background-color: #999DA6
			// background-size: 100%;
			// background-position: 50% 50%;
		}
	}
</style>
