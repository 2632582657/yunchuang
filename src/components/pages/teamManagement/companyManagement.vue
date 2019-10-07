<template>
	<div class="company-manegement-container">
		<div class="area">
			<el-tree
				:data="data"
				node-key="id"
				ref="comtree"
				auto-expand-parent
				highlight-current
				:default-expanded-keys="showExpandedKeys"
				:default-checked-keys="showCheckeddKeys"
				@node-click="handleNodeClick"
			>
			</el-tree>
		</div>
	</div>
</template>
<script>
	import {moreListCom } from "vuex";
	export default {
		name: 'companyManagement',
		data() {
			const data = [
				{
					id:0,
					label: '团队管理',
					children:[
						{
							id: 1,
							label: 'OA',
							// icon:'el-icon-success',
							children: [
								// {
								// 	id: 11,
								// 	label: '考勤设置',
								// 	icon: 'el-icon-success',
								// 	isshow: 'false',
								// 	children: [
								// 		{
								// 			id: 111,
								// 			label: '打卡规则管理',
								// 			icon: 'el-icon-success',
								// 			isshow: 'false',
								// 		},
								// 		{
								// 			id: 112,
								// 			label: '请假类型管理',
								// 			icon: 'el-icon-success',
								// 			isshow: 'false',
								// 		},
								// 		{
								// 			id: 113,
								// 			label: '员工假期',
								// 			icon: 'el-icon-success',
								// 			isshow: 'false',
								// 		}
								// 	]
								// },
								// {
								// 	id: 12,
								// 	label: '考勤统计',
								// 	icon: 'el-icon-success',
								// 	isshow: 'false',
								// },
								{
									id: 13,
									label: '审批汇总',
									icon: 'el-icon-success',
									path: 'approvalSummary',
									isshow: 'false',
								},
								{
									id: 14,
									label: '汇报汇总',
									path: 'reportSummary',
									icon: 'el-icon-success',
									isshow : 'false'
								},
								// {
								// 	id: 15,
								// 	label: '文档管理',
								// 	icon: 'el-icon-success',
								// 	isshow : 'false',
								// },
								// {
								// 	id: 16,
								// 	label: '假期',
								// 	icon: 'el-icon-success',
								// 	isshow : 'false',
								// }
							]
						},

						// {
						// 	id: 2,
						// 	label: '公司管理',
						// 	// icon:'el-icon-success',
						// 	children: [
						// 		{
						// 			id: 23,
						// 			label: '公司号管理',
						// 			// path: 'comNumManage',
						// 			// icon: 'el-icon-success',
						// 			// isshow : 'false',
						// 			children: [
						// 				{
						// 					id: 231,
						// 					label: '公司号预览',
						// 					// path: 'comNumPreview',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false',
						// 					children:[
						// 						{
						// 							id: 2310,
						// 							label: '公司动态详情',
						// 							// path: 'comDymanicInfo',
						// 							icon: 'el-icon-success',
						// 							isshow : 'false'
						// 						},
						// 						{
						// 							id: 2311,
						// 							label: '产品展示详情',
						// 							// path: 'productInfo',
						// 							icon: 'el-icon-success',
						// 							isshow : 'false'
						// 						},
						// 						{
						// 							id: 2312,
						// 							label: '职位招聘详情',
						// 							// path: 'jobInfo',
						// 							icon: 'el-icon-success',
						// 							isshow : 'false'
						// 						}
						// 					]
						// 				},
						// 				{
						// 					id: 232,
						// 					label: '公司号-信息维护',
						// 					// path: 'comNumProtect',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false'
						// 				},
						// 				{
						// 					id: 233,
						// 					label: '公司号-产品列表',
						// 					// path: 'comNumPrductList',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false'
						// 				},
						// 				{
						// 					id: 234,
						// 					label: '新增/编辑产品',
						// 					// path: 'comNumEditPrduct',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false'
						// 				},
						// 				{
						// 					id: 235,
						// 					label: '公司号-招聘职位列表',
						// 					// path: 'comNumJobList',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false'
						// 				},
						// 				{
						// 					id: 236,
						// 					label: '新增/编辑招聘职位',
						// 					// path: 'jobEdit',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false'
						// 				},
						// 				{
						// 					id: 237,
						// 					label: '公司号-动态列表',
						// 					// path: 'comDynamic',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false'
						// 				},
						// 				{
						// 					id: 238,
						// 					label: '新增/编辑动态',
						// 					// path: 'comDynamicEdit',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false'
						// 				}
						//
						// 			]
						// 		},
						// 		{
						// 			id: 24,
						// 			label: '企业文化管理',
						// 			isshow : 'false',
						// 			// path: 'comCultrueMa',
						// 			icon: 'el-icon-success'
						// 		},
						// 		{
						// 			id: 25,
						// 			// path:'comRuleManagement',
						// 			label: '公司制度管理',
						// 			children: [
						// 				{
						// 					id: 261,
						// 					label: '制度列表',
						// 					// path: 'comRuleList',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false',
						// 				},
						// 				{
						// 					id: 262,
						// 					label: '新增制度',
						// 					// path: 'newRules',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false',
						// 				},
						// 				{
						// 					id: 263,
						// 					label: '编辑制度',
						// 					// path: 'editRules',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false',
						// 				},
						// 				{
						// 					id: 264,
						// 					label: '测试页面',
						// 					// path: 'testcomnumprotect',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false',
						// 				}
						//
						// 			]
						// 		},
						// 		{
						// 			id: 29,
						// 			// path:'noticeManagement',
						// 			label: '公告管理',
						// 			icon: 'el-icon-success',
						// 			isshow : 'false',
						// 			children: [
						// 				{
						// 					id: 291,
						// 					// path: 'sendNotice',
						// 					label: '发公告',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false',
						// 				},
						// 				{
						// 					id: 292,
						// 					// path: 'noticeInfo',
						// 					label: '公告詳情',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false',
						// 				},
						// 			]
						// 		},
						// 		{
						// 			id: 30,
						// 			label: '荣誉榜管理',
						// 			icon: 'el-icon-success',
						// 			children: [
						// 				{
						// 					id: 301,
						// 					// path: 'comHonorList',
						// 					label: '荣誉榜列表',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false',
						// 				},
						// 				{
						// 					id: 302,
						// 					// path: 'setHonorList',
						// 					label: '新增荣誉榜',
						// 					icon: 'el-icon-success',
						// 					isshow : 'false',
						// 				},
						// 			]
						// 		},
						// 		{
						// 			id: 31,
						// 			label: '企业内刊管理',
						// 			icon: 'el-icon-success',
						// 			// path: 'comGroup',
						// 			isshow : 'false'
						// 		},
						//
						//
						// 	]
						//
						// }
					]
				}

			]

			return {
				pap: {},
				index: [],
				path: [],
				node: this.$store.state.model.moreListCom||{},
				moreListCom: {},
				showExpandedKeys: [],
				showCheckeddKeys: [],
				data: JSON.parse(JSON.stringify(data)),
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			}
		},
		created() {

		},
		mounted() {
			this.initData()
		},
		methods: {
			initData(node) {
				this.showExpandedKeys = []
				this.showCheckeddKeys = []
				const nodel = node||JSON.parse(this.node)
				this.showExpandedKeys.unshift(nodel.pIdTwo)
				if (nodel.pIdOne) {
					this.showExpandedKeys.unshift(nodel.pIdOne)
				}
				if (nodel.children.id) {
					this.showExpandedKeys.push(nodel.cId)
					this.showCheckeddKeys.push(nodel.children.id)
					this.$router.push({name: nodel.children.path})
				} else {
					this.showCheckeddKeys.push(nodel.cId)
					this.$router.push({name: nodel.path})
				}
			},
			handleNodeClick(item, node) {
				// window.sessionStorage.removeItem('moreListCom')
				if (item.path && node.parent.data.id && node.parent.parent.data.id && node.parent.parent.parent.data.id===0) {
					this.moreListCom.pIdOne = node.parent.parent.parent.data.id
					this.moreListCom.pIdTwo = node.parent.parent.data.id
					this.moreListCom.cId = node.parent.data.id
					this.moreListCom.path = node.parent.data.path
					this.moreListCom.children = {}
					this.moreListCom.children.id = item.id
					this.moreListCom.children.path = item.path
					this.$router.push({name: this.moreListCom.children.path})

				}
				if (item.path && node.parent.data.id && node.parent.parent.data.id===0) {
					this.moreListCom.pIdOne = node.parent.parent.data.id
					this.moreListCom.pIdTwo = node.parent.data.id
					this.moreListCom.cId = item.id
					this.moreListCom.path = item.path
					this.moreListCom.children = ""
					this.$router.push({name: this.moreListCom.path})
				}
				if (item.path && node.parent.data.id===0) {
					this.moreListCom.pIdTwo = node.parent.data.id
					this.moreListCom.cId = item.id
					this.moreListCom.path = item.path
					this.moreListCom.children = ""
					this.$router.push({name: this.moreListCom.path})
				}
				this.$store.commit('moreListCom', JSON.stringify(this.moreListCom))
				// window.sessionStorage.setItem('moreListCom', JSON.stringify(this.moreListCom))

			},

		}
	}
</script>
<style lang="scss">
	/*.el-tree-node.is-checked.is-focusable {*/
	/*    color:blue;*/
	/*    font-size:20px;   */
	/*    .el-tree-node__children {*/
	/*        .is-checked {*/
	/*        color:#606266;*/
	/*        font-size:20px;   */
	/*        }*/
	/*    }*/
	/*}*/


	.el-tree-node.is-focusable {
		color: #606266;
	}

</style>
