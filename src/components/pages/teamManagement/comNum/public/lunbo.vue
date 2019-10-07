<template>
	<div tag="div" class="articleList articleListMod-3 er-carouseindex" name="slide-fade" id="articleList"
		 :style="{height:imgHeight+'px'}">
		<span id="btn1" class="er-carouseindex-left" @mousedown="imgMove('mouseLeft')" @mouseup="cancelMove('left')"
			  v-show="isOrNotButton"></span>
		<span id="btn2" class="er-carouseindex-right" @mousedown="imgMove('mouseRight')" @mouseup="cancelMove('right')"
			  v-show="isOrNotButton"></span>
		<div id="packageAll" class="er-carouseindex-con" @mouseover="clearAuto" @mouseout="slideAuto">
			<div class="er-carouseindex-bar" v-show="isOrNotCircle">
				<div v-for="(item,dex) in imgList" @mouseup="clearAuto" class="er-carouseindex-circle"
					 @click="circleClick(dex)" :class="{circleSelected:dex===indexCircle}">
				</div>
			</div>
			<div id="imageAll" class="er-carouseindex-item"
				 :style="{transform:translateX,transition:transFlag?transitionTime:''}">
				<div class="articleList-box er-carouseindex-box" v-for="(list,index) in imgLisShow"
					 :style="{width:imgWidth+'%'}"
					 style="max-height:50%;">
					<slot :item="list"></slot>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: "ErCarouselIndex",
		data() {
			return {
				imgList: [],//请求接口数据
				imgLisShow: [],//图片滚动数据，包括左中右三种
				timer: null,//自动循环滚动时的间隔时间
				timeout: null,//长按时的图片滚动间隔时间
				index: 0,//图片索引
				translateXnum: 0,//图片滚动时的偏移量
				translateX: "",//生成图片偏移时的表达式
				imgWidth: "",//图片所占宽度
				timeDown: "",//鼠标刚按下时的时间
				timeup: "",//鼠标松开时的时间
				clickSpace: "",//鼠标按下松开的时间间隙
				transFlag: true,//是否匀速滚动,
				transitionTime: "",
				indexCircle: 0//小圆圈滚动索引
			}
		},
		props: {
			duration: 0,//图片延时滚动
			typeNumber: 0, //每次滚动几张
			timeSpace: 0,  //图片滚动时间间隔
			url: String,//请求接口地址
			pageNumber: 0,//当前页面显示几张图片
			isOrNotButton: true,//是否显示左右按钮
			isOrNotCircle: true,//是否显示小圆圈
			imgHeight: ""//图片滚动显示高度
		},
		watch: {
			index: {
				handler() {
					var _this = this;
					if (Math.abs(this.index) == this.imgList.length) {
						this.indexCircle = 0;
						setTimeout(function () {
							_this.reset();
						}, _this.duration * 1000 * 0.98);
					} else {
						this.indexCircle = this.index;
					}
					this.calcXnum();
				}
			},
			translateXnum: {
				handler() {
					this.translateX = "translateX(" + this.translateXnum + "%)";
				}
			}
		},
		methods: {
			//页面初始化复赋值
			imgView: function () {
				var _this = this;
				_this.$http.get(_this.url).then(function (res) {
					_this.imgList = res.data.imgList;
					for (var i = 0; i < 3; i++) {
						_this.imgList.forEach(function (item, index) {
							_this.imgLisShow.push(item);

						});
					}
					_this.reset();
					_this.slideAuto();
					_this.imgWidth = (100 / _this.pageNumber) - 1;
					_this.transitionTime = "all " + _this.duration * 0.98 + "s linear";
					console.log(_this.transitionTime);
				});
			},
			//图片滚动方法(长按)
			imgMove: function (direct) {
				var _this = this;
				_this.timeDown = new Date();//记录按下的时间
				_this.timeout = setInterval(function () {
					if (direct == "mouseLeft") {
						_this.leftMove();
					} else {
						_this.rightMove();
					}
				}, 300);
			},
			//鼠标送开时执行的方法
			cancelMove: function (direct) {
				var _this = this;
				_this.clearAuto();
				this.timeup = new Date();//记录松开的时间
				this.clickSpace = this.timeup.getTime() - this.timeDown.getTime();
				//时间间隔小于500毫秒为点击，反之为长按
				if (this.clickSpace < 500) {
					for (var i = 0; i < _this.typeNumber; i++) {
						if (direct == "left") {
							_this.leftMove();
						} else {
							_this.rightMove();
						}
					}
				}
				if (this.timeout) {
					clearInterval(this.timeout);
					this.timeout = null;
				}
			},
			//向左移动
			leftMove: function () {
				this.index--;
				this.transFlag = true;
			},
			//向右移动
			rightMove: function () {
				this.transFlag = true;
				this.index++;
			},
			slideAuto: function () {
				var _this = this;
				_this.timer = setTimeout(function () {
					if (Math.abs(_this.index) !== _this.imgList.length) {
						_this.rightMove();
						_this.slideAuto();
					}
				}, _this.timeSpace * 1000);
			},
			clearAuto: function () {
				console.log("停止");
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			//重置
			reset: function () {
				this.index = 0;
				this.transFlag = false;
				this.calcXnum();
			},
			calcXnum: function () {
				var _this = this;
				this.translateXnum = -(this.index + this.imgList.length) * (100 / this.pageNumber);
			},
			//点击圆圈跳转图片
			circleClick: function (dex) {
				this.index = dex;
				this.clearAuto();
			}
		},
		mounted() {
			this.$nextTick(function () {
				this.imgView();
			});
		}
	}
</script>
<style>

</style>
