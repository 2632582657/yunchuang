<template>
	<div class="custom-tree-container OAPage">
		<div class="block">
			<el-tree
				:data="data"
				node-key="id"
				ref="oatree"
				:default-expanded-keys="expandedKeys"
				:default-checked-keys="checkedkeys"
				@node-click="handleNodeClick"
			>
			</el-tree>
		</div>
	</div>
</template>
<script>
import bus from '../../../../modules/bus'
	export default {
		data() {
			const data = [
				{
					id: 1,
					label: 'OA',
					// icon:'el-icon-success',
					children: [
						{
							id: 13,
							label: '汇报',
							// icon:'el-icon-success',
							is_show: 'false',
							children: [
								{
									id: 131,
									label: '写汇报',
									path: 'writeReport',
									// icon:'el-icon-success',
									is_show: 'false',
								},
								{
									id: 132,
									label: '看汇报',
									path: 'lookReport',
									// icon:'el-icon-success',
									is_show: 'false',
								},
								// {
								// 	id: 133,
								// 	label: '汇报汇总',
								// 	path: 'reportSummary',
								// 	// icon:'el-icon-success',
								// 	is_show: 'false',
								// },
							]
						},
						{
							id: 12,
							label: '审批',
							// icon:'el-icon-success',
							is_show: 'false',
							children: [
								{
									id: 121,
									label: '发起审批',
									path: 'initiateApproval',
									// icon:'el-icon-success',
									is_show: 'false',
								},
								{
									id: 122,
									label: '待我审批',
									path: 'awaitApproval',
									// icon:'el-icon-success',
									is_show: 'false',
								},
								{ 
									id: 123,
									label: '我已审批',
									path: 'myApproval',
									// icon:'el-icon-success',
									is_show: 'false',
								},
								{
									id: 124,
									label: '我发起的',
									path: 'launchApproval',
									// icon:'el-icon-success',
									is_show: 'false',
								},
								{
									id: 125,
									label: '抄送我的',
									path: 'copyApproval',
									// icon:'el-icon-success',
									is_show: 'false',
								}
							]
						},
						// {
						// 	id: 15,
						// 	label: '文档',
						// 	// icon:'el-icon-success',
						// 	is_show: 'false',
						// },
						{
							id: 14,
							label: '日程',
							path:'schedule',
							// icon:'el-icon-success',
							is_show: 'false',
						},
						// {
						// 	id: 16,
						// 	label: '假期',
						// 	// icon:'el-icon-success',
						// 	is_show: 'false',
						// }
					]
				}
			]
			return {
				moreListoa: {},
				node: window.sessionStorage.getItem('moreList') || {},
				expandedKeys: [],//默认展开的节点
				checkedkeys: [],//默认选中的节点
				data: JSON.parse(JSON.stringify(data)),
				userDetail: JSON.parse(sessionStorage.getItem("teamEmployeeDetailVO")),
			}
		},
		created () {
			this.queryApproveCount()
		},
		mounted() {
			this.initData()
			bus.$on('approvalStatus', msg => {
				console.log(msg)
				this.queryApproveCount()
			})
		},
		methods: {
			initData() {
				this.expandedKeys = []
				this.checkedkeys = []
				const nodel = JSON.parse(this.node)
				this.expandedKeys.push(nodel.pId)
				if (nodel.children.id) {
					this.expandedKeys.push(nodel.cId)
					this.checkedkeys.push(nodel.children.id)
					// this.$router.push({name:nodel.children.path})

				} else {
					this.checkedkeys.push(nodel.cId)
					// this.$router.push({name:nodel.path})
				}
				// this.$refs.oatree.setCheckedKeys([1,11,121],false)
			},
			handleNodeClick(item, node) {
				if (item.path && node.parent.data.id && node.parent.parent.data.id) {
					this.moreListoa.pId = node.parent.parent.data.id
					this.moreListoa.cId = node.parent.data.id
					this.moreListoa.path = node.parent.data.path
					this.moreListoa.children = {}
					this.moreListoa.children.id = item.id
					this.moreListoa.children.path = item.path
					this.$router.push({name:this.moreListoa.children.path})
				}
				if (item.path && node.parent.data.id &&!node.parent.parent.data.id) {
					this.moreListoa.pId = node.parent.data.id
					this.moreListoa.cId = item.id
					this.moreListoa.path = item.path
					this.$router.push({name:this.moreListoa.path})
				}
				this.queryApproveCount()
				if(this.moreListoa.cId) {
					window.sessionStorage.setItem('moreList', JSON.stringify(this.moreListoa))
				}

			},
			queryApproveCount () {
				this.$http({
					method:'GET',
					url:`/oaManager/v1/feign/oa/approve/queryApproveCount/${this.userDetail.id}`,
				}).then(res => {
					if (res.data.code == 200) {
						var approveMyWait = this.recursion(this.data,122)
						var approveRecipientsUnread = this.recursion(this.data,125)
						// var approveFinished = this.recursion(this.data,123)
						approveMyWait.label = res.data.data.approveMyWaitCount == 0 ? '待我审批' : `待我审批(${res.data.data.approveMyWaitCount})`
						approveRecipientsUnread.label = res.data.data.approveRecipientsUnreadCount == 0 ? '抄送我的' : `抄送我的(${res.data.data.approveRecipientsUnreadCount})`
						// approveFinished.label = res.data.data.approveFinishedCount == 0 ? '我已审批' : `我已审批(${res.data.data.approveFinishedCount})`
					}else {
						this.$message({
							type:'error',
							message:res.data.message
						})
					}
				})
			},
			recursion(data, id) {
				let result;
				if (!data) {
					return;
				}
				for (var i = 0; i < data.length; i++) {
					let item = data[i];
					if (item.id === id) {
						result = item;
						break;
					} else if (item.children && item.children.length > 0) {
						result = this.recursion(item.children, id);
					}
				}
				return result;
			},
		}
	}
</script>
<style>
.OAPage .el-tree-node__content {
    height: 38px;
}
.OAPage .el-tree-node>.el-tree-node__children {
    overflow: visible;
}
</style>
