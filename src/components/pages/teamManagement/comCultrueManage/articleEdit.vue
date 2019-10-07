<template>
	<div class="articleEdit-container">
		<div class="articleEdit-title">
			<el-container>
  				<el-aside width="100px">文章标题:</el-aside>
  				<el-main>
  					<el-input v-model="input"></el-input>
  				</el-main>
			</el-container>
		</div>
		<div class="articleEdit-class">
			<el-container>
  				<el-aside width="100px">所属分类:</el-aside>
  				<el-main>
  					<template>
  						<el-select v-model="valued" placeholder="请选择">
  						  <el-option
  						    v-for="item in options"
  						    :key="item.value"
  						    :label="item.label"
  						    :value="item.value">
  						  </el-option>
  						</el-select>
					</template>
  				</el-main>
			</el-container>
		</div>
		<div class="articleEdit-content">
			<el-container>
  				<el-aside width="100px">文章内容:</el-aside>
  				<el-main>
  					<quill-editor ref="text" v-model="content" class="myQuillEditor" :options="editorOption" />
  				</el-main>
			</el-container>
		</div>
		<div class="articleEdit-attachment">
			<el-container>
  				<el-aside width="100px">附件:</el-aside>
  				<el-main>
  					<el-upload
  						class="upload-demo"
  						action="https://jsonplaceholder.typicode.com/posts/"
  						:on-preview="handlePreview"
  						:on-remove="handleRemove"
  						:before-remove="beforeRemove"
  						multiple
  						:limit="3"
  						:on-exceed="handleExceed"
  						>
  						<el-button size="small" type="plain">点击上传</el-button>
  						<div slot="tip" class="el-upload__tip"></div>
					</el-upload>
  				</el-main>
			</el-container>
		</div>
		<div class="articleEdit-permission">
			<el-container>
  				<el-aside width="100px">对谁可见:</el-aside>
  				<el-main>
  					<div @click="handleTransferShow">
  						<el-input v-model="input"></el-input>
  						
  					</div>
  					<template>
  						<div v-show="transferShow" class="transf-info">
  							<header id="header" class="">
  								选择部门与人员
  							</header><!-- /header -->
  							<el-transfer
  							  v-model="value"
  							  :props="{
  							    key: 'value',
  							    label: 'desc'
  							  }"
  							  :data="data">
  							</el-transfer>
  						<div class="articleEdit-btn">
  							<el-button type="primary" @click="transferShow=false">确定</el-button>

  						 <el-button type="info" @click="transferShow=false">取消</el-button>
  						</div>

  						</div>
  					</template>
  				</el-main>
			</el-container>
		</div>
		<div class="articleEdit-thumb">
			<el-container>
  				<el-aside width="100px">缩略图:</el-aside>
  				<el-main>
  					<el-upload
					  	class="upload-demo"
					  	action="https://jsonplaceholder.typicode.com/posts/"
					  	:on-preview="handlePreview"
					  	:on-remove="handleRemove"
					  	:before-upload ="beforeupload"
					  	list-type="picture">
					  	<el-button size="small" type="plain">上传图片</el-button>
					  	<div slot="tip" class="el-upload__tip"></div>
					</el-upload>
  				</el-main>
			</el-container>
		</div>
		<div class="articleEdit-sync">
			<p>是否同步在<span>APP</span>主页:</p>
			<template>
  				<el-radio v-model="radio" label="1">是</el-radio>
  				<el-radio v-model="radio" label="2">否</el-radio>
			</template>
		</div>
		<P>同步后，公司员工可在APP中消息>主页>企业制度中查看您发布的该制度</P>
		<div class="articleEdit-confirm-btn">
  			<el-button type="primary">提交</el-button>
		</div>
	</div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
	export default {
		data() {
			 const generateData = _ => {
        const data = []
        for (let i = 1; i <= 15; i++) {
          data.push({
            value: i,
            desc: `备选项 ${ i }`,
            disabled: i % 4 === 0
          })
        }
        return data
      }
			return {
				radio: '1',
				transferShow:false,//穿梭框显示开关
				input : '',
				content: '',
    			text: '',
    			editorOption: {},
    			// fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
    			// fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
    			options: [{
          			value: '选项1',
          			label: '黄金糕'
        			}, {
          value: '选项2',
          label: '双皮奶'
        			}, {
          value: '选项3',
          label: '蚵仔煎'
        			}, {
          value: '选项4',
          label: '龙须面'
        			}, {
          value: '选项5',
          label: '北京烤鸭'
        		}],
        			valued: '',
        			        data: generateData(),
        value: []
        			// renderFunc(h, option) {
          	// 			return <span>{ option.key } - { option.label }</span>;
        			// }

			}
		},
		methods: {
			handleTransferShow() {
				this.transferShow = true
			},
			handleChange(value, direction, movedKeys) {
        		// console.log(value, direction, movedKeys);
      		},
			transferShowContent() {

			},
			submit () {
    			// console.log(this.$refs.text.value)
  			},
  			handleRemove(file, fileList) {
      		  // console.log(file, fileList);
      		},
      		beforeupload(file){
      			// console.log(file)
      		},
      		handlePreview(file) {
      		  // console.log(file);
      		},
      		handleExceed(files, fileList) {
      		  this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      		},
      		beforeRemove(file, fileList) {
      		  return this.$confirm(`确定移除 ${ file.name }？`);
      		}
		},
		components: {
    		quillEditor
  		}
	}
