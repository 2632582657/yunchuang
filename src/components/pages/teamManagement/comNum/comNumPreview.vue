<template>
	<div id="comNumPreview-container" class="comNumPreview"
		 style="position:relative;background:#fff;padding-top:122px;overflow-y:scroll;height:700px;z-index:2;min-width:900px;font-family: 'Microsoft YaHei UI';"
		 ref="container">
		<div id="comNumPreview-head" ref="head"
			 style="position:absolute;top:0;min-width:800px;width:100%;background:#fff;z-index:99;overflow:hidden;">
			<div class="grid-content bg-purple-light rout" style="text-align:left;padding:0 19px;" id="apply2"
				 ref="apply2">
				<div class="actived" @click="()=> {$router.push({name:'comNumPreview'})}">
					基本信息
				</div>
				<div @click="()=> {$router.push({name:'previwInfoTab'})}">
					公司动态
				</div>
				<div @click="()=> {$router.push({name:'prductInfoTab'})}">
					产品展示
				</div>
				<div @click="()=> {$router.push({name:'jobInfoTab'})}">
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
		<div class="comNumPreview-info maincontent" style="padding:21px 19px;height:635px;overflow-y:scroll;">
			<div>
				<div class="title" id="apply1" ref="apply1" style="border-bottom:1px solid #EDEFF2;padding-bottom:5px;">
					<p style="font-size:18px;color:#303133;font-weight:bold;margin-bottom:30px;border-left:8px solid #4278BE;padding-left:8px;font-size:16px;">
						公司介绍</p>
					<p style="text-indent:30px;color:#606266;padding:0 16px;text-indent:0;font-size:14px;line-height:35px;" v-html="data">{{data}}</p>
				</div>
				<div class="photo" style="padding:20px 0 19px;border-bottom:1px solid #EDEFF2;">
					<p style="font-size:18px;color:#303133;font-weight:bold;margin-bottom:30px;border-left:8px solid #4278BE;padding-left:8px;font-size:16px;">
						公司照片</p>
					<div class="img-box"
						 style="height:138px;box-sizing:border-box;overflow-y:hidden;overflow-x:scroll;position:relative;"
						 ref='div1' @mouseover.stop="" @mouseout.stop="">
                    <span class="direcBtn"
						  style="width:32px;height:62px;line-height:62px;text-align:center;position:absolute;left:0;top:50%;background:rgba(0,0,0,0.3);cursor:default;border-radius:0 3px 3px 0;"
						  @click.stop="turnLeft" ref="leftBtn">0
                    </span>
						<span class="direcBtn"
							  style="width:32px;height:62px;line-height:62px;text-align:center;position:absolute;right:0;top:50%;background:rgba(0,0,0,0.3);cursor:default;border-radius:3px 0 0 3px;"
							  @click.stop="turnRight" ref="rightBtn">1</span>
						<ul class="com-photo"
							style="overflow:hidden;margin-left:0;height:100%;line-height:200px;"
							ref="imgBox">
							<li v-for="(item,index) in imglist" :key="item"
								style="float: left;list-style:none;margin:0;margin-right:15px;border:none;">
								<img :src="imglist[index]"
									 style="width:222px;height:138px;border-radius:3px;">

							</li>
						</ul>
					</div>
				</div>
				<div class="com-address" style="padding:20px 0 19px;border-bottom:1px solid #EDEFF2;">
					<p style="font-size:18px;color:#303133;font-weight:bold;margin-bottom:20px;border-left:8px solid #4278BE;padding-left:8px;font-size:16px;">
						办公地址</p>
					<p style="padding-left:16px;color:#606266;font-size:14px;">山东省青岛市市北区xx路xxx号xxx大厦x楼xx户</p>
				</div>
				<div class="com-cultrue" style="padding:20px 0 19px;border-bottom:1px solid #EDEFF2;">
					<p style="font-size:18px;color:#303133;font-weight:bold;margin-bottom:20px;border-left:8px solid #4278BE;padding-left:8px;font-size:16px;">
						企业文化</p>
					<p style="padding-left:16px;color:#606266;font-size:14px;" v-html="getInfo">{{getInfo}}</p>

				</div>
				<div class="honor" style="padding:20px 0 19px;border-bottom:1px solid #EDEFF2;">
					<p style="font-size:18px;color:#303133;font-weight:bold;margin-bottom:20px;border-left:8px solid #4278BE;padding-left:8px;font-size:16px;">
						荣耀资质</p>
					<div class="img-box"
						 style="height:138px;box-sizing:border-box;overflow-y:hidden;overflow-x:scroll;position:relative;">
                    <span class="direcBtn"
						  style="width:32px;height:62px;line-height:62px;text-align:center;position:absolute;left:0;top:50%;background:rgba(0,0,0,0.3);cursor:default;border-radius:0 3px 3px 0;"
						  @click.stop="turnLeftHor" ref="leftBtn">0
                    </span>
						<span class="direcBtn"
							  style="width:32px;height:62px;line-height:62px;text-align:center;position:absolute;right:0;top:50%;background:rgba(0,0,0,0.3);cursor:default;border-radius:3px 0 0 3px;"
							  @click.stop="turnRightHor" ref="rightBtn">1</span>
						<ul class="com-photo"
							style="overflow:hidden;margin-left:0;height:100%;line-height:200px;"
							ref="imgBox">
							<li v-for="(item,index) in imglistHor" :key="item"
								style="float:left;list-style:none;margin:0;margin-right:15px;border:none;">
								<img :src="imglistHor[index]"
									 style="width:222px;height:138px;border-radius:3px;">{{index}}
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				mainScroll: '',
				animatFlag: false,
				animatRFlag: false,
				imglist: [],//公司图片
				imglistHor: [],//荣耀图片
				avtarCom:'',//公司logo
				data: [],//接受公司号预览基本信息，
				getInfo: [],//企业文化
				// screenWidth: '', //设置头部固定定位的时候的宽度
				// pageWidth: '',
				// ass: '' //设置页面内滚动条滚动时候的对比参数，改变头部的定位
			}
		},
		created() {
			this.getBackInfo()

		},
		methods: {
			//公司墙向左移动
			turnLeft() {
				const img1 = this.imglist.shift()
				this.imglist.push(img1)
				// setTimeout(()=>{
				// }, 3000);
			},
			turnRight() {
				const img2 = this.imglist.pop()
				this.imglist.unshift(img2)
			},
			// 荣誉墙
			turnLeftHor() {
				const img3 = this.imglistHor.shift()
				this.imglistHor.push(img3)
				// setTimeout(()=>{
				// }, 3000);
			},
			turnRightHor() {
				const img4 = this.imglistHor.pop()
				this.imglistHor.unshift(img4)
			},
			// scrollTip(){
			//   if(!this.scroll){
			//   this.mainScroll = new BScroll('.maincontent',{
			//       scrollY: true,
			//       click: true,
			//       probeType:3,
			//       preventDefaultException:true,
			//       disableMouse: false,
			//       disableTouch: false
			//   })
			//   }else {
			//     this.mainScroll.refresh()
			//   }
			// },
			// 获取信息
			getBackInfo() {
				this.$http({
					method: 'GET',
					url: 'v1/base/feign/company/queryBase',
					params: {
						companyId: '1'
					},
				}).then(res => {
					// debugger
					console.log(res)
					if (res.data.code === 200 && res.status === 200) {
						this.data = JSON.parse(res.data.data.introduction)
						this.imglist = JSON.parse(res.data.data.companyRelevance.picture)
						this.imglistHor = JSON.parse(res.data.data.companyRelevance.honourQualification)
						// this.avtarCom = JSON.parse(res.data.data.companyRelevance.honourQualification)
						this.getInfo = JSON.parse(res.data.data.culture)

					}
				}).catch(res => {
					console.log(res)
				})
			},

			hrefTo() {
				this.$router.push({name: 'comDymanicInfo'})
			},
			hrefTopro() {
				this.$router.push({name: 'productInfo'})

			},
			hrefToJob() {
				this.$router.push({name: 'jobInfo'})

			},
			handleData() {


			}
		}
	}
