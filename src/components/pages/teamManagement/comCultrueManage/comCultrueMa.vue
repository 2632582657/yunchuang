<template>
	<div class="comCultrueMa-container" style="padding:30px 20px;background:#fff;height:750px;min-width:760px;">
		<el-container style="height:700px;">
			<el-aside width="250px" style="background:#fff;border:1px solid black;position:relative;">
				<div class="comCultrueMa-cultruePlate" style="">
					<P style="border-bottom:1px solid #bbb;height:50px;line-height:50px;text-align:center;font-weight:bold;">
						企业文化板块</P>
					<el-tree
						:data="datashu"
						node-key="id"
						default-expand-all
						@node-drag-start="handleDragStart"
						@node-drag-enter="handleDragEnter"
						@node-drag-leave="handleDragLeave"
						@node-drag-over="handleDragOver"
						@node-drag-end="handleDragEnd"
						@node-drop="handleDrop"
						@node-click="handleClick"
						draggable
						:allow-drop="allowDrop"
						:allow-drag="allowDrag"
						style="border:1px solid black;margin:10px 20px;">
						<div class="custom-tree-node" slot-scope="{ node, data }" style=""
							 @mouseenter.stop="() => {data.isShow = true;flag = false}"
							 @mouseleave.stop="() => {data.isShow = false}">
							<span class="custom-tree-node-span"
								  style="display:block;width:100%;float:left;overflow: hidden;text-overflow:ellipsis;text-align:center;white-space: nowrap;position:relative;">{{ data.label }}</span>
							<i class="el-icon-more" v-show="data.isShow"
							   style="margin-left:10px;widht:40px;height:40px;line-height:40px;position:absolute;right:0;margin-right:20px;display:inline-block;"
							   @click.stop="modify()">
								<div class="custom-tree-node-modify " v-show="flag">
									<!-- <el-button type="text" icon="el-icon-document-add" @click.stop="addSibilingClass(node,data)">新建同级分类</el-button> -->
									<el-button type="text" icon="el-icon-edit" @click.stop="editClass">编辑分类</el-button>
									<el-button type="text" icon="el-icon-delete" @click.stop="open(node,data)"
											   style="color:red;">删除分类
									</el-button>

								</div>
							</i>

						</div>
					</el-tree>
					<el-button type="primary" class="el-icon-plus" style="margin-left:20px;" @click="addmodule">增加板块
					</el-button>
				</div>


			</el-aside>
			<el-main style="background:#fff;border:1px solid black;margin-left:20px;padding:0;box-sizing:border-box;">
				<div class="comCultrueMa-main"
					 style="border-bottom:1px solid height:50px;line-height:50px;text-align:center;">
					<div style="border-bottom:1px solid #bbb;">
						<!-- {{}} ===体现每一个模块的名字-->
						内容详情
					</div>

					<template v-show="photoEditFlag">
						<div class="plateOne" style="" v-show="plateOneFlag">
							<h1 style="text-align:left;padding-left:20px;">{{datashu[indexs].label}}
								<!-- {{}} ===体现每一个模块的名字--></h1>
							<div class="one"
								 style="padding-bottom:20px;padding-left:20px;text-align:center;display:flex;-webkit-flex:flex;flex-wrap:wrap;justify-content:space-around;position:relative;text-align:center;">
								<template v-for="(item,i) in datashu[indexs].version">
									<div class="one-item"
										 style="width:42%;margin-right:20px;margin-top:10px;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;">
										<el-upload
											style="height:150px;line-height:150px;border:1px solid #bbb;"
											class="avatar-uploader"
											action="https://jsonplaceholder.typicode.com/posts/"
											:show-file-list="false"
											:on-success="handleAvatarSuccess"
											:before-upload="beforeAvatarUpload">
											<img v-if="datashu[indexs].imageUrl[i]" :src="datashu[indexs].imageUrl[i]"
												 class="avatar">
											<i v-else class="el-icon-plus avatar-uploader-icon"></i>
										</el-upload>
										<el-input v-model="datashu[indexs].input[i]" placeholder="请输入内容"
												  @blur="handleBlur()"></el-input>
										<el-input
											type="textarea"
											:autosize="{ minRows: 2, maxRows: 4}"
											placeholder="请输入内容"
											v-model="datashu[indexs].textarea[i]">
										</el-input>
										<el-button type="danger" icon="el-icon-delete" circle
												   style="position:absolute;left:100%;top:40%;margin-left:5px;"
												   @click="open1(item, i)"></el-button>
									</div>
								</template>

								<div style="width:100px;height:80px;background:pink;" @click="addcode">
									新增
								</div>
							</div>

						</div>
						<div class="plateTwo" style="overflow:hidden" v-show="plateTwoFlag">
							<h1 style="text-align:left;padding-left:20px;">办公环境<!-- {{}} ===体现每一个模块的名字--></h1>
							<div class="two"
								 style="overflow-x:hidden;padding-bottom:20px;padding-left:20px;text-align:center;display:flex;-webkit-flex:flex;flex-wrap:wrap;justify-content:space-around;position:relative;text-align:center;">
								<template v-for="(item,i) in datashu[indexs].version">
									<div class="two-item"
										 style="width:42%;margin-right:20px;margin-top:10px;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;">
										<el-upload
											style="height:150px;line-height:150px;border:1px solid #bbb;"
											class="avatar-uploader"
											action="https://jsonplaceholder.typicode.com/posts/"
											:show-file-list="false"
											:on-success="handleAvatarSuccess"
											:before-upload="beforeAvatarUpload">
											<img v-if="datashu[indexs].imageUrlTwo[i]"
												 :src="datashu[index].imageUrlTwo[i]" class="avatar">
											<i v-else class="el-icon-plus avatar-uploader-icon"></i>
										</el-upload>
										<el-button type="danger" icon="el-icon-delete" circle
												   style="position:absolute;left:100%;top:40%;margin-left:5px;"
												   @click="open1(item, i)"></el-button>
										<!-- <template slot-scope="scope">
											<el-button type="danger" icon="el-icon-delete" circle style="position:absolute;left:100%;top:20%;margin-left:5px;width:100px;height:100px;" @click="open1(scope.$index, scope.row)"></el-button>
										</template> -->
									</div>
								</template>
							</div>
						</div>
					</template>

					<template>
						<div class="plateThree" style="overflow:hidden" v-show="equidFlag">
							<h1 style="text-align:left;padding-left:20px;">办公环境<!-- {{}} ===体现每一个模块的名字--></h1>
							<div class="three" style="padding:10px 20px;">
								<template v-for="(item,i) in datashu[indexs].version">
									<div class="item-three" style="">
										<quill-editor ref="text" v-model="datashu[indexs].content[i]"
													  class="myQuillEditor" :options="editorOption"/>
									</div>
								</template>
							</div>
						</div>
					</template>

				</div>
			</el-main>
		</el-container>
		<div style="margin-top:30px;">
			<el-button type="primary" style="width:110px;" @click.stop="releaseInfo">发布</el-button>
			<el-button type="info" style="width:110px;" @click.stop="previewModule">预览</el-button>
		</div>


		<div class="preview-modle"
			 style="position:fixed;top:50%;left:50%;transform:translateY(-50%);width:500px;height:600px;background:#fff;border:1px solid black;overflow:hidden;"
			 v-show="previewFlag">
			<h1 style="height:50px;line-height:50px;font-weight:bold;background:#bbb;padding:0 20px;position:relative;z-index:10;">
				企业文化预览
				<span class="el-icon-close" style="position:absolute;right:10px;top:15px;"
					  @click.stop="()=>{previewFlag=false}"></span>
			</h1>
			<template>
				<div class="maincate" style="">
					<div class="scroll-tip"
						 style="width:1000px;height:50px;display:flex;-webkit-flex:flex;white-space:nowrap;">
						<template v-for="(item,index) in datashu">
							<a style="cursor:default;width:100px;display:inline-block;height:50px;text-align:center;line-height:50px;color:black;"
							   :class="{'current':currentIndex==index}"
							   @click="selectInfo(index,$event)">{{item.label}}</a>
						</template>
					</div>
				</div>
				<div style="height:500px;" class="mainwrap" ref="mwraper">
					<div style="height:900px;">
						<template v-for="(item,index) in datashu">
							<div class="wrapitem">
								<div :id="index">
									{{item.label}}
								</div>
								<template v-show="datashu[index].photoEditFlag">
									<div class="plateOne" style="overflow:hidden" v-show="datashu[index].plateOneFlag">
										<!-- <h1 style="text-align:left;padding-left:20px;">办公环境 -->
										<!-- {{}} ===体现每一个模块的名字</h1> -->
										<div class="one"
											 style="overflow-x:hidden;padding-bottom:20px;padding-left:20px;text-align:center;display:flex;-webkit-flex:flex;flex-wrap:wrap;justify-content:space-around;position:relative;text-align:center;">
											<template v-for="(item,i) in datashu[index].version">
												<div class="one-item"
													 style="width:42%;margin-right:20px;margin-top:10px;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;">
													<img :src="datashu[index].imageUrl[i]" alt="">
													<p>{{datashu[index].input[i]}}</p>
													<p>{{datashu[index].textarea[i]}}</p>

												</div>
											</template>
										</div>

									</div>

									<div class="plateTwo" style="overflow:hidden" v-show="datashu[index].plateTwoFlag">

										<div class="two"
											 style="overflow-x:hidden;padding-bottom:20px;padding-left:20px;text-align:center;display:flex;-webkit-flex:flex;flex-wrap:wrap;justify-content:space-around;position:relative;text-align:center;">
											<template v-for="(item,i) in datashu[index].version">
												<div class="two-item"
													 style="width:42%;margin-right:20px;margin-top:10px;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;">
													<img :src="datashu[index].imageUrlTwo[i]" alt="">
												</div>
											</template>
										</div>
									</div>
								</template>
								<template>
									<div class="plateThree" style="overflow:hidden" v-show="datashu[index].equidFlag">
										<h1 style="text-align:left;padding-left:20px;">办公环境
											<!-- {{}} ===体现每一个模块的名字--></h1>
										<div class="three" style="padding:10px 20px;">
											<template v-for="(item,i) in datashu[index].version">
												<div class="item-three" style="">
													<img src="" alt="">
													<p></p>
												</div>
											</template>
										</div>
									</div>
								</template>
							</div>
						</template>
					</div>
				</div>


			</template>
		</div>


		<div class="comRuleList-column" v-show="columeFlag">

			<div class="comRuleList-column-title">
				新增/编辑栏目
				<span class="comRuleList-column-close el-icon-close" @click="hideColumu"></span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="板块名称" prop="name">
					<el-input v-model="ruleForm.name"></el-input>
				</el-form-item>

				<el-form-item label="版式选择" prop="resource">
					<el-radio-group v-model="ruleForm.resource">
						<el-radio label="使用推荐样式一">
						</el-radio>
						<div
							style="width:350px;height:350px;border:1px solid #eee;overflow:hidden;padding:10px 10px;margin:10px 0;">
							<div style="float:left;width:50%;height:175px;">
								<img src=""
									 style="width:100%;height:100px;border:3px solid #eee;box-sizing:border-box;margin-bottom:8px;">
								<p style="text-align:left;height:20px;line-height:20px;background:pink;font-size:12px;margin-bottom:8px;">
									标题</p>
								<p style="text-align:left;font-size:12px;">内容介绍:在这里可以输入对应标题的介绍内容</p>
							</div>
							<div style="float:left;width:50%;height:175px;">
								<img src=""
									 style="width:100%;height:100px;border:3px solid #eee;box-sizing:border-box;margin-bottom:8px;">
								<p style="text-align:left;height:20px;line-height:20px;background:pink;font-size:12px;margin-bottom:8px;">
									标题</p>
								<p style="text-align:left;font-size:12px;">内容介绍:在这里可以输入对应标题的介绍内容</p>
							</div>
							<div style="float:left;width:50%;height:175px;">
								<img src=""
									 style="width:100%;height:100px;border:3px solid #eee;box-sizing:border-box;margin-bottom:8px;">
								<p style="text-align:left;height:20px;line-height:20px;background:pink;font-size:12px;margin-bottom:8px;">
									标题</p>
								<p style="text-align:left;font-size:12px;">内容介绍:在这里可以输入对应标题的介绍内容</p>
							</div>
							<div style="float:left;width:50%;height:175px;">
								<img src=""
									 style="width:100%;height:100px;border:3px solid #eee;box-sizing:border-box;margin-bottom:8px;">
								<p style="text-align:left;height:20px;line-height:20px;background:pink;font-size:12px;margin-bottom:8px;">
									标题</p>
								<p style="text-align:left;font-size:12px;">内容介绍:在这里可以输入对应标题的介绍内容</p>
							</div>
						</div>
						<el-radio label="使用推荐样式二"></el-radio>
						<div
							style="width:350px;height:250px;border:1px solid #eee;overflow:hidden;padding:10px 10px;margin:10px 0 20px 0;">
							<div style="float:left;width:50%;height:125px;">
								<img src=""
									 style="width:100%;height:100%;border:3px solid #eee;box-sizing:border-box;margin-bottom:8px;">
							</div>
							<div style="float:left;width:50%;height:125px;">
								<img src=""
									 style="width:100%;height:100%;border:3px solid #eee;box-sizing:border-box;margin-bottom:8px;">
							</div>
							<div style="float:left;width:50%;height:125px;">
								<img src=""
									 style="width:100%;height:100%;border:3px solid #eee;box-sizing:border-box;margin-bottom:8px;">
							</div>
							<div style="float:left;width:50%;height:125px;">
								<img src=""
									 style="width:100%;height:100%;border:3px solid #eee;box-sizing:border-box;margin-bottom:8px;">
							</div>

						</div>
						<el-radio label="使用富文本编辑器"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item class="comRuleList-column-submit" style="margin-top:0;">
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
					<!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
				</el-form-item>
			</el-form>


		</div>
	</div>
