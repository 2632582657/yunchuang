<template>
	<div class="dataExports-container">		
		<div class="btn-box">
        <el-button  class="export-btn" @click="locationHref()">数据导出</el-button>
       <el-button class="record-btn" type="primary" @click="locationToRecord()">数据导出记录</el-button>
		</div>
		<div class="table">
			<template>
   				<el-table
   					:header-cell-style="tableHeaderColor"
   					:cell-style="setBorder"
   				  	:data="tableData"
   				  	style="width: 100%">
   				  	<el-table-column
   					align=center   				  
   				    prop="address"
   				    label="导出文件名">
   				  	</el-table-column>
   				  	<el-table-column
   					align=center
   				    prop="name"
   				    label="导出人员"
   				    width="180">
   				  	</el-table-column>
   				  	<el-table-column
   					align=center
   				    prop="date"
   				    label="导出时间"
   				    width="180">
   				  	</el-table-column>
   				  	<el-table-column
   					align=center
   				    prop="down"
   				    label="操作"
   				    width="180">
   				    	<template slot-scope="scope">
   				    		<el-button type="text" @click="downLoad( scope.$index, scope.row)">
   				    		下载
   				    		</el-button>
   				    	</template>
   				  	</el-table-column>
   				</el-table>
  			</template>
		</div>
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
          currentPage4: 4,
          tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            down:''
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
            down:''

          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
            down:''

          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
            down:''

          }]
        }
      },
      methods: {
      	tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      		if (rowIndex === 0) {
        		return 'background-color: #eee;border-color:black;'
      			}
      	},
      	setBorder({row, column, rowIndex, columnIndex}) {
      		return 'border-color:black;'
      	},
      	// downLoad(index,data) {
      	// 	// console.log(index)
      	// 	// console.log(data)
      	// },
        //跳转汇报汇总页面
        locationHref() {
          this.$router.push({name:'reportManage'})
        },
        //跳转数据导出页面
        locationToRecord() {
          this.$router.push({name:'dataExports'})
          // console.log(dataExports)

        },

        // 分页处理函数
              handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
      }
      }
	}
</script>
<style lang="scss">
.dataExports-container {
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
		margin-bottom: 40px;
	}
	.table {
	}
	.el-table {
		border: 1px solid black;
		border-right: none;
		th {
			border-right:1px solid black;
		}
		td {
			border-right:1px solid black;
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
