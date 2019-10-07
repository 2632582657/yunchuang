<template>
		<el-cascader
			:options="locations"
			:show-all-levels="false"
			v-model="locationValue"
			filterable
			ref="locationValue"
		></el-cascader>
</template>

<script>
	export default { 
		data() {
			return {
				ssoManager:'ssoManager',
				locations:[], //地区手机号数据
				locationValue:["常用","+86"],//手机号归属地
			}
		},
		watch: {
			locationValue:function(val,oldval){
				this.$emit('location' , val[1]);
			}
		},
		methods: {
			//向后台请求地区数据
			getLocation(){
				this.$http({
					method:"get",
					url: this.ssoManager + "/v1/user/base/reg/phoneLocation",
					// url:"/v1/user/base/reg/phoneLocation",
				}).then(res => {
					this.locations = res.data.data.phoneLocation;
					for(var i = 0;i < this.locations.length ; i++){
						this.locations[i].value = this.locations[i].groupName;
						this.locations[i].label = this.locations[i].groupName;
						this.locations[i].children = this.locations[i].countryDetailList;
						for(var j = 0; j < this.locations[i].children.length; j++){
							this.locations[i].children[j].value = this.locations[i].children[j].phoneNumberPrefix;
							this.locations[i].children[j].label = this.locations[i].children[j].countryName;
						}
					}
				})
			}
		},
		mounted() {
			this.getLocation()
		},
	};
</script>
