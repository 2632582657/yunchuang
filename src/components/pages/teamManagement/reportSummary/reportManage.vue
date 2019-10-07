<template>
	<div class="report-manage-container">
		<div class="btn-box">
			<el-button type="primary" class="export-btn" @click="locationHref()">数据导出</el-button>
			<el-button class="record-btn" @click="locationToRecord()">数据导出记录</el-button>
		</div>
		<p class="prompt-info">
			<i>⭐</i>
			仅支持查询和导出管理范围内的日志内容
		</p>
		<div class="input-info">
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
 
  				<el-form-item label="汇报类型">
  				  <el-select v-model="formInline.region" placeholder="全部" class="report-class">
  				    <el-option label="日报" value="day"></el-option>
  				    <el-option label="周报" value="week"></el-option>
  				    <el-option label="月报" value="month"></el-option>
  				    <el-option label="全部" value="all"></el-option>
  				  </el-select>
  				</el-form-item>
  				<div class="block">
    				<span class="demonstration">提交日期</span>
    				<el-date-picker
    				  v-model="value1"
    				  type="daterange"
    				  range-separator="至"
    				  start-placeholder="开始日期"
    				  end-placeholder="结束日期">
    				</el-date-picker>
 				</div>
  				<el-form-item label="提交人">
  				  <el-input v-model="formInline.user" placeholder="请输入提交人" class="prompt-person"></el-input>
  				</el-form-item>
  				<el-form-item>
  				  <el-button type="primary" @click="onSubmit">查询</el-button>
  				  <el-button type="primary" @click="onExport">导出</el-button>
  				</el-form-item>
			</el-form>
		</div>
		<template>
			<div class="report-summary-table">
				<el-table
				border
   				ref="multipleTable"
   				:data="tableData"
   				:row-class-name="tableRowClassName"
   				tooltip-effect="dark"
   				style="width: 100%"
   				@selection-change="handleSelectionChange">
   				<el-table-column

				  align="center"
   				  type="selection"
   				  width="40">
   				</el-table-column>
   				<el-table-column
				  align="center"
   				  label="提交人"
   				  width="120">
   				  <template slot-scope="scope">{{ scope.row.date }}</template>
   				</el-table-column>
   				<el-table-column
				  align="center"
   				  prop="name"
   				  label="所属部门"
   				  width="120">
   				</el-table-column>
   				<el-table-column
				  align="center"
   				  prop="address"
   				  label="提交时间"
   				  >
   				</el-table-column>
   				<el-table-column
				  align="center"
   				  prop="people"
   				  label="汇报接收人"
   				  width="120">
   				</el-table-column>
   				<el-table-column
				  align="center"  				
   				  prop="type"
   				  label="汇报类型"
   				  width="120">
   				</el-table-column>
  			</el-table>
			</div>
<!--   			<div style="margin-top: 20px">
    			<el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
    			<el-button @click="toggleSelection()">取消选择</el-button>
  			</div> -->
		</template>	
		<template>
			<div class="block report-page">
    			<el-pagination
    			  @size-change="handleSizeChange"
    			  @current-change="handleCurrentChange"
    			  :current-page="currentPage4"
    			  :page-sizes="[100, 200, 300, 400]"
    			  :page-size="100"
    			  layout="total, sizes, prev, pager, next, jumper"
    			  :total="400">
    			</el-pagination>
  			</div>
		</template>
	</div>
</template>
<script>
export default {
	data() {
      	return {
          currentPage4:4,
        	formInline: {
          user: '',
          region: ''
        	},
        	tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          people: '',
          type:'日报'
        	}, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          people: '',
          type:'日报'
        	}, {
        	  date: '2016-05-04',
        	  name: '王小虎',
        	  address: '上海市普陀区金沙江路 1518 弄',
        	  people: '',
        	  type:'日报'
        	}],
        	multipleSelection: [],
        	      		pickerOptions: {
        	  shortcuts: [{
        	    text: '最近一周',
        	    onClick(picker) {
        	      const end = new Date();
        	      const start = new Date();
        	      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        	      picker.$emit('pick', [start, end]);
        	    }
        	  }, {
        	    text: '最近一个月',
        	    onClick(picker) {
        	      const end = new Date();
        	      const start = new Date();
        	      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        	      picker.$emit('pick', [start, end]);
        	    }
        	  }, {
        	    text: '最近三个月',
        	    onClick(picker) {
        	      const end = new Date();
        	      const start = new Date();
        	      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        	      picker.$emit('pick', [start, end]);
        	    }
        	  }]
        		},
        		value1: '',
        		value2: ''
    			
      	}
    },
    methods: {
              //跳转汇报汇总页面
        locationHref() {
          this.$router.push({name:'reportManage'})
        },
        //跳转数据导出页面
        locationToRecord() {
          this.$router.push({name:'dataExports'})
          // console.log(dataExports)

        },
      onSubmit() {
        console.log('submit!');
      },
      onExport() {
      	console.log('export!');
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 1;
        } else if (rowIndex === 3) {
          return 2;
        }
        return '';
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
      // 
 
      // toggleSelection(rows) {
      //   if (rows) {
      //     rows.forEach(row => {
      //       this.$refs.multipleTable.toggleRowSelection(row);
      //     });
      //   } else {
      //     this.$refs.multipleTable.clearSelection();
      //   }
      // },
      // handleSelectionChange(val) {
      //   this.multipleSelection = val;
      // }
    }
  

}
</script>
<style lang="scss">
.report-manage-container {
	position: relative;
	background:#fff;
	height: 715px;
	padding:30px 30px 10px;
	.export-btn {
		width:120px;
	}
	.record-btn {
		width:120px;
	}
	.btn-box {
		margin-bottom: 20px;
	}
	.prompt-info {
		display:block;
	}
	.input-info {
		margin: 8px 0 15px;
		padding-left: 10px;
		.el-form-item {
			margin-right: 30px;
		}
		.el-form-item:last-child {
			margin-right: 0;
		}
		.report-class {
			width: 120px;
		}
		.block {
			display: inline-block;
			margin-right: 35px;
			.el-range-editor.el-input__inner {
				width: 230px;

			}
		}

		.prompt-person {
			width: 150px;
		}
	}
	.report-summary-table {
		width: 100%;


	}
	.el-table {
		.primary-row {
    		background: #f5f7fa;
  		}
	}

	.report-page {
		width: 100%;
		height: 50%;
		display:block;
		text-align: center;
		.el-pagination {
			position: absolute;
			left: 50% ;
			bottom: 10px;
			transform: translateX(-50%);
		}

	}
}
</style>
