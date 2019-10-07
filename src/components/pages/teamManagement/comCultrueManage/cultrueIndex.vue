<template>
	<div class="cultrueIndex-container">
		<div class="cultrueIndex-main">
			<el-container>
  				<el-aside width="200px">
  					<p>
  						<span class="cultrue-icon">公司文化</span>
  						<span class="el-icon-s-tools" @click="showTool"></span>
  					</p>
  					<div class="edit-aside-more" v-show="toolFlag">
  						<el-button type="primary" icon="el-icon-edit" @click="()=> {$router.push({name:'articleEdit'})}">编辑栏目</el-button>
  						<el-button type="danger" icon="el-icon-delete" @click="open">删除栏目</el-button>
  					</div>
  					<div class="cultrueIndex-order">
  						<span>排序</span>
  						<span>
  							<el-input v-model="input" placeholder="请输入内容"></el-input>
  						</span>
  					</div>
  				</el-aside>
  				<el-main>
  					<quill-editor ref="text" v-model="content" class="myQuillEditor" :options="editorOption" />
  				</el-main>
			</el-container>
			<el-button type="primary" @click="showColumu">增加栏目</el-button>
			<div class="cultrueIndex-btn-box">
				<el-button type="primary" @click="showColumu">提交</el-button>
				<el-button type="info" @click="showColumu">预览</el-button>
			</div>
		</div>
		<div class="cultrueIndex-column" v-show="columeFlag">
			<div class="cultrueIndex-column-title">
				新增/编辑栏目
				<span class="cultrueIndex-column-close" @click="hideColumu"></span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"> 
       
             
                <el-form-item label="栏目名称" prop="name"> 
                  <el-input v-model="ruleForm.name"></el-input> 
                </el-form-item >
                  <el-form-item class="cultrueIndex-column-submit">
                  <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                  <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
                </el-form-item>
        </el-form>
		
			
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
    	return {
    		//存储右侧弹窗信息
    		ruleForm: {
          	name: ''
       			},
       		rules: {
       		  name: [
       		    { required: true, message: '请输入活动名称', trigger: 'blur' },
       		    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
       		  ]
       		},
    		//侧边栏排序输入框
      		input: '',
      		columeFlag:false,//右侧边栏开关
      		toolFlag:false,//富文本做出工具按钮
      		// 富文本
      		content: '',
    		text: '',
    		//右侧栏目弹窗信息
    		editorOption: {}
    	}
  	},
  	methods: {
  		submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
            // 这里是请求接口发送数据在页面重新请求在获取数据
            // =========这里是两步请求
          	this.hideColumu()//隐藏弹窗在请求后
            // 
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // resetForm(formName) {
      //   this.$refs[formName].resetFields();
      // },
  		showColumu() {
  			this.columeFlag = true
  		},
  		hideColumu() {
  			this.columeFlag = false

  		},
  		showTool() {
  			this.toolFlag = !this.toolFlag
  		},
  		      	//这是删除按钮提示
     	open() {
        this.$confirm('确定删除该制度数据吗？', '', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: ''
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
  	},
  	components: {
    		quillEditor
  		}
}
</script>
<style lang="scss">
.cultrueIndex-container {
	position:relative;
	padding:45px 30px 2px;
	background: #fff;
	height: 720px;
	.el-aside {
		background: #fff;
		text-align:center;
		padding-right: 15px;
	}
	.el-main {
		padding-left:0;
		background: #fff;
		.ql-toolbar.ql-snow + .ql-container.ql-snow {
			height: 400px;
		}
	}
	.cultrueIndex-main {
		position:relative;
		.cultrue-icon:before {
				content:'*';
				color:red;
		}
		.el-icon-s-tools {
			font-size:18px;
			vertical-align:bottom;
		}
		.edit-aside-more {
			background:pink;
			position:absolute;
			top: 70px;
			left:30px;
			display: inline-block;
			.el-button {
				text-shadow:0px 0px 1px;
				background:#fff;
				border:none;
				margin:0;
				display:block;
				border-radius:0;
				&:first-child {
					color: #409EFF;
				}
				&:last-child {
					color: #F56C6C;
				}
			}
		}
		.cultrueIndex-order {
			margin-top:10px;
			.el-input {
				width:65px;
				input {
					height: 30px;
					text-align: center;
				}
			}
		}
		&>.el-button {
			margin-top:20px;
			width: 145px;
		}
		.cultrueIndex-btn-box {
			position: absolute;
			bottom: -170px;
			padding-left: 150px;
			.el-button {
				width: 150px;
			}
		}
	}


	.cultrueIndex-column {
		border: 1px solid #eee;
		position:fixed;
		background:#fff;
		top:0px;
		right:0px;
		width: 500px;
		height: 100%;
		.el-form-item {
			  margin-top:20px;
			  .el-input {
			    width:300px;
			  }
			}
		.cultrueIndex-column-title {
			height: 50px;
			padding-left: 40px;
			line-height:50px;
			border-bottom: 1px solid #eee;
			.cultrueIndex-column-close {
				position:absolute;
				top: 10px;
				right:10px;
				display:inline-block;
				width: 24px;
				height: 24px;
				transform: rotate(45deg);
				&:before {
					content:'';
					width:2px;
					height:24px;
					background:#bbb;
					display:inline-block;
					position:absolute;
					right:50%;
					transform:translateX(50%);

				}
				&:after {
					position:absolute;
					top:50%;
					content:'';
					height:2px;
					width:24px;
					background:#bbb;
					display:inline-block;
					transform:translateY(-50%);


				}
			}
		}

		.cultrueIndex-column-submit {
			width: 100%;
			position:absolute;
			bottom:0;	
			text-align:right;
			border-top:1px solid #eee;
			.el-button {
				margin-top:10px;
				margin-right:20px;
				margin-bottom:10px;

				width:150px;
			}
		}

	}


}
	
</style>
