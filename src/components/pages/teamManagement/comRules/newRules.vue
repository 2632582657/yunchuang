<template>
	<div class="newRules-container">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  			<el-form-item label="文章标题:" prop="name">
  			  <el-input v-model="ruleForm.name"></el-input>
  			</el-form-item>
  			<el-form-item label="所属分类:" prop="valued">
    			<template>
  					<el-select v-model="ruleForm.valued" placeholder="请选择">
  					  <el-option
  					    v-for="item in options"
  					    :key="item.value"
  					    :label="item.label"
  					    :value="item.value">
  					  </el-option>
  					</el-select>
				</template>
  			</el-form-item>
			<el-form-item label="文章内容:" prop="content">
				<quill-editor ref="text" v-model="ruleForm.content" class="myQuillEditor" :options="editorOption" />
  			</el-form-item>
  			<el-form-item label="附件:" prop="fileListAttachment" class="newRules-attachment">
  				<span class="el-icon-paperclip" style="position:absolute;top:12px;"></span>
  				<el-upload
  					class="upload-demo"
  					action="https://jsonplaceholder.typicode.com/posts/"
  					:on-preview="handlePreview"
  					:on-remove="handleRemove"
  					:before-remove="beforeRemove"
  					multiple
  					:limit="3"
  					:on-exceed="handleExceed"
  					:file-list="ruleForm.fileListAttachment"
  					>
  					<el-button size="small" type="plain">点击上传</el-button>
  					<div slot="tip" class="el-upload__tip">支持.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.zip类型文件，单文件最大支持20M</div>
				</el-upload>
  			</el-form-item>
			<el-form-item label="对谁可见:" prop="input">
				<div @click="handleTransferShow">
  					<el-input v-model="ruleForm.input"></el-input>
  				</div>
  			</el-form-item>
			<div class="comRuleList-movetabel" v-show="transferShow">
      			<p>
      			  选择部门人员
      			  <!-- <span class="el-icon-close" @click.stop="()=>{transferShow=false}"></span> -->
      			</p>
        		<div style="overflow:hidden;">
                	<div class="movetabel-content">
        			<p>选择部门人员</p>
        			<template>
        	<div style="width:400px;height:450px;overflow:scroll;border:1px solid #bbb;border-radius:10px;padding:20px 10px;text-align:center;box-sizing:border-box;">
        	<el-input
			  placeholder="输入关键字进行过滤"
			  v-model="filterText">
			</el-input>
			
			<el-tree
			  class="filter-tree"
			  :data="data"
			  node-key="id"
			  :props="defaultProps"
			  default-expand-all
			  show-checkbox
			  check-strictly
			  :filter-node-method="filterNode"
			  @check-change="handleNodeClick"
			  check-on-click-node
			  ref="tree"
			  style="padding-left:55px;padding-top:20px;">
			</el-tree>
                	<el-button @click="setCheckedKeys">通过 key 获取</el-button>

        	</div>
        			</template>
              		</div>
              		<div class="movetabel-class" >
                		<p>已选择</p>
                		<div style="border:1px solid 	#bbb;width:400px;height:450px;border-radius:10px;padding:20px 	10px;box-sizing:border-box">
                		<template v-for="(item,index) in choice" >
                			<div class="el-icon-user" style="width:100%;height:50px;line-height:50px;overflow:hidden;font-size:18px;background:pink;margin-bottom:10px;">
                  				{{item.label}}({{item.la}})
                  			<span class="el-icon-close" style="float:right;line-height:50px;font-size:18px;" @click="del(item,index)"></span>
                		</div>
                	</template>
                </div>
            </div>
        </div>
        <div class="movetabel-btn-box">
          <el-button type="success" @click.stop="commit">确认</el-button>
          <el-button @click.stop="()=>{transferShow=false}">取消</el-button>
        </div>
  </div>


			<el-form-item label="缩略图:" prop="fileList">
				<el-upload
					class="upload-demo"
					action="https://jsonplaceholder.typicode.com/posts/"
					:on-preview="handlePreviewphoto"
					:on-remove="handleRemovephoto"
					list-type="picture"
					:file-list="ruleForm.fileList">
					<el-button size="small" type="plain">上传图片</el-button>
					<div slot="tip" class="el-upload__tip"></div>
				</el-upload>
  			</el-form-item>
  			<el-form-item label="" prop="resource">
				<div class="newRules-sync">
				<p>是否同步在<span>APP</span>主页:</p>
    			<el-radio-group v-model="ruleForm.resource">
  					<el-radio label="是"></el-radio>
  					<el-radio label="否"></el-radio>
   				 </el-radio-group>
				</div>
				<P>同步后，公司员工可在APP中消息>主页>企业制度中查看您发布的该制度</P>
  			</el-form-item>
			<el-form-item class="newRules-confirm-btn">
			    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
			    <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
			</el-form-item>
		</el-form>

		
		
		


	</div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
	export default {
		data() {

			return {
				filterText: '',//存储筛选出的信息
        data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },

		choice:[],//接受弹窗中右侧已选择的数据
		arr:[],//过滤设置弹窗做出被选择的复选框
		ruleForm: {
          name: '',
          resource: '',//接受选择同步
          valued:'',//所属分类
          content:'',//文章内容
		  input : '',//对谁可见的内容
		  fileListAttachment:[],//附件
		  fileList:[]//缩略图
        },
        rules: {
          name: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          valued: [
            { required: true, message: '请选择活所属分类', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          input: [
            { required: true, message: '请选择对谁可见', trigger: 'change' }
          ],
          content: [
            { required: true, message: '请填写文章内容', trigger: 'blur' }
          ]
      },
				radio: '是',
				transferShow:false,//穿梭框显示开关
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
        			        // data: generateData(),
        value: []
        			// renderFunc(h, option) {
          	// 			return <span>{ option.key } - { option.label }</span>;
        			// }

			}
		},
		methods: {
			// 获取数据列表进行把父级名字添加到最终选择人员的属性上
		getCheckedNodes() {
        	this.data.forEach((item,index)=> {
        		this.getlun(item)
        	})
      	},
     	getlun(item) {
       		const label = item.label
      		if(item.children){
      			item.children.forEach((item,index)=> {
        				item.la = label
        				this.getlun(item)
        		})
      		}
      	},


 getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      },

      	 setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([5,10]);
      },
      	// 重置部门选择
      	resetChecked() {
      	  this.$refs.tree.setCheckedKeys([])
      	  this.choice=[]
      	},
      	// 选择人员的时候触发的处理函数
		handleNodeClick(node,state) {
      	  if(state) {
      	  	this.getCheckedNodes()
      	  	this.choice=this.$refs.tree.getCheckedNodes()
      	  }else {
      	  	this.choice=this.$refs.tree.getCheckedNodes()
      	  }
      	},
		//删除已经选择的部门人员
		del(item,index){
			this.choice.splice(index,1)
			this.arr=this.$refs.tree.getCheckedKeys()
			const i = this.$refs.tree.getCheckedKeys().forEach((item,i)=> {
				if(item = item.id){
					return i
				}
			})
			this.$refs.tree.setCheckedKeys(this.arr);
		},
		//表单提交按钮
		submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	// 成功后向接口请求发送数据
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 表单数据重置处理
      // resetForm(formName) {
      //   this.$refs[formName].resetFields();
      // },
      // ==图片上传处理和文件上传处理
		handleTransferShow() {
				this.transferShow = true
		},
		handleChange(value, direction, movedKeys) {
        		console.log(value, direction, movedKeys);
      	},
		transferShowContent() {

		},
		submit () {
    			console.log(this.$refs.text.value)
  		},
  		// 删除处理
  		handleRemove(file, fileList) {
      	  console.log(file, fileList);
      	},
      	handleRemovephoto(file, fileList) {
      	  console.log(file, fileList);
      	},
      	// 预览处理
      	handlePreview(file) {
      	  console.log(file);
      	},
      	handlePreviewphoto(file) {
      	  console.log(file);
      	},
      	// 点击文件列表中已经上传文件的处理函数
      	handleExceed(files, fileList) {
      	  this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      	},
      	// 文件移除前的处理
      	beforeRemove(file, fileList) {
      	  return this.$confirm(`确定移除 ${ file.name }？`);
      	},
      	//过滤处理方法
      	filterNode(value, data) {
        	if (!value) return true;
        	// console.log(data)
        	// console.log(value)
        	return  data.label.indexOf(value) !== -1;
      	},
      	// 弹窗处理
      	commit() {
			// =====这里需要把弹框的选择的处理传到一个位置
			if(this.choice.length > 0 && this.choice.length==1) {
				this.ruleForm.input = this.choice[0].label
			}else if(this.choice.length >1) {
				this.choice.forEach((item)=> {
					this.ruleForm.input += item.label+','
				})
			}
			this.ruleForm.input=this.ruleForm.input.substring(0,this.ruleForm.input.length-1);
			this.transferShow=false

			// console.log(this.choice)
			// console.log(this.text)
			
      	}

		},
	watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
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
.newRules-confirm-btn {
	margin-bottom:20px;
	.el-button {
		width:120px;
	}
}
.newRules-container {
	position:relative;
	background: #fff;
	padding:45px 30px 2px;
	.newRules-attachment {
		margin-top:36px;
		overflow:hidden;
		position:relative;
		vertical-align:middle;
		.upload-demo {
			padding-left:17px;
		}
		span {
			display:inline-block;
			margin-left:17px;
			color:#4278BE;
		}
		.el-button {
			padding:0;
			border:none;
			color:#4278BE;
			border-color: black;
			span {
				margin-left:20px;
			}
		}
		.el-upload__tip {
			color:#909399;
		}
	}
	.el-input {
       	width: 300px;
		.el-input__inner{
			cursor: pointer;
		}
	}
	.ql-toolbar.ql-snow + .ql-container.ql-snow {
		height: 400px;
	}
	.myQuillEditor {
		position: relative;
	}
	.el-select__caret el-input__icon el-icon-arrow-up {
		height: 30px;
	}
	.el-input__icon {
		line-height: 34px;
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
		.newRules-btn {
			margin-top:20px;
			text-align: center

		}

	}
	.newRules-sync {
		p {
			display: inline-block;
			padding-left:0;
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
.comRuleList-movetabel {
  position:absolute;

  top:45%;
  left:55%;
  transform:translate(-50%,-50%);
  z-index:9999;
  box-shadow:0px 0px 1px;
  overflow:hidden;
  width:960px;
  height:759px;
  border-radius:6px;

  background:rgba(255,255,255,1);
  &>p {
    width:100%;
    height:72px;
    line-height:72px;
    text-align:center;
    
    padding-left:35px;
    padding-right:22px;
    background:#F8F8F8;
    font-size:18px;
    color:#303133;
    span {
      line-height:72px;
      display:inline-block;
      font-size:18px;
      color:#303133;
    }

  }
  .movetabel-content {
    position:relative;
    float:left;
    display:inline-block;
    width:484px;
    height:550px;
    background:#fff;
    padding-left:22px;
    padding-right:16px;
    box-sizing:border-box;
    &>P {
      height:54px;
      line-height:54px;
      padding-left:13px;
    }
    .el-table {
      width:446px;
      height:450px;
     
    }
    .el-pagination {
      position:absolute;
      bottom:0;
      right:12px;
      padding-right:0;
    }
  }
  .movetabel-class {
    float:left;
    width:400px;
    height:450px;
    background:#fff;
    &>p {
      height:54px;
      line-height:54px;
      text-align:left;
      padding-left:17px;
    }
    &>div {
      height:448px;
    border:1px solid rgba(237,239,242,1);

    }
    .el-tree {
      width:426px;
    }
  }
  .movetabel-btn-box {
    height:95px;
    line-height:95px;
   text-align:center;
    .el-button {
      width:129px;
      height:36px;
      font-size:14px;
      border-radius:3px;
      &:first-child {
      	background:#4278BE;
        color:#fff;
        
      }
      &:last-child {
        color:#4278BE;
        border-color:#4278BE;
      }

    }
  }
  
}
.el-tree-node {

  .is-leaf + .el-checkbox .el-checkbox__inner{
    display: inline-block;
  }
  .el-checkbox .el-checkbox__inner{
	display: none;
  }

}
</style>
