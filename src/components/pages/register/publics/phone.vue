<!--@description: 手机号选择
	@author: 刘钰
    @update: 刘钰(2019-05-09 11:15) -->
<template>
	<div class="phoneReg">
		<div v-if="value" >
			<el-select v-model="phoneNumber" :disabled="disabPhone">
				<el-option
					v-for="item in options"
					:key = "item.label"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select>		
		</div>
		<div v-else>
			<el-select v-model="option" :disabled="disabPhone">
				<el-option
					v-for="item in options"
					:key = "item.label"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select>		
		</div>
	</div>
</template>

<script>
  	export default {
		props:['phoneNumber','disabPhone','value'],
		data() {
			return {
				options:[{
					label: "86",
					value: "86",
					},{
					label: "87",
					value: "87",
					},{
					label: "88",
					value: "88",
					},{
					label: "89",
					value: "89",
					},
				],
				option:'86',
				
				// value: ""
				
			}
		},
		watch: {
			phoneNumber:function(val, oldval){
				this.options.label = oldval;
			}
		},
  }
</script>
<style lang="scss">
.phoneReg{
	.el-select {
		width:80px;
		
	}
	.el-select .el-input.is-disabled .el-input__inner {
		color: black;
	}	
}


</style>