</template>
<script>
	import {quillEditor} from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	import BScroll from '@better-scroll/core'

	export default {
		data() {
			return {
				heightli: '',//存储预览中每一个区域的高度
				listHeight: [],//存储每一个高度
				indexs: 0,//接受当前index显示和data同时应用显示对应数据
				scrollY: 0,//存储当前预览区域内容的位置
				// action:{},//接受当前要编辑的对象
				// obj:[],//接受要上传的所有对象
				scroll: '',
				mainScroll: '',
				activeName: 'second',
				editorOption: {},
				content: '',//存储富文本的信息
				previewFlag: false,//预览模块的开关
				imageUrl: '',
				imageUrlTwo: '',
				photoEditFlag: false,//带有图片编辑的开关
				plateOneFlag: false,//版式一开关
				plateTwoFlag: false,//版式二开关
				equidFlag: false,//富文本样式开关

				version: [false, false, false, false, false],//遍历有多少编辑框
				input: '',//保存样式板块中每一个图片的每一个标题
				textarea: '',//保存图片标题下的内容介绍==可以转为数组==y
				msg: '',//提示消息的内容
				transData: {},
				//存储右侧弹窗的信息
				ruleForm: {
					name: '',
					resource: ''//存储选择版式的信息
				},
				rules: {
					name: [
						{required: true, message: '请输入活动名称', trigger: 'blur'},
						{min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
					],
					resource: [
						{required: true, message: '请选择活动资源', trigger: 'change'}
					]


				},
				columeFlag: false,//右侧边栏开关

				flag: false,
				datashu: [
					{
						id: 0,
						label: '文化理念',
						icon: 'el-icon-more',
						isShow: false,
						modifyFlag: false,
						photoEditFlag: false,
						plateOneFlag: false,
						plateTwoFlag: false,
						equidFlag: false
					},
					{
						id: 2,
						label: '办公环境',
						icon: 'el-icon-more',
						isShow: false,
						modifyFlag: false,
						photoEditFlag: false,
						plateOneFlag: false,
						plateTwoFlag: false,
						equidFlag: false

					}, {
						id: 3,
						label: '团队活动',
						icon: 'el-icon-more',
						isShow: false,
						modifyFlag: false,
						photoEditFlag: false,
						plateOneFlag: false,
						plateTwoFlag: false,
						equidFlag: false
					},
					{
						id: 4,
						label: '人才发展',
						icon: 'el-icon-more',
						isShow: false,
						modifyFlag: false,
						photoEditFlag: false,
						plateOneFlag: false,
						plateTwoFlag: false,
						equidFlag: false
					},
					{
						id: 5,
						label: '测试1',
						icon: 'el-icon-more',
						isShow: false,
						modifyFlag: false,
						photoEditFlag: false,
						plateOneFlag: false,
						plateTwoFlag: false,
						equidFlag: false
					},
					//     {
					//       id: 6,
					//       label: '测试2',
					//       icon:'el-icon-more',
					//       isShow:false,
					//       modifyFlag:false,
					//       photoEditFlag:false,
					// plateOneFlag:false,
					// plateTwoFlag:false,
					// equidFlag:false
					//     },
					//     {
					//       id: 7,
					//       label: '测试3',
					//       icon:'el-icon-more',
					//       isShow:false,
					//       modifyFlag:false,
					//       photoEditFlag:false,
					// plateOneFlag:false,
					// plateTwoFlag:false,
					// equidFlag:false
					//     },
					//     {
					//       id: 8,
					//       label: '测试4',
					//       icon:'el-icon-more',
					//       isShow:false,
					//       modifyFlag:false,
					//       photoEditFlag:false,
					// plateOneFlag:false,
					// plateTwoFlag:false,
					// equidFlag:false
					//     }
				],
				defaultProps: {
					children: 'children',
					label: 'label',
					icon: 'el-icon-more',
					isShow: false,
					modifyFlag: false,
					photoEditFlag: false,
					plateOneFlag: false,
					plateTwoFlag: false,
					equidFlag: false
				}
			};
		},

		created() {
			this.getData()

			// if(JSON.parse(sessionStorage.getItem('shutu1'))){
			//   this.datashu = JSON.parse(sessionStorage.getItem('shutu1'))
			// }
			// this.data=sessionStorage.getItem('shutu')||this.data
		},
		mounted() {
			this.$nextTick(() => {
				// this.scrollTip()
				this.calculateHeight()

			})
			// window.addEventListener('scroll', this.dataScroll);
		},
		computed: {
			currentIndex() {
				for (var i = 0; i < this.listHeight.length; i++) {
					const height1 = this.listHeight[i]
					const height2 = this.listHeight[i + 1]
					if (!height2 || this.scrollY < height2 && this.scrollY >= height1) {
						return i
					}
				}
			},
		},
		methods: {
			previewModule() {
				this.previewFlag = true

				this.$nextTick(() => {
					this.scrollTip()
					this.listHeight = []
					this.calculateHeight()
					// this.currentIndex()
				})
			},
			// 处理预览模块的信息
			selectInfo(index, event) {
				if (!event._constructed) {
					return
				}
				const mainList = this.$refs.mwraper.getElementsByClassName('wrapitem')
				const el = mainList[index]
				this.mainScroll.scrollToElement(el, 300)
			},
			// 输入框失去焦点的时候给当前的左侧栏对象附加值
			handleBlur() {
				// console.log(this.input)
				// console.log(this.action)

				if (this.input.trim() != '') {
					// this.action.input.push(this.input.trim())
					// console.log(1)
				}
			},
			scrollTip() {

				if (!this.scroll) {
					this.scroll = new BScroll('.maincate', {
						scrollX: true,
						click: true,
						preventDefaultException: true,
						disableMouse: false,
						disableTouch: false
					})
					this.mainScroll = new BScroll('.mainwrap', {
						scrollY: true,
						click: true,
						probeType: 3,
						preventDefaultException: true,
						disableMouse: false,
						disableTouch: false
					})
				} else {
					this.scroll.refresh()
					this.mainScroll.refresh()
				}
				this.mainScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y))
				})
			},
			calculateHeight() {
				const mainList = this.$refs.mwraper.getElementsByClassName('wrapitem')
				this.heightli = 0
				this.listHeight.push(this.heightli)
				for (var i = 0; i < mainList.length; i++) {
					const item = mainList[i]
					this.heightli += item.clientHeight
					this.listHeight.push(this.heightli)

				}
				return 0
			},
			// 发布的处理方法
			releaseInfo() {
				//这里是向api请求。发送最终确认的消息
			},

			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
			},

			handleDragStart(node, ev) {
				// console.log('drag start', node);
			},
			handleDragEnter(draggingNode, dropNode, ev) {
				// console.log('tree drag enter: ', dropNode.label);
			},
			handleDragLeave(draggingNode, dropNode, ev) {
				// console.log('tree drag leave: ', dropNode.label);
			},
			handleDragOver(draggingNode, dropNode, ev) {
				// console.log('tree drag over: ', dropNode.label);
			},
			handleDragEnd(draggingNode, dropNode, dropType, ev) {

				// 这里获取拖拽的位置。引出索引，对应元数据进行便利对比或者利用数组的方法，replace。原来的位置获取到也用repalce。在预览中重新遍历处理
				// console.log('tree drag end: ', dropNode && dropNode.label, dropType);
			},
			handleDrop(draggingNode, dropNode, dropType, ev) {
				// console.log('tree drop: ', dropNode.label, dropType);
			},
			allowDrop(draggingNode, dropNode, type) {
				if (dropNode.data.label) {
					return type !== 'inner';
				}
			},
			// 判断节点能否推拽
			allowDrag(draggingNode) {
				return draggingNode.data.label.indexOf('人才发展') === -1;
			},

			handleClick(data, node) {
				this.datashu.forEach((item, i) => {
					if (item.id == data.id) {
						this.indexs = i
					}
				})
				// this.index
				// this.action=data
				this.photoEditFlag = data.photoEditFlag
				this.plateOneFlag = data.plateOneFlag
				this.plateTwoFlag = data.plateTwoFlag
				this.equidFlag = data.equidFlag
			},
			//增加同级

			addSibilingClass(node, data) {
				// =============这里获取新的列表的信息。然后自己在添加同级别
				// debugger
				// 弹窗出现。然后添加信息后，向后台请求。重新渲染
				const action = {
					id: this.datashu.length * 2 + 1,
					modifyFlag: false,
					isShow: false,
					label: this.ruleForm.name,
					icon: 'el-icon-more',
					photoEditFlag: this.photoEditFlag,
					plateOneFlag: this.plateOneFlag,
					plateTwoFlag: this.plateTwoFlag,
					equidFlag: this.equidFlag,
					version: [false, false, false, false, false],
					content: [],
					input: [],
					textarea: [],
					imageUrl: [],
					imageUrlTwo: []
				}
				// const parent = node.parent
				// const children = parent.data.children || parent.data;
				// console.log(parent)
				// console.log(node)
				// this.action=newChild
				this.indexs = this.datashu.length
				this.datashu.push(action)
				// console.log(this.action)
				// console.log(this.datashu[this.indexs])
				// console.log(this.indexs)
				// console.log(this.datashu)
				// if (!children) {
				//   this.$set(parent, 'children', [])
				// }
				// children.push(newChild);


				// sessionStorage.setItem('shutu1', JSON.stringify(this.datashu))

			},

			// 编辑分类
			editClass(index, item) {
				//把文本框输入的值改为label
				// this.transData.id = index.id
				// console.log('editClass')
				this.showColumu()
			},
			// 删除节点
			deleteClass(node, data) {
				const indexa = this.data.findIndex(d => d.id === data.id);
				this.datashu.splice(indexa, 1);

			},
			addmodule() {
				if (this.datashu.length < 8) {
					return this.showColumu()
				}
				this.msg = '添加够数了'
				this.open3()
			},
			//控制右侧边弹窗
			showColumu() {
				this.columeFlag = true
			},
			hideColumu() {
				this.columeFlag = false

			},
			submitForm(formName) {
				// debugger
				let that = this;

				this.$refs[formName].validate((valid) => {
					if (valid) {
						// 这里是请求接口发送数据在页面重新请求在获取数据
						// =========这里是两步请求
						if (this.ruleForm.resource && this.ruleForm.resource.trim() != '' && this.ruleForm.resource == "使用推荐样式一" || this.ruleForm.resource == "使用推荐样式二") {
							this.photoEditFlag = true
							if (this.ruleForm.resource == "使用推荐样式一") {
								this.plateTwoFlag = false

								this.plateOneFlag = true

							}
							if (this.ruleForm.resource == "使用推荐样式二") {
								this.plateOneFlag = false

								this.plateTwoFlag = true

							}
						}
						if (this.ruleForm.resource && this.ruleForm.resource.trim() != '' && this.ruleForm.resource == "使用富文本编辑器") {
							this.equidFlag = true
						}
						// ===这里是向接口请求发送提交板块的信息。
						// alert('submit!');
						that.columeFlag = false
						this.addSibilingClass()

						// console.log(this.ruleForm);


					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			// resetForm(formName) {
			//   this.$refs[formName].resetFields();
			// },
			// 弹窗处理
			// 获取后台做出树形控件数据
			getData() {
				this.$http({
					// method: 'GET',
					// url: 'http://192.168.50.69:7004/v1/base/feign/company/hh',
					// data: {
					//     companyId:'1'
					// },
				}).then(res => {
					// console.log(res)
					// if (res.data.code === 200 && res.data.sysCode === 200) {
					//     res.data.data.first = false
					//     this.data.push(res.data.data)
					//     this.iteration (this.datashu)
					//     // console.log(this.data)
					// }
				})
			},
			// 提示表格删除没了
			open1(node, i) {
				this.$confirm('确定删除该制度数据吗？', '', {
					cancelButtonText: '取消',
					confirmButtonText: '确定',
					type: ''
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.delet(node, i)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			open(node, data) {
				this.$confirm('确定删除该制度数据吗？', '', {
					cancelButtonText: '取消',
					confirmButtonText: '确定',
					type: ''
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.deleteClass(node, data)

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			// 提示表格删除没了
			open3(msg) {
				this.$message({
					message: this.msg,
					type: 'warning'
				});
			},
			addcode() {
				const a = false
				this.datashu[this.indexs].version.push(a)
				// this.data.forEach((item)=> {
				// 	if(item.label==this.action.label){
				// 		item.version=this.action.version
				// 	}
				// })
			},
			delet(data, i) {
				console.log(i)
				// console.log(data)
				this.datashu[this.indexs].version.splice(i, 1)
				// this.data.forEach((item)=> {
				// 	if(item.label==this.action.label){
				// 		item.version=this.action.version
				// 	}
				// })
				//=====重新加载页面就可以，重新渲染
				// this.$router.push({name:'comNumPrductList'})

				if (this.datashu.length == 0) {
					this.msg = '没有消息了'
					this.open3()
				}

			},

			modify(data) {
				// data.modifyFlag = !data.modifyFlag
				this.flag = !this.flag;

			}

		},

		components: {
			quillEditor
		}
	};
</script>
<style lang="scss">
	.el-tree-node.is-expanded.is-focusable {
		height: 40px;
		line-height: 40px;

	}

	.el-tree-node__content {
		height: 100%;


	}

	.el-tree-node__expand-icon.is-leaf {
		display: none;
	}

	.custom-tree-node {
		width: 100%;

		&:hover {
			color: #4278BE;

		}
	}

	.custom-tree-node-modify {
		position: fixed;

		opacity: 1;
		z-index: 999;
		margin-top: -10px;
		margin-left: -10px;
		width: 100px;
		height: 80px;
		border-radius: 3px;
		box-shadow: 1px 1px 4px 0px rgba(191, 194, 204, 0.7);
		background: none;
		background: rgba(248, 248, 248, 1);

		.el-button--text {
			width: 100%;
			height: 50%;
			margin-right: 0;
			margin-left: 0;
			padding: 0;
			display: block;
			text-align: left;
			padding-left: 0px;
			border-bottom: 1px solid #EDEFF2;
			font-size: 14px;

			.el-icon-document-add:before, .el-icon-edit:before, .el-icon-delete:before {
				color: #4278BE;
			}

			&:last-child {
				border: none;
			}

			&:hover {
				background: #D8D8D8;
				color: #4278BE;
			}
		}


	}

	.comRuleList-column {
		border: 1px solid #eee;
		position: fixed;
		background: #fff;
		z-index: 99;
		top: 0px;
		right: 0px;
		width: 600px;
		height: 100%;

		.el-form-item {
			margin-top: 20px;

			&:first-child {
				margin-bottom: 0;
			}

			&:nth-child(2) {
				margin-top: 10px;
				margin-bottom: 0;
			}

			.el-input {
				width: 300px;
			}
		}

		.comRuleList-column-title {
			height: 37px;
			padding-left: 40px;
			padding-top: 21px;
			font-size: 20px;
			color: #303133;
			overflow: hidden;
			-webkit-background-clip: text;
			border-bottom: 1px solid #EDEFF2;

			.comRuleList-column-close {
				display: inline-block;
				width: 18px;
				height: 18px;
				float: right;
				margin-top: 6px;
				margin-right: 27px;
				font-size: 18px;
				color: #909399;

			}
		}

		.comRuleList-column-submit {
			width: 100%;
			margin-bottom: 0;
			height: 53px;
			text-align: right;
			border-top: 1px solid #EDEFF2;

			.el-form-item__content {
				height: 100%;
				line-height: 53px;

			}

			.el-button {
				margin-right: 20px;
				background: #4278BE;
				border-radius: 3px;
				color: #fff;
				width: 120px;
				height: 40px;
				font-size: 14px;
				line-height: 0;
			}
		}

	}

	.one:after, .two:after {
		content: "";
		width: 53%;
		flex: flex-start;
	}

	.one-item:last-child, .two-item:last-child {
		margin: auto;
	}

	.ql-toolbar.ql-snow + .ql-container.ql-snow {
		height: 400px;
	}

	.myQuillEditor {
		position: relative;
	}

	.avatar-uploader .el-upload {
		width: 100%;
		height: 100%;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		display: block;
		font-size: 28px;
		color: #8c939d;
		width: 100%;
		height: 100%;
		line-height: 150px;
		text-align: center;
	}

	.avatar {
		width: 100%;
		height: 100%;
		display: block;
	}

	.el-radio-group {
		overflow: hidden;
		padding: 15px 0;
	}


	.maincate {
		width: 100%;
		height: 50px;
		line-height: 50px;
		position: relative;
		z-index: 10;
		white-space: nowrap;
		box-shadow: 0 1px 2px rgba(0, 0, 0, .1);
		overflow-x: scroll;
		overflow-y: hidden;
		-webkit-backface-visibility: hidden;
		-webkit-perspective: 1000;
		-webkit-overflow-scrolling: touch;
		overflow-scrolling: touch;
		text-align: justify;
		background: #fff;
		padding: 0px 5px;
		box-sizing: border-box;
	}

	.maincate a {
		color: #fff;
		text-decoration: none;
		margin-right: 10px;
	}

	.maincate::-webkit-scrollbar {
		display: none;
	}

	.current {
		color: skyblue;
		font-weight: bold;
		border-bottom: 1px solid skyblue;
	}
</style>
