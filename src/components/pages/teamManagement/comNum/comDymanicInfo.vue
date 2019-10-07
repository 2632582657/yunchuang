<template>
	<div class="comDymanicInfo-container">
		<header>
			<!-- <el-button type="primary"  style="" @click=back><返回</el-button> -->
			<div class="comDymanicInfo-btn-box">
				<el-button type="text" @click="pre" :class="{spanactive:indexDy===0}"><span v-if="indexDy>0">上一篇</span><span v-else >当前是第一篇</span></el-button>
				<el-button type="text" @click="next" :class="{spanactive:indexDy===length-1}"><span v-if="indexDy<length-1">下一篇</span><span v-else>当前是最后一篇</span></el-button>
			</div>
		</header>
		<div class="comDymanicInfo-main">
			<template>
				<p style="color:#303133;font-size:25px;font-size:30px;line-height:38px;text-align:center;margin-top:30px;text-align:left;">
					{{listName[indexDy]}}</p>
				<p style="text-align:left;margin:20px 0 30px;color:#909399;font-size:14px;">{{day[indexDy].slice(0,-3)}}</p>
				<div style="text-align:left;color:black;margin-bottom:30px;color:#606266;font-size:14px;line-height:28px;" v-html="content[indexDy]">
					{{content[indexDy]}}</div>
<!--				<div style="width:100%;height:353px;margin-bottom:30px;overflow:hidden;">-->
<!--					<img :src="getInfo[indexDy].companyRelevance" style="width:100%;height:100%;float:right;">-->
<!--				</div>-->

				<p style="margin:60px 0 10px;color:black;">青岛蓝海汇网络科技有限公司</p>
			</template>
		</div>
	</div>
</template>
<script>
	import  '@/modules/common'
	export default {
		data() {
			return {
				getInfo: [],//接受所有信息
				indexDy:'',//接收路由传来的索引
				length:'',
				id:[],
				createBy:[],
				day:[],
				listName:[],
				content:[],
				companyRelevance:[],
				companyRelevance:[]
			}
		},
		created() {
			this.getBackInfo()
		},
		methods: {
			// 获取信息
			getBackInfo(id) {
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
						this.indexDy = this.$route.query.i
						this.length = this.$route.query.length
						for (var i = 0; i < res.data.data.length; i++) {
							this.id[i]= JSON.parse(res.data.data[i].id)
							this.createBy[i]= JSON.parse(res.data.data[i].createBy)
							this.day[i]= res.data.data[i].day
							this.listName[i]= JSON.parse(res.data.data[i].listName)
							this.content[i]= JSON.parse(res.data.data[i].content)
							this.companyRelevance[i]= {}
							this.companyRelevance[i]= JSON.parse(res.data.data[i].companyRelevance.thumb)
						}
						this.getInfo = JSON.parse(JSON.stringify(this.getInfo))
					}
					console.log(this.getInfo)

				})
			},
			next() {
				if(this.indexDy<this.length-1){
					this.indexDy++
				}else {
					this.$message({
						type:'success',
						message:'最后一页'
					})
				}
			},
			pre() {
				if(this.indexDy>0){
					this.indexDy--
				}else {
					this.$message({
						type:'success',
						message:'第一页'
					})
				}
			},
			back() {
				// 因该是返回上一页
				// this.$route.go(-1)
				this.$router.push({name: 'comNumPreview'})
			}
		}
	}
</script>
<style lang="scss">
	.comDymanicInfo-container {
		background: #fff;
		padding:0 20px;
		min-width: 900px;

		.spanactive {
			color:#303133!important;
		}
		.comDymanicInfo-btn-box {
			width: 900px;
			margin: 0 auto;
			text-align: right;
			.el-button {
				color: #4278BE;
				font-size: 14px;
			}
			.el-button + .el-button {
				margin-left: 39px;
			}
		}
		.comDymanicInfo-main {
			padding:0 40px;
		}
		header {
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			border-bottom: 1px solid #EDEFF2;
			height: 62px;
			line-height: 62px;
			.el-button:first-child {
				span {
					margin-left: 0;
				}
			}
		}
	}
</style>