</script>
<style lang="scss">
	.actived {
		color: #4278BE !important;
		font-size: 18px;
		border-bottom: 5px solid #4278BE;
	}

	// .el-tabs__header  {
	// 	position:fixed;
	// 	// top:130px;
	//   left:50%;
	//   z-index:100;
	//   margin-left:20%;
	//   line-height:76px;
	//   background:#fff;
	// }
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

	.com-photo {
		& > li {
			margin-right: 15px;
		}
	}

	.comNumPreview::-webkit-scrollbar {
		display: none;

	}

	.comNumPreview::-webkit-scrollbar {
		width: 0 !important
	}

	.comNumPreview, .comNumPreview-info {
		-ms-overflow-style: none;
	}

	.comNumPreview, .comNumPreview-info {
		overflow: -moz-scrollbars-none;
	}

	.el-carousel__item h3 {
		color: #475669;
		font-size: 18px;
		opacity: 0.75;
		line-height: 300px;
		margin: 0;
	}

	.direcBtn {
		transform: translateY(-50%);
		-ms-transform: translateY(-50%);
		-moz-transform: translateY(-50%);
		-webkit-transform: translateY(-50%);
		-o-transform: translateY(-50%);
	}

	.img-box::-webkit-scrollbar, .comNumPreview-info::-webkit-scrollbar {
		display: none;

	}

	.img-box::-webkit-scrollbar, .comNumPreview-info::-webkit-scrollbar {
		width: 0 !important
	}

	.el-carousel__item h3 {
		color: #475669;
		font-size: 14px;
		opacity: 0.75;
		line-height: 150px;
		margin: 0;
	}

	.img-box {
		-ms-overflow-style: none;
	}

	.img-box {
		overflow: -moz-scrollbars-none;
	}

	.el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}

	.el-carousel__item:nth-child(2n+1) {
		background-color: #d3dce6;
	}
</style>
