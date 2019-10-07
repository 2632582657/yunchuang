<template>
	<div class="custom-tree-container company">
		<div class="block">
			<el-tree
				:data="data"
				node-key="id"
				ref="comtree"
				:default-expanded-keys="expandedKeys"
				:default-checked-keys="comCheckedkeys"
				@node-click="handleNodeClick"
			>
			</el-tree>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			const data = [
				{
					id: 2,
					label: '公司',
					is_show: 'false',
					children: [
						{
							id: 21,
							label: '公司号',
							path:'companyNumClient',
							is_show: 'false',
						},
						{
							id: 22,
							label: '企业公告',
							path:'comReportClient',
							is_show: 'false',
							children: [
								{
									id: 221,
									label: '公告详情',
									is_show: 'false',
								}
							]
						},
						{
							id: 23,
							label: '企业文化',
							is_show: 'false',
						},
						{
							id: 24,
							label: '企业制度',
							is_show: 'false',
							children: [
								{
									id: 241,
									label: '企业制度详情',
									is_show: 'false',
								}
							]
						},
						{
							id: 25,
							label: '企业内刊',
							is_show: 'false',
						},
						{
							id: 26,
							label: '荣誉榜',
							is_show: 'false',
							children: [
								{
									id: 261,
									label: '荣誉榜详情',
									is_show: 'false',
								},
							]
						}
					]
				}
			]
			return {
				moreListCom: {},
				node: window.sessionStorage.getItem('moreList') || {},
				expandedKeys: [],//默认展开的节点
				comCheckedkeys: [],//默认选中的节点
				data: JSON.parse(JSON.stringify(data)),
			}
		},
		mounted() {
			this.initData()
		},
		methods: {
			initData() {
				this.expandedKeys = []
				this.comCheckedkeys = []
				const nodeCom = JSON.parse(this.node)
				this.expandedKeys.push(nodeCom.pId)
				if (nodeCom.children&&nodeCom.children.id) {
					this.expandedKeys.push(nodeCom.cId)
					this.comCheckedkeys.push(nodeCom.children.id)
					this.$router.push({name:nodeCom.children.path})

				} else {
					this.comCheckedkeys.push(nodeCom.cId)
					this.$router.push({name:nodeCom.path})
				}
				// this.$refs.oatree.setCheckedKeys([1,11,121],false)
			},
			handleNodeClick(item, node) {
				if (item.path && node.parent.data.id && node.parent.parent.data.id) {
					this.moreListCom.pId = node.parent.parent.data.id
					this.moreListCom.cId = node.parent.data.id
					this.moreListCom.path = node.parent.data.path
					this.moreListCom.children = {}
					this.moreListCom.children.id = item.id
					this.moreListCom.children.path = item.path
					this.$router.push({name:this.moreListCom.children.path})

				}
				if (item.path && node.parent.data.id &&!node.parent.parent.data.id) {
					this.moreListCom.pId = node.parent.data.id
					this.moreListCom.cId = item.id
					this.moreListCom.path = item.path
					this.$router.push({name:this.moreListCom.path})

				}
				if(this.moreListCom.cId) {
					window.sessionStorage.setItem('moreList', JSON.stringify(this.moreListCom))
				}

			},

		}
	}
</script>
<style>

</style>
