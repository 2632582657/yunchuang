<template>
	<div class="comNumPreview"
		 style="position:relative;background:#fff;padding-top:122px;overflow-y:scroll;height:700px;z-index:2;min-width:900px;font-family: 'Microsoft YaHei UI';"
		 >
		<div
			 style="position:absolute;top:0;min-width:800px;width:100%;background:#fff;z-index:99;overflow:hidden;">
			<div class="grid-content bg-purple-light rout" style="text-align:left;padding:0 19px;"
				 ref="applypre">
				<div @click="()=> {$router.push({name:'comNumPreview'})}">
					基本信息
				</div>
				<div class="actived" @click="()=> {$router.push({name:'previwInfoTab'})}">
					公司动态
				</div>
				<div @click="()=> {$router.push({name:'prductInfoTab'})}">
					产品展示
				</div>
				<div @click="()=> {$router.push({name:'jobInfoTab'})}">
					<!-- <div @click="handlbeData"> -->
					职位招聘
				</div>
			</div>
			<div class="grid-content bg-purple-dark"
				 style="height:84px;margin:0 19px;border-bottom:1px solid #EDEFF2;line-height:84px;box-sizing:border-box;">
				<img src=""
					 style="display:inline-block;width:44px;height:44px;margin-top:20px;vertical-align:top;border-radius:3px;">
				<p style="display:inline-block;font-weight:bold;margin-left:15px;color:#303133;font-size:18px;">
					青岛蓝海汇网络科技有限公司</p>
			</div>
		</div>
		<div class="com-danamac maincontentpre"
			 style="padding:0 19px 20px;height:635px;overflow-y:hidden;">
			<template v-for="(item, index) in getInfo">

			<div class="danamac-column"
				 style="cursor:pointer;overflow:hidden;border-bottom:1px solid #EDEFF2;padding-bottom:20px;padding-top: 19px;"
				 @click.stop="hrefTo(item,index)">
					<el-container>
						<el-aside width="208px" style="background:#fff;overflow:hidden;">
							<img :src="item.companyRelevance" style="width:208px;height:117px;border-radius: 3px;">
						</el-aside>
						<el-main style="padding-left:15px;background:#fff;padding-top:0;">
							<div style="height:100%;position: relative;">
								<p style="display:block;text-align:left;color:#303133;margin-bottom:20px;font-size:18px;">
									{{item.listName}}</p>
								<p style="text-align:left;color:#606266;font-size:16px;margin-bottom:23px;" class="content" v-html="item.content">
									{{item.content}}</p>
								<span style="display:block;color:#909399;font-size:14px;position:absolute;bottom:0;">发布于{{item.day.slice(0,-8)}}</span>
							</div>
						</el-main>
					</el-container>
			</div>
			</template>

		</div>
	</div>
</template>
<script>
	import  '@/modules/common'
	export default {
		data() {
			return {
				mainScrollpre: '',
				data: [],//接受公司号预览基本信息，
				getInfo: [],
				ass: ''
			};
		},
		created() {
			this.getBackInfo()
		},
		methods: {
			scrollTip() {
				if (!this.scroll) {
					this.mainScrollpre = new BScroll('.maincontentpre', {
						scrollY: true,
						click: true,
						probeType: 3,
						preventDefaultException: true,
						disableMouse: false,
						disableTouch: false
					})
				} else {
					this.mainScrollpre.refresh()
				}
			},
			// 获取信息
			getBackInfo() {
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/queryListAll',
					params: {
						companyId:'12',
						tabulationType: '0'
					},
					headers: {
						"Content-Type": "multipart/form-data",
						"Access_Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVUaW1lIjoxNTY2ODIxNzUzLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU3MTk4MjMwNiwidXNlcklkIjoyMDA0ODM3OTc2MDUxNDkxODR9.CnEqqRVVhxzvvHV2DYkGOpT4ePgbGNcAQ_t5NchVByo'
					}
				}).then(res => {
					console.log(res)
					if (res.data.code === 200 && res.status === 200) {
						this.getInfo = []
						for (var i = 0; i < res.data.data.length; i++) {
							this.getInfo[i] = {}
							this.getInfo[i].id = JSON.parse(res.data.data[i].id)
							this.getInfo[i].createBy = JSON.parse(res.data.data[i].createBy)
							this.getInfo[i].day =res.data.data[i].day

							this.getInfo[i].listName = JSON.parse(res.data.data[i].listName)
							this.getInfo[i].content = JSON.parse(res.data.data[i].content)
							this.getInfo[i].companyRelevance = {}
							this.getInfo[i].companyRelevance = JSON.parse(res.data.data[i].companyRelevance.thumb)
						}
						this.getInfo = JSON.parse(JSON.stringify(this.getInfo))
					}
					console.log(this.getInfo)

				})
			},

			// 可以通过solt-scope来获取每一个信息。便利的时候也可以获取相应的信息，通过路由传过去
			// 控制路由跳转及其样式

			hrefTo(item,index) {
				this.$router.push({name: 'comDymanicInfo',query:{id:item.id,i:index, length:this.getInfo.length}})
			},
			handleData() {
			}
		}
	};
</script>
<style lang="scss">
	.actived {
		color: #4278BE !important;
		font-size: 18px;
		border-bottom: 5px solid #4278BE;
	}
	/*.el-tabs__header  {
        position:fixed;
        // top:130px;
      left:50%;
      z-index:100;
      margin-left:20%;
      line-height:76px;
      background:#fff;
    }*/
	.el-tabs__nav-wrap {
		height: 76px;
		.el-tabs__nav-scroll {
			float: right;
		}
	}
	.photo li, .honor li {
		float: left;
		list-style: none;
		margin-left: 20px;
		border: 10px solid #eee;
	}
	.jobinfo-column {
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		padding-top: 20px;
		padding-bottom: 20px;
		p {
			color: black;
			height: 30px;
			line-height: 30px;
			&:nth-child(2) {
				span {
					background: #eee;
					margin-right: 10px;
				}
			}
			&:nth-child(3) {
				font-size: 17px;
				color: blue;
			}
		}
	}
	.el-tab-pane {
		padding: 0 30px 0 20px;
	}
	.grid-content.bg-purple-light:last-child {
		& > div {
			cursor: default;
			display: inline-block;
			height: 67px;
			line-height: 67px;
			padding: 0 10px;
		}
	}
	.rout {
		background: #F8F8F8;
		display: block;
		width: 100%;
		& > div {
			cursor: default;
			display: inline-block;
			height: 33px;
			width: 73px;
			color: #BFC2CC;
			font-size: 18px;
			line-height: 33px;
			margin-right: 54px;
		}
	}
	.comNumPreview::-webkit-scrollbar, .maincontentpre::-webkit-scrollbar {
		display: none;
	}
	.comNumPreview::-webkit-scrollbar, .maincontentpre::-webkit-scrollbar {
		width: 0 !important
	}
	.comNumPreview, .maincontentpre {
		-ms-overflow-style: none;
	}
	.comNumPreview, .maincontentpre {
		overflow: -moz-scrollbars-none;
	}
	.content {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
</style>