</script>
<style lang="scss">
*::-webkit-scrollbar{
   display:none;
}
.articleEdit-container {
	position:relative;
	background: #fff;
	padding:45px 30px 2px;

	.el-container {

		.el-main {
			overflow:hidden;
			background: #fff;
			padding: 20px 15px 20px;

		}
		.el-aside {
			text-align: right;
			line-height: 70px;

			background: #fff;

		}
	}
	.articleEdit-title {
		.el-aside:before {
			content:'*';
			color:red;
		}
		.el-main {
			.el-input {
       			width: 300px;
			}
			input {
				height: 30px;
			}
		}
	}
	.articleEdit-class {
		.el-main {
			.el-input {
       			width: 300px;
			}
			input {
				height: 30px;
			}
			.el-select__caret el-input__icon el-icon-arrow-up {
				height: 30px;
			}
			.el-input__icon {
				line-height: 34px;
			}
		}

	} 
	.articleEdit-content {
		.el-aside:before {
			content:'*';
			color:red;
		}
		.el-main {
			.ql-toolbar.ql-snow + .ql-container.ql-snow {
				height: 400px;
			}
			.myQuillEditor {
				position: relative;
			}
			.el-button {
				height: 30px;
				line-height: 0;
				position:absolute;
				bottom:23px;
				right:35px;			
			}
		}
	}
	.articleEdit-confirm-btn {
		padding-left: 113px;
		.el-button {
			margin-top:50px;
			height: 35px;
			line-height: 13px;
			width:140px;
		}
	}
	.articleEdit-attachment {
		.el-button {
			border-color: black;
		}
	}
	.articleEdit-permission {
		.el-aside:before {
			content:'*';
			color:red;
		}
		.el-main {
			input {
				width: 400px;
				height: 30px;
			}
			&>.el-input {
       			width: 300px;

				.el-input__inner{
					cursor: pointer;	

				}
			}
			.transf-info {
				position: absolute;
				width: 500px;
				background:#fff;
				bottom:116px;
				#header {
					background: #eee;
					height: 45px;
					line-height: 45px;
					text-align: center;
				}

				.el-transfer {
					.el-transfer-panel__header {
						display: none;
					}
					.el-transfer-panel {
						width: 221px;
						border-radius: 0;
					}
					.el-transfer__buttons {
						padding: 0 10px;
					}


				}
				
			}
			
		}
		.articleEdit-btn {
			margin-top:20px;
			text-align: center;

		}

	}
	.articleEdit-sync {
		p {
			display: inline-block;
			padding-left: 50px;
			span {
				color: red;
			}
		}
		p:before {
			content:'*';
			color:red;
		}
	}
	&>P {
		padding-left: 58px;
		color: #aaa;
	}
}	
</style>
