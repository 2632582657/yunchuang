<!--@description: 通讯录
	@author: 刘钰
    @update: 刘钰(2019-06-12 10:27) -->
<template>
  <div class="addressBox">
    <el-transfer
      ref="showLabel"
      class="address"
      v-model="value"
      filterable
      :data="data"
      :titles="['选择', '已选']"
      :props="{
				key: 'userId',
				label:'userName',
			}"
      @left-check-change="notCheck"
      @right-check-change="hasCheck"
    >
      <input type="text" autocomplete="off" placeholder="请输入搜索内容" class="el-input__inner">
      <span slot-scope="{ option }" class="photo">
        <img :src="option.headUrl" alt v-if="option.headUrl">
        <img
          src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3987282417,3624059467&fm=26&gp=0.jpg"
          alt
          v-else
        >
        <!-- <span>{{option.headUrl}}</span>  -->
        <span>{{ option.userName}}</span>
      </span>
    </el-transfer>
    <div class="confirm">
      <el-button type="primary" @click="selectedMember">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isSingular: {
      //单选还是多选
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      data: [], //所有人员
      value: [] //已选择人员
    };
  },
  computed: {
    checked: function() {
      return this.$refs.showLabel.targetData;
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    notCheck(value, direction) {
      this.value = this.value.concat(value);
    },
    hasCheck(value, direction, movedKeys) {
      value.map((item, index, arr) => {
        var a = this.value.indexOf(item);
        this.value.splice(a, 1);
      });
    },
    //获取公司人员
    getUser() {
      this.$http({
        method: "get",
        url: "/oaManage/v1/oa/users"
      })
        .then(res => {
          // console.log(res.data)
          if (res.data.sysCode == 200 && res.data.code == 200) {
            this.data = res.data.data.userList;
            this.value.push();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //选中审批人
    selectedMember() {
      if (this.isSingular && this.value.length > 1) {
        this.$message.warning('只能选择一位审批人');
        return;
      } else {
        this.value = [];
        this.$emit("takeMember", this.checked, false);
      }
    },
    //关闭蒙层
    cancel() {
      this.value = [];
      this.$emit("cancel");
    }
  }
};
</script>
<style lang="scss">
.addressBox {
  .address {
    .el-transfer-panel {
      width: 280px;
    }
    .el-checkbox.el-transfer-panel__item {
      width: 150px;
      height: 38px;
    }
    .photo {
      width: 30px;
      display: block;
      img {
        width: 100%;
        float: left;
      }
      & > span {
        margin-left: 10px;
      }
    }
    .el-transfer__buttons .el-transfer__button {
      display: none;
    }
  }
  .confirm {
    text-align: center;
    padding: 20px 0px;
    .el-button {
      width: 110px;
    }
    .el-button.el-button--primary {
      margin-right: 60px;
    }
  }
}
</style>
